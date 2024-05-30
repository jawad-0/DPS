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
const FctScreen06 = ({route}) => {
  const {
    topicId,
    topicName,
    courseId,
    courseName,
    courseCode,
    facultyId,
    facultyRole,
  } = route.params;
  const navigation = useNavigation();
  const [subtopicname, setSubTopicName] = useState('');
  const [CLOS, setCLOS] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [mode, setMode] = useState('add');
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [selectedCLOIds, setSelectedCLOIds] = useState([]);

  useEffect(() => {
    fetchSubTopics();
    fetchCLOS();
    console.log(topicId);
  }, []);

  const handleAddOrUpdateCLO = () => {
    if (mode === 'add') {
      addSubTopic();
    } else if (mode === 'edit') {
      updateSubTopic();
    }
  };

  const handleSearch = text => {
    const apiEndpoint = `http://${ip}:${port}/searchsubtopic/${topicId}?search=${text}`;

    if (text.trim() === '') {
      fetchSubTopics();
    } else {
      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          setSubTopics(data);
        })
        .catch(error => {
          console.error('Error searching subtopics:', error);
        });
    }
  };

  const addSubTopic = () => {
    console.log(subtopicname);
    console.log('Selected CLO IDs:', selectedCLOIds);
    if (subtopicname.trim() === '') {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    fetch(`http://${ip}:${port}/addsubtopic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        t_id: topicId,
        st_name: subtopicname,
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to add subtopic');
        }
      })
      .then(data => {
        ToastAndroid.show('SubTopic Added Successfully!', ToastAndroid.SHORT);
        setSubTopicName('');
        Keyboard.dismiss();
        fetchSubTopics();
      })
      .catch(error => {
        console.error('Error adding subtopic:', error);
      });
  };

  const handleEdit = item => {
    const subtopic = item;
    setMode('edit');
    setSubTopicName(item.st_name);
    setSelectedSubTopic(subtopic);
  };

  const updateSubTopic = () => {
    if (!selectedSubTopic) {
      return;
    }
    fetch(`http://${ip}:${port}/editsubtopic`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        st_id: selectedSubTopic.st_id,
        st_name: subtopicname,
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update subtopic');
        }
      })
      .then(data => {
        setMode('add');
        Keyboard.dismiss();
        setSubTopicName('');
        setSelectedSubTopic(null);
        fetchSubTopics(); // Refresh subtopics list
        ToastAndroid.show('SubTopic Updated Successfully!', ToastAndroid.SHORT);
      })
      .catch(error => {
        console.error('Error updating subtopic:', error);
      });
  };

  const fetchSubTopics = () => {
    const apiEndpoint = `http://${ip}:${port}/getsubtopic/${topicId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setSubTopics(data);
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
              navigation.navigate('FctScreen05', {
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
          <Text style={styles.headerText}>Manage Sub-Topics</Text>
        </View>
        <View>
          <Text style={styles.nameText}>{courseName}</Text>
          <Text style={styles.codeText}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Topic</Text>
          <Text style={[styles.label, {marginLeft: 40, marginTop: 10}]}>
            {topicName}
          </Text>
          <Text style={[styles.label, {marginTop: 20}]}>Sub-Topic Name</Text>
          <TextInput
            style={styles.input1}
            value={subtopicname}
            placeholder="Enter Topic Name"
            placeholderTextColor={'gray'}
            onChangeText={text => setSubTopicName(text)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAddOrUpdateCLO}>
            <Text style={styles.addText}>
              {mode === 'add' ? 'ADD' : 'UPDATE'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.searchinput}
            placeholder="Search Subtopic"
            placeholderTextColor={'white'}
            onChangeText={text => handleSearch(text)}
          />

          <FlatList
            data={subtopics}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.listItem}>
                <Text style={styles.topicText}>{item.st_name}</Text>
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
    backgroundColor: '#E6E6FA',
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
    backgroundColor: '#E6E6FA',
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
    width: 330,
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
    width: '90%',
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 5,
    paddingHorizontal: 8,
    color: 'white',
  },
  clonumbertext: {
    fontSize: 20,
  },
});

export default FctScreen06;
