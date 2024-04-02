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
import {ip, paper_port} from '../CONFIG';
// import SplashScreen from 'react-native-splash-screen';

const DrtScreen04 = ({route}) => {
  const navigation = useNavigation();
  const {paperId} = route.params;
  const [paperheaderfaculty, setPaperHeaderFaculty] = useState('');
  const [coursetitle, setCourseTitle] = useState('');
  const [coursecode, setCourseCode] = useState('');
  const [duration, setDuration] = useState('');
  const [degree, setDegree] = useState('');
  const [tmarks, setTmarks] = useState('');
  const [term, setTerm] = useState('');
  const [year, setYear] = useState('');
  const [examdate, setExamDate] = useState('');
  const [semester, setSemester] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchData();
    fetchfacultyData();
  }, []);

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${paper_port}/getpaperheader/${paperId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
        setCourseCode(data[0].c_code);
        setCourseTitle(data[0].c_title);
        setDuration(data[0].duration);
        setDegree(data[0].degree);
        setTmarks(data[0].t_marks);
        setTerm(data[0].term);
        setYear(data[0].year);
        setExamDate(data[0].exam_date);
        setSemester(data[0].semester);
        setStatus(data[0].status);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchfacultyData = () => {
    const apiEndpoint = `http://${ip}:${paper_port}/getpaperheaderfaculty/${paperId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log('Data fetched successfully:', data);
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
          <Text style={styles.headerText}>Paper Information</Text>
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
          <Text style={styles.label}>
            Teachers:{' '}
            <Text style={styles.data_faculty}>
              {paperheaderfaculty.length > 0
                ? paperheaderfaculty.map(faculty => faculty.f_name).join(', ')
                : ''}
            </Text>
          </Text>
          {/* <Text style={styles.label}>
            Course Title: <Text style={styles.data}>{coursetitle}</Text>
          </Text> */}
          <Text style={styles.label}>
            Course Code: <Text style={styles.data}>{coursecode}</Text>
          </Text>
          <Text style={styles.label}>
            Date of Exam: <Text style={styles.data}>{examdate}</Text>
          </Text>
          <Text style={styles.label}>
            Duration: <Text style={styles.data}>{duration}</Text>
          </Text>
          <Text style={styles.label}>
            Degree: <Text style={styles.data}>{degree}</Text>
          </Text>
          <Text style={styles.label}>
            Session: <Text style={styles.data}>{semester}</Text>
          </Text>
          <Text style={styles.label}>
            Term: <Text style={styles.data}>{term}</Text>
          </Text>
          <Text style={styles.label}>
            Year: <Text style={styles.data}>{year}</Text>
          </Text>
          <Text style={styles.label}>
            Total Marks: <Text style={styles.data}>{tmarks}</Text>
          </Text>
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
  courseText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  data: {
    color: 'yellow',
  },
  data_faculty: {
    color: 'cyan',
  },
  paperInfo: {
    marginTop: 30,
    marginLeft: 5,
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
});

export default DrtScreen04;
