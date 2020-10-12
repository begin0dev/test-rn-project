import * as React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';

import SearchSvg from '../../../assets/svgs/search.svg';
import { palette } from '../../../lib/helpers/palette';
import { styles } from './SearchTextBox.styles';

interface IProps extends TextInputProps {
  fontSize?: number;
  fontColor?: string;
  borderColor?: string;
  onPress?: () => void;
}

function SearchTextBox({
  fontSize = 15,
  fontColor = palette.gray7,
  borderColor = palette.gray6,
  onPress,
  style,
  ...restProps
}: IProps) {
  return (
    <View style={[styles.wrapper, { borderColor }, style]}>
      <SearchSvg height={fontSize + 5} width={fontSize + 5} color={fontColor} onPress={onPress} />
      <TextInput style={[styles.textInput, { fontSize }]} {...restProps} />
    </View>
  );
}

export default SearchTextBox;
