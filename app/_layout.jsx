import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ThreeDView from '../components/ThreeDView';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ThreeDView />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;