import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
}

export default function StarRating({ value, max = 3, size = 20 }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => (
        <Text
          key={i}
          style={[
            styles.star,
            { fontSize: size, color: i < value ? colors.star : colors.starEmpty },
          ]}
        >
          {i < value ? '\u2605' : '\u2606'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    lineHeight: undefined,
  },
});
