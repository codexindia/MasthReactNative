import { Button } from '@components/Button'
import { IronSource, type IronSourceBannerOptions } from 'ironsource-mediation'
import React from 'react'
import { View } from 'react-native'
export default function Banner() {
  function fn() {
    const bannerOptions: IronSourceBannerOptions = {
      position: 'BOTTOM',
      sizeDescription: 'BANNER',
      placementName: 'Home_Screen',
    }
    IronSource.loadBanner(bannerOptions)
  }

  return (
    <View className='flex-1 items-center justify-center p-5'>
      <Button title='Show Banner' onPress={fn} />
    </View>
  )
}
