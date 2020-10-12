import { StyleSheet } from 'react-native';

import { palette } from '../../lib/helpers/palette';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    flex: 1,
    backgroundColor: palette.white,
  },
  aniWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.white,
    elevation: 1,
    zIndex: 200,
  },
  tabBarStyle: {
    elevation: 0,
    backgroundColor: palette.white,
  },
  indicatorStyle: {
    backgroundColor: palette.gray9,
  },
  labelStyle: {
    fontWeight: '600',
  },
  scrollTop: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.white,
    elevation: 2,
    shadowColor: palette.gray7,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
