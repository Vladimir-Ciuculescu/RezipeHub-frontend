import RNButton from '@/components/shared/RNButton';
import { ONBOARDED, storage } from '@/storage';
import { View } from 'react-native';
import { Text } from 'react-native-ui-lib';

export default function Register() {
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
