import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ip, faculty_port} from '../CONFIG';
// import SplashScreen from 'react-native-splash-screen';

const FctLogin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const DismissKeyboard = ({children}) => {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    );
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://${ip}:${faculty_port}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error('Invalid username or password');
      }
      const data = await response.json();
      if (!data.user || !data.user.f_id) {
        throw new Error('Invalid user data received');
      }
      navigation.navigate('FctScreen01', {facultyId: data.user.f_id});
      setUsername('');
      setPassword('');
    } catch (error) {
      // console.error('Login failed:', error.message);
      ToastAndroid.show('Invalid Username or Password!', ToastAndroid.SHORT);
    }
  };

  const handleLogin2 = () => {
    if (username === '' && password === '') {
      // console.log('Login Successful!');
      navigation.navigate('FctScreen01', {facultyId: 2});
      //   navigation.navigate('FctScreen01');
      setUsername('');
      setPassword('');
    } else {
      ToastAndroid.show('Invalid Username or Password!', ToastAndroid.SHORT);
    }
  };

  return (
    // <DismissKeyboard>
    <ImageBackground
      source={require('../../assets/fct_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.form}>
          <DismissKeyboard>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </DismissKeyboard>
          <View>
            <Text style={styles.welcomeText}>LOGIN</Text>
          </View>
          <View style={styles.buttonscontainer}>
            <TextInput
              style={styles.input}
              value={username}
              placeholder="Username"
              placeholderTextColor={'black'}
              onChangeText={text => setUsername(text)}
            />
            <TextInput
              style={styles.input}
              value={password}
              placeholder="********"
              placeholderTextColor={'black'}
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <View style={styles.buttonscontainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin2}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
    // </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'black',
  },
  form: {
    flex: 1,
    marginTop: 120,
  },
  header: {
    flexDirection: 'row',
  },
  headerText: {
    height: 70,
    width: 330,
    marginLeft: 30,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    // fontFamily: 'FuzzyBubbles-Regular',
    textAlign: 'center',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
  },
  input: {
    height: 41,
    width: 340,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 20,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    color: 'black',
  },
  welcomeText: {
    height: 70,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'georgia',
    color: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
  },
  button: {
    backgroundColor: '#58FFAB',
    padding: 10,
    height: 50,
    width: 130,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
  },
  buttonscontainer: {
    marginTop: 50,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    justifyContent: 'center',
    borderRadius: 13,
    // borderWidth: 2,
    // borderColor: 'black',
  },
  backIcon: {
    borderRadius: 100,
    height: 140,
    width: 140,
    borderWidth: 3,
    borderColor: 'black',
    alignSelf: 'center',
  },
});

export default FctLogin;
