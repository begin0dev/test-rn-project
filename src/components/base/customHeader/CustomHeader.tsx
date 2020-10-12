import * as React from 'react';
import { useContext, useState, useRef } from 'react';
import { View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { styles } from './CustomHeader.styles';
import { palette } from '../../../lib/helpers/palette';
import { sizeList } from '../../../lib/helpers/size';
import BellSvg from '../../../assets/svgs/bell.svg';
import CartSvg from '../../../assets/svgs/cart.svg';
import AutoHeightFastImage from '../autoHeightFastImage';
import SearchTextBox from '../searchTextBox';
import { InitNavigation } from '../../../navigations/InitNavigation';
import CustomHeaderContext from '../../../lib/contexts/CustomHeaderContext';

const { width } = Dimensions.get('window');

function CustomHeader() {
  const { diffClampScroll } = useContext(CustomHeaderContext);

  const [searchBarHeight, setSearchBarHeight] = useState(0);

  const route = useRoute<RouteProp<InitNavigation, 'HomeScreen'>>();
  const tabName = getFocusedRouteNameFromRoute(route) || 'Rank';

  const translateX = useRef(
    diffClampScroll.interpolate({
      inputRange: [0, sizeList.SEARCHBAR_HEIGHT],
      outputRange: [0, -Math.floor((width - width * 0.8) / 2)],
      extrapolate: 'clamp',
    }),
  ).current;

  const translateY = useRef(
    diffClampScroll.interpolate({
      inputRange: [0, sizeList.SEARCHBAR_HEIGHT],
      outputRange: [
        sizeList.HEADER_HEIGHT,
        Math.floor((searchBarHeight - searchBarHeight * 0.8) / 2),
      ],
      extrapolate: 'clamp',
    }),
  ).current;

  const scaleX = useRef(
    diffClampScroll.interpolate({
      inputRange: [0, sizeList.SEARCHBAR_HEIGHT],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    }),
  ).current;

  const scaleY = useRef(
    diffClampScroll.interpolate({
      inputRange: [0, sizeList.SEARCHBAR_HEIGHT],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    }),
  ).current;

  const opacity = useRef(
    diffClampScroll.interpolate({
      inputRange: [0, sizeList.SEARCHBAR_HEIGHT - 20],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  ).current;

  return (
    <View style={styles.wrapper}>
      {tabName === 'Rank' && (
        <>
          <View style={styles.headerLeft}>
            <Animated.View style={[styles.logoWrapper, { opacity }]}>
              <AutoHeightFastImage
                width={120}
                source={require('../../../assets/images/lookpin_text_image.png')}
              />
            </Animated.View>
          </View>
          <Animated.View
            style={[
              styles.searchBarWrapper,
              { transform: [{ translateX }, { translateY }, { scaleX }, { scaleY }] },
            ]}>
            <SearchTextBox
              onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
              placeholder="검색어를 입력해 주세요"
              style={styles.searchBar}
              editable={false}
            />
          </Animated.View>
        </>
      )}
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.rightSvg}>
          <CartSvg height={24} width={24} color={palette.gray9} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightSvg}>
          <BellSvg height={26} width={26} color={palette.gray9} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomHeader;
