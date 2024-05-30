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

const DrtScreen03 = () => {
  const navigation = useNavigation();
  const [pressedButton, setPressedButton] = useState('button1');
  const [approvedpapers, setApprovedPapers] = useState([]);
  const [printedpapers, setPrintedPapers] = useState([]);

  useEffect(() => {
    fetchApproved();
    fetchPrinted();
  }, []);

  const handleButtonPress = button => {
    // Set the pressed button
    setPressedButton(button);
  };

  const handleSearch1 = text => {
    const apiEndpoint = `http://${ip}:${course_port}/searchapprovedpapers?search=${text}`;

    if (text.trim() === '') {
      fetchApproved();
    } else {
      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          setApprovedPapers(data);
        })
        .catch(error => {
          console.error('Error searching data:', error);
        });
    }
  };

  const handleSearch2 = text => {
    const apiEndpoint = `http://${ip}:${course_port}/searchprintedpapers?search=${text}`;

    if (text.trim() === '') {
      fetchPrinted();
    } else {
      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          setPrintedPapers(data);
        })
        .catch(error => {
          console.error('Error searching data:', error);
        });
    }
  };

  const fetchApproved = () => {
    const apiEndpoint = `http://${ip}:${course_port}/getapprovedpapers`;
    // Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setApprovedPapers(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchPrinted = () => {
    const apiEndpoint = `http://${ip}:${course_port}/getprintedpapers`;
    // Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setPrintedPapers(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/drt_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('DrtScreen01')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {pressedButton === 'button1' && (
            <Text style={styles.headerText}>Approved Papers</Text>
          )}
          {pressedButton === 'button2' && (
            <Text style={styles.headerText}>Printed Papers</Text>
          )}
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <View style={styles.buttonsContainer2}>
            <TouchableOpacity
              style={[
                styles.button2,
                pressedButton === 'button1' && styles.activeButton,
              ]}
              onPress={() => handleButtonPress('button1')}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>Approved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button2,
                pressedButton === 'button2' && styles.activeButton,
              ]}
              onPress={() => handleButtonPress('button2')}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>Printed</Text>
            </TouchableOpacity>
          </View>

          {pressedButton === 'button1' && (
            <TextInput
              style={styles.searchinput}
              placeholder="Search By Title or Code"
              placeholderTextColor={'white'}
              onChangeText={text => handleSearch1(text)}
            />
          )}
          {pressedButton === 'button2' && (
            <TextInput
              style={styles.searchinput}
              placeholder="Search By Title or Code"
              placeholderTextColor={'white'}
              onChangeText={text => handleSearch2(text)}
            />
          )}

          <View style={styles.tableheader}>
            <View style={styles.columnContainer1}>
              <Text style={styles.columnHeader}>Courses</Text>
            </View>
            <View style={styles.columnContainer2}>
              <Text style={styles.columnHeader}>Code</Text>
            </View>
          </View>

          {pressedButton === 'button1' && (
            <>
              <FlatList
                data={approvedpapers}
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
                          style={styles.tickButton}
                          onPress={() => console.log(item)}>
                          <Image
                            source={require('../../assets/tick.png')}
                            style={styles.tickIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            </>
          )}
          {pressedButton === 'button2' && (
            <>
              <FlatList
                data={printedpapers}
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
                      {/* <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                          style={styles.viewButton}
                          onPress={() => handleView(item)}>
                          <Image
                            source={require('../../assets/view_icon.png')}
                            style={styles.viewIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View> */}
                    </View>
                  </View>
                )}
              />
            </>
          )}
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
    marginTop: 40,
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
    borderColor: 'white',
    borderWidth: 2,
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
    marginTop: 16,
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    backgroundColor: 'black',
  },
  columnContainer1: {
    flex: 1,
    alignSelf: 'center',
  },
  columnContainer2: {
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
    backgroundColor: '#E6E6FA',
  },
  column: {
    flex: 1,
  },
  flatlist: {
    marginTop: 3,
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
  tickButton: {
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  tickIcon: {
    height: 20,
    width: 20,
  },
  buttonsContainer2: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
  button2: {
    backgroundColor: 'white',
    height: 40,
    width: '50%',
    // marginRight: 25,
    borderWidth: 2,
    borderRadius: 7,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  activeButton: {
    backgroundColor: '#58FFAB',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
  },
});

export default DrtScreen03;
