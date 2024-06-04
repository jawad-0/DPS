import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
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

const FctScreen09 = ({route}) => {
  const {courseId, courseName, courseCode, facultyId, facultyRole} =
    route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [degree, setDegree] = useState('');
  const [exam_date, setExamDate] = useState('');
  const [duration, setDuration] = useState('');
  const [term, setTerm] = useState('');
  const [paperID, setPaperID] = useState('');
  const [papers, setPapers] = useState([]);
  const [mode, setMode] = useState('add');

  useEffect(() => {
    fetchPaper();
  }, []);

  const handlePressMid = () => {
    setTerm('Mid');
    console.log('Mid');
  };

  const handlePressFinal = () => {
    setTerm('Final');
    console.log('Final');
  };

  const handleAddOrUpdateCLO = item => {
    if (mode === 'add') {
      savePaper();
    } else if (mode === 'edit') {
      updatePaper(paperID);
    }
  };

  const handleClear = () => {
    setMode('add');
    setDegree('');
    setExamDate('');
    setDuration('');
    setTerm('');
    Keyboard.dismiss();
  };

  const handleItemPress = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleEdit = item => {
    setMode('edit');
    setPaperID(item.p_id);
    setDegree(item.degree);
    setExamDate(item.exam_date);
    setDuration(item.duration.toString());
    setTerm(item.term);
  };

  const fetchPaper = () => {
    const apiEndpoint = `http://${ip}:${port}/getPapers/${courseId}`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setPapers(data);
        setDegree('');
        setExamDate('');
        setDuration('');
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const savePaper = () => {
    setMode('add');
    if (
      degree.trim() === '' ||
      exam_date.trim() === '' ||
      duration.trim() === '' ||
      term.trim() === ''
    ) {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }

    const apiEndpoint = `http://${ip}:${port}/addPaper`;

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        degree: degree,
        exam_date: exam_date,
        duration: duration,
        term: term,
        c_id: courseId,
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

  const updatePaper = paperID => {
    setMode('edit');
    if (
      degree.trim() === '' ||
      exam_date.trim() === '' ||
      duration.trim() === ''
    ) {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }

    const apiEndpoint = `http://${ip}:${port}/editPaper/${paperID}`;

    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        degree: degree,
        exam_date: exam_date,
        duration: duration,
      }),
    })
      .then(response =>
        response.json().then(data => ({status: response.status, body: data})),
      )
      .then(({status, body}) => {
        if (status === 200) {
          console.log('Data posted successfully:', body);
          ToastAndroid.show('Updated Successfully!', ToastAndroid.SHORT);
          Keyboard.dismiss();
          fetchPaper();
          handleClear();
        } else {
          // console.error('Error from server:', body);
          ToastAndroid.show(`${body.error}`, ToastAndroid.LONG);
        }
      })
      .catch(error => {
        // console.error('Error posting data:', error);
        ToastAndroid.show('Failed to update paper.', ToastAndroid.LONG);
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
          <Text style={styles.headerText}>Paper Header</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <Text
            style={{
              marginLeft: 30,
              fontWeight: 'bold',
              fontSize: 25,
              color: 'white',
            }}>
            {courseName}
          </Text>
          <Text
            style={{
              marginLeft: 30,
              fontWeight: 'bold',
              fontSize: 25,
              color: 'white',
            }}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 30,
              fontWeight: 'bold',
              fontSize: 25,
              color: 'white',
            }}>
            Paper Settings
          </Text>

          <View style={{marginTop: 15}}>
            <Text style={styles.label}>Teachers</Text>
            <Text style={styles.label2}>Dr.Qamar Mehmood, Mr.Shahid</Text>

            <Text style={styles.label}>Course Title: </Text>
            <Text style={styles.label2}>
              {courseName} ({courseCode})
            </Text>
          </View>

          <Text style={styles.label}>Degree</Text>
          <TextInput
            style={styles.input}
            value={degree}
            placeholder="Enter Degree"
            placeholderTextColor={'gray'}
            onChangeText={text => setDegree(text)}
          />

          <Text style={styles.label}>Date of Exam</Text>
          <TextInput
            style={styles.input}
            value={exam_date}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={'gray'}
            onChangeText={text => setExamDate(text)}
          />

          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            value={duration}
            placeholder="Enter Duration (numeric)"
            placeholderTextColor={'gray'}
            keyboardType="numeric"
            onChangeText={text => setDuration(text)}
          />

          <Text style={styles.label}>Term</Text>
          <View style={{flexDirection: 'row', marginTop: 15, marginLeft: 40}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label2}>Mid</Text>
              <TouchableOpacity
                style={[
                  styles.circle,
                  {
                    backgroundColor: term === 'Mid' ? '#58FFAB' : 'transparent',
                  },
                ]}
                onPress={handlePressMid}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label2}>Final</Text>
              <TouchableOpacity
                style={[
                  styles.circle,
                  {
                    backgroundColor:
                      term === 'Final' ? '#58FFAB' : 'transparent',
                  },
                ]}
                onPress={handlePressFinal}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: '2%',
            }}>
            {mode === 'edit' && (
              <TouchableOpacity
                style={styles.clearbutton}
                onPress={handleClear}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleAddOrUpdateCLO}>
              <Text style={styles.buttonText}>
                {mode === 'add' ? 'Save' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={papers}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.listItem}
                onPress={() => handleItemPress(item)}>
                <View style={styles.column}>
                  <Text style={styles.text}>{item.session}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.text}>{item.year}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.text}>{item.term}</Text>
                </View>
                <View style={{flex: 0.7}}>
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
              </TouchableOpacity>
            )}
          />

          {selectedItem && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={handleCloseModal}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>
                    Session: {selectedItem.session}
                  </Text>
                  <Text style={styles.modalText}>
                    Year: {selectedItem.year}
                  </Text>
                  <Text style={styles.modalText}>
                    Term: {selectedItem.term}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCloseModal}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'blue',
    borderWidth: 2,
    borderColor: 'black',
    // justifyContent: 'center',
    // backgroundColor: 'white',
  },
  form: {
    flex: 1,
    marginTop: 20,
    // backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    // borderWidth: 2,
    // borderColor: 'red',
    // alignItems: 'center',
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  headerText: {
    // backgroundColor: '#00E9CC',
    height: 70,
    width: 320,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'red'
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
  },
  circle: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
    marginLeft: 10,
  },
  label: {
    fontSize: 20,
    marginBottom: 3,
    marginLeft: 20,
    color: 'white',
  },
  label2: {
    fontSize: 15,
    marginBottom: 8,
    marginLeft: 50,
    color: 'white',
    fontWeight: 'bold',
  },
  data_name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 10,
    textAlign: 'center',
  },
  data_username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: 340,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 7,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#E6E6FA',
  },
  searchinput: {
    height: 40,
    width: 300,
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 13,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'white',
  },
  tableheader: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 40,
    marginTop: 16,
    // borderTopWidth: 3,
    // borderTopColor: 'white',
    borderBottomWidth: 3,
    borderBottomColor: 'white',
    // borderRightWidth: 3,
    // borderRightColor: 'white',
    // borderLeftWidth: 3,
    // borderLeftColor: 'white',
  },
  columnContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  columnHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'black',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#58FFAB',
    padding: 10,
    height: 40,
    width: 100,
    marginTop: 20,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    height: 40,
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  clearbutton: {
    backgroundColor: 'red',
    marginRight: 5,
    padding: 10,
    height: 40,
    width: 100,
    marginTop: 20,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: 'white',
    fontSize: 20,
    height: 40,
    textAlignVertical: 'center',
    fontWeight: 'bold',
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
  disablebuttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  enablebuttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    backgroundColor: '#E6E6FA',
    height: 45,
    width: '96%',
    marginLeft: '2%',
    borderRadius: 15,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  flatlist: {
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  modalbuttonscontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalcancelbutton: {
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    marginRight: 10,
    height: 30,
    width: 60,
  },
  modaldeletebutton: {
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 10,
    height: 30,
    width: 60,
  },
  modalcanceltext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modaldeletetext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    // marginLeft: 10,
    // borderWidth: 2,
    // borderColor: 'black',
    justifyContent: 'center',
  },
  editButton: {
    // backgroundColor: 'blue',
    marginRight: 8,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  deleteButton: {
    // backgroundColor: 'black',
    marginRight: 8,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  disableButton: {
    backgroundColor: 'red',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  enableButton: {
    backgroundColor: '#0DEC09',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  backButton: {
    justifyContent: 'center',
    borderRadius: 13,
    marginLeft: 20,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  deleteIcon: {
    height: 20,
    width: 20,
  },
  editIcon: {
    height: 18,
    width: 18,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black'
  },
  closeButton: {
    marginTop: 20,
    height: 30,
    width: 70,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default FctScreen09;
