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
import {ip, printed_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const FctScreen15 = ({route}) => {
  const navigation = useNavigation();
  const {facultyId} = route.params;
  const [facultyMembers, setFacultyMembers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  //   let labelStyle;
  //   switch (item.status) {
  //     case 'status1':
  //       labelStyle = styles.status1Label;
  //       break;
  //     case 'status2':
  //       labelStyle = styles.status2Label;
  //       break;
  //     default:
  //       labelStyle = styles.defaultLabel;
  //   }

  const handleSearch = text => {
    const apiEndpoint = `http://${ip}:${printed_port}/searchprintedpapers?search=${text}`;

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
    const apiEndpoint = `http://${ip}:${printed_port}/getPaperStatus/${facultyId}`;
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
          <Text style={styles.headerText}>Paper Status</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          {/* <TextInput
            style={styles.searchinput}
            placeholder="Search"
            placeholderTextColor={'gray'}
            onChangeText={text => handleSearch(text)}
          /> */}

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
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_name}>{item.c_title}</Text>
                </View>
                {item.status === 'pending' ? (
                  <View style={styles.column}>
                    <Text style={styles.label}>
                      <Text
                        style={{
                          color: '#EEFF00',
                          textShadowColor: 'black',
                          textShadowOffset: {width: 1, height: 1},
                          textShadowRadius: 2,
                          backgroundColor: 'transparent',
                        }}>
                        {item.status}
                      </Text>
                    </Text>
                  </View>
                ) : item.status === 'approved' ? (
                  <View style={styles.column}>
                    <Text style={styles.label}>
                      <Text
                        style={{
                          color: '#00FFFF',
                          textShadowColor: 'black',
                          textShadowOffset: {width: 1, height: 1},
                          textShadowRadius: 2,
                          backgroundColor: 'transparent',
                        }}>
                        {item.status}
                      </Text>
                    </Text>
                  </View>
                ) : item.status === 'printed' ? (
                  <View style={styles.column}>
                    <Text style={styles.label}>
                      <Text
                        style={{
                          color: '#0FFF50',
                          textShadowColor: 'black',
                          textShadowOffset: {width: 1, height: 1},
                          textShadowRadius: 2,
                          backgroundColor: 'transparent',
                        }}>
                        {item.status}
                      </Text>
                    </Text>
                  </View>
                ) : (
                  <View style={styles.column}>
                    <Text style={styles.label}>
                      <Text
                        style={{
                          color: 'black',
                          textShadowColor: 'white',
                          textShadowOffset: {width: 1, height: 1},
                          textShadowRadius: 2,
                          backgroundColor: 'transparent',
                        }}>
                        N/A
                      </Text>
                    </Text>
                  </View>
                )}
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
    marginLeft: 80,
    textAlign: 'center',
    color: 'black',
    width: 70,
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
});

export default FctScreen15;
