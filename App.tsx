import { SmallLoading } from '@components/Loading'
import { DarkContentTransparentStatusBar } from '@components/StatusBar'
import { NavigationContainer } from '@react-navigation/native'
import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from '@react-navigation/stack'
import AppUpdate, { type AppUpdateParamList } from '@screens/Account/AppUpdate'
import Suspended, { type SuspendedParamList } from '@screens/Account/Suspended'
import UnderMaintenance from '@screens/Account/UnderMaintenance'
import RateUs from '@screens/Extra/RateUs'
import Home from '@screens/Home'
import EditProfile, { type EditProfileParamList } from '@screens/Home/Profile/EditProfile'
import Sending, { type SendingParamList } from '@screens/Home/Wallet/Sending'
import CheckRefer from '@screens/Login/CheckRefer'
import Login from '@screens/Login/Login'
import OTP, { type OTPParamList } from '@screens/Login/OTP'
import Setup from '@screens/Login/Setup'
import SignOut from '@screens/Login/SignOut'
import SignUp from '@screens/Login/SignUp'
import NotificationDetails, { type NotificationsParamList } from '@screens/Others/NotificationDetails'
import Notifications from '@screens/Others/Notifications'
import Settings from '@screens/Others/Settings'
import QRScanner from '@screens/QRScanner'
import Refer from '@screens/Refer/Refer'
import TransactionDetails, { type TransactionDetailsParamList } from '@screens/Transactions/TransactionDetails'
import Transactions from '@screens/Transactions/Transactions'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { secureLs } from '@utils/storage'
import { StackNav } from '@utils/types'
import React, { useCallback, useEffect } from 'react'
import { Dimensions, SafeAreaView, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import './src/ignoreWarnings'
import { setAuthToken, showErr } from './src/query/api'
import SendingMoney, { type SendingMoneyParamList } from '@screens/Home/Wallet/SendingMoney'

export type RootStackParamList = {
  navigationDecider: undefined
  Login: undefined
  CheckRefer: undefined
  Home: undefined
  SignUp: undefined
  OTP: OTPParamList
  Setup: undefined
  Notifications: undefined
  NotificationDetails: NotificationsParamList
  EditProfile: EditProfileParamList
  Settings: undefined
  Transactions: undefined
  Refer: undefined
  TransactionDetails: TransactionDetailsParamList
  SignOut: undefined
  Suspended: SuspendedParamList
  UnderMaintenance: undefined
  AppUpdate: AppUpdateParamList
  RateUs: undefined
  Mining: undefined
  Blank: undefined
  Banner: undefined
  Unity: undefined
  QR: undefined
  SendingDetails: SendingParamList
  SendingMoney: SendingMoneyParamList
}

const Stack = createStackNavigator<RootStackParamList>()
const { width, height } = Dimensions.get('window')

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
      onError: showErr,
    },
    queries: {
      retry: 1,
    },
  },
})

export default function App(): React.JSX.Element {
  //
  // const [isInitialized, setIsInitialized] = useState(false)
  // const [statusText, setStatusText] = useState('Initializing...')
  // useEffect(() => {}, [statusText])

  // useEffect(() => {
  //   // InitializationListener
  //   InitEvent.onInitializationComplete.setListener(() => {
  //     console.log('onInitializationComplete')
  //     // setIsInitialized(true)
  //   })

  //   // init the SDK after all child components mounted
  //   //   and the app becomes active
  //   const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
  //     if (state === 'active') {
  //       initIronSource()
  //       subscription.remove()
  //     }
  //   })

  //   return () => {
  //     InitEvent.removeAllListeners()
  //     subscription.remove()
  //   }
  // }, [])
  return (
    // <SafeAreaProvider>
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, height: height, backgroundColor: 'red' }}>
          <DarkContentTransparentStatusBar />
          <PaperProvider>
            <NavigationContainer>
              <Navigation />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider>
    //  </SafeAreaProvider>
  )
}

function NavigationDecider({ navigation }: { navigation: StackNav }) {
  const decide = useCallback(async () => {
    const token = secureLs.getString('token')
    if (token) {
      navigation.replace('Home')
    } else {
      navigation.replace('Login')
    }
  }, [navigation])

  useEffect(() => {
    setAuthToken()
    decide()
  }, [decide])

  return (
    <View className='flex-1 items-center justify-center bg-white p-5'>
      <SmallLoading />
    </View>
  )
}

const IOS_BOTTOM_STYLE: StackNavigationOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
  gestureEnabled: true,
  gestureDirection: 'vertical',
  gestureResponseDistance: height,
}

const NO_ANIMATION: StackNavigationOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
}

function Navigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        // gestureEnabled: true,gestureDirection: 'horizontal', gestureResponseDistance: width,
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {/* <Stack.Screen name='Unity' component={Unity} /> */}

      <Stack.Screen name='navigationDecider' component={NavigationDecider} options={NO_ANIMATION} />
      <Stack.Screen name='Login' component={Login} options={NO_ANIMATION} />
      <Stack.Screen name='CheckRefer' component={CheckRefer} />
      <Stack.Screen name='Home' component={Home} options={NO_ANIMATION} />
      <Stack.Screen name='SignUp' component={SignUp} />
      <Stack.Screen name='OTP' component={OTP} />
      <Stack.Screen name='Setup' component={Setup} />
      <Stack.Screen name='Notifications' component={Notifications} />
      <Stack.Screen name='NotificationDetails' component={NotificationDetails} options={IOS_BOTTOM_STYLE} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen name='Transactions' component={Transactions} />
      <Stack.Screen name='Refer' component={Refer} />
      <Stack.Screen name='TransactionDetails' component={TransactionDetails} options={IOS_BOTTOM_STYLE} />
      <Stack.Screen name='SignOut' component={SignOut} options={IOS_BOTTOM_STYLE} />
      <Stack.Screen name='Suspended' component={Suspended} />
      <Stack.Screen name='UnderMaintenance' component={UnderMaintenance} />
      <Stack.Screen name='AppUpdate' component={AppUpdate} />
      <Stack.Screen name='RateUs' component={RateUs} options={IOS_BOTTOM_STYLE} />
      <Stack.Screen name='Mining' component={Home} />
      <Stack.Screen name='SendingDetails' component={Sending} options={IOS_BOTTOM_STYLE} />
      <Stack.Screen name='SendingMoney' component={SendingMoney} options={{ ...IOS_BOTTOM_STYLE, gestureEnabled: false }} />
      <Stack.Screen
        name='QR'
        component={QRScanner}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
    </Stack.Navigator>
  )
}
