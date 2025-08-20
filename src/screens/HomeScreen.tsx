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
    Modal,
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

type ChatSession = {
    id: string;
    name: string;
    createdAt: string;
    lastUpdated: string;
    messages: Message[];
};

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);

    const [selectedModel, setSelectedModel] = useState<string>('gpt-4');

    // Session Management State
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [showSessionList, setShowSessionList] = useState(false);
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editingSessionName, setEditingSessionName] = useState('');

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, streamingText]);

    useEffect(() => {
        const saveMessages = async () => {
            if (currentSessionId) {
                await Storage.saveSessionMessages(currentSessionId, messages);
            }
        };

        saveMessages();
    }, [messages, currentSessionId]);

    useEffect(() => {
        fetchAvailableModels();
        loadSessions();
    }, []);

    const loadSessions = async () => {
        const savedSessions = await Storage.getAllSessions();
        setSessions(savedSessions);

        const savedCurrentSessionId = await Storage.getCurrentSessionId();

        if (savedCurrentSessionId && savedSessions.find((s: ChatSession) => s.id === savedCurrentSessionId)) {
            setCurrentSessionId(savedCurrentSessionId);
            // Load the latest messages from storage for the current session
            const sessionFromStorage = await Storage.getSession(savedCurrentSessionId);
            const messagesToLoad = sessionFromStorage?.messages || [];
            setMessages(messagesToLoad);
        } else if (savedSessions.length > 0) {
            // If no current session or it doesn't exist, use the most recent one
            const mostRecent = savedSessions.sort((a: ChatSession, b: ChatSession) =>
                new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
            )[0];
            setCurrentSessionId(mostRecent.id);
            await Storage.setCurrentSessionId(mostRecent.id);
            // Load the latest messages from storage for the most recent session
            const sessionFromStorage = await Storage.getSession(mostRecent.id);
            const messagesToLoad = sessionFromStorage?.messages || mostRecent.messages || [];
            setMessages(messagesToLoad);
        } else {
            // Create a default session if none exist
            await createNewSession('New Chat');
        }
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

    // Session Management Functions
    const createNewSession = async (sessionName: string = 'New Chat') => {
        const newSession = await Storage.createSession(sessionName);
        if (newSession) {
            setSessions(prev => [...prev, newSession]);
            setCurrentSessionId(newSession.id);
            await Storage.setCurrentSessionId(newSession.id);
            setMessages([]);
            setShowSessionList(false);
        }
    };

    const switchSession = async (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setCurrentSessionId(sessionId);
            await Storage.setCurrentSessionId(sessionId);
            
            // Load the latest messages from storage
            const sessionFromStorage = await Storage.getSession(sessionId);
            const messagesToLoad = sessionFromStorage?.messages || session.messages || [];
            setMessages(messagesToLoad);
            
            // Update the local sessions state with the latest messages
            setSessions(prev => prev.map(s => 
                s.id === sessionId ? { ...s, messages: messagesToLoad } : s
            ));
            
            setShowSessionList(false);
        }
    };

    const deleteSession = async (sessionId: string) => {
        if (sessions.length <= 1) {
            // Don't delete the last session
            return;
        }

        await Storage.deleteSession(sessionId);
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        setSessions(updatedSessions);

        if (currentSessionId === sessionId) {
            // Switch to the most recent remaining session
            const mostRecent = updatedSessions.sort((a, b) =>
                new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
            )[0];
            await switchSession(mostRecent.id);
        }
    };

    const renameSession = async (sessionId: string, newName: string) => {
        await Storage.renameSession(sessionId, newName);
        setSessions(prev => prev.map(s =>
            s.id === sessionId ? { ...s, name: newName } : s
        ));
    };

    const startEditingSession = (sessionId: string, currentName: string) => {
        setEditingSessionId(sessionId);
        setEditingSessionName(currentName);
    };

    const saveSessionName = async () => {
        if (editingSessionId && editingSessionName.trim()) {
            await renameSession(editingSessionId, editingSessionName.trim());
            setEditingSessionId(null);
            setEditingSessionName('');
        }
    };

    const cancelEditingSession = () => {
        setEditingSessionId(null);
        setEditingSessionName('');
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
                //@ts-ignore
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
        if (currentSessionId) {
            await Storage.saveSessionMessages(currentSessionId, []);
            setMessages([]);
            // Update the session in local state
            setSessions(prev => prev.map(s =>
                s.id === currentSessionId ? { ...s, messages: [] } : s
            ));
        }
    };

    const getCurrentSessionName = () => {
        const currentSession = sessions.find(s => s.id === currentSessionId);
        return currentSession?.name || 'New Chat';
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        onPress={() => setShowSessionList(!showSessionList)}
                        style={styles.sessionButton}
                    >
                        <Icon name="chat" size={20} color="#FFFFFF" />
                        <Text style={styles.sessionButtonText}>Sessions</Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>{getCurrentSessionName()}</Text>

                    <View style={styles.sessionButton} >
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
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showSessionList}
                onRequestClose={() => setShowSessionList(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chat Sessions</Text>
                            <View style={styles.modalHeaderButtons}>
                                <TouchableOpacity
                                    onPress={() => {
                                        createNewSession();
                                        setShowSessionList(false);
                                    }}
                                    style={styles.modalNewChatButton}
                                >
                                    <Icon name="add" size={20} color="#FFFFFF" />
                                    <Text style={styles.modalButtonText}>New Chat</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setShowSessionList(false)}
                                    style={styles.modalCloseButton}
                                >
                                    <Icon name="close" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={styles.sessionScrollView}>
                            {sessions.map((session) => (
                                <View key={session.id} style={styles.sessionItem}>
                                    {editingSessionId === session.id ? (
                                        <View style={styles.editingContainer}>
                                            <TextInput
                                                style={styles.editInput}
                                                value={editingSessionName}
                                                onChangeText={setEditingSessionName}
                                                placeholder="Session name"
                                                placeholderTextColor="#6B7280"
                                                autoFocus
                                            />
                                            <View style={styles.editButtons}>
                                                <TouchableOpacity
                                                    onPress={saveSessionName}
                                                    style={styles.saveButton}
                                                >
                                                    <Icon name="check" size={16} color="#10B981" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={cancelEditingSession}
                                                    style={styles.cancelButton}
                                                >
                                                    <Icon name="close" size={16} color="#FF6B6B" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : (
                                        <>
                                            <TouchableOpacity
                                                style={[
                                                    styles.sessionItemButton,
                                                    session.id === currentSessionId && styles.activeSession
                                                ]}
                                                onPress={() => {
                                                    switchSession(session.id);
                                                    setShowSessionList(false);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.sessionItemText,
                                                    session.id === currentSessionId && styles.activeSessionText
                                                ]}>
                                                    {session.name}
                                                </Text>
                                                <Text style={styles.sessionItemDate}>
                                                    {new Date(session.lastUpdated).toLocaleDateString()}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => startEditingSession(session.id, session.name)}
                                                style={styles.editButton}
                                            >
                                                <Icon name="edit" size={16} color="#6B7280" />
                                            </TouchableOpacity>

                                            {sessions.length > 1 && (
                                                <TouchableOpacity
                                                    onPress={() => deleteSession(session.id)}
                                                    style={styles.deleteButton}
                                                >
                                                    <Icon name="delete" size={16} color="#FF6B6B" />
                                                </TouchableOpacity>
                                            )}
                                        </>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={clearMessages} style={{ padding: 8 }}>
                <Text style={{ color: 'red', textAlign: 'center' }}>Clear Chat</Text>
            </TouchableOpacity>



            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}>
                {messages.length === 0 && !streamingText && (
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>
                            Hi! I'm your AI assistant. How can I help you today?
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
                            ]}
                            selectable
                        >
                            {message.text}
                        </Text>
                    </View>
                ))}
                {streamingText && (
                    <View style={[styles.messageBubble, styles.aiMessage]}>
                        <Text style={[styles.messageText, styles.aiMessageText]} selectable>
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
                        <Icon name='send' size={20} color={inputText.trim() ? '#FFFFFF' : '#6B7280'} />

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
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sessionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#2D3748',
    },
    sessionButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginLeft: 4,
        fontFamily: 'Inter-Regular',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1F2937',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Inter-Bold',
    },
    modalHeaderButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalNewChatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#10B981',
        marginRight: 8,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginLeft: 4,
        fontFamily: 'Inter-Regular',
    },
    modalCloseButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#374151',
    },
    sessionScrollView: {
        padding: 8,
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    sessionItemButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#374151',
    },
    activeSession: {
        backgroundColor: '#10B981',
    },
    sessionItemText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    activeSessionText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    sessionItemDate: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'Inter-Regular',
    },
    deleteButton: {
        padding: 8,
        marginLeft: 8,
        borderRadius: 6,
        backgroundColor: '#374151',
    },
    editButton: {
        padding: 8,
        marginLeft: 8,
        borderRadius: 6,
        backgroundColor: '#374151',
    },
    editingContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    editInput: {
        flex: 1,
        backgroundColor: '#374151',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    editButtons: {
        flexDirection: 'row',
        marginLeft: 8,
    },
    saveButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#374151',
        marginRight: 4,
    },
    cancelButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#374151',
    },
    modelPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#1A1A1A',
    },
    picker: {
        width: 150,
        color: '#fff',
        backgroundColor: '#2D3748',
        borderRadius: 8,
        padding : 0
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
