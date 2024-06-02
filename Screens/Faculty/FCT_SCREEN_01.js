import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, assigned_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const FctScreen01 = ({route}) => {
  const {facultyId} = route.params;
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [assignedCourses, setAssignedCourses] = useState([]);

  useEffect(() => {
    fetchAssignedCourses();
  }, []);

  const handleLogout = () => {
    ToastAndroid.show('Logged Out!', ToastAndroid.SHORT);
    navigation.navigate('FctLogin');
  };

  const handlePress = item => {
    navigation.navigate('FctScreen02', {
      courseId: item.c_id,
      courseName: item.c_title,
      courseCode: item.c_code,
      facultyId: item.f_id,
      facultyName: name,
      facultyRole: item.role,
    });
    // console.log('Item:', item);
  };

  const fetchAssignedCourses = () => {
    const apiEndpoint = `http://${ip}:${assigned_port}/getAssignedCourses/${facultyId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const assignedData = data[0];
        // console.log('Data fetched successfully:', assignedData);
        // console.log('Teacher Name:', assignedData.f_name);
        // console.log('Course Title:', assignedData.c_title);
        // console.log('Course Code:', assignedData.c_code);
        // console.log(data);
        const ids = data.map(item => item.ac_id); // Extract all IDs
        console.log('Assigned courses ID:', ids);
        setName(assignedData.f_name);
        setAssignedCourses(data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/fct_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Faculty Dashboard</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
            <Image
              source={require('../../assets/logout2.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.mailButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('FctScreen14', {facultyId: facultyId})
            }>
            <Image
              source={require('../../assets/mail.png')}
              style={styles.mailIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statusButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('FctScreen15', {facultyId: facultyId})
            }>
            <Image
              source={require('../../assets/status.png')}
              style={styles.statusIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.welcomeText}>Welcome {name} !</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <FlatList
            data={assignedCourses}
            style={styles.flatlist}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePress(item)}>
                <View style={styles.listItem}>
                  <View style={styles.column}>
                    <Text style={styles.data_title}>{item.c_title}</Text>
                    <Text style={styles.data_code}>({item.c_code})</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        {/* </ScrollView> */}
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
    marginTop: 50,
    alignItems: 'center',
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
    marginTop: 20,
    marginLeft: 20,
    color: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 20,
    color: 'white',
  },
  data_title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
  },
  data_code: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'blue',
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
    backgroundColor: '#E6E6FA',
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
    // borderTopWidth: 3,
    // borderTopColor: 'white',
    borderBottomWidth: 3,
    borderBottomColor: 'white',
    // borderRightWidth: 3,
    // borderRightColor: 'white',
    // borderLeftWidth: 3,
    // borderLeftColor: 'white',
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
    borderBottomWidth: 3,
    borderBottomColor: 'white',
    backgroundColor: '#58FFAB',
    height: 100,
    width: 200,
    borderRadius: 15,
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  column: {
    flex: 1,
  },
  flatlist: {
    marginTop: 5,
    maxHeight: 500,
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
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    // marginLeft: 10,
    marginTop: 30,
    // borderWidth: 2,
    // borderColor: 'yellow',
    justifyContent: 'flex-end',
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
  mailButton: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 13,
    marginLeft: 20,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  statusButton: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 13,
    marginLeft: 20,
    marginRight: 10,
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
  mailIcon: {
    height: 30,
    width: 45,
  },
  statusIcon: {
    height: 30,
    width: 45,
  },
});

export default FctScreen01;
