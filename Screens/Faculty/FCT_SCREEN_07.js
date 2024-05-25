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
import {ip, port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';
import {SelectList} from 'react-native-dropdown-select-list';

const FctScreen07 = ({route}) => {
  const {courseId, courseName, courseCode, facultyId, facultyRole} =
    route.params;
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [commontopics, setCommonTopics] = useState([]);
  const [faculty, setCommonFaculty] = useState([]);
  const [topictaught, setTopicTaught] = useState([]);
  const [subtopictaught, setSubTopicTaught] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [pressedButton, setPressedButton] = useState('initial');
  const [content1, setContent1] = useState([]);
  const [content2, setContent2] = useState([]);
  const [content3, setContent3] = useState([]);

  useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  const handleButtonPress = button => {
    // Fetch data for the respective content when the button is pressed
    // switch (button) {
    //   case 'button1':
    //     // Fetch data for content 1
    //     // Example: fetchDataForContent1().then(data => setContent1(data));
    //     break;
    //   case 'button2':
    //     // Fetch data for content 2
    //     // Example: fetchDataForContent2().then(data => setContent2(data));
    //     break;
    //   case 'button3':
    //     // Fetch data for content 3
    //     // Example: fetchDataForContent3().then(data => setContent3(data));
    //     break;
    //   default:
    //     break;
    // }
    // Set the pressed button
    if (button == 'button1') {
      fetchTopicTaught(facultyId);
      fetchSubTopicTaught(facultyId);
    }
    fetchData();
    fetchData2();
    setPressedButton(button);
  };

  //   const checkCLO = item => {
  //     console.log(
  //       `Text : ${item.clo_text} | clo_id : ${item.clo_id} | c_id : ${item.c_id} | status : ${item.status}`,
  //     );
  //   };

  const fetchData = () => {
    const apiEndpoint1 = `http://${ip}:${port}/getTopic/${courseId}`;
    const apiEndpoint2 = `http://${ip}:${port}/getcommontopictaught/${courseId}`;

    fetch(apiEndpoint1)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setTopics(data);
        data.forEach(topic => {
          fetchSubtopics(topic.t_id);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    fetch(apiEndpoint2)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setCommonTopics(data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
      });
  };

  const fetchSubtopics = t_id => {
    const apiEndpoint = `http://${ip}:${port}/getSubTopic/${t_id}`;

    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setSubTopics(prevSubtopics => ({
          ...prevSubtopics,
          [t_id]: data,
        }));
      })
      .catch(error => {
        console.error('Error fetching subtopics:', error);
        setSubTopics(prevSubtopics => ({
          ...prevSubtopics,
          [t_id]: [],
        }));
      });
  };

  const fetchData2 = () => {
    const apiEndpoint = `http://${ip}:${port}/getpaperheaderfaculty/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        const transformedData = data.map(faculty => ({
          key: faculty.f_id,
          value: faculty.f_name,
        }));
        // console.log(transformedData);
        setCommonFaculty(transformedData);
        // setCourses(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchTopicTaught = key => {
    const apiEndpoint = `http://${ip}:${port}/gettopictaught/${key}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setTopicTaught(data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
      });
  };

  const fetchSubTopicTaught = key => {
    const apiEndpoint = `http://${ip}:${port}/getsubtopictaught/${key}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setSubTopicTaught(data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
      });
  };

  //   const isCommonTopic = topic => {
  //     commontopics.some(commonTopic => commonTopic.t_id === topic.t_id);
  //   };

  const isCommonTopic = topicId =>
    commontopics.some(commonTopic => commonTopic.t_id === topicId);

  const isTopicTaught = topicId =>
    topictaught.some(topic => topic.t_id === topicId);

  const isSubTopicTaught = subtopicId =>
    subtopictaught.some(subtopic => subtopic.st_id === subtopicId);

  const addTopicTaught = topicId => {
    console.log('Yes');
    console.log(topicId);
    const apiEndpoint = `http://${ip}:${port}/addtopictaught`;
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        f_id: facultyId,
        t_id: topicId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
        fetchData();
        fetchData2();
        fetchTopicTaught(facultyId);
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  };

  const deleteTopicTaught = topicId => {
    console.log('Yes');
    const apiEndpoint = `http://${ip}:${port}/deletetopictaught`;
    fetch(apiEndpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        t_id: topicId,
        f_id: facultyId,
      }),
    }).then(response => {
      if (!response.ok) {
        console.log('Network response was not ok');
      }
      fetchData();
      fetchData2();
      fetchTopicTaught(facultyId);
      ToastAndroid.show('Deleted Successfully !', ToastAndroid.SHORT);
      return response.json();
    });
    //   const fetchCommonTopicTaught = key => {
    //     const apiEndpoint = `http://${ip}:${port}/getcommontopictaught/${key}`;
    //     fetch(apiEndpoint)
    //       .then(response => response.json())
    //       .then(data => {
    //         setTopicTaught(data);
    //       })
    //       .catch(error => {
    //         // console.error('Error fetching data:', error);
    //       });
    //   };

    //   const isTopicTaughtByAll = topicId => {
    //     return topicsStatus.some(
    //       topic => topic.t_id === topicId && topic.isTaughtByAll,
    //     );
    //   };
  };

  const addSubTopicTaught = subtopicId => {
    console.log('Yes');
    console.log(subtopicId);
    const apiEndpoint = `http://${ip}:${port}/addsubtopictaught`;
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        f_id: facultyId,
        st_id: subtopicId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
        fetchData();
        fetchData2();
        fetchTopicTaught(facultyId);
        fetchSubTopicTaught(facultyId);
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  };

  const deleteSubTopicTaught = subtopicId => {
    console.log('Yes');
    console.log(subtopicId);
    const apiEndpoint = `http://${ip}:${port}/deletesubtopictaught`;
    fetch(apiEndpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        st_id: subtopicId,
        f_id: facultyId,
      }),
    }).then(response => {
      if (!response.ok) {
        console.log('Network response was not ok');
      }
      fetchData();
      fetchData2();
      fetchTopicTaught(facultyId);
      fetchSubTopicTaught(facultyId);
      ToastAndroid.show('Deleted Successfully !', ToastAndroid.SHORT);
      return response.json();
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
          <Text style={styles.headerText}>View Topics</Text>
        </View>
        <View>
          <Text style={styles.nameText}>{courseName}</Text>
          <Text style={styles.codeText}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                pressedButton === 'button1' && styles.activeButton,
              ]}
              onPress={() => handleButtonPress('button1')}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>Covered</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                pressedButton === 'button2' && styles.activeButton,
              ]}
              onPress={() => handleButtonPress('button2')}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>Common</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                pressedButton === 'button3' && styles.activeButton,
              ]}
              onPress={() => handleButtonPress('button3')}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>Progress</Text>
            </TouchableOpacity>
          </View>
          {pressedButton === 'initial' && (
            <>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: 10,
                  marginTop: 20,
                }}>
                Topics / Subtopics :
              </Text>
              <FlatList
                data={topics}
                style={styles.flatlist}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.initiallistItem}>
                    <Text style={styles.topicText}>{item.t_name}</Text>
                    <View style={styles.subtopicContainer}>
                      {subtopics[item.t_id] &&
                        subtopics[item.t_id].map(subtopic => (
                          <TouchableOpacity
                            key={subtopic.st_id}
                            style={styles.subtopicButton}>
                            <Text style={styles.subtopicText}>
                              {subtopic.st_name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                )}
              />
            </>
          )}
          {pressedButton === 'button1' && (
            <>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: 10,
                  marginTop: 20,
                }}>
                Covered Topics :
              </Text>
              <FlatList
                data={topics}
                style={styles.flatlist}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.coveredlistItem}>
                    <View style={styles.topicRow}>
                      {isTopicTaught(item.t_id) ? (
                        <View style={{marginLeft: 15}}>
                          <TouchableOpacity
                            style={styles.checkButton}
                            onPress={() => deleteTopicTaught(item.t_id)}>
                            {/* <Text>✔</Text> */}
                            <Image
                              source={require('../../assets/checkedbox.png')}
                              style={styles.checkIcon}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{marginLeft: 15}}>
                          <TouchableOpacity
                            style={styles.uncheckButton}
                            onPress={() => addTopicTaught(item.t_id)}>
                            <Image
                              source={require('../../assets/uncheckedbox.png')}
                              style={styles.uncheckIcon}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      <Text style={styles.topicText}>{item.t_name}</Text>
                    </View>
                    <View style={styles.subtopicContainer}>
                      {subtopics[item.t_id] &&
                        subtopics[item.t_id].map(subtopic => (
                          <TouchableOpacity
                            key={subtopic.st_id}
                            style={styles.subtopicButton}>
                            <View style={styles.subtopicRow}>
                              {isSubTopicTaught(subtopic.st_id) ? (
                                <View style={{marginLeft: 15}}>
                                  <TouchableOpacity
                                    style={styles.checkButton}
                                    onPress={() =>
                                      deleteSubTopicTaught(subtopic.st_id)
                                    }>
                                    <Image
                                      source={require('../../assets/checkedbox.png')}
                                      style={styles.checkIcon}
                                      resizeMode="contain"
                                    />
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View style={{marginLeft: 15}}>
                                  <TouchableOpacity
                                    style={styles.uncheckButton}
                                    onPress={() =>
                                      addSubTopicTaught(subtopic.st_id)
                                    }>
                                    <Image
                                      source={require('../../assets/uncheckedbox.png')}
                                      style={styles.uncheckIcon}
                                      resizeMode="contain"
                                    />
                                  </TouchableOpacity>
                                </View>
                              )}
                              <Text style={styles.subtopicText}>
                                {subtopic.st_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                )}
              />
            </>
          )}
          {pressedButton === 'button2' && (
            <>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: 10,
                  marginTop: 20,
                }}>
                Common Topics :
              </Text>
              <FlatList
                data={topics}
                style={styles.flatlist}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.listItem}>
                    {/* <Text style={styles.indexText}>CLO {index+1}:</Text> */}
                    <Text style={styles.topicText}>{item.t_name}</Text>
                    {isCommonTopic(item.t_id) ? (
                      <View>
                        <View style={styles.tickButton}>
                          {/* <Text>✔</Text> */}
                          <Image
                            source={require('../../assets/tick.png')}
                            style={styles.tickIcon}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                    ) : (
                      <Text>❌</Text>
                    )}
                  </View>
                )}
              />
            </>
          )}
          {pressedButton === 'button3' && (
            <>
              <View style={styles.container}>
                {/* <View style={styles.leftHalf}> */}
                <View style={styles.pickerContainer}>
                  <SelectList
                    setSelected={key => {
                      fetchTopicTaught(key);
                    }}
                    data={faculty}
                    save="f_name"
                    maxHeight={90}
                    placeholder="Select Teacher"
                    searchPlaceholder="Search"
                    boxStyles={styles.boxStyles}
                    inputStyles={styles.inputStyles}
                    dropdownStyles={{
                      backgroundColor: 'black',
                      borderColor: 'white',
                    }}
                    dropdownTextStyles={{color: 'white'}}
                  />
                </View>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginLeft: 10,
                    marginTop: 10,
                  }}>
                  Topics / Sub-topics :
                </Text>
                <FlatList
                  data={topics}
                  style={styles.progressflatlist}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View style={styles.progresslistItem}>
                      {/* <Text style={styles.indexText}>CLO {index+1}:</Text> */}
                      <Text style={styles.progresstopicText}>
                        {item.t_name}
                      </Text>
                      {isTopicTaught(item.t_id) && (
                        <View>
                          <View style={styles.tickButton}>
                            {/* <Text>✔</Text> */}
                            <Image
                              source={require('../../assets/tick.png')}
                              style={styles.tickIcon}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                />
                {/* </View> */}
                {/* <View style={styles.rightHalf}> */}
                {/* <ScrollView
                    horizontal={true}
                    style={{flex: 1, width: '100%'}}>
                    <View style={styles.item}>
                      <Text style={{fontSize: 20, color: 'black'}}>Item 1</Text>
                    </View>
                    <View style={styles.item}>
                      <Text style={{fontSize: 20, color: 'black'}}>Item 2</Text>
                    </View>
                    <View style={styles.item}>
                      <Text style={{fontSize: 20, color: 'black'}}>Item 3</Text>
                    </View>
                  </ScrollView> */}
              </View>
              {/* </View> */}
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 100,
    height: 30,
    backgroundColor: '#CDCDCD',
    borderRadius: 10,
    marginLeft: 2,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    // borderWidth: 2,
    // borderColor: 'black',
  },
  form: {
    flex: 1,
    marginTop: 70,
    // alignItems: 'center',
    // backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: 'auto',
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
    marginLeft: 20,
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#58FFAB',
    backgroundColor: '#CDCDCD',
    height: 'auto',
    width: '96%',
    marginLeft: '2%',
    marginTop: 3,
    borderRadius: 10,
    color: 'white',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  initiallistItem: {
    // flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#58FFAB',
    backgroundColor: '#CDCDCD',
    height: 'auto',
    width: '96%',
    marginLeft: '2%',
    marginTop: 3,
    borderRadius: 10,
    color: 'white',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  coveredlistItem: {
    // flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#58FFAB',
    backgroundColor: '#CDCDCD',
    height: 'auto',
    width: '96%',
    marginLeft: '2%',
    marginTop: 3,
    borderRadius: 10,
    color: 'white',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  progresslistItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#58FFAB',
    backgroundColor: '#CDCDCD',
    height: 'auto',
    width: '96%',
    marginLeft: '2%',
    marginTop: 3,
    borderRadius: 10,
    color: 'white',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 15,
    width: 320,
    flexWrap: 'wrap',
  },
  subtopicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
    marginLeft: 15,
    width: 320,
    flexWrap: 'wrap',
  },
  progresstopicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 15,
    width: 320,
    // borderWidth: 2,
    // borderColor: 'red',
    flexWrap: 'wrap',
  },
  indexText: {
    fontSize: 20,
    color: 'blue',
    marginLeft: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'white',
    height: 40,
    width: '33%',
    // marginRight: 25,
    borderWidth: 2,
    borderRadius: 7,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  subtopicButton: {
    // backgroundColor: 'white',
    marginLeft: 30,
  },
  subtopicContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#58FFAB',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
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
    marginTop: 10,
  },
  progressflatlist: {
    marginTop: 10,
    maxHeight: 400,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    // marginLeft: 10,
    // marginTop: 30,
    // borderWidth: 2,
    // borderColor: 'yellow',
    // justifyContent: 'flex-end',
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
  leftHalf: {
    flex: 1,
    // backgroundColor: 'red',
  },
  rightHalf: {
    flex: 1,
    // backgroundColor: 'blue',
  },
  pickerContainer: {
    borderWidth: 2,
    // borderColor: 'white',
    backgroundColor: 'black',
    width: '45%',
    justifyContent: 'center',
    marginLeft: '50%',
    // marginRight: 20,
  },
  boxStyles: {
    height: 'auto',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  inputStyles: {
    color: 'white',
    fontSize: 14,
  },
  tickButton: {
    padding: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  tickIcon: {
    height: 26,
    width: 27,
  },
  checkButton: {
    padding: 2,
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  checkIcon: {
    height: 30,
    width: 30,
  },
  uncheckButton: {
    padding: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  uncheckIcon: {
    height: 24,
    width: 24,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subtopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default FctScreen07;
