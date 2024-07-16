import useHybridData from '@/hooks/useHybridData'
import BackHeader, { RightSettingIcon } from '@components/BackHeader'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import KeyboardAvoidingContainer from '@components/KeyboardAvoidingContainer'
import Label from '@components/Label'
import { SmallLoadingWrapped } from '@components/Loading'
import { PaddingBottom, PaddingTop } from '@components/SafePadding'
import { Select } from '@components/Select'
import { ProfileT, profile_f, updateProfile_f } from '@query/api'
import DateTimePicker from '@react-native-community/datetimepicker'
import type { RouteProp } from '@react-navigation/native'
import { oneSignalInit } from '@screens/Login/Setup'
import { isValidFullName } from '@screens/Login/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ls, secureLs } from '@utils/storage'
import { StackNav } from '@utils/types'
import { formattedDate, niceDate } from '@utils/utils'
import React, { useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { OneSignal } from 'react-native-onesignal'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'

// import { Image } from 'react-native-svg'

type ParamList = {
  EditProfile: EditProfileParamList
}

export type EditProfileParamList = {
  isMigration: boolean
  isShowHeader: boolean
}

export default function EditProfile({ navigation, route }: { navigation: StackNav; route: RouteProp<ParamList, 'EditProfile'> }) {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: profile_f })
  const localProfile = useHybridData<ProfileT>(profileQuery, 'profile')
  const profile = profileQuery.data?.data || localProfile?.data
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [profilePic, setProfilePic] = React.useState(profile?.profile_pic || '')

  const [fullName, setFullName] = useState(profile?.name || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [dob, setDob] = useState(new Date(profile?.date_of_birth || ''))

  const queryClient = useQueryClient()

  const [isSignOut, setIsSignOut] = useState(false)

  const isMigration = route.params?.isMigration
  const isShowHeader = route.params?.isShowHeader

  console.log(isShowHeader)

  function signOut() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: signOutHandler },
    ])
  }

  function signOutHandler() {
    setIsSignOut(true)
    ls.clearAll()
    secureLs.clearAll()
    queryClient.clear()
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
  }

  async function selectPic() {
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      })
      if (res.didCancel || res.errorMessage) return
      const assets: any = res?.assets as any
      const uri: any = assets[0]?.uri

      setProfilePic(uri as string)
    } catch (e) {
      console.log(e)
    }
  }

  const updateMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData()
      fullName && formData.append('name', fullName.trim())
      email && formData.append('email', email.trim())
      dob && formData.append('dob', formattedDate(dob))
      if (profilePic && !profilePic.startsWith('http')) {
        formData.append('profile_pic', {
          uri: profilePic,
          name: 'image.jpg',
          type: 'image/jpg',
        })
      }
      return updateProfile_f(formData)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      navigation.goBack()
      console.log(data.data)
    },
  })

  function handelSubmit() {
    const fullNameStatus = isValidFullName(fullName.trim())
    if (!fullNameStatus.status) {
      return Alert.alert('Invalid Full Name', fullNameStatus.message)
    }
    if (!dob) {
      return Alert.alert('Date of Birth Required', 'Please select your date of birth.')
    }
    // const emailStatus = isValidEmail(email.trim())
    // if (!emailStatus.status) {
    //   return Alert.alert('Invalid Email', emailStatus.message)
    // }
    updateMutation.mutate()
  }

  return (
    <View className='flex-1 bg-bgSecondary'>
      {isShowHeader ? (
        <BackHeader navigation={navigation} title='Edit Profile' RightComponent={<RightSettingIcon navigation={navigation} />} />
      ) : (
        <PaddingTop />
      )}
      <KeyboardAvoidingContainer className='px-5'>
        <View className='mt-5 items-center justify-center'>
          <View className='relative'>
            <Image
              className='rounded-full bg-neutral-200'
              source={{ uri: profilePic || 'https://picsum.photos/201' }}
              style={{ width: 140, height: 140 }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ position: 'absolute', bottom: 0, right: 0 }}
              className='rounded-full bg-white p-3'
              onPress={selectPic}
            >
              <Icon name='edit' size={20} />
            </TouchableOpacity>
          </View>
          <View className='mt-5'>
            <Text className='text-center text-2xl'>@{profile?.username || 'Loading...'}</Text>
            <Text className='text-center text-lg text-neutral-700'>Hi There, {profile?.name.split(' ')[0] || 'Loading...'}</Text>
          </View>
        </View>
        <View className='mt-5 flex-1' style={{ gap: 10 }}>
          <View>
            <Label title='Full Name' />
            <Input
              placeholder='Full Name'
              LeftUI={<MaterialCommunityIcon name='account-outline' size={20} color='black' />}
              value={fullName}
              onChangeText={(text) => setFullName(text)}
            />
          </View>
          <View>
            <Label title='Email' />
            <Input
              placeholder='Email'
              keyboardType='email-address'
              LeftUI={<MaterialCommunityIcon name='email-outline' size={20} color='black' />}
              value={email}
              onChangeText={(text) => setEmail(text)}
              editable={!profile?.email}
            />
            {isMigration && (
              <View className='mt-2 flex-row items-center rounded-lg bg-accent p-1.5 px-2.5' style={{ gap: 10 }}>
                <Feather name='info' size={16} color='white' />
                <Text className='flex-1 text-xs text-white'>
                  To reclaim your coins, enter your old email if you're an existing member. The email can't be changed after this step.
                </Text>
              </View>
            )}
          </View>
          <View>
            <Label title='Mobile Number' />
            <Input
              placeholder='Mobile Number'
              keyboardType='phone-pad'
              value={'+' + profile?.country_code + ' ' + profile?.phone_number}
              editable={false}
              LeftUI={<MaterialCommunityIcon name='phone-outline' size={20} color='black' />}
            />
          </View>
          <View>
            <Label title='Date of Birth' />
            <Select
              placeholder='Date of Birth'
              space={15}
              LeftUI={<MaterialCommunityIcon name='calendar-month-outline' size={20} color='black' />}
              RightUI={null}
              onPress={() => {
                setShowDatePicker(true)
              }}
              value={dob && niceDate(dob)}
            />
          </View>
          {updateMutation.isPending ? (
            <Button title='Saving...' disabled className='mt-4' LeftUI={<SmallLoadingWrapped />} />
          ) : (
            <Button
              title='Save Changes'
              onPress={handelSubmit}
              className='mt-4'
              LeftUI={<MaterialCommunityIcon name='creation' size={16} color='white' />}
            />
          )}
          <View style={{ paddingBottom: 10 }}>
            {isSignOut ? (
              <Button title='Logging Out...' variant='outline' LeftUI={<SmallLoadingWrapped />} disabled={true} />
            ) : (
              <Button title='Log Out?' variant='outline' onPress={signOut} />
            )}
            <PaddingBottom />
          </View>
        </View>
        <PaddingBottom />
      </KeyboardAvoidingContainer>
      {showDatePicker && (
        <DateTimePicker
          mode='date'
          display='default'
          onChange={({ type }, selectDate) => {
            setShowDatePicker(false)
            if (type === 'set') {
              setDob(selectDate || dob)
            }
          }}
          value={dob || new Date()}
        />
      )}
    </View>
  )
}
