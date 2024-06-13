import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  Alert,
  Button,
  FlatList,
  Keyboard,
  TextInput,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, faculty_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const DtcScreen03 = ({route}) => {
  const navigation = useNavigation();
  const {itemId, itemName, itemUsername, itemPassword} = route.params;
  const [name, setName] = useState(itemName);
  const [username, setUsername] = useState(itemUsername);
  const [password, setPassword] = useState(itemPassword);

  useEffect(() => {
    // fetchData();
  }, []);

  //   const fetchData = () => {
  //     const apiEndpoint = `http://${ip}:${faculty_port}/getSingleFaculty/${itemId}`;
  //     Keyboard.dismiss();
  //     fetch(apiEndpoint)
  //       .then(response => response.json())
  //       .then(data => {
  //         const facultyData = data[0];
  //         // console.log('Data fetched successfully:', facultyData);
  //         setName(facultyData.f_name);
  //         setUsername(facultyData.username);
  //         setPassword(facultyData.password);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching data:', error);
  //       });
  //   };

  const handlePostData = () => {
    if (
      name.trim() === '' ||
      username.trim() === '' ||
      password.trim() === ''
    ) {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    const apiEndpoint = `http://${ip}:${faculty_port}/editfaculty/${itemId}`;

    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        f_name: name,
        username: username,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data updated successfully:', data);
        ToastAndroid.show('Updated Successfully !', ToastAndroid.SHORT);
        navigation.navigate('DtcScreen02');
        Keyboard.dismiss();
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/dtc_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('DtcScreen02')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Faculty</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            placeholder="Enter Name"
            placeholderTextColor={'gray'}
            onChangeText={text => setName(text)}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            placeholder="Enter Username"
            placeholderTextColor={'gray'}
            onChangeText={text => setUsername(text)}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="**********"
            placeholderTextColor={'gray'}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handlePostData}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
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
    marginTop: 20,
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
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 20,
    color: 'white',
  },
  input: {
    height: 41,
    width: 340,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#E6E6FA',
  },
  button: {
    backgroundColor: '#FFEA00',
    padding: 10,
    height: 50,
    width: 150,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    justifyContent: 'center',
    borderRadius: 13,
    marginLeft: 20,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  backIcon: {
    height: 20,
    width: 20,
  },
});

export default DtcScreen03;
