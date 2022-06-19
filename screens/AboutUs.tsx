import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import * as WebBrowser from 'expo-web-browser';

const _handlePressButtonAsync = async () => {
  await WebBrowser.openBrowserAsync('https://id.linkedin.com/in/ahmad-amri-sanusi/');
};

export default function AboutUsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>
        Hello,
        My name is Ahmad Amri Sanusi.
        You can find me at:
      </Text>

      <View style={styles.button}>
      <Button
        title='Linkedin'
        onPress={_handlePressButtonAsync}
        color='grey'
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  }
});
