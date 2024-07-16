import Images from '@assets/images/images'
import { Button } from '@components/Button'
import { SmallLoading } from '@components/Loading'
import { PaddingBottom } from '@components/SafePadding'
import { DefaultTransparent } from '@components/StatusBar'
import TopBar from '@components/TopBar'
import { ls, secureLs } from '@utils/storage'
import { StackNav } from '@utils/types'
import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import { oneSignalInit } from './Setup'

export default function SignOut({ navigation }: { navigation: StackNav }) {
  const [isSignOut, setIsSignOut] = useState(false)

  function signOut() {
    setIsSignOut(true)
    ls.clearAll()
    secureLs.clearAll()
    setTimeout(() => {
      try {
        oneSignalInit()
        OneSignal.logout()
      } catch (e) {
        console.log(e)
      } finally {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
      }
    })
    // setIsSignOut(false)
  }

  return (
    <>
      <DefaultTransparent />
      <View className='flex-1 justify-between p-5 pb-2'>
        <View>
          <TopBar />
        </View>
        <View className='items-center justify-center'>
          <View className='gap-1'>
            <Text className='text-center text-xl font-bold'>Are you sure you want to log out?</Text>
            <Text className='text-center text-base'>You can always sign in later</Text>
          </View>
          {/* <Image source={Images.LogOut} style={{ width: '100%', height: '70%', resizeMode: 'contain' }} /> */}
        </View>
        {/* <View>
          <Text>
            <Text className='text-center'>If you log out, you will not receive any notifications</Text>
            <Text className='text-center'>from the app. You can always log back in later</Text>
          </Text>
        </View> */}
        <View style={{ paddingBottom: 10 }}>
          {isSignOut ? (
            <Button title='Logging Out' variant='outline' LeftUI={<SmallLoading />} disabled={true} />
          ) : (
            <Button title='Yes, Log Out' variant='outline' onPress={signOut} />
          )}
          <Button title='Cancel' onPress={() => navigation.goBack()} className='mt-5' />
          <PaddingBottom />
        </View>
      </View>
    </>
  )
}
