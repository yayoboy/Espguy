// COMPREHENSIVE ESPHome Component Templates
// Total: 150+ components across 20+ categories

import { ComponentTemplate } from './templates'

export const EXTENDED_COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // ============================================
  // ENVIRONMENTAL SENSORS (Temperature, Humidity, Pressure)
  // ============================================
  {
    id: 'dht11',
    name: 'DHT11 Temperature & Humidity',
    category: 'Sensors - Environmental',
    platform: 'sensor',
    description: 'DHT11 basic temperature and humidity sensor',
    icon: 'Thermometer',
    config: {
      platform: 'dht',
      pin: 'D4',
      model: 'DHT11',
      temperature: { name: 'Temperature' },
      humidity: { name: 'Humidity' },
      update_interval: '60s',
    },
    requiredFields: ['pin'],
  },
  {
    id: 'am2320',
    name: 'AM2320 Temperature & Humidity',
    category: 'Sensors - Environmental',
    platform: 'sensor',
    description: 'I2C temperature and humidity sensor',
    icon: 'Thermometer',
    config: {
      platform: 'am2320',
      temperature: { name: 'Temperature' },
      humidity: { name: 'Humidity' },
      update_interval: '60s',
    },
  },
  {
    id: 'sht3xd',
    name: 'SHT3x-D Temperature & Humidity',
    category: 'Sensors - Environmental',
    platform: 'sensor',
    description: 'High accuracy I2C temperature and humidity sensor',
    icon: 'Thermometer',
    config: {
      platform: 'sht3xd',
      address: '0x44',
      temperature: { name: 'Temperature' },
      humidity: { name: 'Humidity' },
      update_interval: '60s',
    },
  },
  {
    id: 'bmp280',
    name: 'BMP280 Temperature & Pressure',
    category: 'Sensors - Environmental',
    platform: 'sensor',
    description: 'I2C barometric pressure and temperature sensor',
    icon: 'Gauge',
    config: {
      platform: 'bmp280',
      address: '0x77',
      temperature: { name: 'Temperature' },
      pressure: { name: 'Pressure' },
      update_interval: '60s',
    },
  },
  {
    id: 'bmp085',
    name: 'BMP085/BMP180 Pressure',
    category: 'Sensors - Environmental',
    platform: 'sensor',
    description: 'I2C pressure sensor',
    icon: 'Gauge',
    config: {
      platform: 'bmp085',
      address: '0x77',
      temperature: { name: 'Temperature' },
      pressure: { name: 'Pressure' },
      update_interval: '60s',
    },
  },

  // ============================================
  // LIGHT SENSORS
  // ============================================
  {
    id: 'tsl2561',
    name: 'TSL2561 Light Sensor',
    category: 'Sensors - Light',
    platform: 'sensor',
    description: 'I2C ambient light sensor',
    icon: 'Sun',
    config: {
      platform: 'tsl2561',
      address: '0x39',
      name: 'Illuminance',
      update_interval: '60s',
    },
  },
  {
    id: 'max44009',
    name: 'MAX44009 Light Sensor',
    category: 'Sensors - Light',
    platform: 'sensor',
    description: 'I2C ambient light sensor',
    icon: 'Sun',
    config: {
      platform: 'max44009',
      address: '0x4A',
      name: 'Illuminance',
      update_interval: '60s',
    },
  },
  {
    id: 'photoresistor',
    name: 'Photoresistor (LDR)',
    category: 'Sensors - Light',
    platform: 'sensor',
    description: 'Analog light sensor',
    icon: 'Sun',
    config: {
      platform: 'adc',
      pin: 'A0',
      name: 'Light Level',
      update_interval: '60s',
    },
    requiredFields: ['pin'],
  },

  // ============================================
  // AIR QUALITY SENSORS
  // ============================================
  {
    id: 'mhz19',
    name: 'MH-Z19 CO2 Sensor',
    category: 'Sensors - Air Quality',
    platform: 'sensor',
    description: 'UART CO2 sensor',
    icon: 'Wind',
    config: {
      platform: 'mhz19',
      co2: { name: 'CO2' },
      temperature: { name: 'Temperature' },
      update_interval: '60s',
    },
  },
  {
    id: 'sds011',
    name: 'SDS011 Particulate Matter',
    category: 'Sensors - Air Quality',
    platform: 'sensor',
    description: 'UART PM2.5 and PM10 sensor',
    icon: 'Wind',
    config: {
      platform: 'sds011',
      pm_2_5: { name: 'PM 2.5' },
      pm_10_0: { name: 'PM 10' },
      update_interval: '60s',
    },
  },
  {
    id: 'pmsx003',
    name: 'PMS5003/PMS7003 PM Sensor',
    category: 'Sensors - Air Quality',
    platform: 'sensor',
    description: 'UART particulate matter sensor',
    icon: 'Wind',
    config: {
      platform: 'pmsx003',
      type: 'PMS5003',
      pm_1_0: { name: 'PM 1.0' },
      pm_2_5: { name: 'PM 2.5' },
      pm_10_0: { name: 'PM 10' },
      update_interval: '60s',
    },
  },
  {
    id: 'ccs811',
    name: 'CCS811 CO2 & VOC',
    category: 'Sensors - Air Quality',
    platform: 'sensor',
    description: 'I2C air quality sensor',
    icon: 'Wind',
    config: {
      platform: 'ccs811',
      address: '0x5A',
      eco2: { name: 'eCO2' },
      tvoc: { name: 'TVOC' },
      update_interval: '60s',
    },
  },

  // ============================================
  // MOTION & PROXIMITY SENSORS
  // ============================================
  {
    id: 'rcwl0516',
    name: 'RCWL-0516 Microwave Radar',
    category: 'Binary Sensors - Motion',
    platform: 'binary_sensor',
    description: 'Microwave motion detection',
    icon: 'Activity',
    config: {
      platform: 'gpio',
      pin: 'D1',
      name: 'Motion',
      device_class: 'motion',
    },
    requiredFields: ['pin'],
  },
  {
    id: 'ld2410',
    name: 'LD2410 mmWave Radar',
    category: 'Binary Sensors - Motion',
    platform: 'binary_sensor',
    description: '24GHz presence detection radar',
    icon: 'Activity',
    config: {
      platform: 'ld2410',
      name: 'Presence',
    },
  },
  {
    id: 'vl53l0x',
    name: 'VL53L0X ToF Distance',
    category: 'Sensors - Distance',
    platform: 'sensor',
    description: 'I2C Time-of-Flight distance sensor',
    icon: 'Ruler',
    config: {
      platform: 'vl53l0x',
      address: '0x29',
      name: 'Distance',
      update_interval: '60s',
    },
  },
  {
    id: 'hcsr501',
    name: 'HC-SR501 PIR',
    category: 'Binary Sensors - Motion',
    platform: 'binary_sensor',
    description: 'Standard PIR motion sensor',
    icon: 'Activity',
    config: {
      platform: 'gpio',
      pin: 'D2',
      name: 'Motion',
      device_class: 'motion',
    },
    requiredFields: ['pin'],
  },

  // ============================================
  // ENERGY MONITORING
  // ============================================
  {
    id: 'cse7766',
    name: 'CSE7766 Power Monitor',
    category: 'Sensors - Energy',
    platform: 'sensor',
    description: 'UART power monitoring chip (Sonoff Pow)',
    icon: 'Zap',
    config: {
      platform: 'cse7766',
      voltage: { name: 'Voltage' },
      current: { name: 'Current' },
      power: { name: 'Power' },
      update_interval: '60s',
    },
  },
  {
    id: 'hlw8012',
    name: 'HLW8012 Power Monitor',
    category: 'Sensors - Energy',
    platform: 'sensor',
    description: 'Power monitoring chip',
    icon: 'Zap',
    config: {
      platform: 'hlw8012',
      sel_pin: 'D5',
      cf_pin: 'D6',
      cf1_pin: 'D7',
      voltage: { name: 'Voltage' },
      current: { name: 'Current' },
      power: { name: 'Power' },
      update_interval: '60s',
    },
    requiredFields: ['sel_pin', 'cf_pin', 'cf1_pin'],
  },
  {
    id: 'pzem004t',
    name: 'PZEM-004T Power Monitor',
    category: 'Sensors - Energy',
    platform: 'sensor',
    description: 'UART power monitor with display',
    icon: 'Zap',
    config: {
      platform: 'pzem004t',
      voltage: { name: 'Voltage' },
      current: { name: 'Current' },
      power: { name: 'Power' },
      update_interval: '60s',
    },
  },
  {
    id: 'ina219',
    name: 'INA219 Current/Voltage',
    category: 'Sensors - Energy',
    platform: 'sensor',
    description: 'I2C current and voltage sensor',
    icon: 'Zap',
    config: {
      platform: 'ina219',
      address: '0x40',
      shunt_resistance: '0.1 ohm',
      max_current: '3.2A',
      bus_voltage: { name: 'Bus Voltage' },
      shunt_voltage: { name: 'Shunt Voltage' },
      current: { name: 'Current' },
      power: { name: 'Power' },
      update_interval: '60s',
    },
  },

  // ============================================
  // ADVANCED LIGHT PLATFORMS
  // ============================================
  {
    id: 'neopixelbus',
    name: 'NeoPixelBus LED Strip',
    category: 'Lights - Addressable',
    platform: 'light',
    description: 'High-performance addressable LED library',
    icon: 'Lightbulb',
    config: {
      platform: 'neopixelbus',
      type: 'GRB',
      variant: 'WS2812',
      pin: 'D4',
      num_leds: 60,
      name: 'LED Strip',
      method: 'ESP8266_DMA',
    },
    requiredFields: ['pin', 'num_leds'],
  },
  {
    id: 'rgbw_light',
    name: 'RGBW Light',
    category: 'Lights - RGB',
    platform: 'light',
    description: 'RGBW LED with white channel',
    icon: 'Lightbulb',
    config: {
      platform: 'rgbw',
      name: 'RGBW Light',
      red: 'output_red',
      green: 'output_green',
      blue: 'output_blue',
      white: 'output_white',
    },
    requiredFields: ['red', 'green', 'blue', 'white'],
  },
  {
    id: 'rgbww_light',
    name: 'RGBWW Light',
    category: 'Lights - RGB',
    platform: 'light',
    description: 'RGB with warm/cold white',
    icon: 'Lightbulb',
    config: {
      platform: 'rgbww',
      name: 'RGBWW Light',
      red: 'output_red',
      green: 'output_green',
      blue: 'output_blue',
      cold_white: 'output_cold_white',
      warm_white: 'output_warm_white',
      cold_white_color_temperature: '6500 K',
      warm_white_color_temperature: '2700 K',
    },
  },
  {
    id: 'monochromatic',
    name: 'Monochromatic Light',
    category: 'Lights - Basic',
    platform: 'light',
    description: 'Single channel dimmable light',
    icon: 'Lightbulb',
    config: {
      platform: 'monochromatic',
      name: 'Dimmable Light',
      output: 'pwm_output',
    },
  },
  {
    id: 'binary_light',
    name: 'Binary Light',
    category: 'Lights - Basic',
    platform: 'light',
    description: 'Simple on/off light',
    icon: 'Lightbulb',
    config: {
      platform: 'binary',
      name: 'Light',
      output: 'gpio_output',
    },
  },

  // ============================================
  // CLIMATE CONTROLS
  // ============================================
  {
    id: 'bang_bang',
    name: 'Bang Bang Climate',
    category: 'Climate',
    platform: 'climate',
    description: 'Simple thermostat control',
    icon: 'Thermometer',
    config: {
      platform: 'bang_bang',
      name: 'Thermostat',
      sensor: 'temperature_sensor',
      default_target_temperature_low: 20,
      default_target_temperature_high: 22,
      heat_action: [],
      cool_action: [],
    },
  },
  {
    id: 'thermostat',
    name: 'PID Thermostat',
    category: 'Climate',
    platform: 'climate',
    description: 'PID control thermostat',
    icon: 'Thermometer',
    config: {
      platform: 'thermostat',
      name: 'Thermostat',
      sensor: 'temperature_sensor',
      heat_action: [],
      cool_action: [],
      default_target_temperature: 21,
    },
  },
  {
    id: 'midea_ac',
    name: 'Midea AC',
    category: 'Climate',
    platform: 'climate',
    description: 'Midea air conditioner control',
    icon: 'Wind',
    config: {
      platform: 'midea_ac',
      name: 'AC',
      beeper: true,
    },
  },

  // ============================================
  // DISPLAYS
  // ============================================
  {
    id: 'lcd_display',
    name: 'LCD Display (PCF8574)',
    category: 'Display',
    platform: 'display',
    description: 'I2C LCD display',
    icon: 'Monitor',
    config: {
      platform: 'lcd_pcf8574',
      dimensions: '16x2',
      address: '0x27',
      lambda: 'it.print("Hello World!");',
    },
  },
  {
    id: 'max7219',
    name: 'MAX7219 LED Matrix',
    category: 'Display',
    platform: 'display',
    description: 'SPI LED matrix display',
    icon: 'Monitor',
    config: {
      platform: 'max7219',
      cs_pin: 'D8',
      num_chips: 1,
      lambda: 'it.print("8x8");',
    },
    requiredFields: ['cs_pin'],
  },
  {
    id: 'ssd1325',
    name: 'SSD1325 OLED',
    category: 'Display',
    platform: 'display',
    description: 'SPI OLED display',
    icon: 'Monitor',
    config: {
      platform: 'ssd1325_spi',
      model: 'SSD1325_128X64',
      cs_pin: 'D8',
      dc_pin: 'D7',
      reset_pin: 'D6',
      lambda: 'it.print(0, 0, "Hello");',
    },
  },

  // ============================================
  // COVERS & MOTORS
  // ============================================
  {
    id: 'time_based_cover',
    name: 'Time Based Cover',
    category: 'Cover',
    platform: 'cover',
    description: 'Cover with timed movement',
    icon: 'Blinds',
    config: {
      platform: 'time_based',
      name: 'Blinds',
      open_action: [],
      close_action: [],
      stop_action: [],
      open_duration: '30s',
      close_duration: '30s',
    },
  },
  {
    id: 'endstop_cover',
    name: 'Endstop Cover',
    category: 'Cover',
    platform: 'cover',
    description: 'Cover with endstop sensors',
    icon: 'Blinds',
    config: {
      platform: 'endstop',
      name: 'Garage Door',
      open_action: [],
      close_action: [],
      stop_action: [],
      open_endstop: 'open_sensor',
      close_endstop: 'close_sensor',
    },
  },

  // ============================================
  // ADVANCED BINARY SENSORS
  // ============================================
  {
    id: 'ttp229',
    name: 'TTP229 Touch Buttons',
    category: 'Binary Sensors - Touch',
    platform: 'binary_sensor',
    description: 'I2C touch sensor',
    icon: 'Hand',
    config: {
      platform: 'ttp229_bsf',
      name: 'Touch Button 1',
      channel: 0,
    },
  },
  {
    id: 'esp32_touch',
    name: 'ESP32 Touch Pin',
    category: 'Binary Sensors - Touch',
    platform: 'binary_sensor',
    description: 'Built-in ESP32 touch sensor',
    icon: 'Hand',
    config: {
      platform: 'esp32_touch',
      name: 'Touch Pad',
      pin: 'GPIO4',
      threshold: 1000,
    },
    requiredFields: ['pin'],
  },
  {
    id: 'mpr121',
    name: 'MPR121 Touch Sensor',
    category: 'Binary Sensors - Touch',
    platform: 'binary_sensor',
    description: 'I2C capacitive touch sensor',
    icon: 'Hand',
    config: {
      platform: 'mpr121',
      id: 'mpr121_component',
      address: '0x5A',
      channel: 0,
      name: 'Touch Channel 0',
    },
  },
  {
    id: 'template_binary',
    name: 'Template Binary Sensor',
    category: 'Binary Sensors - Advanced',
    platform: 'binary_sensor',
    description: 'Custom binary sensor with lambda',
    icon: 'Code',
    config: {
      platform: 'template',
      name: 'Template Binary Sensor',
      lambda: 'return false;',
    },
  },

  // ============================================
  // ADVANCED SWITCHES
  // ============================================
  {
    id: 'uart_switch',
    name: 'UART Switch',
    category: 'Switches - Communication',
    platform: 'switch',
    description: 'Send UART commands',
    icon: 'ToggleLeft',
    config: {
      platform: 'uart',
      name: 'UART Switch',
      data: [0x11, 0x22, 0x33],
    },
  },
  {
    id: 'template_switch',
    name: 'Template Switch',
    category: 'Switches - Advanced',
    platform: 'switch',
    description: 'Custom switch with lambda',
    icon: 'Code',
    config: {
      platform: 'template',
      name: 'Template Switch',
      turn_on_action: [],
      turn_off_action: [],
      optimistic: true,
    },
  },
  {
    id: 'restart_switch',
    name: 'Restart Switch',
    category: 'Switches - System',
    platform: 'switch',
    description: 'Restart ESP device',
    icon: 'RotateCw',
    config: {
      platform: 'restart',
      name: 'Restart',
    },
  },
  {
    id: 'shutdown_switch',
    name: 'Shutdown Switch',
    category: 'Switches - System',
    platform: 'switch',
    description: 'Deep sleep mode',
    icon: 'Power',
    config: {
      platform: 'shutdown',
      name: 'Shutdown',
    },
  },

  // ============================================
  // MEDIA & SOUND
  // ============================================
  {
    id: 'dfplayer',
    name: 'DFPlayer Mini MP3',
    category: 'Media',
    platform: 'dfplayer',
    description: 'UART MP3 player module',
    icon: 'Music',
    config: {
      on_finished_playback: [],
    },
  },
  {
    id: 'i2s_audio',
    name: 'I2S Audio',
    category: 'Media',
    platform: 'i2s_audio',
    description: 'I2S audio output',
    icon: 'Speaker',
    config: {
      i2s_lrclk_pin: 'GPIO25',
      i2s_bclk_pin: 'GPIO26',
    },
  },
  {
    id: 'rtttl',
    name: 'RTTTL Buzzer',
    category: 'Media',
    platform: 'rtttl',
    description: 'Play ringtones on buzzer',
    icon: 'Music',
    config: {
      output: 'buzzer_output',
    },
  },

  // ============================================
  // COMMUNICATION PROTOCOLS
  // ============================================
  {
    id: 'i2c_bus',
    name: 'I2C Bus',
    category: 'Communication',
    platform: 'i2c',
    description: 'I2C bus configuration',
    icon: 'Cable',
    config: {
      sda: 'GPIO21',
      scl: 'GPIO22',
      scan: true,
      frequency: '100kHz',
    },
  },
  {
    id: 'spi_bus',
    name: 'SPI Bus',
    category: 'Communication',
    platform: 'spi',
    description: 'SPI bus configuration',
    icon: 'Cable',
    config: {
      clk_pin: 'GPIO18',
      mosi_pin: 'GPIO23',
      miso_pin: 'GPIO19',
    },
  },
  {
    id: 'uart_bus',
    name: 'UART Bus',
    category: 'Communication',
    platform: 'uart',
    description: 'UART serial configuration',
    icon: 'Cable',
    config: {
      tx_pin: 'GPIO1',
      rx_pin: 'GPIO3',
      baud_rate: 9600,
    },
  },
  {
    id: 'canbus',
    name: 'CAN Bus',
    category: 'Communication',
    platform: 'canbus',
    description: 'CAN bus communication',
    icon: 'Cable',
    config: {
      platform: 'esp32_can',
      tx_pin: 'GPIO5',
      rx_pin: 'GPIO4',
      can_id: 4,
      bit_rate: '125kbps',
    },
  },
  {
    id: 'modbus',
    name: 'Modbus',
    category: 'Communication',
    platform: 'modbus',
    description: 'Modbus protocol',
    icon: 'Cable',
    config: {
      flow_control_pin: 'GPIO5',
    },
  },

  // ============================================
  // ADVANCED SENSORS
  // ============================================
  {
    id: 'uptime',
    name: 'Uptime Sensor',
    category: 'Sensors - System',
    platform: 'sensor',
    description: 'Device uptime',
    icon: 'Clock',
    config: {
      platform: 'uptime',
      name: 'Uptime',
    },
  },
  {
    id: 'wifi_signal',
    name: 'WiFi Signal Strength',
    category: 'Sensors - System',
    platform: 'sensor',
    description: 'WiFi RSSI sensor',
    icon: 'Wifi',
    config: {
      platform: 'wifi_signal',
      name: 'WiFi Signal',
      update_interval: '60s',
    },
  },
  {
    id: 'template_sensor',
    name: 'Template Sensor',
    category: 'Sensors - Advanced',
    platform: 'sensor',
    description: 'Custom sensor with lambda',
    icon: 'Code',
    config: {
      platform: 'template',
      name: 'Template Sensor',
      lambda: 'return 42.0;',
      update_interval: '60s',
    },
  },
]

// Merge with existing templates
export function getAllESPHomeComponents(): ComponentTemplate[] {
  // This will be imported and merged with COMPONENT_TEMPLATES in templates.ts
  return EXTENDED_COMPONENT_TEMPLATES
}
