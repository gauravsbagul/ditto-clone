'use strict'

import { useTheme } from '@ui-kitten/components'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  StyleSheet,
  View
} from 'react-native'
import {
  Chip,
  Selectize as UserSearchField
} from 'react-native-material-selectize'

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constants'
import users from '../../user/userService'
import ChipInputListItem from './ChipInputListItem'

// const debug = require('debug')('ditto:scenes:newChat:components:ChipInput')

export default function ChipInput ({ updateSelectedUsers }) {
  //* *******************************************************************************
  // Properties
  //* *******************************************************************************
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const theme = useTheme()
  const searchField = useRef(null)

  const { t } = useTranslation('newChat')

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const getSelectedUsers = () => searchField.current.getSelectedItems().result

  const validate = userId => {
    if (
      getSelectedUsers().length >= 10 &&
      searchField.current.state.text
    ) {
      setError(t('userSearch.usersExcessiveNotice'))
      return false
    } else if (
      (userId === '' && getSelectedUsers().length) ||
      /^@\w+([.-]?\w+)*:\w+([.-]?\w+)*(.\w{2,3})+$/.test(userId.trim())
    ) {
      setError(null)
      updateSelectedUsers([...getSelectedUsers(), userId])
    } else {
      if (searchField.current.state.text.length > 0) setError(t('userSearch.userInvalidNotice'))
      return false
    }
  }

  const onChangeText = text => setSearchTerm(text)

  const onSubmitEditingLocal = userId => {
    return validate(userId)
  }

  const onChipCloseLocal = (onClose, item) => {
    onClose()

    const newList = getSelectedUsers()
    updateSelectedUsers(
      newList.filter(user => user !== item.id)
    )
  }

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  useEffect(() => {
    if (searchTerm === '') {
      // We need to transform the users to simple objects because the
      // prototype is lost between components
      const knownUsers = users.getKnownUsers()
      setItems(knownUsers)
    } else {
      const searchUsers = async () => {
        const userList = await users.searchUsers(searchTerm)
        setItems(userList)
      }
      searchUsers()
    }
  }, [searchTerm])

  return (
    <View>
      <UserSearchField
        ref={searchField}
        chipStyle={styles(theme).chip}
        chipIconStyle={styles(theme).chipIcon}
        error={error}
        itemId='id'
        items={items}
        label={null}
        listStyle={styles(theme).list}
        tintColor='#028fb0'
        trimOnSubmit={false}
        showItems='always'
        textInputProps={{
          onSubmitEditing: onSubmitEditingLocal,
          onBlur: () => searchField.current.submit(),
          placeholder: t('userSearch.usersInputPlaceholder'),
          placeholderTextColor: 'rgba(255,255,255,.3)',
          keyboardType: 'default',
          style: { height: 36, color: theme['text-basic-color'] },
          autoFocus: true,
          onChangeText
        }}
        containerStyle={containerStyle}
        inputContainerStyle={{ borderColor: theme['color-primary-active'] }}
        renderRow={(id, onPress, item) => {
          return (
            <ChipInputListItem
              key={id}
              id={id}
              onPress={onPress}
              item={item}
            />
          )
        }}
        renderChip={(id, onClose, item, style, iconStyle) => (
          <Chip
            key={id}
            iconStyle={iconStyle}
            onClose={() => onChipCloseLocal(onClose, item)}
            text={id}
            textStyle={{ color: theme['text-basic-color'] }}
            style={style}
          />
        )}
      />
    </View>
  )
}

const containerStyle = {
  width: SCREEN_WIDTH * 0.84,
  paddingTop: 0,
  paddingBottom: 0,
  marginLeft: 12
}

const styles = theme => StyleSheet.create({
  chip: {
    paddingRight: 2,
    backgroundColor: theme['background-basic-color-2']
  },
  chipIcon: {
    height: 24,
    width: 24,
    backgroundColor: theme['color-primary-active']
  },
  list: {
    height: SCREEN_HEIGHT * 2
  }
})
