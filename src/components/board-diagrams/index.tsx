import { BoardPin } from '@/services/pinout'
import ESP32DevKit from './ESP32DevKit'
import D1Mini from './D1Mini'
import ESP32S3 from './ESP32S3'
import NodeMCUV2 from './NodeMCUV2'

export interface BoardDiagramComponentProps {
  pins: BoardPin[]
  usedPins: string[]
  hoveredPin: string | null
  onPinHover: (pin: string | null) => void
  onPinClick?: (pin: BoardPin) => void
}

/**
 * Map board IDs to their specific diagram components
 */
export const BOARD_DIAGRAMS: Record<string, React.ComponentType<BoardDiagramComponentProps>> = {
  // ESP32 variants
  'esp32dev': ESP32DevKit,
  'esp32-wroom-32': ESP32DevKit,
  'esp32-devkit': ESP32DevKit,
  'esp32-s3': ESP32S3,
  'esp32s3': ESP32S3,

  // ESP8266 variants
  'd1_mini': D1Mini,
  'd1-mini': D1Mini,
  'd1_mini_pro': D1Mini,
  'nodemcuv2': NodeMCUV2,
  'nodemcu-v2': NodeMCUV2,
  'nodemcu': NodeMCUV2,
}

/**
 * Get the specific diagram component for a board
 */
export function getBoardDiagram(boardId: string): React.ComponentType<BoardDiagramComponentProps> | null {
  const normalizedId = boardId.toLowerCase().replace(/[_\s]/g, '-')
  return BOARD_DIAGRAMS[normalizedId] || BOARD_DIAGRAMS[boardId] || null
}

/**
 * Check if a board has a specific diagram available
 */
export function hasBoardDiagram(boardId: string): boolean {
  return getBoardDiagram(boardId) !== null
}

export { PinElement } from './PinElement'
