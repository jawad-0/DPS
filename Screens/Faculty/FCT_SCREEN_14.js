import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, feedback_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const FctScreen14 = ({route}) => {
  const navigation = useNavigation();
  const {facultyId} = route.params;
  const [feedback, setFeedback] = useState([]);
  const [pressedButton, setPressedButton] = useState('button1');

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonPress = button => {
    fetchData();
    setPressedButton(button);
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${feedback_port}/getFeedback/${facultyId}`;
    // Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setFeedback(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/fct_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.navigate('FctScreen01', {facultyId: facultyId})
            }>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Comments</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                pressedButton === 'button1' && styles.activeButton,
              ]}
              onPress={() => handleButtonPress('button1')}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>On Question</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                pressedButton === 'button2' && styles.activeButton,
              ]}
              onPress={() => handleButtonPress('button2')}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>On Header</Text>
            </TouchableOpacity>
          </View>
          {pressedButton === 'button1' && (
            <>
              <FlatList
                data={feedback}
                style={styles.flatlist}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) =>
                  item.q_id ? (
                    <View style={styles.listItem}>
                      <View style={styles.column}>
                        <View style={styles.dataContainer}>
                          <Text style={styles.data_code}>{item.c_code}</Text>
                          <Text style={styles.data_title}>{item.c_title}</Text>
                        </View>
                        {!item.q_id ? (
                          <Text style={styles.data_feedback}>
                            {item.fb_text}
                          </Text>
                        ) : (
                          <Text style={styles.data_feedback}>
                            Q-No# {item.q_id}: {item.fb_text}
                          </Text>
                        )}
                      </View>
                    </View>
                  ) : null
                }
              />
            </>
          )}
          {pressedButton === 'button2' && (
            <>
              <FlatList
                data={feedback}
                style={styles.flatlist}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) =>
                  !item.q_id ? (
                    <View style={styles.listItem}>
                      <View style={styles.column}>
                        <View style={styles.dataContainer}>
                          <Text style={styles.data_code}>{item.c_code}</Text>
                          <Text style={styles.data_title}>{item.c_title}</Text>
                        </View>
                        <Text style={styles.data_feedback}>{item.fb_text}</Text>
                      </View>
                    </View>
                  ) : null
                }
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
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  data_code: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'blue',
    marginLeft: 10,
    // textAlign: 'center',
    width: '15%',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  data_title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5,
    // textAlign: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  data_feedback: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginLeft: 10,
    // textAlign: 'center',
    width: '94%',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    height: 80,
    height: 'auto',
    padding: 5,
    borderRadius: 10,
    width: '98%',
    marginLeft: '1%',
    color: 'black',
    backgroundColor: 'white',
    // backgroundColor: '#E6E6FA',
    // justifyContent: 'space-between',
    // alignItems: 'center',
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
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    // marginLeft: 10,
    // marginTop: 30,
    // borderWidth: 2,
    // borderColor: 'yellow',
    // justifyContent: 'flex-end',
  },
  button: {
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
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
  },
  activeButton: {
    backgroundColor: '#58FFAB',
  },
});

export default FctScreen14;
