import * as React from 'react';
import { useContext, useRef, useState } from 'react';
import { Dimensions, FlatList, Animated } from 'react-native';

import ProductCard from '../productCard';
import CustomHeaderContext from '../../../lib/contexts/CustomHeaderContext';

const { width } = Dimensions.get('window');

const colCount = width >= 575 ? 3 : 2;

interface IProps {
  isActive: boolean;
  paddingTop: number;
}

function ProductRank({ isActive, paddingTop }: IProps) {
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
      onEndReachedThreshold={2.5}
      scrollEventThrottle={1}
      numColumns={colCount}
    />
  );
}

export default ProductRank;
