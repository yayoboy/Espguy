import { useState, useEffect } from 'react'
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
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Wifi, RefreshCw, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useBuildHistoryStore } from '@/store/useBuildHistoryStore'

interface OTAUpdateDialogProps {
  open: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

interface DiscoveredDevice {
  name: string
  ip: string
  platform: string
  version?: string
  port: number
}

export default function OTAUpdateDialog({
  open,
  onClose,
  projectId,
  projectName,
}: OTAUpdateDialogProps) {
  const [devices, setDevices] = useState<DiscoveredDevice[]>([])
  const [manualIP, setManualIP] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedDevice, setSelectedDevice] = useState<DiscoveredDevice | null>(null)
  const { toast } = useToast()
  const { addBuild, updateBuild } = useBuildHistoryStore()

  useEffect(() => {
    if (open) {
      scanNetwork()
    }
  }, [open])

  const scanNetwork = async () => {
    setIsScanning(true)
    try {
      // Mock device discovery - in real implementation, this would use mDNS
      // to discover ESPHome devices on the network
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockDevices: DiscoveredDevice[] = [
        {
          name: 'living_room_light',
          ip: '192.168.1.100',
          platform: 'ESP32',
          version: '2024.1.0',
          port: 8266,
        },
        {
          name: 'bedroom_sensor',
          ip: '192.168.1.101',
          platform: 'ESP8266',
          version: '2024.1.0',
          port: 8266,
        },
        {
          name: 'garage_door',
          ip: '192.168.1.102',
          platform: 'ESP32',
          version: '2023.12.0',
          port: 8266,
        },
      ]

      setDevices(mockDevices)
      toast({
        title: 'Scan Complete',
        description: `Found ${mockDevices.length} ESPHome device(s)`,
      })
    } catch (error) {
      toast({
        title: 'Scan Failed',
        description: 'Failed to scan network for devices',
        variant: 'destructive',
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleOTAUpload = async (device: DiscoveredDevice) => {
    const startTime = Date.now()
    setIsUploading(true)
    setUploadProgress(0)
    setSelectedDevice(device)

    // Start build tracking
    const buildId = addBuild({
      projectId,
      projectName,
      type: 'ota',
      status: 'in_progress',
    })

    try {
      // Simulate OTA upload progress
      // In real implementation, this would call the Electron API
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setUploadProgress(i)
      }

      // Mock successful upload
      const success = Math.random() > 0.2 // 80% success rate for demo

      if (success) {
        updateBuild(buildId, {
          status: 'success',
          duration: Date.now() - startTime,
          logs: `OTA upload successful to ${device.name} (${device.ip})`,
        })

        toast({
          title: 'OTA Upload Complete',
          description: `Successfully uploaded firmware to ${device.name}`,
        })
      } else {
        throw new Error('Upload failed - device rejected firmware')
      }
    } catch (error) {
      updateBuild(buildId, {
        status: 'failed',
        duration: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      })

      toast({
        title: 'OTA Upload Failed',
        description: error instanceof Error ? error.message : 'Upload failed',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setSelectedDevice(null)
    }
  }

  const handleManualUpload = () => {
    if (!manualIP) {
      toast({
        title: 'Invalid IP',
        description: 'Please enter a valid IP address',
        variant: 'destructive',
      })
      return
    }

    const device: DiscoveredDevice = {
      name: 'Manual Device',
      ip: manualIP,
      platform: 'Unknown',
      port: 8266,
    }

    handleOTAUpload(device)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>OTA Update</DialogTitle>
          <DialogDescription>
            Upload firmware wirelessly to your ESPHome devices
          </DialogDescription>
        </DialogHeader>

        {/* Scan Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={scanNetwork}
              disabled={isScanning}
              variant="outline"
              className="gap-2"
            >
              {isScanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isScanning ? 'Scanning Network...' : 'Scan Network'}
            </Button>

            <div className="flex-1 flex items-center gap-2">
              <Input
                placeholder="Or enter IP manually (e.g., 192.168.1.100)"
                value={manualIP}
                onChange={(e) => setManualIP(e.target.value)}
                disabled={isUploading}
              />
              <Button
                onClick={handleManualUpload}
                disabled={isUploading || !manualIP}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && selectedDevice && (
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Uploading to {selectedDevice.name} ({selectedDevice.ip})
                  </span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            </Card>
          )}

          {/* Discovered Devices */}
          <div>
            <Label className="mb-2 block">Discovered Devices</Label>
            {devices.length === 0 && !isScanning ? (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <Wifi className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p className="text-sm">No devices found</p>
                  <p className="text-xs mt-1">Click "Scan Network" to discover ESPHome devices</p>
                </div>
              </Card>
            ) : (
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-2 space-y-2">
                  {devices.map((device) => (
                    <Card
                      key={device.ip}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-sm">{device.name}</h4>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>IP: {device.ip}</span>
                            <span>Platform: {device.platform}</span>
                            {device.version && <span>v{device.version}</span>}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleOTAUpload(device)}
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Info Panel */}
          <Card className="bg-blue-500/10 border-blue-500/50 p-4">
            <div className="flex items-start gap-3">
              <Wifi className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">OTA Update Requirements</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Device must be connected to the same network</li>
                  <li>• Device must have OTA enabled in configuration</li>
                  <li>• Device must be powered on and running ESPHome</li>
                  <li>• First upload must be done via USB, subsequent updates can be OTA</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
