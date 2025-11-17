import { BoardPin } from '@/services/pinout'
import { PinElement } from './PinElement'

interface ESP32DevKitDiagramProps {
  pins: BoardPin[]
  usedPins: string[]
  hoveredPin: string | null
  onPinHover: (pin: string | null) => void
  onPinClick?: (pin: BoardPin) => void
}

export default function ESP32DevKitDiagram({
  pins,
  usedPins,
  hoveredPin,
  onPinHover,
  onPinClick,
}: ESP32DevKitDiagramProps) {
  // Split pins into left and right sides
  const leftPins = pins.filter((p) =>
    ['GPIO36', 'GPIO39', 'GPIO34', 'GPIO35', 'GPIO32', 'GPIO33',
     'GPIO25', 'GPIO26', 'GPIO27', 'GPIO14', 'GPIO12', 'GPIO13',
     'GND', '3V3', 'EN'].includes(p.pin)
  )

  const rightPins = pins.filter((p) =>
    ['GPIO23', 'GPIO22', 'GPIO21', 'GPIO19', 'GPIO18', 'GPIO5',
     'GPIO17', 'GPIO16', 'GPIO4', 'GPIO2', 'GPIO15', 'VIN',
     'GND', '3V3', 'RX', 'TX'].includes(p.pin)
  )

  return (
    <svg
      viewBox="0 0 900 550"
      className="w-full"
      style={{ maxWidth: '900px', margin: '0 auto' }}
    >
      {/* PCB Board */}
      <defs>
        <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1a472a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0d2818', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main board outline */}
      <rect
        x="100"
        y="50"
        width="700"
        height="450"
        rx="15"
        fill="url(#pcbGrad)"
        stroke="#2a5a3a"
        strokeWidth="3"
      />

      {/* Board label */}
      <text
        x="450"
        y="35"
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize="20"
        fontWeight="bold"
      >
        ESP32 DevKit V1
      </text>

      {/* ESP32-WROOM-32 Module */}
      <rect
        x="325"
        y="180"
        width="250"
        height="200"
        rx="8"
        fill="#1a1a1a"
        stroke="#444"
        strokeWidth="2"
      />

      {/* Module shield */}
      <rect
        x="335"
        y="190"
        width="230"
        height="180"
        rx="4"
        fill="#2a2a2a"
        stroke="#555"
        strokeWidth="1"
      />

      {/* ESP32 text on module */}
      <text
        x="450"
        y="270"
        textAnchor="middle"
        fill="#888"
        fontSize="24"
        fontWeight="bold"
      >
        ESP32
      </text>
      <text
        x="450"
        y="295"
        textAnchor="middle"
        fill="#666"
        fontSize="14"
      >
        WROOM-32
      </text>

      {/* Antenna area */}
      <path
        d="M 560 200 L 560 360 Q 560 370 550 370 L 350 370 Q 340 370 340 360 L 340 200"
        fill="none"
        stroke="#444"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <text
        x="450"
        y="350"
        textAnchor="middle"
        fill="#555"
        fontSize="10"
      >
        Antenna
      </text>

      {/* USB Connector */}
      <rect
        x="395"
        y="40"
        width="110"
        height="25"
        rx="4"
        fill="#555"
        stroke="#333"
        strokeWidth="2"
      />
      <rect
        x="410"
        y="45"
        width="80"
        height="15"
        rx="2"
        fill="#333"
      />
      <text
        x="450"
        y="57"
        textAnchor="middle"
        fill="#aaa"
        fontSize="10"
        fontWeight="bold"
      >
        MICRO USB
      </text>

      {/* Reset and Boot buttons */}
      <circle cx="250" cy="120" r="18" fill="#444" stroke="#555" strokeWidth="2" />
      <text x="250" y="125" textAnchor="middle" fill="#aaa" fontSize="10" fontWeight="bold">
        RST
      </text>

      <circle cx="650" cy="120" r="18" fill="#444" stroke="#555" strokeWidth="2" />
      <text x="650" y="125" textAnchor="middle" fill="#aaa" fontSize="10" fontWeight="bold">
        BOOT
      </text>

      {/* Power LED */}
      <circle cx="450" cy="470" r="6" fill="#ff3333" opacity="0.8" />
      <text x="450" y="490" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
        PWR
      </text>

      {/* Left side pins */}
      {leftPins.map((pin, idx) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={80}
          y={80 + idx * 28}
          side="left"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(`GPIO${pin.gpio}`)}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* Right side pins */}
      {rightPins.map((pin, idx) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={820}
          y={80 + idx * 28}
          side="right"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(`GPIO${pin.gpio}`)}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* Pin headers */}
      <rect x="85" y="75" width="10" height={leftPins.length * 28} fill="#333" rx="2" />
      <rect x="805" y="75" width="10" height={rightPins.length * 28} fill="#333" rx="2" />
    </svg>
  )
}
