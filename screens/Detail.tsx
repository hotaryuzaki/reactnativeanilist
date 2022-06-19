import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, Pressable, StyleSheet } from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { RootStackScreenProps } from '../types';
import Constants from '../config/Constants';
import { Text, View } from '../components/Themed';

const headers = { 'Content-Type': 'application/json' };
const appIcon = 'https://anilist.co/img/icons/icon.svg';

export default function Detail({ navigation, route }: RootStackScreenProps<'Detail'>) {
  console.log(route.params.id);
  
  // const [id, setId] = useState(route.params?.id?? null); // PARAM UNIVERSAL DEEPLINK
  const [error, setError] = useState([]);
  const [data, setData] = useState(true);
  const [loading, setLoading] = useState(true);

  // MOUNT FUNCTIONS CALL
  useEffect(() => {
    _getApi();
  }, []); // SET EMPTY ARRAY SO USEEFFECT JUST CALL ONCE

  const _getApi = async () => {
    try {
      await _getDetails();
      setLoading(false);
    }

    catch (e) {
      // console.log(e);
    }
  };

  const _getDetails = useCallback (async () => {
    try {
      const query = {
        query : `{
          media: Media(id: ${id}) {
            id
            title { userPreferred }
            type
            genres
            format
            source
            status
            description
            season
            seasonYear
            startDate { year month day }
            chapters
            volumes
            episodes
            coverImage { large color }
            averageScore
            meanScore
            popularity
            trending
          }
        }`
      };

      const response = await axios.post(
        Constants.url,
        query,
        { headers }
      );

      // console.log(response.data.data.media);
      
      
      setData(response.data.data.media);
      setError([]);
    }

    catch (e) {
      // console.log(e);
    }

  }, [id]);

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
});
