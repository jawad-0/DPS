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
import {ip, clo_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const HodScreen06 = ({route}) => {
  const {courseId, courseTitle, courseCode} = route.params;
  const navigation = useNavigation();
  const [CLOS, setCLOS] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const approveCLO = () => {
    console.log('Approve CLO');
  };

  const disapproveCLO = () => {
    console.log('Approve CLO');
  };

  const handleStatus = (clo_id, status) => {
    const apiEndpoint = `http://${ip}:${clo_port}/approvedisapproveCLO/${clo_id}`;

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
          throw new Error('Failed to edit CLO status');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        ToastAndroid.show('CLO status updated', ToastAndroid.SHORT);
        fetchData();
      })
      .catch(error => {
        console.error(error);
        ToastAndroid.show('Error: Failed to edit status.', ToastAndroid.SHORT);
      });
  };

  const checkCLO = item => {
    console.log(
      `Text : ${item.clo_text} | clo_id : ${item.clo_id} | c_id : ${item.c_id} | status : ${item.status}`,
    );
  };
  const addCLO = () => {
    console.log('CLO Added!');
  };

  const handleLogout = () => {
    ToastAndroid.show('Logged Out!', ToastAndroid.SHORT);
    navigation.navigate('FctLogin');
  };

  const handlePress = item => {
    console.log('Item:', item);
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${clo_port}/getCLO/${courseId}`;
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
      source={require('../../assets/hod_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate('HodScreen05', {
                itemId: courseId,
              })
            }>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>CLOS</Text>
        </View>
        <View style={styles.buttonsContainer}></View>
        <View>
          <Text style={styles.nameText}>{courseTitle}</Text>
          <Text style={styles.codeText}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
        </View>
        <View style={styles.form}>
          <FlatList
            data={CLOS}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.listItemContainer}>
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => checkCLO(item)}>
                  <Text style={styles.indexText}>CLO {index + 1}:</Text>
                  <Text style={styles.cloText}>{item.clo_text}</Text>
                </TouchableOpacity>
                {(item.status === 'disapproved' && (
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleStatus(item.clo_id, item.status)}>
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                )) ||
                  (item.status === 'approved' && (
                    <TouchableOpacity
                      style={styles.disapproveButton}
                      onPress={() => handleStatus(item.clo_id, item.status)}>
                      <Text style={styles.disapproveButtonText}>
                        Disapprove
                      </Text>
                    </TouchableOpacity>
                  ))}
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
    marginTop: 70,
    // alignItems: 'center',
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
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    backgroundColor: '#CDCDCD',
    height: 80,
    borderRadius: 15,
    marginTop: 2,
    color: 'white',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    // borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  approveButton: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 100,
    marginTop: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  approveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disapproveButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 100,
    marginTop: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  disapproveButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
});

export default HodScreen06;
