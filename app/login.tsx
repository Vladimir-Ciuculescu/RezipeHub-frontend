import RNButton from '@/components/shared/RNButton';
import { ONBOARDED, storage } from '@/storage';
import { useLayoutEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { router, useNavigation } from 'expo-router';
import RNIcon from '@/components/shared/RNIcon';
import { $sizeStyles } from '@/theme/typography';

export default function Login() {
  const navigation = useNavigation();

  const goToHome = () => {
    router.navigate('home');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goToHome}>
          <RNIcon name="arrowLeft" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Create account</Text>,
    });
  }, [navigation]);

  return (
    <View>
      <RNButton
        label="Delete store"
        onPress={() => storage.delete(ONBOARDED)}
      />
      <Text style={{ fontFamily: 'sofia900' }}>awadawda</Text>
    </View>
  );
}
