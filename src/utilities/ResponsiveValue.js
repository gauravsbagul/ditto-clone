import { SCREEN_HEIGHT } from '../constants'

export function responsive (value) {
  // guideline height for standard 5" device screen
  const standardScreenHeight = 680
  const heightPercent = (value * SCREEN_HEIGHT) / standardScreenHeight
  return Math.round(heightPercent)
}
