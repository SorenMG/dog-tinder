import React, { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import 'react-native-url-polyfill/auto';

import { NavigationContainer } from '@react-navigation/native';

import Main from './MainStack';
import Auth from './AuthStack';
import Loading from '../screens/utils/Loading';

// This is the global navigation stack. So if we are logged in, we load the Main, if we are logged out we load Auth
export default () => {
	const auth = useContext(AuthContext);
	const user = auth.user;
	return (
		<NavigationContainer>
			{user == null && <Loading />}
			{user == false && <Auth />}
			{user == true && <Main />}
		</NavigationContainer>
	);
};
