import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  ToastAndroid,
  TextInput,
  Keyboard,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Platform,
  BackHandler,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'react-native-image-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import {RadioButton} from 'react-native-paper';
import {ip, port} from '../CONFIG';
import MultiSelect from 'react-native-multiple-select';
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';

// import SplashScreen from 'react-native-splash-screen';

const FctScreen08 = ({route}) => {
  const navigation = useNavigation();
  const {
    courseId,
    courseName,
    courseCode,
    facultyId,
    facultyName,
    facultyRole,
  } = route.params;
  const [modalVisible, setModalVisible] = useState(true);
  const [topicmodalVisible, setTopicModalVisible] = useState(false);
  const [questionmodalVisible, setQuestionModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paperheader, setPaperHeader] = useState([]);
  const [paperheaderfaculty, setPaperHeaderFaculty] = useState([]);
  const [questions, setQuestion] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questiontopics, setQuestionTopics] = useState([]);
  const [papers, setPapers] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [questiontext, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [marks, setMarks] = useState('');
  const [paperId, setPaperID] = useState('');
  const [mode, setMode] = useState('add');
  const [selectedImage, setSelectedImage] = useState(null);
  const [topicId, setSelectedTopic] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  //   const onSelectedItemsChange = selectedItems => {
  //     console.log(selectedItems);
  //     setSelectedTopics(selectedItems);
  //   };

  //   const onSelectedItemsChange = (selectedItems) => {
  //     console.log(selectedItems);
  //     // if (selectedTopics.includes(item)) {
  //     //     setSelectedTopics(selectedTopics.filter(id => id !== item));
  //     // } else {
  //     //     setSelectedTopics([...selectedTopics, item]);
  //     // }
  //     // console.log(selectedTopics);
  //   };

  useEffect(() => {
    fetchPaper();
    console.log(`${facultyName} -> Creating Questions`);
    setSelectedItems(selectedTopics);
    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   handleBackButtonPress,
    // );
    // return () => backHandler.remove();
  }, []);

  const onSelectedItemsChange = selectedItems => {
    // console.log("Selected items (onSelectedItemsChange): ", selectedItems);
    setSelectedTopics(selectedItems);
    setSelectedItems(selectedItems);
    console.log('Updated selected topics state: ', selectedTopics);
  };

  //  const handleBackButtonPress = () => {
  //    if (modalVisible) {
  //      setModalVisible(false);
  //      navigation.navigate('FctScreen02'); // Replace 'YourScreenName' with the screen you want to navigate to
  //      return true; // Prevent default behavior (closing the app)
  //    }
  //    return false; // Allow default behavior if modal is not visible
  //  };

  const handleAddOrUpdateQuestion = () => {
    if (mode === 'add') {
      addQuestion();
    } else if (mode === 'edit') {
      updateQuestion(questionId);
    }
  };

  const chooseImage = () => {
    Keyboard.dismiss();
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const selectedUri = response.assets[0].uri;
        setSelectedImage(selectedUri);
        console.log(selectedUri);
      }
    });
  };

  const handleClear = () => {
    setQuestionText('');
    setSelectedImage(null);
    setDifficulty(null);
    setSelectedTopic(null);
    setMarks('');
    Keyboard.dismiss();
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const handleCantEdit = () => {
    handleClear();
    ToastAndroid.show(`Can't Edit Others Question.`, ToastAndroid.SHORT);
  };

  const handleEdit = item => {
    setMode('edit');
    const questionId = item.q_id;
    const getTopicsEndpoint = `http://${ip}:${port}/getQuestionTopics/${questionId}`;
    fetch(getTopicsEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch question topics: ${response.status}`,
          );
        }
        return response.json();
      })
      .then(data => {
        const topics = data.map(topic => topic.t_id);
        setSelectedTopics(topics);
        const getQuestionEndpoint = `http://${ip}:${port}/getsinglequestion/${questionId}`;
        fetch(getQuestionEndpoint)
          .then(response => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch question details: ${response.status}`,
              );
            }
            return response.json();
          })
          .then(data => {
            if (data.length > 0) {
              const question = data[0];
              console.log(question);
              setQuestionId(question.q_id);
              setQuestionText(question.q_text);
              setMarks(question.q_marks.toString());
              setDifficulty(question.q_difficulty);
            } else {
              console.error('No question data found');
            }
          })
          .catch(error => {
            console.error('Error fetching question details:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching question topics:', error);
      });
  };

  const fetchQuestions = paperID => {
    const apiEndpoint = `http://${ip}:${port}/getQuestion/${paperID}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setQuestion(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchQuestionTopics = questionId => {
    const apiEndpoint = `http://${ip}:${port}/getQuestiontopics/${questionId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setQuestionTopics(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchTopics = courseId => {
    const apiEndpoint = `http://${ip}:${port}/gettopic/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        const transformedData = data.map(topic => ({
          key: topic.t_id,
          value: topic.t_name,
        }));
        setTopics(transformedData);
        console.log('Data fetched successfully:', transformedData);
        // setTopics(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchPaper = () => {
    const apiEndpoint = `http://${ip}:${port}/getPapers/${courseId}`;
    Keyboard.dismiss();
    setLoading(true);
    // setModalVisible(true);
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setPapers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleButtonClick = paperId => () => {
    setPaperID(paperId);
    fetchQuestions(paperId);
    fetchPaperHeader(paperId);
    fetchTopics(courseId);
    fetchfacultyData(courseId);
    setModalVisible(false);
  };

  //   const hasMidTerm = papers.some(paper => paper.term === 'Mid');
  //   const hasFinalTerm = papers.some(paper => paper.term === 'Final');

  const hasMidTerm =
    Array.isArray(papers) && papers.some(paper => paper.term === 'Mid');
  const hasFinalTerm =
    Array.isArray(papers) && papers.some(paper => paper.term === 'Final');

  const handleView = () => {
    console.log('View Button Clicked!');
  };

  const fetchPaperHeader = paperID => {
    const apiEndpoint = `http://${ip}:${port}/getpaperheader/${paperID}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setPaperHeader(data[0]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchfacultyData = () => {
    const apiEndpoint = `http://${ip}:${port}/getpaperheaderfaculty/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setPaperHeaderFaculty(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const addQuestion = () => {
    setMode('add');
    if (
      questiontext.trim() === '' ||
      marks.trim() === '' ||
      !difficulty ||
      selectedTopics.length === 0
    ) {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }

    const apiEndpoint = `http://${ip}:${port}/addQuestion`;

    const formData = new FormData();
    formData.append('q_text', questiontext);
    formData.append('q_marks', marks);
    formData.append('q_difficulty', difficulty);
    formData.append('f_name', facultyName);
    formData.append('p_id', paperId);
    formData.append('f_id', facultyId);
    // Append each topic ID separately
    selectedTopics.forEach(topicId => {
      formData.append('t_ids[]', topicId);
    });

    if (selectedImage) {
      const filename = selectedImage.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append('q_image', {
        uri: selectedImage,
        name: filename,
        type: type,
      });
    }

    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response =>
        response.json().then(data => ({status: response.status, body: data})),
      )
      .then(({status, body}) => {
        if (status === 200) {
          console.log('Data posted successfully:', body);
          ToastAndroid.show('Added Successfully!', ToastAndroid.SHORT);
          fetchPaper();
          fetchQuestions(paperId);
          handleClear();
        } else {
          ToastAndroid.show(`${body.error}`, ToastAndroid.LONG);
        }
      })
      .catch(error => {
        ToastAndroid.show('Failed to add paper.', ToastAndroid.LONG);
      });
  };

  const updateQuestion = questionId => {
    if (questiontext.trim() === '' || marks.trim() === '' || !difficulty) {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }

    const apiEndpoint = `http://${ip}:${port}/editQuestion/${questionId}`;

    const formData = new FormData();
    formData.append('q_text', questiontext);
    formData.append('q_marks', marks);
    formData.append('q_difficulty', difficulty);
    // Append each topic ID separately
    selectedTopics.forEach(topicId => {
      formData.append('t_ids[]', topicId);
    });

    if (selectedImage) {
      const filename = selectedImage.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append('q_image', {
        uri: selectedImage,
        name: filename,
        type: type,
      });
    }

    fetch(apiEndpoint, {
      method: 'PUT',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response =>
        response.json().then(data => ({status: response.status, body: data})),
      )
      .then(({status, body}) => {
        if (status === 200) {
          console.log('Question updated successfully:', body);
          ToastAndroid.show('Updated Successfully!', ToastAndroid.SHORT);
          fetchPaper();
          fetchQuestions(paperId);
          handleClear();
        } else {
          ToastAndroid.show(`${body.error}`, ToastAndroid.LONG);
        }
      })
      .catch(error => {
        ToastAndroid.show('Failed to update question.', ToastAndroid.LONG);
      });
  };

  //   const addQuestion = () => {
  //     setMode('add');
  //     if (
  //       questiontext.trim() === '' ||
  //       difficulty.trim() === '' ||
  //       marks.trim() === ''
  //     ) {
  //       ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
  //       return;
  //     }
  //     const apiEndpoint = `http://${ip}:${port}/addQuestion`;
  //     fetch(apiEndpoint, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         q_text: questiontext,
  //         q_marks: marks,
  //         q_difficulty: difficulty,
  //         f_name: facultyName,
  //         t_id: 1,
  //         p_id: paperId,
  //         f_id: facultyId,
  //       }),
  //     })
  //       .then(response =>
  //         response.json().then(data => ({status: response.status, body: data})),
  //       )
  //       .then(({status, body}) => {
  //         if (status === 200) {
  //           console.log('Data posted successfully:', body);
  //           ToastAndroid.show('Added Successfully!', ToastAndroid.SHORT);
  //           Keyboard.dismiss();
  //           fetchPaper();
  //           fetchQuestions(paperId);
  //           handleClear();
  //         } else {
  //           // console.error('Error from server:', body);
  //           ToastAndroid.show(`${body.error}`, ToastAndroid.LONG);
  //         }
  //       })
  //       .catch(error => {
  //         // console.error('Error posting data:', error);
  //         ToastAndroid.show('Failed to add paper.', ToastAndroid.LONG);
  //       });
  //   };

  return (
    <ImageBackground
      source={require('../../assets/fct_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            navigation.navigate('FctScreen02', {
              courseId: courseId,
              courseName: courseName,
              courseCode: courseCode,
              facultyId: facultyId,
              facultyRole: facultyRole,
            });
          }}>
          <View style={styles.modalView}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {papers.map((paper, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalbutton}
                    activeOpacity={0.8}
                    onPress={handleButtonClick(paper.p_id)}>
                    <Text style={styles.modalText}>{paper.term} Term</Text>
                  </TouchableOpacity>
                ))}
                {!hasMidTerm && (
                  <TouchableOpacity
                    style={styles.emptymodalbutton}
                    activeOpacity={0.8}>
                    <Text style={styles.modalText}>No Mid Term</Text>
                  </TouchableOpacity>
                )}
                {!hasFinalTerm && (
                  <TouchableOpacity
                    style={styles.emptymodalbutton}
                    activeOpacity={0.8}>
                    <Text style={styles.modalText}>No Final Term</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={topicmodalVisible}>
          <View style={styles.topicmodalView}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <MultipleSelectList
                  setSelected={onSelectedItemsChange}
                  data={topics}
                  save="key"
                  label="Selected Topics"
                  placeholder="Select Topics"
                  boxStyles={{backgroundColor: 'white', width: '100%'}}
                  inputStyles={{color: 'black'}}
                  dropdownStyles={{
                    backgroundColor: 'white',
                    borderColor: 'black',
                  }}
                  dropdownTextStyles={{color: 'black'}}
                  labelStyles={{color: 'black'}}
                />
              </>
            )}
            {questiontopics.length > 0 ? (
              questiontopics.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.questionmodalbutton}
                  activeOpacity={0.8}>
                  <Text style={styles.questionmodalText}>{topic.t_name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={styles.questionmodalbutton}
                activeOpacity={0.8}>
                <Text style={styles.questionmodalText}>No topics mapped!</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.8}
              onPress={() => {
                console.log(selectedTopics);
                setTopicModalVisible(false);
              }}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={questionmodalVisible}>
          <View style={styles.questionmodalView}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {questiontopics.length > 0 ? (
                  questiontopics.map((topic, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.questionmodalbutton}
                      activeOpacity={0.8}>
                      <Text style={styles.questionmodalText}>
                        {topic.t_name}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TouchableOpacity
                    style={styles.questionmodalbutton}
                    activeOpacity={0.8}>
                    <Text style={styles.questionmodalText}>
                      No topics mapped!
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.8}
              onPress={() => {
                setQuestionModalVisible(false);
              }}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

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
          <Text style={styles.headerText}>Paper Setting</Text>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          {!modalVisible && (
            <View style={{flexDirection: 'row'}}>
              <View style={styles.uniInfoStart}>
                <Image
                  source={require('../../assets/barani.png')}
                  style={styles.baraniIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.uniInfo}>
                <Text style={styles.uniInfoText}>
                  Barani Institute of Information Technology
                </Text>
                <Text style={styles.uniInfoText}>
                  PMAS Arid Agriculture University,
                </Text>
                <Text style={styles.uniInfoText}>Rawalpindi Pakistan</Text>
                <Text style={styles.uniInfoText}>
                  {paperheader.session} {paperheader.year} : {paperheader.term}{' '}
                  Term Examination
                </Text>
              </View>
              <View style={styles.uniInfoEnd}>
                <Image
                  source={require('../../assets/barani.png')}
                  style={styles.baraniIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}

          {!modalVisible && (
            <View style={styles.courseInfo}>
              <Text style={styles.courseInfoText}>
                <Text style={{textDecorationLine: 'underline'}}>
                  Course Title
                </Text>{' '}
                : {paperheader.c_title}
              </Text>
              <Text style={styles.courseInfoText}>
                <Text style={{textDecorationLine: 'underline'}}>
                  Date Of Exam
                </Text>{' '}
                : {paperheader.exam_date}{' '}
                <Text style={{textDecorationLine: 'underline'}}>Duration</Text>{' '}
                : {paperheader.duration}{' '}
                <Text style={{textDecorationLine: 'underline'}}>Code</Text> :{' '}
                {paperheader.c_code}{' '}
                <Text style={{textDecorationLine: 'underline'}}>Degree</Text> :{' '}
                {paperheader.degree} {'\n'}
                <Text style={{textDecorationLine: 'underline'}}>
                  Teachers
                </Text>{' '}
                :{' '}
                {paperheaderfaculty.length > 0
                  ? paperheaderfaculty.map(faculty => faculty.f_name).join(', ')
                  : ''}
              </Text>
            </View>
          )}

          {!modalVisible && (
            <View
              style={{
                backgroundColor: 'black',
                width: '96%',
                height: 200,
                marginLeft: '2%',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                borderRightWidth: 2,
                borderRightColor: 'white',
                borderLeftWidth: 2,
                borderLeftColor: 'white',
              }}>
              <Text style={styles.questionText}>Question</Text>
              <TextInput
                style={styles.input}
                value={questiontext}
                placeholder="Enter Question"
                placeholderTextColor={'gray'}
                onChangeText={text => setQuestionText(text)}
              />
              <View style={styles.row1}>
                <Text style={[styles.Text, {marginRight: 10}]}>Difficulty</Text>
                <SelectDropdown
                  data={difficultyOptions}
                  onSelect={(selectedItem, index) => {
                    setDifficulty(selectedItem);
                    console.log(selectedItem, index);
                  }}
                  defaultButtonText={difficulty || 'Select'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={styles.dropdownButtonStyle}
                  buttonTextStyle={styles.dropdownButtonTextStyle}
                  dropdownStyle={styles.dropdownMenuStyle}
                  rowStyle={styles.dropdownRowStyle}
                  rowTextStyle={styles.dropdownRowTextStyle}
                  renderDropdownIcon={() => (
                    <View style={styles.dropdownIcon}>
                      <Image
                        source={require('../../assets/arrow3.png')}
                        style={styles.dropdownIconStyle}
                      />
                    </View>
                  )}
                />
                <Text style={[styles.Text, {marginRight: 10, marginLeft: 16}]}>
                  Marks
                </Text>
                <TextInput
                  style={styles.marksInput}
                  value={marks}
                  keyboardType="numeric"
                  // placeholder='--'
                  placeholderTextColor={'gray'}
                  onChangeText={text => setMarks(text)}
                />
              </View>
              <View style={styles.row2}>
                <View style={{flex: 3, flexDirection: 'row'}}>
                  <Text
                    style={[styles.Text, {marginRight: 10, marginLeft: 25}]}>
                    Topic
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTopicModalVisible(true)}
                    style={{
                      backgroundColor: '#E6E6FA',
                      borderRadius: 8,
                      width: '35%',
                      height: 27,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text style={{color: 'black', fontSize: 18}}>Select</Text>
                  </TouchableOpacity>
                  {/* <SelectDropdown
                    data={topics}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem.t_id, index);
                      setSelectedTopic(selectedItem.t_id);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.t_name; // Display selected topic name
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.t_name; // Display topic names in dropdown
                    }}
                    defaultButtonText="Select"
                    buttonStyle={styles.dropdownButtonStyle2}
                    buttonTextStyle={styles.dropdownButtonTextStyle2}
                    dropdownStyle={styles.dropdownMenuStyle2}
                    rowStyle={styles.dropdownRowStyle2}
                    rowTextStyle={styles.dropdownRowTextStyle2}
                    renderDropdownIcon={() => (
                      <View style={styles.dropdownIcon2}>
                        <Image
                          source={require('../../assets/arrow3.png')}
                          style={styles.dropdownIconStyle2}
                        />
                      </View>
                    )}
                  /> */}
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.Text, {marginRight: 10}]}>Image</Text>
                  <TouchableOpacity
                    style={styles.imageButton}
                    activeOpacity={0.8}
                    onPress={chooseImage}>
                    <Image
                      source={require('../../assets/gallery.png')}
                      style={styles.galleryIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.8}
                    onPress={handleAddOrUpdateQuestion}>
                    <Text style={styles.addText}>
                      {mode === 'add' ? 'ADD' : 'UPDATE'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {!modalVisible && (
            <View style={styles.paperInfo}>
              <FlatList
                data={questions}
                style={styles.flatlist}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    activeOpacity={0.5}
                    onPress={() => {
                      setQuestionModalVisible(true),
                        fetchQuestionTopics(item.q_id);
                    }}>
                    <View style={styles.column}>
                      <Text style={styles.data_text}>
                        Question # {index + 1} :
                      </Text>
                      <Text style={styles.data_text}>{item.q_text}</Text>
                      {item.imageData && (
                        <Image
                          source={{
                            uri: `data:image/jpeg;base64,${item.imageData}`,
                          }}
                          style={styles.image}
                        />
                      )}
                      <Text style={styles.data_difficulty}>
                        [ {item.q_difficulty}, Marks: {item.q_marks} ]
                      </Text>
                      <Text style={styles.data_difficulty}>
                        [ {item.f_name} ]
                      </Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                      {facultyId === item.f_id ? (
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEdit(item)}>
                          <Image
                            source={require('../../assets/edit_icon.png')}
                            style={styles.editIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={handleCantEdit}>
                          <Image
                            source={require('../../assets/red_edit_icon.png')}
                            style={styles.editIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          {/* {!modalVisible && (
          <View style={styles.buttonscontainer2}>
            <TouchableOpacity
              style={styles.topicButton}
              onPress={() =>
                navigation.navigate('DrtScreen08', {
                  courseId,
                  coursecode,
                  coursetitle,
                })
              }>
              <Text style={styles.viewText}>View Topics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.approveButton} onPress={handleView}>
              <Text style={styles.viewText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )} */}
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
    // backgroundColor: 'black',
  },
  modalView: {
    margin: 20,
    marginTop: '70%',
    backgroundColor: '#E6E6FA',
    borderRadius: 20,
    width: '60%',
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: 'white',
    // borderWidth: 2,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  modalText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topicmodalView: {
    margin: 20,
    marginTop: '69%',
    backgroundColor: '#E6E6FA',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    width: '90%',
    // height: 550,
    height: 'auto',
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: 'white',
    // borderWidth: 2,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  questionmodalView: {
    marginTop: '69%',
    backgroundColor: '#E6E6FA',
    borderRadius: 20,
    width: '90%',
    padding: 5,
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: 'white',
    // borderWidth: 2,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  questionmodalText: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
  },
  flatlist: {
    // marginTop: 5,
    maxHeight: 385,
  },
  data_text: {
    color: 'black',
    fontWeight: 'bold',
  },
  data_difficulty: {
    color: 'black',
    textAlign: 'right',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
    color: 'black',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    height: 70,
    width: '95%',
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#E6E6FA',
  },
  topicsInput: {
    height: 41,
    width: '27%',
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#E6E6FA',
  },
  marksInput: {
    height: 30,
    width: '15%',
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 20,
    paddingVertical: 0,
    paddingHorizontal: 8,
    lineHeight: 20,
    color: 'black',
    backgroundColor: '#E6E6FA',
  },
  column: {
    flex: 1,
  },
  uniInfoStart: {
    marginLeft: '2%',
    // marginTop: 10,
    width: '13%',
    justifyContent: 'center',
    backgroundColor: 'white',
    // borderRadius: 10,
    // borderColor: 'white',
    // borderWidth: 1,
    // padding: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderTopLeftRadius: 15,
  },
  uniInfo: {
    // marginTop: 10,
    width: '70%',
    backgroundColor: 'white',
    // borderRadius: 10,
    // borderColor: 'white',
    // borderWidth: 1,
    padding: 3,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  uniInfoEnd: {
    // marginTop: 10,
    marginLeft: -0.4,
    width: '13%',
    justifyContent: 'center',
    backgroundColor: 'white',
    // borderRadius: 10,
    // borderColor: 'blue',
    // borderWidth: 1,
    // padding: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderTopRightRadius: 15,
  },
  uniInfoText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
  },
  courseInfo: {
    marginLeft: '2%',
    width: '96%',
    backgroundColor: 'white',
    // borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
  },
  label: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
  },
  courseInfoText: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  data: {
    color: 'yellow',
  },
  data_faculty: {
    color: 'cyan',
  },
  paperInfo: {
    marginTop: 3,
    marginLeft: 5,
    borderRadius: 10,
    width: '96%',
    marginLeft: '2%',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    padding: 3,
  },
  headerText: {
    height: 70,
    width: 310,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    // fontFamily: 'FuzzyBubbles-Regular',
    textAlign: 'center',
    color: 'white',
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
  modalbutton: {
    backgroundColor: '#58FFAB',
    padding: 10,
    height: 60,
    width: 180,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: 'black',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  questionmodalbutton: {
    backgroundColor: 'white',
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 7,
    borderColor: 'black',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptymodalbutton: {
    backgroundColor: '#FAA0A0',
    padding: 10,
    height: 60,
    width: 180,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#E6E6FA',
    padding: 10,
    height: 105,
    width: 185,
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonscontainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  buttonscontainer2: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptButton: {
    width: 70,
    height: 20,
    borderRadius: 5,
    marginRight: 5,
    backgroundColor: 'green',
    justifyContent: 'center',
  },
  rejectButton: {
    width: 70,
    height: 20,
    borderRadius: 5,
    backgroundColor: 'red',
    justifyContent: 'center',
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
  galleryIcon: {
    height: 30,
    width: 30,
    borderRadius: 10,
  },
  commentButton: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 30,
    width: 25,
    marginRight: 20,
    // borderWidth: 2,
    // borderColor: 'white',
  },
  baraniIcon: {
    height: 50,
    width: 40,
    alignSelf: 'center',
  },
  topicButton: {
    width: '40%',
    height: 40,
    alignSelf: 'center',
    marginLeft: '8%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  approveButton: {
    width: '40%',
    height: 40,
    alignSelf: 'center',
    marginLeft: '4%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  viewIcon: {
    height: 30,
    width: 30,
  },
  radioButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  radioButton: {
    flexDirection: 'row',
    width: 80,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  radioText: {
    marginLeft: 8,
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentBox: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 15,
    marginTop: 5,
  },
  commentInput: {
    color: 'black',
  },
  imageButton: {
    backgroundColor: 'white',
    height: 30,
    borderColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    width: 30,
  },
  imageText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#58FFAB',
    borderWidth: 1,
    height: 30,
    borderColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    width: '70%',
    marginLeft: '20%',
    marginRight: '10%',
  },
  addText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 17,
    height: 30,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    // borderWidth: 1,
    // borderColor: 'yellow',
    textAlignVertical: 'center',
  },
  Text: {
    fontSize: 17,
    height: 30,
    color: 'white',
    fontWeight: 'bold',
    // borderWidth: 1,
    // borderColor: 'yellow',
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
  picker: {
    width: 80,
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 10,
    borderWidth: 10,
    borderColor: 'red',
  },
  // -------- Dropdown 1 Styles
  dropdownButtonStyle: {
    width: '27%',
    height: 30,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdownButtonTextStyle: {
    textAlign: 'center',
  },
  dropdownMenuStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 15,
  },
  dropdownRowStyle: {
    backgroundColor: '#FFF',
    borderBottomColor: '#C5C5C5',
  },
  dropdownRowTextStyle: {
    textAlign: 'center',
  },
  dropdownIconStyle: {
    width: 15,
    height: 15,
  },
  dropdownIcon: {
    alignSelf: 'center',
  },
  // -------- Dropdown 2 Styles
  dropdownButtonStyle2: {
    width: '36%',
    height: 30,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdownButtonTextStyle2: {
    textAlign: 'center',
  },
  dropdownMenuStyle2: {
    backgroundColor: '#E6E6FA',
    width: 300,
    borderRadius: 15,
  },
  dropdownRowStyle2: {
    backgroundColor: '#FFF',
    borderBottomColor: '#C5C5C5',
    borderRadius: 15,
  },
  dropdownRowTextStyle2: {
    textAlign: 'center',
  },
  dropdownIconStyle2: {
    width: 15,
    height: 15,
  },
  dropdownIcon2: {
    alignSelf: 'center',
  },
  row1: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: 'green',
    justifyContent: 'center',
    height: 40,
  },
  row2: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    marginTop: 5,
    // borderWidth: 2,
    // borderColor: 'yellow',
  },
  row3: {
    flexDirection: 'row',
    height: 40,
    marginTop: 5,
    // borderWidth: 2,
    // borderColor: 'yellow',
  },
  image: {
    width: 250,
    height: 150,
    marginTop: 20,
    marginBottom: 20,
    // borderWidth: 1,
    // alignSelf: 'center',
    // borderColor: 'black',
    resizeMode: 'contain',
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 3,
    width: 70,
    marginTop: 15,
    marginBottom: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    marginLeft: 5,
    marginTop: 40,
    // borderWidth: 1,
    // borderColor: 'black',
    justifyContent: 'center',
  },
  editButton: {
    // backgroundColor: 'blue',
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  editIcon: {
    height: 18,
    width: 18,
  },
});

export default FctScreen08;
