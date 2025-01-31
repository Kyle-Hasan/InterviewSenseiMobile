import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { User } from '@/types/userType';
import { authApi } from './api/api';
import {router } from "expo-router";


const Login = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const authContext = useContext(AuthContext);

  const handleSubmit = async () => {
    setErrors('');
    if (username.length === 0 || password.length === 0) {
      setErrors('Username and password are required');
      return;
    }
    try {
      debugger
      const response = await authApi.login({ username, password });
      const userData: User = response.data;
      console.log(userData)
      debugger
      if (userData) {
        authContext?.setLogin(userData);
        router.push('/(app)/(tabs)/createInterview');
      }
    } catch (e) {
      debugger
      console.log(e);
      setErrors('Login failed, please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput 
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput 
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleSubmit} />
      <TouchableOpacity onPress={() => router.push('/Signup')}>
        <Text style={styles.link}>No Account? Sign up</Text>
      </TouchableOpacity>
      {errors.length > 0 && <Text style={styles.error}>{errors}</Text>}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 4,
    padding: 10
  },
  link: {
    color: 'blue',
    marginTop: 12,
    textDecorationLine: 'underline'
  },
  error: {
    color: 'red',
    marginTop: 8
  }
});
