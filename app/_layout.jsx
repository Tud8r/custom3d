import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import ThreeDView from '../components/ThreeDView';
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  useFonts,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";

const image = require('../assets/background.jpeg');;

export default function App(){
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
          <Ionicons name="menu-outline" size={50}></Ionicons>
        </View>

        <View style={styles.modelContainer}>
          <ThreeDView />
        </View>
        
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Ionicons name="bicycle-outline" size={35} color="#FFFFFF" />
            <Text style={styles.text}>Rute Planner</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons name="heart-outline" size={35} color="#FFFFFF" />
            <Text style={styles.text}>Health Tracker</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons name="planet-outline" size={54} color="#C0C0C0" />
            <Text style={styles.text}>Orbis</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons name="trophy-outline" size={35} color="#FFFFFF" />
            <Text style={styles.text}>Challenges</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons name="menu-outline" size={35} color="#FFFFFF" />
            <Text style={styles.text}>Leader Board</Text>
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
    flex: 0.34,
    paddingTop: 10,
    backgroundColor: 'rgba(43, 41, 63, 0.6)',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  upperContainer: {
    flex: 0.4,
    justifyContent: 'left',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  modelContainer: {
    flex: 2,
  }
});
