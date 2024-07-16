import useQRStore from '@/zustand/QRState'
import icons from '@assets/icons/icons'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import Label from '@components/Label'
import RadioButton, { RadioButtonOption } from '@components/Radio'
import type { StackNav } from '@utils/types'
import { useCallback, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const options: RadioButtonOption[] = [
  { key: '200', text: '200 MST' },
  { key: '500', text: '500 MST' },
  { key: '1500', text: '1500 MST' },
]

function Currency() {
  return <Text className='mr-1.5 text-base'>MST</Text>
}

function QRCodeIcon({ navigation }: { navigation: StackNav }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('QR')}>
      {/* <Icon name='qrcode-scan' size={20} color='black' style={{ marginRight: 10 }} /> */}
      <Image source={icons.qr} style={{ marginRight: 5, width: 22, height: 22, tintColor: 'black' }} />
    </TouchableOpacity>
  )
}

export default function Send({ navigation }: { navigation: StackNav }) {
  const [selected, setSelected] = useState<string>('')
  const [amount, setAmount] = useState<string>(__DEV__ ? '200' : '')
  const receiver = useQRStore((state) => state.qr)
  const setReceiver = useQRStore((state) => state.setQR)

  const amountInputHandler = useCallback((text: string) => {
    setAmount(text)
    setSelected('')
  }, [])

  const selectionHandler = useCallback((value: string) => {
    setAmount(value)
    setSelected(value)
  }, [])

  const sendHandler = useCallback(() => {
    if (!amount) return Alert.alert('Error', 'Please select amount')
    if (!receiver) return Alert.alert('Error', 'Please enter receiver address')
    const a = parseFloat(amount)
    const r = receiver.trim().toLocaleLowerCase()
    if (isNaN(a) || a <= 0) return Alert.alert('Error', 'Please enter valid amount')
    if (r.length < 5) return Alert.alert('Error', 'Please enter valid receiver address')
    navigation.navigate('SendingDetails', { amount: a, receiver: r })
  }, [amount, navigation, receiver])

  return (
    <View style={{ gap: 15, marginTop: 15 }}>
      <RadioButton options={options} value={selected} onChange={selectionHandler} style={{ marginTop: 0 }} />
      <View>
        <Label title='Amount' />
        <Input
          placeholder='Enter amount in MST'
          keyboardType='numeric'
          style={{ backgroundColor: 'white' }}
          onChangeText={amountInputHandler}
          RightUI={<Currency />}
          value={amount}
        />
      </View>
      <View>
        <Label title='Receiver Address' />
        <Input
          placeholder='Enter Receiver Wallet Address'
          style={{ backgroundColor: 'white' }}
          RightUI={<QRCodeIcon navigation={navigation} />}
          value={receiver}
          onChangeText={(text) => setReceiver(text)}
        />
      </View>
      <Button
        title='Send Now'
        className='mt-2.5'
        RightUI={<Icon name='send' size={14} color='white' style={{ marginRight: 10 }} />}
        onPress={sendHandler}
      />
    </View>
  )
}
