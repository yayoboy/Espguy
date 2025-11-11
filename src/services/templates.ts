export interface ComponentTemplate {
  id: string
  name: string
  category: string
  platform: string
  description: string
  icon: string
  config: Record<string, any>
  requiredFields?: string[]
}

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // Sensors
  {
    id: 'dht22',
    name: 'DHT22 Temperature & Humidity',
    category: 'Sensors',
    platform: 'sensor',
    description: 'DHT22 digital temperature and humidity sensor',
    icon: 'Thermometer',
    config: {
      platform: 'dht',
      pin: 'D4',
      model: 'DHT22',
      temperature: {
        name: 'Temperature',
      },
      humidity: {
        name: 'Humidity',
      },
      update_interval: '60s',
    },
    requiredFields: ['pin'],
  },
  {
    id: 'bme280',
    name: 'BME280 Environmental Sensor',
    category: 'Sensors',
    platform: 'sensor',
    description: 'BME280 temperature, humidity and pressure sensor',
    icon: 'Gauge',
    config: {
      platform: 'bme280',
      address: '0x76',
      temperature: {
        name: 'Temperature',
      },
      humidity: {
        name: 'Humidity',
      },
      pressure: {
        name: 'Pressure',
      },
      update_interval: '60s',
    },
  },
  {
    id: 'dallas',
    name: 'Dallas DS18B20 Temperature',
    category: 'Sensors',
    platform: 'sensor',
    description: 'DS18B20 digital temperature sensor',
    icon: 'Thermometer',
    config: {
      platform: 'dallas',
      address: '0x1234567890abcdef',
      name: 'Temperature',
      update_interval: '60s',
    },
    requiredFields: ['address'],
  },
  {
    id: 'ultrasonic',
    name: 'Ultrasonic Distance Sensor',
    category: 'Sensors',
    platform: 'sensor',
    description: 'HC-SR04 ultrasonic distance sensor',
    icon: 'Ruler',
    config: {
      platform: 'ultrasonic',
      trigger_pin: 'D5',
      echo_pin: 'D6',
      name: 'Distance',
      update_interval: '60s',
    },
    requiredFields: ['trigger_pin', 'echo_pin'],
  },

  // Binary Sensors
  {
    id: 'pir',
    name: 'PIR Motion Sensor',
    category: 'Binary Sensors',
    platform: 'binary_sensor',
    description: 'Passive infrared motion sensor',
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
    id: 'door',
    name: 'Door/Window Sensor',
    category: 'Binary Sensors',
    platform: 'binary_sensor',
    description: 'Magnetic door or window contact sensor',
    icon: 'DoorOpen',
    config: {
      platform: 'gpio',
      pin: 'D2',
      name: 'Door',
      device_class: 'door',
    },
    requiredFields: ['pin'],
  },

  // Switches
  {
    id: 'relay',
    name: 'Relay Switch',
    category: 'Switches',
    platform: 'switch',
    description: 'Basic relay switch',
    icon: 'ToggleLeft',
    config: {
      platform: 'gpio',
      pin: 'D1',
      name: 'Relay',
    },
    requiredFields: ['pin'],
  },

  // Lights
  {
    id: 'rgb_light',
    name: 'RGB Light',
    category: 'Lights',
    platform: 'light',
    description: 'RGB LED strip or bulb',
    icon: 'Lightbulb',
    config: {
      platform: 'rgb',
      name: 'RGB Light',
      red: 'D1',
      green: 'D2',
      blue: 'D3',
    },
    requiredFields: ['red', 'green', 'blue'],
  },
  {
    id: 'fastled',
    name: 'FastLED RGB Strip',
    category: 'Lights',
    platform: 'light',
    description: 'WS2812 addressable LED strip',
    icon: 'Lightbulb',
    config: {
      platform: 'fastled_clockless',
      chipset: 'WS2812',
      pin: 'D4',
      num_leds: 60,
      rgb_order: 'GRB',
      name: 'LED Strip',
    },
    requiredFields: ['pin', 'num_leds'],
  },

  // Climate
  {
    id: 'daikin',
    name: 'Daikin AC',
    category: 'Climate',
    platform: 'climate',
    description: 'Daikin air conditioner IR control',
    icon: 'Wind',
    config: {
      platform: 'daikin',
      name: 'AC',
    },
  },

  // Cover
  {
    id: 'template_cover',
    name: 'Roller Shutter',
    category: 'Cover',
    platform: 'cover',
    description: 'Motorized roller shutter or blind',
    icon: 'Blinds',
    config: {
      platform: 'template',
      name: 'Shutter',
      open_action: [],
      close_action: [],
      stop_action: [],
    },
  },
]

export function getTemplatesByCategory(category: string): ComponentTemplate[] {
  return COMPONENT_TEMPLATES.filter((t) => t.category === category)
}

export function getTemplateById(id: string): ComponentTemplate | undefined {
  return COMPONENT_TEMPLATES.find((t) => t.id === id)
}

export function getAllCategories(): string[] {
  return [...new Set(COMPONENT_TEMPLATES.map((t) => t.category))]
}
