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
  const onMomentTimer = useRef<number>(0);
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
  const prevOpenStatus = useRef<boolean>(true);
  const isSwipe = useRef<boolean>(false);

  const [index, setIndex] = useState<IndexNums>(0);

  const syncInActiveTabOffset = () => {
    clearTimeout(animTimer.current);
    const diffClampValue = (diffClampScroll as any).__getValue();

    let addFixOffset = 0;
    if (prevOpenStatus.current && diffClampValue === sizeList.SEARCHBAR_HEIGHT) {
      addFixOffset = sizeList.SEARCHBAR_HEIGHT;
    }
    if (!prevOpenStatus.current && diffClampValue === 0) {
      addFixOffset = -sizeList.SEARCHBAR_HEIGHT;
    }

    if (addFixOffset !== 0) prevOpenStatus.current = !prevOpenStatus.current;

    ([0, 1, 2] as IndexNums[]).forEach((key) => {
      if (key !== index) {
        offsets[key] = Math.max(offsets[key] + addFixOffset, 0);
        lists[key].current?.scrollToOffset({ offset: offsets[key], animated: false });
      }
    });

    isSwipe.current = false;
  };

  const onIndexChange = (nextIndex: number) => {
    if (!isSwipe.current) syncInActiveTabOffset();

    offsetAnimValue.current += offsets[index] - offsets[nextIndex as IndexNums];
    maxPositionOffset.current = offsets[nextIndex as IndexNums];
    scrollAnim.setValue(offsets[nextIndex as IndexNums]);
    offsetAnim.setValue(offsetAnimValue.current);

    setIndex(nextIndex as IndexNums);
  };

  const onSwipeStart = () => {
    isSwipe.current = true;
    syncInActiveTabOffset();
  };

  const changeOffset = (nextOffset: number) => {
    offsets[index] = nextOffset;
    lists[index].current?.scrollToOffset({ offset: offsets[index], animated: true });
  };

  const onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    clearTimeout(animTimer.current);
    clearTimeout(onMomentTimer.current);
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

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;

    onMomentTimer.current = setTimeout(
      (y: number) => {
        offsets[index] = y;
      },
      100,
      offsetY,
    );
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
            onMomentumScrollEnd={onMomentumScrollEnd}
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
            onMomentumScrollEnd={onMomentumScrollEnd}
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
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    scrollAnim.addListener(({ value }) => {
      const offsetY = Math.max(0, value);
      const currentDiff = offsets[index] - offsetY;
      const prevDiff = offsets[index] - maxPositionOffset.current;

      if (Math.abs(currentDiff) >= Math.abs(prevDiff)) {
        maxPositionOffset.current = offsetY;
      } else if (Math.abs(prevDiff) > sizeList.SEARCHBAR_HEIGHT) {
        console.log('값변경', maxPositionOffset.current);
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
        onSwipeStart={onSwipeStart}
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
