import * as React from 'react';
import { useState } from 'react';
import FastImage, { FastImageProps, ImageStyle } from 'react-native-fast-image';

interface IProps extends FastImageProps {
  width: number;
  style?: ImageStyle;
}

function Index({ width, style = {}, source, ...restProps }: IProps) {
  const [height, setHeight] = useState<number>(0);

  const imageSource = () => {
    if (typeof source === 'object' && source.uri) {
      return { uri: `${source.uri}?resize=${width + 20}` };
    }
    return source;
  };

  return (
    <FastImage
      style={[style, { width, height }]}
      {...restProps}
      source={imageSource()}
      resizeMode={FastImage.resizeMode.contain}
      onLoad={({ nativeEvent }) => {
        setHeight((nativeEvent.height / nativeEvent.width) * width);
      }}
    />
  );
}

export default Index;
