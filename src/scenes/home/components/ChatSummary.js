import { Text } from '@ui-kitten/components'
import React from 'react'
import styled from 'styled-components/native'

import { SCREEN_WIDTH } from '../../../constants'

// const debug = require('debug')('ditto:scenes:home:components:ChatSummary')

export default function ChatSummary ({ name, snippet, readState }) {
  return (
    <StyledView>
      <Text
        category='p1'
        numberOfLines={1}
        style={readState === 'unread' ? { fontWeight: 'bold', fontSize: 15 } : {}}
      >
        {name}
      </Text>
      <Text
        appearance='hint'
        category='p2'
        numberOfLines={2}
        style={readState === 'unread' ? { fontWeight: 'bold' } : {}}
      >
        {snippet}
      </Text>
    </StyledView>
  )
}

const StyledView = styled.View`
  max-width: ${SCREEN_WIDTH * 0.5};
  margin-left: 14;
`
