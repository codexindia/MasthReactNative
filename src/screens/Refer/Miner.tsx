import BellWhiteIcon from '@icons/bell-white.svg'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

interface MinerProps {
  name: string
  username: string
  profile_pic: string
  bellIcon?: boolean
}

const Miner: React.FC<MinerProps> = ({ name, username, profile_pic, bellIcon }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className='flex-row  items-center justify-between bg-white p-3'
      style={{
        borderRadius: 20,
      }}
    >
      <View className='flex-row items-center gap-3' style={{ flex: 1 }}>
        <Image source={{ uri: profile_pic }} style={{ width: 50, height: 50, borderRadius: 25 }} />
        <View style={{ flex: 1 }}>
          <Text className='text-base' numberOfLines={1}>
            {name}
          </Text>
          <Text className='text-base text-neutral-600' style={{ fontSize: 16 }} numberOfLines={1}>
            @{username}
          </Text>
        </View>
        {bellIcon && (
          <TouchableOpacity activeOpacity={0.7}>
            <View className='items-center justify-center rounded-full bg-black' style={{ width: 43, height: 43 }}>
              <BellWhiteIcon height={17} width={17} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default Miner
