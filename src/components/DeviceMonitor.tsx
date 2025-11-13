import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Trash2,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface DeviceMonitorProps {
  open: boolean
  onClose: () => void
}

interface LogEntry {
  id: string
  timestamp: Date
  level: 'debug' | 'info' | 'warning' | 'error'
  component: string
  message: string
}

interface DeviceStatus {
  connected: boolean
  ip?: string
  uptime?: number
  freeHeap?: number
  version?: string
  lastUpdate?: Date
}

interface SensorData {
  id: string
  name: string
  value: number
  unit: string
  timestamp: Date
}

export default function DeviceMonitor({ open, onClose }: DeviceMonitorProps) {
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    connected: false,
  })
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [sensors, setSensors] = useState<SensorData[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [selectedPort, setSelectedPort] = useState<string>('')
  const [serialPorts, setSerialPorts] = useState<string[]>([])
  const [logFilter, setLogFilter] = useState<string>('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const { toast } = useToast()
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      loadSerialPorts()
      // Simulate live data for demonstration
      startSimulation()
    }
    return () => {
      stopSimulation()
    }
  }, [open])

  useEffect(() => {
    if (!isPaused) {
      scrollToBottom()
    }
  }, [logs, isPaused])

  const loadSerialPorts = async () => {
    try {
      const result = await window.electronAPI.serial.list()
      if (result.success && result.ports.length > 0) {
        setSerialPorts(result.ports)
        setSelectedPort(result.ports[0])
      } else {
        setSerialPorts([])
        toast({
          title: 'No Devices Found',
          description: 'No serial ports detected. Connect a device and refresh.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Failed to load serial ports:', error)
    }
  }

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  let simulationInterval: any = null

  const startSimulation = () => {
    // Simulate connection
    setTimeout(() => {
      setDeviceStatus({
        connected: true,
        ip: '192.168.1.100',
        uptime: 3600,
        freeHeap: 45000,
        version: '2024.1.0',
        lastUpdate: new Date(),
      })

      addLog('info', 'wifi', 'WiFi connected - IP: 192.168.1.100')
      addLog('info', 'main', 'ESPHome version 2024.1.0 compiled')
      addLog('debug', 'sensor', 'DHT22 initialized on GPIO4')
    }, 1000)

    // Simulate periodic logs
    simulationInterval = setInterval(() => {
      if (!isPaused) {
        // Random log entry
        const logTypes = [
          { level: 'debug' as const, component: 'sensor', message: 'Reading temperature sensor...' },
          { level: 'info' as const, component: 'mqtt', message: 'Published state update' },
          { level: 'debug' as const, component: 'binary_sensor', message: 'Motion detected: OFF' },
          { level: 'warning' as const, component: 'sensor', message: 'Temperature reading seems high: 28.5°C' },
        ]
        const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)]
        addLog(randomLog.level, randomLog.component, randomLog.message)

        // Random sensor update
        if (Math.random() > 0.7) {
          updateSensor('temperature', 'Temperature', 20 + Math.random() * 10, '°C')
        }
        if (Math.random() > 0.8) {
          updateSensor('humidity', 'Humidity', 40 + Math.random() * 30, '%')
        }

        // Update device status
        setDeviceStatus(prev => ({
          ...prev,
          uptime: prev.uptime ? prev.uptime + 2 : 0,
          freeHeap: 40000 + Math.floor(Math.random() * 10000),
          lastUpdate: new Date(),
        }))
      }
    }, 2000)
  }

  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval)
    }
  }

  const addLog = (level: LogEntry['level'], component: string, message: string) => {
    const newLog: LogEntry = {
      id: `log_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      level,
      component,
      message,
    }
    setLogs(prev => [...prev, newLog].slice(-200)) // Keep last 200 logs
  }

  const updateSensor = (id: string, name: string, value: number, unit: string) => {
    setSensors(prev => {
      const existing = prev.find(s => s.id === id)
      if (existing) {
        return prev.map(s => s.id === id ? { ...s, value, timestamp: new Date() } : s)
      } else {
        return [...prev, { id, name, value, unit, timestamp: new Date() }]
      }
    })
  }

  const clearLogs = () => {
    setLogs([])
    toast({
      title: 'Logs Cleared',
      description: 'All log entries have been removed',
    })
  }

  const exportLogs = () => {
    const logText = logs.map(log =>
      `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.component}] ${log.message}`
    ).join('\n')

    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `esphome-logs-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'debug':
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-destructive'
      case 'warning': return 'text-yellow-500'
      case 'info': return 'text-blue-500'
      case 'debug': return 'text-muted-foreground'
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(logFilter.toLowerCase()) ||
                          log.component.toLowerCase().includes(logFilter.toLowerCase())
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Device Monitor
          </DialogTitle>
          <DialogDescription>
            Real-time monitoring of connected ESPHome devices
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4" style={{ height: 'calc(95vh - 140px)' }}>
          {/* Sidebar - Device Status */}
          <div className="w-80 shrink-0 space-y-4">
            {/* Connection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {deviceStatus.connected ? (
                    <>
                      <Wifi className="h-4 w-4 text-green-500" />
                      Connected
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4 text-muted-foreground" />
                      Disconnected
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Serial Port</Label>
                  <Select value={selectedPort} onValueChange={setSelectedPort}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select port" />
                    </SelectTrigger>
                    <SelectContent>
                      {serialPorts.map(port => (
                        <SelectItem key={port} value={port}>
                          {port}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={!selectedPort}
                    variant={deviceStatus.connected ? 'destructive' : 'default'}
                  >
                    {deviceStatus.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={loadSerialPorts}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Device Info */}
            {deviceStatus.connected && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Device Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="font-mono">{deviceStatus.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span>{deviceStatus.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span>{formatUptime(deviceStatus.uptime || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Free Heap:</span>
                    <span>{deviceStatus.freeHeap?.toLocaleString()} bytes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span>{deviceStatus.lastUpdate?.toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sensors */}
            {sensors.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Live Sensors</CardTitle>
                  <CardDescription className="text-xs">
                    Real-time sensor values
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-3">
                      {sensors.map(sensor => (
                        <div key={sensor.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{sensor.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {sensor.value.toFixed(1)} {sensor.unit}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Updated: {sensor.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Area - Logs */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Filter logs..."
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      className="h-8"
                    />
                  </div>

                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? (
                      <><Play className="mr-2 h-4 w-4" /> Resume</>
                    ) : (
                      <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportLogs}
                    disabled={logs.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearLogs}
                    disabled={logs.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logs Display */}
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Console Logs</CardTitle>
                  <Badge variant="outline">
                    {filteredLogs.length} / {logs.length} logs
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full">
                  <div className="p-4 font-mono text-xs space-y-1">
                    {filteredLogs.length === 0 ? (
                      <div className="flex h-64 items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Activity className="mx-auto mb-4 h-16 w-16" />
                          <p>No logs yet</p>
                          <p className="text-xs">
                            {deviceStatus.connected
                              ? 'Waiting for device logs...'
                              : 'Connect to a device to start monitoring'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {filteredLogs.map(log => (
                          <div
                            key={log.id}
                            className={`flex items-start gap-2 p-2 rounded hover:bg-muted/50 ${getLevelColor(log.level)}`}
                          >
                            <span className="text-muted-foreground shrink-0">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                            <span className="shrink-0">{getLevelIcon(log.level)}</span>
                            <span className="font-semibold shrink-0">
                              [{log.component}]
                            </span>
                            <span className="flex-1">{log.message}</span>
                          </div>
                        ))}
                        <div ref={logsEndRef} />
                      </>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
              <span>
                {deviceStatus.connected ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Live monitoring active
                  </span>
                ) : (
                  'Not connected'
                )}
              </span>
              <span>
                {isPaused && (
                  <Badge variant="outline" className="text-xs">
                    <Pause className="mr-1 h-3 w-3" />
                    Paused
                  </Badge>
                )}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
