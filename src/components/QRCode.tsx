import { Dimensions, View, ViewProps } from 'react-native'
import QRCodeStyled, { GradientProps, useQRCodeData } from 'react-native-qrcode-styled'
import BlackM from '@assets/icons/m/m-black.svg'
import { colors } from '@utils/colors'

const { width } = Dimensions.get('window')

interface QR_CODEProps extends ViewProps {
  str: string
  scale?: number
}

export default function QR_CODE({ str, scale = 0.8, ...rest }: QR_CODEProps) {
  const data = useQRCodeData(str, {})
  const pixelSize = (width * scale - 75) / data.qrCodeSize
  const iconSize = width * 0.09 * scale
  const innerBorderRadius = (1 / data.qrCodeSize) * 200 * scale
  return (
    <View className='flex items-center justify-center' {...rest}>
      {/* <Image
        source={icons.appIcon}
        className='border'
        style={{ width: iconSize, height: iconSize, position: 'absolute', zIndex: 1, borderRadius: 15 }}
      /> */}
      <View style={{ position: 'absolute', zIndex: 1, backgroundColor: 'white', borderRadius: 10, padding: 8 }}>
        <BlackM width={iconSize} height={iconSize} />
      </View>

      <QRCodeStyled
        data={str}
        isPiecesGlued={true}
        gradient={
          {
            type: 'linear',
            options: {
              // colors: ['#2aa3ce', '#466cef'],
              colors: ['black', 'black'],
              start: [0, 0],
              end: [1, 1],
            },
          } as GradientProps
        }
        pieceSize={pixelSize}
        pieceScale={0.88} // small gap between pieces
        innerEyesOptions={{ borderRadius: innerBorderRadius * 1.5 }}
        outerEyesOptions={{ borderRadius: innerBorderRadius * 2 * 1.5 }}
        pieceBorderRadius={innerBorderRadius * 0.5}
      />
    </View>
  )
}
