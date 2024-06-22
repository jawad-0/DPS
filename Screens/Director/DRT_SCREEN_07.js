import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ToastAndroid,
  TextInput,
  FlatList,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import {ip, port} from '../CONFIG';
// import SplashScreen from 'react-native-splash-screen';

const DrtScreen07 = ({route}) => {
  const navigation = useNavigation();
  const {term, paperId, courseId, questionId, difficulty} = route.params;
  const [paperheaderfaculty, setPaperHeaderFaculty] = useState('');
  const [paperheader, setPaperHeader] = useState([]);
  const [questions, setQuestion] = useState('');
  const [validMidCLOS, setValidMidCLOS] = useState([]);
  const [validFinalCLOS, setValidFinalCLOS] = useState([]);

  useEffect(() => {
    // console.log(paperId);
    console.log(difficulty);
    fetchAdditionalQuestions();
    fetchPaperHeader();
    fetchbyTerm(term);
  }, []);

  const matchDifficulty = item => {
    if (difficulty === item.q_difficulty) {
      return true;
    } else {
      ToastAndroid.show(
        `Question's Difficulty Doesn't Match "${difficulty}"`,
        ToastAndroid.SHORT,
      );
      return false;
    }
  };

  const handleSwappingStatus = item => {
    const id1 = questionId;
    const id2 = item.q_id;
    // console.log(id1);
    // console.log(id2);
    // console.log(paperId);
    if (!matchDifficulty(item)) {
      return;
    }
    const apiEndpoint = `http://${ip}:${port}/editswappingstatus`;
    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({paperId: paperId, id1: id1, id2: id2}),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          console.log('Success:', data.message);
          navigation.navigate('DrtScreen06', {paperId: paperId});
        } else {
          console.log('Error:', data.error || 'Something went wrong.');
        }
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  const fetchbyTerm = term => {
    if (term === 'Mid') {
      console.log('> Mid Paper');
      fetchValidMidCLOS(courseId);
    } else if (term === 'Final') {
      console.log('> Final Paper');
      fetchValidFinalCLOS(courseId);
    }
  };

  const fetchValidMidCLOS = courseId => {
    const apiEndpoint = `http://${ip}:${port}/getValidMidCLOS/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setValidMidCLOS(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchValidFinalCLOS = courseId => {
    const apiEndpoint = `http://${ip}:${port}/getValidFinalCLOS/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setValidFinalCLOS(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchAdditionalQuestions = () => {
    const apiEndpoint = `http://${ip}:${port}/getadditionalQuestion/${paperId}`;
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

  const fetchPaperHeader = () => {
    const apiEndpoint = `http://${ip}:${port}/getpaperheader/${paperId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        // setCourseId(data[0].c_id);
        // setCourseCode(data[0].c_code);
        // setCourseTitle(data[0].c_title);
        // setDuration(data[0].duration);
        // setDegree(data[0].degree);
        // setTerm(data[0].term);
        // setYear(data[0].year);
        // setExamDate(data[0].exam_date);
        // setSession(data[0].session);
        // setStatus(data[0].status);
        setPaperHeader(data[0]);
        fetchFacultyData(data[0].c_id);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchFacultyData = c_id => {
    const apiEndpoint = `http://${ip}:${port}/getpaperheaderfaculty/${c_id}`;
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

  return (
    <ImageBackground
      source={require('../../assets/drt_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate('DrtScreen06', {
                paperId: paperId,
              })
            }>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Additional Questions</Text>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 15,
            borderTopEndRadius: 15,
          }}>
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

          <View style={styles.courseInfo}>
            <ScrollView>
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
                <Text style={{maxWidth: 100}}>
                  {paperheaderfaculty.length > 0
                    ? paperheaderfaculty
                        .map(faculty => faculty.f_name)
                        .join(', ')
                    : ''}
                </Text>
              </Text>
            </ScrollView>
          </View>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            borderTopWidth: 1,
            borderTopColor: 'black',
          }}>
          <View style={styles.paperInfo}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  marginBottom: 5,
                }}>
                <Text style={styles.validCLOSText}>
                  <Text style={{color: 'blue'}}>Valid CLOS: </Text>
                </Text>
                {validMidCLOS.map((clo, index) => (
                  <Text key={index} style={styles.validCLOSText}>
                    {clo.clo_number}{' '}
                  </Text>
                ))}
                {validFinalCLOS.map((clo, index) => (
                  <Text key={index} style={styles.validCLOSText}>
                    {clo.clo_number}{' '}
                  </Text>
                ))}
              </View>
            </View>
            <Text style={{color: 'blue', fontWeight: 'bold'}}>
              Additional Questions :{' '}
            </Text>
            <FlatList
              data={questions}
              style={styles.flatlist}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View>
                  <View style={styles.listItem}>
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
                        [ {item.mapped_clos} ]
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      width: '100%',
                      borderBottomWidth: 2,
                      borderBottomColor: 'black',
                    }}>
                    <TouchableOpacity
                      style={styles.swapButton}
                      activeOpacity={0.8}
                      onPress={() => handleSwappingStatus(item)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.swapButtonText}>SWAP</Text>
                        <Image
                          source={require('../../assets/swap.png')}
                          style={styles.swapIcon}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
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
  flatlist: {
    // marginTop: 5,
    maxHeight: 530,
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
    // borderBottomWidth: 2,
    // borderBottomColor: 'black',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
    color: 'black',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
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
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    maxHeight: 80,
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
    marginTop: 10,
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
    width: 320,
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
    marginTop: 50,
    marginLeft: 20,
    color: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
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
  swapIcon: {
    height: 20,
    width: 20,
    marginLeft: 2,
    borderRadius: 10,
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
    marginTop: 5,
  },
  commentInput: {
    color: 'black',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 15,
    marginBottom: 5,
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
  swapButton: {
    backgroundColor: '#20B2AA',
    width: '20%',
    height: 25,
    textAlign: 'center',
    borderRadius: 7,
    justifyContent: 'center',
    marginBottom: 5,
  },
  swapButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  validCLOSText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});

export default DrtScreen07;
