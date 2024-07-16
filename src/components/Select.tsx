import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconM from 'react-native-vector-icons/MaterialIcons'

interface SelectProps extends TouchableOpacityProps {
  disabled?: boolean
  placeholder: string
  classNames?: string
  space?: number
  value?: string
  LeftUI?: React.ReactNode
  RightUI?: React.ReactNode
}

function RightSideUI() {
  return <IconM name='keyboard-control-key' size={20} color='black' style={{ backgroundColor: 'transparent', transform: [{ rotate: '180deg' }] }} />
}

export const Select: React.FC<SelectProps> = ({
  onPress,
  style,
  placeholder,
  classNames,
  RightUI = <RightSideUI />,
  LeftUI,
  space = 5,
  value,
  ...rest
}) => {
  const spaceLeft = LeftUI ? 12 : 0
  const spaceRight = RightUI ? 10 : 0

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className={`flex w-full flex-row rounded-2xl border-neutral-300 bg-neutral-100 ${classNames}`}
      style={[{ padding: 15, borderWidth: 1.5 }, style]}
      onPress={onPress}
      {...rest}
    >
      {LeftUI}
      <View className='flex flex-1 flex-row justify-between'>
        <Text className={value ? '' : 'text-gray-500'} style={{ fontSize: 16, paddingLeft: spaceLeft, paddingRight: spaceRight }}>
          {value || placeholder}
        </Text>
      </View>
      {RightUI}
    </TouchableOpacity>
  )
}
