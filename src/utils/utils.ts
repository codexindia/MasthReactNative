import { check_version_f } from '@query/api'
import { Share } from 'react-native'
import { Alert } from 'react-native'
import { APP_V_CODE, Name } from './constants'
import type { StackNav } from './types'

export async function shareText(message: string) {
  try {
    const result = await Share.share({ message })
  } catch (error) {}
}

export function removePlusBeforeCountryCode(country_code: string) {
  return country_code.replace('+', '')
}

export function formattedDate(date: Date | null) {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

export function niceDate(date: Date | null) {
  if (!date) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Utils
export const p = console.log
export const e = console.error

// each message string will be displayed on a new line
export const showAlert = (title: string, messages?: string[]) => {
  const message = messages?.reduce((acc, s) => (s.length > 0 ? `${acc}\n${s}` : acc))
  Alert.alert(title, message, [{ text: 'OK' }])
}

export const prettyJSON = (obj: any) => JSON.stringify(obj, null, 2)

export function blank_fn() {}

export function handleAppUpdate(navigation: StackNav) {
  check_version_f().then((appVersion) => {
    const localV = Number(APP_V_CODE)
    const serverV = Number(appVersion.version_code)
    const shouldUpdate = serverV > localV && appVersion.force_update
    if (shouldUpdate) {
      if (__DEV__) {
        console.warn('App Update Available')
        return
      }
      navigation.replace('AppUpdate', {
        link: appVersion.store_link || appVersion.custom_link || '',
      })
    }
  })
}

export function log(...args: any[]) {
  if (__DEV__) {
    console.log(...args)
  }
}

export function qrString(username: string) {
  return `${username}@${Name}`
}

export function getUserNameFromQR(qr: string) {
  return qr.split(`@${Name}`)[0]
}
