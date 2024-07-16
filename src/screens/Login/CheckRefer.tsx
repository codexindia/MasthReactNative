import Images from '@assets/images/images'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import KeyboardAvoidingContainer from '@components/KeyboardAvoidingContainer'
import { SmallLoading } from '@components/Loading'
import { PaddingBottom, PaddingTop } from '@components/SafePadding'
import { claim_refer_f, skip_refer_f } from '@query/api'
import { useMutation } from '@tanstack/react-query'
import { StackNav } from '@utils/types'
import { useState } from 'react'
import { Alert, Dimensions, Image, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'
import ReferralImage from '@images/referral.svg'

const { width, height } = Dimensions.get('window')

const IMG_WIDTH = width * 0.8
const IMG_HEIGHT = width * 0.8

export default function CheckRefer({ navigation }: { navigation: StackNav }) {
  const [refer_code, setRefer_code] = useState('')

  const applyReferCodeMutation = useMutation({
    mutationFn: () => claim_refer_f({ refer_code }),
    onSuccess: () => {
      Alert.alert('Success', 'Refer code applied successfully')
      navigation.replace('Home')
    },
  })

  const skipReferCodeMutation = useMutation({
    mutationFn: () => skip_refer_f(),
    onSuccess: () => {
      navigation.replace('Home')
    },
  })

  function handelSkip() {
    Alert.alert('Are you sure?', 'You will not be able to get the benefits of the referral program. This action is irreversible.', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Skip', onPress: () => skipReferCodeMutation.mutate() },
    ])
  }

  function handelApply() {
    if (!refer_code) {
      return Alert.alert('Refer Code Required', 'Please enter your referral code.')
    }
    applyReferCodeMutation.mutate()
  }

  return (
    <KeyboardAvoidingContainer>
      <View className='flex-1 bg-white'>
        <PaddingTop />
        <View className='h-screen flex-1 justify-between p-5'>
          <Text className='text-center text-2xl font-bold'>Are you Referred?</Text>
          <View style={{ gap: 20 }} className='items-center justify-center'>
            {/* <Image source={Images.referral} style={{ width: IMG_WIDTH, height: IMG_HEIGHT, resizeMode: 'contain', marginBottom: 20 }} /> */}
            <ReferralImage width={IMG_WIDTH} height={IMG_HEIGHT} style={{ marginBottom: 20 }} />
            <Text className='text-center text-lg'>If you have a referral code, enter it here.</Text>
            <Input
              placeholder='Enter Refer Code'
              LeftUI={<Icon name='cross-reference' size={18} color={'gray'} />}
              value={refer_code}
              onChangeText={setRefer_code}
            />
            {applyReferCodeMutation.isPending ? (
              <Button title='Applying' LeftUI={<SmallLoading />} disabled={true} />
            ) : (
              <Button title='Apply Refer Code' onPress={handelApply} />
            )}

            <Text className='px-5 text-center text-orange-500'>
              If you don't have a referral code, skip this step. But you will not be able to get the benefits of the referral program.
            </Text>
          </View>
          <View />
          <View style={{ gap: 25 }}>
            {skipReferCodeMutation.isPending ? (
              <Button title='Skipping' LeftUI={<SmallLoading />} disabled={true} variant='outline' />
            ) : (
              <Button title='Skip this step' onPress={handelSkip} variant='outline' />
            )}
          </View>
        </View>
        <PaddingBottom />
      </View>
    </KeyboardAvoidingContainer>
  )
}
