import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, assigned_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const FctScreen03 = ({route}) => {
  const {courseId, courseName, courseCode, facultyId, facultyRole} =
    route.params;
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [assignedCourses, setAssignedCourses] = useState([]);

  useEffect(() => {
    // fetchAssignedCourses();
  }, []);

  const addCLO = () => {
    console.log('CLO Added!');
  };

  const handleLogout = () => {
    ToastAndroid.show('Logged Out!', ToastAndroid.SHORT);
    navigation.navigate('FctLogin');
  };

  const handlePress = item => {
    console.log('Item:', item);
  };

  return (
    <ImageBackground
      source={require('../../assets/fct_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate('FctScreen02', {
                courseId: courseId,
                courseName: courseName,
                courseCode: courseCode,
                facultyId: facultyId,
                facultyRole: facultyRole,
              })
            }>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Manage CLOS</Text>
        </View>
        <View style={styles.buttonsContainer}></View>
        <View>
          <Text style={styles.nameText}>{courseName}</Text>
          <Text style={styles.codeText}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            multiline={true}
            placeholder="Enter Description Here"
            placeholderTextColor={'gray'}
          />
          <TouchableOpacity style={styles.button} onPress={addCLO}>
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 70,
    // alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  input: {
    height: 100,
    width: 340,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 2,
    borderColor: '#58FFAB',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#E6E6FA',
  },
  headerText: {
    height: 70,
    width: 310,
    // marginLeft: 25,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    // fontFamily: 'FuzzyBubbles-Regular',
    textAlign: 'center',
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  nameText: {
    height: 40,
    textAlignVertical: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
  },
  codeText: {
    height: 40,
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    // marginTop: 10,
    marginLeft: 20,
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
  },
  label: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
  },
  button: {
    backgroundColor: '#58FFAB',
    height: 40,
    width: 90,
    marginRight: 25,
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
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
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    // marginLeft: 10,
    marginTop: 30,
    // borderWidth: 2,
    // borderColor: 'yellow',
    justifyContent: 'flex-end',
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
  addText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default FctScreen03;
