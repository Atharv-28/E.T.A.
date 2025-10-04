import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../styles/GlobalStyles';

// Animated Bounce Button
export const AnimatedButton = ({ children, onPress, style, bounceScale = 0.95 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(bounceScale, {
      duration: 100,
      dampingRatio: 0.8,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      duration: 150,
      dampingRatio: 0.8,
    });
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Fade In Animation
export const FadeInView = ({ children, duration = 600, delay = 0 }) => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration,
      delay,
    });
  }, [opacity, duration, delay]);

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

// Slide In Animation
export const SlideInView = ({ 
  children, 
  direction = 'right', 
  duration = 500, 
  delay = 0,
  distance = 50 
}) => {
  const translateX = useSharedValue(direction === 'right' ? distance : -distance);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    translateX.value = withTiming(0, { duration, delay });
    opacity.value = withTiming(1, { duration, delay });
  }, [translateX, opacity, duration, delay]);

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

// Scale In Animation
export const ScaleInView = ({ children, duration = 400, delay = 0 }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    scale.value = withSpring(1, {
      duration,
      delay,
      dampingRatio: 0.8,
    });
    opacity.value = withTiming(1, {
      duration: duration * 0.8,
      delay,
    });
  }, [scale, opacity, duration, delay]);

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

// Pulse Animation
export const PulseView = ({ children, duration = 1000 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: duration / 2 }),
        withTiming(1, { duration: duration / 2 })
      ),
      -1,
      true
    );
  }, [scale, duration]);

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

// Gradient Card Component
export const GradientCard = ({ 
  children, 
  colors: gradientColors = [colors.cardGradient1Start, colors.cardGradient1End],
  style,
  ...props 
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: 16 }, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

// Gradient Button Component
export const GradientButton = ({ 
  children, 
  onPress,
  colors: gradientColors = [colors.primary, colors.primaryDark],
  style,
  ...props 
}) => {
  return (
    <AnimatedButton onPress={onPress} style={style}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14 }}
        {...props}
      >
        {children}
      </LinearGradient>
    </AnimatedButton>
  );
};

// Shimmer Loading Effect
export const ShimmerView = ({ width, height, style }) => {
  const translateX = useSharedValue(-width);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration: 1000 }),
      -1,
      false
    );
  }, [translateX, width]);

  return (
    <View 
      style={[
        {
          width,
          height,
          backgroundColor: colors.grayLight + '30',
          borderRadius: 8,
          overflow: 'hidden',
        },
        style
      ]}
    >
      <Animated.View
        style={[
          {
            width: width * 0.5,
            height,
            backgroundColor: colors.white + '60',
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

// Floating Action Button with Animation
export const FloatingActionButton = ({ onPress, icon, style }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    onPress && onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <Animated.View style={[animatedStyle]}>
        <GradientCard
          colors={[colors.primary, colors.primaryDark]}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          {icon}
        </GradientCard>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default {
  AnimatedButton,
  FadeInView,
  SlideInView,
  ScaleInView,
  PulseView,
  GradientCard,
  GradientButton,
  ShimmerView,
  FloatingActionButton,
};
