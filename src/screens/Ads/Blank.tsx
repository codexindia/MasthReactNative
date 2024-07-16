import { Button } from '@components/Button'
import { p, showAlert } from '@utils/utils'
import {
  IronSource,
  LevelPlayRewardedVideoEvents,
  type IronSourceAdInfo,
  type IronSourceError,
  type IronSourceRVPlacement,
} from 'ironsource-mediation'
import React from 'react'
import { Alert, View } from 'react-native'

const REWARDED_VIDEO_PLACEMENT = 'Home_Screen'

LevelPlayRewardedVideoEvents.onAdReady.setListener((adInfo: IronSourceAdInfo) => {
  console.log(adInfo)
})
LevelPlayRewardedVideoEvents.onAdOpened.setListener((adInfo: IronSourceAdInfo) => {
  console.log(adInfo)
})
LevelPlayRewardedVideoEvents.onAdClosed.setListener((adInfo: IronSourceAdInfo) => {
  console.log(adInfo)
})
LevelPlayRewardedVideoEvents.onAdAvailable.setListener((adInfo: IronSourceAdInfo) => {
  console.log(adInfo)
})
LevelPlayRewardedVideoEvents.onAdUnavailable.setListener(() => {
  console.log('Ad Unavailable')
})
LevelPlayRewardedVideoEvents.onAdRewarded.setListener((placement: IronSourceRVPlacement, adInfo: IronSourceAdInfo) => {
  console.log(placement, adInfo)
})
LevelPlayRewardedVideoEvents.onAdShowFailed.setListener((ironSourceError: IronSourceError, adInfo: IronSourceAdInfo) => {
  console.log(ironSourceError, adInfo)
})
LevelPlayRewardedVideoEvents.onAdClicked.setListener((placement: IronSourceRVPlacement, adInfo: IronSourceAdInfo) => {
  console.log(placement, adInfo)
})

export default function Blank() {
  const showRewardedVideo = async () => {
    p('Show Rewarded Video Click')
    if (await IronSource.isRewardedVideoAvailable()) {
      // This must be called before show.
      // await IronSource.setDynamicUserId('some-dynamic-application-user-id');

      // Show
      // IronSource.showRewardedVideo();

      // Show by placement
      const isCapped = await IronSource.isRewardedVideoPlacementCapped(REWARDED_VIDEO_PLACEMENT)
      if (!isCapped) {
        IronSource.showRewardedVideo(REWARDED_VIDEO_PLACEMENT)
      } else {
        showAlert('Rewarded Video Placement', [`${REWARDED_VIDEO_PLACEMENT} is capped`])
      }
    } else {
      Alert.alert('Rewarded Video Not Available')
    }
  }
  return (
    <View className='flex-1 items-center justify-center p-5'>
      <Button title='Show Ad' onPress={showRewardedVideo} />
    </View>
  )
}
