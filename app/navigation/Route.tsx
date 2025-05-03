import React from 'react';
import { ThemeContextProvider } from '../constants/ThemeContext';
import StackNavigator from './StackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Route = () => {

	return (
		<SafeAreaProvider>
			<ThemeContextProvider>
				<StackNavigator/>
			</ThemeContextProvider>
		</SafeAreaProvider>
	)
  
}

export default Route;