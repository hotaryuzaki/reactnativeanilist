import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import axios from 'axios';
import { RootTabScreenProps } from '../types';
import { FilterContext } from '../config/ReactContext';
import Constants from '../config/Constants';
import { Text, View } from '../components/Themed';
import GenreList from '../components/GenreList';
import MediaScore from '../components/MediaScore';

const headers = { 'Content-Type': 'application/json' };
const appIcon = 'https://anilist.co/img/icons/icon.svg';

interface interfacePageInfo {
  hasNextPage: boolean;
};

type myData = interfaceItem[];

interface interfaceItem {
  id: number;
  product_id: number;
  meanScore: number;
  coverImage: { large: string };
  title: { userPreferred: string};
  genres: string[];
};

interface iRender {
  index: number;
  item: interfaceItem;
}

export default function Home({ navigation }: RootTabScreenProps<'Home'>) {
  const filterContext = useContext(FilterContext);
  const [dataFilter, setDataFilter] = useState(filterContext.filterValue);
  const [pageInfo, setpageInfo] = useState<interfacePageInfo>({} as interfacePageInfo);
  const [data, setData] = useState<myData>([] as myData);
  const [error, setError] = useState<object[]>([]);
  const [perPage, setPerPage] = useState(16);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [loadingFlag, setLoadingFlag] = useState(false);
  

  // MOUNT FUNCTIONS CALL
  useEffect(() => {
    _getApi();
  }, []); // SET EMPTY ARRAY SO USEEFFECT JUST CALL ONCE

  const _getApi = async () => {
    try {
      await _getList();
      if (dataFilter === 0) {
        await _getAdditional();
      }
      setLoading(false);
    }

    catch (e) {
      console.log(e);
    }
  };
  
  // GET API DATA ADDITIONAL
  const _getAdditional = useCallback (async () => {
    try {
      const query = {
        query : `{
          genres: GenreCollection
        }`
      };
      
      // console.log(query);

      const response = await axios.post(
        Constants.url,
        query,
        { headers }
      );
      
      const genre = response.data.data.genres.map((item:string) => {
        return { genre: item, value: false }
      });
      const data = [genre, { count: 0, filter: [] }]

      filterContext.setFilterDefault(data); // UPDATE GLOBAL STATE - FILTER RESET
      filterContext.setFilterValue(data); // UPDATE GLOBAL STATE - FILTER VALUE
    }

    catch (e) {
      console.log(e);
    }

  }, []);

  // GET API DATA LIST
  const _getList = (async () => {    
    // BLOCK MULTIPLE REQUEST
    if (loadingFlag) return false;

    try {
      setLoadingFlag(true);
      let filter = '';

      // CEK JIKA MELAKUKAN FILTER
      if (dataFilter.length > 0 && dataFilter[1].filter.length > 0)
        filter = `, genre_in: [${dataFilter[1].filter}]`;

      const query = {
        query : `{
          list: Page(page: ${page}, perPage: ${perPage}) {
            pageInfo {
              total
              perPage
              currentPage
              lastPage
              hasNextPage
            }
            media: media(sort: TRENDING_DESC isAdult: false ${filter}) {
              id
              title { userPreferred }
              genres
              coverImage { large }
              meanScore
            }
          }
        }`
      };
      
      // console.log('query', query);

      const response = await axios.post(
        Constants.url,
        query,
        { headers }
      );

      // console.log(response.data.data.list.media);
      
      // UNTUK DATA HALAMAN PERTAMA
      if (page === 1) {
        setpageInfo(response.data.data.list.pageInfo);
        setData(response.data.data.list.media);
        setLoadingMore(true); // RESET hasMore PROPS FOR INFINITE SCROLL
      }
      // UNTUK DATA NEXT PAGE
      else {
        setpageInfo(response.data.data.list.pageInfo);
        setData({...data, ...response.data.data.list.media });
      }
      
      // UPDATE INFO
      setError([]);
      // setPage(page + 1);
    }

    catch (e) {
      console.log(e);
    }
  });

  // STATE dataFilter UPDATE CALLBACK
  useEffect(() => {
    // console.log('useEffect dataFilter', dataFilter);
    let unmounted:boolean = false; // FLAG TO CHECK COMPONENT UNMOUNT

    // MEMASTIKAN FILTER DATA APPLY - UNTUK PAGE 1
    if (!unmounted && page === 1)
      _getList();

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => { unmounted = true };

  }, [dataFilter]);

  // STATE data UPDATE CALLBACK
  useEffect(() => {
    // console.log('useEffect data', pageInfo);
    let unmounted:boolean = false; // FLAG TO CHECK COMPONENT UNMOUNT

    // INFINITE SCROLL - DIBATASI 1000 DATA
    if (!unmounted && data.length === 1000 - perPage)
      setLoadingMore(false);

    // JIKA SUDAH DATA TERAKHIR
    if (!unmounted && !pageInfo?.hasNextPage)
      setLoadingMore(false);

    // BLOCK MULTIPLE CALL API
    if (!unmounted && loadingFlag)
      setLoadingFlag(false);

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => { unmounted = true };

  }, [data, pageInfo]);

  const keyExtractor = (item:interfaceItem, index:number) => `${index}-${item.product_id}`;

  const renderFlatListItem = useCallback(({ _, item }: iRender) => {
    return (
      <View style={styles.itemContainer}>
        <Pressable onPress={() => navigation.push('Detail', { id: item.id })}>
          <View style={styles.itemView}>
            <MediaScore score={item.meanScore} />
            <Image source={{ uri: item.coverImage.large }} style={styles.ItemImg} />
            <View style={styles.ItemGenres}>
              <GenreList data={item.genres} limit={2} />
            </View>
            <Text style={styles.ItemName}>{item.title.userPreferred}</Text>
          </View>
        </Pressable>
      </View>
    );
  }, []);


  // RENDER
  return loading ? (
    <View style={styles.loading}>
      <ActivityIndicator
        size='large'
        color={'red'}
        animating={loading}
      />
    </View>
  ) : (
    <View>
      <>
        {error.length > 0 && error}
        <FlatList
          key='productFlatList'
          keyExtractor={keyExtractor}
          data={data}
          renderItem={renderFlatListItem}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 7.5 }}
          style={styles.container}
          removeClippedSubviews={true}
          initialNumToRender={4}
        />
      </>
    </View>
  );
}

// STYLESHEET
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingVertical: 7.5,
  },
  itemContainer: {
    width: '50%',
    padding: 7.5,
  },
  itemView: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#323232'
  },
  ItemImg: {
    width: '100%',
    aspectRatio: 0.7,
  },
  ItemName: {
    color: '#EEEEEE',
    height: 50,
    fontSize: 12,
    paddingHorizontal: 7.5,
    paddingVertical: 7.5,
    overflow: 'hidden',
  },
  ItemGenres: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#323232'
  }
});
