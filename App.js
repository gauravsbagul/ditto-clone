import 'react-native-gesture-handler'
import './src/utilities/poly'

import { dark as darkTheme, mapping } from '@eva-design/eva'
import { DarkTheme as darkNavTheme, NavigationContainer } from '@react-navigation/native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import React from 'react'

import { getActiveRoute, navigationRef, route$ } from './src/services/navigation/navigationService'
import RootNavigator from './src/services/navigation/RootNavigator'
import dittoDarkTheme from './src/themes/dittoDark.json' // <-- Import app theme
import { ThemeContext } from './src/themes/ThemeContext'

// // eslint-disable-next-line no-undef
// if (__DEV__) {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render')
//   const ObservableHooks = require('observable-hooks')
//   // @ts-ignore
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//     trackExtraHooks: [
//       [ObservableHooks, 'useObservableState']
//     ]
//   })
// }

const themes = {
  dittoDark: { ...darkTheme, ...dittoDarkTheme }
}

// import * as Sentry from '@sentry/react-native';
// Sentry.init({
//   dsn: 'https://42044a4916614554874cdaf96ea70e59@sentry.io/1529001',
// });

const debug = require('debug')
debug.enable('ditto:*')

console.disableYellowBox = true

export default function App () {
  const [theme, setTheme] = React.useState('dittoDark')
  const currentTheme = themes[theme]

  const toggleTheme = (nextTheme: 'light' | 'dark' | 'dittoDark') => {
    setTheme(nextTheme)
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider mapping={mapping} theme={currentTheme}>
          <NavigationContainer
            ref={navigationRef}
            onStateChange={state => route$.next(getActiveRoute(state))}
            theme={darkNavTheme}
          >
            <RootNavigator />
          </NavigationContainer>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  )
}
