import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Keyboard,
  TextInput,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const HodScreen11 = () => {
  const navigation = useNavigation();
  const [easy, setEasy] = useState('');
  const [medium, setMedium] = useState('');
  const [hard, setHard] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    fetchDifficulty();
  }, []);

  const fetchDifficulty = () => {
    const apiEndpoint = `http://${ip}:${port}/getdifficulty`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        if (Array.isArray(data) && data.length >= 3) {
          setEasy(data[0].number.toString());
          setMedium(data[1].number.toString());
          setHard(data[2].number.toString());
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const updateDifficulty = () => {
    if (easy.trim() === '' || medium.trim() === '' || hard.trim() === '') {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    const isInteger = value => Number.isInteger(Number(value));
    // Method 2 -- const isInteger = value => /^\d+$/.test(value);
    if (!isInteger(easy) || !isInteger(medium) || !isInteger(hard)) {
      ToastAndroid.show('All fields must be integers.', ToastAndroid.SHORT);
      return;
    }
    const apiEndpoint = `http://${ip}:${port}/savedifficulty`;
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        easy: easy,
        medium: medium,
        hard: hard,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data posted successfully:', data);
        ToastAndroid.show('Updated Successfully !', ToastAndroid.SHORT);
        Keyboard.dismiss();
        fetchDifficulty();
        setIsChanged(false); // Reset change flag after successful update
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleInputChange = (setter, value) => {
    setter(value);
    setIsChanged(true);
  };

  return (
    <ImageBackground
      source={require('../../assets/hod_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('HodScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Manage Difficulty</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>EASY</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label2}>Number of Easy Questions</Text>
            <TextInput
              style={styles.input}
              value={easy}
              placeholderTextColor={'gray'}
              onChangeText={value => handleInputChange(setEasy, value)}
            />
          </View>
          <Text style={styles.label}>MEDIUM</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label2}>Number of Medium Questions</Text>
            <TextInput
              style={styles.input}
              value={medium}
              placeholderTextColor={'gray'}
              onChangeText={value => handleInputChange(setMedium, value)}
            />
          </View>
          <Text style={styles.label}>HARD</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label2}>Number of Hard Questions</Text>
            <TextInput
              style={styles.input}
              value={hard}
              placeholderTextColor={'gray'}
              onChangeText={value => handleInputChange(setHard, value)}
            />
          </View>
          {isChanged && (
            <TouchableOpacity style={styles.button} onPress={updateDifficulty}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'blue',
    borderWidth: 2,
    borderColor: 'black',
    // justifyContent: 'center',
    // backgroundColor: 'white',
  },
  form: {
    flex: 1,
    marginTop: 50,
    // backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    // borderWidth: 2,
    // borderColor: 'red',
    // alignItems: 'center',
  },
  headerText: {
    // backgroundColor: '#00E9CC',
    height: 70,
    width: 320,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'red'
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
  },
  label: {
    fontSize: 25,
    marginBottom: 10,
    marginLeft: 10,
    color: 'white',
  },
  label2: {
    fontSize: 20,
    marginBottom: 8,
    marginTop: 5,
    marginLeft: 20,
    color: 'white',
    width: 290,
  },
  input: {
    height: 40,
    width: '15%',
    // marginLeft: '10%',
    borderColor: 'cyan',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 16,
    color: 'black',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#E6E6FA',
  },
  button: {
    backgroundColor: '#00DDDD',
    padding: 10,
    height: 45,
    width: 80,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    height: 45,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    justifyContent: 'center',
    borderRadius: 13,
    marginLeft: 20,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
});

export default HodScreen11;
