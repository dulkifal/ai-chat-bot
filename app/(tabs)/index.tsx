import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import OpenAI from 'openai';

import { IconSymbol } from '@/components/ui/IconSymbol';
import ChatMessage from '@/components/chat';

// Import environment variables
import { REACT_APP_OPENAI_API_KEY } from '@env';

const openai = new OpenAI({
  apiKey: REACT_APP_OPENAI_API_KEY

})

const HomeScreen = () => {
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([
    {
      isMe: false,
      message: "Hi, How can I help you today?",
    }
  ])

  const handleInput = async (input) => {
    if (input.trim() === '') return; // Ignore empty input

    // Update user message first
    setChats(prevChats => [...prevChats, { isMe: true, message: input }]);

    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: `You: ${input}\nAI:`,

      });
      console.log(response);
      const aiResponse = response.choices[0].text || 'Sorry, I could not process your input.';

      // Update bot response
      setChats(prevChats => [...prevChats, { isMe: false, message: aiResponse }]);
    } catch (error) {
      console.error('Error communicating with OpenAI API:', error);
      setChats(prevChats => [...prevChats, { isMe: false, message: 'Error: Unable to respond at this time.' }]);
    }

    setInput('');
  };

  const scrollViewRef = useRef();
  return (
    <SafeAreaProvider >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>AI Chatbot</Text>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatWindow}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {chats.map((chat, index) => (
            <ChatMessage key={index} isMe={chat.isMe} message={chat.message} />
          ))}
        </ScrollView>


        <View style={styles.inputContainer}>

          <TextInput
            style={styles.input}
            placeholder="Type your message here"
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={() => handleInput(input)}
            value={input}
          />

          <TouchableOpacity style={styles.sendButton} onPress={() => handleInput(input)} >
            <IconSymbol size={28} name="paperplane.fill" color={"blue"} />

          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#DE5FF',
    padding: 10,
  },
  chatWindow: {
    flex: 6,
    padding: 10, // Add some padding for better readability
    minWidth: '90%',
  },


  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 10,
    marginBottom: 50,

  },
  input: {
    flex: 5,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
  sendButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

})

export default HomeScreen;