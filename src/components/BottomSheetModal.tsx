import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Modal, PanResponder, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'

const BottomSheet = ({
  visible,
  children,
  onDismiss,
  closeFn,
}: {
  visible: boolean
  children: React.ReactNode
  onDismiss: () => void
  closeFn?: () => void
}) => {
  // const scrollViewRef = useRef(null)
  const [isScrollAtTop, _] = useState(true)
  // const onScroll = (event: {nativeEvent: {contentOffset: {y: any}}}) => {
  //   const offsetY = event.nativeEvent.contentOffset.y
  //   setIsScrollAtTop(offsetY === 0)
  // }

  const screenHeight = Dimensions.get('screen').height
  const panY = useRef(new Animated.Value(screenHeight)).current
  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  })
  const closeAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 500,
    useNativeDriver: false,
  })

  const dismissFunc = useCallback(() => {
    onDismiss()
    if (closeFn) {
      closeFn()
    }
  }, [onDismiss, closeFn])

  const panResponders = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (e, gs) => isScrollAtTop && gs.dy > 0,
    onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
    onPanResponderRelease: (e, gs) => {
      if (gs.dy > 0 && gs.vy > 2) {
        return closeAnim.start(dismissFunc)
      }
      return resetPositionAnim.start()
    },
  })

  useEffect(() => {
    resetPositionAnim.stop()
    closeAnim.stop()
    if (visible) {
      resetPositionAnim.start()
    } else {
      closeAnim.start(dismissFunc)
    }
  }, [closeAnim, dismissFunc, resetPositionAnim, visible])

  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  })

  const backgroundColor = panY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: ['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)'],
  })

  return (
    <Modal animated animationType='fade' visible={visible} transparent onRequestClose={dismissFunc} hardwareAccelerated statusBarTranslucent>
      <TouchableWithoutFeedback onPress={() => closeAnim.start(dismissFunc)}>
        <Animated.View style={[styles.overlay, { backgroundColor }]}>
          <Animated.View style={[styles.container, { top, backgroundColor: 'transparent' }]} {...panResponders.panHandlers}>
            <ScrollView>{children}</ScrollView>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    height: '80%',
  },
})

export default BottomSheet
