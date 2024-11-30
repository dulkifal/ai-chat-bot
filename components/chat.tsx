import { StyleSheet, Text, View } from "react-native";

const ChatMessage = ({ isMe, message }) => (
    <View style={[styles.chatItem, isMe ? styles.userChat : styles.botChat]}>
      <Text style={styles.chatText}>{message}</Text>
    </View>
  );
  
  const styles = StyleSheet.create({
    chatItem: {
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    userChat: {
      backgroundColor: '#CCE5FF', // Light blue for user messages
      alignSelf: 'flex-end',
    },
    botChat: {
      backgroundColor: '#F0F0F0', // Light gray for bot messages
      alignSelf: 'flex-start',
    },
    chatText: {
      fontSize: 16,
    },
  });
  
  export default ChatMessage;