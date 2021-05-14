/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import NetInfo from "@react-native-community/netinfo";
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
  FlatList
} from 'react-native';
import People from "./src/models/People";
import PeopleService from "./src/services/People";

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const peopleService = new PeopleService();

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isConnected, setIsConnected] = useState(true);
  const [people, setPeople] = useState([]);
  const fetchFromAPI = async () => {
    peopleService.fetchFromAPI().then(result => {
      console.log('array 1:', result);
      if(!result.error) setPeople(result);
    }).catch(error => {
      console.error(error);
    });
  }

  const getConnection = () => {
    NetInfo.fetch().then(state => {
      //console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected);
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Is connected?", state.isInternetReachable);
      setIsConnected(state.isInternetReachable);
    });

    fetchFromAPI();

    return () => {
      unsubscribe();
    }
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.name} />
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text
          style={{
            backgroundColor: isConnected ? '#228b22' : '#b22222',
            color: '#ffffff',
            textAlign: 'center'
          }}
          //onPress={() => {}}
        >
          Green = Online, Red = Offline
        </Text>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="OFLN-02">
            <ScrollView style={{flexDirection: "row"}}>
              <TextInput
                //style={styles.input}
                //onChangeText={onChangeInputText}
                //value={inputText}
                placeholder="Insert Name"
              />
              <FlatList
                data={people}
                renderItem={renderItem}
                keyExtractor={item => item._id}
              />
              <Button
                title="Refresh from API"
                style={{
                  flex:1
                }}
                color='#228b22'
                onPress={() => fetchFromAPI()}
              />
              <Button
                title="Insert person"
                style={{
                  flex:1
                }}
                onPress={() => {}}
              />
            </ScrollView>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
