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

// Import extended components
import { getAllESPHomeComponents } from './extended-templates'

// Base component templates - most commonly used
const BASE_COMPONENT_TEMPLATES: ComponentTemplate[] = [
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

  // More Sensors
  {
    id: 'adc',
    name: 'Analog to Digital Converter',
    category: 'Sensors',
    platform: 'sensor',
    description: 'Read analog voltage from ADC pin',
    icon: 'Activity',
    config: {
      platform: 'adc',
      pin: 'A0',
      name: 'ADC Sensor',
      update_interval: '60s',
    },
    requiredFields: ['pin'],
  },
  {
    id: 'bh1750',
    name: 'BH1750 Light Sensor',
    category: 'Sensors',
    platform: 'sensor',
    description: 'I2C light intensity sensor',
    icon: 'Sun',
    config: {
      platform: 'bh1750',
      name: 'Illuminance',
      address: '0x23',
      update_interval: '60s',
    },
  },
  {
    id: 'pulse_counter',
    name: 'Pulse Counter',
    category: 'Sensors',
    platform: 'sensor',
    description: 'Count pulses (water/energy meters)',
    icon: 'Activity',
    config: {
      platform: 'pulse_counter',
      pin: 'D5',
      name: 'Pulse Counter',
      unit_of_measurement: 'pulses/min',
      update_interval: '60s',
    },
    requiredFields: ['pin'],
  },
  {
    id: 'rotary_encoder',
    name: 'Rotary Encoder',
    category: 'Sensors',
    platform: 'sensor',
    description: 'Rotary encoder position sensor',
    icon: 'RotateCw',
    config: {
      platform: 'rotary_encoder',
      name: 'Rotary Encoder',
      pin_a: 'D1',
      pin_b: 'D2',
    },
    requiredFields: ['pin_a', 'pin_b'],
  },

  // Text Sensors
  {
    id: 'wifi_info',
    name: 'WiFi Info',
    category: 'Text Sensors',
    platform: 'text_sensor',
    description: 'WiFi connection information',
    icon: 'Wifi',
    config: {
      platform: 'wifi_info',
      ip_address: {
        name: 'IP Address',
      },
      ssid: {
        name: 'SSID',
      },
    },
  },
  {
    id: 'version',
    name: 'ESPHome Version',
    category: 'Text Sensors',
    platform: 'text_sensor',
    description: 'Current ESPHome version',
    icon: 'Info',
    config: {
      platform: 'version',
      name: 'ESPHome Version',
    },
  },

  // Output
  {
    id: 'gpio_output',
    name: 'GPIO Output',
    category: 'Output',
    platform: 'output',
    description: 'Basic GPIO output',
    icon: 'Zap',
    config: {
      platform: 'gpio',
      pin: 'D1',
      id: 'gpio_output_1',
    },
    requiredFields: ['pin'],
  },
  {
    id: 'pwm_output',
    name: 'PWM Output',
    category: 'Output',
    platform: 'output',
    description: 'PWM output for dimmers',
    icon: 'Zap',
    config: {
      platform: 'esp8266_pwm',
      pin: 'D1',
      frequency: '1000 Hz',
      id: 'pwm_output_1',
    },
    requiredFields: ['pin'],
  },

  // Fan
  {
    id: 'binary_fan',
    name: 'Binary Fan',
    category: 'Fan',
    platform: 'fan',
    description: 'On/off fan control',
    icon: 'Fan',
    config: {
      platform: 'binary',
      output: 'fan_output',
      name: 'Fan',
    },
  },
  {
    id: 'speed_fan',
    name: 'Speed Fan',
    category: 'Fan',
    platform: 'fan',
    description: 'Variable speed fan',
    icon: 'Fan',
    config: {
      platform: 'speed',
      output: 'fan_output',
      name: 'Fan',
      speed_count: 3,
    },
  },

  // Advanced - Lambda
  {
    id: 'lambda',
    name: 'Lambda Function',
    category: 'Advanced',
    platform: 'lambda',
    description: 'Custom C++ lambda expression',
    icon: 'Code',
    config: {
      lambda: '// Custom C++ code here\nreturn 0;',
    },
  },

  // Advanced - Script
  {
    id: 'script',
    name: 'Script',
    category: 'Advanced',
    platform: 'script',
    description: 'Reusable action sequence',
    icon: 'FileCode',
    config: {
      id: 'my_script',
      mode: 'single',
      then: [],
    },
  },

  // Advanced - Automation
  {
    id: 'automation',
    name: 'Automation',
    category: 'Advanced',
    platform: 'automation',
    description: 'Trigger-based automation',
    icon: 'Zap',
    config: {
      trigger: [],
      condition: [],
      then: [],
    },
  },

  // Number
  {
    id: 'template_number',
    name: 'Template Number',
    category: 'Number',
    platform: 'number',
    description: 'Number input control',
    icon: 'Hash',
    config: {
      platform: 'template',
      name: 'Number',
      min_value: 0,
      max_value: 100,
      step: 1,
      optimistic: true,
    },
  },

  // Select
  {
    id: 'template_select',
    name: 'Template Select',
    category: 'Select',
    platform: 'select',
    description: 'Dropdown selection',
    icon: 'List',
    config: {
      platform: 'template',
      name: 'Select',
      options: ['Option 1', 'Option 2', 'Option 3'],
      optimistic: true,
    },
  },

  // Button
  {
    id: 'template_button',
    name: 'Template Button',
    category: 'Button',
    platform: 'button',
    description: 'Triggerable button',
    icon: 'Square',
    config: {
      platform: 'template',
      name: 'Button',
      on_press: [],
    },
  },

  // Display
  {
    id: 'ssd1306',
    name: 'SSD1306 OLED Display',
    category: 'Display',
    platform: 'display',
    description: 'I2C OLED display',
    icon: 'Monitor',
    config: {
      platform: 'ssd1306_i2c',
      model: 'SSD1306_128X64',
      address: '0x3C',
      lambda: '// Display code here',
    },
  },

  // Time
  {
    id: 'sntp',
    name: 'SNTP Time',
    category: 'Time',
    platform: 'time',
    description: 'Network time synchronization',
    icon: 'Clock',
    config: {
      platform: 'sntp',
      id: 'sntp_time',
      timezone: 'Europe/Rome',
    },
  },
]

// Combine all templates
export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  ...BASE_COMPONENT_TEMPLATES,
  ...getAllESPHomeComponents(),
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

export function getComponentCount(): number {
  return COMPONENT_TEMPLATES.length
}

export function getCategoryCount(): number {
  return getAllCategories().length
}
