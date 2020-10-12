import { StyleSheet } from 'react-native';

import { palette } from '../../../lib/helpers/palette';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: palette.gray6,
  },
  firstChild: {
    marginLeft: 18,
  },
  child: {
    marginRight: 18,
  },
});
