import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Keyboard,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {ip, approved_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const DtcScreen06 = () => {
  const navigation = useNavigation();
  const [facultyMembers, setFacultyMembers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = text => {
    const apiEndpoint = `http://${ip}:${approved_port}/searchapprovedpapers?search=${text}`;

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

  const handleStatus = p_id => {
    const apiEndpoint = `http://${ip}:${approved_port}/editapprovedpaperstatus/${p_id}`;

    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to edit faculty status');
        }
        return response.json();
      })
      .then(data => {
        console.log('Paper status updated successfully:', data);
        ToastAndroid.show('Paper status updated', ToastAndroid.SHORT);
        fetchData();
      })
      .catch(error => {
        console.error('Error editing paper status:', error);
        ToastAndroid.show('Error: Failed to edit status.', ToastAndroid.SHORT);
      });
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${approved_port}/getapprovedpapers`;
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
            onPress={() => navigation.navigate('DtcScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Approved Papers</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
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
                source={require('../../assets/printer.png')}
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
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>{item.c_title}</Text>
                </View>

                <View style={styles.column}>
                  <TouchableOpacity
                    style={styles.printButton}
                    onPress={() => handleStatus(item.p_id)}>
                    <Text style={styles.label}>Print</Text>
                  </TouchableOpacity>
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
    marginLeft: 45,
    textAlign: 'center',
    color: 'blue',
    width: 40,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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
    borderBottomWidth: 3,
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
    backgroundColor: '#CDCDCD',
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
  printButton: {
    backgroundColor: '#CDCDCD',
    borderRadius: 10,
    width: 80,
    marginLeft: 60,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
  printIcon: {
    height: 30,
    width: 30,
    marginLeft: 50,
    alignSelf: 'center',
  },
});

export default DtcScreen06;
