import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const MyTextInput = () => {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState('');
  const [z, setz] = useState('');


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setX(Number(text))}
        value={x.toString()}
        placeholder="Enter text here..."
        keyboardType="numeric" // or 'numeric', 'email-address', etc.
        autoCapitalize="none" // or 'sentences', 'words', 'characters'
        autoCorrect={false}
        multiline={false} // Set to true for multi-line input
        maxLength={200} // Optional: limit the number of characters
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default MyTextInput;