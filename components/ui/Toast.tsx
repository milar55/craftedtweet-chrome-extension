import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onHide: () => void;
  visible: boolean;
}

export const Toast = ({ message, type = 'success', onHide, visible }: ToastProps) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(50);
      opacity.value = withTiming(1, { duration: 300 });

      // Auto-hide after 3 seconds
      const timeout = setTimeout(() => {
        hide();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const hide = () => {
    translateY.value = withTiming(-100, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onHide)();
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-mintChutney';
      case 'error':
        return 'bg-chilliRed';
      case 'info':
        return 'bg-deepTeal';
      default:
        return 'bg-deepTeal';
    }
  };

  if (!visible) return null;

  return (
    <View className="absolute top-0 left-0 right-0 items-center z-50">
      <Animated.View
        style={animatedStyle}
        className={`
          px-6 py-3 rounded-full flex-row items-center
          ${getBackgroundColor()}
          shadow-lg shadow-black/20
        `}
      >
        <Text className="text-white font-poppins-semibold text-center">
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};

