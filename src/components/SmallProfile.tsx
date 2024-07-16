import useHybridData from '@/hooks/useHybridData'
import NotificationIcon from '@icons/notification.svg'
import SettingIcon from '@icons/setting.svg'
import { ProfileT, profile_f } from '@query/api'
import { useNavigation, type NavigationProp } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { StackNav } from '@utils/types'
import type { RootStackParamList } from 'App'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function SmallProfile({ RightSide }: { RightSide?: React.ReactNode }) {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: profile_f })
  const profile = useHybridData<ProfileT>(profileQuery, 'profile')
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  return (
    <View className='flex flex-row items-center justify-between'>
      <TouchableOpacity
        className='flex flex-row gap-3.5'
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('EditProfile', {
            isMigration: false,
            isShowHeader: true,
          })
        }
      >
        <View>
          <Image source={{ uri: profile?.data?.profile_pic || 'https://picsum.photos/100' }} className='h-10 w-10 rounded-full bg-neutral-200' />
          {!profile?.data?.email && <View className='absolute right-0 h-2 w-2 rounded-full bg-red-500' />}
        </View>
        <View>
          <Text className='text-sm text-neutral-500'>Welcome</Text>
          <Text className='font-bold' style={{ fontSize: 16 }}>
            {profile?.data?.name || 'Loading...'}
          </Text>
        </View>
      </TouchableOpacity>
      {RightSide ? RightSide : null}
    </View>
  )
}

export function RightSideSmallProfile({ navigation }: { navigation: StackNav }) {
  return (
    <View className='flex flex-row gap-2'>
      <TouchableOpacity
        className='p-2'
        onPress={() => {
          navigation.navigate('Notifications')
        }}
      >
        <NotificationIcon height={20} width={20} />
      </TouchableOpacity>
      <TouchableOpacity className='p-2' onPress={() => navigation.navigate('Settings')}>
        <SettingIcon height={20} width={20} />
      </TouchableOpacity>
    </View>
  )
}
