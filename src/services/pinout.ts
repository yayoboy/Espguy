export interface PinFunction {
  name: string
  type: 'digital' | 'analog' | 'pwm' | 'i2c' | 'spi' | 'uart' | 'special'
  description?: string
}

export interface BoardPin {
  pin: string
  gpio: number
  functions: PinFunction[]
  notes?: string
  bootState?: string
  conflicts?: string[]
}

export interface BoardPinout {
  name: string
  platform: 'ESP32' | 'ESP8266'
  image?: string
  pins: BoardPin[]
  notes?: string[]
}

export const ESP32_PINOUTS: Record<string, BoardPinout> = {
  esp32dev: {
    name: 'ESP32 DevKit',
    platform: 'ESP32',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [
          { name: 'Boot', type: 'special', description: 'Boot button' },
          { name: 'ADC2_CH1', type: 'analog' },
          { name: 'TOUCH1', type: 'special' },
        ],
        bootState: 'Must be HIGH during boot',
        notes: 'Connected to boot button, pulled up',
      },
      {
        pin: 'GPIO1',
        gpio: 1,
        functions: [
          { name: 'TX', type: 'uart', description: 'UART0 TX' },
          { name: 'U0TXD', type: 'uart' },
        ],
        notes: 'Serial TX, avoid if using serial monitor',
      },
      {
        pin: 'GPIO2',
        gpio: 2,
        functions: [
          { name: 'ADC2_CH2', type: 'analog' },
          { name: 'TOUCH2', type: 'special' },
        ],
        bootState: 'Must be LOW during boot',
        notes: 'Connected to on-board LED on some boards',
      },
      {
        pin: 'GPIO3',
        gpio: 3,
        functions: [
          { name: 'RX', type: 'uart', description: 'UART0 RX' },
          { name: 'U0RXD', type: 'uart' },
        ],
        notes: 'Serial RX, avoid if using serial monitor',
      },
      {
        pin: 'GPIO4',
        gpio: 4,
        functions: [
          { name: 'ADC2_CH0', type: 'analog' },
          { name: 'TOUCH0', type: 'special' },
        ],
      },
      {
        pin: 'GPIO5',
        gpio: 5,
        functions: [
          { name: 'SS', type: 'spi', description: 'SPI SS' },
        ],
      },
      {
        pin: 'GPIO12',
        gpio: 12,
        functions: [
          { name: 'ADC2_CH5', type: 'analog' },
          { name: 'TOUCH5', type: 'special' },
          { name: 'HSPI_MISO', type: 'spi' },
        ],
        bootState: 'Must be LOW during boot',
        notes: 'Boot fail if pulled high',
      },
      {
        pin: 'GPIO13',
        gpio: 13,
        functions: [
          { name: 'ADC2_CH4', type: 'analog' },
          { name: 'TOUCH4', type: 'special' },
          { name: 'HSPI_MOSI', type: 'spi' },
        ],
      },
      {
        pin: 'GPIO14',
        gpio: 14,
        functions: [
          { name: 'ADC2_CH6', type: 'analog' },
          { name: 'TOUCH6', type: 'special' },
          { name: 'HSPI_CLK', type: 'spi' },
        ],
      },
      {
        pin: 'GPIO15',
        gpio: 15,
        functions: [
          { name: 'ADC2_CH3', type: 'analog' },
          { name: 'TOUCH3', type: 'special' },
          { name: 'HSPI_SS', type: 'spi' },
        ],
        bootState: 'Outputs PWM at boot',
      },
      {
        pin: 'GPIO16',
        gpio: 16,
        functions: [
          { name: 'RX2', type: 'uart', description: 'UART2 RX' },
        ],
      },
      {
        pin: 'GPIO17',
        gpio: 17,
        functions: [
          { name: 'TX2', type: 'uart', description: 'UART2 TX' },
        ],
      },
      {
        pin: 'GPIO18',
        gpio: 18,
        functions: [
          { name: 'SCK', type: 'spi', description: 'SPI CLK' },
        ],
      },
      {
        pin: 'GPIO19',
        gpio: 19,
        functions: [
          { name: 'MISO', type: 'spi', description: 'SPI MISO' },
        ],
      },
      {
        pin: 'GPIO21',
        gpio: 21,
        functions: [
          { name: 'SDA', type: 'i2c', description: 'I2C Data' },
        ],
      },
      {
        pin: 'GPIO22',
        gpio: 22,
        functions: [
          { name: 'SCL', type: 'i2c', description: 'I2C Clock' },
        ],
      },
      {
        pin: 'GPIO23',
        gpio: 23,
        functions: [
          { name: 'MOSI', type: 'spi', description: 'SPI MOSI' },
        ],
      },
      {
        pin: 'GPIO25',
        gpio: 25,
        functions: [
          { name: 'ADC2_CH8', type: 'analog' },
          { name: 'DAC1', type: 'analog', description: 'DAC channel 1' },
        ],
      },
      {
        pin: 'GPIO26',
        gpio: 26,
        functions: [
          { name: 'ADC2_CH9', type: 'analog' },
          { name: 'DAC2', type: 'analog', description: 'DAC channel 2' },
        ],
      },
      {
        pin: 'GPIO27',
        gpio: 27,
        functions: [
          { name: 'ADC2_CH7', type: 'analog' },
          { name: 'TOUCH7', type: 'special' },
        ],
      },
      {
        pin: 'GPIO32',
        gpio: 32,
        functions: [
          { name: 'ADC1_CH4', type: 'analog' },
          { name: 'TOUCH9', type: 'special' },
        ],
      },
      {
        pin: 'GPIO33',
        gpio: 33,
        functions: [
          { name: 'ADC1_CH5', type: 'analog' },
          { name: 'TOUCH8', type: 'special' },
        ],
      },
      {
        pin: 'GPIO34',
        gpio: 34,
        functions: [
          { name: 'ADC1_CH6', type: 'analog' },
        ],
        notes: 'Input only, no pull-up/down',
      },
      {
        pin: 'GPIO35',
        gpio: 35,
        functions: [
          { name: 'ADC1_CH7', type: 'analog' },
        ],
        notes: 'Input only, no pull-up/down',
      },
      {
        pin: 'GPIO36',
        gpio: 36,
        functions: [
          { name: 'ADC1_CH0', type: 'analog' },
          { name: 'VP', type: 'analog' },
        ],
        notes: 'Input only, no pull-up/down',
      },
      {
        pin: 'GPIO39',
        gpio: 39,
        functions: [
          { name: 'ADC1_CH3', type: 'analog' },
          { name: 'VN', type: 'analog' },
        ],
        notes: 'Input only, no pull-up/down',
      },
    ],
    notes: [
      'GPIO 6-11 are connected to the flash memory (do not use)',
      'Input only pins: 34, 35, 36, 39',
      'ADC2 pins cannot be used when WiFi is active',
    ],
  },

  'nodemcu-32s': {
    name: 'NodeMCU-32S',
    platform: 'ESP32',
    pins: [
      // Similar structure to esp32dev with some board-specific differences
      {
        pin: 'D0',
        gpio: 0,
        functions: [
          { name: 'Boot', type: 'special' },
          { name: 'ADC2_CH1', type: 'analog' },
        ],
        bootState: 'Must be HIGH during boot',
      },
      // Add more pins as needed
    ],
    notes: [
      'NodeMCU-32S pin labels differ from GPIO numbers',
      'D0 = GPIO0, D1 = GPIO1, etc.',
    ],
  },
}

export const ESP8266_PINOUTS: Record<string, BoardPinout> = {
  nodemcuv2: {
    name: 'NodeMCU V2 (ESP8266)',
    platform: 'ESP8266',
    pins: [
      {
        pin: 'D0',
        gpio: 16,
        functions: [
          { name: 'Wake', type: 'special', description: 'Deep sleep wake' },
          { name: 'LED', type: 'digital' },
        ],
        notes: 'No PWM or I2C support, wake from deep sleep',
      },
      {
        pin: 'D1',
        gpio: 5,
        functions: [
          { name: 'SCL', type: 'i2c', description: 'I2C Clock' },
        ],
      },
      {
        pin: 'D2',
        gpio: 4,
        functions: [
          { name: 'SDA', type: 'i2c', description: 'I2C Data' },
        ],
      },
      {
        pin: 'D3',
        gpio: 0,
        functions: [
          { name: 'Flash', type: 'special', description: 'Flash button' },
        ],
        bootState: 'Must be HIGH during boot',
        notes: 'Pulled up, connected to flash button',
      },
      {
        pin: 'D4',
        gpio: 2,
        functions: [
          { name: 'LED', type: 'digital', description: 'Built-in LED' },
          { name: 'TX1', type: 'uart' },
        ],
        bootState: 'Must be HIGH during boot',
        notes: 'Built-in LED, pulled up',
      },
      {
        pin: 'D5',
        gpio: 14,
        functions: [
          { name: 'SCK', type: 'spi', description: 'SPI Clock' },
          { name: 'HSCLK', type: 'spi' },
        ],
      },
      {
        pin: 'D6',
        gpio: 12,
        functions: [
          { name: 'MISO', type: 'spi', description: 'SPI MISO' },
          { name: 'HMISO', type: 'spi' },
        ],
      },
      {
        pin: 'D7',
        gpio: 13,
        functions: [
          { name: 'MOSI', type: 'spi', description: 'SPI MOSI' },
          { name: 'HMOSI', type: 'spi' },
        ],
      },
      {
        pin: 'D8',
        gpio: 15,
        functions: [
          { name: 'SS', type: 'spi', description: 'SPI SS' },
          { name: 'HCS', type: 'spi' },
        ],
        bootState: 'Must be LOW during boot',
        notes: 'Pulled to GND',
      },
      {
        pin: 'D9/RX',
        gpio: 3,
        functions: [
          { name: 'RX', type: 'uart', description: 'UART RX' },
        ],
        notes: 'Serial RX, avoid if using serial monitor',
      },
      {
        pin: 'D10/TX',
        gpio: 1,
        functions: [
          { name: 'TX', type: 'uart', description: 'UART TX' },
        ],
        notes: 'Serial TX, avoid if using serial monitor',
      },
      {
        pin: 'A0',
        gpio: 17,
        functions: [
          { name: 'ADC', type: 'analog', description: 'Analog input 0-1V' },
        ],
        notes: 'Only one analog pin, 0-1V range',
      },
    ],
    notes: [
      'Only 1 analog input (A0)',
      'GPIO 6-11 connected to flash (do not use)',
      'D0 (GPIO16) cannot be used for I2C or PWM',
      'GPIO15 must be LOW at boot',
    ],
  },

  d1_mini: {
    name: 'Wemos D1 Mini',
    platform: 'ESP8266',
    pins: [
      {
        pin: 'D0',
        gpio: 16,
        functions: [{ name: 'Wake', type: 'special' }],
        notes: 'No PWM or I2C, wake from deep sleep',
      },
      {
        pin: 'D1',
        gpio: 5,
        functions: [{ name: 'SCL', type: 'i2c' }],
      },
      {
        pin: 'D2',
        gpio: 4,
        functions: [{ name: 'SDA', type: 'i2c' }],
      },
      {
        pin: 'D3',
        gpio: 0,
        functions: [{ name: 'Flash', type: 'special' }],
        bootState: 'Must be HIGH during boot',
      },
      {
        pin: 'D4',
        gpio: 2,
        functions: [{ name: 'LED', type: 'digital' }],
        bootState: 'Must be HIGH during boot',
        notes: 'Built-in LED',
      },
      {
        pin: 'D5',
        gpio: 14,
        functions: [{ name: 'SCK', type: 'spi' }],
      },
      {
        pin: 'D6',
        gpio: 12,
        functions: [{ name: 'MISO', type: 'spi' }],
      },
      {
        pin: 'D7',
        gpio: 13,
        functions: [{ name: 'MOSI', type: 'spi' }],
      },
      {
        pin: 'D8',
        gpio: 15,
        functions: [{ name: 'SS', type: 'spi' }],
        bootState: 'Must be LOW during boot',
      },
      {
        pin: 'A0',
        gpio: 17,
        functions: [{ name: 'ADC', type: 'analog' }],
        notes: '0-3.3V input (3.3V max!)',
      },
    ],
    notes: [
      'Compact form factor',
      'Only 1 analog input',
      'GPIO15 must be LOW during boot',
    ],
  },
}

export function getPinout(board: string): BoardPinout | undefined {
  return ESP32_PINOUTS[board] || ESP8266_PINOUTS[board]
}

export function validatePinForFunction(
  board: string,
  pin: string,
  functionType: string
): { valid: boolean; message?: string } {
  const pinout = getPinout(board)
  if (!pinout) {
    return { valid: false, message: 'Board not found' }
  }

  const pinInfo = pinout.pins.find((p) => p.pin === pin || p.gpio.toString() === pin)
  if (!pinInfo) {
    return { valid: false, message: `Pin ${pin} not found on board` }
  }

  const hasFunction = pinInfo.functions.some((f) => f.type === functionType)
  if (!hasFunction) {
    return {
      valid: false,
      message: `Pin ${pin} does not support ${functionType}`,
    }
  }

  return { valid: true }
}

export function checkPinConflicts(
  board: string,
  usedPins: Array<{ pin: string; usage: string }>
): Array<{ pin: string; conflict: string }> {
  const conflicts: Array<{ pin: string; conflict: string }> = []
  const pinout = getPinout(board)

  if (!pinout) return conflicts

  // Check for duplicate usage
  const pinUsage = new Map<string, string[]>()
  usedPins.forEach(({ pin, usage }) => {
    if (!pinUsage.has(pin)) {
      pinUsage.set(pin, [])
    }
    pinUsage.get(pin)!.push(usage)
  })

  pinUsage.forEach((usages, pin) => {
    if (usages.length > 1) {
      conflicts.push({
        pin,
        conflict: `Pin used multiple times: ${usages.join(', ')}`,
      })
    }
  })

  return conflicts
}

export function getAvailablePins(
  board: string,
  usedPins: string[],
  functionType?: string
): BoardPin[] {
  const pinout = getPinout(board)
  if (!pinout) return []

  return pinout.pins.filter((pin) => {
    // Check if pin is already used
    if (usedPins.includes(pin.pin) || usedPins.includes(pin.gpio.toString())) {
      return false
    }

    // Check if pin supports the required function
    if (functionType) {
      return pin.functions.some((f) => f.type === functionType)
    }

    return true
  })
}
