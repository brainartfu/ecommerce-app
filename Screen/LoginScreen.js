import React, {useState, createRef} from 'react';
import {
	StyleSheet,
	TextInput,
	View,
	Text,
	ScrollView,
	Image,
	Keyboard,
	TouchableOpacity,
	KeyboardAvoidingView
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Loader from './Components/Loader';

const LoginScreen = ({navigation}) => {
	const [userEmail, setUserEmail] = useState('');
	const [userPassword, setUserPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorText, setErrorText] = useState('');

	const passwordInputRef = createRef();

	const handleSubmit = () => {
		setErrorText('');
		if (!userEmail) {
			alert('Please fill Email');
			return;
		}
		if (!userPassword) {
			alert('Please fill Password');
			return;
		}
		setLoading(true);
		let dataToSend = {email: userEmail, password: userPassword};
		let formBody = [];
		for (let key in dataToSend) {
			let encodedKey = encodeURIComponent(key);
			let encodedValue = encodeURIComponent(dataToSend[key]);
			formBody.push(encodedKey+'='+encodedValue);
		}
		formBody = formBody.join('&');
		fetch('http://localhost:3000/api/user/login', {
			method: 'POST',
			body: formBody,
			header: {
				'Content-Type': 'application/x-www-from-urlencoded;charset=UTR-8'
			}
		}).then((response) => response.json())
		.then((responseJson) => {
			setLoading(false);
			console.log(responseJson);
			if (responseJson.status === 'success') {
				AsyncStorage.setItem('user_id', responseJson.data.email);
				console.log(responseJson.data.email);
				navigation.replace('DrawerNavigationRoutes');
			} else {
				setErrorText(responseJson.msg);
				console.log('Please check your email id or password');
			}
		}).catch((error) => {
			setLoading(false);
			console.log(error);
		})
	}

	return (
		<View style={styles.mainBody}>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{
					flex: 1,
					justifyContent: 'center',
					alignContent: 'center'
				}}>
				<View>
					<KeyboardAvoidingView enabled>
						<View style={{alignItems:'center'}}>
							<Image
								source={require('../Image/aboutreact.png')}
								style={{
									width: '50%',
									height: 100,
									resizeMode: 'contain',
									margin: 30
								}}
							/>
						</View>
						<View style={styles.sectionStyle}>
							<TextInput
								style={styles.inputStyle}
								onChangeText={(UserEmail) => setUserEmail(UserEmail)}
								placeholder="Enter Email"
								placeholderTextColor='#8b9cb5'
								autoCapitalize='none'
								keyboardType='email-address'
								returnKeyType='next'
								onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
								userlineColorAndroid="#f000"
								blurOnSubmit={false}
							/>
						</View>
						<View style={styles.sectionStyle}>
							<TextInput
								style={styles.inputStyle}
								onChangeText={(UserPassword) => setUserPassword(UserPassword)}
								placeholder="Enter Password"
								placeholderTextColor='#8b9cb5'
								keyboardType='default'
								ref={passwordInputRef}
								onSubmitEditing={Keyboard.dismiss}
								blurOnSubmit={false}
								secureTextEntry={true}
								userlineColorAndroid="#f000"
								returnKeyType="next"
						</View>
						{errorText != ''? (
							<Text style={styles.errorTextStyle}>
								{errorText}
							</Text>
						): null}
						<TouchableOpacity
							style={styles.buttonStyle}
							activeOpacity={0.5}
							onPress={handleSubmitPress}>
							<Text style={styles.buttonTextStyle}>LOGIN</Text>
						</TouchableOpacity>
						<Text
							style={styles.registerTextStyle}
							onPress={() => {
								navigation.navigate('RegisterScreen')
							}}>
							New Here? Register
						</Text>
					</KeyboardAvoidingView>
				</View>
			</ScrollView>
		</View>
	)
}

export default LoginScreen;

const styles = StyleSheet.create({
	mainBody: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#307ecc',
		alignContent: 'center'
	},
	sectionStyle: {
		flexDirection: 'row',
		height: 40,
		marginTop: 20,
		marginLeft: 35,
		marginRight; 35,
		margin: 10
	},
	buttonStyle: {
		backgroundColor: '#7DE24E',
		borderWidth: 0,
		color: '#FFFFFF',
		borderColor; '#7DE24E',
		height: 40,
		alignItems: 'center',
		borderRadius: 30,
		marginLeft: 35,
		marginRight: 35,
		marginTop: ,
		marginBottom: 25
	},
	buttonTextStyle: {
		color: "#FFFFFF",
		paddigVertical: 10,
		fontSize: 16
	},
	inputStyle: {
		flex: 1,
		color: 'white',
		paddingLeft: 15,
		paddingRight: 15,
		borderWidth: 1,
		borderRadius: 30,
		borderColor: '#dadae8'
	},
	registerTextStyle: {
		color: '#FFFFFF',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 14,
		alginSelf: 'center',
		paddig: 10
	},
	errorTextStyle: {
		color: 'red',
		textAlign: 'center',
		fontSize: 14,
	}
})