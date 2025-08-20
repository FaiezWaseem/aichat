import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Storage from '../utility/Storage';

export default function SettingsScreen() {
  const handleClearAllData = async () => {
    await Storage.clear();
    console.log('All data cleared');
  };

  const handleClearChatMessages = async () => {
    await Storage.clearChatMessages();
    console.log('Chat messages cleared');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearChatMessages}>
            <Icon name="delete-outline" size={24} color="#10B981" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Clear Chat Messages</Text>
              <Text style={styles.settingDescription}>Remove all saved chat history</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearAllData}>
            <Icon name="delete-forever" size={24} color="#EF4444" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Clear All Data</Text>
              <Text style={styles.settingDescription}>Remove all app data and settings</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <Icon name="info-outline" size={24} color="#6B7280" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Version</Text>
              <Text style={styles.settingDescription}>1.0.0</Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Icon name="code" size={24} color="#6B7280" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Built with</Text>
              <Text style={styles.settingDescription}>React Native & OpenAI</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
});