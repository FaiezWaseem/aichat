import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  TextInput,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function VoiceGenScreen() {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');

  const voices = [
    { id: 'Asaf', name: 'Asaf' },
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'nova', name: 'Nova' },
    { id: 'shimmer', name: 'Shimmer' },
  ];

  const startRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not Supported', 'Audio recording is not supported on web.');
        return;
      }
      
      // For now, we'll simulate recording
      setIsRecording(true);
      
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        Alert.alert('Recording Completed', 'Audio recorded successfully. In a real implementation, this would be processed for transcription.');
      }, 3000);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    Alert.alert('Recording Stopped', 'Recording has been stopped.');
  };

  const generateTextToSpeechUrl = (text: string, voice: string) => {
    // Using a simple TTS service URL (this is a placeholder - in real implementation you'd use OpenAI TTS API)
    const encodedText = encodeURIComponent(text);
    return `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodedText}`;
  };

  const generateAudio = async () => {
    if (!text.trim()) {
      Alert.alert('Empty Text', 'Please enter some text to generate speech.');
      return;
    }

    setGenerating(true);
    
    try {
      // Generate TTS URL
      const uri = generateTextToSpeechUrl(text, selectedVoice);
      setAudioUri(uri);
      
      Alert.alert('Audio Generated', 'Text-to-speech audio has been generated successfully!');
    } catch (error) {
      console.error('Error generating audio:', error);
      Alert.alert('Error', 'Failed to generate audio. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const playAudio = () => {
    if (audioUri) {
      // In a real implementation, you would use react-native-sound or similar
      Alert.alert('Play Audio', 'In a real implementation, this would play the generated audio.');
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = async () => {
    if (!audioUri) return;

    try {
      // Open the audio URL in browser for download
      await Linking.openURL(audioUri);
    } catch (error) {
      console.error('Error downloading audio:', error);
      Alert.alert('Error', 'Failed to download audio.');
    }
  };

  const generateSampleAudio = () => {
    const sampleText = "Welcome to our AI chatbot. I'm here to help you with any questions you might have. How can I assist you today?";
    setText(sampleText);
    
    setGenerating(true);
    
    setTimeout(() => {
      const uri = generateTextToSpeechUrl(sampleText, selectedVoice);
      setAudioUri(uri);
      setGenerating(false);
      Alert.alert('Sample Generated', 'Sample audio has been generated!');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Generation</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Text to Speech</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Text</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Enter text to convert to speech..."
              placeholderTextColor="#6B7280"
              value={text}
              onChangeText={setText}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Voice</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.voiceOptions}>
                {voices.map((voice) => (
                  <TouchableOpacity 
                    key={voice.id}
                    style={[
                      styles.voiceOption,
                      selectedVoice === voice.id && styles.voiceOptionSelected
                    ]}
                    onPress={() => setSelectedVoice(voice.id)}
                  >
                    <Text 
                      style={[
                        styles.voiceOptionText,
                        selectedVoice === voice.id && styles.voiceOptionTextSelected
                      ]}
                    >
                      {voice.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {audioUri && (
            <View style={styles.playbackControls}>
              <TouchableOpacity style={styles.actionButton} onPress={downloadAudio}>
                <Icon name="download" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Download</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.playButton} onPress={playAudio}>
                <Icon name={isPlaying ? "pause" : "play-arrow"} size={28} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={() => setText('')}>
                <Icon name="clear" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.generateButton,
                (!text.trim() || generating) && styles.generateButtonDisabled
              ]}
              onPress={generateAudio}
              disabled={generating || !text.trim()}
            >
              {generating ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Icon name="record-voice-over" size={20} color="#FFFFFF" />
              )}
              <Text style={styles.generateButtonText}>
                {generating ? 'Generating...' : 'Generate Speech'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.sampleButton}
              onPress={generateSampleAudio}
              disabled={generating}
            >
              <Icon name="play-circle-outline" size={20} color="#10B981" />
              <Text style={styles.sampleButtonText}>Try Sample</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Speech to Text</Text>
          
          <View style={styles.recordingControls}>
            {isRecording ? (
              <TouchableOpacity style={styles.recordButtonActive} onPress={stopRecording}>
                <Icon name="stop" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                <Icon name="mic" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.statusText}>
            {isRecording ? 'Recording... Tap to stop' : 'Tap microphone to start recording'}
          </Text>
          
          {Platform.OS === 'web' && (
            <Text style={styles.warningText}>
              Note: Audio recording may not be available in all web browsers.
            </Text>
          )}
          
          <Text style={styles.infoText}>
            This is a demo implementation. In a production app, you would integrate with speech recognition services like Google Speech-to-Text or OpenAI Whisper.
          </Text>
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
  card: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#374151',
  },
  voiceOptions: {
    flexDirection: 'row',
  },
  voiceOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1A1A1A',
  },
  voiceOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  voiceOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  voiceOptionTextSelected: {
    color: '#FFFFFF',
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    marginLeft: 6,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  generateButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  generateButtonDisabled: {
    backgroundColor: '#374151',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 8,
  },
  sampleButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  sampleButtonText: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 8,
  },
  recordingControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});