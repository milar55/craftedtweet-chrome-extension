import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
}

export const CircularProgress = ({
  progress,
  size = 150,
  strokeWidth = 12,
  color = '#FF9933', // saffron
  backgroundColor = '#FFF8E1', // cardamomCream
  showText = true,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withSpring(circumference * (1 - Math.min(Math.max(progress, 0), 1))),
    };
  });

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {showText && (
        <View className="absolute items-center justify-center">
          <Text className="text-3xl font-poppins-bold text-deepTeal">
            {Math.round(progress * 100)}%
          </Text>
          <Text className="text-xs font-poppins text-deepTeal/60 uppercase tracking-widest">
            Goal
          </Text>
        </View>
      )}
    </View>
  );
};

