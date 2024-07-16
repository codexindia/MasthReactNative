import { View } from 'react-native'
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

interface TopBarProps extends ViewProps {}

export default function TopBar(props: TopBarProps) {
  return (
    <>
      <View className='items-center justify-center'>
        <View className='w-20 rounded-full bg-neutral-200' style={[{ height: 5 }, props.style]} />
      </View>
    </>
  )
}
