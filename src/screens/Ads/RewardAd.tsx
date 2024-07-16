import { ADMOB_AD_ID } from '@utils/constants'
import { useEffect } from 'react'
import { ToastAndroid } from 'react-native'
import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads'

const adUnitId = __DEV__ ? TestIds.REWARDED : ADMOB_AD_ID
const rewarded = RewardedAd.createForAdRequest(adUnitId)

export default function RewardAd() {
  useEffect(() => {
    let unsubscribeLoaded: null | (() => void) = null
    let unsubscribeError: null | (() => void) = null
    let unsubscribeEarned: null | (() => void) = null

    rewarded.load()

    unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Ad loaded')
    })

    unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward of', reward)
    })

    unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      // Ad failed to load so set the isLoaded to true so that the user can start mining
      console.log('Ad failed to load', error)
      __DEV__ && ToastAndroid.show('Ad failed to load', ToastAndroid.SHORT)
    })

    return () => {
      unsubscribeLoaded && unsubscribeLoaded()
      unsubscribeError && unsubscribeError()
      unsubscribeEarned && unsubscribeEarned()
    }
  }, [])
  return null
}
