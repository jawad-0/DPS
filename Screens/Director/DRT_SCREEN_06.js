import React, {useState, useEffect, useCallback} from 'react';
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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import {ip, port} from '../CONFIG';
// import SplashScreen from 'react-native-splash-screen';

const DrtScreen06 = ({route}) => {
  const navigation = useNavigation();
  const {paperId} = route.params;
  const [acceptOptions, setAcceptOptions] = useState([]);
  const [rejectOptions, setRejectOptions] = useState([]);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [commentInputs, setCommentInputs] = useState([]);
  const [comments, setComments] = useState('');
  const [paperheaderfaculty, setPaperHeaderFaculty] = useState('');
  const [questionsCount, setQuestionsCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [courseId, setCourseId] = useState('');
  const [coursetitle, setCourseTitle] = useState('');
  const [coursecode, setCourseCode] = useState('');
  const [duration, setDuration] = useState('');
  const [degree, setDegree] = useState('');
  const [term, setTerm] = useState('');
  const [year, setYear] = useState('');
  const [examdate, setExamDate] = useState('');
  const [session, setSession] = useState('');
  const [status, setStatus] = useState('');
  const [questions, setQuestion] = useState('');
  const [validMidCLOS, setValidMidCLOS] = useState([]);
  const [validFinalCLOS, setValidFinalCLOS] = useState([]);
  const [selectedCLOS, setSelectedCLOS] = useState([]);

  useEffect(() => {
    fetchQuestions();
    fetchPaperHeader();
    fetchQuestionsCount(paperId);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchQuestions();
      fetchPaperHeader();
      fetchQuestionsCount(paperId);
    }, [paperId]),
  );

  const handleApprove = () => {
    // const hasRejectedQuestions = Object.values(rejectOptions).some(
    //   value => value === true,
    // );
    // if (hasRejectedQuestions) {
    //   addFeedback();
    // }
  };

  //   const handleOptionSelect = (q_id, option) => {
  //     if (option === 'accept') {
  //       setAcceptOptions(prevOptions => ({
  //         ...prevOptions,
  //         [q_id]: true,
  //       }));
  //       setRejectOptions(prevOptions => ({
  //         ...prevOptions,
  //         [q_id]: false,
  //       }));
  //     } else if (option === 'reject') {
  //       setRejectOptions(prevOptions => ({
  //         ...prevOptions,
  //         [q_id]: true,
  //       }));
  //       setAcceptOptions(prevOptions => ({
  //         ...prevOptions,
  //         [q_id]: false,
  //       }));
  //     }
  //   };

  const handleAdditional = item => {
    navigation.navigate('DrtScreen07', {
      term: term,
      paperId: paperId,
      courseId: courseId,
      questionId: item.q_id,
      difficulty: item.q_difficulty,
      mapped_clos: item.mapped_clos,
    });
  };

  const handleOptionSelect = (q_id, option) => {
    if (option === 'accept') {
      setAcceptOptions(prevOptions => {
        if (rejectOptions[q_id]) {
          setRejectedCount(prevCount => prevCount - 1);
        }
        if (!prevOptions[q_id]) {
          setAcceptedCount(prevCount => prevCount + 1);
          setSelectedCount(prevCount => prevCount + 1);
        }
        return {
          ...prevOptions,
          [q_id]: true,
        };
      });
      setRejectOptions(prevOptions => ({
        ...prevOptions,
        [q_id]: false,
      }));
    } else if (option === 'reject') {
      setRejectOptions(prevOptions => {
        if (acceptOptions[q_id]) {
          setAcceptedCount(prevCount => prevCount - 1);
          setSelectedCount(prevCount => prevCount - 1);
        }
        if (!prevOptions[q_id]) {
          setRejectedCount(prevCount => prevCount + 1);
        }
        return {
          ...prevOptions,
          [q_id]: true,
        };
      });
      setAcceptOptions(prevOptions => ({
        ...prevOptions,
        [q_id]: false,
      }));
    }
  };

  //  const approve = () => {
  //    console.log(`Accepted : ${acceptedCount}`);
  //    console.log(`Rejected : ${rejectedCount}`);
  //  };

  const handleCommentChange = (q_id, text) => {
    setCommentInputs(prevInputs => ({
      ...prevInputs,
      [q_id]: text,
    }));
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

  const fetchSelectedQuestionCLOS = checkedQuestions => {
    // console.log(questionIds);
    const apiEndpoint = `http://${ip}:${port}/getSelectedQuestionCLOS/${checkedQuestions.join(
      ',',
    )}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        if (data && data.clo_numbers) {
          const cloNumbers = data.clo_numbers.split(',');
          setSelectedCLOS(cloNumbers);
        }
        // console.log('CLO numbers fetched successfully:', data);
      })
      .catch(error => {
        console.error('Error fetching CLO numbers:', error);
      });
  };

  const fetchQuestionsCount = paperId => {
    const apiEndpoint = `http://${ip}:${port}/getNumberOfQuestions/${paperId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const numberOfQuestions = data[0].no_of_questions;
          setQuestionsCount(numberOfQuestions);
        }
        // console.log('Data fetched successfully:', data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const checkCountBeforeSubmission = () => {
    if (acceptedCount === questionsCount) {
      return true;
    } else {
      ToastAndroid.show(
        `Count Doesn't Match Number Of Questions: "${questionsCount}"`,
        ToastAndroid.SHORT,
      );
      return false;
    }
  };

  const checkMissingCLOS = () => {
    let missingCLOs = [];
    if (term == 'Mid') {
      missingCLOs = validMidCLOS.filter(
        clo => !selectedCLOS.includes(clo.clo_number),
      );
    } else if (term == 'Final') {
      missingCLOs = validFinalCLOS.filter(
        clo => !selectedCLOS.includes(clo.clo_number),
      );
    }
    if (missingCLOs.length > 0) {
      let missingCLONumbers = missingCLOs.map(clo => clo.clo_number).join(', ');
      console.log('Missing CLO numbers:', missingCLONumbers);
      ToastAndroid.show(
        'Missing CLO numbers: ' + missingCLONumbers,
        ToastAndroid.SHORT,
      );
      return false;
    } else {
      console.log('All required CLOs are present.');
      return true;
    }
  };

  const handlePaperApprove = () => {
    // if (checkedQuestions.length > 0) {
    //   fetchSelectedQuestionCLOS(checkedQuestions);
    // }
    if (!checkCountBeforeSubmission()) {
      return;
    }
    // if (!checkMissingCLOS()) {
    //   return;
    // }
    const apiEndpoint = `http://${ip}:${port}/edituploadedquestionstatus`;
    const acceptedQIds = Object.keys(acceptOptions).filter(
      key => acceptOptions[key],
    );
    const data = {
      acceptedQIds,
    };
    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update question status.');
        }
        return response.json();
      })
      .then(body => {
        console.log('Data posted successfully:', body);
        fetchQuestions();
        // If edituploadedquestionstatus is successful, call the paper status endpoint
        const paperStatusEndpoint = `http://${ip}:${port}/edituploadedpaperstatus/${paperId}`;
        return fetch(paperStatusEndpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
      .then(paperStatusResponse => {
        if (paperStatusResponse.ok) {
          navigation.navigate('DrtScreen02');
          ToastAndroid.show('Status updated successfully!', ToastAndroid.SHORT);
        } else {
          console.error('Failed to update paper status');
          ToastAndroid.show(
            'Failed to update paper status.',
            ToastAndroid.LONG,
          );
        }
      })
      .catch(error => {
        console.error('Error during API call:', error);
        ToastAndroid.show('Failed to update status.', ToastAndroid.LONG);
      });
  };

  //   const handlePaperApprove = () => {
  //     if (!checkCountBeforeSubmission()) {
  //       return;
  //     }
  //     const apiEndpoint = `http://${ip}:${port}/edituploadedquestionstatus`;
  //     const acceptedQIds = Object.keys(acceptOptions).filter(
  //       key => acceptOptions[key],
  //     );
  //     const rejectedQIds = Object.keys(rejectOptions).filter(
  //       key => rejectOptions[key],
  //     );
  //     const data = {
  //       acceptedQIds,
  //       rejectedQIds,
  //     };
  //     fetch(apiEndpoint, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     })
  //       .then(response =>
  //         response
  //           .json()
  //           .then(data => ({status: response.status, body: data}))
  //           .catch(err => {
  //             console.error('Error parsing JSON:', err);
  //             throw new Error('Error parsing JSON');
  //           }),
  //       )
  //       .then(({status, body}) => {
  //         if (status === 200) {
  //           console.log('Data posted successfully:', body);
  //           fetchQuestions();
  //           ToastAndroid.show('Status updated successfully!', ToastAndroid.SHORT);
  //         } else {
  //           console.error('API returned an error:', body);
  //           ToastAndroid.show(`${body.error}`, ToastAndroid.LONG);
  //         }
  //       });
  //     //   .catch(error => {
  //     //     console.error('Error during API call:', error);
  //     //     ToastAndroid.show('Failed to update status.', ToastAndroid.LONG);
  //     //   });
  //   };

  const handleSubmit = () => {
    if (!checkCountBeforeSubmission()) {
      return;
    }
    if (!checkDifficultyBeforeSubmission()) {
      return;
    }

    // Endpoint for editpendingquestionstatus
    const questionStatusEndpoint = `http://${ip}:${port}/editpendingquestionstatus`;
    const questionStatusData = {
      paperId: paperId,
      q_ids: checkedQuestions,
    };

    // Endpoint for editpendingpaperstatus
    const pendingPaperStatusEndpoint = `http://${ip}:${port}/editpendingpaperstatus/${paperId}`;

    // Fetch for editpendingquestionstatus
    fetch(questionStatusEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionStatusData),
    })
      .then(questionStatusResponse => {
        if (questionStatusResponse.ok) {
          // If editpendingquestionstatus is successful, just call the editpendingpaperstatus endpoint
          fetch(pendingPaperStatusEndpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(pendingPaperStatusResponse => {
              if (pendingPaperStatusResponse.ok) {
                ToastAndroid.show('Added Successfully!', ToastAndroid.SHORT);
              } else {
                ToastAndroid.show('Failed to add paper.', ToastAndroid.LONG);
              }
            })
            .catch(error => {
              ToastAndroid.show('Failed to add paper.', ToastAndroid.LONG);
            });
        } else {
          ToastAndroid.show('Failed to add paper.', ToastAndroid.LONG);
        }
      })
      .catch(error => {
        ToastAndroid.show('Failed to add paper.', ToastAndroid.LONG);
      });
  };

  //   const addFeedback = () => {
  //     const apiEndpoint = `http://${ip}:${port}/addfeedback`;
  //     for (const [q_id, fb_text] of Object.entries(commentInputs)) {
  //       fetch(apiEndpoint, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           fb_text,
  //           p_id: paperId,
  //           c_id: courseId,
  //           q_id,
  //         }),
  //       })
  //         .then(response => response.json())
  //         .then(data => {
  //           console.log('Data posted successfully:', data);
  //           ToastAndroid.show('Added Successfully!', ToastAndroid.SHORT);
  //           setCommentInputs(prevInputs => ({
  //             ...prevInputs,
  //             [q_id]: '',
  //           }));
  //         })
  //         .catch(error => {
  //           console.error('Error posting data:', error);
  //         });
  //     }
  //     Keyboard.dismiss();
  //   };

  const addFeedback = questionId => {
    if (comments.trim() === '') {
      ToastAndroid.show('Error: Please type the Comment.', ToastAndroid.SHORT);
      return;
    }
    const apiEndpoint = `http://${ip}:${port}/addfeedback`;
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fb_text: comments,
        p_id: paperId,
        c_id: courseId,
        q_id: questionId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setComments('');
        console.log('Data posted successfully:', data);
        ToastAndroid.show('Added Successfully!', ToastAndroid.SHORT);
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
    Keyboard.dismiss();
  };

  const fetchQuestions = () => {
    const apiEndpoint = `http://${ip}:${port}/getuploadedQuestion/${paperId}`;
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
        setCourseId(data[0].c_id);
        setCourseCode(data[0].c_code);
        setCourseTitle(data[0].c_title);
        setDuration(data[0].duration);
        setDegree(data[0].degree);
        setTerm(data[0].term);
        setYear(data[0].year);
        setExamDate(data[0].exam_date);
        setSession(data[0].session);
        setStatus(data[0].status);
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
              navigation.navigate('DrtScreen04', {
                paperId: paperId,
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
                {session} {year} : {term} Term Examination
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
                : {coursetitle}
              </Text>
              <Text style={styles.courseInfoText}>
                <Text style={{textDecorationLine: 'underline'}}>
                  Date Of Exam
                </Text>{' '}
                : {examdate}{' '}
                <Text style={{textDecorationLine: 'underline'}}>Duration</Text>{' '}
                : {duration}{' '}
                <Text style={{textDecorationLine: 'underline'}}>Code</Text> :{' '}
                {coursecode}{' '}
                <Text style={{textDecorationLine: 'underline'}}>Degree</Text> :{' '}
                {degree} {'\n'}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text style={styles.counterText}>
                <Text style={{color: 'blue'}}>Accepted: </Text> {selectedCount}/
                {questionsCount}{' '}
              </Text>
            </View>
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
                    <View style={styles.radioButtonsContainer}>
                      <View style={styles.radioButton}>
                        <Text style={styles.radioText}>Accept</Text>
                        <RadioButton
                          value={item.q_id}
                          color="green"
                          uncheckedColor="green"
                          status={
                            acceptOptions[item.q_id] ? 'checked' : 'unchecked'
                          }
                          onPress={() =>
                            handleOptionSelect(item.q_id, 'accept')
                          }
                        />
                      </View>
                      <View style={styles.radioButton}>
                        <Text style={styles.radioText}>Reject</Text>
                        <RadioButton
                          value={item.q_id}
                          color="red"
                          uncheckedColor="red"
                          status={
                            rejectOptions[item.q_id] ? 'checked' : 'unchecked'
                          }
                          onPress={() =>
                            handleOptionSelect(item.q_id, 'reject')
                          }
                        />
                      </View>
                    </View>
                    {rejectOptions[item.q_id] && (
                      <View>
                        <View style={styles.commentBox}>
                          {/* <TextInput
                            style={styles.commentInput}
                            placeholder="Comments"
                            placeholderTextColor={'gray'}
                            multiline
                            value={commentInputs[item.q_id] || ''}
                            onChangeText={text =>
                              handleCommentChange(item.q_id, text)
                            }
                          /> */}
                          <TextInput
                            style={styles.commentInput}
                            placeholder="Comments"
                            placeholderTextColor={'gray'}
                            multiline
                            value={comments}
                            onChangeText={text => setComments(text)}
                          />
                          <TouchableOpacity
                            style={styles.sendButton}
                            onPress={() => addFeedback(item.q_id)}>
                            <Image
                              source={require('../../assets/send_black.png')}
                              style={styles.sendIcon}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{alignItems: 'flex-end', width: '100%'}}>
                          <TouchableOpacity
                            style={styles.additionalButton}
                            activeOpacity={0.8}
                            onPress={() => handleAdditional(item)}>
                            <Text style={styles.additionalButtonText}>
                              Additional
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    {/* Debugging the q_id */}
                    {/* <Text style={{color: 'black'}}>Question ID: {item.q_id}</Text>
                  <Text style={{color: 'black'}}>
                    Accepted: {acceptOptions[item.q_id] ? 'Yes' : 'No'}
                  </Text>
                  <Text>
                    Rejected: {rejectOptions[item.q_id] ? 'Yes' : 'No'}
                  </Text> */}
                    {/* <View style={styles.buttonscontainer}>
                    <TouchableOpacity style={styles.acceptButton}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton}>
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View> */}
                  </View>
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.buttonscontainer2}>
          <TouchableOpacity
            style={styles.topicButton}
            onPress={() =>
              navigation.navigate('DrtScreen08', {
                paperId,
                courseId,
                coursecode,
                coursetitle,
              })
            }>
            <Text style={styles.viewText}>View Topics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handlePaperApprove}>
            <Text style={styles.viewText}>Approve</Text>
          </TouchableOpacity>
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
    maxHeight: 505,
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  commentInput: {
    color: 'black',
    borderWidth: 2,
    width: '90%',
    borderColor: 'gray',
    borderRadius: 15,
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
  additionalButton: {
    backgroundColor: '#20B2AA',
    width: '30%',
    height: 25,
    textAlign: 'center',
    borderRadius: 7,
    justifyContent: 'center',
  },
  additionalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 30,
    width: 25,
    marginLeft: 10,
  },
  sendIcon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
  counterText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});

export default DrtScreen06;
