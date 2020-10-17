import * as React from 'react';
import { useContext, useState, forwardRef } from 'react';
import {
  Dimensions,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import ProductCard from '../productCard';
import CustomHeaderContext from '../../../lib/contexts/CustomHeaderContext';
import { sizeList } from '../../../lib/helpers/size';

const { width } = Dimensions.get('window');

const paddingTop = sizeList.SEARCHBAR_HEIGHT + sizeList.TABBAR_HEIGHT;
const colCount = width >= 575 ? 3 : 2;

interface IProps {
  isActive: boolean;
  onScrollBeginDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEndDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const ProductRank = forwardRef<FlatList, IProps>(
  ({ isActive, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd }, ref) => {
    const { scrollAnim } = useContext(CustomHeaderContext);

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
        onScroll={
          isActive
            ? Animated.event([{ nativeEvent: { contentOffset: { y: scrollAnim } } }], {
                useNativeDriver: true,
              })
            : undefined
        }
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onEndReachedThreshold={2.5}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        numColumns={colCount}
      />
    );
  },
);

export default ProductRank;
