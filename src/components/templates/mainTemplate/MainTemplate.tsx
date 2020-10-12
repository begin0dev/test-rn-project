import * as React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { styles } from './MainTemplate.styles';

interface IProps {
  children: React.ReactNode;
}

function MainTemplate({ children }: IProps) {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={styles.wrapper}>{children}</SafeAreaView>
    </>
  );
}

export default MainTemplate;
