import { StyleSheet, Text } from 'react-native';

const MediaScore = ({ score }) => {
  return (
    score &&
      <Text style={styles.MediaScore}>
        {score}%
      </Text>
  )
}

// STYLESHEET
const styles = StyleSheet.create({
  MediaScore: {
    position: 'absolute',
    // top: 0,
    right: 0,
    color: '#ec3131',
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#2b2d42',
    borderBottomLeftRadius: 8,
    zIndex: 99999
  }
});

export default MediaScore;