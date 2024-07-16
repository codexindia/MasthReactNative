import CopyIcon from '@icons/copy.svg'
import ShareIcon from '@icons/share.svg'
import Clipboard from '@react-native-community/clipboard'
import { colors } from '@utils/colors'
import { shareText } from '@utils/utils'
import React, { useState } from 'react'
import { StyleProp, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'outline' | 'solid'
  classNames?: string
  LeftUI?: React.ReactNode
  RightUI?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ onPress, title, variant, style, classNames, LeftUI, RightUI, disabled, ...rest }) => {
  const isOutline = variant === 'outline'
  const space = 10
  const bg = isOutline ? 'bg-transparent' : 'bg-black'
  const textColor = isOutline ? 'text-black' : 'text-white'
  const activeOpacity = isOutline ? 0.3 : 0.7

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      className={`flex w-full flex-row items-center justify-center rounded-2xl border-black ${
        disabled ? 'opacity-70' : 'opacity-100'
      } ${bg} ${classNames}`}
      style={[{ padding: 14, borderWidth: 1.5 }, style]}
      onPress={onPress}
      disabled={disabled}
      {...rest}
    >
      {LeftUI && <View style={{ marginRight: space }}>{LeftUI}</View>}
      <Text className={textColor} style={{ fontSize: 16 }}>
        {title}
      </Text>
      {RightUI && <View style={{ marginLeft: space }}>{RightUI}</View>}
    </TouchableOpacity>
  )
}

interface SmallButtonProps extends TouchableOpacityProps {
  title: string
  classNames?: string
  textStyles?: StyleProp<any>
  LeftUI?: React.ReactNode
  RightUI?: React.ReactNode
}
export function SmallButton({ onPress, title, classNames, LeftUI, RightUI, textStyles, ...rest }: SmallButtonProps) {
  const space = 10
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`flex flex-row items-center justify-center rounded-full border-black bg-black ${classNames}`}
      style={{ padding: 9, borderWidth: 1.5 }}
      onPress={onPress}
      {...rest}
    >
      {LeftUI && <View style={{ marginRight: space }}>{LeftUI}</View>}
      <Text className='text-white' style={[{ fontSize: 15 }, textStyles]}>
        {title}
      </Text>
      {RightUI && <View style={{ marginLeft: space }}>{RightUI}</View>}
    </TouchableOpacity>
  )
}

export function RoundButton({ onPress, children, ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className='flex items-center justify-center rounded-full bg-black'
      style={{ padding: 15 }}
      onPress={onPress}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}

export function CopyButton({ str }: { str: string }) {
  const [copied, setCopied] = useState(false)
  const onPress = () => {
    Clipboard.setString(str)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }
  return copied ? (
    <RoundButton>
      <Icon name='check' size={18} color={colors.greenPrimary} />
    </RoundButton>
  ) : (
    <RoundButton onPress={onPress}>
      <CopyIcon width={18} height={18} />
    </RoundButton>
  )
}

export function ShareButton({ str }: { str: string }) {
  return (
    <RoundButton onPress={() => shareText(str)}>
      <ShareIcon width={18} height={18} />
    </RoundButton>
  )
}
