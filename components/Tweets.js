import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tweet = ({ username, content, hashtag }) => {
  const formatText = (text) => {
    let formattedText = [{ text: text, style: {} }];

    // Underline: __asdf__
    formattedText = formattedText.flatMap(({ text, style }) => {
      return text.split(/__(.*?)__/g).map((part, index) => {
        if (index % 2 === 1) {
          return { text: part, style: [style, styles.underline] };
        } else {
          return { text: part, style };
        }
      });
    });

    // Bold and Italic: ***asdf***
    formattedText = formattedText.flatMap(({ text, style }) => {
      return text.split(/\*\*\*(.*?)\*\*\*/g).map((part, index) => {
        if (index % 2 === 1) {
          return { text: part, style: [style, styles.bold, styles.italic] };
        } else {
          return { text: part, style };
        }
      });
    });
    
    // Bold: **asdf**
    formattedText = formattedText.flatMap(({ text, style }) => {
      return text.split(/\*\*(.*?)\*\*/g).map((part, index) => {
        if (index % 2 === 1) {
          return { text: part, style: [style, styles.bold] };
        } else {
          return { text: part, style };
        }
      });
    });

    // Italic: *asdf*
    formattedText = formattedText.flatMap(({ text, style }) => {
      return text.split(/\*(.*?)\*/g).map((part, index) => {
        if (index % 2 === 1) {
          return { text: part, style: [style, styles.italic] };
        } else {
          return { text: part, style };
        }
      });
    });

    return formattedText;
  };

  const formattedText = formatText(content);

  return (
    <View style={styles.tweetContainer}>
      <Text style={styles.tweetDetails}>{username}</Text>
      <Text style={styles.tweetContent}>
        {formattedText.map((part, index) => (
          <Text key={index} style={part.style}>
            {part.text}
          </Text>
        ))}
        {hashtag}
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  tweetContainer: {
    marginBottom: 10,
    padding: 10,
    borderColor: 'gray',
    width: '100%', 
  },
  tweetContent: {
    textAlign: 'left',
    fontSize: 16,
  },
  tweetDetails: {
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: "bold",
  },
});

export default Tweet;
