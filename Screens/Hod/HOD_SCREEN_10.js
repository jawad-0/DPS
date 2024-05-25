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

const HodScreen10 = () => {
  const navigation = useNavigation();
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

  //   const handleWeightageChange = (cloId, index, value) => {
  //     setWeightages(prevState => ({
  //       ...prevState,
  //       [cloId]: {
  //         ...prevState[cloId],
  //         [index]: value,
  //       },
  //     }));
  //   };

  useEffect(() => {
    fetchCourses();
    fetchGridViewHeaders();
  }, []);

  const setWeightageZero = () => {
    setWeightage1(0);
    setWeightage2(0);
    setWeightage3(0);
    setWeightage4(0);
  };

  const fetchCourses = () => {
    const apiEndpoint = `http://${ip}:${port}/getCourse`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map(course => ({
          key: course.c_id.toString(),
          value: course.c_title,
        }));
        setCourses(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  //   gridviewRouter.get("/getGridViewWeightage/:clo_id", (req, res) => {

  const fetchCLOWeightage = (clo_id, index) => {
    setCLOid(clo_id);
    setButtonVisible(true);
    setSelectedItemIndex(index);
    const apiEndpoint = `http://${ip}:${port}/getCLOGridViewWeightage/${clo_id}`;
    Keyboard.dismiss();
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setCLOWeightage(data);
          setWeightage1(data[0].weightage1);
          setWeightage2(data[0].weightage2);
          setWeightage3(data[0].weightage3);
          setWeightage4(data[0].weightage4);
        } else {
          console.log('Data is empty or undefined');
          setWeightage1(0);
          setWeightage2(0);
          setWeightage3(0);
          setWeightage4(0);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
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

  const fetchCLOS = key => {
    const apiEndpoint = `http://${ip}:${port}/getCLO/${key}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        // const transformedData = data.map(clo => ({
        //   key: clo.clo_id.toString(),
        //   value: clo.clo_name,
        // }));
        if (data && data.length > 0) {
          setCLOS(data);
        } else {
          setCLOS([]);
        }
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

  const addGridViewWeightage = () => {
    console.log(
      `weightage1: ${weightage1}, weightage2: ${weightage2}, weightage3: ${weightage3}, weightage4: ${weightage4}`,
    );

    const apiEndpoint = `http://${ip}:${port}/addGridViewWeightage`;
    fetch(apiEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clo_id: clo_id,
        weightage1: parseFloat(weightage1),
        weightage2: parseFloat(weightage2),
        weightage3: parseFloat(weightage3),
        weightage4: parseFloat(weightage4),
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          // console.error('Validation errors:', data.errors);
          data.errors.forEach(error => {
            ToastAndroid.show(error, ToastAndroid.LONG);
          });
        } else {
          console.log('Data updated successfully:', data);
          ToastAndroid.show('Updated Successfully!', ToastAndroid.SHORT);
          Keyboard.dismiss();
          fetchCourses();
          fetchGridViewHeaders();
          fetchGridViewWeightage(c_id);
        }
      })
      .catch(error => {
        console.error('Error updating data:', error);
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
          <Text style={styles.headerText}>Grid View</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerContainer}>
            <SelectList
              setSelected={key => {
                fetchCLOS(key);
                setCourseid(key);
                setSelectedCourse(key);
                fetchGridViewWeightage(key);
                setButtonVisible(false);
                setWeightageZero();
                setCLOAlert(true);
                setSelectedItemIndex(null);
              }}
              data={courses}
              save="c_title"
              placeholder="Select Course"
              searchPlaceholder="Search Course"
              boxStyles={{backgroundColor: 'gray'}}
              inputStyles={{color: 'white'}}
              dropdownStyles={{backgroundColor: 'black', borderColor: 'white'}}
              dropdownTextStyles={{color: 'white'}}
            />
          </View>
          <View style={styles.topbar}>
            {cloAlert && CLOS.length === 0 && (
              <View style={styles.cloWarning}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
                  CLOS Not Created Yet !
                </Text>
              </View>
            )}
            <FlatList
              data={CLOS}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.flatlist}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    selectedItemIndex === index ? styles.selectedItem : null,
                  ]}
                  onPress={() => fetchCLOWeightage(item.clo_id, index)}>
                  <Text style={styles.indexText}>{item.clo_number}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.bar1}>
            <Text style={styles.bar1Text}>Assessments</Text>
          </View>
          <View style={styles.bar2}>
            {gridViewHeaders.map((item, index) => (
              <Text key={index} style={styles.bar2Text}>
                {item.name}
              </Text>
            ))}
          </View>
          {/* <View style={styles.bar3}>
            {gridViewHeaders.map((item, index) => (
              <Text key={index} style={styles.bar3Text}>
                {item.weightage} %
              </Text>
            ))}
          </View> */}
          {/* <View
            style={{
              borderBottomColor: 'cyan',
              borderBottomWidth: 2,
              width: '90%',
              marginTop: 5,
              alignSelf: 'center',
            }}></View> */}

          {CLOWeighatge.length === 0 && (
            <View style={styles.listItem2}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextInput
                  style={[
                    styles.input,
                    weightage1 == '0' ? styles.redText : null,
                  ]}
                  value={String(weightage1)}
                  keyboardType="numeric"
                  placeholderTextColor={'gray'}
                  onChangeText={text => setWeightage1(text)}
                />
                <Text style={styles.percent}> %</Text>
                <TextInput
                  style={[
                    styles.input,
                    weightage2 == '0' ? styles.redText : null,
                  ]}
                  value={String(weightage2)}
                  keyboardType="numeric"
                  placeholderTextColor={'gray'}
                  onChangeText={text => setWeightage2(text)}
                />
                <Text style={styles.percent}> %</Text>

                <TextInput
                  style={[
                    styles.input,
                    weightage3 == '0' ? styles.redText : null,
                  ]}
                  value={String(weightage3)}
                  keyboardType="numeric"
                  placeholderTextColor={'gray'}
                  onChangeText={text => setWeightage3(text)}
                />
                <Text style={styles.percent}> %</Text>

                <TextInput
                  style={[
                    styles.input,
                    weightage4 == '0' ? styles.redText : null,
                  ]}
                  value={String(weightage4)}
                  keyboardType="numeric"
                  placeholderTextColor={'gray'}
                  onChangeText={text => setWeightage4(text)}
                />
                <Text style={styles.percent}> %</Text>
              </View>
            </View>
          )}

          <FlatList
            data={CLOWeighatge}
            style={styles.flatlist2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.listItem2}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TextInput
                    style={[
                      styles.input,
                      weightage1 == '0' ? styles.redText : null,
                    ]}
                    value={String(weightage1)}
                    keyboardType="numeric"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setWeightage1(text)}
                  />
                  <Text style={styles.percent}> %</Text>
                  <TextInput
                    style={[
                      styles.input,
                      weightage2 == '0' ? styles.redText : null,
                    ]}
                    value={String(weightage2)}
                    keyboardType="numeric"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setWeightage2(text)}
                  />
                  <Text style={styles.percent}> %</Text>

                  <TextInput
                    style={[
                      styles.input,
                      weightage3 == '0' ? styles.redText : null,
                    ]}
                    value={String(weightage3)}
                    keyboardType="numeric"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setWeightage3(text)}
                  />
                  <Text style={styles.percent}> %</Text>

                  <TextInput
                    style={[
                      styles.input,
                      weightage4 == '0' ? styles.redText : null,
                    ]}
                    value={String(weightage4)}
                    keyboardType="numeric"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setWeightage4(text)}
                  />
                  <Text style={styles.percent}> %</Text>
                </View>
              </View>
            )}
          />
          {isButtonVisible && (
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={addGridViewWeightage}>
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>
            </View>
          )}
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
    marginTop: 20,
    // borderWidth: 2,
    // borderColor: 'yellow',
  },
  header: {
    flexDirection: 'row',
  },
  table: {
    marginTop: 80,
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
    maxHeight: 155,
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

export default HodScreen10;
