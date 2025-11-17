import { BoardPin } from '@/services/pinout'
import { PinElement } from './PinElement'

interface D1MiniDiagramProps {
  pins: BoardPin[]
  usedPins: string[]
  hoveredPin: string | null
  onPinHover: (pin: string | null) => void
  onPinClick?: (pin: BoardPin) => void
}

export default function D1MiniDiagram({
  pins,
  usedPins,
  hoveredPin,
  onPinHover,
  onPinClick,
}: D1MiniDiagramProps) {
  // D1 Mini has a compact layout with pins on both sides
  const leftPins = pins.filter((p) =>
    ['RST', 'A0', 'D0', 'D5', 'D6', 'D7', 'D8', '3V3'].includes(p.pin)
  )

  const rightPins = pins.filter((p) =>
    ['TX', 'RX', 'D1', 'D2', 'D3', 'D4', 'GND', '5V'].includes(p.pin)
  )

  return (
    <svg
      viewBox="0 0 500 450"
      className="w-full"
      style={{ maxWidth: '500px', margin: '0 auto' }}
    >
      {/* Title */}
      <text
        x="250"
        y="30"
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize="20"
        fontWeight="bold"
      >
        Wemos D1 Mini
      </text>

      {/* PCB Board - Compact Design */}
      <defs>
        <linearGradient id="d1miniPcb" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1a3b5c', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0d1e2e', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main board outline - smaller and more compact */}
      <rect
        x="120"
        y="60"
        width="260"
        height="350"
        rx="12"
        fill="url(#d1miniPcb)"
        stroke="#2a4a6a"
        strokeWidth="3"
      />

      {/* ESP8266 Module */}
      <rect
        x="150"
        y="150"
        width="200"
        height="150"
        rx="6"
        fill="#1a1a1a"
        stroke="#444"
        strokeWidth="2"
      />

      {/* Module shield */}
      <rect
        x="160"
        y="160"
        width="180"
        height="130"
        rx="4"
        fill="#2a2a2a"
        stroke="#555"
        strokeWidth="1"
      />

      {/* ESP8266 text on module */}
      <text
        x="250"
        y="215"
        textAnchor="middle"
        fill="#888"
        fontSize="20"
        fontWeight="bold"
      >
        ESP8266
      </text>
      <text
        x="250"
        y="235"
        textAnchor="middle"
        fill="#666"
        fontSize="12"
      >
        ESP-12E
      </text>

      {/* WiFi Antenna indicator */}
      <path
        d="M 240 265 Q 250 255 260 265"
        fill="none"
        stroke="#555"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 235 275 Q 250 260 265 275"
        fill="none"
        stroke="#555"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Micro USB Connector */}
      <rect
        x="210"
        y="55"
        width="80"
        height="20"
        rx="3"
        fill="#555"
        stroke="#333"
        strokeWidth="2"
      />
      <rect
        x="220"
        y="60"
        width="60"
        height="10"
        rx="2"
        fill="#333"
      />
      <text
        x="250"
        y="68"
        textAnchor="middle"
        fill="#aaa"
        fontSize="8"
        fontWeight="bold"
      >
        MICRO USB
      </text>

      {/* Reset button */}
      <circle cx="250" cy="330" r="12" fill="#444" stroke="#555" strokeWidth="2" />
      <text x="250" y="335" textAnchor="middle" fill="#aaa" fontSize="9" fontWeight="bold">
        RST
      </text>

      {/* Power LED */}
      <circle cx="170" cy="100" r="4" fill="#3399ff" opacity="0.9" />
      <text x="170" y="115" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
        PWR
      </text>

      {/* Status LED (connected to D4/GPIO2) */}
      <circle cx="330" cy="100" r="4" fill="#ff3333" opacity="0.7" />
      <text x="330" y="115" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
        LED
      </text>

      {/* Left side pins */}
      {leftPins.map((pin, idx) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={100}
          y={90 + idx * 38}
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
          x={400}
          y={90 + idx * 38}
          side="right"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(`GPIO${pin.gpio}`)}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* Pin headers */}
      <rect x="105" y="85" width="8" height={leftPins.length * 38} fill="#333" rx="2" />
      <rect x="387" y="85" width="8" height={rightPins.length * 38} fill="#333" rx="2" />

      {/* Board info text */}
      <text
        x="250"
        y="395"
        textAnchor="middle"
        fill="hsl(var(--muted-foreground))"
        fontSize="10"
      >
        WeMos D1 Mini - ESP8266 Dev Board
      </text>
    </svg>
  )
}
