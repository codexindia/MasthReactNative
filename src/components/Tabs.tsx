import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface Tab {
  title: string
  UI: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <View className='mt-5 flex-row items-center justify-between rounded-2xl bg-neutral-200 p-1' style={{ gap: 5 }}>
        {tabs.map((tab, index) => (
          <View style={{ flex: 1 }} key={index}>
            <TouchableOpacity
              disabled={tab.disabled}
              activeOpacity={0.5}
              onPress={() => setActiveTab(index)}
              className={`rounded-xl ${activeTab === index ? 'bg-bgSecondary' : ''} p-2`}
            >
              <Text className={`text-center ${activeTab === index ? 'font-bold' : 'opacity-50'}`} style={{ fontSize: 16 }}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {tabs.map((tab, index) => (
        <View style={{ display: activeTab === index ? 'flex' : 'none' }} key={index}>
          {tab.UI}
        </View>
      ))}
    </>
  )
}
