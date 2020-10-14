import * as React from 'react';
import { useContext, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import ProductCard from '../productCard';
import CustomHeaderContext from '../../../lib/contexts/CustomHeaderContext';

const { width } = Dimensions.get('window');

const colCount = width >= 575 ? 3 : 2;

interface IProps {
  isActive: boolean;
  paddingTop: number;
  onScrollBeginDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEndDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

function ProductRank({ isActive, paddingTop, onScrollBeginDrag, onScrollEndDrag }: IProps) {
  const { scrollAnim } = useContext(CustomHeaderContext);

  const flatListEl = useRef<FlatList>(null);

  const [products, setProducts] = useState<{ id: number }[]>(
    Array(200)
      .fill(0)
      .map((zero, id) => ({ id })),
  );

  return (
    <Animated.FlatList
      ref={flatListEl}
      data={products}
      keyExtractor={(item) => `product_${item.id}`}
      renderItem={({ item, index }) => <ProductCard product={item} colCount={2} index={index} />}
      contentContainerStyle={{ paddingTop }}
      showsVerticalScrollIndicator={false}
      onScroll={
        isActive
          ? Animated.event([{ nativeEvent: { contentOffset: { y: scrollAnim } } }], {
              useNativeDriver: true,
            })
          : undefined
      }
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onScrollEndDrag}
      onEndReachedThreshold={2.5}
      numColumns={colCount}
    />
  );
}

export default ProductRank;
