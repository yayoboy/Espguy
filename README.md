# ESPHome GUI - Modern Desktop Application

A modern, feature-rich desktop application for creating, managing, and flashing ESPHome device configurations. Built with Electron, React, TypeScript, and shadcn UI.

![ESPHome GUI](https://img.shields.io/badge/ESPHome-GUI-blue)
![Electron](https://img.shields.io/badge/Electron-28.x-47848f)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)

## 🌟 Features

### Core Functionality
- **Visual Block Editor** - Drag-and-drop interface for building ESPHome configurations without writing YAML
- **Project Management** - Create, edit, and organize multiple ESPHome projects
- **Real-time YAML Preview** - See your configuration update as you add/modify components
- **Integrated Flashing** - Flash firmware via USB or Over-The-Air (OTA)
- **Build Console** - Real-time compilation output with syntax highlighting

### Advanced Features
- **Rich Component Library** - 35+ pre-configured templates for sensors, switches, lights, and more
  - **Sensors**: DHT22, BME280, DS18B20, Ultrasonic, ADC, BH1750, Pulse Counter, Rotary Encoder
  - **Binary Sensors**: PIR Motion, Door/Window
  - **Switches**: Relay, GPIO
  - **Lights**: RGB, FastLED (WS2812)
  - **Outputs**: GPIO, PWM
  - **Fan**: Binary, Speed control
  - **Number, Select, Button**: Template controls
  - **Display**: SSD1306 OLED
  - **Time**: SNTP synchronization
  - **Text Sensors**: WiFi info, Version
  - **Climate, Cover**: Advanced controls
  - **Advanced**: Lambda, Script, Automation

- **🆕 Pin Mapper** - Interactive pin reference guide
  - Visual pin layout for ESP32/ESP8266 boards
  - Real-time pin conflict detection
  - Function capability indicators (I2C, SPI, ADC, PWM, etc.)
  - Boot state warnings and notes
  - Search and filter pins
  - Grid, List, and Diagram views

- **🆕 Lambda Editor** - Visual C++ lambda builder
  - Template library for common use cases
  - Syntax highlighting and code completion hints
  - Variable tracking and type indicators
  - Control flow, math, sensor filtering templates
  - Time-based logic builder

- **🆕 Automation Builder** - Visual automation creator
  - Drag-and-drop trigger configuration
  - Multiple condition support (AND/OR logic)
  - Sequential action builder
  - Pre-built templates (motion lights, temperature control, etc.)
  - Real-time validation

- **Modern UI/UX**
  - Dark mode support with system preference detection
  - Beautiful shadcn UI components
  - Responsive layout
  - Smooth animations and transitions

- **Developer Tools**
  - YAML syntax validation
  - Configuration export/import
  - Serial port auto-detection
  - Device discovery (mDNS)

### Platform Support
- **ESP32** - All variants (ESP32, ESP32-S2, ESP32-S3, ESP32-C3)
- **ESP8266** - NodeMCU, D1 Mini, and other boards

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or later)
2. **npm** or **yarn**
3. **ESPHome CLI** installed globally:
   ```bash
   pip install esphome
   ```

## 🚀 Installation

### Development Mode

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/esphome-gui-electron.git
   cd esphome-gui-electron
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run electron:dev
   ```

### Production Build

Build the application for your platform:

```bash
npm run electron:build
```

This will create distributables in the `release/` directory:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` installer
- **Linux**: `.AppImage` and `.deb` packages

## 🎯 Usage

### Creating a New Project

1. Click "New Project" in the sidebar
2. Fill in project details:
   - **Name**: Your device name
   - **Description**: Brief description
   - **Platform**: ESP32 or ESP8266
   - **Board**: Select your specific board model
   - **Category**: Optional categorization

### Adding Components

1. Open a project in the editor
2. Browse the Component Library on the left
3. Click "Add Component" on any template
4. Configure the component parameters
5. Component is automatically added to your configuration

### Visual vs YAML Editor

Switch between two editing modes:
- **Visual Editor**: Drag-and-drop components with configuration dialogs
- **YAML Editor**: Direct YAML editing with syntax highlighting

Changes sync automatically between both modes!

### Compiling and Flashing

1. **Save** your configuration
2. **Compile** to check for errors
3. **Upload** via USB or OTA:
   - USB: Connect device and select serial port
   - OTA: Device must be on the network with OTA enabled

## 🏗️ Project Structure

```
esphome-gui-electron/
├── electron/                 # Electron main process
│   ├── main.ts              # Main process entry
│   └── preload.ts           # Preload scripts (IPC bridge)
├── src/                     # React application
│   ├── components/          # React components
│   │   ├── ui/             # shadcn UI components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── ProjectList.tsx # Project grid
│   │   ├── ProjectEditor.tsx
│   │   ├── ComponentLibrary.tsx
│   │   ├── YamlEditor.tsx
│   │   └── BuildConsole.tsx
│   ├── store/              # Zustand state management
│   │   ├── useProjectStore.ts
│   │   ├── useEditorStore.ts
│   │   └── useThemeStore.ts
│   ├── services/           # Business logic
│   │   ├── esphome.ts     # ESPHome operations
│   │   └── templates.ts   # Component templates
│   ├── lib/               # Utilities
│   ├── App.tsx            # Root component
│   ├── main.tsx           # React entry
│   └── index.css          # Global styles
├── package.json
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── tsconfig.json          # TypeScript config
```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Beautiful component library
- **Zustand** - State management
- **Lucide Icons** - Icon library

### Backend
- **Electron** - Desktop app framework
- **Node.js** - Runtime environment
- **ESPHome CLI** - Firmware compilation

### Build Tools
- **Vite** - Fast build tool
- **electron-builder** - Package builder

## 🎨 Component Templates

The application includes ready-to-use templates for:

| Category | Components |
|----------|------------|
| **Sensors** | DHT22, BME280, DS18B20, Ultrasonic |
| **Binary Sensors** | PIR Motion, Door/Window |
| **Switches** | Relay, GPIO |
| **Lights** | RGB, FastLED (WS2812) |
| **Climate** | Daikin AC, Generic |
| **Cover** | Roller Shutters, Blinds |

Each template includes:
- Pre-configured default values
- Required field validation
- Inline documentation
- Common use-case examples

## 🔌 IPC API

The application uses Electron IPC for communication between renderer and main process:

```typescript
window.electronAPI.project.create()
window.electronAPI.project.list()
window.electronAPI.project.update()
window.electronAPI.project.delete()

window.electronAPI.yaml.save()
window.electronAPI.yaml.load()

window.electronAPI.esphome.compile()
window.electronAPI.esphome.upload()
window.electronAPI.esphome.ota()

window.electronAPI.serial.list()
window.electronAPI.device.discover()
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] Command Palette (Ctrl+K)
- [ ] Git integration for version control
- [ ] Cloud backup/sync
- [ ] Home Assistant integration
- [ ] MQTT Explorer
- [ ] Configuration simulator
- [ ] AI-powered suggestions
- [ ] Multi-language support
- [ ] Theme customization
- [ ] Plugin system

## 🐛 Known Issues

- ESPHome CLI must be installed separately
- OTA updates require devices to be on the same network
- Large projects may take time to compile

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ESPHome](https://esphome.io/) - Amazing ESP device framework
- [ESPHomeGuiEasy](https://github.com/TheWhiteWolf1985/ESPHomeGuiEasy) - Inspiration for visual editor
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Electron](https://www.electronjs.org/) - Cross-platform desktop apps

## 📧 Support

For issues and questions:
- Open an [Issue](https://github.com/yourusername/esphome-gui-electron/issues)
- Check [ESPHome Documentation](https://esphome.io/index.html)

---

Made with ❤️ for the ESPHome community
