import React from 'react';

import { ImageBackground, SafeAreaView, StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import ThreeDView from '../components/ThreeDView';
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ProgressBar from 'react-native-progress/Bar';
import {
  useFonts,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



const image = require('../assets/background.png');;
const Tab = createBottomTabNavigator();

progress = 0.44;
function HomeScreen() {
  return (
    <View style={styles.buttonContainer}>
        <Ionicons name="bicycle-outline" size={35} color="#FFFFFF" />
        <Text style={styles.text}>Rute Planner</Text>       
    </View>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <SafeAreaView style={styles.container}>
        {/*<ThreeDView />*/}

        <View style={styles.upperContainer}>
          <ProgressBar progress={progress} width={300} height={20} color="rgb(255, 255, 255)" borderRadius={10} unfilledColor="rgba(129, 138, 153, 1);" borderWidth={0} />
          <Text style={styles.upperText}>{`${progress * 100}% completed`}</Text>
        </View>

        <View style={styles.emptyContainer}>

        </View>


        <View style={styles.modelContainer}>
          <ThreeDView />
        </View>

        <View style={styles.challengesContainer}>
          <TouchableOpacity style={styles.challengesButton} onPress={() => Alert.alert('Button with adjusted color pressed')}>
          
          <Ionicons name="trophy-outline" size={24} color="#FFFFFF"/>
            <Text style={styles.challengesText}>Today's Challenges      </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Ionicons name="bicycle-outline" size={35} color="#FFFFFF" />
            <Text style={styles.text}>Rute Planner</Text>
            
          </View>
          <View style={styles.buttonContainer}>
            <MaterialCommunityIcons name="heart-pulse" size={35} color="#FFFFFF" />
            <Text style={styles.text}>Health Tracker</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons name="earth-outline" size={54} color="#C0C0C0" />
            <Text style={styles.text}>Orbis</Text>
          </View>
          <View style={styles.buttonContainer}>
            <MaterialCommunityIcons  name="medal" size={35} color="#FFFFFF" />
            <Text style={styles.text}>Leader Board</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons name="settings-outline" size={35} color="#FFFFFF" />
            <Text style={styles.text}>Settings</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    justifyContent: 'center',

  },
  text: {
    fontSize: 11,
    fontFamily: 'Fredoka_500Medium',
    color: '#FFFFFF',
  },
  buttonContainer: {
    
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 0.4,
    paddingTop: 10,
    backgroundColor: 'rgba(43, 41, 63, 0.6)',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14
  },

  upperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

  },
  upperText: {

    position: 'absolute',       // Positions the Text absolutely within the container
    bottom: 30,
    fontSize: 24,
    fontFamily: 'Fredoka_500Medium',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
  },
  modelContainer: {
    ...StyleSheet.absoluteFillObject, // Makes this container fill the entire parent
    zIndex: 1, // Place background behind other components


  },

  challengesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    
    flex: 1,
  },
  challengesButton: {
    position: 'absolute',       
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 35, 18, 0.88)',
    padding: 10,
    gap: 10
    
  },
  challengesText: {
    fontSize: 14,
    fontFamily: 'Fredoka_700Bold',
    color: '#FFFFFF',
  },

});
