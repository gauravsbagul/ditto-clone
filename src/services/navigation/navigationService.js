import React from 'react'
import { BehaviorSubject } from 'rxjs'

export const navigationRef = React.createRef()
export const route$ = new BehaviorSubject(null)

export function getActiveRoute (state, parentPath = '') {
  const route = state.routes[state.index]
  const path = `${parentPath}/${route.name}`
  if (route.state) {
    // Dive into nested navigators
    return getActiveRoute(route.state, path)
  }
  return { ...route, path }
}

function navigate (name, params) {
  // eslint-disable-next-line no-unused-expressions
  navigationRef.current?.navigate(name, params)
}

export default {
  navigate
}
