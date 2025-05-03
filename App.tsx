import 'react-native-gesture-handler';
import Route from './app/navigation/Route';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'
import store from './app/redux/store';

export default function App() {


  const [loaded] = useFonts({
    PoppinsBold: require('./app/assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('./app/assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsLight : require('./app/assets/fonts/Poppins-Light.ttf'),
    PoppinsMedium : require('./app/assets/fonts/Poppins-Medium.ttf'),
    PoppinsRegular : require('./app/assets/fonts/Poppins-Regular.ttf'),
    PoppinsExtraLight : require('./app/assets/fonts/Poppins-ExtraLight.ttf'),
  });  

  if(!loaded){
    return null;
  }
  return (
    <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
          }}>
            <Provider store={store}>
              <Route/>
            </Provider>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}
