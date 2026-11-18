import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = { name?: string; uri?: string; size?: number; border?: boolean };

export function Avatar({ name = '', uri, size = 44, border = false }: Props) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);
  
  const initials = name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase() || '').join('');
  const source = uri === 'sample:avatar'
    ? require('../../assets/profile/sample-avatar.jpg')
    : uri ? { uri } : null;

  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2 }, border && styles.border]}>
      {source && !failed ? (
        <Image source={source} onError={() => setFailed(true)} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
      ) : (
        <Text style={{ color: colors.primaryDark, fontSize: size * 0.32, fontWeight: '700' }}>{initials || 'U'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: '#DCE4FF', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  border: { borderWidth: 2, borderColor: colors.white },
});