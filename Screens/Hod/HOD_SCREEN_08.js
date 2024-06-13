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
  TextInput,
  FlatList,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {CheckBox} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {SelectList} from 'react-native-dropdown-select-list';
import {ip, faculty_port, course_port, assigned_port} from '../CONFIG';
// import SplashScreen from 'react-native-splash-screen';

const HodScreen08 = () => {
  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState('- - - - - - - -');
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [f_id, setFacultyID] = useState();

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleLogout = () => {
    ToastAndroid.show('Logged Out!', ToastAndroid.SHORT);
    navigation.navigate('HodLogin');
  };

  const handleSearch = text => {
    const apiEndpoint = `http://${ip}:${course_port}/searchcourse?search=${text}`;
    if (text.trim() === '') {
      fetchCourse();
    } else {
      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          setCourses(data);
        })
        .catch(error => {
          console.error('Error searching data:', error);
        });
    }
  };

  const handleAssign = item => {
    console.log(`Assigning Course ${item.c_id} | Faculty ${f_id}`);
    const apiEndpoint = `http://${ip}:${assigned_port}/assignCourse/${item.c_id}/${f_id}`;
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (!response.ok) {
        console.log('Network response was not ok');
      }
      fetchAssignedCourses(f_id);
      fetchCourse(f_id);
      return response.json();
    });
  };

  const handleUnassign = item => {
    console.log(`Unassigning Course ${item.c_id} | Faculty ${f_id}`);
    const apiEndpoint = `http://${ip}:${assigned_port}/deleteAssignedCourse/${item.ac_id}`;
    fetch(apiEndpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (!response.ok) {
        console.log('Network response was not ok');
      }
      fetchAssignedCourses(f_id);
      fetchCourse(f_id);
      return response.json();
    });
  };

  const fetchFaculty = () => {
    const apiEndpoint = `http://${ip}:${faculty_port}/getFaculty`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        const transformedData = data.map(faculty => ({
          key: faculty.f_id,
          value: faculty.f_name,
        }));
        setFacultyMembers(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchCourse = key => {
    const apiEndpoint = `http://${ip}:${assigned_port}/getUnassignedCourses/${key}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setCourses(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchAssignedCourses = key => {
    const apiEndpoint = `http://${ip}:${assigned_port}/getAssignedCourses/${key}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // const assignedData = data[0];
        // console.log('Teacher Name:', assignedData.TeacherName);
        // const ids = data.map(item => item.ac_id);
        // console.log('All assigned course IDs:', ids);
        // setName(assignedData.CourseTitle);
        setAssignedCourses(data);
        if (data && data.length > 0 && data[0].f_name) {
          setSelectedValue(data[0].f_name);
        } else {
          console.log('No assigned courses found for the given key.');
        }
      });
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
          <Text style={styles.headerText}>Assign Course</Text>
        </View>
        <View>
          {/* <Text style={styles.welcomeText}>Welcome DATACELL !</Text> */}
        </View>
        <View style={styles.pickerContainer}>
          <SelectList
            setSelected={key => {
              console.log(key);
              fetchCourse(key);
              setFacultyID(key);
              fetchAssignedCourses(key);
            }}
            data={facultyMembers}
            save="f_name"
            placeholder="Select Teacher"
            searchPlaceholder="Search Teacher"
            boxStyles={{backgroundColor: 'gray'}}
            inputStyles={{color: 'white'}}
            dropdownStyles={{backgroundColor: 'black', borderColor: 'white'}}
            dropdownTextStyles={{color: 'white'}}
          />
        </View>
        <Text style={styles.nameText}>
          Teacher : <Text style={{color: 'yellow'}}>{selectedValue}</Text>
        </Text>
        <View
          style={{
            borderBottomColor: 'white',
            borderBottomWidth: 2,
            width: '80%',
            alignSelf: 'center',
          }}></View>
        <View style={{marginTop: 20}}>
          {assignedCourses && assignedCourses.length > 0 && (
            <View>
              <Text style={styles.label}>Assigned Courses : </Text>
              <FlatList
                data={assignedCourses}
                style={styles.flatlist1}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <View style={styles.listItem1}>
                    <View style={styles.checkbox}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => handleUnassign(item)}>
                        <Image
                          source={require('../../assets/checkedbox.png')}
                          style={styles.checkedIcon}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.data_name}>{item.c_title}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          {courses && courses.length > 0 && (
            <View>
              <Text style={styles.label}>Unassigned Courses : </Text>
              {/* <TextInput
                style={styles.input}
                // value={name}
                placeholder="Search"
                placeholderTextColor={'gray'}
                onChangeText={text => handleSearch(text)}
                /> */}
              <FlatList
                data={courses}
                style={styles.flatlist2}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <View style={styles.listItem2}>
                    <View style={styles.checkbox}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => handleAssign(item)}>
                        <Image
                          source={require('../../assets/uncheckedbox.png')}
                          style={styles.uncheckedIcon}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.data_name}>{item.c_title}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
          {/* <View style={styles.buttonscontainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log('Button pressed')}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View> */}
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
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
  },
  headerText: {
    height: 70,
    width: 330,
    // marginLeft: 25,
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
  nameText: {
    height: 50,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
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
  label: {
    height: 40,
    textAlignVertical: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    // borderWidth: 2,
    // borderColor: 'white',
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
    height: 50,
    width: 200,
    borderWidth: 2,
    borderRadius: 15,
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
    marginTop: 30,
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
  checkedIcon: {
    height: 25,
    width: 25,
  },
  uncheckedIcon: {
    height: 20,
    width: 20,
  },
  pickerContainer: {
    borderWidth: 2,
    // borderColor: 'black',
    backgroundColor: 'black',
    borderRadius: 10,
    // justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    // overflow: 'hidden',
  },
  data_name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 10,
    // textAlign: 'center',
  },
  listItem1: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    backgroundColor: 'lightgreen',
    height: 45,
    width: '96%',
    marginLeft: '2%',
    borderRadius: 15,
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem2: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    backgroundColor: '#E6E6FA',
    height: 45,
    width: '96%',
    marginLeft: '2%',
    borderRadius: 15,
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  flatlist1: {
    marginTop: 10,
    maxHeight: 180,
  },
  flatlist2: {
    marginTop: 10,
    maxHeight: 360,
  },
  checkbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
});

export default HodScreen08;
