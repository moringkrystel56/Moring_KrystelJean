import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = TextInputProps & { label: string; secret?: boolean };

/** Plain labeled fields, as in the supplied Login and Register screenshots. */
export function AuthField({ label, secret, ...props }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        secureTextEntry={secret || props.secureTextEntry}
        autoCorrect={false}
        placeholderTextColor="#A0A4AB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 17 },
  label: { fontSize: 13, fontWeight: '700', color: '#30363D', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#E1E6E6', borderRadius: 16,
    height: 49, backgroundColor: colors.paleInput, paddingHorizontal: 16,
    fontSize: 14, color: '#202428',
  },
});
