import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import SplashScreen from 'react-native-splash-screen';

const HodScreen01 = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    ToastAndroid.show('Logged Out!', ToastAndroid.SHORT);
    navigation.navigate('HodLogin');
  };

  return (
    <ImageBackground
      source={require('../../assets/hod_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
            <Image
              source={require('../../assets/logout2.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.welcomeText}>Welcome Dr Munir !</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.buttonscontainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HodScreen02')}>
            <Text style={styles.buttonText}>Faculty{'\n'}Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HodScreen03')}>
            <Text style={styles.buttonText}>Course{'\n'}Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HodScreen08')}>
            <Text style={styles.buttonText}>Assign{'\n'}Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HodScreen09')}>
            <Text style={styles.buttonText}>Assign{'\n'}Role</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HodScreen10')}>
            <Text style={styles.buttonText}>Manage{'\n'}CLOS Grid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HodScreen11')}>
            <Text style={styles.buttonText}>Manage{'\n'}Difficulty</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HodScreen12')}>
            <Text style={styles.buttonText}>Manage{'\n'}Session</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
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
    height: 70,
    textAlignVertical: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 20,
    color: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
  },
  button: {
    backgroundColor: '#00DDDD',
    padding: 10,
    height: 105,
    width: 185,
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
  },
  buttonscontainer: {
    marginTop: 30,
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

export default HodScreen01;
