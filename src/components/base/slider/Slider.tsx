import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';

import { styles } from './Slider.styles';

interface IProps<I> {
  items: I[];
  duration?: number;
  autoplay?: boolean;
  dotColor?: string;
  showsPagination?: boolean;
  activeDotColor?: string;
  loop?: boolean;
  style?: ViewStyle;
  renderItem: (info: { item: I; index: number }) => React.ReactElement;
  onIndexChanged?: (paging: { currentPage: number; totalPage: number }) => void;
}

const scrollViewProps = {
  bounces: false,
  alwaysBounceHorizontal: false,
  alwaysBounceVertical: false,
  showsHorizontalScrollIndicator: false,
  horizontal: true,
  pagingEnabled: true,
  scrollEventThrottle: 6,
};

function Slider<I>({
  items,
  renderItem,
  style = {},
  showsPagination = false,
  dotColor = '#ced4da',
  activeDotColor = '#f8f9fa',
  duration = 1000 * 3,
  autoplay = false,
  loop = false,
  onIndexChanged = () => {},
}: IProps<I>) {
  const sliderScrollView = useRef<ScrollView>(null);
  const autoplayTimer = useRef<number | null>(null);

  const [realIndex, setRealIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState<number>(0);
  const [scrollItems, setScrollItems] = useState<I[]>([]);
  const [auto, setAuto] = useState<boolean>(loop);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPage: 0,
  });

  const onLayout = (e: LayoutChangeEvent) => {
    if (itemWidth !== 0) return;
    const { width } = e.nativeEvent.layout;
    setItemWidth(width);
    // init 1 page when loop
    if (loop) {
      sliderScrollView.current?.scrollTo({ x: width, animated: false });
      setRealIndex(1);
    }
  };

  const nextPage = useCallback(() => {
    setRealIndex((prev) => prev + 1);
    sliderScrollView.current?.scrollTo({ x: itemWidth * (realIndex + 1), animated: true });
  }, [itemWidth, realIndex]);

  const setNextPage = (currentPage: number) => {
    if (pagination.currentPage === currentPage) return;
    const nextPagination = { ...pagination, currentPage };
    onIndexChanged?.(nextPagination);
    setPagination(nextPagination);
  };

  const normalizePageNumber = (page: number) => {
    const totalCount = items.length;
    if (!loop) return page;
    if (page === 0) return totalCount;
    if (page > totalCount) return 1;
    return page;
  };

  const onScrollBeginDrag = () => {
    if (!loop) return;
    if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    setAuto(false);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { x: currentOffset } = e.nativeEvent.contentOffset;
    const page = Math.round(currentOffset / itemWidth);
    setNextPage(normalizePageNumber(page));
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!loop) return;
    const { x: offsetX } = e.nativeEvent.contentOffset;
    const page = offsetX / itemWidth;

    if (page === 0) {
      sliderScrollView.current?.scrollTo({ x: itemWidth * items.length, animated: false });
    } else if (page === items.length + 1) {
      sliderScrollView.current?.scrollTo({ x: itemWidth, animated: false });
    }
    setRealIndex(normalizePageNumber(page));
    setAuto(true);
  };

  useEffect(() => {
    if (!autoplay || !auto) return;
    autoplayTimer.current = setTimeout(nextPage, duration);
    return () => {
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    };
  }, [autoplay, duration, nextPage, auto]);

  useEffect(() => {
    const totalCount = items.length;
    let addDummyItems = [...items];
    if (loop && totalCount > 1) {
      const dump = [...items];
      addDummyItems.unshift(dump[totalCount - 1]);
      addDummyItems.push(dump[0]);
    }
    setScrollItems(addDummyItems);
    const paging = {
      currentPage: 1,
      totalPage: totalCount,
    };
    setPagination(paging);
    onIndexChanged?.(paging);
  }, [items, loop, onIndexChanged]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={sliderScrollView}
        {...scrollViewProps}
        style={style}
        decelerationRate="fast"
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onScrollEnd}>
        {scrollItems.map((item, index) => (
          <View onLayout={onLayout} key={`scroll_item_${index}`}>
            {renderItem({ item, index })}
          </View>
        ))}
      </ScrollView>
      {showsPagination && (
        <View style={styles.dotWrapper}>
          {items.map((item, index) => (
            <View style={styles.dotSection} key={`dot_${index}`}>
              <View
                style={[
                  pagination.currentPage === index + 1 ? styles.activeDot : styles.dot,
                  {
                    backgroundColor:
                      pagination.currentPage === index + 1 ? activeDotColor : dotColor,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default Slider;
