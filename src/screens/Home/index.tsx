import { PaddingBottom } from '@components/SafePadding'
import GameZoneIconSvgOutline from '@icons/game-outline.svg'
import GameZoneIconSvg from '@icons/game.svg'
import HomeIconSvgOutline from '@icons/home-outline.svg'
import HomeIconSvg from '@icons/home.svg'
import WalletIconSvgOutline from '@icons/wallet-outline.svg'
import WalletIconSvg from '@icons/wallet.svg'
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '@utils/colors'
import React from 'react'
import { StatusBar, TouchableOpacity, View } from 'react-native'
import GameZone from './GameZone'
import HomeScreen from './Home'
import Wallet from './Wallet/Wallet'

import ReferIconSvgOutline from '@icons/refer-outline.svg'
import ReferIconSvg from '@icons/refer.svg'
import Refer from '@screens/Refer/Refer'

function HomeIcon(props: { focused: boolean; color: string; size: number }) {
  return props.focused ? (
    <HomeIconSvg {...props} height={props.size} width={props.size} />
  ) : (
    <HomeIconSvgOutline {...props} height={props.size} width={props.size} />
  )
}

function GameZoneIcon(props: { focused: boolean; color: string; size: number }) {
  return props.focused ? (
    <GameZoneIconSvg {...props} height={props.size} width={props.size} />
  ) : (
    <GameZoneIconSvgOutline {...props} height={props.size} width={props.size} />
  )
}

// function ProfileIcon(props: { focused: boolean; color: string; size: number }) {
//   return props.focused ? (
//     <ProfileIconSvg {...props} height={props.size} width={props.size} />
//   ) : (
//     <ProfileIconSvgOutline {...props} height={props.size} width={props.size} />
//   )
// }

function WalletIcon(props: { focused: boolean; color: string; size: number }) {
  return props.focused ? (
    <WalletIconSvg {...props} height={props.size} width={props.size} />
  ) : (
    <WalletIconSvgOutline {...props} height={props.size} width={props.size} />
  )
}

function ReferIcon(props: { focused: boolean; color: string; size: number }) {
  return props.focused ? (
    <ReferIconSvg {...props} height={props.size} width={props.size} />
  ) : (
    <ReferIconSvgOutline {...props} height={props.size} width={props.size} />
  )
}

const Tab = createBottomTabNavigator()

function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className='bg-white'>
      <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          // const label =
          //   options.tabBarLabel !== undefined
          //     ? options.tabBarLabel
          //     : options.title !== undefined
          //       ? options.title
          //       : route.name
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.6}
              accessibilityRole='button'
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className='flex items-center justify-center p-1'
              style={{ flex: 1, paddingTop: 17, paddingBottom: 20 }}
            >
              {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color: 'black', size: 23 })}
              {/* <Text style={{color: isFocused ? '#673ab7' : '#222'}}>{label as ReactNode}</Text> */}
            </TouchableOpacity>
          )
        })}
      </View>
      <PaddingBottom />
    </View>
  )
}

const Home = () => {
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.bgSecondary} />
      <Tab.Navigator tabBar={BottomTabBar}>
        <Tab.Screen
          name='HomeScreen'
          component={HomeScreen}
          options={{
            tabBarLabel: 'HomeScreen',
            headerShown: false,
            tabBarIcon: HomeIcon,
          }}
        />
        <Tab.Screen
          name='Wallet'
          component={Wallet}
          options={{
            tabBarLabel: 'Wallet',
            headerShown: false,
            tabBarIcon: WalletIcon,
          }}
        />
        <Tab.Screen
          name='Refer'
          component={Refer}
          options={{
            tabBarLabel: 'Refer',
            headerShown: false,
            tabBarIcon: ReferIcon,
          }}
        />
        <Tab.Screen
          name='GameZone'
          component={GameZone}
          options={{
            tabBarLabel: 'GameZone',
            headerShown: false,
            tabBarIcon: GameZoneIcon,
          }}
        />
      </Tab.Navigator>
    </>
  )
}

// function WrappedEditProfile({ navigation }: { navigation: StackNav }) {
//   return (
//     <EditProfile
//       navigation={navigation}
//       route={{
//         key: 'EditProfile',
//         name: 'EditProfile',
//         params: {
//           isMigration: false,
//           isShowHeader: false,
//         },
//       }}
//     />
//   )
// }

export default Home
