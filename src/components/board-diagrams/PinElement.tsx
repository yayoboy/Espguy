import { BoardPin } from '@/services/pinout'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

interface PinElementProps {
  pin: BoardPin
  x: number
  y: number
  side: 'left' | 'right'
  isUsed: boolean
  isHovered: boolean
  onHover?: (pin: string | null) => void
  onClick?: (pin: BoardPin) => void
}

export function PinElement({
  pin,
  x,
  y,
  side,
  isUsed,
  isHovered,
  onHover,
  onClick,
}: PinElementProps) {
  const pinColor = isUsed
    ? 'hsl(var(--primary))'
    : isHovered
    ? 'hsl(var(--accent))'
    : 'hsl(var(--muted))'

  const hasWarning = pin.bootState || pin.notes
  const isSpecialPin = pin.pin.includes('GND') || pin.pin.includes('3V3') || pin.pin.includes('VIN') || pin.pin.includes('EN')

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
            <circle
              cx={x}
              cy={y}
              r="8"
              fill={pinColor}
              stroke={isSpecialPin ? '#ff9500' : 'hsl(var(--border))'}
              strokeWidth={isSpecialPin ? '2' : '1'}
            />

            {/* Warning indicator */}
            {hasWarning && (
              <circle
                cx={x + (side === 'left' ? -10 : 10)}
                cy={y - 8}
                r="4"
                fill="hsl(var(--destructive))"
              />
            )}

            {/* Pin label */}
            <text
              x={side === 'left' ? x + 15 : x - 15}
              y={y + 5}
              textAnchor={side === 'left' ? 'start' : 'end'}
              fill="hsl(var(--foreground))"
              fontSize="12"
              fontWeight={isUsed ? 'bold' : 'normal'}
            >
              {pin.pin}
            </text>

            {/* GPIO number or additional info */}
            {pin.gpio !== undefined && !isSpecialPin && (
              <text
                x={side === 'left' ? x + 15 : x - 15}
                y={y + 18}
                textAnchor={side === 'left' ? 'start' : 'end'}
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
              >
                GPIO{pin.gpio}
              </text>
            )}
          </g>
        </TooltipTrigger>
        <TooltipContent side={side === 'left' ? 'right' : 'left'}>
          <div className="space-y-1 max-w-xs">
            <p className="font-semibold">
              {pin.pin} {pin.gpio !== undefined && `(GPIO${pin.gpio})`}
            </p>
            <div className="flex flex-wrap gap-1">
              {pin.functions.slice(0, 4).map((func, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {func.name}
                </Badge>
              ))}
            </div>
            {pin.bootState && (
              <p className="text-xs text-destructive">⚠️ {pin.bootState}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
