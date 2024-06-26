import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ip, port} from '../CONFIG';
// import SplashScreen from 'react-native-splash-screen';

const DrtScreen04 = ({route}) => {
  const navigation = useNavigation();
  const {paperId} = route.params;
  const [paperheaderfaculty, setPaperHeaderFaculty] = useState('');
  const [courseId, setCourseId] = useState('');
  const [coursetitle, setCourseTitle] = useState('');
  const [coursecode, setCourseCode] = useState('');
  const [duration, setDuration] = useState('');
  const [degree, setDegree] = useState('');
  const [term, setTerm] = useState('');
  const [year, setYear] = useState('');
  const [examdate, setExamDate] = useState('');
  const [session, setSession] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const handleComment = () => {
    navigation.navigate('DrtScreen05', {
      paperId: paperId,
      courseId: courseId,
      coursecode: coursecode,
      coursetitle: coursetitle,
    });
  };

  //   const handleView = () => {
  //     console.log('View Button Clicked!');
  //   };
  const handleView = () => {
    navigation.navigate('DrtScreen06', {
      paperId: paperId,
      courseId: courseId,
    });
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${port}/getpaperheader/${paperId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setCourseId(data[0].c_id);
        setCourseCode(data[0].c_code);
        setCourseTitle(data[0].c_title);
        setDuration(data[0].duration);
        setDegree(data[0].degree);
        setTerm(data[0].term);
        setYear(data[0].year);
        setExamDate(data[0].exam_date);
        setSession(data[0].session);
        setStatus(data[0].status);
        fetchfacultyData(data[0].c_id);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchfacultyData = c_id => {
    const apiEndpoint = `http://${ip}:${port}/getpaperheaderfaculty/${c_id}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setPaperHeaderFaculty(data);
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
            onPress={() => navigation.navigate('DrtScreen02')}>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Paper Information</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={styles.commentButton}
            onPress={handleComment}>
            <Image
              source={require('../../assets/whitecomment.png')}
              style={styles.commentIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.courseInfo}>
          <Text style={styles.courseText}>{coursetitle}</Text>
          <Text style={styles.courseText}>{coursecode}</Text>
        </View>
        {/* <Text
          style={[
            styles.label,
            {
              textAlign: 'center',
              fontSize: 30,
              marginTop: 20,
              textDecorationLine: 'underline',
            },
          ]}>
          PAPER INFO
        </Text> */}
        {/* <Text style={styles.label}>
            Teachers:{' '}
            {paperheaderfaculty && Array.isArray(paperheaderfaculty)
              ? paperheaderfaculty.map(faculty => faculty.f_name).join(', ')
              : 'No teachers available'}
          </Text> */}
        <View style={styles.paperInfo}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.mainlabel}>Teachers: </Text>
            <Text style={styles.data_faculty}>
              {paperheaderfaculty.length > 0
                ? paperheaderfaculty.map(faculty => faculty.f_name).join('\n')
                : ''}
            </Text>
          </View>
          {/* <Text style={styles.label}>
            Course Title: <Text style={styles.data}>{coursetitle}</Text>
          </Text> */}
          {/* <Text style={styles.label}>
            Course Code: <Text style={styles.data}>{coursecode}</Text>
          </Text> */}
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.mainlabel}>Course Code:</Text>
            <Text style={styles.label}>{coursecode}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.mainlabel}>Date of Exam:</Text>
            <Text style={styles.label}>{examdate}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.mainlabel}>Duration:</Text>
            <Text style={styles.label}>{duration}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.mainlabel}>Degree:</Text>
            <Text style={styles.label}>{degree}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.mainlabel}>Session:</Text>
            <Text style={styles.label}>{session}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.mainlabel}>Term:</Text>
            <Text style={styles.label}>{term}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.mainlabel}>Year:</Text>
            <Text style={styles.label}>{year}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.viewButton} onPress={handleView}>
            <Text style={styles.viewText}>View Paper </Text>
            <Image
              source={require('../../assets/printed.png')}
              style={styles.viewIcon}
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
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
  },
  mainlabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
    width: 130,
  },
  label: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
  },
  courseText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    // marginLeft: 10,
  },
  data_faculty: {
    color: 'blue',
    width: 245,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
    flexWrap: 'wrap',
  },
  paperInfo: {
    marginTop: 5,
    marginLeft: 5,
    width: '94%',
    marginLeft: '3%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
  },
  headerText: {
    height: 70,
    width: 320,
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
    backgroundColor: '#E6E6FA',
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
    borderRadius: 13,
    marginLeft: 20,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
  commentButton: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 30,
    width: 25,
    marginRight: 20,
    // borderWidth: 2,
    // borderColor: 'white',
  },
  commentIcon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
  viewButton: {
    width: 150,
    height: 40,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  viewIcon: {
    height: 25,
    width: 25,
  },
});

export default DrtScreen04;
