import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { PaddingBottom } from '@components/SafePadding'
import { PRIVACY_LINK, TERMS_AND_CONDITIONS_LINK } from '@utils/constants'

export default function BottomText() {
  return (
    <View>
      <View className='flex-row flex-wrap items-center justify-center'>
        <Text className='text-center text-gray-600'>By continuing you are accepting our </Text>
        <TouchableOpacity>
          <Text className='text-center text-blue-500' onPress={() => Linking.openURL(TERMS_AND_CONDITIONS_LINK)}>
            Terms & Conditions
          </Text>
        </TouchableOpacity>
        <Text className='text-center text-gray-600'> and </Text>
        <TouchableOpacity>
          <Text className='text-center text-blue-500' onPress={() => Linking.openURL(PRIVACY_LINK)}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
      <PaddingBottom />
    </View>
  )
}
