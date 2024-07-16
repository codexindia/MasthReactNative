import { check_maintenance_f, type ServerResponse } from '@query/api'
import { useQuery } from '@tanstack/react-query'
import type { NavProp, StackNav } from '@utils/types'
import { useEffect } from 'react'

export default function MaintenanceNavigation({ navigation }: NavProp) {
  const checkMaintenance = useQuery({ queryKey: ['checkMaintenance'], queryFn: check_maintenance_f })

  useEffect(() => {
    if (checkMaintenance.data?.status) {
      navigation.replace('UnderMaintenance')
    }
  }, [checkMaintenance.data, navigation])

  return null
}

export function useBannedNavigation(navigation: StackNav, data: ServerResponse | undefined) {
  useEffect(() => {
    if (data && data?.blocked) {
      navigation.replace('Suspended', { reason: data?.message || '' })
    }
  }, [data, navigation])
}
