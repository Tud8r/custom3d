import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import ThreeDView from '../components/ThreeDView';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/*<ThreeDView />*/}
      <View style={styles.upperContainer}>
      <Text>Orbis</Text>
      </View>
      <View style={styles.modelContainer}>
      <ThreeDView />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  upperContainer: {
    flex: 0.5,
    backgroundColor: 'green',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius : 50,
    borderBottomRightRadius : 50,
  },
  modelContainer: {
    flex: 2,
  }
  
});

export default App;