import useHybridData, { setLocalData, useLocalData } from '@/hooks/useHybridData'
import { PaddingTop } from '@components/SafePadding'
import SmallProfile, { RightSideSmallProfile } from '@components/SmallProfile'
import ThreeUserIcon from '@icons/3user.svg'
import ArrowDownBold from '@icons/arrow-down-bold.svg'
import ArrowUpBold from '@icons/arrow-up-bold.svg'
import ChartIcon from '@icons/chart.svg'
import GraphIcon from '@icons/graph.svg'
import PlayBlackIcon from '@icons/play-black.svg'
import NewsFeedImage from '@images/feeds.svg'
import { home_statics_f, profile_f, type HomeStatisticsT, type ProfileT } from '@query/api'
import { useQuery } from '@tanstack/react-query'
import { colors } from '@utils/colors'
import { MST_PER_USD_MESSAGE } from '@utils/constants'
import { StackNav } from '@utils/types'
import { handleAppUpdate } from '@utils/utils'
import React, { useEffect } from 'react'
import { Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { default as Icon } from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaintenanceNavigation, { useBannedNavigation } from './Mining/ExtraNavs'
import MiningOrWalletBalance from './Mining/MiningOrWalletBalance'
import PopupUi from './Mining/PopupUi'

const { width } = Dimensions.get('window')
// const adUnitId = TestIds.REWARDED
// const rewarded = RewardedAd.createForAdRequest(adUnitId)
export default function Home({ navigation }: { navigation: StackNav }) {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: profile_f })
  const profile = useHybridData<ProfileT>(profileQuery, 'profile')
  const homeStatics = useQuery({ queryKey: ['homeStatics'], queryFn: home_statics_f })
  const home = useHybridData(homeStatics, 'homeStatics')
  useBannedNavigation(navigation, profileQuery.data)

  useEffect(() => handleAppUpdate(navigation), [navigation])

  useEffect(() => {
    // console.log(JSON.stringify(home, null, 2))
    setLocalData(home?.active_miners, 'active_miners')
    setLocalData(home?.total_miners, 'total_miners')
    setLocalData(home?.total_remote_mining, 'total_remote_mining')
    setLocalData(home?.total_live_mining, 'total_live_mining')
    setLocalData(home?.valuation?.rate, 'mstPerUSD')
  }, [home])

  return (
    <>
      <MaintenanceNavigation navigation={navigation} />
      {!__DEV__ && <PopupUi />}
      {/* <View className='p-5'>
        <TopBar />
      </View> */}
      <ScrollView style={{ backgroundColor: colors.bgSecondary, flex: 1 }}>
        {/* <BackHeader navigation={navigation} title='Initiate Mining' /> */}
        <View className='p-5 pb-10 pt-5'>
          <PaddingTop />
          <SmallProfile RightSide={<RightSideSmallProfile navigation={navigation} />} />
          <MiningOrWalletBalance profile={profile} profileQuery={profileQuery} />
          <MSTPerUSDCard home={home} />
          <Miners home={home} />
          <TotalRemoteMining navigation={navigation} home={home} />
          <TotalLiveMining home={home} />
          <View className='mt-2 flex items-center justify-center'>{/* <Text>{secureLs.getString('token')}</Text> */}</View>
        </View>
      </ScrollView>
    </>
  )
}

function Miners({ home }: { home: HomeStatisticsT | null }) {
  return (
    <View className='mt-4 flex-row' style={{ gap: 18 }}>
      <ActiveMiners home={home} />
      <TotalMiners home={home} />
    </View>
  )
}

function TotalRemoteMining({ navigation, home }: { navigation: StackNav; home: HomeStatisticsT | null }) {
  const totalRemoteMining = Number(useLocalData<number>('total_remote_mining') || 0)
  const diff = Number(home?.total_remote_mining || 0) - totalRemoteMining

  return (
    <View className='mt-4 rounded-3xl  bg-white p-5'>
      <View className='flex-row justify-between' style={{ gap: 15 }}>
        <View>
          <View className='rounded-xl bg-bgAqua p-2'>
            <GraphIcon width={18} height={18} />
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Refer')}>
          <View className='flex-row items-center rounded-full bg-black/10 px-1 py-1 pl-3.5' style={{ gap: 0 }}>
            <Text style={{ fontSize: 15 }} className='pb-0.5'>
              View Team
            </Text>
            <MaterialIcon name='keyboard-arrow-right' size={20} />
          </View>
        </TouchableOpacity>
      </View>
      <View className='mt-3 flex flex-row items-end justify-between'>
        <View>
          <View className='flex-row items-end gap-x-1'>
            <Text className='text-2xl'>{home?.total_remote_mining || 0}</Text>
            <Text className='mb-0.5 text-base text-neutral-600'>MST</Text>
          </View>
          <Text className='text-base text-neutral-600'>Total Remote Mining</Text>
        </View>
        <View className='items-end'>
          {/* <Text className='text-sm text-greenPrimary'>More than usual</Text> */}
          <Text className={`text-base ${diff < 0 ? 'text-redPrimary' : 'text-greenPrimary'}`}>
            {diff < 0 ? '' : '+'}
            {diff.toFixed(4)}
          </Text>
        </View>
      </View>
    </View>
  )
}

function ActiveMiners({ home }: { home: HomeStatisticsT | null }) {
  const activeMiners = Number(useLocalData<number>('active_miners') || 0)
  const diff = Number(home?.active_miners || 0) - activeMiners
  return (
    <View className='flex-1 rounded-3xl bg-white' style={{ gap: 15, padding: 17 }}>
      <View className='flex-row items-center justify-between'>
        <View>
          <View className='rounded-xl bg-secondary p-2'>
            <PlayBlackIcon width={18} height={18} />
          </View>
        </View>
        <View>
          <View className={`flex-row items-center rounded-full ${diff < 0 ? 'bg-redPrimary' : 'bg-bgGreen'} px-3 py-0.5`} style={{ gap: 8 }}>
            <Text className={`text-base ${diff < 0 ? 'text-redPrimary' : 'text-greenPrimary'}`}>
              {diff < 0 ? '' : '+'}
              {diff}
            </Text>
            {diff < 0 ? (
              <ArrowDownBold width={9} height={9} color={colors.redPrimary} />
            ) : (
              <ArrowUpBold width={9} height={9} color={colors.greenPrimary} />
            )}
            {/* <ArrowUpBold width={9} height={9} color={colors.greenPrimary} /> */}
          </View>
        </View>
      </View>
      <View>
        <Text className='text-3xl'>{home?.active_miners || 0}</Text>
        <Text className='mt-1 text-base text-neutral-600'>Active Miners</Text>
      </View>
    </View>
  )
}

function TotalMiners({ home }: { home: HomeStatisticsT | null }) {
  const totalMiners = Number(useLocalData<number>('total_miners') || 0)
  const diff = Number(home?.total_miners || 0) - totalMiners
  return (
    <View className='flex-1 rounded-3xl bg-white' style={{ gap: 15, padding: 17 }}>
      <View className='flex-row items-center justify-between'>
        <View>
          <View className='rounded-xl bg-purplePrimary p-2'>
            <ThreeUserIcon width={18} height={18} />
          </View>
        </View>
        <View>
          <View className={`flex-row items-center rounded-full ${diff < 0 ? 'bg-red-500' : 'bg-bgGreen'} px-3 py-0.5`} style={{ gap: 8 }}>
            <Text className={`text-base ${diff < 0 ? 'text-redPrimary' : 'text-greenPrimary'}`}>
              {diff < 0 ? '' : '+'}
              {diff}
            </Text>
            {diff < 0 ? (
              <ArrowDownBold width={9} height={9} color={colors.redPrimary} />
            ) : (
              <ArrowUpBold width={9} height={9} color={colors.greenPrimary} />
            )}
          </View>
        </View>
      </View>
      <View>
        <Text className='text-3xl'>{home?.total_miners || 0}</Text>
        <Text className='mt-1 text-base text-neutral-600'>Total Miners</Text>
      </View>
    </View>
  )
}

function TotalLiveMining({ home }: { home: HomeStatisticsT | null }) {
  const totalLiveMining = Number(useLocalData<number>('total_live_mining') || 0)
  const diff = Number(home?.total_live_mining || 0) - totalLiveMining
  const diffPercent = diff === 0 || totalLiveMining === 0 ? 0 : (diff / totalLiveMining) * 100
  return (
    <View className='mt-4 flex-row rounded-3xl bg-white p-5' style={{ gap: 15 }}>
      <View>
        <View className='rounded-xl bg-bgGreen p-2'>
          <ChartIcon width={18} height={18} />
        </View>
      </View>
      <View style={{ gap: 4, flex: 1 }}>
        <View>
          <View className='flex-row items-center justify-between '>
            <Text className='text-base text-neutral-600'>Total Live Mining</Text>
            <View>
              <View className='flex-row items-center rounded-full bg-bgGreen px-2 py-0.5' style={{ gap: 5 }}>
                <View className='flex-row items-end'>
                  <Text className={`text-base ${diff < 0 ? 'text-redPrimary' : 'text-greenPrimary'}`}>
                    {diffPercent < 0 ? '' : '+'}
                    {diffPercent.toFixed(2)} %
                  </Text>
                  {/* <Text style={{ fontSize: 12 }} className='pb-0.5 pl-1 text-greenPrimary'>
                    MST
                  </Text> */}
                </View>
                {diff < 0 ? (
                  <ArrowDownBold width={9} height={9} color={colors.redPrimary} />
                ) : (
                  <ArrowUpBold width={9} height={9} color={colors.greenPrimary} />
                )}
              </View>
            </View>
          </View>
        </View>
        <View className='mt-1 flex-row items-end gap-x-1'>
          <Text className='text-2xl'>{home?.total_live_mining || 0}</Text>
          <Text className='mb-0.5 text-base text-neutral-600'>MST</Text>
        </View>
      </View>
    </View>
  )
}

function NewsFeed() {
  return (
    <View className='mt-5 flex-1 justify-between'>
      <View>
        <Text className='text-3xl'>News Feed</Text>
        <Text className='text-lg'>Read news and earn math coins</Text>
      </View>
      <View className='items-center justify-center gap-7'>
        <NewsFeedImage width={width * 0.8} />
        <View>
          <Text className='text-center text-3xl'> Coming Soon</Text>
          <Text className='text-center'>This feature will be available soon.</Text>
        </View>
      </View>
      <View />
      <View />
    </View>
  )
}

function MSTPerUSDCard({ home }: { home: HomeStatisticsT | null }) {
  const mstPerUSD = Number(useLocalData<number>('mstPerUSD') || 0)
  const diff = Number(home?.valuation?.rate || 0) - mstPerUSD
  const diffPercent = diff === 0 || mstPerUSD === 0 ? 0 : (diff / mstPerUSD) * 100
  return (
    <View className='mt-4 flex-row items-center justify-between rounded-2xl bg-white p-3.5 px-5'>
      <View style={{ gap: 5 }} className='flex-row items-center'>
        <Text className='text-base text-neutral-600'>
          MST / {home?.valuation?.currency} {home?.valuation?.rate}
        </Text>
        {/* <Text className='text-base'></Text>  */}
        {/* <Tooltip
          title='Masth,calculates coin value using a smart system created by “Nexgino Technology Solutions”. It considers mining, downloads, and user activity every day for accurate valuation.'
          enterTouchDelay={0}
        > */}
        <TouchableOpacity className='p-1.5' onPress={() => Alert.alert('Masth', MST_PER_USD_MESSAGE)}>
          <Icon name='info' size={17} color={'gray'} />
        </TouchableOpacity>
        {/* </Tooltip> */}
      </View>
      <View>
        <Text className={`text-base ${diff < 0 ? 'text-redPrimary' : 'text-greenPrimary'}`}>
          {/* +0.08 (0.2%) */}
          {diff < 0 ? '' : '+'}
          {diff.toFixed(2)} ({Math.abs(diffPercent).toFixed(2)}%)
        </Text>
      </View>
    </View>
  )
}
