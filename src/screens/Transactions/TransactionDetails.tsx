import { Button } from '@components/Button'
import { PaddingBottom } from '@components/SafePadding'
import { DefaultTransparent } from '@components/StatusBar'
import TopBar from '@components/TopBar'
import { RouteProp } from '@react-navigation/native'
import type { StackNav } from '@utils/types'
import React from 'react'
import { Text, View } from 'react-native'

type ParamList = {
  TransactionDetails: TransactionDetailsParamList
}

export type TransactionDetailsParamList = {
  green: boolean
  message: string
  date: string
  amount: string
}

export default function TransactionDetails({ navigation, route }: { navigation: StackNav; route: RouteProp<ParamList, 'TransactionDetails'> }) {
  return (
    <>
      <DefaultTransparent />
      <View className='flex-1 justify-between p-5 pb-2'>
        <View>
          <TopBar />
          <Text className='mt-5 text-center text-xl font-bold'>Transaction Details</Text>
          <Text className='mt-5 text-lg'>{JSON.stringify(route.params, null, 2)}</Text>
        </View>
        <View>
          <Button title='Ok, Got it' onPress={() => navigation.goBack()} />
          <PaddingBottom />
        </View>
      </View>
    </>
  )
}
