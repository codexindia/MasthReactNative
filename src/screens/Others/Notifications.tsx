import BackHeader, { RightSettingIcon } from '@components/BackHeader'
import { PaddingBottom } from '@components/SafePadding'
import NotificationBellIcon from '@icons/bell.svg'
import { Notification, get_notifications_f, marked_as_read_notifications_f } from '@query/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { StackNav } from '@utils/types'
import { log } from '@utils/utils'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native'

type TransactionType = {
  message: string
  date: Date
}

export default function Notifications({ navigation }: { navigation: StackNav }) {
  const notification = useQuery({ queryKey: ['notification'], queryFn: get_notifications_f })
  const markAsRead = useMutation({
    mutationKey: ['markAsRead'],
    mutationFn: marked_as_read_notifications_f,
    onSuccess: () => {},
  })

  useEffect(() => {
    log(JSON.stringify(notification.data, null, 2))
  }, [notification])

  useEffect(() => {
    markAsRead.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className='flex-1 bg-bgSecondary'>
      <BackHeader navigation={navigation} title='' RightComponent={<RightSettingIcon navigation={navigation} />} />
      <FlatList
        data={notification?.data?.data?.notifications || []}
        renderItem={({ item }) => <NotificationCard {...item} navigation={navigation} />}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10, marginTop: 0, paddingBottom: 50 }}
        ListHeaderComponent={<ListHeader length={notification?.data?.data?.notifications?.length || 0} />}
        ListFooterComponent={<PaddingBottom />}
      />
    </View>
  )
}

const { height } = Dimensions.get('window')

function ListHeader({ length }: { length: number }) {
  return (
    <>
      <Text className='text-neutral-500' style={{ fontSize: 27 }}>
        Your,{' '}
      </Text>
      <Text style={{ fontSize: 27 }}>Notifications</Text>
      {length === 0 && (
        <View style={{ height: height * 0.4 }} className='items-center justify-center'>
          <Text className='text-center text-neutral-500 '>No notifications</Text>
        </View>
      )}
    </>
  )
}

function NotificationCard({ id, title, subtitle, navigation }: Notification & { navigation: StackNav }) {
  const [clicked, setClicked] = useState(false)
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className='flex-row items-center justify-between rounded-2xl bg-white p-2.5 pr-4'
      onPress={() => setClicked(!clicked)}
    >
      <View className='flex-row gap-3' style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#ffeed5' }} className='rounded-xl p-3'>
          <NotificationBellIcon width={23} height={23} />
        </View>
        <View style={{ flex: 1 }}>
          {clicked ? (
            <>
              <Text className='text-base'>{title}</Text>
              <Text className='text-sm'>{subtitle}</Text>
            </>
          ) : (
            <>
              <Text className='text-base' numberOfLines={1}>
                {title}
              </Text>
              <Text className='text-sm' numberOfLines={1}>
                {subtitle}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}
