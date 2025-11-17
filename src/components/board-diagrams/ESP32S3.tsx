import { BoardPin } from '@/services/pinout'
import { PinElement } from './PinElement'

interface ESP32S3DiagramProps {
  pins: BoardPin[]
  usedPins: string[]
  hoveredPin: string | null
  onPinHover: (pin: string | null) => void
  onPinClick?: (pin: BoardPin) => void
}

export default function ESP32S3Diagram({
  pins,
  usedPins,
  hoveredPin,
  onPinHover,
  onPinClick,
}: ESP32S3DiagramProps) {
  // ESP32-S3 has more GPIO pins
  const leftPins = pins.filter((p, idx) => idx < Math.ceil(pins.length / 2))
  const rightPins = pins.filter((p, idx) => idx >= Math.ceil(pins.length / 2))

  return (
    <svg
      viewBox="0 0 950 600"
      className="w-full"
      style={{ maxWidth: '950px', margin: '0 auto' }}
    >
      {/* Title */}
      <text
        x="475"
        y="35"
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize="22"
        fontWeight="bold"
      >
        ESP32-S3 DevKit
      </text>

      {/* PCB Board */}
      <defs>
        <linearGradient id="s3Pcb" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2a1a4a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#150d25', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main board outline */}
      <rect
        x="100"
        y="60"
        width="750"
        height="500"
        rx="15"
        fill="url(#s3Pcb)"
        stroke="#3a2a5a"
        strokeWidth="3"
      />

      {/* ESP32-S3-WROOM-1 Module */}
      <rect
        x="325"
        y="200"
        width="300"
        height="220"
        rx="8"
        fill="#1a1a1a"
        stroke="#444"
        strokeWidth="2"
      />

      {/* Module shield */}
      <rect
        x="335"
        y="210"
        width="280"
        height="200"
        rx="4"
        fill="#2a2a2a"
        stroke="#555"
        strokeWidth="1"
      />

      {/* ESP32-S3 text */}
      <text
        x="475"
        y="295"
        textAnchor="middle"
        fill="#888"
        fontSize="28"
        fontWeight="bold"
      >
        ESP32-S3
      </text>
      <text
        x="475"
        y="325"
        textAnchor="middle"
        fill="#666"
        fontSize="14"
      >
        WROOM-1
      </text>

      {/* Chip features */}
      <text
        x="475"
        y="360"
        textAnchor="middle"
        fill="#555"
        fontSize="11"
      >
        Dual Core • WiFi • BLE 5.0 • USB OTG
      </text>

      {/* Antenna area */}
      <path
        d="M 610 220 L 610 400 Q 610 410 600 410 L 350 410 Q 340 410 340 400 L 340 220"
        fill="none"
        stroke="#444"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <text
        x="475"
        y="395"
        textAnchor="middle"
        fill="#555"
        fontSize="10"
      >
        PCB Antenna
      </text>

      {/* USB-C Connector */}
      <rect
        x="415"
        y="50"
        width="120"
        height="25"
        rx="4"
        fill="#666"
        stroke="#333"
        strokeWidth="2"
      />
      <rect
        x="435"
        y="55"
        width="80"
        height="15"
        rx="2"
        fill="#333"
      />
      <text
        x="475"
        y="67"
        textAnchor="middle"
        fill="#aaa"
        fontSize="11"
        fontWeight="bold"
      >
        USB-C
      </text>

      {/* Reset and Boot buttons */}
      <circle cx="250" cy="130" r="20" fill="#444" stroke="#555" strokeWidth="2" />
      <text x="250" y="136" textAnchor="middle" fill="#aaa" fontSize="11" fontWeight="bold">
        RST
      </text>

      <circle cx="700" cy="130" r="20" fill="#444" stroke="#555" strokeWidth="2" />
      <text x="700" y="136" textAnchor="middle" fill="#aaa" fontSize="11" fontWeight="bold">
        BOOT
      </text>

      {/* Power LED */}
      <circle cx="475" cy="520" r="6" fill="#00ff00" opacity="0.8" />
      <text x="475" y="540" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
        PWR
      </text>

      {/* RGB LED indicator (ESP32-S3 feature) */}
      <circle cx="180" cy="130" r="8" fill="#ff0000" opacity="0.3" />
      <circle cx="180" cy="130" r="8" fill="#00ff00" opacity="0.3" />
      <circle cx="180" cy="130" r="8" fill="#0000ff" opacity="0.3" />
      <text x="180" y="150" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
        RGB
      </text>

      {/* Left side pins */}
      {leftPins.slice(0, 16).map((pin, idx) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={80}
          y={90 + idx * 30}
          side="left"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(`GPIO${pin.gpio}`)}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* Right side pins */}
      {rightPins.slice(0, 16).map((pin, idx) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={870}
          y={90 + idx * 30}
          side="right"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(`GPIO${pin.gpio}`)}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* Pin headers */}
      <rect x="85" y="85" width="10" height={Math.min(leftPins.length, 16) * 30} fill="#333" rx="2" />
      <rect x="855" y="85" width="10" height={Math.min(rightPins.length, 16) * 30} fill="#333" rx="2" />

      {/* Features badge */}
      <rect
        x="320"
        y="460"
        width="310"
        height="35"
        rx="6"
        fill="#1a1a2a"
        stroke="#444"
        strokeWidth="1"
      />
      <text
        x="475"
        y="483"
        textAnchor="middle"
        fill="#aaa"
        fontSize="11"
      >
        240MHz • 512KB SRAM • 8MB Flash • USB OTG
      </text>
    </svg>
  )
}
