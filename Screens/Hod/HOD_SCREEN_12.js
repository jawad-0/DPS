import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Keyboard,
  FlatList,
  TextInput,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const HodScreen12 = () => {
  const navigation = useNavigation();
  const [session, setSession] = useState('');
  const [s_id, setID] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [mode, setMode] = useState('add');

  useEffect(() => {
    fetchSession();
  }, []);

  const handleAddOrUpdateCLO = () => {
    if (mode === 'add') {
      addSession();
    } else if (mode === 'edit') {
      editSession(s_id);
    }
  };

  const handleClear = () => {
    setMode('add');
    setName('');
    setYear('');
    Keyboard.dismiss();
  };

  const handleEdit = item => {
    setMode('edit');
    setID(item.s_id);
    setName(item.s_name);
    setYear(item.year);
  };

  const fetchSession = () => {
    const apiEndpoint = `http://${ip}:${port}/getsession`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setSession(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const addSession = () => {
    setMode('add');
    if (name.trim() === '' || year.trim() === '') {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    const isInteger = value => Number.isInteger(Number(value));
    // Method 2 -- const isInteger = value => /^\d+$/.test(value);
    if (!isInteger(year)) {
      ToastAndroid.show('Year must be of integer type.', ToastAndroid.SHORT);
      return;
    }
    const apiEndpoint = `http://${ip}:${port}/addsession`;
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        s_name: name,
        year: year,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data posted successfully:', data);
        ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
        Keyboard.dismiss();
        setName('');
        setYear('');
        fetchSession();
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  };

  const editSession = s_id => {
    setMode('edit');
    if (name.trim() === '' || year.trim() === '') {
      ToastAndroid.show('Error: Please fill all fields.', ToastAndroid.SHORT);
      return;
    }
    const isInteger = value => Number.isInteger(Number(value));
    // Method 2 -- const isInteger = value => /^\d+$/.test(value);
    if (!isInteger(year)) {
      ToastAndroid.show('Year must be of integer type.', ToastAndroid.SHORT);
      return;
    }
    const apiEndpoint = `http://${ip}:${port}/editsession/${s_id}`;
    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        s_name: name,
        year: year,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // console.log('Data posted successfully:', data);
        ToastAndroid.show('Updated Successfully !', ToastAndroid.SHORT);
        Keyboard.dismiss();
        setName('');
        setYear('');
        setMode('add');
        fetchSession();
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleStatus = s_id => {
    const apiEndpoint = `http://${ip}:${port}/enabledisablesession/${s_id}`;
    console.log(`Updating session status for session ID: ${s_id}`);

    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to edit session status');
        }
        return response.json();
      })
      .then(data => {
        console.log('Session status updated successfully:', data);
        ToastAndroid.show('Session status updated', ToastAndroid.SHORT);
        fetchSession();
      })
      .catch(error => {
        console.error('Error editing session status:', error);
        ToastAndroid.show('Error: Failed to edit status.', ToastAndroid.SHORT);
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
            onPress={() => navigation.navigate('HodScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Manage Session</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Session Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            placeholder="Enter Name"
            placeholderTextColor={'gray'}
            onChangeText={text => setName(text)}
          />

          <Text style={styles.label}>Session Year</Text>
          <TextInput
            style={styles.input}
            value={year.toString()}
            keyboardType="numeric"
            placeholder="Enter Year"
            placeholderTextColor={'gray'}
            onChangeText={text => setYear(text)}
          />

          <View style={styles.mainButtonsContainer}>
            {mode === 'edit' && (
              <TouchableOpacity
                style={styles.clearbutton}
                onPress={handleClear}>
                <Text style={styles.clearText}>CLEAR</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleAddOrUpdateCLO}>
              <Text style={styles.buttonText}>
                {mode === 'add' ? 'ADD' : 'UPDATE'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableheader}>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Session</Text>
            </View>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Year</Text>
            </View>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Actions</Text>
            </View>
          </View>

          <FlatList
            data={session}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>{item.s_name}</Text>
                </View>

                <View style={styles.column}>
                  <Text style={styles.data_year}>{item.year}</Text>
                </View>

                <View style={styles.column}>
                  <View style={styles.buttonsContainer}>
                    {item.flag === 'inactive' ? (
                      <TouchableOpacity
                        style={styles.disableButton}
                        onPress={() => handleStatus(item.s_id, item.flag)}>
                        <Text style={styles.disablebuttonText}>Set Active</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.enableButton}
                        onPress={() => console.log(item.s_id, item.flag)}>
                        <Text style={styles.enablebuttonText}>Actived</Text>
                      </TouchableOpacity>
                    )}
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
    // backgroundColor: 'blue',
    borderWidth: 2,
    borderColor: 'black',
    // justifyContent: 'center',
    // backgroundColor: 'white',
  },
  form: {
    flex: 1,
    marginTop: 50,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 10,
    textAlign: 'center',
  },
  data_year: {
    fontSize: 18,
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
    backgroundColor: 'black',
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
    // borderColor: 'red',
    textAlign: 'center',
  },
  mainButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 30,
  },
  button: {
    backgroundColor: '#00DDDD',
    padding: 10,
    height: 45,
    width: 100,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  clearbutton: {
    backgroundColor: 'red',
    marginRight: 5,
    padding: 10,
    height: 45,
    width: 100,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
    height: 50,
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
    marginLeft: 10,
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
    width: '60%',
    borderRadius: 7,
    justifyContent: 'center',
  },
  enableButton: {
    backgroundColor: '#0DEC09',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: '60%',
    borderRadius: 7,
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

export default HodScreen12;
