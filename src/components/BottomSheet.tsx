import TopBar from '@components/TopBar'
import React, { useCallback, useEffect, useImperativeHandle } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler'
// import { BackHandler } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window')

// export default function TestScreen() {
//   const ref = React.useRef<BottomSheetRefProps>(null)
//   useEffect(() => {
//     ref.current?.open()
//     setTimeout(() => {
//       ref.current?.close()
//     }, 2000)
//   }, [])
//   return (
//     <View className='flex-1 items-center justify-center'>
//       <BottomSheet ref={ref}>
//         <ScrollView>
//           <View style={{ height: 1000, padding: 10 }}>
//             <Text>TestScreen</Text>
//           </View>
//         </ScrollView>
//       </BottomSheet>
//     </View>
//   )
// }

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT - 20

type BottomSheetProps = {
  children?: React.ReactNode
}

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void
  isActive: () => boolean
  open: () => void
  close: () => void
  openFull: () => void
}

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(({ children }, ref) => {
  const translateY = useSharedValue(0)
  const active = useSharedValue(false)

  const scrollTo = useCallback((destination: number) => {
    'worklet'
    active.value = destination !== 0
    translateY.value = withSpring(destination, { damping: 50 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const open = useCallback(() => {
    scrollTo(-(SCREEN_HEIGHT / 2 + 50))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = useCallback(() => {
    scrollTo(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openFull = useCallback(() => {
    scrollTo(MAX_TRANSLATE_Y)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isActive = useCallback(() => {
    return active.value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => ({ scrollTo, isActive, open, close, openFull }), [scrollTo, isActive, open, close, openFull])

  const context = useSharedValue({ y: 0 })
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value }
    })
    .onUpdate((event) => {
      const value = event.translationY + context.value.y
      translateY.value = Math.max(value, MAX_TRANSLATE_Y)
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 2) {
        scrollTo(0)
      } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
        scrollTo(MAX_TRANSLATE_Y)
      }
    })

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(translateY.value, [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y], [25, 10], Extrapolate.CLAMP)
    return { borderRadius, transform: [{ translateY: translateY.value }] }
  })

  const rBackdropStyle = useAnimatedStyle(() => {
    return { opacity: withTiming(active.value ? 1 : 0) }
  }, [])

  const rBackdropProps = useAnimatedProps(() => {
    return { pointerEvents: active.value ? 'auto' : 'none' } as any
  }, [])

  return (
    <>
      <Animated.View
        onTouchStart={() => {
          // Dismiss the BottomSheet
          scrollTo(0)
        }}
        animatedProps={rBackdropProps}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
          rBackdropStyle,
        ]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={{ paddingBottom: 15 }}>
            <TopBar />
          </View>
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  )
})

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT - 20,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT + 100,
    borderRadius: 25,
    paddingTop: 20,
    paddingBottom: 100,
  },
})

export default BottomSheet
