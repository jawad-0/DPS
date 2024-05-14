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
} from 'react-native';
import {ip, course_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const HodScreen03 = () => {
  const navigation = useNavigation();
  const [facultyMembers, setFacultyMembers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = item => {
    navigation.navigate('HodScreen05', {courseId: item.c_id, courseTitle: item.c_title, courseCode: item.c_code});
  };

  const handleSearch = text => {
    const apiEndpoint = `http://${ip}:${course_port}/searchCourse?search=${text}`;

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

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${course_port}/getCourse`;
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
          <Text style={styles.headerText}>Course Detail</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <TextInput
            style={styles.searchinput}
            placeholder="Search"
            placeholderTextColor={'gray'}
            onChangeText={text => handleSearch(text)}
          />

          <FlatList
            data={facultyMembers}
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
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handleView(item)}>
                      <Image
                        source={require('../../assets/view_icon.png')}
                        style={styles.viewIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
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
    marginLeft: 65,
    textAlign: 'center',
    color: 'black',
    width: 60,
    fontWeight: 'bold',
    // textDecorationLine: 'underline',
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
  searchinput: {
    height: 40,
    width: 300,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 13,
    marginTop: 16,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#CDCDCD',
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
    height: 45,
    width: '98%',
    marginLeft: '1%',
    borderRadius: 10,
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

export default HodScreen03;
