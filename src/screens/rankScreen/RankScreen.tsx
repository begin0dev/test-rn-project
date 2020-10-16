import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

import { styles } from './RankScreen.styles';
import { palette } from '../../lib/helpers/palette';
import { sizeList } from '../../lib/helpers/size';
import ProductRank from '../../components/rank/productRank';
import StoreRank from '../../components/rank/storeRank';
import ChevronUp from '../../assets/svgs/chevron-up.svg';
import CustomHeaderContext from '../../lib/contexts/CustomHeaderContext';

type IndexNums = 0 | 1 | 2;

const routes = [
  { title: '상품', key: 'product' },
  { title: '스토어', key: 'store' },
  { title: '브랜드', key: 'brand' },
];

const { width, height } = Dimensions.get('window');

function RankScreen() {
  const { scrollAnim, offsetAnim, diffClampScroll } = useContext(CustomHeaderContext);

  const translateY = useRef(
    diffClampScroll.interpolate({
      inputRange: [0, sizeList.SEARCHBAR_HEIGHT],
      outputRange: [0, -sizeList.SEARCHBAR_HEIGHT],
      extrapolate: 'clamp',
    }),
  ).current;

  const opacity = useRef(
    scrollAnim.interpolate({
      inputRange: [height * 2 - 0.1, height * 2],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  ).current;

  const productListEl = useRef<FlatList>(null);
  const storeListEl = useRef<FlatList>(null);
  const brandListEl = useRef<FlatList>(null);

  const animTimer = useRef<number>(0);
  const offsets = useRef({
    0: 0,
    1: 0,
    2: 0,
  }).current;
  const lists = useRef({
    0: productListEl,
    1: storeListEl,
    2: brandListEl,
  }).current;

  const offsetAnimValue = useRef<number>(0);
  const maxPositionOffset = useRef<number>(0);

  const [index, setIndex] = useState<IndexNums>(0);

  const onIndexChange = (nextIndex: number) => {
    setIndex(nextIndex as IndexNums);
  };

  const changeOffset = (nextOffset: number) => {
    lists[index].current?.scrollToOffset({ offset: offsets[index], animated: true });
    offsets[index] = nextOffset;
  };

  const onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    clearTimeout(animTimer.current);
    offsets[index] = Math.max(0, e.nativeEvent.contentOffset.y);
  };

  const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    clearTimeout(animTimer.current);

    const offsetY = Math.max(0, e.nativeEvent.contentOffset.y);
    if (offsetY === offsets[index]) return;

    const diff = offsetY - offsets[index];
    if (Math.abs(diff) > sizeList.SEARCHBAR_HEIGHT) {
      offsets[index] = offsetY;
      return;
    }

    const diffClampValue = (diffClampScroll as any).__getValue();
    const addOffset = diff > 0 ? sizeList.SEARCHBAR_HEIGHT : -sizeList.SEARCHBAR_HEIGHT;
    if (
      (diffClampValue === 0 && diff < 0) ||
      (diffClampValue === sizeList.SEARCHBAR_HEIGHT && diff > 0)
    ) {
      offsets[index] = offsetY;
      offsetAnimValue.current += addOffset;
      offsetAnim.setValue(offsetAnimValue.current);
      return;
    }

    let nextOffset = offsets[index];
    if (Math.abs(diff) > sizeList.SEARCHBAR_HEIGHT / 3) nextOffset += addOffset;

    animTimer.current = setTimeout(changeOffset, 150, nextOffset);
  };

  const renderScene = ({ route }: { route: { key: string; title: string } }) => {
    switch (route.key) {
      case 'product':
        return (
          <ProductRank
            ref={productListEl}
            isActive={index === 0}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
          />
        );
      case 'store':
        return (
          <StoreRank
            ref={storeListEl}
            storeGroup="default"
            isActive={index === 1}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
          />
        );
      case 'brand':
        return (
          <StoreRank
            ref={brandListEl}
            storeGroup="brand"
            isActive={index === 2}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    scrollAnim.addListener(({ value }) => {
      if (value < 0) return;

      const currentDiff = offsets[index] - value;
      const prevDiff = offsets[index] - maxPositionOffset.current;

      if (Math.abs(currentDiff) >= Math.abs(prevDiff)) {
        maxPositionOffset.current = value;
      } else if (Math.abs(prevDiff) > sizeList.SEARCHBAR_HEIGHT) {
        offsets[index] = maxPositionOffset.current;
      }
    });
    return () => {
      scrollAnim.removeAllListeners();
    };
  }, [index, offsets, scrollAnim]);

  return (
    <View style={styles.wrapper}>
      <TabView
        renderScene={renderScene}
        renderTabBar={(props) => (
          <Animated.View style={[styles.aniWrapper, { transform: [{ translateY }] }]}>
            <TabBar
              {...props}
              activeColor={palette.gray9}
              inactiveColor={palette.gray6}
              indicatorStyle={styles.indicatorStyle}
              style={[
                styles.tabBarStyle,
                { height: sizeList.TABBAR_HEIGHT, marginTop: sizeList.SEARCHBAR_HEIGHT },
              ]}
              labelStyle={styles.labelStyle}
              pressOpacity={1}
            />
          </Animated.View>
        )}
        initialLayout={{ width }}
        onIndexChange={onIndexChange}
        onSwipeStart={() => console.log((diffClampScroll as any).__getValue())}
        navigationState={{ index, routes }}
        lazyPreloadDistance={1}
        swipeEnabled
        lazy
      />
      <TouchableWithoutFeedback>
        <Animated.View style={[styles.scrollTop, { opacity }]}>
          <ChevronUp width={22} height={22} color={palette.gray9} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default RankScreen;
