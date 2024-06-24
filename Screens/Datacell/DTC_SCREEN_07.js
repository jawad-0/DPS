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
import {ip, printed_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const DtcScreen07 = () => {
  const navigation = useNavigation();
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPrintedPapers();
  }, []);

  const handleItemPress = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleSearch = text => {
    const apiEndpoint = `http://${ip}:${printed_port}/searchprintedpapers?search=${text}`;

    if (text.trim() === '') {
      fetchPrintedPapers();
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

  const fetchPrintedPapers = () => {
    const apiEndpoint = `http://${ip}:${printed_port}/getprintedpapers`;
    // Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setFacultyMembers(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
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
          <Text style={styles.headerText}>Printed Papers</Text>
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
          <TextInput
            style={styles.searchinput}
            placeholder="Search"
            placeholderTextColor={'gray'}
            onChangeText={text => handleSearch(text)}
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
            data={facultyMembers}
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
                  <Text style={styles.label}>Printed</Text>
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
    marginTop: 20,
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
    marginLeft: 90,
    textAlign: 'center',
    color: 'green',
    width: 60,
    fontWeight: 'bold',
    // borderWidth: 1,
    // borderColor: 'black',
    // textDecorationLine: 'underline',
  },
  data_name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    textAlign: 'center',
    width: 240,
    // borderWidth: 1,
    // borderColor: 'black',
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
  columnContainer: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'yellow',
  },
  columnHeader: {
    fontSize: 20,
    width: 250,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    // borderWidth: 1,
    // borderColor: 'white',
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
    // borderWidth: 1,
    // borderColor: 'white',
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

export default DtcScreen07;
