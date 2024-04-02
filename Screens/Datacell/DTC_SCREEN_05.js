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
import {ip, course_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const DtcScreen04 = ({route}) => {
  const navigation = useNavigation();
  const {itemId, itemCode, itemTitle, itemHours} = route.params;
  const [coursecode, setCourseCode] = useState(itemCode);
  const [coursetitle, setCourseTitle] = useState(itemTitle);
  const [credithours, setCreditHours] = useState(itemHours.toString());

  useEffect(() => {
    // fetchData();
  }, []);

  //   const fetchData = () => {
  //     const apiEndpoint = `http://${ip}:${course_port}/getSingleCourse/${itemId}`;
  //     Keyboard.dismiss();
  //     fetch(apiEndpoint)
  //       .then(response => response.json())
  //       .then(data => {
  //         const courseData = data[0];
  //         // console.log('Data fetched successfully:', courseData);
  //         setCourseCode(courseData.c_code);
  //         setCourseTitle(courseData.c_title);
  //         setCreditHours(courseData.cr_hours.toString());
  //       })
  //       .catch(error => {
  //         console.error('Error fetching data:', error);
  //       });
  //   };

  const handlePostData = () => {
    if (
      coursecode.trim() === '' ||
      coursetitle.trim() === '' ||
      credithours.trim() === ''
    ) {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    const apiEndpoint = `http://${ip}:${course_port}/editcourse/${itemId}`;

    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        c_code: coursecode,
        c_title: coursetitle,
        cr_hours: credithours,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data updated successfully:', data);
        ToastAndroid.show('Updated Successfully !', ToastAndroid.SHORT);
        navigation.navigate('DtcScreen04');
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
            onPress={() => navigation.navigate('DtcScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Course</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <Text style={styles.label}>Course Code</Text>
          <TextInput
            style={styles.input}
            value={coursecode}
            placeholder="Enter Course Code"
            placeholderTextColor={'gray'}
            onChangeText={text => setCourseCode(text)}
          />

          <Text style={styles.label}>Course Title</Text>
          <TextInput
            style={styles.input}
            value={coursetitle}
            placeholder="Enter Course Title"
            placeholderTextColor={'gray'}
            onChangeText={text => setCourseTitle(text)}
          />

          <Text style={styles.label}>Credit Hours</Text>
          <TextInput
            style={styles.input}
            value={credithours}
            placeholder="Enter Credit Hours"
            placeholderTextColor={'gray'}
            keyboardType="numeric"
            onChangeText={text => setCreditHours(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handlePostData}>
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
  data_name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 10,
    textAlign: 'center',
  },
  data_username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 10,
    textAlign: 'center',
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
    backgroundColor: '#CDCDCD',
  },
  searchinput: {
    height: 40,
    width: 300,
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 13,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'white',
  },
  tableheader: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 40,
    marginTop: 16,
    borderBottomWidth: 4,
    borderBottomColor: 'white',
  },
  columnContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  columnHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'black',
    textAlign: 'center',
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
  deletebuttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editbuttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disablebuttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  enablebuttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    backgroundColor: '#CDCDCD',
    height: 45,
    borderRadius: 15,
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  flatlist: {
    marginTop: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  modalbuttonscontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalcancelbutton: {
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    marginRight: 10,
    height: 30,
    width: 60,
  },
  modaldeletebutton: {
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 10,
    height: 30,
    width: 60,
  },
  modalcanceltext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modaldeletetext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    // marginLeft: 10,
    // borderWidth: 2,
    // borderColor: 'black',
    justifyContent: 'center',
  },
  editButton: {
    // backgroundColor: 'blue',
    marginRight: 8,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  deleteButton: {
    // backgroundColor: 'black',
    marginRight: 8,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  disableButton: {
    backgroundColor: 'red',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  enableButton: {
    backgroundColor: '#0DEC09',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  backButton: {
    justifyContent: 'center',
    borderRadius: 13,
    marginLeft: 20,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  deleteIcon: {
    height: 20,
    width: 20,
  },
  editIcon: {
    height: 18,
    width: 18,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
});

export default DtcScreen04;
