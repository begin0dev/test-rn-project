import * as React from 'react';
import { createContext, useRef } from 'react';
import { Animated } from 'react-native';

import { sizeList } from '../helpers/size';

interface CustomHeaderContextValue {
  scrollAnim: Animated.Value;
  offsetAnim: Animated.Value;
  diffClampScroll: Animated.AnimatedAddition;
}

const CustomHeaderContext = createContext<CustomHeaderContextValue>({
  scrollAnim: new Animated.Value(0),
  offsetAnim: new Animated.Value(0),
  diffClampScroll: Animated.diffClamp(new Animated.Value(0), 0, 0),
});

export const CustomHeaderProvider: React.FC = ({ children }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;

  const diffClampScroll = useRef(
    Animated.diffClamp(
      Animated.add(
        scrollAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolateLeft: 'clamp',
        }),
        offsetAnim,
      ),
      0,
      sizeList.SEARCHBAR_HEIGHT,
    ),
  ).current;

  return (
    <CustomHeaderContext.Provider value={{ scrollAnim, offsetAnim, diffClampScroll }}>
      {children}
    </CustomHeaderContext.Provider>
  );
};

export default CustomHeaderContext;
