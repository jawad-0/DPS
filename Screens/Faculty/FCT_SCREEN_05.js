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
  const [topicname, setTopicName] = useState('');
  const [CLOS, setCLOS] = useState([]);
  const [topics, setTopics] = useState([]);
  const [mode, setMode] = useState('add');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCLOIds, setSelectedCLOIds] = useState([]);

  //   const toggleCheckBox = clo_id => {
  //     if (selectedCLOIds && selectedCLOIds.includes(clo_id)) {
  //       setSelectedCLOIds(selectedCLOIds.filter(id => id !== clo_id));
  //     } else {
  //       setSelectedCLOIds([...selectedCLOIds, clo_id]);
  //     }
  //   };

  //   const toggleCheckBox = clo_id => {
  //     setSelectedCLOIds(prevIds => {
  //       if (prevIds.includes(clo_id)) {
  //         return prevIds.filter(id => id !== clo_id);
  //       } else {
  //         return [...prevIds, clo_id];
  //       }
  //     });
  //   };

  //   const toggleCheckBox = clo_id => {
  //     if (selectedCLOIds.includes(clo_id)) {
  //       setSelectedCLOIds(selectedCLOIds.filter(id => id !== clo_id));
  //     } else {
  //       setSelectedCLOIds([...selectedCLOIds, clo_id]);
  //     }
  //   };

  const toggleCheckBox = clo_id => {
    if (selectedCLOIds.includes(clo_id)) {
      setSelectedCLOIds(selectedCLOIds.filter(id => id !== clo_id));
    } else {
      setSelectedCLOIds([...selectedCLOIds, clo_id]);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchCLOS();
  }, []);

  const handleAddOrUpdateCLO = () => {
    if (mode === 'add') {
      addTopic();
    } else if (mode === 'edit') {
      updateTopic();
    }
  };

  const handleSearch = text => {
    console.log('yes');
    // Add search functionality if needed
  };

  const addTopic = () => {
    console.log(topicname);
    console.log('Selected CLO IDs:', selectedCLOIds);
    if (topicname.trim() === '') {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    fetch(`http://${ip}:${port}/addtopic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        c_id: courseId,
        t_name: topicname,
        clo_ids: selectedCLOIds,
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to add topic');
        }
      })
      .then(data => {
        ToastAndroid.show('Topic Added Successfully!', ToastAndroid.SHORT);
        setTopicName('');
        Keyboard.dismiss();
        setSelectedCLOIds([]);
        fetchCourse(); // Refresh topics list
      })
      .catch(error => {
        console.error('Error adding topic:', error);
        Alert.alert(
          'Error',
          error.message || 'Failed to add topic. Please try again.',
        );
      });
  };

  const handleStatus = (t_id, status) => {
    const apiEndpoint = `http://${ip}:${port}/enabledisabletopic/${t_id}`;

    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: status,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to edit topic status');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        ToastAndroid.show('Topic status updated', ToastAndroid.SHORT);
        fetchCourse();
        fetchCLOS();
      })
      .catch(error => {
        console.error(error);
        ToastAndroid.show('Error: Failed to edit status.', ToastAndroid.SHORT);
      });
  };

  const handleEdit = item => {
    setMode('edit');
    const apiEndpoint = `http://${ip}:${port}/getsingletopic/${item.t_id}`;

    fetch(apiEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch topic details: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          const topic = data[0];
          console.log(topic);
          setTopicName(topic.t_name);
          let cloIds = topic.clo_ids || [];
          if (!Array.isArray(cloIds)) {
            cloIds = cloIds.split(',').map(Number);
          }
          console.log('Formatted clo_ids:', cloIds);
          setSelectedCLOIds(cloIds);
          setSelectedTopic(topic);
        } else {
          console.error('No topic data found');
        }
      })
      .catch(error => {
        console.error('Error fetching topic details:', error);
      });
  };

  const updateTopic = () => {
    if (!selectedTopic) {
      return;
    }
    const {t_id} = selectedTopic;
    const add_clo_ids = selectedCLOIds.filter(
      id => !selectedTopic.clo_ids.includes(id),
    );
    const remove_clo_ids = selectedTopic.clo_ids.filter(
      id => !selectedCLOIds.includes(id),
    );

    const apiEndpoint = `http://${ip}:${port}/editTopic`;

    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        t_id,
        t_name: topicname,
        add_clo_ids,
        remove_clo_ids,
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update topic');
        }
      })
      .then(data => {
        setTopicName('');
        setSelectedCLOIds([]);
        setMode('add');
        setSelectedTopic(null);
        fetchCourse();
        Keyboard.dismiss();
        ToastAndroid.show('Topic updated successfully', ToastAndroid.SHORT);
      })
      .catch(error => {
        console.error('Error updating topic:', error);
      });
  };

  const fetchCourse = () => {
    const apiEndpoint = `http://${ip}:${port}/gettopic/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setTopics(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchCLOS = () => {
    const apiEndpoint = `http://${ip}:${port}/getCLO/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setCLOS(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
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
            value={topicname}
            placeholder="Enter Topic Name"
            placeholderTextColor={'gray'}
            onChangeText={text => setTopicName(text)}
          />
          <Text style={styles.label}>CLOS</Text>
          <View style={styles.CLOScontainer}>
            {/* {console.log('selectedCLOIds:', selectedCLOIds)} */}
            {CLOS.map((CLO, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => console.log(CLO.clo_text)}>
                  <Text style={styles.clonumbertext}>{CLO.clo_number}</Text>
                </TouchableOpacity>
                <CheckBox
                  disabled={false}
                  value={selectedCLOIds && selectedCLOIds.includes(CLO.clo_id)}
                  onValueChange={() => toggleCheckBox(CLO.clo_id)}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleAddOrUpdateCLO}>
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
                    {item.status === 'disabled' ? (
                      <TouchableOpacity
                        style={styles.disableButton}
                        onPress={() => handleStatus(item.t_id, item.status)}>
                        <Text style={styles.disablebuttonText}>D</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.enableButton}
                        onPress={() => handleStatus(item.t_id, item.status)}>
                        <Text style={styles.enablebuttonText}>E</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.addButton}>
                      {/* onPress={() => handleEdit(item)} */}
                      <Image
                        source={require('../../assets/add_icon.png')}
                        style={styles.addIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
          <Text style={styles.infoText}>
            Click{' '}
            <Image
              source={require('../../assets/add_icon.png')}
              style={styles.infoIcon}
              resizeMode="contain"
            />{' '}
            button to add Sub-Topics
          </Text>
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
    maxHeight: 230,
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
    borderBottomWidth: 2,
    borderBottomColor: 'green',
    // borderTopWidth: 2,
    // borderTopColor: 'black',
    width: '98%',
    backgroundColor: '#CDCDCD',
    height: 'auto',
    borderRadius: 5,
    marginTop: 4,
    marginLeft: '1%',
    color: 'white',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    width: 282,
    fontWeight: 'bold',
    marginTop: 3,
    marginBottom: 3,
  },
  indexText: {
    fontSize: 17,
    color: 'blue',
    marginLeft: 15,
    fontWeight: 'bold',
    width: 65,
  },
  infoText: {
    fontSize: 15,
    color: 'white',
    height: 30,
    textAlignVertical: 'center',
    fontWeight: 'bold',
    marginBottom: 3,
    alignSelf: 'center',
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
    // backgroundColor: 'white',
    // borderWidth: 1,
    marginLeft: 5,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    height: 30,
    width: 30,
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
    marginLeft: 5,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  disablebuttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  enableButton: {
    backgroundColor: '#0DEC09',
    borderWidth: 1,
    marginLeft: 5,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  enablebuttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    height: 25,
    width: 25,
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
