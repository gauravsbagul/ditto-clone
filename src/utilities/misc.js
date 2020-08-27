import Color from 'color'
import { Alert, Linking, Platform, ToastAndroid } from 'react-native'

export function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function getNameColor (name) {
  const code = hashCode(name)
  const hex = intToHex(code)
  let col = Color(`#${hex}`)
  if (col.isDark()) {
    col = col.lighten(0.7)
  }
  return col.hex()
}

function hashCode (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

function intToHex (i) {
  const c = (i & 0x00ffffff).toString(16).toUpperCase()
  return '00000'.substring(0, 6 - c.length) + c
}

export function isIos () {
  return Platform.OS === 'ios'
}

const WWW_URL_PATTERN = /^www\./i
export function onUrlPress (url) {
  // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
  // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
  if (WWW_URL_PATTERN.test(url)) {
    onUrlPress(`http://${url}`)
  } else {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.error('No handler for URL:', url)
      } else {
        Linking.openURL(url)
      }
    })
  }
}

export function showError (title, message) {
  if (Platform.OS === 'ios') {
    Alert.alert(title, message)
  } else if (Platform.OS === 'android') {
    ToastAndroid.show(`${title}: ${message}`, ToastAndroid.SHORT)
  }
}

export function toImageBuffer (data) {
  return Buffer.from(data, 'base64')
}
