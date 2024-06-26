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
import {SelectList} from 'react-native-dropdown-select-list';

const HodScreen11 = () => {
  const navigation = useNavigation();
  const [easy, setEasy] = useState('');
  const [medium, setMedium] = useState('');
  const [hard, setHard] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [number, setNumber] = useState();
  const [numberOfQuestions, setNumberOfQuestions] = useState([]);

  useEffect(() => {
    fetchNumberOfQuestions();
  }, []);

  const fetchNumberOfQuestions = () => {
    const apiEndpoint = `http://${ip}:${port}/getNumberOfQuestions`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        const transformedData = data.map(difficulty => ({
          key: difficulty.number_of_questions,
          value: difficulty.number_of_questions,
        }));
        setNumberOfQuestions(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchDifficulty = numberOfQuestions => {
    const apiEndpoint = `http://${ip}:${port}/getdifficulty/${numberOfQuestions}`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setEasy(data[0].easy.toString());
        setMedium(data[0].medium.toString());
        setHard(data[0].hard.toString());
        setNumber(data[0].number_of_questions);
        // if (Array.isArray(data) && data.length >= 3) {
        //   setEasy(data[0].number.toString());
        //   setMedium(data[1].number.toString());
        //   setHard(data[2].number.toString());
        // } else {
        //   console.error('Unexpected data format:', data);
        // }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const updateDifficulty = number => {
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
    // Convert string inputs to integers
    const easyValue = parseInt(easy, 10);
    const mediumValue = parseInt(medium, 10);
    const hardValue = parseInt(hard, 10);

    // Check if the numbers are negetive
    if (easyValue < 0 || mediumValue < 0 || hardValue < 0) {
      ToastAndroid.show('All fields must be non-negative.', ToastAndroid.SHORT);
      return;
    }
    // Check if the sum of easy, medium, and hard equals number
    if (easyValue + mediumValue + hardValue !== number) {
      ToastAndroid.show(
        'The sum of easy, medium, and hard should be equal to the total number of questions.',
        ToastAndroid.SHORT,
      );
      return;
    }
    const apiEndpoint = `http://${ip}:${port}/savedifficulty/${number}`;
    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        easy: easyValue,
        medium: mediumValue,
        hard: hardValue,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data posted successfully:', data);
        ToastAndroid.show('Updated Successfully !', ToastAndroid.SHORT);
        Keyboard.dismiss();
        fetchDifficulty(number);
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
            activeOpacity={0.5}
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
          <View style={styles.pickerContainer}>
            <SelectList
              data={numberOfQuestions}
              setSelected={key => {
                fetchDifficulty(key);
              }}
              search={false}
              save="number_of_questions"
              placeholder="Select Number Of Questions"
              // searchPlaceholder="Search Number Of Questions"
              boxStyles={{backgroundColor: 'gray'}}
              inputStyles={{color: 'white'}}
              dropdownStyles={{backgroundColor: 'black', borderColor: 'white'}}
              dropdownTextStyles={{color: 'white'}}
            />
          </View>
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
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => updateDifficulty(number)}>
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
  pickerContainer: {
    borderWidth: 2,
    // borderColor: 'white',
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
  },
});

export default HodScreen11;
