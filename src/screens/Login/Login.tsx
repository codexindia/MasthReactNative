import AppIconBlack from '@assets/icons/masth/masth-black.svg'
import BottomSheet, { BottomSheetRefProps } from '@components/BottomSheet'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { SmallLoading } from '@components/Loading'
import { PaddingTop } from '@components/SafePadding'
import { Select } from '@components/Select'
import { loginApi_f } from '@query/api'
import { useMutation } from '@tanstack/react-query'
import { StackNav } from '@utils/types'
import { removePlusBeforeCountryCode } from '@utils/utils'
import { useRef, useState } from 'react'
import { Alert, Dimensions, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import BottomText from './BottomText'
import CountryCodeSelector from './CountryCodeSelector'
import { isValidPhoneNumber } from './utils'

const { width } = Dimensions.get('window')

const appIconSize = 0.1
const aspectRatio = 1060 / 188

export default function Login({ navigation }: { navigation: StackNav }) {
  const sheet = useRef<BottomSheetRefProps>(null)
  const [country_code, setCountry_code] = useState('+91')
  const [phone, setPhone] = useState('')

  const loginMutation = useMutation({
    mutationFn: () => loginApi_f({ phone, country_code: removePlusBeforeCountryCode(country_code) }),
    onSuccess: () => navigation.replace('OTP', { phone, country_code, isSignUp: false }),
  })

  function handelSubmit() {
    if (!country_code) {
      return Alert.alert('Country Code Required', 'Please select your country code.')
    }

    if (!isValidPhoneNumber(phone).status) {
      return Alert.alert('Invalid Phone Number', isValidPhoneNumber(phone).message)
    }
    loginMutation.mutate()
  }

  return (
    <>
      <View className='flex h-full flex-1 justify-between bg-white p-4 pb-2'>
        <PaddingTop />
        <View />
        <View>
          <View className='flex items-center justify-center'>
            {/* <Image source={icons.appIcon} style={{ width: width * appIconSize * 1.37, height: width * appIconSize }} /> */}
            <AppIconBlack width={width * appIconSize * aspectRatio} height={width * appIconSize * aspectRatio} />
            <Text className='text-center font-mono text-4xl font-bold text-black'>Login</Text>
            <Text className='p-4 px-10 pt-1 text-center text-lg text-neutral-500' style={{ lineHeight: 25 }}>
              Welcome Back !
            </Text>
          </View>
          <View style={{ gap: 10, marginTop: 10 }}>
            <View className='flex flex-row items-center justify-center' style={{ gap: 10 }}>
              <Select
                placeholder='+ CC'
                LeftUI={<Icon name='phone-outline' size={20} color='black' />}
                style={{ flex: 0.45 }}
                onPress={() => {
                  sheet.current?.openFull()
                }}
                RightUI={null}
                value={country_code}
              />
              <Input placeholder='Mobile Number' keyboardType='number-pad' className='flex-1' value={phone} onChangeText={setPhone} />
            </View>
            <Text className='items-center justify-center px-5 text-center' style={{ color: 'green' }}>
              {/* <Icon name='information-outline' size={16} color='green' /> */}
              Make sure you enter your <Icon name='whatsapp' size={16} color='green' /> Whatsapp Number. The OTP will be sent to this number on
              WhatsApp.
            </Text>
            <View />
            {loginMutation.isPending ? (
              <Button title='Sending OTP...' LeftUI={<SmallLoading />} disabled={true} />
            ) : (
              <Button title='Log In' onPress={handelSubmit} LeftUI={<Icon name='account' size={17} color='white' />} />
            )}
            <Button
              title='Create Account'
              variant='outline'
              LeftUI={<Icon name='creation' size={17} />}
              className='mt-1'
              onPress={() => navigation.navigate('SignUp')}
            />
          </View>
        </View>
        <View />
        <View />
        <View />
        <BottomText />
      </View>
      <BottomSheet ref={sheet}>
        <CountryCodeSelector
          setCountryCode={setCountry_code}
          closeFn={() => {
            sheet.current?.close()
          }}
        />
      </BottomSheet>
    </>
  )
}
