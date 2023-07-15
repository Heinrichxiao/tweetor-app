import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import Tweet from './components/Tweets';
import logo from './assets/logo.png';

const LoginScreen = ({ onLogin, skipLogin }) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const requestBody = {
      handle,
      password,
    };

    console.log("Making request");
    console.log((new URLSearchParams(requestBody)).toString())

    // Make the POST request to the login endpoint
    fetch("https://tweetor.pythonanywhere.com/login", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
      },
      "referrer": "https://tweetor.pythonanywhere.com/login",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": (new URLSearchParams(requestBody)).toString(),
      "method": "POST",
      "mode": "cors",
      "credentials": "same-origin"
    })
      .then((response) => {
        console.log(response.headers); // Log the response to inspect it
        const redirectUrl = 'https://tweetor.pythonanywhere.com/'; // Update with your expected redirect URL
        console.log(response.url)
        if (response.url === redirectUrl) {
          console.log("Logged In")
          onLogin();
        } else
          console.log("Not Logged In")
      });
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Handle"
        value={handle}
        onChangeText={setHandle}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={skipLogin}>
        <Text style={styles.buttonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const Feed = ({ loggedIn, unskip, logout }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentTweet, setSendTweet] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('https://tweetor.pythonanywhere.com/api/search')
      .then((response) => response.json())
      .then((data) => {
        setTweets(data);
        setLoading(false);
    });
  }, [sentTweet]);

  const sendTweet = async () => {
    fetch("https://tweetor.pythonanywhere.com/submit_tweet", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
      },
      "referrer": "https://tweetor.pythonanywhere.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": (new URLSearchParams({
        text0: "",
        text1: "",
        template_id: "",
        content,
        hashtag: "",
      })).toString(), // "text0=&text1=&template_id=&content=random-test2%0D%0A&hashtag=",
      "method": "POST",
      "mode": "cors",
      "credentials": "same-origin"
    });
    setContent('');
    setSendTweet(!sentTweet);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        {loggedIn ? 
        <TouchableOpacity onPress={logout}>
          <Text style={styles.profileButton}>Logout</Text>
        </TouchableOpacity>
        : <TouchableOpacity onPress={unskip}>
          <Text style={styles.profileButton}>Login</Text>
        </TouchableOpacity>}
      </View>
      <ScrollView style={styles.feedContainer} contentContainerStyle={styles.feedContent}>
        {loggedIn ? (
          <View style={styles.sendTweet}>
            <TextInput
              style={[styles.input, styles.tweetContent]}
              placeholder="Tweet here"
              value={content}
              onChangeText={setContent}
            />
            <TouchableOpacity style={styles.button} onPress={sendTweet}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        ):  <View>
          <Text>In order to tweet, you need to login.</Text>
          <Button title="Login" onPress={unskip} />
        </View>}
        {loading ? (
          <Text>Loading tweets...</Text>
        ) : (
          tweets.map((tweet) => (
            <Tweet key={tweet.id} content={tweet.content} hashtag={tweet.hashtag} username={tweet.username} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [skipped, setSkip] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch('https://tweetor.pythonanywhere.com/login', {
          "credentials": "same-origin"
        });
        const redirectUrl = 'https://tweetor.pythonanywhere.com/'; // Update with your expected redirect URL
        
        console.log(res.url);
        if (res.url === redirectUrl) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const skipLogin = () => {
    setSkip(true);
  };

  const unskip = () => {
    setSkip(false);
  };

  const logout = () => {
    fetch("https://tweetor.pythonanywhere.com/logout", {
      "credentials": "same-origin"
    });
    setLoggedIn(false);
  }

  return (
    <View style={styles.container}>
      {loggedIn || skipped ? <Feed loggedIn={loggedIn} unskip={unskip} logout={logout}/> : <LoginScreen onLogin={handleLogin} skipLogin={skipLogin} />}
    </View>
  );
};


const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  skipButton: {
    backgroundColor: '#bbb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    resizeMode: 'contain',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  profileButton: {
    fontWeight: 'bold',
  },
  sendTweet: {
    width: '100%',
  },
  tweetContent: {
    width: '100%',
  }
});

export default App;
