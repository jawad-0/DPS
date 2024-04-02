import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  Keyboard,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, faculty_port, assigned_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const HodScreen05 = ({route}) => {
  const {courseId, courseTitle, courseCode} = route.params;
  const navigation = useNavigation();
  const [name, setName] = useState('- - - - - - - -');
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [courseToDelete, setCoursetodelete] = useState(null);
  const [facultyToDelete, setFacultytodelete] = useState(null);
  const [assignedTo, setAssignedTo] = useState([]);

  useEffect(() => {
    fetchAssignedTo();
  }, []);

  const handleCLO = () => {
    navigation.navigate('HodScreen06', {
      courseId: courseId,
      courseTitle: courseTitle,
      courseCode: courseCode,
    });
  };

  const fetchAssignedTo = () => {
    const apiEndpoint = `http://${ip}:${assigned_port}/getAssignedTo/${courseId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const courseName = data[0].c_title;
        // console.log('Data fetched successfully:', assignedData);
        // console.log(data);
        const ids = data.map(item => item.ac_id); // Extract all IDs
        console.log('All assigned course IDs:', ids);
        setName(courseName);
        setAssignedTo(data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
      });
  };

  const handleDelete = (c_title, f_name, ac_id) => {
    console.log(`Delete ${ac_id}`);
    setItemToDelete(ac_id);
    setCoursetodelete(c_title);
    setFacultytodelete(f_name);
    setShowModal(true);
  };

  const confirmDelete = itemToDelete => {
    const apiEndpoint = `http://${ip}:${assigned_port}/deleteAssignedCourse/${itemToDelete}`;
    if (itemToDelete) {
      fetch(apiEndpoint, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            console.log('Course unassigned successfully');
            const updatedAssignedTo = assignedTo.filter(
              item => item.ac_id !== itemToDelete,
            );
            setAssignedTo(updatedAssignedTo);
          } else {
            console.error('Failed to unassign course');
          }
        })
        .catch(error => {
          console.error('Error Unassigning course:', error);
        });
    }
    setShowModal(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/hod_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('HodScreen03')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>View Course</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <Text style={styles.label}>Course Name</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.label}>Assigned To</Text>

          {/* Confirmation Modal */}
          <Modal
            visible={showModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowModal(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                  elevation: 10,
                  width: '90%',
                }}>
                <Text style={{color: 'black'}}>
                  Are you sure you, you want unassign
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    {' '}
                    "{courseToDelete}"{' '}
                  </Text>
                  from
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    {' '}
                    "{facultyToDelete}"
                  </Text>
                  ?
                </Text>
                <View style={styles.modalbuttonscontainer}>
                  <TouchableOpacity
                    style={styles.modalcancelbutton}
                    onPress={() => setShowModal(false)}>
                    <Text style={styles.editbuttonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modaldeletebutton}
                    onPress={() => {
                      confirmDelete(itemToDelete);
                    }}>
                    <Text style={styles.editbuttonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <FlatList
            data={assignedTo}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>{item.f_name}</Text>
                </View>

                <View style={styles.column}>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        handleDelete(item.c_title, item.f_name, item.ac_id)
                      }>
                      <Image
                        source={require('../../assets/delete_icon.png')}
                        style={styles.deleteIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.CLObuttonContainer}>
            <TouchableOpacity
              style={styles.CLOButton}
              onPress={() => handleCLO()}>
              <Text style={styles.CLOText}>Manage CLOS</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </ScrollView> */}
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
    marginTop: 20,
    // borderWidth: 2,
    // borderColor: 'yellow',
  },
  header: {
    flexDirection: 'row',
  },
  headerText: {
    height: 70,
    width: 320,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  label: {
    marginTop: 20,
    fontSize: 25,
    textAlign: 'center',
    color: 'yellow',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  name: {
    marginTop: 10,
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
  },
  data_name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    // textAlign: 'center',
    // borderWidth: 2,
    // borderColor: 'black',
    width: 280,
  },
  input: {
    height: 41,
    width: 340,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
  },
  searchinput: {
    height: 40,
    width: 300,
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 13,
    marginTop: 16,
    paddingHorizontal: 8,
    color: 'white',
    backgroundColor: 'black',
  },
  tableheader: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 40,
    marginTop: 30,
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    backgroundColor: 'black',
  },
  columnHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    height: 65,
    borderRadius: 15,
    color: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#CDCDCD',
  },
  column: {
    flex: 1,
  },
  flatlist: {
    marginTop: 30,
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
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: 80,
    // marginLeft: 10,
    // borderWidth: 2,
    // borderColor: 'black',
    justifyContent: 'center',
    marginLeft: 100,
  },
  CLObuttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 50,
  },
  deleteButton: {
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  deleteIcon: {
    height: 22,
    width: 22,
  },
  CLOButton: {
    borderRadius: 10,
    backgroundColor: '#00DDDD',
    justifyContent: 'center',
    height: 40,
    width: 160,
    borderWidth: 2,
    borderColor: 'white',
  },
  CLOText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  addIcon: {
    height: 50,
    width: 50,
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
  editbuttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HodScreen05;
