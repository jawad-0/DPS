import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
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
import {SelectList} from 'react-native-dropdown-select-list';

const FctScreen10 = ({route}) => {
  const navigation = useNavigation();
  const {courseId, courseName, courseCode, facultyId, facultyRole} =
    route.params;
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [CLOS, setCLOS] = useState([]);
  const [CLOWeighatge, setCLOWeightage] = useState([]);
  const [gridViewWeightage, setGridViewWeightage] = useState([]);
  const [gridViewHeaders, setGridViewHeaders] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isButtonVisible, setButtonVisible] = useState(false);
  const [cloAlert, setCLOAlert] = useState(false);
  // const [weightages, setWeightages] = useState({});
  const [clo_id, setCLOid] = useState();
  const [c_id, setCourseid] = useState();
  const [weightage1, setWeightage1] = useState(0);
  const [weightage2, setWeightage2] = useState(0);
  const [weightage3, setWeightage3] = useState(0);
  const [weightage4, setWeightage4] = useState(0);

  useEffect(() => {
    fetchGridViewHeaders();
    fetchGridViewWeightage(courseId);
  }, []);

  const setWeightageZero = () => {
    setWeightage1(0);
    setWeightage2(0);
    setWeightage3(0);
    setWeightage4(0);
  };

  const fetchGridViewHeaders = () => {
    const apiEndpoint = `http://${ip}:${port}/getGridViewHeaders`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setGridViewHeaders(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchGridViewWeightage = key => {
    const apiEndpoint = `http://${ip}:${port}/getCourseGridViewWeightage/${key}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        setGridViewWeightage(data);
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
              navigation.navigate('FctScreen02', {
                courseId: courseId,
                courseName: courseName,
                courseCode: courseCode,
                facultyId: facultyId,
                facultyRole: facultyRole,
              })
            }>
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Grid View</Text>
        </View>
        <View>
          <Text style={styles.nameText}>{courseName}</Text>
          <Text style={styles.codeText}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
        </View>

        {gridViewWeightage.length > 0 && (
          <View style={styles.table}>
            <View style={styles.bar4}>
              <Text style={styles.bar4Text}>Assessments</Text>
            </View>
            <View style={styles.bar5}>
              {gridViewHeaders.map((item, index) => (
                <Text key={index} style={styles.bar5Text}>
                  {item.name}
                </Text>
              ))}
            </View>
            <View style={styles.bar6}>
              {gridViewHeaders.map((item, index) => (
                <Text key={index} style={styles.bar6Text}>
                  {item.weightage}%
                </Text>
              ))}
            </View>
            <FlatList
              data={gridViewWeightage}
              style={styles.flatlist3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View style={styles.rowContainer}>
                  <Text style={styles.cloText2}>{item.clo_number}</Text>
                  <View style={[styles.listItem3]}>
                    <Text
                      style={[
                        styles.weightageText,
                        item.weightage1 === 0 && styles.zeroWeightageText,
                      ]}>
                      {item.weightage1}%
                    </Text>
                    <Text
                      style={[
                        styles.weightageText,
                        item.weightage2 === 0 && styles.zeroWeightageText,
                      ]}>
                      {item.weightage2}%
                    </Text>
                    <Text
                      style={[
                        styles.weightageText,
                        item.weightage3 === 0 && styles.zeroWeightageText,
                      ]}>
                      {item.weightage3}%
                    </Text>
                    <Text
                      style={[
                        styles.weightageText,
                        item.weightage4 === 0 && styles.zeroWeightageText,
                      ]}>
                      {item.weightage4}%
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
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
    marginTop: 20,
    // borderWidth: 2,
    // borderColor: 'yellow',
  },
  header: {
    flexDirection: 'row',
  },
  table: {
    marginTop: 50,
    width: '100%',
    // backgroundColor: 'black',
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
  nameText: {
    height: 40,
    textAlignVertical: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
  },
  codeText: {
    height: 40,
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    // marginTop: 10,
    marginLeft: 20,
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'white',
    // fontFamily: 'FuzzyBubbles-Regular',
  },
  topbar: {
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 25,
    // textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    // textDecorationLine: 'underline',
  },
  percent: {
    color: 'black',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  name: {
    marginTop: 50,
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  data_name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    // textAlign: 'center',
    // borderWidth: 2,
    // borderColor: 'black',
    width: 280,
  },
  input: {
    height: 40,
    width: 40,
    // alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: 30,
    paddingHorizontal: 8,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  redText: {
    height: 40,
    width: 40,
    // alignSelf: 'center',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: 30,
    paddingHorizontal: 8,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
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
  columnHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#58FFAB',
    backgroundColor: '#CDCDCD',
    borderWidth: 2,
    borderColor: 'white',
    height: 'auto',
    width: 'auto',
    marginLeft: 5,
    marginTop: 3,
    borderRadius: 10,
    color: 'white',
    alignItems: 'center',
  },
  listItem2: {
    flexDirection: 'column',
    borderBottomWidth: 2,
    borderBottomColor: '#58FFAB',
    backgroundColor: '#CDCDCD',
    height: 'auto',
    width: '90%',
    marginLeft: '5%',
    marginTop: 1,
    borderRadius: 10,
    // marginTop: 2,
    color: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  listItem3: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#58FFAB',
    backgroundColor: '#CDCDCD',
    marginLeft: '1%',
    width: '90%',
    marginTop: 1,
    borderRadius: 10,
    // marginTop: 2,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#58FFAB',
  },
  cloText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    flexWrap: 'wrap',
  },
  cloText2: {
    backgroundColor: 'black',
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'center',
    marginLeft: '1%',
    borderWidth: 1,
    // flexWrap: 'wrap',
  },
  indexText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    marginBottom: 3,
    marginTop: 3,
  },
  indexText2: {
    fontSize: 15,
    color: 'blue',
    marginLeft: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  weightageText: {
    fontSize: 15,
    color: 'black',
    width: '25%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 3,
    marginTop: 3,
  },
  zeroWeightageText: {
    fontSize: 15,
    color: 'red',
    width: '25%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 3,
    marginTop: 3,
  },
  column: {
    flex: 1,
  },
  flatlist: {
    marginTop: 5,
    maxWidth: 350,
  },
  flatlist2: {
    // marginTop: 3,
    maxHeight: 455,
  },
  flatlist3: {
    // marginTop: 1,
    maxHeight: 500,
    // borderWidth: 3,
    // borderColor: 'red'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  radiobuttonContainer: {
    flexDirection: 'row',
    maxWidth: 80,
    justifyContent: 'center',
    marginLeft: 100,
  },
  savebuttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 50,
  },
  deleteButton: {
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  deleteIcon: {
    height: 22,
    width: 22,
  },
  saveButton: {
    borderRadius: 13,
    backgroundColor: '#00DDDD',
    justifyContent: 'center',
    height: 50,
    width: 200,
  },
  saveText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  picker: {
    height: 55,
  },
  pickerItem: {
    backgroundColor: '#CDCDCD',
  },
  pickerContainer: {
    borderWidth: 2,
    // borderColor: 'white',
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    width: 20,
    height: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  bar1: {
    backgroundColor: 'yellow',
    color: 'black',
    height: 40,
    width: '90%',
    // marginTop: 10,
    marginLeft: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar1Text: {
    color: 'black',
    fontWeight: 'bold',
  },
  bar2: {
    flexDirection: 'row',
    backgroundColor: 'white',
    color: 'black',
    height: 40,
    width: '90%',
    marginTop: 1,
    marginLeft: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar2Text: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'black',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    height: '80%',
    textAlignVertical: 'center',
  },
  bar3: {
    flexDirection: 'row',
    backgroundColor: 'white',
    color: 'black',
    height: 40,
    width: '90%',
    marginTop: 5,
    marginLeft: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar3Text: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bar4: {
    backgroundColor: 'yellow',
    color: 'black',
    height: 40,
    width: '90%',
    // marginTop: 10,
    marginLeft: '10%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar4Text: {
    color: 'black',
    fontWeight: 'bold',
  },
  bar5: {
    flexDirection: 'row',
    backgroundColor: 'white',
    color: 'black',
    height: 40,
    width: '90%',
    marginTop: 1,
    marginLeft: '10%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar5Text: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'black',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    height: '80%',
    textAlignVertical: 'center',
  },
  bar6: {
    flexDirection: 'row',
    backgroundColor: 'white',
    color: 'black',
    height: 40,
    width: '90%',
    marginTop: 1,
    marginLeft: '10%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar6Text: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    height: '80%',
    textAlignVertical: 'center',
  },
  updateButton: {
    backgroundColor: '#58FFAB',
    width: '20%',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    padding: 3,
    marginRight: 20,
    marginTop: 10,
  },
  updateText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cloWarning: {
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    width: '92%',
    marginLeft: '2%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FctScreen10;
