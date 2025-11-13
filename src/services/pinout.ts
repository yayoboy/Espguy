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
  platform: 'ESP32' | 'ESP8266' | 'ESP32-S2' | 'ESP32-S3' | 'ESP32-C3' | 'ESP32-C6'
  image?: string
  pins: BoardPin[]
  notes?: string[]
}

// Common ESP32 pin definitions for reuse
const ESP32_COMMON_PINS: BoardPin[] = [
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
]

export const ESP32_PINOUTS: Record<string, BoardPinout> = {
  esp32dev: {
    name: 'ESP32 DevKit',
    platform: 'ESP32',
    pins: ESP32_COMMON_PINS,
    notes: [
      'GPIO 6-11 are connected to the flash memory (do not use)',
      'Input only pins: 34, 35, 36, 39',
      'ADC2 pins cannot be used when WiFi is active',
    ],
  },

  'esp32-wroom-32': {
    name: 'ESP32-WROOM-32',
    platform: 'ESP32',
    pins: ESP32_COMMON_PINS,
    notes: [
      'Standard ESP32-WROOM-32 module',
      'GPIO 6-11 connected to flash',
      'Input only: GPIO 34-39',
    ],
  },

  'esp32-wrover': {
    name: 'ESP32-WROVER',
    platform: 'ESP32',
    pins: [
      ...ESP32_COMMON_PINS,
      {
        pin: 'GPIO37',
        gpio: 37,
        functions: [{ name: 'PSRAM', type: 'special' }],
        notes: 'Used by PSRAM, do not use',
      },
      {
        pin: 'GPIO38',
        gpio: 38,
        functions: [{ name: 'PSRAM', type: 'special' }],
        notes: 'Used by PSRAM, do not use',
      },
    ],
    notes: [
      'ESP32-WROVER with PSRAM',
      'GPIO 37, 38 reserved for PSRAM',
      'GPIO 6-11 connected to flash',
    ],
  },

  'nodemcu-32s': {
    name: 'NodeMCU-32S',
    platform: 'ESP32',
    pins: ESP32_COMMON_PINS,
    notes: [
      'NodeMCU-32S compatible with ESP32 DevKit pinout',
      'D labels correspond to GPIO numbers',
    ],
  },

  'lolin32': {
    name: 'LOLIN D32 / D32 Pro',
    platform: 'ESP32',
    pins: ESP32_COMMON_PINS,
    notes: [
      'LOLIN D32 board',
      'Built-in battery charging circuit',
      'Has TFT display connector (Pro version)',
    ],
  },

  'esp32-s2': {
    name: 'ESP32-S2',
    platform: 'ESP32-S2',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [
          { name: 'Boot', type: 'special' },
          { name: 'ADC1_CH0', type: 'analog' },
        ],
        bootState: 'Must be HIGH during boot',
      },
      {
        pin: 'GPIO1',
        gpio: 1,
        functions: [
          { name: 'ADC1_CH1', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO2',
        gpio: 2,
        functions: [
          { name: 'ADC1_CH2', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO3',
        gpio: 3,
        functions: [
          { name: 'ADC1_CH3', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO4',
        gpio: 4,
        functions: [
          { name: 'ADC1_CH4', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO5',
        gpio: 5,
        functions: [
          { name: 'ADC1_CH5', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO6',
        gpio: 6,
        functions: [
          { name: 'ADC1_CH6', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO7',
        gpio: 7,
        functions: [
          { name: 'ADC1_CH7', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO8',
        gpio: 8,
        functions: [
          { name: 'ADC1_CH8', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO9',
        gpio: 9,
        functions: [
          { name: 'ADC1_CH9', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO10',
        gpio: 10,
        functions: [
          { name: 'ADC1_CH10', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO11',
        gpio: 11,
        functions: [{ name: 'USB_D-', type: 'special' }],
        notes: 'USB D-, avoid if using USB',
      },
      {
        pin: 'GPIO12',
        gpio: 12,
        functions: [{ name: 'USB_D+', type: 'special' }],
        notes: 'USB D+, avoid if using USB',
      },
      {
        pin: 'GPIO18',
        gpio: 18,
        functions: [{ name: 'DAC1', type: 'analog' }],
      },
      {
        pin: 'GPIO19',
        gpio: 19,
        functions: [{ name: 'USB_D-', type: 'special' }],
        notes: 'USB OTG',
      },
      {
        pin: 'GPIO20',
        gpio: 20,
        functions: [{ name: 'USB_D+', type: 'special' }],
        notes: 'USB OTG',
      },
      {
        pin: 'GPIO26',
        gpio: 26,
        functions: [{ name: 'I2C_SDA', type: 'i2c' }],
      },
      {
        pin: 'GPIO27',
        gpio: 27,
        functions: [{ name: 'I2C_SCL', type: 'i2c' }],
      },
      {
        pin: 'GPIO33',
        gpio: 33,
        functions: [{ name: 'SPI_CS', type: 'spi' }],
      },
      {
        pin: 'GPIO34',
        gpio: 34,
        functions: [{ name: 'SPI_CLK', type: 'spi' }],
      },
      {
        pin: 'GPIO35',
        gpio: 35,
        functions: [{ name: 'SPI_MOSI', type: 'spi' }],
      },
      {
        pin: 'GPIO36',
        gpio: 36,
        functions: [{ name: 'SPI_MISO', type: 'spi' }],
      },
      {
        pin: 'GPIO43',
        gpio: 43,
        functions: [{ name: 'TX', type: 'uart' }],
      },
      {
        pin: 'GPIO44',
        gpio: 44,
        functions: [{ name: 'RX', type: 'uart' }],
      },
    ],
    notes: [
      'ESP32-S2 - Single core, USB OTG',
      'No Bluetooth support',
      'Native USB support',
      'More GPIO pins than ESP32',
    ],
  },

  'esp32-s3': {
    name: 'ESP32-S3',
    platform: 'ESP32-S3',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [
          { name: 'Boot', type: 'special' },
          { name: 'ADC1_CH0', type: 'analog' },
        ],
        bootState: 'Must be HIGH during boot',
      },
      {
        pin: 'GPIO1',
        gpio: 1,
        functions: [
          { name: 'ADC1_CH1', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO2',
        gpio: 2,
        functions: [
          { name: 'ADC1_CH2', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO3',
        gpio: 3,
        functions: [
          { name: 'ADC1_CH3', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO4',
        gpio: 4,
        functions: [
          { name: 'ADC1_CH4', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO5',
        gpio: 5,
        functions: [
          { name: 'ADC1_CH5', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO6',
        gpio: 6,
        functions: [
          { name: 'ADC1_CH6', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO7',
        gpio: 7,
        functions: [
          { name: 'ADC1_CH7', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO8',
        gpio: 8,
        functions: [
          { name: 'ADC1_CH8', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO9',
        gpio: 9,
        functions: [
          { name: 'ADC1_CH9', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO10',
        gpio: 10,
        functions: [
          { name: 'ADC1_CH10', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO19',
        gpio: 19,
        functions: [{ name: 'USB_D-', type: 'special' }],
      },
      {
        pin: 'GPIO20',
        gpio: 20,
        functions: [{ name: 'USB_D+', type: 'special' }],
      },
      {
        pin: 'GPIO21',
        gpio: 21,
        functions: [{ name: 'I2C_SDA', type: 'i2c' }],
      },
      {
        pin: 'GPIO22',
        gpio: 22,
        functions: [{ name: 'I2C_SCL', type: 'i2c' }],
      },
      {
        pin: 'GPIO35',
        gpio: 35,
        functions: [{ name: 'SPI_MOSI', type: 'spi' }],
      },
      {
        pin: 'GPIO36',
        gpio: 36,
        functions: [{ name: 'SPI_CLK', type: 'spi' }],
      },
      {
        pin: 'GPIO37',
        gpio: 37,
        functions: [{ name: 'SPI_MISO', type: 'spi' }],
      },
      {
        pin: 'GPIO43',
        gpio: 43,
        functions: [{ name: 'TX', type: 'uart' }],
      },
      {
        pin: 'GPIO44',
        gpio: 44,
        functions: [{ name: 'RX', type: 'uart' }],
      },
    ],
    notes: [
      'ESP32-S3 - Dual core, USB OTG',
      'Bluetooth LE 5.0',
      'Native USB support',
      'Vector instructions for AI acceleration',
    ],
  },

  'esp32-c3': {
    name: 'ESP32-C3',
    platform: 'ESP32-C3',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [
          { name: 'ADC1_CH0', type: 'analog' },
          { name: 'XTAL_32K_P', type: 'special' },
        ],
      },
      {
        pin: 'GPIO1',
        gpio: 1,
        functions: [
          { name: 'ADC1_CH1', type: 'analog' },
          { name: 'XTAL_32K_N', type: 'special' },
        ],
      },
      {
        pin: 'GPIO2',
        gpio: 2,
        functions: [
          { name: 'ADC1_CH2', type: 'analog' },
          { name: 'FSPIQ', type: 'spi' },
        ],
      },
      {
        pin: 'GPIO3',
        gpio: 3,
        functions: [
          { name: 'ADC1_CH3', type: 'analog' },
        ],
      },
      {
        pin: 'GPIO4',
        gpio: 4,
        functions: [
          { name: 'ADC1_CH4', type: 'analog' },
          { name: 'FSPIHD', type: 'spi' },
        ],
      },
      {
        pin: 'GPIO5',
        gpio: 5,
        functions: [
          { name: 'ADC2_CH0', type: 'analog' },
          { name: 'FSPIWP', type: 'spi' },
        ],
      },
      {
        pin: 'GPIO6',
        gpio: 6,
        functions: [
          { name: 'FSPICLK', type: 'spi' },
        ],
        notes: 'Flash CLK, do not use',
      },
      {
        pin: 'GPIO7',
        gpio: 7,
        functions: [
          { name: 'FSPID', type: 'spi' },
        ],
        notes: 'Flash data, do not use',
      },
      {
        pin: 'GPIO8',
        gpio: 8,
        functions: [
          { name: 'I2C_SDA', type: 'i2c' },
        ],
      },
      {
        pin: 'GPIO9',
        gpio: 9,
        functions: [
          { name: 'Boot', type: 'special' },
        ],
        bootState: 'Boot button',
      },
      {
        pin: 'GPIO10',
        gpio: 10,
        functions: [
          { name: 'I2C_SCL', type: 'i2c' },
        ],
      },
      {
        pin: 'GPIO18',
        gpio: 18,
        functions: [
          { name: 'USB_D-', type: 'special' },
        ],
      },
      {
        pin: 'GPIO19',
        gpio: 19,
        functions: [
          { name: 'USB_D+', type: 'special' },
        ],
      },
      {
        pin: 'GPIO20',
        gpio: 20,
        functions: [
          { name: 'TX', type: 'uart' },
          { name: 'U0TXD', type: 'uart' },
        ],
      },
      {
        pin: 'GPIO21',
        gpio: 21,
        functions: [
          { name: 'RX', type: 'uart' },
          { name: 'U0RXD', type: 'uart' },
        ],
      },
    ],
    notes: [
      'ESP32-C3 - RISC-V single core',
      'Bluetooth LE 5.0',
      'Native USB Serial/JTAG',
      'Lower power consumption',
    ],
  },

  'esp32cam': {
    name: 'ESP32-CAM (AI-Thinker)',
    platform: 'ESP32',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [{ name: 'Camera', type: 'special' }],
        notes: 'Camera XCLK, avoid',
      },
      {
        pin: 'GPIO1',
        gpio: 1,
        functions: [{ name: 'TX', type: 'uart' }],
      },
      {
        pin: 'GPIO2',
        gpio: 2,
        functions: [{ name: 'LED', type: 'digital' }],
        notes: 'Flash LED',
      },
      {
        pin: 'GPIO3',
        gpio: 3,
        functions: [{ name: 'RX', type: 'uart' }],
      },
      {
        pin: 'GPIO4',
        gpio: 4,
        functions: [{ name: 'LED', type: 'digital' }],
        notes: 'Built-in LED',
      },
      {
        pin: 'GPIO12',
        gpio: 12,
        functions: [{ name: 'SD_D2', type: 'special' }],
        notes: 'SD card D2',
      },
      {
        pin: 'GPIO13',
        gpio: 13,
        functions: [{ name: 'SD_D3', type: 'special' }],
        notes: 'SD card D3/CS',
      },
      {
        pin: 'GPIO14',
        gpio: 14,
        functions: [{ name: 'SD_CLK', type: 'special' }],
        notes: 'SD card CLK',
      },
      {
        pin: 'GPIO15',
        gpio: 15,
        functions: [{ name: 'SD_CMD', type: 'special' }],
        notes: 'SD card CMD',
      },
      {
        pin: 'GPIO16',
        gpio: 16,
        functions: [{ name: 'PSRAM', type: 'special' }],
        notes: 'PSRAM, do not use',
      },
    ],
    notes: [
      'ESP32-CAM with OV2640 camera',
      'Most GPIO used by camera',
      'GPIO 1, 3 for programming',
      'GPIO 12-15 for SD card',
      'Very limited free GPIO',
    ],
  },

  'm5stack-core': {
    name: 'M5Stack Core',
    platform: 'ESP32',
    pins: [
      {
        pin: 'GPIO21',
        gpio: 21,
        functions: [{ name: 'I2C_SDA', type: 'i2c' }],
        notes: 'Internal I2C for peripherals',
      },
      {
        pin: 'GPIO22',
        gpio: 22,
        functions: [{ name: 'I2C_SCL', type: 'i2c' }],
        notes: 'Internal I2C for peripherals',
      },
      {
        pin: 'GPIO25',
        gpio: 25,
        functions: [{ name: 'Speaker', type: 'pwm' }],
        notes: 'Internal speaker',
      },
      {
        pin: 'GPIO26',
        gpio: 26,
        functions: [{ name: 'DAC', type: 'analog' }],
      },
      {
        pin: 'GPIO32',
        gpio: 32,
        functions: [{ name: 'LCD_BL', type: 'pwm' }],
        notes: 'LCD backlight',
      },
      {
        pin: 'GPIO36',
        gpio: 36,
        functions: [{ name: 'Button_A', type: 'digital' }],
        notes: 'Input only',
      },
      {
        pin: 'GPIO37',
        gpio: 37,
        functions: [{ name: 'Button_B', type: 'digital' }],
        notes: 'Input only',
      },
      {
        pin: 'GPIO38',
        gpio: 38,
        functions: [{ name: 'Button_C', type: 'digital' }],
        notes: 'Input only',
      },
      {
        pin: 'GPIO39',
        gpio: 39,
        functions: [{ name: 'MIC', type: 'analog' }],
        notes: 'Internal microphone',
      },
    ],
    notes: [
      'M5Stack Core - All-in-one ESP32',
      'Built-in 2" LCD, speaker, buttons',
      'Most GPIO used internally',
      'Use port A, B, C for external connections',
    ],
  },

  'ttgo-t-display': {
    name: 'TTGO T-Display',
    platform: 'ESP32',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [{ name: 'Button_1', type: 'digital' }],
        notes: 'Built-in button 1',
      },
      {
        pin: 'GPIO35',
        gpio: 35,
        functions: [{ name: 'Button_2', type: 'digital' }],
        notes: 'Built-in button 2',
      },
      {
        pin: 'GPIO4',
        gpio: 4,
        functions: [{ name: 'TFT_BL', type: 'pwm' }],
        notes: 'TFT backlight',
      },
      {
        pin: 'GPIO16',
        gpio: 16,
        functions: [{ name: 'TFT_CS', type: 'spi' }],
        notes: 'TFT chip select',
      },
      {
        pin: 'GPIO17',
        gpio: 17,
        functions: [{ name: 'TFT_DC', type: 'spi' }],
        notes: 'TFT data/command',
      },
      {
        pin: 'GPIO18',
        gpio: 18,
        functions: [{ name: 'TFT_CLK', type: 'spi' }],
        notes: 'TFT clock',
      },
      {
        pin: 'GPIO19',
        gpio: 19,
        functions: [{ name: 'TFT_MOSI', type: 'spi' }],
        notes: 'TFT data',
      },
      {
        pin: 'GPIO21',
        gpio: 21,
        functions: [{ name: 'I2C_SDA', type: 'i2c' }],
      },
      {
        pin: 'GPIO22',
        gpio: 22,
        functions: [{ name: 'I2C_SCL', type: 'i2c' }],
      },
    ],
    notes: [
      'TTGO T-Display with 1.14" TFT',
      'Built-in display uses SPI',
      'Two programmable buttons',
      'Battery charging circuit',
    ],
  },

  'huzzah32': {
    name: 'Adafruit HUZZAH32',
    platform: 'ESP32',
    pins: ESP32_COMMON_PINS,
    notes: [
      'Adafruit Feather HUZZAH32',
      'Feather form factor',
      'Built-in LiPo charger',
      'STEMMA QT connector',
    ],
  },

  'firebeetle-esp32': {
    name: 'FireBeetle ESP32',
    platform: 'ESP32',
    pins: ESP32_COMMON_PINS,
    notes: [
      'DFRobot FireBeetle ESP32',
      'Low power design',
      'Built-in LiPo charger',
      'IO expansion pins',
    ],
  },
}

export const ESP8266_PINOUTS: Record<string, BoardPinout> = {
  nodemcuv2: {
    name: 'NodeMCU V2 / V3',
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
      'NodeMCU V2 and V3 compatible',
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
      'Many shields available',
    ],
  },

  'd1-mini-pro': {
    name: 'Wemos D1 Mini Pro',
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
      },
    ],
    notes: [
      'D1 Mini Pro with 16MB flash',
      'External antenna connector',
      'Higher flash capacity than D1 Mini',
    ],
  },

  'esp01': {
    name: 'ESP-01 / ESP-01S',
    platform: 'ESP8266',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [{ name: 'Flash', type: 'special' }],
        bootState: 'Must be HIGH during boot',
        notes: 'Flash mode if LOW at boot',
      },
      {
        pin: 'GPIO1',
        gpio: 1,
        functions: [{ name: 'TX', type: 'uart' }],
        notes: 'Serial TX',
      },
      {
        pin: 'GPIO2',
        gpio: 2,
        functions: [{ name: 'LED', type: 'digital' }],
        bootState: 'Must be HIGH during boot',
        notes: 'Built-in LED on ESP-01S',
      },
      {
        pin: 'GPIO3',
        gpio: 3,
        functions: [{ name: 'RX', type: 'uart' }],
        notes: 'Serial RX',
      },
    ],
    notes: [
      'ESP-01 - Very limited GPIO',
      'Only 4 GPIO pins exposed',
      'No USB, requires FTDI adapter',
      'Recommended for simple WiFi-only projects',
    ],
  },

  'esp07': {
    name: 'ESP-07 / ESP-12E/F',
    platform: 'ESP8266',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [{ name: 'Flash', type: 'special' }],
        bootState: 'Must be HIGH during boot',
      },
      {
        pin: 'GPIO1',
        gpio: 1,
        functions: [{ name: 'TX', type: 'uart' }],
      },
      {
        pin: 'GPIO2',
        gpio: 2,
        functions: [{ name: 'LED', type: 'digital' }],
        bootState: 'Must be HIGH during boot',
      },
      {
        pin: 'GPIO3',
        gpio: 3,
        functions: [{ name: 'RX', type: 'uart' }],
      },
      {
        pin: 'GPIO4',
        gpio: 4,
        functions: [{ name: 'SDA', type: 'i2c' }],
      },
      {
        pin: 'GPIO5',
        gpio: 5,
        functions: [{ name: 'SCL', type: 'i2c' }],
      },
      {
        pin: 'GPIO12',
        gpio: 12,
        functions: [{ name: 'MISO', type: 'spi' }],
      },
      {
        pin: 'GPIO13',
        gpio: 13,
        functions: [{ name: 'MOSI', type: 'spi' }],
      },
      {
        pin: 'GPIO14',
        gpio: 14,
        functions: [{ name: 'SCK', type: 'spi' }],
      },
      {
        pin: 'GPIO15',
        gpio: 15,
        functions: [{ name: 'SS', type: 'spi' }],
        bootState: 'Must be LOW during boot',
      },
      {
        pin: 'GPIO16',
        gpio: 16,
        functions: [{ name: 'Wake', type: 'special' }],
        notes: 'Deep sleep wake',
      },
      {
        pin: 'ADC',
        gpio: 17,
        functions: [{ name: 'ADC', type: 'analog' }],
      },
    ],
    notes: [
      'ESP-07/ESP-12E/F module',
      'More GPIO than ESP-01',
      'External antenna (ESP-07)',
      'PCB antenna (ESP-12E/F)',
      'Requires breakout board',
    ],
  },

  'huzzah-esp8266': {
    name: 'Adafruit Feather HUZZAH ESP8266',
    platform: 'ESP8266',
    pins: [
      {
        pin: 'GPIO0',
        gpio: 0,
        functions: [{ name: 'Flash', type: 'special' }],
        bootState: 'Must be HIGH during boot',
      },
      {
        pin: 'GPIO2',
        gpio: 2,
        functions: [{ name: 'LED', type: 'digital' }],
        bootState: 'Must be HIGH during boot',
        notes: 'Red LED',
      },
      {
        pin: 'GPIO4',
        gpio: 4,
        functions: [{ name: 'SDA', type: 'i2c' }],
      },
      {
        pin: 'GPIO5',
        gpio: 5,
        functions: [{ name: 'SCL', type: 'i2c' }],
      },
      {
        pin: 'GPIO12',
        gpio: 12,
        functions: [{ name: 'MISO', type: 'spi' }],
      },
      {
        pin: 'GPIO13',
        gpio: 13,
        functions: [{ name: 'MOSI', type: 'spi' }],
      },
      {
        pin: 'GPIO14',
        gpio: 14,
        functions: [{ name: 'SCK', type: 'spi' }],
      },
      {
        pin: 'GPIO15',
        gpio: 15,
        functions: [{ name: 'SS', type: 'spi' }],
        bootState: 'Must be LOW during boot',
      },
      {
        pin: 'GPIO16',
        gpio: 16,
        functions: [{ name: 'Wake', type: 'special' }],
      },
      {
        pin: 'A0',
        gpio: 17,
        functions: [{ name: 'ADC', type: 'analog' }],
      },
    ],
    notes: [
      'Adafruit Feather form factor',
      'Built-in LiPo charger',
      'USB-to-Serial built-in',
      'FeatherWing compatible',
    ],
  },

  'd1-r1': {
    name: 'Wemos D1 R1 / R2',
    platform: 'ESP8266',
    pins: [
      {
        pin: 'D0',
        gpio: 3,
        functions: [{ name: 'RX', type: 'uart' }],
      },
      {
        pin: 'D1',
        gpio: 1,
        functions: [{ name: 'TX', type: 'uart' }],
      },
      {
        pin: 'D2',
        gpio: 16,
        functions: [{ name: 'Wake', type: 'special' }],
      },
      {
        pin: 'D3',
        gpio: 5,
        functions: [{ name: 'SCL', type: 'i2c' }],
      },
      {
        pin: 'D4',
        gpio: 4,
        functions: [{ name: 'SDA', type: 'i2c' }],
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
        gpio: 0,
        functions: [{ name: 'Flash', type: 'special' }],
        bootState: 'Must be HIGH during boot',
      },
      {
        pin: 'D9',
        gpio: 2,
        functions: [{ name: 'LED', type: 'digital' }],
        bootState: 'Must be HIGH during boot',
      },
      {
        pin: 'D10',
        gpio: 15,
        functions: [{ name: 'SS', type: 'spi' }],
        bootState: 'Must be LOW during boot',
      },
      {
        pin: 'A0',
        gpio: 17,
        functions: [{ name: 'ADC', type: 'analog' }],
      },
    ],
    notes: [
      'Arduino Uno form factor',
      'More pins than D1 Mini',
      'Shield compatible',
      'Different pin mapping than NodeMCU',
    ],
  },
}

export function getPinout(board: string, platform?: string): BoardPinout | undefined {
  // Try to find the exact board first
  const exactMatch = ESP32_PINOUTS[board] || ESP8266_PINOUTS[board]
  if (exactMatch) return exactMatch

  // If no exact match but platform is provided, return a default board for that platform
  if (platform) {
    if (platform.toUpperCase().includes('ESP32')) {
      console.warn(`Board '${board}' not found, using default ESP32 board`)
      return ESP32_PINOUTS['esp32dev']
    } else if (platform.toUpperCase().includes('ESP8266')) {
      console.warn(`Board '${board}' not found, using default ESP8266 board`)
      return ESP8266_PINOUTS['nodemcuv2']
    }
  }

  return undefined
}

export function getAllBoards(): Array<{ id: string; name: string; platform: string }> {
  const boards: Array<{ id: string; name: string; platform: string }> = []

  Object.entries(ESP32_PINOUTS).forEach(([id, pinout]) => {
    boards.push({ id, name: pinout.name, platform: pinout.platform })
  })

  Object.entries(ESP8266_PINOUTS).forEach(([id, pinout]) => {
    boards.push({ id, name: pinout.name, platform: pinout.platform })
  })

  return boards.sort((a, b) => a.name.localeCompare(b.name))
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
