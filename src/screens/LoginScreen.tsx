import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SapLogo from '../assets/logo_sap.svg';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginNavProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header Logos */}
      <View style={styles.header}>
        <SapLogo width={100} height={65} />
        <Image
          source={require('../assets/sap_cx.png')}
          style={styles.cxLogo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Marvin Mobile</Text>

      {/* Email */}
      <Text style={styles.label}>Email*</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <View style={styles.passwordHeader}>
        <Text style={styles.label}>Password*</Text>

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showText}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>or login with</Text>
        <View style={styles.line} />
      </View>

      {/* SSO Button */}
      <TouchableOpacity style={styles.ssoButton}>
        <Text style={styles.ssoText}>🔐  SSO</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
      paddingTop: 60,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cxLogo: {
      width: 180,
      height: 75,
      marginTop: 20,
      marginLeft: '35%',
    },
    title: {
      textAlign: 'center',
      fontSize: 36,
      fontWeight: '700',
      marginTop: 150,
      marginBottom: 32,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: '#B0B7C3',
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
    },
    passwordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#B0B7C3',
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 48,
      marginBottom: 28,
    },
    passwordInput: {
      flex: 1,
    },
    showText: {
      color: '#2563EB',
      fontWeight: '600',
    },
    loginButton: {
      backgroundColor: '#0A6ED1',
      height: 48,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 32,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: '#D1D5DB',
    },
    orText: {
      marginHorizontal: 12,
      color: '#6B7280',
    },
    ssoButton: {
      borderWidth: 1,
      borderColor: '#0A6ED1',
      height: 48,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ssoText: {
      color: '#0A6ED1',
      fontSize: 16,
      fontWeight: '600',
    },
  });
