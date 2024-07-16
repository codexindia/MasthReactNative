import { ls, secureLs } from '@utils/storage'
import axios from 'axios'
import { Alert } from 'react-native'
import RNRestart from 'react-native-restart'

const API = 'https://masth.nexgino.com/api/'

axios.defaults.headers.common.secret = 'hellothisisocdexindia'

export function setAuthToken() {
  const token = secureLs.getString('token')
  if (token) axios.defaults.headers.common.Authorization = 'Bearer ' + token
}
setAuthToken()

const DEFAULT_ERR = 'Error occurred. Pease check your internet connection and try again'

export interface ServerResponse {
  message: string
  status: boolean
  blocked?: boolean
  data?: any
}

let popupCount = 0
async function postApi<T>(url: string, data: any) {
  try {
    if (data) return (await axios.post<T>(API + url, data)).data
    else return (await axios.post<T>(API + url)).data
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response.data.message === 'Unauthenticated.') ShowAlertAndRestart()
    console.log(JSON.stringify(error.response.data, null, 2))
    const errors = error?.response.data.errors
    const singleError = errors[Object.keys(errors)[0]][0]
    throw new Error(singleError || DEFAULT_ERR)
  }
}

function ShowAlertAndRestart() {
  if (popupCount < 1) {
    popupCount++
    Alert.alert('Session Expired', 'Please login again', [
      {
        text: 'OK',
        onPress: () => {
          secureLs.clearAll()
          ls.clearAll()
          RNRestart.Restart()
        },
      },
    ])
  }
}

export function showErr(error: Error) {
  console.log(JSON.stringify(error, null, 2))
  Alert.alert(error.name, error.message)
}

export async function loginApi_f({ phone, country_code }: { phone: string; country_code: string }) {
  return await postApi<ServerResponse>('auth/login/LoginOTP', { phone, country_code })
}

// All functions below are for fetching data from the server and there are types for the data that is fetched

export function send_coin_f({ username, coins }: { username: string; coins: number }) {
  return postApi<ServerResponse>('wallet/sendCoin', { username, coins })
}

export interface UserDetailT {
  status: boolean
  message: string
  data?: {
    name?: string
    username?: string
    profile_pic?: string
  }
}

export async function userDetail_f(username: string) {
  return await postApi<UserDetailT>('wallet/getNameByUsername', { username })
}

type SignUpAPI = {
  username: string
  dob: string
  lang: string
  name: string
  country_code: string
  phone: string
}
export async function signUpApi_f(data: SignUpAPI) {
  return await postApi<ServerResponse>('auth/SignUp/SendOTP', data)
}

type VerifySignUpAPI = {
  country_code: string
  phone: string
  otp: string
}

interface ResponseWithToken extends ServerResponse {
  token: string
}
export async function verifySignUp_f(data: VerifySignUpAPI) {
  return await postApi<ResponseWithToken>('auth/SignUp', data)
}

type VerifyLoginAPI = {
  country_code: string
  phone: string
  otp: string
}
export async function verifyLogin_f(data: VerifyLoginAPI) {
  return await postApi<ResponseWithToken>('auth/login', data)
}

export interface ProfileT {
  status: boolean
  message: string
  data?: ProfileDataT
  refer_claimed?: boolean
  blocked?: boolean
}

export interface ProfileDataT {
  refer_code: string
  country_code: string
  created_at: string
  date_of_birth: string
  email: string
  email_verified_at: null
  id: number
  language: string
  name: string
  phone_number: string
  profile_pic: string | null
  updated_at: string
  username: string
  coin: string
}
export async function profile_f() {
  console.log('Fetch Profile Data')
  return await postApi<ProfileT>('profile/GetUser', null)
}

export async function updateProfile_f(data: FormData) {
  return await axios.post<ServerResponse>(API + 'profile/UpdateUser', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function claim_refer_f({ refer_code }: { refer_code: string }) {
  return await postApi<ServerResponse>('refer/claim', { refer_code })
}

export async function skip_refer_f() {
  return await postApi<ServerResponse>('refer/skip', null)
}

export interface ReferredUserT {
  status: boolean
  referred_bonus?: string
  coins_earned?: number
  list?: List
}

export interface List {
  current_page: number
  data: Datum[]
  next_page_url: null
}

export interface Datum {
  user_id: string
  coins_earn: string
  profile: Profile[]
}

export interface Profile {
  id: number
  name: string
  profile_pic: string
  username: string
}

export async function get_referred_members_f({ pageParam }: { pageParam: number }) {
  return await postApi<ReferredUserT>(`refer/get_referred_members?page=${pageParam}`, null)
}

// Have to check the type of the data that is
export interface WalletTransactionT {
  status: boolean
  data: Data
  message: string
}

export interface Data {
  current_page: number
  data: DatumT[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface DatumT {
  coin: string
  transaction_type: TransactionType
  description: string
  transaction_id: string
  status: Status
  created_at: string
}

export enum Status {
  Success = 'success',
}

export enum TransactionType {
  Credit = 'credit',
}

export interface Link {
  url: null | string
  label: string
  active: boolean
}
export async function get_wallet_transactions_f({ pageParam }: { pageParam: number }) {
  return await postApi<WalletTransactionT>(`wallet/getTransaction?page=${pageParam}`, null)
}

export interface MiningStatusT {
  status: boolean
  mining_function?: boolean
  mining_data?: MiningData
  message: string
}

export interface MiningData {
  id: number
  session_id: string
  user_id: number
  start_time: string
  end_time: string
  coin: string
  status: string
  current_time: string
  created_at: string
  updated_at: string
}
export async function check_mining_status_f() {
  return await postApi<MiningStatusT>('mining/checkMiningStatus', null)
}

export function start_mining_f() {
  return postApi<ServerResponse>('mining/startMining', null)
}

export interface CheckVersionT {
  custom_link: null
  force_update: boolean
  status: boolean
  store_link: string
  version_code: string
}

export function check_version_f() {
  return postApi<CheckVersionT>('env/check_version', null)
}

export interface HomeStatisticsT {
  status: boolean
  active_miners?: number
  total_miners?: number
  total_remote_mining?: number
  total_live_mining?: number
  valuation?: {
    currency: string
    rate: number
  }
}
export function home_statics_f() {
  return postApi<HomeStatisticsT>('home/Statics', null)
}

export interface PopupDataT {
  status: boolean
  banner_image?: string
  action_link?: string
  button_text?: string
}
export function popup_image_f() {
  return postApi<PopupDataT>('home/popup_banner', null)
}

export function check_maintenance_f() {
  return postApi<ServerResponse>('env/check_maintenance', null)
}

export interface NotificationT {
  status: boolean
  data?: DataNotificationT
  message: string
}

export interface DataNotificationT {
  notifications?: Notification[]
}

export interface Notification {
  id?: string
  title?: string
  subtitle?: string
}

export function get_notifications_f() {
  return postApi<NotificationT>('notification/getNotification', null)
}

export function marked_as_read_notifications_f() {
  return postApi<any>('notification/markRead', null)
}

export function check_username_f({ username }: { username: string }) {
  return postApi<ServerResponse>('auth/check_username', { username })
}
