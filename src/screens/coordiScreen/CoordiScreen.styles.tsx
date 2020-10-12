import { StyleSheet } from 'react-native';

import { palette } from '../../lib/helpers/palette';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    backgroundColor: palette.white,
  },
  freeDeliveryWrapper: {
    overflow: 'hidden',
  },
  descBase: {
    fontSize: 37,
    fontWeight: '200',
    color: palette.gray8,
    paddingBottom: 14,
  },
  allProductText: {
    color: palette.blue,
  },
  lookpinText: {
    fontWeight: 'bold',
    color: palette.gray9,
    paddingBottom: 28,
  },
  bottomWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 40,
  },
  logoImage: {
    width: 105,
  },
});
