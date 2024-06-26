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

  useEffect(() => {
    fetchData();
  }, []);

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
      source={require('../../assets/dtc_background.png')}
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
          <FlatList
            data={feedback}
            style={styles.flatlist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View style={styles.column}>
                  <View style={styles.dataContainer}>
                    <Text style={styles.data_code}>{item.c_code}</Text>
                    <Text style={styles.data_title}>{item.c_title}</Text>
                  </View>
                  {!item.q_id ? (
                    <Text style={styles.data_feedback}>
                      {item.feedback_details}
                    </Text>
                  ) : (
                    <Text style={styles.data_feedback}>
                      Q-No#{item.q_id}: {item.feedback_details}
                    </Text>
                  )}
                </View>
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
    width: 240,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    height: 80,
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
});

export default FctScreen14;
