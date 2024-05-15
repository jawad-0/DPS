import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
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
import {ip, port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
const FctScreen05 = ({route}) => {
  const {courseId, courseName, courseCode, facultyId, facultyRole} =
    route.params;
  const navigation = useNavigation();
  const [CLOS, setCLOS] = useState([]);
  const [topics, setTopics] = useState([]);
  const [clo_id, setCLOid] = useState();
  const [clonumber, setCLOnumber] = useState('');
  const [clotext, setCLOtext] = useState('');
  const [mode, setMode] = useState('add');
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [selectedCLOIds, setSelectedCLOIds] = useState([]);

  const toggleCheckBox = clo_id => {
    if (selectedCLOIds.includes(clo_id)) {
      setSelectedCLOIds(selectedCLOIds.filter(id => id !== clo_id));
    } else {
      setSelectedCLOIds([...selectedCLOIds, clo_id]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  const handleAddOrUpdateCLO = () => {
    if (mode === 'add') {
      addCLO();
    } else if (mode === 'edit') {
      editCLO();
    }
  };

  const isValidCLOFormat = clonumber => {
    const regex = /^CLO-\d+$/;
    return regex.test(clonumber);
  };

  const handleSearch = text => {
    console.log('yes');
    // const apiEndpoint = `http://${ip}:${faculty_port}/searchfaculty?search=${text}`;

    // if (text.trim() === '') {
    //   fetchData();
    // } else {
    //   fetch(apiEndpoint)
    //     .then(response => response.json())
    //     .then(data => {
    //       setFacultyMembers(data);
    //     })
    //     .catch(error => {
    //       console.error('Error searching data:', error);
    //     });
    // }
  };

  const addTopic = () => {
    console.log('Selected CLO IDs:', selectedCLOIds);
    setSelectedCLOIds([]);
  };

  const addCLO = () => {
    setMode('add');
    if (clonumber.trim() === '' || clotext.trim() === '') {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    if (!isValidCLOFormat(clonumber)) {
      ToastAndroid.show(
        'Invalid CLO Number format. Correct format "CLO-1"',
        ToastAndroid.LONG,
      );
      return;
    }
    const apiEndpoint = `http://${ip}:${port}/addCLO`;
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        c_id: courseId,
        clo_number: clonumber,
        clo_text: clotext,
      }),
    })
      .then(response => {
        if (response.status === 400) {
          return response.json().then(data => {
            ToastAndroid.show(data.error, ToastAndroid.LONG);
            throw new Error(data.error);
          });
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('CLO posted successfully:', data);
        ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
        Keyboard.dismiss();
        fetchData();
      })
      .catch(error => {
        // console.error('Error posting data:', error);
      });
  };

  const editCLO = () => {
    setMode('edit');
    if (clonumber.trim() === '' || clotext.trim() === '') {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    if (!isValidCLOFormat(clonumber)) {
      ToastAndroid.show(
        'Invalid CLO Number format. Correct format "CLO-1"',
        ToastAndroid.LONG,
      );
      return;
    }
    const apiEndpoint = `http://${ip}:${port}/editCLO/${clo_id}`;
    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        c_id: courseId,
        clo_number: clonumber,
        clo_text: clotext,
      }),
    })
      .then(response => {
        if (response.status === 400) {
          return response.json().then(data => {
            ToastAndroid.show(data.error, ToastAndroid.LONG);
            throw new Error(data.error);
          });
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('CLO updated successfully:', data);
        ToastAndroid.show('Updated Successfully !', ToastAndroid.SHORT);
        Keyboard.dismiss();
        setCLOnumber('');
        setCLOtext('');
        setMode('add');
        fetchData();
      })
      .catch(error => {
        // console.error('Error posting data:', error);
      });
  };

  const handleEdit = item => {
    setMode('edit');
    setCLOid(item.clo_id);
    setCLOnumber(item.clo_number);
    setCLOtext(item.clo_text);
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${port}/gettopic/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setTopics(data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
      });
  };

  const fetchData2 = () => {
    const apiEndpoint = `http://${ip}:${port}/getCLO/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setCLOS(data);
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
          <Text style={styles.headerText}>Manage Topics</Text>
        </View>
        <View>
          <Text style={styles.nameText}>{courseName}</Text>
          <Text style={styles.codeText}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Topic Name</Text>
          <TextInput
            style={styles.input1}
            value={clonumber}
            placeholder="Enter Topic Name"
            placeholderTextColor={'gray'}
            onChangeText={text => setCLOnumber(text)}
          />
          <Text style={styles.label}>CLOS</Text>
          <View style={styles.CLOScontainer}>
            {CLOS.map((CLO, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => console.log(CLO.clo_text)}>
                <Text style={styles.clonumbertext}>{CLO.clo_number}</Text>
                </TouchableOpacity>
                {/* <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                /> */}
                <CheckBox
                  disabled={false}
                  value={selectedCLOIds.includes(CLO.clo_id)}
                  onValueChange={() => toggleCheckBox(CLO.clo_id)}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={addTopic}>
            <Text style={styles.addText}>
              {mode === 'add' ? 'ADD' : 'UPDATE'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.searchinput}
            placeholder="Search"
            placeholderTextColor={'white'}
            onChangeText={text => handleSearch(text)}
          />

          <FlatList
            data={topics}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.listItem}>
                <Text style={styles.topicText}>{item.t_name}</Text>
                <View style={styles.column}>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEdit(item)}>
                      <Image
                        source={require('../../assets/edit_icon.png')}
                        style={styles.editIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.disableButton}
                      onPress={() => handleStatus(item.f_id, item.status)}>
                      <Text style={styles.disablebuttonText}>D</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleStatus(item.f_id, item.status)}>
                      <Text style={styles.addbuttonText}>A</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
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
    marginTop: 60,
    // alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  CLOScontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '96%',
    marginLeft: '2%',
    // borderWidth: 3,
    // borderColor: 'yellow',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    // borderWidth: 3,
    // borderColor: 'green',
    width: '20%',
  },
  input1: {
    height: 40,
    width: 360,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 3,
    borderColor: '#58FFAB',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#CDCDCD',
  },
  input2: {
    height: 100,
    width: 340,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 3,
    borderColor: '#58FFAB',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#CDCDCD',
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
    marginLeft: 15,
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
    maxHeight: 240,
    // borderWidth: 3,
    // borderColor: 'yellow'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  //   buttonsContainer: {
  //     flexDirection: 'row',
  //     maxWidth: '100%',
  //     // marginLeft: 10,
  //     marginTop: 30,
  //     // borderWidth: 2,
  //     // borderColor: 'yellow',
  //     justifyContent: 'flex-end',
  //   },
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
  listItem: {
    flexDirection: 'row',
    // borderBottomWidth: 2,
    // borderBottomColor: 'green',
    // borderTopWidth: 2,
    // borderTopColor: 'black',
    width: '98%',
    backgroundColor: '#CDCDCD',
    height: 'auto',
    borderRadius: 5,
    marginTop: 4,
    marginLeft: '1%',
    color: 'white',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 20,
    width: 286,
    flexWrap: 'wrap',
  },
  indexText: {
    fontSize: 17,
    color: 'blue',
    marginLeft: 15,
    fontWeight: 'bold',
    width: 65,
  },
  buttonsContainer: {
    flexDirection: 'row',
    // backgroundColor: 'white',
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: 'black',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 10,
  },
  editIcon: {
    height: 16,
    width: 16,
  },
  addButton: {
    backgroundColor: 'green',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addbuttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disableButton: {
    backgroundColor: 'red',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 10,
    justifyContent: 'center',
  },
  disablebuttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchinput: {
    height: 40,
    width: 300,
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'white',
  },
  clonumbertext: {
    fontSize: 20,
  },
});

export default FctScreen05;
