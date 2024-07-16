import DoubleArrow from '@icons/double-arrow.svg'
import { check_mining_status_f } from '@query/api'
import { useNavigation, type NavigationProp } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import type { RootStackParamList } from 'App'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default function InitiateMining() {
  // const [isLoaded, setIsLoaded] = useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)
  // const [isFailed, setIsFailed] = React.useState(false)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const mining = useQuery({
    queryKey: ['miningStatus'],
    queryFn: check_mining_status_f,
    retry: 3,
  })

  // useEffect(() => {
  //   let unsubscribeLoaded: null | (() => void) = null
  //   let unsubscribeError: null | (() => void) = null
  //   let unsubscribeEarned: null | (() => void) = null

  //   if (mining.data?.mining_function) {
  //     rewarded.load()

  //     unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
  //       setIsLoaded(true)
  //       console.log('Ad loaded')
  //     })

  //     unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
  //       console.log('User earned reward of', reward)
  //       navigation.navigate('Mining')
  //     })

  //     unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
  //       // Ad failed to load so set the isLoaded to true so that the user can start mining
  //       console.log('Ad failed to load', error)
  //       setIsFailed(true)
  //       __DEV__ && ToastAndroid.show('Ad failed to load', ToastAndroid.SHORT)
  //     })
  //   }

  //   return () => {
  //     unsubscribeLoaded && unsubscribeLoaded()
  //     unsubscribeError && unsubscribeError()
  //     unsubscribeEarned && unsubscribeEarned()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mining.data])

  function onClickInitiate() {
    // try {
    //   if (isLoaded && !isFailed) {
    //     rewarded.show()
    //   } else {
    //     navigation.navigate('Mining')
    //   }
    // } catch (error) {
    //   console.log('Error showing ad', error)
    //   __DEV__ && ToastAndroid.show('Error showing ad', ToastAndroid.SHORT)
    // }
    navigation.navigate('Mining')
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className='mt-5 flex-row items-center justify-center rounded-full bg-secondary p-4'
      onPress={onClickInitiate}
    >
      <DoubleArrow height={11} width={11} color='black' />
      <Text className='pl-3 text-base text-black'>Initiate Mining</Text>
    </TouchableOpacity>
  )
}
