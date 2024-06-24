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

const HodScreen14 = ({route}) => {
  const navigation = useNavigation();
  const {courseId, courseTitle, courseCode, year, session} = route.params;
  const [assignedTo, setAssignedTo] = useState([]);

  useEffect(() => {
    fetchAssignedTo();
  }, []);

  const fetchAssignedTo = () => {
    const c_id = courseId;
    const apiEndpoint = `http://${ip}:${port}/getHistoryAssignedTo/${c_id}/${year}/${session}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', assignedData);
        // console.log(data);
        const ids = data.map(item => item.ac_id); // Extract all IDs
        console.log('All assigned course IDs:', ids);
        setAssignedTo(data);
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
            activeOpacity={0.5}
            onPress={() => navigation.navigate('HodScreen13')}>
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
          <Text style={styles.label}>Course Name</Text>
          <Text style={styles.name}>{courseTitle}</Text>
          <Text style={styles.label}>Assigned To</Text>
          {assignedTo.length === 0 && (
            <View style={styles.flatlist}>
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.no_data}>No records found!</Text>
                </View>
              </View>
            </View>
          )}
          <FlatList
            data={assignedTo}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>
                    {item.f_name}
                    <Text style={{color: 'blue'}}>
                      {item.role === 'senior' ? ' (Senior)' : ''}
                    </Text>
                  </Text>
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
  no_data: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    // borderWidth: 2,
    // borderColor: 'black',
  },
  data_name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    // borderWidth: 2,
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
    width: '90%',
    marginLeft: '5%',
    height: 55,
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
    marginTop: 20,
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
    maxWidth: 80,
    // marginLeft: 10,
    // borderWidth: 2,
    // borderColor: 'black',
    justifyContent: 'center',
    marginLeft: 100,
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

export default HodScreen14;
