import MasthYellow from '@assets/icons/masth/masth-yellow.svg'
import { PaddingTop } from '@components/SafePadding'
import { popup_image_f } from '@query/api'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Dimensions, Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { default as FeatherIcon } from 'react-native-vector-icons/Feather'
const { width, height } = Dimensions.get('window')

export default function PopupUi() {
  const popupImage = useQuery({ queryKey: ['popupImage'], queryFn: popup_image_f })

  const [modalVisible, setModalVisible] = React.useState(false)

  useEffect(() => {
    if (popupImage.data?.banner_image) {
      setModalVisible(true)
    }
  }, [popupImage.data])

  if (!popupImage.data) return null

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity style={styles.centeredView} onPress={() => setModalVisible(!modalVisible)} activeOpacity={1}>
          <View className='w-full'>
            <PaddingTop />
            <View className='mt-5 w-full flex-row justify-between px-5'>
              <MasthYellow width={width * 0.2} />
              <FeatherIcon name='x' size={25} color={'white'} onPress={() => setModalVisible(!modalVisible)} />
            </View>
          </View>
          <View>
            <Image source={{ uri: popupImage.data.banner_image }} style={{ width: width * 0.9, height: width * 0.9, borderRadius: 20 }} />
            {popupImage.data.action_link && (
              <View className='mt-7 items-center justify-center'>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className='items-center justify-center bg-accentYellow px-4 py-3 text-white'
                  style={{ minWidth: width * 0.5, borderRadius: 15 }}
                  onPress={() => {
                    Linking.openURL(popupImage.data?.action_link || '')
                    setModalVisible(!modalVisible)
                  }}
                >
                  <Text className='text-lg text-white'>{popupImage.data.button_text || 'Open'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View>
            <View style={{ height: 100 }} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    width: width,
    height: height + 100,
  },
})
