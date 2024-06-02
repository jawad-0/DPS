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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import {Picker} from '@react-native-picker/picker';
import {RadioButton} from 'react-native-paper';
import {ip, port} from '../CONFIG';
import {SelectList} from 'react-native-dropdown-select-list';
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
  const [loading, setLoading] = useState(true);
  const [paperheader, setPaperHeader] = useState([]);
  const [paperheaderfaculty, setPaperHeaderFaculty] = useState([]);
  const [questions, setQuestion] = useState('');
  const [papers, setPapers] = useState('');
  const [questiontext, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [marks, setMarks] = useState('');
  const [paperId, setPaperID] = useState('');
  const [mode, setMode] = useState('add');

  useEffect(() => {
    fetchPaper();
  }, []);

  const handleAddOrUpdateQuestion = () => {
    if (mode === 'add') {
      addQuestion();
    } else if (mode === 'edit') {
      updateQuestion(questionID);
    }
  };

  const handleClear = () => {
    setQuestionText('');
    setDifficulty('');
    setMarks('');
    Keyboard.dismiss();
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const fetchData = paperID => {
    const apiEndpoint = `http://${ip}:${port}/getQuestion/${paperID}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setQuestion(data);
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

  const handleButtonClick = paperID => () => {
    setPaperID(paperID);
    fetchData(paperID);
    fetchPaperHeader(paperID);
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
      difficulty.trim() === '' ||
      marks.trim() === ''
    ) {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }

    const apiEndpoint = `http://${ip}:${port}/addQuestion`;

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q_text: questiontext,
        q_marks: marks,
        q_difficulty: difficulty,
        f_name: facultyName,
        t_id: 1,
        p_id: paperId,
        f_id: facultyId,
      }),
    })
      .then(response =>
        response.json().then(data => ({status: response.status, body: data})),
      )
      .then(({status, body}) => {
        if (status === 200) {
          console.log('Data posted successfully:', body);
          ToastAndroid.show('Added Successfully!', ToastAndroid.SHORT);
          Keyboard.dismiss();
          fetchPaper();
          fetchData(paperId);
          handleClear();
        } else {
          // console.error('Error from server:', body);
          ToastAndroid.show(`${body.error}`, ToastAndroid.LONG);
        }
      })
      .catch(error => {
        // console.error('Error posting data:', error);
        ToastAndroid.show('Failed to add paper.', ToastAndroid.LONG);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/dtc_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
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
              <Text style={{textDecorationLine: 'underline'}}>Duration</Text> :{' '}
              {paperheader.duration}{' '}
              <Text style={{textDecorationLine: 'underline'}}>Code</Text> :{' '}
              {paperheader.c_code}{' '}
              <Text style={{textDecorationLine: 'underline'}}>Degree</Text> :{' '}
              {paperheader.degree} {'\n'}
              <Text style={{textDecorationLine: 'underline'}}>
                Teachers
              </Text> :{' '}
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
              height: 210,
              marginLeft: '2%',
              marginTop: 3,
            }}>
            <Text style={styles.Text}>Question :</Text>
            <TextInput
              style={styles.input}
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
                defaultButtonText="Select"
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
              <Text style={[styles.Text, {marginRight: 10, marginLeft: 10}]}>
                Topic
              </Text>
              <TextInput
                style={styles.marksInput}
                placeholderTextColor={'gray'}
                onChangeText={text => setName(text)}
              />
            </View>
            <View style={styles.row2}>
              <View style={{flex: 2, flexDirection: 'row'}}>
                <Text style={[styles.Text, {marginRight: 10, marginLeft: 8}]}>
                  Marks
                </Text>
                <TextInput
                  style={styles.marksInput}
                  keyboardType="numeric"
                  placeholderTextColor={'gray'}
                  onChangeText={text => setMarks(text)}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 5,
                }}>
                <TouchableOpacity style={styles.imageButton}>
                  <Text style={styles.imageText}>IMAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddOrUpdateQuestion}>
                  <Text style={styles.addText}>ADD</Text>
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
                <View style={styles.listItem}>
                  <View style={styles.column}>
                    <Text style={styles.data_text}>
                      Question # {index + 1} :
                    </Text>
                    <Text style={styles.data_text}>{item.q_text}</Text>
                    <Text style={styles.data_difficulty}>
                      [ {item.q_difficulty}, Marks: {item.q_marks} ]
                    </Text>
                    <Text style={styles.data_difficulty}>
                      [ {item.f_name} ]
                    </Text>
                  </View>
                </View>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'black',
  },
  modalView: {
    margin: 20,
    marginTop: '70%',
    backgroundColor: 'black',
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    color: 'black',
    fontSize: 20,
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
    maxHeight: 360,
  },
  data_text: {
    color: 'black',
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
  marksInput: {
    height: 41,
    width: '27%',
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#E6E6FA',
  },
  column: {
    flex: 1,
  },
  uniInfoStart: {
    marginLeft: '2%',
    marginTop: 10,
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
  },
  uniInfo: {
    marginTop: 10,
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
    marginTop: 10,
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
    backgroundColor: '#E6E6FA',
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
    backgroundColor: 'blue',
    borderWidth: 2,
    height: 35,
    borderColor: 'white',
    padding: 5,
    borderRadius: 10,
  },
  imageText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'green',
    borderWidth: 2,
    height: 35,
    borderColor: 'white',
    padding: 5,
    borderRadius: 10,
    marginLeft: '1%',
  },
  addText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  Text: {
    fontSize: 20,
    height: 40,
    color: 'white',
    fontWeight: 'bold',
    // borderWidth: 1,
    // borderColor: 'yellow',
    textAlignVertical: 'center',
  },
  picker: {
    width: 80,
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 10,
    borderWidth: 10,
    borderColor: 'red',
  },
  dropdownButtonStyle: {
    width: '27%',
    height: 40,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdownButtonTextStyle: {
    textAlign: 'center',
  },
  dropdownMenuStyle: {
    backgroundColor: '#EFEFEF',
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
  row1: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: 'green',
    justifyContent: 'center',
    height: 41,
  },
  row2: {
    flexDirection: 'row',
    height: 41,
    justifyContent: 'center',
    marginTop: 5,
  },
});

export default FctScreen08;
