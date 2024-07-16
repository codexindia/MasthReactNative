import { Button } from '@components/Button'
import { PaddingBottom } from '@components/SafePadding'
import { DefaultTransparent } from '@components/StatusBar'
import TopBar from '@components/TopBar'
import { userDetail_f } from '@query/api'
import type { RouteProp } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Currency } from '@utils/constants'
import type { StackNav } from '@utils/types'
import React, { useEffect } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import TouchID from 'react-native-touch-id'

type ParamList = {
  SendingDetails: SendingParamList
}

export type SendingParamList = {
  amount: number
  receiver: string
}

enum AuthState {
  NOT_CHECKED,
  NOT_AVAILABLE,
  NOT_AUTHENTICATED,
  AUTHENTICATED,
}

const optionalConfigObject = {
  title: 'Authentication to send money',
  imageColor: 'gray',
  imageErrorColor: '#ff0000',
  sensorDescription: 'Touch sensor',
  sensorErrorDescription: 'Failed to authenticate',
  cancelText: 'Cancel',
  fallbackLabel: 'Show Passcode',
  unifiedErrors: false,
  passcodeFallback: true,
}

export default function Sending({ navigation, route }: { navigation: StackNav; route: RouteProp<ParamList, 'SendingDetails'> }) {
  const { amount, receiver } = route.params

  const userQuery = useQuery({
    queryKey: ['userDetail', receiver],
    queryFn: () => userDetail_f(receiver),
  })

  useEffect(() => {
    console.log('userQuery', userQuery.data)
    if (userQuery.data && userQuery.data?.status === false) {
      console.log('User not found. Please check the receiver address.')
      Alert.alert('User not found', 'User not found. Please check the receiver address.', [{ text: 'OK', onPress: () => navigation.goBack() }])
    }
  }, [navigation, userQuery.data])

  function handelSendMoney() {
    // Alert.alert('Are you sure?', `Do you want to send ${amount} ${Currency} to ${receiver}?`, [
    //   { text: 'No', style: 'cancel' },
    //   {
    //     text: 'Yes',
    //     onPress: handelAuth,
    //   },
    // ])
    handelAuth()
  }

  function handelAuth() {
    TouchID.isSupported(optionalConfigObject)
      .then(() => {
        TouchID.authenticate('Authenticate with Touch ID', optionalConfigObject)
          .then(() => next())
          .catch((e: any) => console.log('TouchID Error', e))
      })
      .catch(() => {
        notAvailableContinue()
      })
  }

  function notAvailableContinue() {
    Alert.alert(
      'Touch ID not available',
      'It is recommended to use Touch ID to send money. Touch ID is not available on this device. It may be less secure to send money without Touch ID. Do you want to continue without Touch ID?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => next(),
        },
      ],
    )
  }

  function next() {
    navigation.replace('SendingMoney', { amount, receiver })
  }

  return (
    <>
      <DefaultTransparent />
      <View className='flex-1 justify-between p-5 pb-2'>
        <View className='flex-1'>
          <TopBar />
          <Text className='mt-5 text-center text-xl font-bold'>
            Sending {amount} {Currency} to {receiver}
          </Text>
          <View className='flex-1 items-center justify-center'>
            <Profile pic={userQuery.data?.data?.profile_pic || ''} name={userQuery.data?.data?.name || ''} username={receiver} />
            <View className='mt-7'>
              <Text className='text-center text-xl font-medium text-orange-500'>
                Sending Amount: {amount} {Currency}
              </Text>
              <Text className='mx-5 mt-7 text-center text-gray-600'>
                Make sure the above details are correct before sending the amount. Once sent, the amount cannot be refunded.
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Button title={`Confirm and send ${route.params.amount} ${Currency}`} onPress={handelSendMoney} />
          <PaddingBottom />
        </View>
      </View>
    </>
  )
}

function Profile({ pic, name, username }: { pic: string; name: string; username: string }) {
  return (
    <View className='items-center'>
      {pic ? <Image source={{ uri: pic }} style={styles.profile} /> : <View style={styles.profile} />}
      <View>
        <Text className='mt-3 text-center text-xl font-bold'>{name}</Text>
        <Text className='text-center text-lg'>{username}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profile: {
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: 'gray',
    marginTop: 10,
  },
})
