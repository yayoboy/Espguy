import * as YAML from 'yaml'

export interface ValidationError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

/**
 * Validates YAML syntax and ESPHome-specific requirements
 */
export class YamlValidator {
  /**
   * Validate YAML syntax
   */
  static validateSyntax(yamlContent: string): ValidationResult {
    const errors: ValidationError[] = []

    if (!yamlContent || yamlContent.trim() === '') {
      return { valid: true, errors: [] }
    }

    try {
      // Parse YAML to check syntax
      YAML.parse(yamlContent)
      return { valid: true, errors: [] }
    } catch (error: any) {
      // Extract error details from YAML parser
      const line = error.linePos?.[0]?.line || 1
      const column = error.linePos?.[0]?.col || 1
      const message = error.message || 'YAML syntax error'

      errors.push({
        line,
        column,
        message,
        severity: 'error',
      })

      return { valid: false, errors }
    }
  }

  /**
   * Validate ESPHome configuration requirements
   */
  static validateESPHome(yamlContent: string): ValidationResult {
    const errors: ValidationError[] = []

    if (!yamlContent || yamlContent.trim() === '') {
      return { valid: true, errors: [] }
    }

    try {
      const parsed = YAML.parse(yamlContent)

      if (!parsed || typeof parsed !== 'object') {
        return { valid: true, errors: [] }
      }

      // Check for required esphome section
      if (!parsed.esphome) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Missing required "esphome:" section',
          severity: 'error',
        })
      } else {
        // Check for required fields in esphome section
        if (!parsed.esphome.name) {
          errors.push({
            line: this.findLineNumber(yamlContent, 'esphome:'),
            column: 1,
            message: 'Missing required "name:" field in esphome section',
            severity: 'error',
          })
        }

        if (!parsed.esphome.platform && !parsed.esphome.esp32 && !parsed.esphome.esp8266) {
          errors.push({
            line: this.findLineNumber(yamlContent, 'esphome:'),
            column: 1,
            message: 'Missing platform definition (esp32/esp8266)',
            severity: 'warning',
          })
        }
      }

      // Check for WiFi configuration
      if (!parsed.wifi) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Missing "wifi:" section - WiFi configuration recommended',
          severity: 'warning',
        })
      } else if (parsed.wifi) {
        if (!parsed.wifi.ssid) {
          errors.push({
            line: this.findLineNumber(yamlContent, 'wifi:'),
            column: 1,
            message: 'Missing WiFi SSID',
            severity: 'warning',
          })
        }
        if (!parsed.wifi.password) {
          errors.push({
            line: this.findLineNumber(yamlContent, 'wifi:'),
            column: 1,
            message: 'Missing WiFi password',
            severity: 'warning',
          })
        }
      }

      // Check for logger (recommended)
      if (!parsed.logger) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Missing "logger:" section - logging recommended for debugging',
          severity: 'warning',
        })
      }

      // Check for API or web_server (at least one should be present)
      if (!parsed.api && !parsed.web_server) {
        errors.push({
          line: 1,
          column: 1,
          message: 'No API or web server configured - add "api:" or "web_server:" for remote access',
          severity: 'warning',
        })
      }

      return { valid: errors.filter((e) => e.severity === 'error').length === 0, errors }
    } catch (error) {
      // Syntax errors are handled by validateSyntax
      return { valid: true, errors: [] }
    }
  }

  /**
   * Find line number of a string in YAML content
   */
  private static findLineNumber(yamlContent: string, searchString: string): number {
    const lines = yamlContent.split('\n')
    const lineIndex = lines.findIndex((line) => line.includes(searchString))
    return lineIndex >= 0 ? lineIndex + 1 : 1
  }

  /**
   * Comprehensive validation (syntax + ESPHome rules)
   */
  static validate(yamlContent: string): ValidationResult {
    // First check syntax
    const syntaxResult = this.validateSyntax(yamlContent)
    if (!syntaxResult.valid) {
      return syntaxResult
    }

    // Then check ESPHome requirements
    const esphomeResult = this.validateESPHome(yamlContent)

    return {
      valid: syntaxResult.valid && esphomeResult.valid,
      errors: [...syntaxResult.errors, ...esphomeResult.errors],
    }
  }
}
