export interface LambdaTemplate {
  id: string
  name: string
  category: string
  description: string
  code: string
  variables: Array<{
    name: string
    type: 'int' | 'float' | 'bool' | 'string'
    default?: any
  }>
}

export interface ScriptTemplate {
  id: string
  name: string
  description: string
  parameters?: Record<string, string>
  sequence: Array<{
    action: string
    params: Record<string, any>
  }>
}

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  trigger: {
    platform: string
    config: Record<string, any>
  }
  condition?: Array<{
    condition: string
    config: Record<string, any>
  }>
  action: Array<{
    action: string
    config: Record<string, any>
  }>
}

// Lambda Templates
export const LAMBDA_TEMPLATES: LambdaTemplate[] = [
  {
    id: 'simple_if',
    name: 'Simple If Statement',
    category: 'Control Flow',
    description: 'Basic if-else logic',
    code: `if (condition) {
  // true action
  return true;
} else {
  // false action
  return false;
}`,
    variables: [
      { name: 'condition', type: 'bool', default: false },
    ],
  },
  {
    id: 'map_value',
    name: 'Map Value',
    category: 'Math',
    description: 'Map input value to output range',
    code: `// Map value from input range to output range
float input_min = 0.0;
float input_max = 100.0;
float output_min = 0.0;
float output_max = 255.0;
return (x - input_min) * (output_max - output_min) / (input_max - input_min) + output_min;`,
    variables: [
      { name: 'x', type: 'float' },
      { name: 'input_min', type: 'float', default: 0 },
      { name: 'input_max', type: 'float', default: 100 },
      { name: 'output_min', type: 'float', default: 0 },
      { name: 'output_max', type: 'float', default: 255 },
    ],
  },
  {
    id: 'filter_value',
    name: 'Filter/Smooth Value',
    category: 'Sensors',
    description: 'Exponential moving average filter',
    code: `static float last_value = 0.0;
float alpha = 0.3; // Smoothing factor (0-1)
last_value = alpha * x + (1 - alpha) * last_value;
return last_value;`,
    variables: [
      { name: 'x', type: 'float' },
      { name: 'alpha', type: 'float', default: 0.3 },
    ],
  },
  {
    id: 'threshold',
    name: 'Threshold with Hysteresis',
    category: 'Control Flow',
    description: 'Prevent rapid switching at threshold',
    code: `static bool state = false;
float threshold_high = 25.0;
float threshold_low = 20.0;

if (x > threshold_high) {
  state = true;
} else if (x < threshold_low) {
  state = false;
}
return state;`,
    variables: [
      { name: 'x', type: 'float' },
      { name: 'threshold_high', type: 'float', default: 25 },
      { name: 'threshold_low', type: 'float', default: 20 },
    ],
  },
  {
    id: 'time_based',
    name: 'Time-based Logic',
    category: 'Time',
    description: 'Execute based on time of day',
    code: `auto time = id(homeassistant_time).now();
int hour = time.hour;

// Morning (6-12)
if (hour >= 6 && hour < 12) {
  return 1;
}
// Afternoon (12-18)
else if (hour >= 12 && hour < 18) {
  return 2;
}
// Evening (18-22)
else if (hour >= 18 && hour < 22) {
  return 3;
}
// Night
else {
  return 4;
}`,
    variables: [],
  },
]

// Script Templates
export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'light_fade',
    name: 'Fade Light',
    description: 'Smoothly fade light brightness',
    parameters: {
      light_id: 'string',
      target_brightness: 'float',
      duration: 'int',
    },
    sequence: [
      {
        action: 'light.turn_on',
        params: {
          id: '${light_id}',
          brightness: '${target_brightness}',
          transition_length: '${duration}s',
        },
      },
    ],
  },
  {
    id: 'notification_sequence',
    name: 'Notification Sequence',
    description: 'Blink LED and send notification',
    sequence: [
      {
        action: 'light.turn_on',
        params: {
          id: 'notification_led',
          effect: 'strobe',
        },
      },
      {
        action: 'delay',
        params: {
          milliseconds: 500,
        },
      },
      {
        action: 'light.turn_off',
        params: {
          id: 'notification_led',
        },
      },
    ],
  },
  {
    id: 'sensor_calibration',
    name: 'Sensor Calibration',
    description: 'Calibrate sensor with multiple readings',
    sequence: [
      {
        action: 'logger.log',
        params: {
          message: 'Starting calibration...',
        },
      },
      {
        action: 'delay',
        params: {
          seconds: 2,
        },
      },
      {
        action: 'sensor.template.publish',
        params: {
          id: 'calibrated_sensor',
          state: '${reading}',
        },
      },
    ],
  },
]

// Automation Templates
export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'motion_light',
    name: 'Motion Activated Light',
    description: 'Turn on light when motion detected',
    trigger: {
      platform: 'binary_sensor',
      config: {
        entity_id: 'motion_sensor',
        from: 'off',
        to: 'on',
      },
    },
    action: [
      {
        action: 'light.turn_on',
        config: {
          id: 'room_light',
        },
      },
      {
        action: 'delay',
        config: {
          minutes: 5,
        },
      },
      {
        action: 'light.turn_off',
        config: {
          id: 'room_light',
        },
      },
    ],
  },
  {
    id: 'temp_fan',
    name: 'Temperature Controlled Fan',
    description: 'Auto fan based on temperature',
    trigger: {
      platform: 'numeric_state',
      config: {
        entity_id: 'temperature_sensor',
        above: 25,
      },
    },
    condition: [
      {
        condition: 'time',
        config: {
          after: '08:00:00',
          before: '22:00:00',
        },
      },
    ],
    action: [
      {
        action: 'fan.turn_on',
        config: {
          id: 'room_fan',
          speed: 'high',
        },
      },
    ],
  },
  {
    id: 'door_alarm',
    name: 'Door Open Alarm',
    description: 'Alert when door left open too long',
    trigger: {
      platform: 'state',
      config: {
        entity_id: 'door_sensor',
        to: 'on',
        for: {
          minutes: 5,
        },
      },
    },
    action: [
      {
        action: 'switch.turn_on',
        config: {
          id: 'alarm_buzzer',
        },
      },
      {
        action: 'light.turn_on',
        config: {
          id: 'warning_light',
          effect: 'strobe',
        },
      },
    ],
  },
  {
    id: 'sunrise_lights',
    name: 'Sunrise Simulation',
    description: 'Gradually brighten lights at sunrise',
    trigger: {
      platform: 'sun',
      config: {
        event: 'sunrise',
        offset: '-00:30:00',
      },
    },
    action: [
      {
        action: 'light.turn_on',
        config: {
          id: 'bedroom_light',
          brightness: 1,
        },
      },
      {
        action: 'light.turn_on',
        config: {
          id: 'bedroom_light',
          brightness: 255,
          transition_length: '30min',
        },
      },
    ],
  },
]

// Action types for automation builder
export const AUTOMATION_ACTIONS = [
  { id: 'light.turn_on', name: 'Turn On Light', category: 'Light' },
  { id: 'light.turn_off', name: 'Turn Off Light', category: 'Light' },
  { id: 'light.toggle', name: 'Toggle Light', category: 'Light' },
  { id: 'switch.turn_on', name: 'Turn On Switch', category: 'Switch' },
  { id: 'switch.turn_off', name: 'Turn Off Switch', category: 'Switch' },
  { id: 'switch.toggle', name: 'Toggle Switch', category: 'Switch' },
  { id: 'cover.open', name: 'Open Cover', category: 'Cover' },
  { id: 'cover.close', name: 'Close Cover', category: 'Cover' },
  { id: 'fan.turn_on', name: 'Turn On Fan', category: 'Fan' },
  { id: 'fan.turn_off', name: 'Turn Off Fan', category: 'Fan' },
  { id: 'script.execute', name: 'Execute Script', category: 'Script' },
  { id: 'delay', name: 'Delay', category: 'Timing' },
  { id: 'logger.log', name: 'Log Message', category: 'Debug' },
]

// Trigger types
export const AUTOMATION_TRIGGERS = [
  { id: 'state', name: 'State Change', category: 'State' },
  { id: 'numeric_state', name: 'Numeric State', category: 'State' },
  { id: 'binary_sensor', name: 'Binary Sensor', category: 'Sensor' },
  { id: 'time', name: 'Time', category: 'Time' },
  { id: 'time_pattern', name: 'Time Pattern', category: 'Time' },
  { id: 'sun', name: 'Sun Event', category: 'Time' },
  { id: 'interval', name: 'Interval', category: 'Time' },
  { id: 'mqtt', name: 'MQTT Message', category: 'Network' },
  { id: 'api', name: 'API Call', category: 'Network' },
]

// Condition types
export const AUTOMATION_CONDITIONS = [
  { id: 'state', name: 'State', category: 'State' },
  { id: 'numeric_state', name: 'Numeric State', category: 'State' },
  { id: 'time', name: 'Time', category: 'Time' },
  { id: 'sun', name: 'Sun', category: 'Time' },
  { id: 'and', name: 'And', category: 'Logic' },
  { id: 'or', name: 'Or', category: 'Logic' },
  { id: 'not', name: 'Not', category: 'Logic' },
  { id: 'lambda', name: 'Lambda', category: 'Advanced' },
]
