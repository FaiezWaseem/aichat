// Expo React Native Ai Chat
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import Storage from '../utility/Storage';

import Icon from 'react-native-vector-icons/MaterialIcons';


import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://text.pollinations.ai/openai',
  apiKey: 'dummy-key', // The API doesn't require a real key
  dangerouslyAllowBrowser: true,
});

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, streamingText]);

  useEffect(() => {
    const saveMessages = async () => {
      await Storage.saveChatMessages(messages);
    };

    saveMessages();
  }, [messages]);

  useEffect(() => {
    fetchAvailableModels();
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const savedMessages = await Storage.getChatMessages();
    setMessages(savedMessages);
  };

  useEffect(() => {
    fetchAvailableModels();
  }, []);

  const fetchAvailableModels = async () => {
    try {
      const response = await openai.models.list();
      const models = response.data.map((model) => model.id);
      setAvailableModels(models);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

const handleSend = async () => {
  if (!inputText.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputText.trim(),
    isUser: true,
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputText('');
  setIsLoading(true);

  try {
    // Build conversation history for context
    const conversationMessages = [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      ...messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage.text }
    ];

    const completion = await openai.chat.completions.create({
      messages: conversationMessages,
      model: selectedModel,
      stream: false,
    });

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: completion.choices[0]?.message?.content || '',
      isUser: false,
    };

    setMessages((prev) => [...prev, aiResponse]);
  } catch (error) {
    console.error('Error:', error);
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'I apologize, but I encountered an error while processing your request. Please try again.',
      isUser: false,
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

  const clearMessages = async () => {
    await Storage.clearChatMessages();
    setMessages([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
      </View>
      <TouchableOpacity onPress={clearMessages} style={{ padding: 8 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>Clear Chat</Text>
      </TouchableOpacity>

      <View style={styles.modelPickerContainer}>
        <Text style={styles.modelPickerLabel}>Model:</Text>
        <Picker
          selectedValue={selectedModel}
          onValueChange={(itemValue) => setSelectedModel(itemValue)}
          style={styles.picker}
          dropdownIconColor="#fff">
          {availableModels.map((model) => (
            <Picker.Item key={model} label={model} value={model} color="#fff" />
          ))}
        </Picker>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}>
        {messages.length === 0 && !streamingText && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              ð Hi! I'm your AI assistant. How can I help you today?
            </Text>
          </View>
        )}
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}>
            <Text
              style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText,
              ]}>
              {message.text}
            </Text>
          </View>
        ))}
        {streamingText && (
          <View style={[styles.messageBubble, styles.aiMessage]}>
            <Text style={[styles.messageText, styles.aiMessageText]}>
              {streamingText}
            </Text>
          </View>
        )}
        {isLoading && !streamingText && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#10B981" />
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#6B7280"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}>
            <Icon  name='send' size={20} color={inputText.trim() ? '#FFFFFF' : '#6B7280'} />

          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  modelPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
  },
  modelPickerLabel: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  picker: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#2D3748',
    borderRadius: 8,
  },

  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  welcomeContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#10B981',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#2D3748',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    backgroundColor: '#374151',
  },
});
