import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Keyboard,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ip, paper_port, feedback_port} from '../CONFIG';
// import SplashScreen from 'react-native-splash-screen';

const DrtScreen05 = ({route}) => {
  const navigation = useNavigation();
  const {paperId, courseId, coursecode, coursetitle} = route.params;
  const {questionId} = useState(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    // console.log(paperId, courseId);
  }, []);

  const handleComment = () => {
    const apiEndpoint = `http://${ip}:${feedback_port}/addfeedback`;
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback: comments,
        p_id: paperId,
        c_id: courseId,
        q_id: questionId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data posted successfully:', data);
        ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
        setComments('');
        Keyboard.dismiss();
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/drt_background.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Comments</Text>
        </View>
        <View style={styles.courseInfo}>
          <Text style={styles.courseText}>{coursetitle}</Text>
          <Text style={styles.courseText}>{coursecode}</Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            value={comments}
            placeholder="Comments ...."
            placeholderTextColor={'gray'}
            onChangeText={text => setComments(text)}
            multiline={true}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity style={styles.sendButton} onPress={handleComment}>
            <Image
              source={require('../../assets/send.png')}
              style={styles.sendIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
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
  courseInfo: {
    marginLeft: '3%',
    marginTop: 30,
    width: '94%',
    backgroundColor: 'black',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
  },
  label: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  input: {
    height: 170,
    width: '94%',
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    marginTop: 50,
    color: 'black',
    backgroundColor: '#CDCDCD',
    textAlignVertical: 'top',
    padding: 10,
  },
  courseText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerText: {
    height: 70,
    width: '100%',
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    // fontFamily: 'FuzzyBubbles-Regular',
    textAlign: 'center',
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'black',
  },
  welcomeText: {
    height: 70,
    textAlignVertical: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 20,
    color: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
  },
  button: {
    backgroundColor: '#D2B4DE',
    padding: 10,
    height: 105,
    width: 185,
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
  },
  buttonscontainer: {
    marginTop: 110,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 30,
    width: 25,
    alignSelf: 'center',
    // borderWidth: 2,
    // borderColor: 'white',
  },
  backIcon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 30,
    width: 25,
    marginRight: 25,
    marginTop: 15,
    // borderWidth: 2,
    // borderColor: 'white',
  },
  sendIcon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
});

export default DrtScreen05;
