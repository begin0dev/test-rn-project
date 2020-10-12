import * as React from 'react';
import { useState, useRef, useContext } from 'react';
import { FlatList, Animated } from 'react-native';

import StoreCard from '../storeCard';
import CustomHeaderContext from '../../../lib/contexts/CustomHeaderContext';

interface IProps {
  isActive: boolean;
  storeGroup: 'default' | 'brand';
  paddingTop: number;
}

function StoreRank({ isActive, storeGroup, paddingTop }: IProps) {
  const { scrollAnim } = useContext(CustomHeaderContext);
  const flatListEl = useRef<FlatList>(null);

  const [stores, setStores] = useState<{ id: number }[]>(
    Array(200)
      .fill(0)
      .map((zero, id) => ({ id })),
  );

  return (
    <Animated.FlatList
      ref={flatListEl}
      data={stores}
      keyExtractor={(item) => `${storeGroup}_${item.id}`}
      renderItem={({ item }) => <StoreCard store={item} />}
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
    />
  );
}

export default StoreRank;
