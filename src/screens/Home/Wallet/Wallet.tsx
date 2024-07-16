import useHybridData from '@/hooks/useHybridData'
import { SmallButton } from '@components/Button'
import KeyboardAvoidingContainer from '@components/KeyboardAvoidingContainer'
import { PaddingTop } from '@components/SafePadding'
import SmallProfile, { RightSideSmallProfile } from '@components/SmallProfile'
import Tabs from '@components/Tabs'
import LockIcon from '@icons/lock.svg'
import SwapIcon from '@icons/swap.svg'
import { home_statics_f, profile_f, type HomeStatisticsT, type ProfileT } from '@query/api'
import RewardAd from '@screens/Ads/RewardAd'
import { useQuery } from '@tanstack/react-query'
import { colors } from '@utils/colors'
import { StackNav } from '@utils/types'
import React from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Receive from './Receive'
import Send from './Send'
import ComingSoonSvg from '@icons/coming-soon-2.svg'

const { width } = Dimensions.get('window')

export default function Wallet({ navigation }: { navigation: StackNav }) {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: profile_f })
  const profile = useHybridData<ProfileT>(profileQuery, 'profile')
  const homeStatics = useQuery({ queryKey: ['homeStatics'], queryFn: home_statics_f })
  const home = useHybridData(homeStatics, 'homeStatics')

  return (
    <>
      {/* <InterstitialAd /> */}
      <RewardAd />
      <KeyboardAvoidingContainer style={{ backgroundColor: colors.bgSecondary }}>
        <ScrollView className='p-5 pb-10'>
          <PaddingTop />
          <SmallProfile RightSide={<RightSideSmallProfile navigation={navigation} />} />
          <View className='mt-3 flex-row items-center justify-between'>
            <View className='flex flex-row'>
              <Text className='text-neutral-500' style={{ fontSize: 27 }}>
                Your,{' '}
              </Text>
              <Text style={{ fontSize: 30 }}>Wallet</Text>
            </View>
            <TouchableOpacity
              className='rounded-full border border-neutral-200 bg-white p-2.5'
              onPress={() => {
                navigation.navigate('Transactions')
              }}
            >
              <SwapIcon height={17} width={17} />
            </TouchableOpacity>
          </View>
          <View>
            <WalletBalance balance={Number(profile?.data?.coin || 0)} home={home} />
          </View>
          <Tabs
            tabs={[
              // { title: 'Send', UI: <Send navigation={navigation} /> },
              { title: 'Send', UI: <ComingSoonSvg width={width * 0.85} /> },
              // { title: 'Receive', UI: <Receive /> },
              { title: 'Receive', UI: <ComingSoonSvg width={width * 0.85} /> },
            ]}
          />
        </ScrollView>
      </KeyboardAvoidingContainer>
    </>
  )
}

function WalletBalance({ balance, home }: { balance: number; home: HomeStatisticsT | null }) {
  return (
    <View className='mt-4 rounded-3xl bg-secondary p-5'>
      <Text className='text-base text-onYellow'>Wallet Balance</Text>
      <View className='flex-row items-end'>
        <Text className='text-onYellow' style={{ fontSize: 40 }}>
          {balance.toFixed(4)}
        </Text>
        <Text className='mb-1.5 ml-1 text-2xl text-onYellow'>MST</Text>
      </View>
      <View className='mt-3 flex-row items-center justify-between' style={{ gap: 15 }}>
        <View style={{ flex: 0.5 }}>
          <SmallButton title='Withdraw' LeftUI={<LockIcon height={16} width={16} />} />
        </View>
        <Text style={{ flex: 0.5, fontSize: 15 }} className='text-onYellow'>
          MST / {home?.valuation?.currency} {home?.valuation?.rate}
        </Text>
      </View>
    </View>
  )
}
