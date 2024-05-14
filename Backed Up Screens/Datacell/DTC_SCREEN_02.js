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
import {ip, faculty_port} from '../CONFIG';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const DtcScreen02 = () => {
  const navigation = useNavigation();
  const [f_name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [nameToDelete, setNametodelete] = useState(null);
  const [facultyMembers, setFacultyMembers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  //   useFocusEffect(() => {
  //     fetchData();
  //   });

  const handleSearch = text => {
    const apiEndpoint = `http://${ip}:${faculty_port}/searchfaculty?search=${text}`;

    if (text.trim() === '') {
      fetchData();
    } else {
      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          setFacultyMembers(data);
        })
        .catch(error => {
          console.error('Error searching data:', error);
        });
    }
  };

  const handleEdit = item => {
    navigation.navigate('DtcScreen03', {
      itemId: item.f_id,
      itemName: item.f_name,
      itemUsername: item.username,
      itemPassword: item.password,
    });
  };

  //   const handleDelete = (f_id, f_name) => {
  //     console.log(`Delete ${f_id}`);
  //     setItemToDelete(f_id);
  //     setNametodelete(f_name);
  //     setShowModal(true);
  //   };

  //   const confirmDelete = itemToDelete => {
  //     const apiEndpoint = `http://${ip}:${faculty_port}/deleteFaculty/${itemToDelete}`;
  //     if (itemToDelete) {
  //       fetch(apiEndpoint, {
  //         method: 'DELETE',
  //       })
  //         .then(response => {
  //           if (response.ok) {
  //             console.log('Item deleted successfully');
  //             fetchData();
  //           } else {
  //             console.error('Failed to delete item');
  //           }
  //         })
  //         .catch(error => {
  //           console.error('Error deleting item:', error);
  //         });
  //     }
  //     setShowModal(false);
  //   };

  const handleStatus = (f_id, status) => {
    const apiEndpoint = `http://${ip}:${faculty_port}/enabledisablefaculty/${f_id}`;
    console.log(status);
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
          throw new Error('Failed to edit faculty status');
        }
        return response.json();
      })
      .then(data => {
        console.log('Faculty status updated successfully:', data);
        ToastAndroid.show('Faculty status updated', ToastAndroid.SHORT);
        fetchData();
      })
      .catch(error => {
        console.error('Error editing faculty status:', error);
        ToastAndroid.show('Error: Failed to edit status.', ToastAndroid.SHORT);
      });
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${faculty_port}/getfaculty`;
    // Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setFacultyMembers(data);
        setName('');
        setUsername('');
        setPassword('');
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handlePostData = () => {
    if (
      f_name.trim() === '' ||
      username.trim() === '' ||
      password.trim() === ''
    ) {
      // Alert.alert('Error', 'Please fill in the field');
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    const apiEndpoint = `http://${ip}:${faculty_port}/addfaculty`;

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        f_name: f_name,
        username: username,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data posted successfully:', data);
        ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
        Keyboard.dismiss();
        fetchData();
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/dtc_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('DtcScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Faculty Members</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={f_name}
            placeholder="Enter Name"
            placeholderTextColor={'gray'}
            onChangeText={text => setName(text)}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            placeholder="Enter Username"
            placeholderTextColor={'gray'}
            onChangeText={text => setUsername(text)}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="**********"
            placeholderTextColor={'gray'}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.button} onPress={handlePostData}>
            <Text style={styles.buttonText}>Add User</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.searchinput}
            placeholder="Search"
            placeholderTextColor={'white'}
            onChangeText={text => handleSearch(text)}
          />

          {/* <View style={styles.tableheader}>
            <Text style={styles.columnHeader}>Name</Text>
            <Text style={styles.columnHeader}>Username</Text>
            <Text style={styles.columnHeader}>Actions</Text>
          </View> */}

          <View style={styles.tableheader}>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Name</Text>
            </View>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Username</Text>
            </View>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Actions</Text>
            </View>
          </View>

          {/* Confirmation Modal */}
          {/* <Modal
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
                  Are you sure you, you want to delete record of
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    {' '}
                    "{nameToDelete}"
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
          </Modal> */}

          <FlatList
            data={facultyMembers}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>{item.f_name}</Text>
                </View>

                <View style={styles.column}>
                  <Text style={styles.data_username}>{item.username}</Text>
                </View>

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
              </View>
            )}
          />
        </View>
        {/* </ScrollView> */}
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
  label: {
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 20,
    color: 'white',
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
    height: 41,
    width: 340,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#CDCDCD',
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
    backgroundColor: '#FFEA00',
    padding: 10,
    height: 50,
    width: 150,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
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
    backgroundColor: '#CDCDCD',
    height: 45,
    borderRadius: 15,
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default DtcScreen02;
