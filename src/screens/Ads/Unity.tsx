import React, { useState, useEffect } from 'react'
import { View, Text, Button, Platform, StyleSheet } from 'react-native'
import UnityAds from 'react-native-unity-ads-monetization'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // const gameId = Platform.select({
    //   android: '4785439',
    //   ios: '4785439',
    // });
    const gameId = '4785439'

    UnityAds.initialize(gameId, true).then((_) => UnityAds.loadAd('Rewarded_Android'))

    UnityAds.setOnUnityAdsLoadListener({
      onAdLoaded: (placementId) => {
        setLoaded(true)
        UnityAds.showAd('Rewarded_Android')
      },
      onAdLoadFailed: function (placementId: string, message: string): void {
        throw new Error('Function not implemented.')
      },
    })

    // Add other event listeners as needed
  }, [])

  if (loaded) {
    // UnityAds.showAd('Interstitial_Android');
  }

  return (
    <View style={styles.container}>
      <Text>Ads loaded: {loaded ? 'true' : 'false'}</Text>
      <Button disabled={!loaded} onPress={() => UnityAds.showAd('Rewarded_Android')} title={'Show Ads'} />
    </View>
  )
}

// Styles for your app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
