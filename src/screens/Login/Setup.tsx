import icons from '@assets/icons/icons'
import { PaddingBottom, PaddingTop } from '@components/SafePadding'
import { profile_f } from '@query/api'
import { useQuery } from '@tanstack/react-query'
import { ONESIGNAL_APP_ID } from '@utils/constants'
import { StackNav } from '@utils/types'
import { useEffect } from 'react'
import { Alert, Image, Text, View } from 'react-native'
import { LogLevel, OneSignal } from 'react-native-onesignal'

export function oneSignalInit() {
  OneSignal.initialize(ONESIGNAL_APP_ID)
}

export default function Setup({ navigation }: { navigation: StackNav }) {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: profile_f })

  useEffect(() => {
    if (profileQuery.data) {
      // Remove this method to stop OneSignal Debugging
      // OneSignal.Debug.setLogLevel(6)
      // OneSignal Initialization
      oneSignalInit()
      // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
      OneSignal.Notifications.requestPermission(true).then((accepted) => {
        // if (accepted) {
        //   Alert.alert('Notification permission accepted')
        // } else {
        //   Alert.alert('Notification permission denied')
        // }
      })
      // requestPermission will show the native iOS or Android notification permission prompt.
      // Method for listening for notification clicks
      // OneSignal.Notifications.addEventListener('click', (event) => {
      //   console.log('OneSignal: notification clicked:', event)
      // })
      const phone = (profileQuery?.data?.data?.country_code || '') + profileQuery.data?.data?.phone_number
      OneSignal.login(phone)
      console.log('OneSignal: logged in:', phone)
      // Check if referred
      const is_claimed = profileQuery.data?.refer_claimed
      console.log('is_claimed:', is_claimed)
      if (!is_claimed) {
        navigation.replace('CheckRefer')
      } else {
        navigation.replace('Home')
      }
      // navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    }
  }, [navigation, profileQuery.data])

  return (
    <View className='flex flex-1 items-center justify-between'>
      <PaddingTop />
      <View>
        <View className='items-center justify-center'>
          <Image source={icons.loadingGif} className='h-10 w-10' />
        </View>
        <Text className='text-center'>Please wait</Text>
        <Text className='text-center'>Setting up your account</Text>
      </View>
      <PaddingBottom />
    </View>
  )
}
