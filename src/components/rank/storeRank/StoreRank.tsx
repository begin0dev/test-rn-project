import * as React from 'react';
import { useState, useContext, forwardRef } from 'react';
import { FlatList, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import StoreCard from '../storeCard';
import CustomHeaderContext from '../../../lib/contexts/CustomHeaderContext';
import { sizeList } from '../../../lib/helpers/size';

interface IProps {
  isActive: boolean;
  storeGroup: 'default' | 'brand';
  onScrollBeginDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEndDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const paddingTop = sizeList.SEARCHBAR_HEIGHT + sizeList.TABBAR_HEIGHT;

const StoreRank = forwardRef<FlatList, IProps>(
  ({ isActive, storeGroup, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd }, ref) => {
    const { scrollAnim } = useContext(CustomHeaderContext);

    const [stores, setStores] = useState<{ id: number }[]>(
      Array(200)
        .fill(0)
        .map((zero, id) => ({ id })),
    );

    return (
      <Animated.FlatList
        ref={ref}
        data={stores}
        keyExtractor={(item) => `${storeGroup}_${item.id}`}
        renderItem={({ item }) => <StoreCard store={item} />}
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
      />
    );
  },
);

export default StoreRank;
