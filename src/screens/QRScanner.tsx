import useQRStore from '@/zustand/QRState'
import { DefaultTransparent } from '@components/StatusBar'
import FlashLightIcon from '@icons/flashlight.svg'
import { Name } from '@utils/constants'
import type { NavProp } from '@utils/types'
import { getUserNameFromQR } from '@utils/utils'
import React from 'react'
import { Alert, Dimensions, TouchableOpacity, View } from 'react-native'
import { RNCamera } from 'react-native-camera'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const { width, height } = Dimensions.get('window')

export default function QRScanner({ navigation }: NavProp) {
  const [flash, setFlash] = React.useState(false)
  const bottom = useSafeAreaInsets().bottom
  const top = useSafeAreaInsets().top

  const qr = useQRStore((state) => state.qr)
  const setQR = useQRStore((state) => state.setQR)

  function onSuccess(e: any) {
    if (qr === e.data) {
      return
    }
    const data = e.data
    if (data.endsWith(`@${Name}`)) {
      setQR(getUserNameFromQR(data))
      navigation.goBack()
    } else {
      Alert.alert('Invalid QR Code', 'This QR code does not belong to ' + Name + '. Please scan a valid QR code to proceed.')
    }
  }

  return (
    <>
      <DefaultTransparent />
      <QRCodeScanner
        onRead={onSuccess}
        reactivate={true}
        reactivateTimeout={2000}
        flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        showMarker={true}
        cameraStyle={{ height: height + top + bottom, width: width }}
        markerStyle={{ borderColor: '#FFFfff55', borderRadius: 20, borderWidth: 2 }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: bottom + 50,
          width: '100%',
        }}
        className='flex items-center justify-center'
      >
        {/* <Text className='mb-5 text-red-500'>{qr || 'Scan a QR code to see the magic happen!'}</Text> */}
        <TouchableOpacity
          style={{
            backgroundColor: flash ? '#FFFfff' : '#FFFfff55',
            borderRadius: 100,
            padding: 12,
          }}
          onPress={() => setFlash(!flash)}
        >
          <FlashLightIcon width={33} height={33} color={flash ? '#000000' : '#FFFfff'} />
        </TouchableOpacity>
      </View>
    </>
  )
}
