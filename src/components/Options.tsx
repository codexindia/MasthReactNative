import { colors } from '@utils/colors'
import { Text, View, type StyleProp, type ViewStyle } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import Feather from 'react-native-vector-icons/Feather'

const ICON_SIZE = 20

export function OptionWrapper({ children, name, style }: { children?: React.ReactNode; name: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ marginTop: 20 }, style]}>
      <Text className='pl-1 uppercase text-zinc-500' style={{ fontSize: 13 }}>
        {name}
      </Text>
      <View className='mt-2 overflow-hidden rounded-2xl bg-white pb-0.5 pt-0.5'>{children}</View>
    </View>
  )
}

type OptionProps = {
  name: string
  onPress?: () => void
  left?: React.ReactNode
  mid?: React.ReactNode
  right?: React.ReactNode
  borderBottom?: boolean
}

export function Option({ name, onPress, left, mid, right, borderBottom = true }: OptionProps) {
  return (
    <TouchableRipple onPress={onPress}>
      <View
        className='flex-row items-center justify-between border border-b border-transparent border-b-zinc-100 px-4 py-3 pr-2.5'
        style={{ borderBottomWidth: borderBottom ? 1 : 0 }}
      >
        <View className='flex-row items-center justify-center gap-x-5'>
          {left}
          {mid || <Text className='text-base text-zinc-800'>{name}</Text>}
        </View>
        {right}
      </View>
    </TouchableRipple>
  )
}

export function RightArrow({ blank, color }: { blank?: boolean; color?: string }) {
  return <Feather name='chevron-right' size={ICON_SIZE + 1} color={color || colors.gray} style={{ opacity: blank ? 0 : 1 }} />
}

export function RightarrowWithText({ text }: { text: string }) {
  return (
    <View className='flex-row items-center'>
      <Text className='pb-0.5 pr-1 text-zinc-500'>{text}</Text>
      <RightArrow />
    </View>
  )
}
