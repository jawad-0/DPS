import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {ip, assigned_port} from '../CONFIG';
import {useNavigation} from '@react-navigation/native';

const FctScreen02 = ({route}) => {
  const {courseId, courseName, courseCode, facultyId, facultyRole} =
    route.params;
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [assignedCourses, setAssignedCourses] = useState([]);

  useEffect(() => {
    console.log(facultyRole);
  }, []);

  const handlePress = item => {
    console.log('Item:', item);
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
          <Text style={styles.headerText}>Settings</Text>
          {/* <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
            <Image
              source={require('../../assets/logout2.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
        </View>
        <View style={styles.buttonsContainer}>
          {/* <TouchableOpacity
            style={styles.mailButton}
            onPress={() => console.log('Mail Button Pressed')}>
            <Image
              source={require('../../assets/mail.png')}
              style={styles.mailIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => console.log('Status Button Pressed')}>
            <Image
              source={require('../../assets/status.png')}
              style={styles.statusIcon}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
        </View>
        <View>
          <Text style={styles.nameText}>{courseName}</Text>
          <Text style={styles.codeText}>
            Course Code: <Text style={{color: 'yellow'}}>{courseCode}</Text>
          </Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.buttonscontainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => console.log('Paper Settings')}>
            <Text style={styles.buttonText}>PAPER SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('FctScreen07', {
                courseId: courseId,
                courseName: courseName,
                courseCode: courseCode,
                facultyId: facultyId,
                facultyRole: facultyRole,
              })
            }>
            <Text style={styles.buttonText}>VIEW TOPICS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('FctScreen04', {
                courseId: courseId,
                courseName: courseName,
                courseCode: courseCode,
                facultyId: facultyId,
                facultyRole: facultyRole,
              })
            }>
            <Text style={styles.buttonText}>VIEW CLOS</Text>
          </TouchableOpacity>
          {facultyRole === 'senior' && (
            <>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('FctScreen05', {
                    courseId: courseId,
                    courseName: courseName,
                    courseCode: courseCode,
                    facultyId: facultyId,
                    facultyRole: facultyRole,
                  })
                }>
                <Text style={styles.buttonText}>MANAGE TOPICS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('FctScreen03', {
                    courseId: courseId,
                    courseName: courseName,
                    courseCode: courseCode,
                    facultyId: facultyId,
                    facultyRole: facultyRole,
                  })
                }>
                <Text style={styles.buttonText}>MANAGE CLOS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('FctScreen09', {
                    courseId: courseId,
                    courseName: courseName,
                    courseCode: courseCode,
                    facultyId: facultyId,
                    facultyRole: facultyRole,
                  })
                }>
                <Text style={styles.buttonText}>MANAGE PAPER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('FctScreen10', {
                    courseId: courseId,
                    courseName: courseName,
                    courseCode: courseCode,
                    facultyId: facultyId,
                    facultyRole: facultyRole,
                  })
                }>
                <Text style={styles.buttonText}>GRID VIEW</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* <View style={styles.form}>
          <FlatList
            data={assignedCourses}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View style={styles.listItem}>
                  <View style={styles.column}>
                    <Text style={styles.data_title}>{item.c_title}</Text>
                    <Text style={styles.data_code}>({item.c_code})</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View> */}
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
    marginTop: 70,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  headerText: {
    height: 70,
    width: 310,
    // marginLeft: 25,
    textAlignVertical: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    // fontFamily: 'FuzzyBubbles-Regular',
    textAlign: 'center',
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'red',
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
  label: {
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 20,
    color: 'white',
  },
  data_title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 10,
    textAlign: 'center',
  },
  data_code: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'blue',
    // borderWidth: 2,
    // borderColor: 'black',
    marginLeft: 10,
    textAlign: 'center',
  },
  input: {
    height: 41,
    width: 340,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: '#E6E6FA',
  },
  searchinput: {
    height: 40,
    width: 300,
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 13,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'white',
  },
  tableheader: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 40,
    marginTop: 16,
    // borderTopWidth: 3,
    // borderTopColor: 'white',
    borderBottomWidth: 3,
    borderBottomColor: 'white',
    // borderRightWidth: 3,
    // borderRightColor: 'white',
    // borderLeftWidth: 3,
    // borderLeftColor: 'white',
  },
  columnContainer: {
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
  button: {
    backgroundColor: '#58FFAB',
    padding: 10,
    height: 60,
    width: 300,
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'poppins',
    textAlign: 'center',
  },
  deletebuttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editbuttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disablebuttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  enablebuttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderBottomColor: 'white',
    backgroundColor: '#58FFAB',
    height: 100,
    width: 200,
    borderRadius: 15,
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
  modalbuttonscontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    // marginLeft: 10,
    marginTop: 30,
    // borderWidth: 2,
    // borderColor: 'yellow',
    justifyContent: 'flex-end',
  },
  editButton: {
    // backgroundColor: 'blue',
    marginRight: 8,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  deleteButton: {
    // backgroundColor: 'black',
    marginRight: 8,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
  },
  disableButton: {
    backgroundColor: 'red',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  enableButton: {
    backgroundColor: '#0DEC09',
    borderWidth: 1,
    padding: 2,
    height: 25,
    width: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  mailButton: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 13,
    marginLeft: 20,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  statusButton: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 13,
    marginLeft: 20,
    marginRight: 10,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  deleteIcon: {
    height: 20,
    width: 20,
  },
  editIcon: {
    height: 18,
    width: 18,
  },
  mailIcon: {
    height: 30,
    width: 45,
  },
  statusIcon: {
    height: 30,
    width: 45,
  },
  buttonscontainer: {
    marginTop: 60,
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
});

export default FctScreen02;
