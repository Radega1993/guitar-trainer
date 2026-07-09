import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useProgress } from './src/storage/ProgressContext';
import { RootStackParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StudyBlockScreen from './src/screens/StudyBlockScreen';
import InfinitePracticeScreen from './src/screens/InfinitePracticeScreen';
import { AppProviders } from './src/app/providers/AppProviders';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
    notification: colors.accent,
  },
};

function RootNavigator() {
  const { loading } = useProgress();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="LevelSelect"
          component={LevelSelectScreen}
          options={{ title: 'Niveles' }}
        />
        <Stack.Screen
          name="Exercise"
          component={ExerciseScreen}
          options={{ title: 'Ejercicio' }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: 'Resultado', headerBackVisible: false }}
        />
        <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'Estadísticas' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes' }} />
        <Stack.Screen
          name="StudyBlock"
          component={StudyBlockScreen}
          options={{ title: 'Bloque de estudio' }}
        />
        <Stack.Screen
          name="InfinitePractice"
          component={InfinitePracticeScreen}
          options={{ title: 'Práctica infinita' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <RootNavigator />
    </AppProviders>
  );
}
