import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider } from '../../storage/ProgressContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </SafeAreaProvider>
  );
}
