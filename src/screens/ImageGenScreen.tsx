import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ImageGenScreen() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('flux');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const scrollViewRef = useRef<ScrollView>(null);

  const generateImageUrl = (params: {
    prompt: string;
    model: string;
    width: number;
    height: number;
  }) => {
    const baseUrl = 'https://image.pollinations.ai/prompt';
    const encodedPrompt = encodeURIComponent(params.prompt);
    return `${baseUrl}/${encodedPrompt}?model=${params.model}&width=${params.width}&height=${params.height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      Alert.alert('Empty Prompt', 'Please enter a description for the image you want to generate.');
      return;
    }

    setLoading(true);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });

    try {
      const url = generateImageUrl({
        prompt: prompt.trim(),
        model,
        width,
        height
      });
      
      setImageUrl(url);
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Error', 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const regenerateImage = () => {
    generateImage();
  };

  const openImage = () => {
    if (imageUrl) {
      Linking.openURL(imageUrl);
    }
  };

  const models = [
    { id: 'flux', name: 'Flux' },
    { id: 'flux-realism', name: 'Flux Realism' },
    { id: 'flux-cablyai', name: 'Flux CablyAI' },
    { id: 'flux-anime', name: 'Flux Anime' },
    { id: 'any-dark', name: 'Any Dark' },
    { id: 'flux-3d', name: 'Flux 3D' },
  ];

  const sizeOptions = [
    { width: 1024, height: 1024, label: '1:1 (1024×1024)' },
    { width: 1024, height: 1408, label: '2:3 (1024×1408)' },
    { width: 1408, height: 1024, label: '3:2 (1408×1024)' },
    { width: 1920, height: 1080, label: '16:9 (1920×1080)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Image Generation</Text>
      </View>
      
      <View style={styles.content}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <TouchableOpacity onPress={openImage} style={styles.imageWrapper}>
                <Image
                  style={styles.image}
                  source={{ uri: imageUrl }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <View style={[styles.image, styles.placeholderContainer]}>
                <Icon name="image" size={48} color="#6B7280" />
                <Text style={styles.placeholderText}>
                  Generated image will appear here
                </Text>
              </View>
            )}
            
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Generating image...</Text>
              </View>
            )}
          </View>
          
          {imageUrl && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={openImage}>
                <Icon name="open-in-new" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Open</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={regenerateImage}>
                <Icon name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prompt</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Describe the image you want to generate..."
              placeholderTextColor="#6B7280"
              value={prompt}
              onChangeText={setPrompt}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Model</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.modelOptions}>
                {models.map((modelOption) => (
                  <TouchableOpacity 
                    key={modelOption.id}
                    style={[
                      styles.modelOption,
                      model === modelOption.id && styles.modelOptionSelected
                    ]}
                    onPress={() => setModel(modelOption.id)}
                  >
                    <Text 
                      style={[
                        styles.modelOptionText,
                        model === modelOption.id && styles.modelOptionTextSelected
                      ]}
                    >
                      {modelOption.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Size</Text>
            <View style={styles.sizeOptions}>
              {sizeOptions.map((sizeOption) => (
                <TouchableOpacity 
                  key={`${sizeOption.width}x${sizeOption.height}`}
                  style={[
                    styles.sizeOption,
                    width === sizeOption.width && height === sizeOption.height && styles.sizeOptionSelected
                  ]}
                  onPress={() => { setWidth(sizeOption.width); setHeight(sizeOption.height); }}
                >
                  <Text 
                    style={[
                      styles.sizeOptionText,
                      width === sizeOption.width && height === sizeOption.height && styles.sizeOptionTextSelected
                    ]}
                  >
                    {sizeOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.generateButton,
              (!prompt.trim() || loading) && styles.generateButtonDisabled
            ]}
            onPress={generateImage}
            disabled={loading || !prompt.trim()}
          >
            <Icon name="auto-awesome" size={20} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>
              {loading ? 'Generating...' : 'Generate Image'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
  scrollContainer: {
    paddingBottom: 32,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
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
    backgroundColor: '#2D3748',
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
  modelOptions: {
    flexDirection: 'row',
  },
  modelOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#2D3748',
  },
  modelOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  modelOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  modelOptionTextSelected: {
    color: '#FFFFFF',
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#2D3748',
  },
  sizeOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  sizeOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  sizeOptionTextSelected: {
    color: '#FFFFFF',
  },
  generateButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
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
});