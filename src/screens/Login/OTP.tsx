import icons from '@assets/icons/icons'
import { Button } from '@components/Button'
import { SmallLoading } from '@components/Loading'
import { PaddingBottom, PaddingTop } from '@components/SafePadding'
import { setAuthToken, verifyLogin_f, verifySignUp_f } from '@query/api'
import { ParamListBase, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useMutation } from '@tanstack/react-query'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { colors } from '@utils/colors'
import { removePlusBeforeCountryCode } from '@utils/utils'
import React from 'react'
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { secureLs } from '../../utils/storage'
import { isValidOTP } from './utils'
import type { StackNav } from '@utils/types'
const { width } = Dimensions.get('window')
const topIconSize = 0.35

type ParamList = {
  OTP: OTPParamList
}
export type OTPParamList = { phone: string; country_code: string; isSignUp: boolean }

export default function OTP({ navigation, route }: { navigation: StackNav; route: RouteProp<ParamList, 'OTP'> }) {
  const phone = (route.params as { phone: string })?.phone
  const country_code = (route.params as { country_code: string })?.country_code
  const isSignUp = (route.params as { isSignUp: boolean })?.isSignUp
  const [otp, setOtp] = React.useState('')

  const otpMutation = useMutation({
    mutationFn: () =>
      isSignUp
        ? verifySignUp_f({ country_code: removePlusBeforeCountryCode(country_code), otp, phone })
        : verifyLogin_f({ country_code: removePlusBeforeCountryCode(country_code), phone, otp }),
    onSuccess: async (data) => {
      if (data.status === true) {
        secureLs.set('token', data.token)
        setAuthToken()
        navigation.replace('Setup')
      } else {
        Alert.alert('Invalid', data.message)
      }
    },
  })

  function handelSubmit(code: string) {
    const otpStatus = isValidOTP(code)
    if (!otpStatus.status) {
      return Alert.alert('Invalid OTP', otpStatus.message)
    }
    otpMutation.mutate()
  }

  return (
    <View className='flex-1 justify-between bg-white'>
      <View>
        <PaddingTop />
      </View>
      <View className='items-center'>
        <Image source={icons.mobile_otp} style={{ width: width * topIconSize, height: width * topIconSize }} />
        <Text className='mt-5 text-center text-3xl font-bold'>Verify OTP</Text>
        <Text className='mt-4 w-4/5 text-center text-base text-neutral-600'>
          We have sent an otp to your <Icon name='whatsapp' size={17} color='green' /> <Text style={{ color: 'green' }}>WhatsApp</Text> number ending
          with {phone?.slice(-4)}
        </Text>
        <View style={{ padding: 5 }}>
          <View className='flex-row'>
            <OTPInputView
              style={{ height: 100, width: 300, flex: 1, paddingHorizontal: 20 }}
              pinCount={6}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code) => {
                setOtp(() => code)
                handelSubmit(code)
              }}
            />
          </View>
          <View className='flex-row' style={{ paddingHorizontal: 20 }}>
            {otpMutation.isPending ? (
              <Button title='Verifying OTP...' LeftUI={<SmallLoading />} disabled={true} />
            ) : (
              <Button title='Confirm' onPress={() => handelSubmit(otp)} />
            )}
          </View>
          <View className='mt-8 flex-row items-center justify-center px-5'>
            <Text className='text-center text-base text-neutral-700'>Didn't receive OTP?</Text>
            <TouchableOpacity>
              <Text className='text-center text-base font-bold'> Resend OTP</Text>
            </TouchableOpacity>
            <Text className='text-center text-base text-neutral-700'> in 00:30</Text>
          </View>
        </View>
      </View>
      <View className='px-5 pb-2'>
        <Text className='text-center text-neutral-600'>By continuing you are accepting our Terms and Conditions</Text>
        <PaddingBottom />
      </View>
    </View>
    // </KeyboardAvoidingContainer>
  )
}

const styles = StyleSheet.create({
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    color: 'black',
    fontSize: 17,
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: colors.bgSecondary,
    height: (width - 100) / 6 + 5,
    width: (width - 100) / 6,
  },

  underlineStyleHighLighted: {
    borderColor: 'black',
  },
})
