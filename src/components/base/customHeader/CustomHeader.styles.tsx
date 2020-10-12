import { StyleSheet } from 'react-native';
import { palette } from '../../../lib/helpers/palette';
import { sizeList } from '../../../lib/helpers/size';

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    height: sizeList.HEADER_HEIGHT,
    backgroundColor: palette.white,
    paddingHorizontal: sizeList.PADDING_HORIZONTAL,
  },
  headerLeft: {
    position: 'relative',
    height: '100%',
    flex: 1,
    maxWidth: '65%',
  },
  logoWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
  },
  searchBarWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    paddingHorizontal: sizeList.PADDING_HORIZONTAL,
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: palette.white,
    zIndex: 300,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 25,
  },
  rightSvg: {
    zIndex: 10,
    marginLeft: 13,
  },
});
