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
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import {ip, port} from '../CONFIG';

const FctScreen11 = ({route}) => {
  const navigation = useNavigation();
  const {
    courseId,
    courseName,
    courseCode,
    facultyId,
    facultyName,
    facultyRole,
  } = route.params;
  const [term, setTerm] = useState('');
  const [easy, setEasy] = useState(0);
  const [medium, setMedium] = useState(0);
  const [hard, setHard] = useState(0);
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [paperheader, setPaperHeader] = useState([]);
  const [paperheaderfaculty, setPaperHeaderFaculty] = useState([]);
  const [questions, setQuestion] = useState([]);
  const [topics, setTopics] = useState([]);
  const [papers, setPapers] = useState('');
  const [questiontext, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [marks, setMarks] = useState(0);
  const [paperId, setPaperID] = useState('');
  const [mode, setMode] = useState('add');
  const [selectedImage, setSelectedImage] = useState(null);
  const [topicId, setSelectedTopic] = useState(null);
  const [checkedQuestions, setCheckedQuestions] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [validMidCLOS, setValidMidCLOS] = useState([]);
  const [validFinalCLOS, setValidFinalCLOS] = useState([]);
  const [invalidMidCLOS, setInvalidMidCLOS] = useState([]);
  const [invalidFinalCLOS, setInvalidFinalCLOS] = useState([]);
  const [questionValidMidCLOS, setQuestionValidMidCLOS] = useState([]);
  const [questionValidFinalCLOS, setQuestionValidFinalCLOS] = useState([]);

  useEffect(() => {
    fetchPaper();
    console.log(`${facultyName} -> Creating Questions`);
  }, []);

  //   const handleCheckBoxChange = q_id => {
  //     setCheckedQuestions(prevChecked =>
  //       prevChecked.includes(q_id)
  //         ? prevChecked.filter(id => id !== q_id)
  //         : [...prevChecked, q_id],
  //     );
  //   };

  const handleClear = () => {
    setQuestionText('');
    setSelectedImage(null);
    setDifficulty(null);
    setSelectedTopic(null);
    setMarks('');
    Keyboard.dismiss();
  };

  //   const handleCheckBoxChange = q_id => {
  //     setCheckedQuestions(prevChecked => {
  //       const isChecked = !prevChecked.includes(q_id);
  //       console.log(
  //         `Question ID ${q_id} is ${isChecked ? 'selected' : 'deselected'}`,
  //       );
  //       return isChecked
  //         ? [...prevChecked, q_id]
  //         : prevChecked.filter(id => id !== q_id);
  //     });
  //   };

  const handleCheckBoxChange = async item => {
    const q_id = item.q_id;
    // Await the result of validateQuestionCLOS
    const isValid = await validateQuestionCLOS(q_id, term);
    if (!isValid) {
      ToastAndroid.show('CLOS not matching!', ToastAndroid.SHORT);
      return;
    }
    setCheckedQuestions(prevChecked => {
      const isChecked = !prevChecked.includes(q_id);
      console.log(
        `Question ID ${q_id} is ${isChecked ? 'selected' : 'deselected'}`,
      );
      const newCheckedQuestions = isChecked
        ? [...prevChecked, q_id]
        : prevChecked.filter(id => id !== q_id);
      setSelectedCount(newCheckedQuestions.length);

      // Get the question difficulty
      if (item) {
        if (isChecked) {
          if (item.q_difficulty === 'Easy') setEasyCount(prev => prev + 1);
          else if (item.q_difficulty === 'Medium')
            setMediumCount(prev => prev + 1);
          else if (item.q_difficulty === 'Hard') setHardCount(prev => prev + 1);
          // Add q_marks
          const newQuestionMarks = marks + Number(item.q_marks);
          setMarks(newQuestionMarks);
        } else {
          if (item.q_difficulty === 'Easy') setEasyCount(prev => prev - 1);
          else if (item.q_difficulty === 'Medium')
            setMediumCount(prev => prev - 1);
          else if (item.q_difficulty === 'Hard') setHardCount(prev => prev - 1);
          // Subtract q_marks
          const newQuestionMarks = marks - Number(item.q_marks);
          setMarks(newQuestionMarks);
        }
      }
      return newCheckedQuestions;
    });
  };

  const validateQuestionCLOS = async (q_id, term) => {
    let isValid = false;
    let questionValidCLOS = [];
    try {
      if (term === 'Mid') {
        // console.log('> Mid Paper');
        questionValidCLOS = await fetchQuestionValidMidCLOS(q_id);
        // console.log('> Mid Question CLO Check');
        console.log(`Question ID ${q_id} is selected`);
        // console.log('Fetched Mid Question CLOs:', questionValidCLOS);
        console.log('Valid Mid CLOS:', validMidCLOS);
        isValid = matchCLOSValidity(questionValidCLOS, validMidCLOS);
        // console.log(`Validation Result: ${isValid}`);
      } else if (term === 'Final') {
        // console.log('> Final Paper');
        questionValidCLOS = await fetchQuestionValidFinalCLOS(q_id);
        // console.log('> Mid Question CLO Check');
        console.log(`Question ID ${q_id} is selected`);
        // console.log('Fetched Final Question CLOs:', questionValidCLOS);
        console.log('Valid Final CLOS:', validFinalCLOS);
        isValid = matchCLOSValidity(questionValidCLOS, validFinalCLOS);
        // console.log(`Validation Result: ${isValid}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    return isValid;
  };

  const matchCLOSValidity = (questionValidCLOS, validCLOS, courseId) => {
    console.log('Checking CLO Validity...');
    console.log('Question Valid CLOS:', questionValidCLOS);
    console.log('Paper Valid CLOS:', validCLOS);

    // Create a Set of valid CLO numbers for faster lookup
    const validCLONumbers = new Set(validCLOS.map(clo => clo.clo_number));
    console.log('Valid CLO Numbers:', validCLONumbers);

    // Collect invalid CLO numbers
    const invalidCLONumbers = [];

    // Check if every CLO number in questionValidCLOS is also in validCLONumbers
    for (const clo of questionValidCLOS) {
      //   if (!validCLONumbers.has(clo.clo_number) || clo.c_id !== courseId) {
      if (!validCLONumbers.has(clo.clo_number)) {
        invalidCLONumbers.push(clo.clo_number);
      }
    }
    if (invalidCLONumbers.length > 0) {
      const errorMessage = `Invalid CLO Numbers: ${invalidCLONumbers.join(
        ', ',
      )}`;
      console.log(errorMessage);
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      console.log('Validation Result: false');
      return false;
    }
    console.log('All CLOs are valid.');
    return true;
  };

  const fetchbyTerm = paper => {
    if (paper.term === 'Mid') {
      console.log('> Mid Paper');
      fetchValidMidCLOS(paper.c_id);
      fetchInvalidMidCLOS(paper.c_id);
    } else if (paper.term === 'Final') {
      console.log('> Final Paper');
      fetchValidFinalCLOS(paper.c_id);
      fetchInvalidFinalCLOS(paper.c_id);
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

  const fetchInvalidMidCLOS = courseId => {
    const apiEndpoint = `http://${ip}:${port}/getInvalidMidCLOS/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setInvalidMidCLOS(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchInvalidFinalCLOS = courseId => {
    const apiEndpoint = `http://${ip}:${port}/getInvalidFinalCLOS/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setInvalidFinalCLOS(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchQuestionValidMidCLOS = async questionId => {
    console.log('Fetching Mid CLOs...');
    const apiEndpoint = `http://${ip}:${port}/getQuestionValidMidCLOS/${questionId}`;
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      console.log('Mid CLOs Data Fetched:', data);
      setQuestionValidMidCLOS(data);
      return data; // Return the fetched data directly
    } catch (error) {
      console.error('Error fetching mid CLOs:', error);
      return []; // Return an empty array in case of error
    }
  };

  const fetchQuestionValidFinalCLOS = async questionId => {
    console.log('Fetching Final CLOs...');
    const apiEndpoint = `http://${ip}:${port}/getQuestionValidFinalCLOS/${questionId}`;
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      console.log('Final CLOs Data Fetched:', data);
      setQuestionValidFinalCLOS(data);
      return data; // Return the fetched data directly
    } catch (error) {
      console.error('Error fetching final CLOs:', error);
      return []; // Return an empty array in case of error
    }
  };

  const fetchDifficulty = numberOfQuestions => {
    const apiEndpoint = `http://${ip}:${port}/getdifficulty/${numberOfQuestions}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setEasy(data[0].easy.toString());
        setMedium(data[0].medium.toString());
        setHard(data[0].hard.toString());
        // setNumber(data[0].number_of_questions);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
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
    if (selectedCount === questionsCount) {
      return true;
    } else {
      ToastAndroid.show(
        "Selected Count Doesn't Match Number Of Questions",
        ToastAndroid.SHORT,
      );
      return false;
    }
  };

  const checkDifficultyBeforeSubmission = () => {
    if (easyCount < easy) {
      ToastAndroid.show(
        'Easy Difficulty Count Does Not Match!',
        ToastAndroid.SHORT,
      );
    }
    if (mediumCount < medium) {
      ToastAndroid.show(
        'Medium Difficulty Count Does Not Match!',
        ToastAndroid.SHORT,
      );
    }
    if (hardCount < hard) {
      ToastAndroid.show(
        'Hard Difficulty Count Does Not Match!',
        ToastAndroid.SHORT,
      );
    }

    if (easyCount < easy || mediumCount < medium || hardCount < hard) {
      return false;
    }

    return true;
  };

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

  //   const handleSubmit = () => {
  //     if (!checkCountBeforeSubmission()) {
  //       return;
  //     }
  //     if (!checkDifficultyBeforeSubmission()) {
  //       return;
  //     }
  //     const apiEndpoint = `http://${ip}:${port}/editpendingquestionstatus`;
  //     const data = {
  //       paperId: paperId,
  //       q_ids: checkedQuestions,
  //     };
  //     fetch(apiEndpoint, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     })
  //       .then(response =>
  //         response.json().then(data => ({status: response.status, body: data})),
  //       )
  //       .then(({status, body}) => {
  //         if (status === 200) {
  //           console.log('Data posted successfully:', body);
  //           ToastAndroid.show('Added Successfully!', ToastAndroid.SHORT);
  //         } else {
  //           ToastAndroid.show(`${body.error}`, ToastAndroid.LONG);
  //         }
  //       })
  //       .catch(error => {
  //         ToastAndroid.show('Failed to add paper.', ToastAndroid.LONG);
  //       });
  //   };

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

  const fetchTopics = () => {
    const apiEndpoint = `http://${ip}:${port}/gettopic/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setTopics(data);
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

  const handleButtonClick = paper => () => {
    console.log(paper);
    fetchbyTerm(paper);
    setTerm(paper.term);
    setPaperID(paper.p_id);
    fetchQuestions(paper.p_id);
    fetchQuestionsCount(paper.p_id);
    fetchDifficulty(paper.no_of_questions);
    fetchPaperHeader(paper.p_id);
    fetchTopics(paper.c_id);
    fetchfacultyData(paper.c_id);
    setModalVisible(false);
  };

  const hasMidTerm =
    Array.isArray(papers) && papers.some(paper => paper.term === 'Mid');
  const hasFinalTerm =
    Array.isArray(papers) && papers.some(paper => paper.term === 'Final');

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
                    onPress={handleButtonClick(paper)}>
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
          <Text style={styles.headerText}>Manage Paper</Text>
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
            <View style={styles.paperInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text style={styles.counterText}>
                  <Text style={{color: 'blue'}}>Questions: </Text>{' '}
                  {selectedCount}/{questionsCount} |{' '}
                </Text>
                <Text style={styles.counterText}>
                  <Text style={{color: 'green'}}>Easy: </Text>
                  {easyCount}/{easy} |{' '}
                </Text>
                <Text style={styles.counterText}>
                  <Text style={{color: 'purple'}}>Medium: </Text>
                  {mediumCount}/{medium} |{' '}
                </Text>
                <Text style={styles.counterText}>
                  <Text style={{color: 'red'}}>Hard: </Text>
                  {hardCount}/{hard}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '80%',
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '20%',
                  }}>
                  <Text style={styles.validCLOSText}>
                    <Text style={{color: 'blue'}}>Marks: {marks}</Text>
                  </Text>
                </View>
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
                        Question # {index + 1} :{' '}
                        {item.q_status === 'uploaded' && (
                          <Text style={{color: 'green'}}>(Uploaded)</Text>
                        )}
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
                      <Text style={styles.data_difficulty}>
                        [ {item.f_name} ]
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <View style={styles.checkboxContainer1}>
                          <View style={styles.checkboxBorder1}>
                            <CheckBox
                              value={
                                item.q_status === 'uploaded' ||
                                checkedQuestions.includes(item.q_id)
                              }
                              onValueChange={() => handleCheckBoxChange(item)}
                            />
                          </View>
                          <Text style={styles.checkboxLabel1}>Select</Text>
                        </View>
                        {/* <View style={styles.checkboxContainer2}>
                          <View style={styles.checkboxBorder2}>
                            <CheckBox
                              value={checkedQuestions.includes(item.q_id)}
                              onValueChange={() => handleCheckBoxChange(item)}
                            />
                          </View>
                          <Text style={styles.checkboxLabel2}>Additional</Text>
                        </View> */}
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
          {!modalVisible && (
            <View style={styles.buttonscontainer2}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={handleSubmit}>
                <Text style={styles.viewText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
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
  form: {
    flex: 1,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
  },
  flatlist: {
    // marginTop: 5,
    maxHeight: 490,
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
    marginLeft: '2%',
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
    justifyContent: 'center',
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
    marginBottom: 5,
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
    marginBottom: 5,
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
    width: '50%',
    marginLeft: '30%',
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
  checkboxContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxBorder1: {
    borderRadius: 4,
    backgroundColor: '#E6E6FA',
  },
  checkboxLabel1: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  checkboxContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 15,
  },
  checkboxBorder2: {
    borderRadius: 4,
    backgroundColor: '#E6E6FA',
  },
  checkboxLabel2: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  counterText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  validCLOSText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});

export default FctScreen11;
