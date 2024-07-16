import { PaddingBottom, PaddingTop } from '@components/SafePadding'
import SmallProfile, { RightSideSmallProfile } from '@components/SmallProfile'
import Tabs from '@components/Tabs'
import ComingSoon2Svg from '@icons/coming-soon-2.svg'
import ComingSoonSvg from '@icons/coming-soon.svg'
import { colors } from '@utils/colors'
import { StackNav } from '@utils/types'
import React from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'

export default function GameZone({ navigation }: { navigation: StackNav }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bgSecondary }}>
      <View className='p-5'>
        <PaddingTop />
        <SmallProfile RightSide={<RightSideSmallProfile navigation={navigation} />} />
        <View>
          <Tabs
            tabs={[
              { title: 'GameZone', UI: <ComingSoonGameZone /> },
              { title: 'Giveaway', UI: <ComingSoonGiveAway /> },
            ]}
          />
        </View>
        <PaddingBottom />
      </View>
    </ScrollView>
  )
}

const { width } = Dimensions.get('window')

function ComingSoonGiveAway() {
  return (
    <View className='mt-5 flex-1 items-center justify-center'>
      <ComingSoon2Svg width={width * 0.85} />
      <Text className='mt-5 text-2xl'>Coming Soon</Text>
      <Text className='mt-2 px-5 text-center text-neutral-600' style={{ fontSize: 16 }}>
        Giveaway feature is under development and will be available soon. Stay tuned!
      </Text>
    </View>
  )
}
function ComingSoonGameZone() {
  return (
    <View className='mt-5 flex-1 items-center justify-center'>
      <ComingSoonSvg width={width * 0.85} />
      <Text className='mt-5 text-2xl'>Coming Soon</Text>
      <Text className='mt-2 px-5 text-center text-neutral-600' style={{ fontSize: 16 }}>
        GameZone feature is under development and will be available soon. Stay tuned!
      </Text>
    </View>
  )
}
