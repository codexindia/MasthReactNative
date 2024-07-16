import BackHeader, { RightSettingIcon } from '@components/BackHeader'
import { Option, OptionWrapper, RightArrow, RightarrowWithText } from '@components/Options'
import { PaddingBottom } from '@components/SafePadding'
import { StackNav } from '@utils/types'
import React from 'react'
import { Dimensions, Image, Linking, Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'

import { useLocalData } from '@/hooks/useHybridData'
import icons from '@assets/icons/icons'
import Images from '@assets/images/images'
import { Button } from '@components/Button'
import { ProfileT } from '@query/api'
import { useNavigation, type NavigationProp } from '@react-navigation/native'
import InterstitialAd from '@screens/Ads/InterstitialAd'
import { colors } from '@utils/colors'
import { ABOUT_US_PAGE_LINK, APP_V_CODE, DELETE_ACCOUNT_LINK, MAIL_TO_LINK, PLAY_STORE_LINK, PRIVACY_LINK, WHITE_PAPER_LINK } from '@utils/constants'
import { blank_fn } from '@utils/utils'
import type { RootStackParamList } from 'App'

const ICON_SIZE = 20
const aspect_ratio = 796 / 80
const { width, height } = Dimensions.get('window')

const companyWidth = width * 0.9 - 40
const companyHeight = companyWidth / aspect_ratio

export default function Settings({ navigation }: { navigation: StackNav }) {
  const profile = useLocalData<ProfileT>('profile')
  const [modalVisible, setModalVisible] = React.useState(false)

  return (
    <>
      <InterstitialAd />
      <View className='flex-1 bg-bgSecondary'>
        {/* <StatusBar backgroundColor={'white'} barStyle='dark-content' /> */}
        <BackHeader navigation={navigation} title='Settings' RightComponent={<RightSettingIcon navigation={navigation} />} />
        <ScrollView className='px-5'>
          <OptionWrapper name='Account'>
            <Option
              name='Personal info'
              right={<RightArrow />}
              left={<Feather name='user' size={ICON_SIZE} color={colors.gray} />}
              onPress={() =>
                navigation.navigate('EditProfile', {
                  isMigration: false,
                  isShowHeader: true,
                })
              }
            />

            {!profile?.data?.email && (
              <Option
                name='Account Migration'
                right={<RightArrow />}
                left={<MaterialCommunity name='account-arrow-right-outline' size={ICON_SIZE} color={colors.gray} />}
                // onPress={() => navigation.navigate('EditProfile', { isMigration: true })}
                onPress={() => setModalVisible(true)}
              />
            )}
            <Option
              name='Privacy'
              right={<RightArrow />}
              left={<MaterialCommunity name='shield-check-outline' size={ICON_SIZE} color={colors.gray} />}
              onPress={() => Linking.openURL(PRIVACY_LINK)}
            />
            <Option
              name='White Paper'
              right={<RightArrow />}
              left={<MaterialCommunity name='text-box-outline' size={ICON_SIZE} color={colors.gray} />}
              onPress={() => Linking.openURL(WHITE_PAPER_LINK)}
              borderBottom={false}
            />
            {/* <Option
      name='Logout'
      right={<RightArrow color={colors.orange_500} />}
      mid={<Text className='text-base text-orange-500'>Logout</Text>}
      left={<Feather name='log-out' size={ICON_SIZE} color={colors.orange_500} />}
      onPress={blank_fn}
    /> */}
          </OptionWrapper>
          <OptionWrapper name='App Settings'>
            <Option
              name='Language'
              right={<RightarrowWithText text='English' />}
              left={<MaterialCommunity name='translate' size={ICON_SIZE} color={colors.gray} />}
              onPress={blank_fn}
              borderBottom={false}
            />
          </OptionWrapper>

          <OptionWrapper name='Others'>
            <Option
              name='About us'
              right={<RightArrow />}
              left={<Feather name='info' size={ICON_SIZE} color={colors.gray} />}
              onPress={() => Linking.openURL(ABOUT_US_PAGE_LINK)}
            />
            <Option
              name='Rate us'
              right={<RightArrow />}
              left={<Feather name='star' size={ICON_SIZE} color={colors.gray} />}
              onPress={() => Linking.openURL(PLAY_STORE_LINK)}
            />
            {/* <Option
      name='Share this app'
      right={<RightArrow />}
      left={<Feather name='share-2' size={ICON_SIZE} color={colors.gray} />}
      onPress={blank_fn}
    /> */}
            <Option
              name='Get help'
              right={<RightArrow />}
              left={<Feather name='help-circle' size={ICON_SIZE} color={colors.gray} />}
              onPress={() => Linking.openURL(MAIL_TO_LINK)}
              borderBottom={false}
            />
          </OptionWrapper>

          <OptionWrapper name='Danger Zone'>
            <Option
              name='Delete Account'
              right={<RightArrow color={colors.redPrimary} />}
              mid={<Text className='text-base text-redPrimary'>Delete Account</Text>}
              left={<Feather name='trash-2' size={ICON_SIZE} color={colors.redPrimary} />}
              onPress={() => Linking.openURL(DELETE_ACCOUNT_LINK)}
              borderBottom={false}
            />
          </OptionWrapper>
          <Text className='mt-5 text-center text-base text-neutral-500'>Masth Version {APP_V_CODE}</Text>
          <View className='items-center justify-center'>
            <Text className='mb-2 mt-5 text-center text-base text-neutral-500'>Built by</Text>
            <Image source={icons.company} className='h-12 w-full' style={{ resizeMode: 'contain', width: companyWidth, height: companyHeight }} />
          </View>
          <View className='h-10' />
          <PaddingBottom />
        </ScrollView>
      </View>
      <PopupUi modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </>
  )
}

function PopupUi({ modalVisible, setModalVisible }: { modalVisible: boolean; setModalVisible: (val: boolean) => void }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  if (!modalVisible) return null
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        statusBarTranslucent={true}
      >
        <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <View className='flex items-center justify-center rounded-2xl bg-white px-7 py-7' style={{ width: width * 0.9 }}>
            <Image source={Images.illustration} style={{ width: width * 0.65, height: width * 0.65 }} />
            <Text className='mt-5 text-center text-lg text-gray-500'>To reclaim your coins, enter your old email if you're a existing member</Text>
            <Button title='Skip' variant='outline' className='mt-10' onPress={() => setModalVisible(!modalVisible)} />
            <Button
              title='Next'
              onPress={() => {
                setModalVisible(!modalVisible)
                navigation.navigate('EditProfile', { isMigration: true, isShowHeader: true })
              }}
              className='mt-3'
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: width,
    height: height + 100,
  },
})
