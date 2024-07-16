import { Button, SmallButton } from '@components/Button'
import PlayIcon from '@icons/play.svg'
import StopRound from '@icons/stop-round.svg'
import { check_mining_status_f, start_mining_f, type ProfileT } from '@query/api'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useMutation, useQuery, type UseMutationResult } from '@tanstack/react-query'
import { UNITY_GAME_ID } from '@utils/constants'
import { ls } from '@utils/storage'
import { RootStackParamList } from 'App'
import LottieView from 'lottie-react-native'
import React, { useEffect } from 'react'
import { AppState, Dimensions, Modal, StyleSheet, Text, View } from 'react-native'
import UnityAds from 'react-native-unity-ads-monetization'
import { useBannedNavigation } from './ExtraNavs'
import { log } from '@utils/utils'

const { height, width } = Dimensions.get('window')

enum AdState {
  NOT_LOADED,
  LOADED,
  FAILED,
}

export default function MiningOrWalletBalance({ profile, profileQuery }: { profile: ProfileT | null; profileQuery: ReturnType<typeof useQuery> }) {
  const [adState, setAdState] = React.useState<AdState>(AdState.NOT_LOADED)
  const [balance, setBalance] = React.useState(Number(profile?.data?.coin || 0))
  const [modalVisible, setModalVisible] = React.useState(false)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const mining = useQuery({
    queryKey: ['miningStatus'],
    queryFn: check_mining_status_f,
    retry: 3,
  })

  useEffect(() => {
    const subscription = AppState.addEventListener('change', () => {
      if (AppState.currentState === 'active') {
        log('Mining status updated on app active state')
        mining.refetch()
      }
    })
    return () => subscription.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    console.log(mining.data)
  }, [mining.data])

  const startMining = useMutation({
    mutationKey: ['startMining'],
    mutationFn: start_mining_f,
    onSuccess: (data) => {
      console.log('Mining started')
      mining.refetch()
    },
  })
  useBannedNavigation(navigation, startMining.data)

  function handleStartMining() {
    if (adState === AdState.LOADED) showAd() // Show the ad if it is loaded
    else if (adState === AdState.FAILED) startMiningFn() // Start mining if the ad is failed
    __DEV__ && startMiningFn()
  }

  function startMiningFn() {
    startMining.mutate()
    if (!ls.getString('rated')) {
      setTimeout(() => {
        !__DEV__ && navigation.navigate('RateUs')
      }, 2000)
    }
  }

  function loadAd() {
    console.log('Loading ad')
    UnityAds.initialize(UNITY_GAME_ID, true).then((_) => UnityAds.loadAd('Rewarded_Android'))
    UnityAds.setOnUnityAdsLoadListener({
      onAdLoaded: (placementId) => {
        console.log('Ad loaded', placementId)
        setAdState(AdState.LOADED)
      },
      onAdLoadFailed: function (placementId: string, message: string): void {
        setAdState(AdState.FAILED)
        console.error(`UnityAds.onAdLoadFailed: ${placementId}, ${message}`)
      },
    })
    UnityAds.setOnUnityAdsShowListener({
      onShowStart: (placementId: string) => {
        console.log(`UnityAds.onShowStart: ${placementId}`)
      },
      onShowComplete: (placementId: string, state: 'SKIPPED' | 'COMPLETED') => {
        console.log(`UnityAds.onShowComplete: ${placementId}, ${state}`)
        startMiningFn()
      },
      onShowFailed: (placementId: string, message: string) => {
        console.error(`UnityAds.onShowFailed: ${placementId}, ${message}`)
        startMiningFn()
      },
      onShowClick: (placementId: string) => {
        console.log(`UnityAds.onShowClick: ${placementId}`)
      },
    })
  }

  function showAd() {
    UnityAds.showAd('Rewarded_Android')
  }

  useEffect(() => {
    console.log('Mining data', mining.data?.mining_function)
    if (mining.data?.mining_function) {
      !__DEV__ && loadAd()
      __DEV__ && setAdState(AdState.LOADED)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mining.data?.mining_function])

  return (
    <>
      <View className={`${!mining.data?.mining_function ? 'bg-white' : 'bg-secondary'} mt-5 rounded-3xl p-5`}>
        <Text className='text-base text-onYellow'>Wallet Balance</Text>
        <View className='flex-row items-end'>
          <Text className='text-onYellow' style={{ fontSize: 40 }}>
            {Math.max(balance, Number(profile?.data?.coin || 0)).toFixed(4)}
          </Text>
          <Text className='mb-1.5 ml-1 text-2xl text-onYellow'>MST</Text>
        </View>
        {mining.data && !mining.data?.mining_function && mining.data.mining_data ? (
          <LoadingBar
            currentTime={mining.data.mining_data.current_time}
            setBalance={setBalance}
            realBalance={Number(profile?.data?.coin || 0)}
            startTime={mining.data?.mining_data.start_time}
            endTime={mining.data?.mining_data.end_time}
            mining={mining}
            coin={Number(mining.data.mining_data.coin)}
            profileQuery={profileQuery}
          />
        ) : (
          <View className='mt-3 flex-row items-center justify-between' style={{ gap: 15 }}>
            <View style={{ flex: 0.55 }}>
              <SmallButton
                LeftUI={<PlayIcon width={17} height={17} />}
                onPress={handleStartMining}
                title={getStatusString(mining, startMining.isPending, adState)}
                disabled={
                  adState === AdState.NOT_LOADED || getIsButtonDisabled(mining, startMining as UseMutationResult<unknown, unknown, unknown, unknown>)
                }
              />
            </View>
            <View style={{ flex: 0.45 }} className='flex-row'>
              <Text style={{ fontSize: 15 }} className='text-onYellow'>
                1 Masth
              </Text>
              <Text style={{ fontSize: 15 }} className='text-onYellow opacity-60'>
                {' '}
                / Hour
              </Text>
            </View>
          </View>
        )}
      </View>
      <AdLoafFailedPopupUi modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </>
  )
}

function getIsButtonDisabled(
  mining: ReturnType<typeof useQuery>,
  startMining: ReturnType<typeof useMutation>,
  // isFailed: boolean,
  // isLoaded: boolean,
): boolean {
  return mining.isLoading || mining.isPending || mining.isFetching || mining.isRefetching || startMining.isPending
}

function getStatusString(mining: ReturnType<typeof useQuery>, isPending: boolean, adState: AdState): string {
  if (adState === AdState.NOT_LOADED) return 'Connecting...'
  if (mining.isLoading || mining.isPending || mining.isFetching || mining.isRefetching) return 'Connecting...'
  // if (isFailed) return 'Start Mining'
  // if (!isLoaded) return 'Connecting....'
  if (isPending) return 'Starting...'
  return 'Start Mining'
}

function AdLoafFailedPopupUi({ modalVisible, setModalVisible }: { modalVisible: boolean; setModalVisible: (val: boolean) => void }) {
  if (!modalVisible) return null
  return (
    <View style={[styles.centeredView]}>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        statusBarTranslucent={true}
      >
        <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <View className='flex items-center justify-center rounded-3xl bg-white px-7 py-7' style={{ width: width * 0.9 }}>
            <LottieView
              source={require('@assets/anim/disconnected.lottie')}
              autoPlay
              loop
              style={{
                width: width * 0.7,
                height: width * 0.7,
              }}
            />
            <Text className='mt-5 text-center text-lg text-gray-500'>
              Uh-oh! Looks like your device is having trouble connecting to our mining server. Please click on 'Start Mining' again to try again.
            </Text>
            <Button title='Ok, Got it' className='mt-10' onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: width,
    height: height + 100,
  },
})

const ANIM_ASPECT_RATIO = 1440 / 850
const ANIM_SIZE = 38

function LoadingBar({
  currentTime,
  startTime,
  endTime,
  mining,
  coin,
  realBalance: balance,
  setBalance,
  profileQuery,
}: {
  currentTime: string
  startTime: string
  endTime: string
  mining: ReturnType<typeof useQuery>
  coin: number
  realBalance: number
  setBalance: React.Dispatch<React.SetStateAction<number>>
  profileQuery: ReturnType<typeof useQuery>
}) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const [passedTime, setPassedTime] = React.useState(0)
  const [cur, setCur] = React.useState(new Date(currentTime).getTime())
  const [progress, setProgress] = React.useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCur((prev) => prev + 1000)
      setPassedTime((prev) => prev + 1000)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setCur(new Date(currentTime).getTime())
    setPassedTime(0)
  }, [currentTime])

  useEffect(() => {
    let timer: any
    const total = end - start
    const current = cur - start
    const p = (current / total) * 100
    setProgress(p > 100 ? 100 : p)

    // If the mining is finished, refetch the mining status
    if (current >= total || progress >= 100) {
      timer = setTimeout(() => {
        mining.refetch()
        profileQuery.refetch()
      }, 5000)
      setBalance(balance + coin)
    } else {
      const extraBalance = (current / total) * coin
      setBalance(balance + extraBalance)
    }

    return () => timer && clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur])

  return (
    <>
      <View className='mt-2 flex-row overflow-hidden rounded-full bg-[#f0efef]'>
        <View className='flex-row items-center'>
          <View
            className='flex-row items-center px-3'
            style={{
              backgroundColor: '#67cf5f',
              width: `${progress > 100 ? 100 : Math.max(progress, 0)}%`,
              height: 38,
            }}
          >
            <StopRound width={20} height={20} style={{ zIndex: 10 }} />
          </View>
          <LottieView
            source={require('@assets/anim/loading_anim.lottie')}
            autoPlay
            loop
            style={{
              width: ANIM_SIZE * ANIM_ASPECT_RATIO,
              height: ANIM_SIZE,
              zIndex: -1,
            }}
            speed={6}
          />
        </View>
      </View>
      <View className='mt-1 flex-row justify-between px-1.5'>
        <Text className='text-center text-neutral-600'>{progress.toFixed(2)}% Completed</Text>
        <Text className='text-center text-neutral-600'>{timeLeft(cur, end)} Time Left</Text>
      </View>
    </>
  )
}

function timeLeft(cur: number, end: number) {
  const now = new Date(cur).getTime()
  const diff = end - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return `${adZero(hours)}:${adZero(minutes)}:${adZero(seconds)}`
}

function adZero(num: number) {
  if (num <= 0) return '00'
  return num < 10 ? `0${num}` : num
}
