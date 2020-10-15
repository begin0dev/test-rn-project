import * as React from 'react';
import { useContext, useRef, useState, forwardRef } from 'react';
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

const ProductRank = forwardRef<FlatList, IProps>(
  ({ isActive, paddingTop, onScrollBeginDrag, onScrollEndDrag }, ref) => {
    const { scrollAnim } = useContext(CustomHeaderContext);

    // const flatListEl = useRef<FlatList>(null);

    const [products, setProducts] = useState<{ id: number }[]>(
      Array(200)
        .fill(0)
        .map((zero, id) => ({ id })),
    );

    return (
      <Animated.FlatList
        ref={ref}
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
        onMomentumScrollBegin={onScrollBeginDrag}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={8}
        onEndReachedThreshold={2.5}
        numColumns={colCount}
      />
    );
  },
);

export default ProductRank;
