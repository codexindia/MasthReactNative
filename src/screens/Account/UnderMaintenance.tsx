import { SmallButton } from '@components/Button'
import PhoneSettingIcon from '@icons/phone_setting.svg'
import React from 'react'
import { BackHandler, Dimensions, Text, View } from 'react-native'

const { width, height } = Dimensions.get('window')

const iconSize = width * 0.35

export default function UnderMaintenance() {
  return (
    <View className='flex-1 items-center justify-center p-6'>
      <View className='items-center justify-center gap-5'>
        <PhoneSettingIcon width={iconSize} height={iconSize} />
        <Text className='text-3xl font-bold'>System Under maintenance</Text>
        <Text className='px-2 text-center text-lg'>Please be patient we will make the app live soon.</Text>
        <View className='pt-5'>
          <SmallButton
            title='Close App'
            className='px-10 py-3'
            onPress={() => {
              BackHandler.exitApp()
            }}
          />
        </View>
      </View>
    </View>
  )
}
