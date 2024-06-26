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
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';

const HodScreen13 = () => {
  const navigation = useNavigation();
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [courses, setCourses] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleView = item => {
    navigation.navigate('HodScreen14', {
      courseId: item.c_id,
      courseTitle: item.c_title,
      courseCode: item.c_code,
      year: year,
      session: session,
    });
  };

  const yearOptions = ['2023', '2024', '2025'];
  const sessionOptions = ['Fall', 'Spring', 'Summer'];

  const fetchCourses = () => {
    const apiEndpoint = `http://${ip}:${port}/getCourse`;
    // Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setCourses(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
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
            activeOpacity={0.5}
            onPress={() => navigation.navigate('HodScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Assigned History</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          {year === '' && session === '' && (
            <Text style={styles.label}>
              Select Year & Session for History **
            </Text>
          )}
          {(year !== '' || session !== '') && (
            <Text style={styles.label}></Text>
          )}

          <SelectDropdown
            data={yearOptions}
            onSelect={(selectedItem, index) => {
              setYear(selectedItem);
              console.log(selectedItem);
            }}
            defaultButtonText="Select Year"
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
          <SelectDropdown
            data={sessionOptions}
            onSelect={(selectedItem, index) => {
              setSession(selectedItem);
              console.log(selectedItem);
            }}
            defaultButtonText="Select Session"
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
          <View style={styles.tableheader}>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Courses</Text>
            </View>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Code</Text>
            </View>
          </View>

          <FlatList
            data={courses}
            style={styles.flatlist}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>{item.c_title}</Text>
                </View>

                <View style={styles.column}>
                  <Text style={styles.data_code}>{item.c_code}</Text>
                </View>

                <View style={styles.column}>
                  {year !== '' && session !== '' && (
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={styles.viewButton}
                        activeOpacity={0.5}
                        onPress={() => handleView(item)}>
                        <Image
                          source={require('../../assets/view_icon.png')}
                          style={styles.viewIcon}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
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
    borderWidth: 2,
    borderColor: 'black',
  },
  form: {
    flex: 1,
    marginTop: 10,
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
    fontSize: 15,
    color: 'white',
    marginLeft: 10,
    marginBottom: 5,
  },
  dropdownButtonStyle: {
    width: '50%',
    height: 40,
    marginTop: 3,
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
  data_name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    // textAlign: 'center',
    // borderWidth: 2,
    // borderColor: 'black',
    width: 220,
  },
  data_code: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'blue',
    marginLeft: 120,
    textAlign: 'center',
    // borderWidth: 2,
    // borderColor: 'black',
    width: 80,
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
  tableheader: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 40,
    marginTop: 30,
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    backgroundColor: 'black',
  },
  columnContainer: {
    flex: 1,
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
    height: 45,
    borderRadius: 15,
    color: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
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
  backButton: {
    justifyContent: 'center',
    borderRadius: 13,
    marginLeft: 20,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
  printIcon: {
    height: 25,
    width: 25,
    marginLeft: 50,
    alignSelf: 'center',
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
    color: 'black',
  },
  closeButton: {
    marginTop: 10,
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
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: 30,
    // marginLeft: 10,
    // borderWidth: 2,
    // borderColor: 'black',
    justifyContent: 'center',
    marginLeft: 85,
  },
  viewButton: {
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  viewIcon: {
    height: 18,
    width: 18,
  },
});

export default HodScreen13;
