import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getPinout, BoardPin } from '@/services/pinout'

interface BoardDiagramProps {
  board: string
  usedPins: string[]
  onPinClick?: (pin: BoardPin) => void
}

export default function BoardDiagram({ board, usedPins, onPinClick }: BoardDiagramProps) {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)
  const pinout = getPinout(board)

  if (!pinout) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        Board diagram not available for {board}
      </div>
    )
  }

  const isESP32 = pinout.platform === 'ESP32'

  return (
    <div className="relative w-full p-6">
      {isESP32 ? (
        <ESP32BoardDiagram
          pinout={pinout}
          usedPins={usedPins}
          hoveredPin={hoveredPin}
          onPinHover={setHoveredPin}
          onPinClick={onPinClick}
        />
      ) : (
        <ESP8266BoardDiagram
          pinout={pinout}
          usedPins={usedPins}
          hoveredPin={hoveredPin}
          onPinHover={setHoveredPin}
          onPinClick={onPinClick}
        />
      )}

      {/* Pin Info Card */}
      {hoveredPin && (
        <Card className="absolute bottom-4 left-4 right-4 z-50">
          <CardContent className="p-4">
            <PinInfo pin={pinout.pins.find(p => p.pin === hoveredPin)!} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ESP32 Board Diagram Component
function ESP32BoardDiagram({
  pinout,
  usedPins,
  hoveredPin,
  onPinHover,
  onPinClick,
}: any) {
  return (
    <svg
      viewBox="0 0 800 400"
      className="w-full"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      {/* Board outline */}
      <rect
        x="50"
        y="50"
        width="700"
        height="300"
        rx="10"
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* ESP32 chip */}
      <rect
        x="325"
        y="150"
        width="150"
        height="100"
        rx="5"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
      />
      <text
        x="400"
        y="205"
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize="16"
        fontWeight="bold"
      >
        ESP32
      </text>

      {/* Left side pins */}
      {pinout.pins.slice(0, 15).map((pin: BoardPin, idx: number) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={30}
          y={60 + idx * 20}
          side="left"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(pin.gpio.toString())}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* Right side pins */}
      {pinout.pins.slice(15, 30).map((pin: BoardPin, idx: number) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={770}
          y={60 + idx * 20}
          side="right"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(pin.gpio.toString())}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* USB connector */}
      <rect
        x="360"
        y="45"
        width="80"
        height="15"
        rx="3"
        fill="hsl(var(--muted-foreground))"
      />
      <text
        x="400"
        y="56"
        textAnchor="middle"
        fill="hsl(var(--background))"
        fontSize="10"
      >
        USB
      </text>
    </svg>
  )
}

// ESP8266 Board Diagram Component
function ESP8266BoardDiagram({
  pinout,
  usedPins,
  hoveredPin,
  onPinHover,
  onPinClick,
}: any) {
  return (
    <svg
      viewBox="0 0 600 350"
      className="w-full"
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      {/* Board outline */}
      <rect
        x="50"
        y="50"
        width="500"
        height="250"
        rx="10"
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* ESP8266 chip */}
      <rect
        x="225"
        y="125"
        width="150"
        height="100"
        rx="5"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
      />
      <text
        x="300"
        y="180"
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize="16"
        fontWeight="bold"
      >
        ESP8266
      </text>

      {/* Left side pins (D0-D8) */}
      {pinout.pins.slice(0, 9).map((pin: BoardPin, idx: number) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={30}
          y={70 + idx * 25}
          side="left"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(pin.gpio.toString())}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* Right side pins (3V3, GND, etc.) */}
      {pinout.pins.slice(9, 13).map((pin: BoardPin, idx: number) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={570}
          y={70 + idx * 25}
          side="right"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(pin.gpio.toString())}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* USB connector */}
      <rect
        x="260"
        y="45"
        width="80"
        height="15"
        rx="3"
        fill="hsl(var(--muted-foreground))"
      />
      <text
        x="300"
        y="56"
        textAnchor="middle"
        fill="hsl(var(--background))"
        fontSize="10"
      >
        MICRO USB
      </text>
    </svg>
  )
}

// Pin Element Component
function PinElement({
  pin,
  x,
  y,
  side,
  isUsed,
  isHovered,
  onHover,
  onClick,
}: any) {
  const pinColor = isUsed
    ? 'hsl(var(--primary))'
    : isHovered
    ? 'hsl(var(--accent))'
    : 'hsl(var(--muted))'

  const hasWarning = pin.bootState || pin.notes

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <g
            onMouseEnter={() => onHover?.(pin.pin)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onClick?.(pin)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pin circle */}
            <circle cx={x} cy={y} r="6" fill={pinColor} stroke="hsl(var(--border))" strokeWidth="1" />

            {/* Warning indicator */}
            {hasWarning && (
              <circle
                cx={x + (side === 'left' ? -8 : 8)}
                cy={y - 6}
                r="3"
                fill="hsl(var(--destructive))"
              />
            )}

            {/* Pin label */}
            <text
              x={side === 'left' ? x + 12 : x - 12}
              y={y + 4}
              textAnchor={side === 'left' ? 'start' : 'end'}
              fill="hsl(var(--foreground))"
              fontSize="11"
              fontWeight={isUsed ? 'bold' : 'normal'}
            >
              {pin.pin}
            </text>

            {/* GPIO number */}
            <text
              x={side === 'left' ? x + 12 : x - 12}
              y={y + 16}
              textAnchor={side === 'left' ? 'start' : 'end'}
              fill="hsl(var(--muted-foreground))"
              fontSize="9"
            >
              GPIO{pin.gpio}
            </text>
          </g>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{pin.pin} (GPIO{pin.gpio})</p>
            <div className="flex flex-wrap gap-1">
              {pin.functions.slice(0, 3).map((func: any, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {func.name}
                </Badge>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Pin Info Display
function PinInfo({ pin }: { pin: BoardPin }) {
  return (
    <div className="space-y-2">
      <div>
        <h4 className="font-semibold">{pin.pin} (GPIO{pin.gpio})</h4>
      </div>

      <div className="flex flex-wrap gap-1">
        {pin.functions.map((func, idx) => (
          <Badge key={idx} variant="secondary">
            {func.name}
          </Badge>
        ))}
      </div>

      {pin.bootState && (
        <div className="rounded bg-destructive/10 p-2 text-sm text-destructive">
          ⚠️ {pin.bootState}
        </div>
      )}

      {pin.notes && (
        <p className="text-sm text-muted-foreground">{pin.notes}</p>
      )}
    </div>
  )
}
