import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, AlertTriangle, Check, Zap, Cpu } from 'lucide-react'
import { getPinout, checkPinConflicts, BoardPin } from '@/services/pinout'
import { useEditorStore } from '@/store/useEditorStore'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface PinMapperProps {
  board: string
  onPinSelect?: (pin: string) => void
}

export default function PinMapper({ board, onPinSelect }: PinMapperProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPin, setSelectedPin] = useState<BoardPin | null>(null)
  const { components } = useEditorStore()

  const pinout = useMemo(() => getPinout(board), [board])

  // Extract used pins from components
  const usedPins = useMemo(() => {
    const pins: Array<{ pin: string; usage: string }> = []
    components.forEach((comp) => {
      const config = comp.config
      // Check common pin fields
      const pinFields = ['pin', 'trigger_pin', 'echo_pin', 'red', 'green', 'blue', 'data_pin']
      pinFields.forEach((field) => {
        if (config[field]) {
          pins.push({ pin: config[field], usage: `${comp.name} (${field})` })
        }
      })
    })
    return pins
  }, [components])

  const conflicts = useMemo(() => {
    if (!pinout) return []
    return checkPinConflicts(board, usedPins)
  }, [board, usedPins, pinout])

  const filteredPins = useMemo(() => {
    if (!pinout) return []
    return pinout.pins.filter(
      (pin) =>
        pin.pin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.gpio.toString().includes(searchQuery) ||
        pin.functions.some((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [pinout, searchQuery])

  if (!pinout) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Pin mapping not available for this board
          </p>
        </CardContent>
      </Card>
    )
  }

  const isPinUsed = (pin: BoardPin) => {
    return usedPins.some((used) => used.pin === pin.pin || used.pin === pin.gpio.toString())
  }

  const getPinUsage = (pin: BoardPin) => {
    return usedPins.find((used) => used.pin === pin.pin || used.pin === pin.gpio.toString())
  }

  const hasPinConflict = (pin: BoardPin) => {
    return conflicts.some((c) => c.pin === pin.pin || c.pin === pin.gpio.toString())
  }

  const getFunctionColor = (type: string) => {
    const colors: Record<string, string> = {
      digital: 'bg-blue-500',
      analog: 'bg-green-500',
      pwm: 'bg-purple-500',
      i2c: 'bg-yellow-500',
      spi: 'bg-orange-500',
      uart: 'bg-red-500',
      special: 'bg-pink-500',
    }
    return colors[type] || 'bg-gray-500'
  }

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold flex items-center gap-2">
          <Cpu className="h-6 w-6" />
          Pin Mapper - {pinout.name}
        </h2>
        <p className="text-muted-foreground">
          Interactive pin reference and conflict detection
        </p>
      </div>

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <Card className="mb-4 border-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Pin Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {conflicts.map((conflict, idx) => (
                <li key={idx} className="text-sm text-destructive">
                  <strong>{conflict.pin}:</strong> {conflict.conflict}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="diagram">Board Diagram</TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pins, functions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Grid View */}
        <TabsContent value="grid" className="mt-0">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPins.map((pin) => {
                const used = isPinUsed(pin)
                const conflict = hasPinConflict(pin)
                const usage = getPinUsage(pin)

                return (
                  <TooltipProvider key={pin.gpio}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            used ? 'border-primary' : ''
                          } ${conflict ? 'border-destructive' : ''} ${
                            selectedPin?.gpio === pin.gpio ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => {
                            setSelectedPin(pin)
                            onPinSelect?.(pin.pin)
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-bold text-lg">{pin.pin}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    GPIO{pin.gpio}
                                  </Badge>
                                  {used && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                  {conflict && (
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                  )}
                                </div>

                                {/* Functions */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {pin.functions.slice(0, 3).map((func, idx) => (
                                    <Badge
                                      key={idx}
                                      className={`text-xs ${getFunctionColor(func.type)} text-white`}
                                    >
                                      {func.name}
                                    </Badge>
                                  ))}
                                  {pin.functions.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{pin.functions.length - 3}
                                    </Badge>
                                  )}
                                </div>

                                {/* Usage */}
                                {used && (
                                  <p className="text-xs text-primary font-medium">
                                    {usage?.usage}
                                  </p>
                                )}

                                {/* Boot State */}
                                {pin.bootState && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Zap className="h-3 w-3" />
                                    {pin.bootState}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm">
                        <div className="space-y-2">
                          <p className="font-semibold">{pin.pin} (GPIO{pin.gpio})</p>
                          <div>
                            <p className="text-xs font-medium mb-1">Functions:</p>
                            {pin.functions.map((func, idx) => (
                              <p key={idx} className="text-xs">
                                • {func.name} ({func.type})
                                {func.description && ` - ${func.description}`}
                              </p>
                            ))}
                          </div>
                          {pin.notes && (
                            <p className="text-xs text-muted-foreground">{pin.notes}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="mt-0">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-2">
              {filteredPins.map((pin) => {
                const used = isPinUsed(pin)
                const conflict = hasPinConflict(pin)
                const usage = getPinUsage(pin)

                return (
                  <Card
                    key={pin.gpio}
                    className={`cursor-pointer ${used ? 'border-primary' : ''} ${
                      conflict ? 'border-destructive' : ''
                    }`}
                    onClick={() => setSelectedPin(pin)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold">{pin.pin}</h3>
                            <Badge variant="outline">GPIO{pin.gpio}</Badge>
                            <div className="flex flex-wrap gap-1">
                              {pin.functions.map((func, idx) => (
                                <Badge
                                  key={idx}
                                  className={`text-xs ${getFunctionColor(func.type)} text-white`}
                                >
                                  {func.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {used && (
                            <p className="text-sm text-primary mt-1">{usage?.usage}</p>
                          )}
                          {pin.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{pin.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {used && <Check className="h-5 w-5 text-primary" />}
                          {conflict && <AlertTriangle className="h-5 w-5 text-destructive" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Board Diagram */}
        <TabsContent value="diagram" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-lg border-2 border-dashed p-8 text-center">
                  <Cpu className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">{pinout.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visual board diagram coming soon
                  </p>
                  <div className="space-y-2 text-left">
                    {pinout.notes?.map((note, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                        {note}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="w-full rounded-lg border p-4">
                  <h4 className="mb-3 font-semibold text-sm">Pin Function Legend</h4>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {[
                      { type: 'digital', label: 'Digital I/O' },
                      { type: 'analog', label: 'Analog' },
                      { type: 'pwm', label: 'PWM' },
                      { type: 'i2c', label: 'I2C' },
                      { type: 'spi', label: 'SPI' },
                      { type: 'uart', label: 'UART' },
                      { type: 'special', label: 'Special' },
                    ].map(({ type, label }) => (
                      <div key={type} className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded ${getFunctionColor(type)}`} />
                        <span className="text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Pin Details */}
      {selectedPin && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedPin.pin} (GPIO{selectedPin.gpio})
              {isPinUsed(selectedPin) && <Badge variant="default">In Use</Badge>}
            </CardTitle>
            <CardDescription>Pin details and capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-sm">Functions</h4>
              <div className="space-y-2">
                {selectedPin.functions.map((func, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Badge className={`${getFunctionColor(func.type)} text-white`}>
                      {func.type}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{func.name}</p>
                      {func.description && (
                        <p className="text-xs text-muted-foreground">{func.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPin.bootState && (
              <div>
                <h4 className="mb-2 font-semibold text-sm">Boot State</h4>
                <p className="text-sm text-muted-foreground">{selectedPin.bootState}</p>
              </div>
            )}

            {selectedPin.notes && (
              <div>
                <h4 className="mb-2 font-semibold text-sm">Notes</h4>
                <p className="text-sm text-muted-foreground">{selectedPin.notes}</p>
              </div>
            )}

            {onPinSelect && (
              <Button
                onClick={() => onPinSelect(selectedPin.pin)}
                className="w-full"
              >
                Use This Pin
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
