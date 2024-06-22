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
import {ip, printed_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';

const DtcScreen08 = () => {
  const navigation = useNavigation();
  const [papers, setPapers] = useState([]);
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [term, setTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // fetchData();
  }, []);

  const handleItemPress = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const yearOptions = ['All', '2023', '2024', '2025'];
  const sessionOptions = ['All', 'Fall', 'Spring', 'Summer'];
  const termOptions = ['All', 'Mid', 'Final'];

  const fetchData = (year, session, term, setPapers) => {
    console.log('Fetching data with params:', {year, session, term});
    const apiEndpoint = `http://${ip}:${printed_port}/searchpapershistory?year=${year}&session=${session}&term=${term}`;
    fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 error
            throw new Error('No papers found matching the criteria.');
          } else {
            // Handle other errors
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        }
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data);
        setPapers(data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        setPapers([]);
        ToastAndroid.show('No Data Found!', ToastAndroid.SHORT);
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
            activeOpacity={0.5}
            onPress={() => navigation.navigate('DtcScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Papers History</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
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
                    Term:{' '}
                    <Text style={{fontWeight: 'bold', color: 'green'}}>
                      {selectedItem.term}
                    </Text>
                  </Text>
                  <Text style={styles.modalText}>
                    Degree: {selectedItem.degree}
                  </Text>
                  <Text style={styles.modalText}>
                    Date: {selectedItem.exam_date}
                  </Text>
                  <Text style={styles.modalText}>
                    Duration: {selectedItem.duration}
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
          <SelectDropdown
            data={yearOptions}
            onSelect={(selectedItem, index) => {
              const selectedYear = selectedItem === 'All' ? '' : selectedItem;
              setYear(selectedYear);
              fetchData(selectedYear, session, term, setPapers);
              console.log(selectedYear);
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
              const selectedSession =
                selectedItem === 'All' ? '' : selectedItem;
              setSession(selectedSession);
              fetchData(year, selectedSession, term, setPapers);
              console.log(selectedSession);
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
          <SelectDropdown
            data={termOptions}
            onSelect={(selectedItem, index) => {
              const selectedTerm = selectedItem === 'All' ? '' : selectedItem;
              setTerm(selectedTerm);
              fetchData(year, session, selectedTerm, setPapers);
              console.log(selectedTerm);
            }}
            defaultButtonText="Select Term"
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
              {/* <Text style={styles.columnHeader}>Action</Text> */}
              <Image
                source={require('../../assets/printed.png')}
                style={styles.printIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          <FlatList
            data={papers}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.listItem}
                onPress={() => handleItemPress(item)}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>{item.c_title}</Text>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>{item.exam_date}</Text>
                </View>
              </TouchableOpacity>
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
    marginLeft: 70,
    textAlign: 'center',
    color: 'green',
    width: 100,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    textAlign: 'center',
    width: 240,
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
    width: 250,
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
});

export default DtcScreen08;
