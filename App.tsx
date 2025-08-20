import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ImageGenScreen from './src/screens/ImageGenScreen';
import VoiceGenScreen from './src/screens/VoiceGenScreen';
import Routes from './src/utility/Routes';

import TrackPlayer from 'react-native-track-player';

TrackPlayer.setupPlayer().then(() => {
  // The player is ready to be used
  console.log('TrackPlayer is ready');

});

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
               let iconName = 'chat';
               if (route.name === Routes.HOME) {
                 iconName = 'chat';
               } else if (route.name === Routes.WEBVIEW) {
                 iconName = 'web';
               } else if (route.name === Routes.SETTINGS) {
                 iconName = 'settings';
               } else if (route.name === Routes.IMAGE_GEN) {
                 iconName = 'image';
               } else if (route.name === Routes.VOICE_GEN) {
                 iconName = 'mic';
               }
               return <Icon name={iconName} size={size} color={color} />;
             },
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#1A1A1A',
            borderTopColor: '#333',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name={Routes.HOME} 
          component={HomeScreen} 
          options={{
            tabBarLabel: 'AI Chat',
          }}
        />
   
        <Tab.Screen 
          name={Routes.IMAGE_GEN} 
          component={ImageGenScreen} 
          options={{
            tabBarLabel: 'Image Gen',
          }}
        />
        <Tab.Screen 
          name={Routes.VOICE_GEN} 
          component={VoiceGenScreen} 
          options={{
            tabBarLabel: 'Voice Gen',
          }}
        />
        <Tab.Screen 
          name={Routes.SETTINGS} 
          component={SettingsScreen} 
          options={{
            tabBarLabel: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;