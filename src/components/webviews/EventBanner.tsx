import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import { InitNavigation } from '../../navigations/InitNavigation';
import { RootState } from '../../store/modules';
import { version } from '../../../package.json';
import { palette } from '../../lib/helpers/palette';

const { OS } = Platform;
const uuid = DeviceInfo.getUniqueId();

type UseNavigationProp = StackNavigationProp<InitNavigation>;

function EventBanner() {
  const nav = useNavigation<UseNavigationProp>();
  const {
    params: { uri, title = '이벤트' },
  } = useRoute<RouteProp<InitNavigation, 'EventWebview'>>();

  const webViewEl = useRef<WebView>(null);

  const gender = useSelector((state: RootState) => state.auth.gender);
  const token = useSelector((state: RootState) => state.auth.token);

  const INJECTED_JAVASCRIPT = `(function() {
    window.setAuthToken && window.setAuthToken('user', '${token}', '${uuid}');
  })();`;

  useEffect(() => {
    nav.setOptions({
      title,
      headerBackTitleVisible: false,
      headerTintColor: palette.gray9,
    });
  }, [nav, title]);

  return (
    <WebView
      ref={webViewEl}
      source={{ uri: `${uri}?platform=${OS}&gender_id=${gender}&app_version=${version}` }}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      onLoadEnd={() => webViewEl.current?.injectJavaScript(INJECTED_JAVASCRIPT)}
    />
  );
}

export default EventBanner;
