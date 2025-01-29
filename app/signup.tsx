import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { User } from '@/types/userType';
import { authApi } from './api/api';


const SignupPage = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const authContext = useContext(AuthContext);
  

  const validateEmail = async (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async () => {
    setErrors('');
    if (!username || !password) {
      setErrors('Username and password are required');
      return;
    }
    if (!validateEmail(email)) {
        setErrors('Invalid email format');
        return;
      }
  
    try {
      const response = await authApi.signup({ email,username, password });
     
      const userData: User = response.data;
      if (userData) {
        authContext?.setLogin(userData);
        navigation.navigate('viewInterviews');
      }
    } catch (e) {
      setErrors('sign up failed, please try again ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSubmit} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Login</Text>
      </TouchableOpacity>
      {errors ? <Text style={styles.error}>{errors}</Text> : null}
    </View>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
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
    paddingHorizontal: 10,
    paddingVertical: 8
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
