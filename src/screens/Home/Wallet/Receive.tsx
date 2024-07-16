import useHybridData from '@/hooks/useHybridData'
import { CopyButton, ShareButton } from '@components/Button'
import QR_CODE from '@components/QRCode'
import { profile_f, ProfileT } from '@query/api'
import { useQuery } from '@tanstack/react-query'
import { colors } from '@utils/colors'
import { getUserNameFromQR, qrString } from '@utils/utils'
import React from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function Receive() {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: profile_f })
  const localProfile = useHybridData<ProfileT>(profileQuery, 'profile')
  const profile = profileQuery.data?.data || localProfile?.data
  const qrCodeString = qrString(profile?.username || '')

  return (
    <View>
      <View className='mt-5 flex items-center justify-center'>
        <View className=' rounded-2xl bg-white p-5'>
          <QR_CODE str={qrCodeString} />
        </View>
        <View className='mt-5 flex-row items-center justify-center gap-x-5'>
          <View className='items-center justify-center'>
            <CopyButton str={getUserNameFromQR(qrCodeString)} />
            <Text className='mt-1'>Copy</Text>
          </View>
          <View className='items-center justify-center'>
            <ShareButton str={getUserNameFromQR(qrCodeString)} />
            <Text className='mt-1'>Share</Text>
          </View>
        </View>
      </View>
      <View className='mt-3 p-5'>
        <Text className='text-center text-onYellow'>Send only Masth to this address. Sending any other coins may result in permanent loss.</Text>
      </View>
      <View className='mt-2 flex-row items-center justify-center gap-x-2 rounded-full'>
        <Icon name='shield-check' size={18} color={colors.greenPrimary} />
        <Text className='text-lg text-greenPrimary'>Trust Wallet</Text>
      </View>
    </View>
  )
}
