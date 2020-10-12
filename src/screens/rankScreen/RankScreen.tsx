import * as React from 'react';
import { useState, useContext, useRef } from 'react';
import { View, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');

const TABBAR_HEIGHT = 47;
const PADDING_TOP = sizeList.SEARCHBAR_HEIGHT + TABBAR_HEIGHT;

function RankScreen() {
  const { diffClampScroll } = useContext(CustomHeaderContext);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(
    diffClampScroll.interpolate({
      inputRange: [0, sizeList.SEARCHBAR_HEIGHT],
      outputRange: [0, -sizeList.SEARCHBAR_HEIGHT],
      extrapolate: 'clamp',
    }),
  ).current;

  const [index, setIndex] = useState<IndexNums>(0);

  const renderScene = ({ route }: { route: { key: string; title: string } }) => {
    switch (route.key) {
      case 'product':
        return <ProductRank isActive={index === 0} paddingTop={PADDING_TOP} />;
      case 'store':
        return <StoreRank storeGroup="default" isActive={index === 1} paddingTop={PADDING_TOP} />;
      case 'brand':
        return <StoreRank storeGroup="brand" isActive={index === 2} paddingTop={PADDING_TOP} />;
      default:
        return null;
    }
  };

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
                { height: TABBAR_HEIGHT, marginTop: sizeList.SEARCHBAR_HEIGHT },
              ]}
              labelStyle={styles.labelStyle}
              pressOpacity={1}
            />
          </Animated.View>
        )}
        initialLayout={{ width }}
        onIndexChange={setIndex}
        navigationState={{ index, routes }}
        swipeEnabled
        lazyPreloadDistance={1}
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
