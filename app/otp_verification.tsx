// import RNIcon from '@/components/shared/RNIcon';
// import RnInput from '@/components/shared/RNInput';
// import { spacing } from '@/theme/spacing';
// import { $sizeStyles } from '@/theme/typography';
// import { useNavigation } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useLayoutEffect } from 'react';
// import { Pressable, StyleSheet } from 'react-native';
// import { Text, TextField, View } from 'react-native-ui-lib';

// export default function OtpVerification() {
//   const navigation = useNavigation();

//   const goBack = () => {
//     navigation.goBack();
//   };

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitleAlign: 'center',
//       headerLeft: () => (
//         <Pressable onPress={goBack}>
//           <RNIcon name="arrowLeft" />
//         </Pressable>
//       ),
//       headerBackVisible: false,
//       headerShadowVisible: false,
//       headerTitle: () => <Text style={[$sizeStyles.h3]}>Enter OTP Code</Text>,
//     });
//   }, [navigation]);

//   return (
//     <View
//       style={{
//         flex: 1,
//         paddingHorizontal: spacing.spacing24,
//         paddingTop: spacing.spacing24,
//       }}
//     >
//       <StatusBar style="dark" />
//       <View style={{ backgroundColor: 'red' }}>
//         <Text style={styles.$title}>
//           We Already have sent you verification e-mail to john****@gmail.com, please check it
//         </Text>
//         <TextField showSoftInputOnFocus={false} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   $title: {
//     ...$sizeStyles.n,
//   },
// });

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleInputChange = (index, value) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleDialPress = (value) => {
    const firstEmptyIndex = otp.findIndex((char) => char === '');
    if (firstEmptyIndex !== -1) {
      handleInputChange(firstEmptyIndex, value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((char, index) => (
          <TextInput
            key={index}
            value={char}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange(index, value)}
            showSoftInputOnFocus={false}
            // onFocus={(e) => e.target.blur()} // Disable keyboard on focus
          />
        ))}
      </View>
      <View style={styles.dialPad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.dialButton}
            onPress={() => handleDialPress(num)}
          >
            <Text style={styles.dialButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
  },
  dialPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dialButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  dialButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OTPVerification;
