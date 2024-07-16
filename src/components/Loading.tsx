import icons from '@assets/icons/icons'
import React from 'react'
import { Image, ImageProps, ImageSourcePropType, View } from 'react-native'
import { PaddingBottom } from './SafePadding'

interface LoadingProps extends Omit<ImageProps, 'source'> {
  size?: number
  source?: ImageSourcePropType
}

export default function Loading({ size = 50, style, source = icons.loadingGif }: LoadingProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 }}>
      <Image source={source} style={[{ width: size, height: size }, style]} />
      <PaddingBottom />
    </View>
  )
}

export function SmallLoading({ size = 32, style, source = icons.loadingGif }: LoadingProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={source} style={[{ width: size, height: size }, style]} />
    </View>
  )
}

export function SmallLoadingWrapped() {
  return (
    <View style={{ height: 15 }}>
      <SmallLoading />
    </View>
  )
}
