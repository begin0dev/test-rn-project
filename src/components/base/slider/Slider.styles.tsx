import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  dotWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 15,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotSection: {
    width: 14,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 6,
    width: 6,
    height: 6,
  },
  activeDot: {
    borderRadius: 9,
    width: 9,
    height: 9,
  },
});
