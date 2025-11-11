import * as yaml from 'yaml'
import { Component } from '@/store/useEditorStore'

export interface ESPHomeConfig {
  esphome: {
    name: string
    platform: string
    board: string
  }
  wifi?: {
    ssid: string
    password: string
  }
  api?: {
    password?: string
  }
  ota?: {
    password?: string
  }
  logger?: Record<string, any>
  [key: string]: any
}

export class ESPHomeService {
  static componentsToYaml(
    projectName: string,
    platform: string,
    board: string,
    components: Component[]
  ): string {
    const config: ESPHomeConfig = {
      esphome: {
        name: projectName.toLowerCase().replace(/\s+/g, '_'),
        platform,
        board,
      },
      wifi: {
        ssid: '!secret wifi_ssid',
        password: '!secret wifi_password',
      },
      api: {},
      ota: {},
      logger: {},
    }

    // Group components by platform
    components.forEach((component) => {
      const { platform, config: componentConfig } = component

      if (!config[platform]) {
        config[platform] = []
      }

      if (Array.isArray(config[platform])) {
        config[platform].push(componentConfig)
      } else {
        config[platform] = [config[platform], componentConfig]
      }
    })

    return yaml.stringify(config)
  }

  static yamlToComponents(yamlString: string): Component[] {
    try {
      const config = yaml.parse(yamlString)
      const components: Component[] = []

      // Extract components from YAML
      Object.entries(config).forEach(([platform, value]) => {
        if (
          platform === 'esphome' ||
          platform === 'wifi' ||
          platform === 'api' ||
          platform === 'ota' ||
          platform === 'logger'
        ) {
          return
        }

        const items = Array.isArray(value) ? value : [value]

        items.forEach((item: any, index: number) => {
          const id = `${platform}-${index}-${Date.now()}`
          const name = item.name || item.id || `${platform}_${index}`

          components.push({
            id,
            type: platform,
            name,
            platform,
            config: item,
          })
        })
      })

      return components
    } catch (error) {
      console.error('Error parsing YAML:', error)
      return []
    }
  }

  static validateYaml(yamlString: string): { valid: boolean; error?: string } {
    try {
      yaml.parse(yamlString)
      return { valid: true }
    } catch (error) {
      return { valid: false, error: (error as Error).message }
    }
  }

  static getDefaultConfig(
    projectName: string,
    platform: string,
    board: string
  ): string {
    const config: ESPHomeConfig = {
      esphome: {
        name: projectName.toLowerCase().replace(/\s+/g, '_'),
        platform,
        board,
      },
      wifi: {
        ssid: '!secret wifi_ssid',
        password: '!secret wifi_password',
      },
      api: {},
      ota: {},
      logger: {},
    }

    return yaml.stringify(config)
  }
}
