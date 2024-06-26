import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ToastAndroid,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ip, paper_port, question_port} from '../CONFIG';
// import SplashScreen from 'react-native-splash-screen';

const DrtScreen06 = ({route}) => {
  const navigation = useNavigation();
  const {paperId} = route.params;
  const [paperheaderfaculty, setPaperHeaderFaculty] = useState('');
  const [courseId, setCourseId] = useState('');
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
  const [questions, setQuestion] = useState('');

  useEffect(() => {
    // console.log(paperId);
    fetchData();
    fetchfacultyData();
  }, []);

  const handleView = () => {
    console.log('View Button Clicked!');
  };

  const fetchData = () => {
    const apiEndpoint = `http://${ip}:${question_port}/getQuestion/${paperId}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setQuestion(data);
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
          <Text style={styles.headerText}>Paper Setting</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={styles.uniInfoStart}>
            <Image
              source={require('../../assets/barani.png')}
              style={styles.baraniIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.uniInfo}>
            <Text style={styles.uniInfoText}>
              Barani Institute of Information Technology
            </Text>
            <Text style={styles.uniInfoText}>
              PMAS Arid Agriculture University,
            </Text>
            <Text style={styles.uniInfoText}>Rawalpindi Pakistan</Text>
            <Text style={styles.uniInfoText}>
              {semester} {year} : {term} Term Examination
            </Text>
          </View>
          <View style={styles.uniInfoEnd}>
            <Image
              source={require('../../assets/barani.png')}
              style={styles.baraniIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.courseInfo}>
          <Text style={styles.courseInfoText}>
            <Text style={{textDecorationLine: 'underline'}}>Course Title</Text>{' '}
            : {coursetitle}
          </Text>
          <Text style={styles.courseInfoText}>
            <Text style={{textDecorationLine: 'underline'}}>Date Of Exam</Text>{' '}
            : {examdate}{' '}
            <Text style={{textDecorationLine: 'underline'}}>Duration</Text> :{' '}
            {duration}{' '}
            <Text style={{textDecorationLine: 'underline'}}>Code</Text> :{' '}
            {coursecode}{' '}
            <Text style={{textDecorationLine: 'underline'}}>Degree</Text> :{' '}
            {degree}{' '}
            <Text style={{textDecorationLine: 'underline'}}>Marks</Text> :{' '}
            {tmarks}
            {'\n'}
            <Text style={{textDecorationLine: 'underline'}}>
              Teachers
            </Text> :{' '}
            {paperheaderfaculty.length > 0
              ? paperheaderfaculty.map(faculty => faculty.f_name).join(', ')
              : ''}
          </Text>
        </View>

        <View style={styles.paperInfo}>
          <FlatList
            data={questions}
            style={styles.flatlist}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <Text style={styles.data_text}>Question # {index + 1} :</Text>
                  <Text style={styles.data_text}>{item.q_text}</Text>
                  <Text style={styles.data_difficulty}>
                    [ {item.q_difficulty}, Marks: {item.q_marks} ]
                  </Text>
                  <View style={styles.buttonscontainer}>
                    <TouchableOpacity style={styles.acceptButton}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton}>
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
        <View>
          <TouchableOpacity style={styles.viewButton} onPress={handleView}>
            <Text style={styles.viewText}>View Topics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButton} onPress={handleView}>
            <Text style={styles.viewText}>Approve</Text>
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
  flatlist: {
    // marginTop: 5,
  },
  data_text: {
    color: 'black',
  },
  data_difficulty: {
    color: 'black',
    textAlign: 'right',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
    color: 'black',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  column: {
    flex: 1,
  },
  uniInfoStart: {
    marginLeft: '2%',
    marginTop: 30,
    width: '13%',
    justifyContent: 'center',
    backgroundColor: 'white',
    // borderRadius: 10,
    // borderColor: 'white',
    // borderWidth: 1,
    // padding: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  uniInfo: {
    marginTop: 30,
    width: '70%',
    backgroundColor: 'white',
    // borderRadius: 10,
    // borderColor: 'white',
    // borderWidth: 1,
    padding: 3,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  uniInfoEnd: {
    marginTop: 30,
    marginLeft: -0.4,
    width: '13%',
    justifyContent: 'center',
    backgroundColor: 'white',
    // borderRadius: 10,
    // borderColor: 'blue',
    // borderWidth: 1,
    // padding: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  uniInfoText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
  },
  courseInfo: {
    marginLeft: '2%',
    width: '96%',
    backgroundColor: 'white',
    // borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
  },
  label: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
  },
  courseInfoText: {
    color: 'black',
    fontSize: 13,
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
    marginTop: 20,
    marginLeft: 5,
    borderRadius: 10,
    width: '96%',
    marginLeft: '2%',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    padding: 3,
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
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttonscontainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  acceptButton: {
    width: 70,
    height: 20,
    borderRadius: 5,
    marginRight: 5,
    backgroundColor: 'green',
    justifyContent: 'center'
  },
  rejectButton: {
    width: 70,
    height: 20,
    borderRadius: 5,
    backgroundColor: 'red',
    justifyContent: 'center'
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
  commentButton: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 30,
    width: 25,
    marginRight: 20,
    // borderWidth: 2,
    // borderColor: 'white',
  },
  baraniIcon: {
    height: 50,
    width: 40,
    alignSelf: 'center',
  },
  viewButton: {
    width: 160,
    height: 45,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  viewIcon: {
    height: 30,
    width: 30,
  },
});

export default DrtScreen06;
