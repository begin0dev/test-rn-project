import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CoordiSvg from '../assets/svgs/coordi_icon.svg';
import MyPageSvg from '../assets/svgs/my_page_icon.svg';
import RankSvg from '../assets/svgs/rank_icon.svg';
import SaleSvg from '../assets/svgs/sale_icon.svg';
import TodaySvg from '../assets/svgs/today_icon.svg';
import CustomTabBarItem from '../components/base/customTabBarItem';
import { CoordiScreen, RankScreen } from '../screens';
import { palette } from '../lib/helpers/palette';
import { sizeList } from '../lib/helpers/size';

export type HomeNavigationNames = 'Rank' | 'Today' | 'Coordi' | 'Sale' | 'MyPage';
export type HomeNavigation = Record<HomeNavigationNames, undefined>;

const Tab = createBottomTabNavigator<HomeNavigation>();

function HomeNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Rank"
      tabBarOptions={{
        activeTintColor: palette.gray9,
        inactiveTintColor: palette.gray5,
        style: { height: sizeList.TABBAR_HEIGHT },
        labelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="Rank"
        component={RankScreen}
        options={{
          tabBarLabel: '랭킹',
          tabBarIcon: ({ color }) => <RankSvg color={color} />,
          tabBarButton: CustomTabBarItem,
        }}
      />
      <Tab.Screen
        name="Today"
        component={CoordiScreen}
        options={{
          tabBarLabel: '오늘룩핀',
          tabBarIcon: ({ color }) => <TodaySvg color={color} />,
          tabBarButton: CustomTabBarItem,
        }}
      />
      <Tab.Screen
        name="Coordi"
        component={CoordiScreen}
        options={{
          tabBarLabel: '코디',
          tabBarIcon: ({ color }) => <CoordiSvg color={color} />,
          tabBarButton: CustomTabBarItem,
        }}
      />
      <Tab.Screen
        name="Sale"
        component={CoordiScreen}
        options={{
          tabBarLabel: '세일',
          tabBarIcon: ({ color }) => <SaleSvg color={color} />,
          tabBarButton: CustomTabBarItem,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={CoordiScreen}
        options={{
          tabBarLabel: 'MY룩핀',
          tabBarIcon: ({ color }) => <MyPageSvg color={color} />,
          tabBarButton: CustomTabBarItem,
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeNavigation;
