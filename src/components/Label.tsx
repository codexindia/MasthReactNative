import { View, Text } from 'react-native'
import React from 'react'

export default function Label({ title }: { title: string }) {
  return <Text className='mb-1 pl-1 text-sm text-neutral-600'>{title}</Text>
}
