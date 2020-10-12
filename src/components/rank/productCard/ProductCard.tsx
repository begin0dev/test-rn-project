import * as React from 'react';
import { memo } from 'react';
import { Dimensions, Text, View } from 'react-native';

import { styles } from './ProductCard.styles';

const { width } = Dimensions.get('window');

interface IProps {
  product: { id: number };
  colCount: number;
  index: number;
}

const ProductCard: React.FC<IProps> = memo(({ product, colCount, index }) => {
  const cardWidth = (width - 18 * (colCount + 1)) / colCount;
  const height = cardWidth * 1.2;

  return (
    <View
      style={[
        styles.wrapper,
        { height },
        styles.child,
        index % colCount === 0 && styles.firstChild,
      ]}>
      <Text>{product.id}</Text>
    </View>
  );
});

export default ProductCard;
