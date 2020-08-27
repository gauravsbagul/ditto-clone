import { Platform } from 'react-native'

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants'

export function isIphoneX () {
  return (
    // This has to be iOS
    Platform.OS === 'ios' &&
    // Check either, iPhone X or XR
    (isIPhoneXSize() || isIPhoneXrSize())
  )
}

function isIPhoneXSize (dim) {
  return SCREEN_HEIGHT === 812 || SCREEN_WIDTH === 812
}

function isIPhoneXrSize (dim) {
  return SCREEN_HEIGHT === 896 || SCREEN_WIDTH === 896
}
