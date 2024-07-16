import { Input } from '@components/Input'
import { countries as ALL_COUNTRIES } from '@utils/countryCode'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Country = {
  name: string
  flag: string
  dial_code: string
}

function searchFn(search: string) {
  search = search.trim()
  return ALL_COUNTRIES.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()) || country.dial_code.includes(search))
}

export default function CountryCodeSelector({
  setCountryCode,
  closeFn,
}: {
  setCountryCode: React.Dispatch<React.SetStateAction<string>>
  closeFn: () => void
}) {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    if (search.trim() === '') {
      return setCountries(ALL_COUNTRIES)
    }
    const timer = setTimeout(() => {
      setCountries(searchFn(search))
    }, 100)
    return () => {
      clearTimeout(timer)
    }
  }, [search])

  return (
    <View>
      <View className='px-4 pb-4'>
        <Input placeholder='Select Your country' LeftUI={<Icon name='magnify' size={20} color='gray' />} onChangeText={setSearch} />
      </View>
      <ScrollView style={{ paddingHorizontal: 15 }}>
        <View className='pb-20'>
          {countries.length === 0 && <Text className='text-center text-gray-500'>No results found</Text>}
          {countries.map((country, index) => (
            <TouchableOpacity
              key={index}
              className='flex flex-row items-center gap-3.5 p-2.5'
              style={{ gap: 10 }}
              onPress={() => {
                closeFn()
                setTimeout(() => setCountryCode(country.dial_code))
              }}
            >
              <Text className='text-2xl'>{country.flag}</Text>
              <Text style={{ fontSize: 17, fontWeight: '500' }}>{country.dial_code}</Text>
              <Text style={{ fontSize: 17, flex: 1, fontWeight: '500' }} numberOfLines={1}>
                {country.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
