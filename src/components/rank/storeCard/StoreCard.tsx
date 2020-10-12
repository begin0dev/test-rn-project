import * as React from 'react';
import { memo } from 'react';
import { Text, View } from 'react-native';

import { styles } from './StoreCard.styles';

interface IProps {
  store: { id: number };
}

const StoreCard: React.FC<IProps> = memo(({ store }) => {
  return (
    <View style={[styles.wrapper]}>
      <Text>{store.id}</Text>
    </View>
  );
});

export default StoreCard;
