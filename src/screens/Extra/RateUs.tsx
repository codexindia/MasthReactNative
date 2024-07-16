import { Button } from '@components/Button'
import { PaddingBottom } from '@components/SafePadding'
import { DefaultTransparent } from '@components/StatusBar'
import TopBar from '@components/TopBar'
import { colors } from '@utils/colors'
import { PLAY_STORE_LINK } from '@utils/constants'
import { ls } from '@utils/storage'
import type { StackNav } from '@utils/types'
import LottieView from 'lottie-react-native'
import React from 'react'
import { Dimensions, Linking, Text, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const { width } = Dimensions.get('window')

export default function RateUs({ navigation }: { navigation: StackNav }) {
  return (
    <>
      <DefaultTransparent />
      <View className='flex-1 justify-between pb-2 pt-5'>
        <View className='items-center justify-center'>
          <TopBar />
          <Text className='mt-5 text-center text-xl font-bold'>Rate Us</Text>
          <LottieView
            source={require('@assets/anim/rate_us.lottie')}
            autoPlay
            loop
            style={{
              // backgroundColor: 'lime',
              width: width,
              height: width,
            }}
          />
          <Text className='text-center text-2xl'>How was your experience with us!</Text>
          <Text className='mt-2 w-3/4 text-center text-lg text-gray-500'>Your feedback fuels our progress. Rate us today!</Text>
          <View className='mt-5 flex-row justify-between' style={{ gap: 15 }}>
            <AntDesign name='star' size={30} color={colors.accent} />
            <AntDesign name='star' size={30} color={colors.accent} />
            <AntDesign name='star' size={30} color={colors.accent} />
            <AntDesign name='star' size={30} color={colors.accent} />
            <AntDesign name='star' size={30} color={colors.accent} />
          </View>
        </View>
        <View style={{ gap: 10 }} className='px-5'>
          <Button title='Rate Later' variant='outline' onPress={() => navigation.goBack()} />
          <Button
            title='Rate us'
            onPress={() => {
              navigation.goBack()
              ls.set('rated', 'true')
              Linking.openURL(PLAY_STORE_LINK)
            }}
          />
          <PaddingBottom />
        </View>
      </View>
    </>
  )
}
