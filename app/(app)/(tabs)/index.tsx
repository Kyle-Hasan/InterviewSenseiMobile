import { Text, View, StyleSheet } from 'react-native';
 import { Link, Redirect } from 'expo-router'; 
import React from 'react';



export default function Index() {
  return (
    <Redirect href={"/(app)/(tabs)/viewInterviews"}></Redirect>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
