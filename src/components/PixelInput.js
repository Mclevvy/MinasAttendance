import { Text, TextInput, View } from 'react-native';
import { styles } from '../theme';

export default function PixelInput({ label, value, onChange, onSubmit }) {
  return (
    <View>
      <Text nativeID="nameLabel" style={styles.label}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
        autoFocus
        maxLength={60}
        accessibilityLabel={label}
        aria-labelledby="nameLabel"
        style={styles.input}
      />
    </View>
  );
}
