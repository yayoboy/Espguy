import { BoardPin } from '@/services/pinout'
import { PinElement } from './PinElement'

interface NodeMCUV2DiagramProps {
  pins: BoardPin[]
  usedPins: string[]
  hoveredPin: string | null
  onPinHover: (pin: string | null) => void
  onPinClick?: (pin: BoardPin) => void
}

export default function NodeMCUV2Diagram({
  pins,
  usedPins,
  hoveredPin,
  onPinHover,
  onPinClick,
}: NodeMCUV2DiagramProps) {
  const leftPins = pins.filter((p, idx) => idx < 15)
  const rightPins = pins.filter((p, idx) => idx >= 15)

  return (
    <svg
      viewBox="0 0 650 550"
      className="w-full"
      style={{ maxWidth: '650px', margin: '0 auto' }}
    >
      {/* Title */}
      <text
        x="325"
        y="35"
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize="20"
        fontWeight="bold"
      >
        NodeMCU V2 (ESP8266)
      </text>

      {/* PCB Board */}
      <defs>
        <linearGradient id="nodemcuPcb" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1a3a1a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0d1d0d', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Main board outline */}
      <rect
        x="90"
        y="60"
        width="470"
        height="450"
        rx="12"
        fill="url(#nodemcuPcb)"
        stroke="#2a4a2a"
        strokeWidth="3"
      />

      {/* ESP-12E Module */}
      <rect
        x="200"
        y="180"
        width="250"
        height="180"
        rx="8"
        fill="#1a1a1a"
        stroke="#444"
        strokeWidth="2"
      />

      {/* Module shield */}
      <rect
        x="210"
        y="190"
        width="230"
        height="160"
        rx="4"
        fill="#2a2a2a"
        stroke="#555"
        strokeWidth="1"
      />

      {/* ESP8266 text */}
      <text
        x="325"
        y="255"
        textAnchor="middle"
        fill="#888"
        fontSize="24"
        fontWeight="bold"
      >
        ESP8266
      </text>
      <text
        x="325"
        y="280"
        textAnchor="middle"
        fill="#666"
        fontSize="14"
      >
        ESP-12E Module
      </text>

      {/* WiFi antenna */}
      <path
        d="M 315 310 Q 325 300 335 310"
        fill="none"
        stroke="#555"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 310 320 Q 325 305 340 320"
        fill="none"
        stroke="#555"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 305 330 Q 325 310 345 330"
        fill="none"
        stroke="#555"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Micro USB Connector */}
      <rect
        x="265"
        y="50"
        width="120"
        height="25"
        rx="4"
        fill="#555"
        stroke="#333"
        strokeWidth="2"
      />
      <rect
        x="280"
        y="55"
        width="90"
        height="15"
        rx="2"
        fill="#333"
      />
      <text
        x="325"
        y="67"
        textAnchor="middle"
        fill="#aaa"
        fontSize="10"
        fontWeight="bold"
      >
        MICRO USB
      </text>

      {/* CP2102 USB-to-Serial chip */}
      <rect
        x="145"
        y="110"
        width="80"
        height="40"
        rx="4"
        fill="#2a2a2a"
        stroke="#444"
        strokeWidth="1"
      />
      <text
        x="185"
        y="135"
        textAnchor="middle"
        fill="#666"
        fontSize="10"
      >
        CP2102
      </text>

      {/* Reset and Flash buttons */}
      <circle cx="470" cy="120" r="16" fill="#444" stroke="#555" strokeWidth="2" />
      <text x="470" y="125" textAnchor="middle" fill="#aaa" fontSize="10" fontWeight="bold">
        RST
      </text>

      <circle cx="470" cy="170" r="16" fill="#444" stroke="#555" strokeWidth="2" />
      <text x="470" y="175" textAnchor="middle" fill="#aaa" fontSize="9" fontWeight="bold">
        FLASH
      </text>

      {/* Power LED */}
      <circle cx="160" cy="90" r="5" fill="#3399ff" opacity="0.9" />
      <text x="160" y="105" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
        PWR
      </text>

      {/* TX/RX LEDs */}
      <circle cx="190" cy="90" r="4" fill="#ff9900" opacity="0.7" />
      <text x="190" y="105" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
        TX
      </text>

      <circle cx="215" cy="90" r="4" fill="#00ff00" opacity="0.7" />
      <text x="215" y="105" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
        RX
      </text>

      {/* Left side pins */}
      {leftPins.map((pin, idx) => (
        <PinElement
          key={pin.pin}
          pin={pin}
          x={70}
          y={100 + idx * 30}
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
          x={580}
          y={100 + idx * 30}
          side="right"
          isUsed={usedPins.includes(pin.pin) || usedPins.includes(`GPIO${pin.gpio}`)}
          isHovered={hoveredPin === pin.pin}
          onHover={onPinHover}
          onClick={onPinClick}
        />
      ))}

      {/* Pin headers */}
      <rect x="75" y="95" width="8" height={leftPins.length * 30} fill="#333" rx="2" />
      <rect x="567" y="95" width="8" height={rightPins.length * 30} fill="#333" rx="2" />

      {/* Board info */}
      <text
        x="325"
        y="480"
        textAnchor="middle"
        fill="hsl(var(--muted-foreground))"
        fontSize="10"
      >
        NodeMCU V2 • ESP8266 • WiFi Development Board
      </text>
    </svg>
  )
}
