import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import SplashScreen from 'react-native-splash-screen';

const RoleScreen = () => {
  const navigation = useNavigation();
  const [pressedButton, setPressedButton] = useState(null);

  const handlePressIn = button => {
    setPressedButton(button);
  };

  const handlePressOut = () => {
    setPressedButton(null);
  };

  return (
    <ImageBackground
      source={require('../assets/fa.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View>
          <Text style={styles.welcomeText}>What's Your Role?</Text>
        </View>
        <View style={styles.buttonscontainer}>
          <TouchableOpacity
            style={[
              styles.button,
              pressedButton === 'button1' && styles.buttonPressed,
            ]}
            onPressIn={() => handlePressIn('button1')}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DrtLogin')}>
            <Text
              style={[
                styles.buttonText,
                pressedButton === 'button1' && styles.buttonPressedText,
              ]}>
              Director
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              pressedButton === 'button2' && styles.buttonPressed,
            ]}
            onPressIn={() => handlePressIn('button2')}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('HodLogin')}>
            <Text
              style={[
                styles.buttonText,
                pressedButton === 'button2' && styles.buttonPressedText,
              ]}>
              HOD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              pressedButton === 'button3' && styles.buttonPressed,
            ]}
            onPressIn={() => handlePressIn('button3')}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('FctLogin')}>
            <Text
              style={[
                styles.buttonText,
                pressedButton === 'button3' && styles.buttonPressedText,
              ]}>
              Faculty
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              pressedButton === 'button4' && styles.buttonPressed,
            ]}
            onPressIn={() => handlePressIn('button4')}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DtcLogin')}>
            <Text
              style={[
                styles.buttonText,
                pressedButton === 'button4' && styles.buttonPressedText,
              ]}>
              Datacell
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Welcome to the Director Dashboard! The Director Dashboard is a
            powerful tool that provides you with valuable insights and control
            over your organization's operations. With this dashboard, you can
            easily monitor key performance indicators, track project progress,
            and make informed decisions to drive your team's success.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 2,
    // borderColor: 'yellow',
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
  },
  headerText: {
    height: 70,
    width: 330,
    marginLeft: 25,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    // fontFamily: 'FuzzyBubbles-Regular',
    textAlign: 'center',
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'black',
  },
  welcomeText: {
    height: 50,
    textAlignVertical: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 120,
    color: 'white',
    textAlign: 'center',
  },
  footerText: {
    color: 'gray',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 60,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    height: 75,
    width: 185,
    borderWidth: 4,
    borderRadius: 20,
    borderColor: 'gray',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  buttonPressed: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
  },
  buttonPressedText: {
    color: 'white',
  },
  buttonscontainer: {
    marginTop: 60,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 30,
    width: 25,
    alignSelf: 'center',
    // borderWidth: 2,
    // borderColor: 'white',
  },
  backIcon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
});

export default RoleScreen;
