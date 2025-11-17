export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: 'beginner' | 'intermediate' | 'advanced' | 'specialty'
  platform: 'ESP32' | 'ESP8266'
  board: string
  yaml: string
  tags: string[]
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'basic_light',
    name: 'Basic Light Controller',
    description: 'Simple on/off light control with web interface',
    category: 'beginner',
    platform: 'ESP8266',
    board: 'd1_mini',
    tags: ['light', 'basic', 'beginner'],
    yaml: `esphome:
  name: basic_light
  platform: ESP8266
  board: d1_mini

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  ap:
    ssid: "Basic Light Fallback"
    password: "12345678"

captive_portal:

logger:

api:
  password: ""

ota:
  password: ""

web_server:
  port: 80

light:
  - platform: binary
    name: "Room Light"
    output: light_output

output:
  - platform: gpio
    pin: D1
    id: light_output
`,
  },
  {
    id: 'temp_humidity',
    name: 'Temperature & Humidity Monitor',
    description: 'DHT22 sensor monitoring with Home Assistant integration',
    category: 'beginner',
    platform: 'ESP8266',
    board: 'nodemcuv2',
    tags: ['sensor', 'temperature', 'humidity', 'dht22'],
    yaml: `esphome:
  name: temp_humidity_monitor
  platform: ESP8266
  board: nodemcuv2

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:
  password: ""

ota:
  password: ""

sensor:
  - platform: dht
    pin: D4
    temperature:
      name: "Living Room Temperature"
      filters:
        - sliding_window_moving_average:
            window_size: 12
            send_every: 6
    humidity:
      name: "Living Room Humidity"
    update_interval: 30s
    model: DHT22
`,
  },
  {
    id: 'smart_switch',
    name: 'Smart Switch with Status LED',
    description: 'Switch with physical button, status LED, and web control',
    category: 'intermediate',
    platform: 'ESP32',
    board: 'esp32dev',
    tags: ['switch', 'button', 'led'],
    yaml: `esphome:
  name: smart_switch
  platform: ESP32
  board: esp32dev

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:

ota:

web_server:

switch:
  - platform: gpio
    name: "Main Switch"
    pin: GPIO23
    id: main_switch
    on_turn_on:
      - light.turn_on: status_led
    on_turn_off:
      - light.turn_off: status_led

binary_sensor:
  - platform: gpio
    name: "Physical Button"
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: true
    on_press:
      - switch.toggle: main_switch

light:
  - platform: binary
    name: "Status LED"
    output: led_output
    id: status_led

output:
  - platform: gpio
    pin: GPIO2
    id: led_output
`,
  },
  {
    id: 'motion_light',
    name: 'Motion Activated Light',
    description: 'Automatic lighting with PIR sensor and timeout',
    category: 'intermediate',
    platform: 'ESP8266',
    board: 'd1_mini',
    tags: ['motion', 'pir', 'automation', 'light'],
    yaml: `esphome:
  name: motion_light
  platform: ESP8266
  board: d1_mini

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:

ota:

binary_sensor:
  - platform: gpio
    name: "Motion Sensor"
    pin: D5
    device_class: motion
    on_press:
      - light.turn_on: room_light
    on_release:
      - delay: 300s  # 5 minutes
      - light.turn_off: room_light

light:
  - platform: binary
    name: "Room Light"
    output: light_output
    id: room_light

output:
  - platform: gpio
    pin: D1
    id: light_output
`,
  },
  {
    id: 'rgb_led_strip',
    name: 'RGB LED Strip Controller',
    description: 'Full color RGB LED strip with effects',
    category: 'intermediate',
    platform: 'ESP32',
    board: 'esp32dev',
    tags: ['led', 'rgb', 'effects', 'lights'],
    yaml: `esphome:
  name: rgb_led_strip
  platform: ESP32
  board: esp32dev

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:

ota:

light:
  - platform: rgb
    name: "RGB LED Strip"
    red: output_red
    green: output_green
    blue: output_blue
    effects:
      - random:
      - strobe:
      - flicker:
          alpha: 95%
          intensity: 1.5%
      - lambda:
          name: Pulse
          update_interval: 1s
          lambda: |-
            static int state = 0;
            auto call = id(rgb_led_strip).turn_on();
            call.set_brightness(abs(sin(state * 0.05)));
            call.perform();
            state += 1;

output:
  - platform: ledc
    pin: GPIO23
    id: output_red
  - platform: ledc
    pin: GPIO22
    id: output_green
  - platform: ledc
    pin: GPIO21
    id: output_blue
`,
  },
  {
    id: 'garden_irrigation',
    name: 'Garden Irrigation System',
    description: 'Automated watering with soil moisture sensor',
    category: 'advanced',
    platform: 'ESP32',
    board: 'esp32dev',
    tags: ['irrigation', 'garden', 'automation', 'sensor'],
    yaml: `esphome:
  name: garden_irrigation
  platform: ESP32
  board: esp32dev

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:

ota:

sensor:
  - platform: adc
    pin: GPIO36
    name: "Soil Moisture"
    id: soil_moisture
    update_interval: 60s
    unit_of_measurement: "%"
    filters:
      - calibrate_linear:
          - 0.0 -> 0.0
          - 3.3 -> 100.0
    on_value_range:
      - below: 30.0
        then:
          - if:
              condition:
                lambda: 'return id(auto_mode).state;'
              then:
                - switch.turn_on: water_pump
                - delay: 120s  # Water for 2 minutes
                - switch.turn_off: water_pump

switch:
  - platform: gpio
    name: "Water Pump"
    pin: GPIO23
    id: water_pump
    icon: "mdi:water-pump"

  - platform: template
    name: "Auto Watering Mode"
    id: auto_mode
    optimistic: true
    restore_state: true
`,
  },
  {
    id: 'doorbell_camera',
    name: 'Smart Doorbell with Camera',
    description: 'ESP32-CAM doorbell with button and notifications',
    category: 'advanced',
    platform: 'ESP32',
    board: 'esp32cam',
    tags: ['camera', 'doorbell', 'notification'],
    yaml: `esphome:
  name: smart_doorbell
  platform: ESP32
  board: esp32cam

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:

ota:

esp32_camera:
  name: "Doorbell Camera"
  external_clock:
    pin: GPIO0
    frequency: 20MHz
  i2c_pins:
    sda: GPIO26
    scl: GPIO27
  data_pins: [GPIO5, GPIO18, GPIO19, GPIO21, GPIO36, GPIO39, GPIO34, GPIO35]
  vsync_pin: GPIO25
  href_pin: GPIO23
  pixel_clock_pin: GPIO22
  power_down_pin: GPIO32
  resolution: 800x600
  jpeg_quality: 10

binary_sensor:
  - platform: gpio
    name: "Doorbell Button"
    pin:
      number: GPIO13
      mode: INPUT_PULLUP
      inverted: true
    on_press:
      - light.turn_on: flash_led
      - delay: 500ms
      - light.turn_off: flash_led

light:
  - platform: binary
    name: "Flash LED"
    output: flash_output
    id: flash_led

output:
  - platform: gpio
    pin: GPIO4
    id: flash_output
`,
  },
  {
    id: 'energy_monitor',
    name: 'Energy Consumption Monitor',
    description: 'Track power usage with PZEM-004T sensor',
    category: 'advanced',
    platform: 'ESP8266',
    board: 'nodemcuv2',
    tags: ['energy', 'power', 'monitoring', 'pzem'],
    yaml: `esphome:
  name: energy_monitor
  platform: ESP8266
  board: nodemcuv2

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:
  baud_rate: 0  # Disable logging via UART

api:

ota:

uart:
  rx_pin: D7
  tx_pin: D8
  baud_rate: 9600
  stop_bits: 1

sensor:
  - platform: pzem004t
    current:
      name: "Current"
    voltage:
      name: "Voltage"
    energy:
      name: "Energy"
    power:
      name: "Power"
    update_interval: 60s

  - platform: total_daily_energy
    name: "Daily Energy"
    power_id: power
`,
  },
  {
    id: 'climate_control',
    name: 'Climate Control System',
    description: 'Temperature control with heating/cooling',
    category: 'advanced',
    platform: 'ESP32',
    board: 'esp32dev',
    tags: ['climate', 'temperature', 'automation', 'hvac'],
    yaml: `esphome:
  name: climate_control
  platform: ESP32
  board: esp32dev

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:

ota:

sensor:
  - platform: dht
    pin: GPIO4
    temperature:
      name: "Room Temperature"
      id: room_temp
    humidity:
      name: "Room Humidity"
    update_interval: 30s
    model: DHT22

climate:
  - platform: thermostat
    name: "Room Thermostat"
    sensor: room_temp
    default_target_temperature_low: 20°C
    default_target_temperature_high: 24°C

    heat_action:
      - switch.turn_on: heater
    cool_action:
      - switch.turn_on: cooler
    idle_action:
      - switch.turn_off: heater
      - switch.turn_off: cooler

switch:
  - platform: gpio
    name: "Heater"
    pin: GPIO23
    id: heater

  - platform: gpio
    name: "Cooler/Fan"
    pin: GPIO22
    id: cooler
`,
  },
  {
    id: 'm5stack_display',
    name: 'M5Stack Dashboard',
    description: 'Information display with buttons for M5Stack',
    category: 'specialty',
    platform: 'ESP32',
    board: 'm5stack-core',
    tags: ['display', 'm5stack', 'dashboard'],
    yaml: `esphome:
  name: m5stack_dashboard
  platform: ESP32
  board: m5stack-core

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:

ota:

spi:
  clk_pin: GPIO18
  mosi_pin: GPIO23

display:
  - platform: ili9341
    model: M5STACK
    cs_pin: GPIO14
    dc_pin: GPIO27
    reset_pin: GPIO33
    rotation: 0
    lambda: |-
      it.print(0, 0, id(font), "M5Stack Dashboard");
      it.printf(0, 30, id(font), "Temp: %.1f°C", id(temperature).state);
      it.printf(0, 50, id(font), "WiFi: %s", id(wifi_info).get_ip_address().c_str());

font:
  - file: "fonts/arial.ttf"
    id: font
    size: 20

sensor:
  - platform: homeassistant
    id: temperature
    entity_id: sensor.living_room_temperature

binary_sensor:
  - platform: gpio
    name: "Button A"
    pin:
      number: GPIO39
      inverted: true

  - platform: gpio
    name: "Button B"
    pin:
      number: GPIO38
      inverted: true

  - platform: gpio
    name: "Button C"
    pin:
      number: GPIO37
      inverted: true
`,
  },
]

export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter((t) => t.category === category)
}

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((t) => t.id === id)
}

export function getAllCategories(): Array<{ id: string; name: string; description: string }> {
  return [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Simple projects perfect for getting started',
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Projects with automation and multiple components',
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Complex projects with advanced features',
    },
    {
      id: 'specialty',
      name: 'Specialty',
      description: 'Projects for specific hardware like M5Stack, ESP32-CAM',
    },
  ]
}
