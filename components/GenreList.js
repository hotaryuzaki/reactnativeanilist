import { StyleSheet, Text } from 'react-native';

const GenreList = ({ data, limit }) => {
  return (
    data &&
      data.map((genre, index) => {
        if (index < limit) {
          return (
            <Text key={index} style={styles.ItemGenre}>
              {genre}
            </Text>
          );
        }

        return false;
      })
  )
}

// STYLESHEET
const styles = StyleSheet.create({
  ItemGenre: {
    color: '#fff',
    fontSize: 10,
    borderRadius: 8,
    padding: 5,
    marginHorizontal: 2,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#d1d5f5'
  }
});

export default GenreList;