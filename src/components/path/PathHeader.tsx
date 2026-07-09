import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

const logo = require('../../../assets/icon.png');

interface PathHeaderProps {
  onPractice: () => void;
  onStats: () => void;
  onSettings: () => void;
}

interface HeaderLinkProps {
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

function HeaderLink({
  label,
  accessibilityLabel,
  onPress,
  variant = 'secondary',
}: HeaderLinkProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.link,
        isPrimary ? styles.linkPrimary : styles.linkSecondary,
        pressed ? styles.linkPressed : null,
      ]}
    >
      <Text
        style={[styles.linkLabel, isPrimary ? styles.linkLabelPrimary : styles.linkLabelSecondary]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function PathHeader({ onPractice, onStats, onSettings }: PathHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.brand}>
        <Image source={logo} style={styles.logo} accessibilityLabel="Guitar Trainer" />
        <Text style={styles.title} numberOfLines={1}>
          Guitar Trainer
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.actionsScroll}
        contentContainerStyle={styles.actions}
      >
        <HeaderLink
          label="Práctica"
          accessibilityLabel="Práctica infinita"
          onPress={onPractice}
          variant="primary"
        />
        <HeaderLink label="Estadísticas" onPress={onStats} />
        <HeaderLink label="Ajustes" onPress={onSettings} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '42%',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
  },
  title: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  actionsScroll: {
    flexGrow: 1,
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingLeft: spacing.xs,
  },
  link: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkPrimary: {
    backgroundColor: colors.primary,
  },
  linkSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkPressed: {
    opacity: 0.85,
  },
  linkLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  linkLabelPrimary: {
    color: '#1c1917',
  },
  linkLabelSecondary: {
    color: colors.textMuted,
  },
});
