import { SmallButton } from '@components/Button'
import DoubtEmoji from '@icons/doubt_emoji.svg'
import type { RouteProp } from '@react-navigation/native'
import { MAIL_TO_LINK } from '@utils/constants'
import type { StackNav } from '@utils/types'
import React from 'react'
import { Dimensions, Linking, Text, View } from 'react-native'

const { width, height } = Dimensions.get('window')

const iconSize = width * 0.35
type ParamList = {
  Suspended: SuspendedParamList
}

export type SuspendedParamList = {
  reason: string
}

export default function Suspended({ navigation, route }: { navigation: StackNav; route: RouteProp<ParamList, 'Suspended'> }) {
  return (
    <View className='flex-1 items-center justify-center p-6'>
      <View className='items-center justify-center gap-5'>
        <DoubtEmoji width={iconSize} height={iconSize} />
        <Text className='text-3xl font-bold'>Account Suspended</Text>
        <Text className='px-2 text-center text-lg'>We are sorry to inform you that your account is being suspended due to suspicious activities</Text>
        <Text className='px-2 text-center text-lg text-red-500'>Reason: {route.params.reason}</Text>
        <View className='pt-5'>
          <SmallButton title='Contact with Admin' className='bg-red-500 px-6 py-3 text-white' onPress={() => Linking.openURL(MAIL_TO_LINK)} />
        </View>
      </View>
    </View>
  )
}
