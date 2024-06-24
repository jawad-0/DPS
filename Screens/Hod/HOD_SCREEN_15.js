import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Keyboard,
  TextInput,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, course_port, port, gridview_port, assigned_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';
import {SelectList} from 'react-native-dropdown-select-list';

const HodScreen15 = () => {
  const navigation = useNavigation();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [assignedTo, setAssignedTo] = useState([]);
  const [courses, setCourses] = useState([]);
  const [CLOS, setCLOS] = useState([]);
  const [gridViewHeaders, setGridViewHeaders] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchData();
    fetchGridViewHeaders();
  }, []);

  const handleSave = () => {
    console.log('Save Button Clicked');
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${course_port}/getCourse`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map(course => ({
          key: course.c_id.toString(),
          value: course.c_title,
        }));
        setCourses(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchGridViewHeaders = () => {
    const apiEndpoint = `http://${ip}:${gridview_port}/getGridViewHeaders`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setGridViewHeaders(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchData2 = key => {
    const apiEndpoint = `http://${ip}:${port}/getCLO/${key}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map(clo => ({
          key: clo.clo_id.toString(),
          value: clo.clo_name,
        }));
        setCLOS(transformedData);
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
            activeOpacity={0.5}
            onPress={() => navigation.navigate('HodScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Grid View</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerContainer}>
            <SelectList
              setSelected={key => {
                fetchData2(key);
                setSelectedCourse(key);
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
          {selectedCourse && (
            <View style={styles.pickerContainer}>
              <SelectList
                data={CLOS}
                save="clo_name"
                placeholder="Select CLO"
                searchPlaceholder="Search CLO"
                boxStyles={{backgroundColor: 'gray'}}
                inputStyles={{color: 'white'}}
                dropdownStyles={{
                  backgroundColor: 'black',
                  borderColor: 'white',
                }}
                dropdownTextStyles={{color: 'white'}}
              />
            </View>
          )}
          <View style={styles.bar1}>
            <Text style={styles.bar1Text}>Assessments</Text>
          </View>
          <View style={styles.bar2}>
            {gridViewHeaders.map((item, index) => (
              <Text key={index} style={styles.bar2Text}>
                {item.name}
              </Text>
            ))}
            {/* <Text style={styles.bar2Text}>Assignment</Text>
            <Text style={styles.bar2Text}>Quiz</Text>
            <Text style={styles.bar2Text}>Mid Term</Text>
            <Text style={styles.bar2Text}>Final Term</Text> */}
          </View>
          <View style={styles.bar3}>
            {gridViewHeaders.map((item, index) => (
              <Text key={index} style={styles.bar3Text}>
                {item.weightage} %
              </Text>
            ))}
          </View>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 2,
              width: '90%',
              marginTop: 10,
              alignSelf: 'center',
            }}></View>

          <FlatList
            data={CLOS}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.indexText}>{item.clo_number}:</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TextInput
                    style={styles.input}
                    placeholder="- -"
                    keyboardType="numeric"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setWeightage1(text)}
                  />
                  <Text style={styles.percent}> %</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="- -"
                    keyboardType="numeric"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setWeightage2(text)}
                  />
                  <Text style={styles.percent}> %</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="- -"
                    keyboardType="numeric"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setWeightage3(text)}
                  />
                  <Text style={styles.percent}> %</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="- -"
                    keyboardType="numeric"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setWeightage4(text)}
                  />
                  <Text style={styles.percent}> %</Text>
                </View>
              </View>
            )}
          />

          {/* <Text style={styles.name}>SENIOR TEACHER</Text> */}

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
  percent: {
    color: 'black',
    alignSelf: 'center',
    fontWeight: 'bold',
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
    height: 40,
    width: 40,
    // alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: 30,
    paddingHorizontal: 8,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
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
  //   listItem: {
  //     flexDirection: 'row',
  //     borderBottomWidth: 2,
  //     borderBottomColor: 'black',
  //     width: '90%',
  //     height: 55,
  //     marginLeft: '5%',
  //     borderRadius: 15,
  //     marginTop: 1,
  //     color: 'black',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  //     backgroundColor: '#E6E6FA',
  //   },
  listItem: {
    flexDirection: 'column',
    borderBottomWidth: 2,
    borderBottomColor: '#58FFAB',
    backgroundColor: '#E6E6FA',
    height: 'auto',
    width: '90%',
    marginLeft: '5%',
    marginTop: 3,
    borderRadius: 10,
    // marginTop: 2,
    color: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  cloText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    flexWrap: 'wrap',
  },
  indexText: {
    fontSize: 15,
    color: 'blue',
    marginLeft: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  flatlist: {
    marginTop: 5,
    maxHeight: 455,
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
    backgroundColor: '#E6E6FA',
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
  bar1: {
    backgroundColor: 'yellow',
    color: 'black',
    height: 40,
    width: '90%',
    marginTop: 10,
    marginLeft: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar1Text: {
    color: 'black',
    fontWeight: 'bold',
  },
  bar2: {
    flexDirection: 'row',
    backgroundColor: 'white',
    color: 'black',
    height: 40,
    width: '90%',
    marginTop: 5,
    marginLeft: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar2Text: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'black',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bar3: {
    flexDirection: 'row',
    backgroundColor: 'white',
    color: 'black',
    height: 40,
    width: '90%',
    marginTop: 5,
    marginLeft: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar3Text: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    // borderWidth: 1
  },
});

export default HodScreen15;
