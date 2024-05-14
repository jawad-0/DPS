import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Keyboard,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, course_port, faculty_port, assigned_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';
import {SelectList} from 'react-native-dropdown-select-list';

const HodScreen09 = () => {
  const navigation = useNavigation();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [assignedTo, setAssignedTo] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    console.log('Save Button Clicked');
  };

  const assignRole = item => {
    setSelectedTeacher(item.f_name);
    const apiEndpoint = `http://${ip}:${assigned_port}/editRole/${item.c_id}/${item.f_id}`;
    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        ToastAndroid.show('Role Updated !', ToastAndroid.SHORT);
      })
      .catch(error => {
        console.error('Error assigning role:', error);
      });
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${course_port}/getCourse`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        const transformedData = data.map(course => ({
          key: course.c_id,
          value: course.c_title,
        }));
        // console.log(transformedData);
        setCourses(transformedData);
        // setCourses(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchAssignedTo = key => {
    const apiEndpoint = `http://${ip}:${assigned_port}/getAssignedTo/${key}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // const assignedData = data[0];
        // console.log('Teacher Name:', assignedData.TeacherName);
        // const ids = data.map(item => item.ac_id);
        // console.log('All assigned course IDs:', ids);
        // setName(assignedData.CourseTitle);
        setAssignedTo(data);
        const seniorTeacher = data.find(item => item.role === 'senior');
        if (seniorTeacher) {
          setSelectedTeacher(seniorTeacher.f_name);
        }
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
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
            onPress={() => navigation.navigate('HodScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Assign Role</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerContainer}>
            <SelectList
              setSelected={key => {
                fetchAssignedTo(key);
              }}
              data={courses}
              save="c_title"
              placeholder="Select Course"
              searchPlaceholder="Search Course"
              boxStyles={{backgroundColor: 'gray'}}
              inputStyles={{color: 'white'}}
              dropdownStyles={{backgroundColor: 'black', borderColor: 'white'}}
              dropdownTextStyles={{color: 'white'}}
            />
          </View>
          <Text style={styles.name}>SENIOR TEACHER</Text>

          <FlatList
            data={assignedTo}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>{item.f_name}</Text>
                </View>
                <View style={styles.column}>
                  <View style={styles.radiobuttonContainer}>
                    <TouchableOpacity
                      style={styles.radioContainer}
                      onPress={() => assignRole(item)}>
                      <View
                        style={[
                          styles.radioButton,
                          {
                            backgroundColor:
                              selectedTeacher === item.f_name
                                ? '#0AC506'
                                : 'transparent',
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* <View style={styles.savebuttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSave()}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View> */}
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
    marginTop: 20,
    // borderWidth: 2,
    // borderColor: 'yellow',
  },
  header: {
    flexDirection: 'row',
  },
  headerText: {
    height: 70,
    width: 320,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  label: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 25,
    // textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    // textDecorationLine: 'underline',
  },
  name: {
    marginTop: 50,
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  data_name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    // textAlign: 'center',
    // borderWidth: 2,
    // borderColor: 'black',
    width: 280,
  },
  input: {
    height: 41,
    width: 340,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
  },
  searchinput: {
    height: 40,
    width: 300,
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 13,
    marginTop: 16,
    paddingHorizontal: 8,
    color: 'white',
    backgroundColor: 'black',
  },
  tableheader: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 40,
    marginTop: 30,
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    backgroundColor: 'black',
  },
  columnHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    width: '90%',
    height: 55,
    marginLeft: '5%',
    borderRadius: 15,
    marginTop: 1,
    color: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#CDCDCD',
  },
  column: {
    flex: 1,
  },
  flatlist: {
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
  radiobuttonContainer: {
    flexDirection: 'row',
    maxWidth: 80,
    justifyContent: 'center',
    marginLeft: 100,
  },
  savebuttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 50,
  },
  deleteButton: {
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  deleteIcon: {
    height: 22,
    width: 22,
  },
  saveButton: {
    borderRadius: 13,
    backgroundColor: '#00DDDD',
    justifyContent: 'center',
    height: 50,
    width: 200,
  },
  saveText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  picker: {
    height: 55,
  },
  pickerItem: {
    backgroundColor: '#CDCDCD',
  },
  pickerContainer: {
    borderWidth: 2,
    // borderColor: 'white',
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    width: 20,
    height: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default HodScreen09;
