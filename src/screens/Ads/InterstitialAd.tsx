import { e, p, prettyJSON, showAlert } from '@utils/utils'
import { IronSource, LevelPlayInterstitialEvents as LevelPlayInterstitial, type IronSourceAdInfo, type IronSourceError } from 'ironsource-mediation'
import { useEffect, useState } from 'react'

const INTERSTITIAL_PLACEMENT = 'Main_Menu'

const loadInterstitial = async () => {
  p('Load Interstitial Click')
  await IronSource.loadInterstitial()
}

export default function InterstitialAd() {
  const [isInterstitialAvailable, setIsInterstitialAvailable] = useState<boolean>(false)
  const showInterstitial = async () => {
    p('Show Interstitial Click')
    if (await IronSource.isInterstitialReady()) {
      // Show
      // IronSource.showInterstitial();

      // Show by placement
      const isCapped = await IronSource.isInterstitialPlacementCapped(INTERSTITIAL_PLACEMENT)
      if (!isCapped) {
        IronSource.showInterstitial(INTERSTITIAL_PLACEMENT)
      } else {
        __DEV__ && showAlert('Interstitial Placement', [`${INTERSTITIAL_PLACEMENT} is capped`])
      }
    }
    setIsInterstitialAvailable(false)
  }

  // Interstitial Event listeners setup
  useEffect(() => {
    const TAG = 'LevelPlayInterstitialListener'
    // initialize
    LevelPlayInterstitial.removeAllListeners()
    // Set LevelPlay Interstitial Events listeners
    LevelPlayInterstitial.onAdReady.setListener((adInfo: IronSourceAdInfo) => {
      p(`${TAG} - onAdReady: ${prettyJSON(adInfo)}`)
      setIsInterstitialAvailable(true)
    })
    LevelPlayInterstitial.onAdLoadFailed.setListener((error: IronSourceError) => {
      __DEV__ && showAlert('Ad Load Error', [prettyJSON(error)])
      e(`${TAG} - onAdLoadFailed error: ${prettyJSON(error)}`)
    })
    LevelPlayInterstitial.onAdOpened.setListener((adInfo: IronSourceAdInfo) => p(`${TAG} - onAdOpened: ${prettyJSON(adInfo)}`))
    LevelPlayInterstitial.onAdClosed.setListener((adInfo: IronSourceAdInfo) => p(`${TAG} - onAdClosed: ${prettyJSON(adInfo)}`))
    LevelPlayInterstitial.onAdShowFailed.setListener((error: IronSourceError, adInfo: IronSourceAdInfo) => {
      __DEV__ && showAlert('Ad Show Error', [prettyJSON(error)])
      p(`${TAG} - onAdShowFailed\n` + ` error: ${prettyJSON(error)}\n` + ` adInfo: ${prettyJSON(adInfo)}`)
    })
    LevelPlayInterstitial.onAdClicked.setListener((adInfo: IronSourceAdInfo) => p(`${TAG} - onAdClicked: ${prettyJSON(adInfo)}`))
    LevelPlayInterstitial.onAdShowSucceeded.setListener((adInfo: IronSourceAdInfo) => p(`${TAG} - onAdShowSucceeded: ${prettyJSON(adInfo)}`))

    return () => LevelPlayInterstitial.removeAllListeners()
  }, [])

  useEffect(() => {
    if (isInterstitialAvailable) {
      showInterstitial()
    }
  }, [isInterstitialAvailable])

  // Load Interstitial on mount
  useEffect(() => {
    loadInterstitial()
  }, [])

  return null
}
