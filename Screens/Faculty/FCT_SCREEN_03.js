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

const FctScreen03 = ({route}) => {
  const {courseId, courseName, courseCode, facultyId, facultyRole} =
    route.params;
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [CLOS, setCLOS] = useState([]);
  const [clonumber, setCLOnumber] = useState('');
  const [clotext, setCLOtext] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const isValidCLOFormat = clonumber => {
    const regex = /^CLO-\d+$/;
    return regex.test(clonumber);
  };

  const addCLO = () => {
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
        console.log('Data posted successfully:', data);
        ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
        Keyboard.dismiss();
        fetchData();
      })
      .catch(error => {
        // console.error('Error posting data:', error);
      });
  };

  const handlePress = item => {
    console.log('Item:', item);
  };

  const fetchData = () => {
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
          <Text style={styles.headerText}>Manage CLOS</Text>
        </View>
        <View style={styles.buttonsContainer}></View>
        <View>
          <Text style={styles.nameText}>{courseName}</Text>
          <Text style={styles.codeText}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>CLO Number #</Text>
          <TextInput
            style={styles.input1}
            placeholder="Enter CLO Number Format (CLO-1)"
            placeholderTextColor={'gray'}
            onChangeText={text => setCLOnumber(text)}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input2}
            multiline={true}
            placeholder="Enter Description Here"
            placeholderTextColor={'gray'}
            onChangeText={text => setCLOtext(text)}
          />
          <TouchableOpacity style={styles.button} onPress={addCLO}>
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>
          <FlatList
            data={CLOS}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity style={styles.listItem}>
                {/* <Text style={styles.indexText}>CLO {index + 1}:</Text> */}
                <Text style={styles.indexText}>{item.clo_number}:</Text>
                <Text style={styles.cloText}>{item.clo_text}</Text>
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
                    {/* <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(item.f_id, item.f_name)}>
                      <Image
                        source={require('../../assets/delete_icon.png')}
                        style={styles.deleteIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity> */}
                    {item.status === 'disabled' ? (
                      <TouchableOpacity
                        style={styles.disableButton}
                        onPress={() => handleStatus(item.f_id, item.status)}>
                        <Text style={styles.disablebuttonText}>D</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.enableButton}
                        onPress={() => handleStatus(item.f_id, item.status)}>
                        <Text style={styles.enablebuttonText}>E</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
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
    marginTop: 70,
    // alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  input1: {
    height: 40,
    width: 340,
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
    marginLeft: 20,
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
    maxHeight: 300,
    // borderWidth: 3,
    // borderColor: 'yellow'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    // marginLeft: 10,
    marginTop: 30,
    // borderWidth: 2,
    // borderColor: 'yellow',
    justifyContent: 'flex-end',
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
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    backgroundColor: '#CDCDCD',
    height: 'auto',
    borderRadius: 15,
    marginTop: 2,
    color: 'white',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  cloText: {
    fontSize: 20,
    color: 'black',
    marginLeft: 20,
    width: 250,
    flexWrap: 'wrap',
  },
  indexText: {
    fontSize: 20,
    color: 'blue',
    marginLeft: 20,
    fontWeight: 'bold',
  },
  column: {
    flex: 1,
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
  editIcon: {
    height: 18,
    width: 18,
  },
});

export default FctScreen03;
