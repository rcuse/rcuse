export type EventType = MouseEvent | TouchEvent

export interface UseLongPressOptions {
  delay?: number
  moveThreshold?: { x?: number, y?: number }
  onClick?: (event: EventType) => void
  onLongPressEnd?: (event: EventType) => void
}
