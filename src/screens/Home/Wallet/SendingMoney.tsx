import { Button } from '@components/Button'
import { PaddingBottom } from '@components/SafePadding'
import { DefaultTransparent } from '@components/StatusBar'
import TopBar from '@components/TopBar'
import { profile_f, send_coin_f } from '@query/api'
import type { RouteProp } from '@react-navigation/native'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Currency } from '@utils/constants'
import type { StackNav } from '@utils/types'
import LottieView from 'lottie-react-native'
import React, { useEffect } from 'react'
import { Alert, BackHandler, Dimensions, Text, ToastAndroid, View } from 'react-native'
type ParamList = {
  SendingMoney: SendingMoneyParamList
}

export type SendingMoneyParamList = {
  amount: number
  receiver: string
}

const { width } = Dimensions.get('window')

enum PaymentStatus {
  Pending,
  Success,
  Failed,
}

export default function SendingMoney({ navigation, route }: { navigation: StackNav; route: RouteProp<ParamList, 'SendingMoney'> }) {
  const username = route.params.receiver
  const coins = route.params.amount
  const [status, setStatus] = React.useState<PaymentStatus>(PaymentStatus.Pending)
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: profile_f })

  const sendCoinMutation = useMutation({
    mutationKey: ['sendCoin'],
    mutationFn: () => send_coin_f({ username, coins }),
    onSuccess: (data) => {
      console.log(data)
      if (data.status) setStatus(PaymentStatus.Success)
      else {
        setStatus(PaymentStatus.Failed)
        Alert.alert('Error', data.message)
      }
      profileQuery.refetch()
    },
    retry: 0,
  })
  useEffect(() => {
    sendCoinMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Disable Back Button
  useEffect(() => {
    const backAction = () => {
      ToastAndroid.show('Please wait while we process your request.', ToastAndroid.SHORT)
      return true
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [])

  return (
    <>
      <DefaultTransparent />
      <View className='flex-1 justify-between bg-white p-5 pb-2'>
        <TopBar />
        <View className='flex-1 items-center justify-center'>
          {status === PaymentStatus.Pending && (
            <LottieView
              source={require('@assets/anim/animation.lottie')}
              autoPlay
              speed={0.5}
              loop
              style={{
                width: width / 2,
                height: width / 2,
              }}
            />
          )}
          {status === PaymentStatus.Success && (
            <LottieView
              source={require('@assets/anim/successful.lottie')}
              autoPlay
              loop={false}
              style={{
                width: width,
                height: width * 0.7,
              }}
            />
          )}
          {status === PaymentStatus.Failed && (
            <LottieView
              source={require('@assets/anim/failed.lottie')}
              autoPlay
              loop={false}
              style={{
                width: width,
                height: width * 0.7,
              }}
            />
          )}

          {status === PaymentStatus.Success && <Text className='mt-5 text-center text-lg text-green-500'>Payment Successful</Text>}
          {status === PaymentStatus.Failed && <Text className='mt-5 text-center text-lg text-red-500'>Payment Failed</Text>}
          {status === PaymentStatus.Pending && (
            <Text className='mt-5 text-center text-lg text-gray-700'>
              Sending {route.params.amount} {Currency} to {route.params.receiver}
            </Text>
          )}

          {status === PaymentStatus.Pending && (
            <Text className='mt-5 px-5 text-center text-gray-500'>
              Please wait while we process your request. This may take a few seconds. Do not close the app or navigate away from this screen.
            </Text>
          )}

          {status === PaymentStatus.Success && (
            <Text className='mt-5 px-5 text-center text-gray-500'>The amount has been successfully sent to {route.params.receiver}.</Text>
          )}

          {status === PaymentStatus.Failed && (
            <Text className='mt-5 px-5 text-center text-gray-500'>
              The amount could not be sent to {route.params.receiver}. Please try again later.
            </Text>
          )}
        </View>
        <View>
          {status === PaymentStatus.Success && (
            <View className='mt-5 flex-row justify-between' style={{ gap: 15 }}>
              <Button title='Ok, Got It' onPress={() => navigation.goBack()} />
            </View>
          )}

          {status === PaymentStatus.Failed && (
            <View className='mt-5 flex-row justify-between' style={{ gap: 15 }}>
              <Button title='Try Again' onPress={() => navigation.goBack()} />
            </View>
          )}
          <PaddingBottom />
        </View>
      </View>
    </>
  )
}
