import { SmallButton } from '@components/Button'
import AppUpdateIcon from '@icons/update_setting.svg'
import type { RouteProp } from '@react-navigation/native'
import type { StackNav } from '@utils/types'
import React, { useEffect } from 'react'
import { Dimensions, Linking, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
const { width, height } = Dimensions.get('window')

const iconSize = width * 0.35

type ParamList = {
  AppUpdate: AppUpdateParamList
}

export type AppUpdateParamList = {
  link: string
}

export default function AppUpdate({ navigation, route }: { navigation: StackNav; route: RouteProp<ParamList, 'AppUpdate'> }) {
  useEffect(() => {
    console.log(route.params.link)
  }, [route.params.link])
  return (
    <View className='flex-1 items-center justify-center p-6'>
      <View className='items-center justify-center gap-5'>
        <AppUpdateIcon width={iconSize} height={iconSize} />
        <Text className='text-3xl font-bold'>App Update Available</Text>
        <Text className='px-2 text-center text-lg'>Please update your app to get the latest functions and bugs free experience.</Text>
        <View className='pt-5'>
          <SmallButton
            title='Update Now'
            className='px-6 py-3'
            LeftUI={<Icon name='logo-google-playstore' size={16} color='white' />}
            onPress={() => {
              console.log('Redirecting to playstore...' + route.params.link)
              Linking.openURL(route.params.link)
            }}
          />
        </View>
      </View>
    </View>
  )
}
