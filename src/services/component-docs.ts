export interface ComponentDoc {
  id: string
  name: string
  description: string
  category: string
  platform?: string
  usage: string
  exampleConfig: string
  commonUses: string[]
  requiredFields?: string[]
  optionalFields?: string[]
  relatedComponents?: string[]
  officialDocsUrl?: string
}

export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  // Sensors
  dht: {
    id: 'dht',
    name: 'DHT Temperature & Humidity Sensor',
    description: 'Read temperature and humidity from DHT11, DHT22, AM2302, RHT03 sensors',
    category: 'Sensor',
    platform: 'dht',
    usage: 'Connect the data pin to any GPIO pin. Supports both temperature and humidity readings.',
    exampleConfig: `sensor:
  - platform: dht
    pin: GPIO4
    temperature:
      name: "Living Room Temperature"
    humidity:
      name: "Living Room Humidity"
    update_interval: 60s
    model: DHT22`,
    commonUses: [
      'Indoor climate monitoring',
      'Greenhouse automation',
      'HVAC control systems',
    ],
    requiredFields: ['pin', 'model'],
    optionalFields: ['update_interval', 'temperature', 'humidity'],
    relatedComponents: ['bme280', 'sht3xd', 'climate'],
    officialDocsUrl: 'https://esphome.io/components/sensor/dht.html',
  },

  bme280: {
    id: 'bme280',
    name: 'BME280 Environment Sensor',
    description: 'Temperature, humidity, and pressure sensor using I2C or SPI',
    category: 'Sensor',
    platform: 'bme280',
    usage: 'Connect via I2C (SDA/SCL) or SPI. Provides accurate environmental readings.',
    exampleConfig: `sensor:
  - platform: bme280
    temperature:
      name: "BME280 Temperature"
    pressure:
      name: "BME280 Pressure"
    humidity:
      name: "BME280 Humidity"
    address: 0x76
    update_interval: 60s`,
    commonUses: [
      'Weather stations',
      'Indoor air quality monitoring',
      'Altitude measurement',
    ],
    requiredFields: [],
    optionalFields: ['address', 'update_interval', 'iir_filter'],
    relatedComponents: ['dht', 'bmp280', 'sht3xd'],
    officialDocsUrl: 'https://esphome.io/components/sensor/bme280.html',
  },

  adc: {
    id: 'adc',
    name: 'ADC (Analog to Digital Converter)',
    description: 'Read analog voltage values from GPIO pins',
    category: 'Sensor',
    platform: 'adc',
    usage: 'Read analog values from 0-3.3V (ESP32) or 0-1.0V (ESP8266). Useful for sensors with analog output.',
    exampleConfig: `sensor:
  - platform: adc
    pin: GPIO36
    name: "Soil Moisture"
    update_interval: 60s
    attenuation: 11db
    filters:
      - calibrate_linear:
          - 0.0 -> 0.0
          - 3.3 -> 100.0`,
    commonUses: [
      'Soil moisture sensors',
      'Light level detection',
      'Battery voltage monitoring',
    ],
    requiredFields: ['pin'],
    optionalFields: ['attenuation', 'update_interval', 'filters'],
    relatedComponents: ['dallas', 'ultrasonic'],
    officialDocsUrl: 'https://esphome.io/components/sensor/adc.html',
  },

  // Lights
  binary_light: {
    id: 'binary_light',
    name: 'Binary Light',
    description: 'Simple on/off light control',
    category: 'Light',
    platform: 'binary',
    usage: 'Controls a simple on/off light connected to a GPIO pin via a relay or transistor.',
    exampleConfig: `light:
  - platform: binary
    name: "Desk Lamp"
    output: light_output

output:
  - platform: gpio
    pin: GPIO5
    id: light_output`,
    commonUses: [
      'Basic light switches',
      'Relay-controlled lights',
      'Simple automation',
    ],
    requiredFields: ['output'],
    optionalFields: ['effects'],
    relatedComponents: ['switch', 'rgb', 'rgbw'],
    officialDocsUrl: 'https://esphome.io/components/light/binary.html',
  },

  rgb: {
    id: 'rgb',
    name: 'RGB Light',
    description: 'Full color RGB LED control',
    category: 'Light',
    platform: 'rgb',
    usage: 'Control RGB LED strips or bulbs with separate red, green, and blue channels.',
    exampleConfig: `light:
  - platform: rgb
    name: "RGB LED Strip"
    red: output_red
    green: output_green
    blue: output_blue
    effects:
      - random:
      - strobe:

output:
  - platform: ledc
    pin: GPIO23
    id: output_red
  - platform: ledc
    pin: GPIO22
    id: output_green
  - platform: ledc
    pin: GPIO21
    id: output_blue`,
    commonUses: [
      'LED strip lighting',
      'Mood lighting',
      'Decorative lights',
    ],
    requiredFields: ['red', 'green', 'blue'],
    optionalFields: ['effects', 'gamma_correct'],
    relatedComponents: ['rgbw', 'fastled', 'neopixelbus'],
    officialDocsUrl: 'https://esphome.io/components/light/rgb.html',
  },

  // Switches
  gpio_switch: {
    id: 'gpio_switch',
    name: 'GPIO Switch',
    description: 'Simple on/off switch on a GPIO pin',
    category: 'Switch',
    platform: 'gpio',
    usage: 'Control any device connected to a GPIO pin. Commonly used with relays.',
    exampleConfig: `switch:
  - platform: gpio
    name: "Water Pump"
    pin: GPIO23
    icon: "mdi:water-pump"
    on_turn_on:
      - logger.log: "Pump turned on"
    on_turn_off:
      - logger.log: "Pump turned off"`,
    commonUses: [
      'Relay control',
      'Power switching',
      'Device automation',
    ],
    requiredFields: ['pin'],
    optionalFields: ['icon', 'on_turn_on', 'on_turn_off', 'restore_mode'],
    relatedComponents: ['binary_light', 'output'],
    officialDocsUrl: 'https://esphome.io/components/switch/gpio.html',
  },

  // Binary Sensors
  gpio_binary_sensor: {
    id: 'gpio_binary_sensor',
    name: 'GPIO Binary Sensor',
    description: 'Read digital on/off state from GPIO pins',
    category: 'Binary Sensor',
    platform: 'gpio',
    usage: 'Detect button presses, motion sensors, door sensors, and other digital inputs.',
    exampleConfig: `binary_sensor:
  - platform: gpio
    name: "Motion Sensor"
    pin: GPIO5
    device_class: motion
    on_press:
      - light.turn_on: room_light
    on_release:
      - delay: 300s
      - light.turn_off: room_light`,
    commonUses: [
      'Button inputs',
      'PIR motion sensors',
      'Door/window sensors',
    ],
    requiredFields: ['pin'],
    optionalFields: ['device_class', 'on_press', 'on_release', 'filters'],
    relatedComponents: ['switch', 'automation'],
    officialDocsUrl: 'https://esphome.io/components/binary_sensor/gpio.html',
  },

  // Climate
  thermostat: {
    id: 'thermostat',
    name: 'Thermostat',
    description: 'Climate control with heating and cooling',
    category: 'Climate',
    platform: 'thermostat',
    usage: 'Control temperature with heating/cooling actions based on a temperature sensor.',
    exampleConfig: `climate:
  - platform: thermostat
    name: "Room Climate"
    sensor: room_temperature
    default_target_temperature_low: 20°C
    default_target_temperature_high: 24°C
    heat_action:
      - switch.turn_on: heater
    cool_action:
      - switch.turn_on: cooler
    idle_action:
      - switch.turn_off: heater
      - switch.turn_off: cooler`,
    commonUses: [
      'HVAC control',
      'Temperature regulation',
      'Smart thermostats',
    ],
    requiredFields: ['sensor'],
    optionalFields: ['heat_action', 'cool_action', 'idle_action', 'visual'],
    relatedComponents: ['dht', 'bme280', 'switch'],
    officialDocsUrl: 'https://esphome.io/components/climate/thermostat.html',
  },

  // Covers
  template_cover: {
    id: 'template_cover',
    name: 'Template Cover',
    description: 'Customizable cover (blinds, garage doors, curtains)',
    category: 'Cover',
    platform: 'template',
    usage: 'Create custom cover logic for blinds, garage doors, or curtains using templates.',
    exampleConfig: `cover:
  - platform: template
    name: "Garage Door"
    device_class: garage
    open_action:
      - switch.turn_on: garage_relay
      - delay: 500ms
      - switch.turn_off: garage_relay
    close_action:
      - switch.turn_on: garage_relay
      - delay: 500ms
      - switch.turn_off: garage_relay
    stop_action:
      - switch.turn_on: garage_relay
      - delay: 200ms
      - switch.turn_off: garage_relay`,
    commonUses: [
      'Garage door control',
      'Window blinds',
      'Motorized curtains',
    ],
    requiredFields: [],
    optionalFields: ['open_action', 'close_action', 'stop_action', 'position_action'],
    relatedComponents: ['switch', 'binary_sensor'],
    officialDocsUrl: 'https://esphome.io/components/cover/template.html',
  },

  // Core Components
  wifi: {
    id: 'wifi',
    name: 'WiFi',
    description: 'WiFi connectivity configuration',
    category: 'Core',
    usage: 'Connect your ESP device to WiFi network. Supports multiple networks and fallback AP.',
    exampleConfig: `wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Fallback hotspot
  ap:
    ssid: "Device Fallback"
    password: "12345678"`,
    commonUses: [
      'Network connectivity',
      'Internet access',
      'Home automation integration',
    ],
    requiredFields: ['ssid', 'password'],
    optionalFields: ['ap', 'manual_ip', 'power_save_mode', 'fast_connect'],
    relatedComponents: ['api', 'web_server', 'mqtt'],
    officialDocsUrl: 'https://esphome.io/components/wifi.html',
  },

  api: {
    id: 'api',
    name: 'Native API',
    description: 'Home Assistant native API integration',
    category: 'Core',
    usage: 'Enable communication with Home Assistant using the native API protocol.',
    exampleConfig: `api:
  password: !secret api_password
  encryption:
    key: !secret api_encryption_key`,
    commonUses: [
      'Home Assistant integration',
      'Real-time communication',
      'Device control',
    ],
    requiredFields: [],
    optionalFields: ['password', 'encryption', 'reboot_timeout'],
    relatedComponents: ['wifi', 'mqtt', 'web_server'],
    officialDocsUrl: 'https://esphome.io/components/api.html',
  },

  ota: {
    id: 'ota',
    name: 'OTA (Over The Air) Updates',
    description: 'Enable wireless firmware updates',
    category: 'Core',
    usage: 'Upload new firmware wirelessly without USB connection. Requires initial USB flash.',
    exampleConfig: `ota:
  password: !secret ota_password
  safe_mode: true`,
    commonUses: [
      'Wireless updates',
      'Remote maintenance',
      'Continuous deployment',
    ],
    requiredFields: [],
    optionalFields: ['password', 'safe_mode', 'port'],
    relatedComponents: ['wifi', 'web_server'],
    officialDocsUrl: 'https://esphome.io/components/ota.html',
  },

  logger: {
    id: 'logger',
    name: 'Logger',
    description: 'System logging and debugging',
    category: 'Core',
    usage: 'Configure logging output for debugging and monitoring device behavior.',
    exampleConfig: `logger:
  level: DEBUG
  logs:
    sensor: INFO
    mqtt: WARN`,
    commonUses: [
      'Debugging',
      'Error tracking',
      'System monitoring',
    ],
    requiredFields: [],
    optionalFields: ['level', 'baud_rate', 'logs'],
    relatedComponents: ['api', 'web_server'],
    officialDocsUrl: 'https://esphome.io/components/logger.html',
  },
}

/**
 * Get documentation for a component by ID
 */
export function getComponentDoc(id: string): ComponentDoc | undefined {
  return COMPONENT_DOCS[id]
}

/**
 * Get all component documentation
 */
export function getAllComponentDocs(): ComponentDoc[] {
  return Object.values(COMPONENT_DOCS)
}

/**
 * Search component documentation
 */
export function searchComponentDocs(query: string): ComponentDoc[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(COMPONENT_DOCS).filter(
    (doc) =>
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.category.toLowerCase().includes(lowerQuery) ||
      doc.commonUses.some((use) => use.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): ComponentDoc[] {
  return Object.values(COMPONENT_DOCS).filter((doc) => doc.category === category)
}
