import { useTheme } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import { Linking, Text } from 'react-native'
import HtmlRenderer from 'react-native-render-html'

import { htmlEmojis } from '../../../../utilities'

// const debug = require('debug')('ditto:scene:chat:message:components:Html')

export default function Html ({ html }) {
  const theme = useTheme()
  const styles = getHtmlStyles(theme)
  const [parsedHtml, setParsedHtml] = useState(htmlEmojis(html))

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const onLinkPress = (e, link) => {
    if (link) {
      Linking.canOpenURL(link).then(() => {
        Linking.openURL(link)
      })
    }
  }

  const renderers = {
    emoji: { renderer: emojiRenderer, wrapper: 'Text' }
  }

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  useEffect(() => {
    if (html === parsedHtml) return

    setParsedHtml(htmlEmojis(html))
  }, [html, parsedHtml])

  return (
    <HtmlRenderer
      html={parsedHtml}
      renderers={renderers}
      onLinkPress={onLinkPress}
      {...styles}
    />
  )
}

const emojiRenderer = (htmlAttribs, children, convertedCSSStyles, passProps) => (
  <Text key={passProps.key} style={{ fontFamily: 'NotoColorEmoji' }}>{children}</Text>
)

const getHtmlStyles = theme => {
  return {
    baseFontStyle: {
      color: theme['text-basic-color'],
      fontSize: 16,
      letterSpacing: 0.3,
      fontWeight: '400'
    },
    tagsStyles: {
      blockquote: {
        borderLeftColor: theme['color-danger-active'],
        borderLeftWidth: 3,
        paddingLeft: 10,
        marginVertical: 10,
        opacity: 0.8
      },
      p: {},
      a: {
        color: theme['color-info-200']
      }
    }
  }
}
