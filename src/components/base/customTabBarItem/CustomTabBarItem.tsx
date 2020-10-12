import * as React from 'react';
import { useRef } from 'react';
import { TouchableWithoutFeedback, Animated, GestureResponderEvent } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import { styles } from './CustomTabBarItem.styles';

function CustomTabBarItem({ children, onPress, ...restProps }: BottomTabBarButtonProps) {
  const btnScale = useRef(new Animated.Value(1)).current;

  const addAnimationOnPress = (e: GestureResponderEvent) => {
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.(e);
  };

  return (
    <TouchableWithoutFeedback onPress={addAnimationOnPress} {...restProps}>
      <Animated.View style={[styles.wrapper, { transform: [{ scale: btnScale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default CustomTabBarItem;
