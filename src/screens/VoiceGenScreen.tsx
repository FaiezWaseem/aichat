import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, { State, useProgress, useTrackPlayerEvents, Event } from 'react-native-track-player';

export default function VoiceGenScreen() {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Filiz');
  const progress = useProgress();

  // Setup TrackPlayer
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
      } catch (error) {
        console.error('Error setting up TrackPlayer:', error);
      }
    };
    setupPlayer();
  }, []);

  // Listen to playback state changes
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    }
  });

  const voices = [
    { id: 'Filiz', name: 'Filiz' },
    { id: 'Astrid', name: 'Astrid' },
    { id: 'Tatyana', name: 'Tatyana' },
    { id: 'Maxim', name: 'Maxim' },
    { id: 'Carmen', name: 'Carmen' },
    { id: 'Ines', name: 'Ines' },
    { id: 'Cristiano', name: 'Cristiano' },
    { id: 'Vitoria', name: 'Vitoria' },
    { id: 'Ricardo', name: 'Ricardo' },
    { id: 'Maja', name: 'Maja' },
    { id: 'Jan', name: 'Jan' },
    { id: 'Jacek', name: 'Jacek' },
    { id: 'Ewa', name: 'Ewa' },
    { id: 'Ruben', name: 'Ruben' },
    { id: 'Lotte', name: 'Lotte' },
    { id: 'Liv', name: 'Liv' },
    { id: 'Seoyeon', name: 'Seoyeon' },
    { id: 'Takumi', name: 'Takumi' },
    { id: 'Mizuki', name: 'Mizuki' },
    { id: 'Giorgio', name: 'Giorgio' },
    { id: 'Carla', name: 'Carla' },
    { id: 'Bianca', name: 'Bianca' },
    { id: 'Karl', name: 'Karl' },
    { id: 'Dora', name: 'Dora' },
    { id: 'Mathieu', name: 'Mathieu' },
    { id: 'Celine', name: 'Celine' },
    { id: 'Chantal', name: 'Chantal' },
    { id: 'Penelope', name: 'Penelope' },
    { id: 'Miguel', name: 'Miguel' },
    { id: 'Mia', name: 'Mia' },
    { id: 'Enrique', name: 'Enrique' },
    { id: 'Conchita', name: 'Conchita' },
    { id: 'Geraint', name: 'Geraint' },
    { id: 'Salli', name: 'Salli' },
    { id: 'Matthew', name: 'Matthew' },
    { id: 'Kimberly', name: 'Kimberly' },
    { id: 'Kendra', name: 'Kendra' },
    { id: 'Justin', name: 'Justin' },
    { id: 'Joey', name: 'Joey' },
    { id: 'Joanna', name: 'Joanna' },
    { id: 'Ivy', name: 'Ivy' },
    { id: 'Raveena', name: 'Raveena' },
    { id: 'Aditi', name: 'Aditi' },
    { id: 'Emma', name: 'Emma' },
    { id: 'Brian', name: 'Brian' },
    { id: 'Amy', name: 'Amy' },
    { id: 'Russell', name: 'Russell' },
    { id: 'Nicole', name: 'Nicole' },
    { id: 'Vicki', name: 'Vicki' },
    { id: 'Marlene', name: 'Marlene' },
    { id: 'Hans', name: 'Hans' },
    { id: 'Naja', name: 'Naja' },
    { id: 'Mads', name: 'Mads' },
    { id: 'Gwyneth', name: 'Gwyneth' },
    { id: 'Zhiyu', name: 'Zhiyu' },
    { id: 'Tracy', name: 'Tracy' },
    { id: 'Danny', name: 'Danny' },
    { id: 'Huihui', name: 'Huihui' },
    { id: 'Yaoyao', name: 'Yaoyao' },
    { id: 'Kangkang', name: 'Kangkang' },
    { id: 'HanHan', name: 'HanHan' },
    { id: 'Zhiwei', name: 'Zhiwei' },
    { id: 'Asaf', name: 'Asaf' },
    { id: 'An', name: 'An' },
    { id: 'Stefanos', name: 'Stefanos' },
    { id: 'Filip', name: 'Filip' },
    { id: 'Ivan', name: 'Ivan' },
    { id: 'Heidi', name: 'Heidi' },
    { id: 'Herena', name: 'Herena' },
    { id: 'Kalpana', name: 'Kalpana' },
    { id: 'Hemant', name: 'Hemant' },
    { id: 'Matej', name: 'Matej' },
    { id: 'Andika', name: 'Andika' },
    { id: 'Rizwan', name: 'Rizwan' },
    { id: 'Lado', name: 'Lado' },
    { id: 'Valluvar', name: 'Valluvar' },
    { id: 'Linda', name: 'Linda' },
    { id: 'Heather', name: 'Heather' },
    { id: 'Sean', name: 'Sean' },
    { id: 'Michael', name: 'Michael' },
    { id: 'Karsten', name: 'Karsten' },
    { id: 'Guillaume', name: 'Guillaume' },
    { id: 'Pattara', name: 'Pattara' },
    { id: 'Jakub', name: 'Jakub' },
    { id: 'Szabolcs', name: 'Szabolcs' },
    { id: 'Hoda', name: 'Hoda' },
    { id: 'Naayf', name: 'Naayf' }
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
      
      // Auto-play the generated audio
      setTimeout(() => {
        playAudio(uri);
      }, 500);
      
      Alert.alert('Audio Generated', 'Text-to-speech audio has been generated and is now playing!');
    } catch (error) {
      console.error('Error generating audio:', error);
      Alert.alert('Error', 'Failed to generate audio. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const playAudio = async (uri?: string) => {
    const audioUrl = uri || audioUri;
    if (!audioUrl) return;

    try {
      const state = await TrackPlayer.getState();
      
      if (state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        // Reset and add new track
        await TrackPlayer.reset();
        
        const track = {
          url: audioUrl,
          title: `Generated Speech - ${selectedVoice}`,
          artist: 'AI Voice Generator',
          duration: 0, // Will be determined automatically
        };
        
        await TrackPlayer.add(track);
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio.');
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
      
      // Auto-play the sample audio
      setTimeout(() => {
        playAudio(uri);
      }, 500);
      
      Alert.alert('Sample Generated', 'Sample audio has been generated and is now playing!');
    }, 2000);
  };

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  const stopAudio = async () => {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <View>
              <View style={styles.playbackControls}>
                <TouchableOpacity style={styles.actionButton} onPress={downloadAudio}>
                  <Icon name="download" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Download</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.playButton} onPress={() => playAudio()}>
                  <Icon name={isPlaying ? "pause" : "play-arrow"} size={28} color="#FFFFFF" />
                </TouchableOpacity>
                
                {isPlaying && (
                  <TouchableOpacity style={styles.actionButton} onPress={stopAudio}>
                    <Icon name="stop" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Stop</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.actionButton} onPress={() => setText('')}>
                  <Icon name="clear" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
              
              {progress.duration > 0 && (
                <View style={styles.audioProgress}>
                  <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(progress.position / progress.duration) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
                </View>
              )}
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
  audioProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    minWidth: 40,
    textAlign: 'center',
  },
});