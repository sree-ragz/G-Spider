import { StatusBar, useColorScheme,
        Platform,UIManager} from 'react-native';
import {SafeAreaProvider,} from 'react-native-safe-area-context';
import Main from './components/Main';

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

StatusBar.setHidden(true);
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Main />
    </SafeAreaProvider>
  );
}

export default App;