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
          <Text style={styles.headerText}>Papers Status</Text>
        </View>
        {/* <ScrollView> */}
        <View style={styles.form}>
          <View style={styles.tableheader}>
            <View style={styles.columnContainer}>
              <Text style={styles.columnHeader}>Courses</Text>
            </View>
            <View style={styles.columnContainer}>
              <Image
                source={require('../../assets/loading.png')}
                style={styles.statusIcon}
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
                          textShadowOffset: {width: 1.5, height: 1},
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
                          color: '#00FF7F',
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
    fontSize: 16,
    marginLeft: 80,
    textAlign: 'center',
    color: 'black',
    width: 70,
    fontWeight: 'bold',
    // borderWidth: 1,
    // borderColor: 'black',
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
  tableheader: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 40,
    marginTop: 20,
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
    backgroundColor: '#E6E6FA',
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
  statusIcon: {
    height: 25,
    width: 25,
    marginLeft: 50,
    alignSelf: 'center',
    // borderWidth: 1,
    // borderColor: 'white',
  },
});

export default FctScreen15;
