import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Linking,
  FlatList,
  StatusBar
} from 'react-native';
import {Card, CardItem} from 'native-base';
import constants from '../../helpers/constants';
import API from '../../helpers/api';
import styles from './news_style';

export default function News(props) {
  const [loading, setLoading]   = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles();
  }, []);

  function getArticles() {
    setLoading(true);
    API.get(`/articles/${props.numOfArticles || 50}`, {})
      .then(res => {
        setLoading(false);
        setArticles(res.data);
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Failed to fetch error: ' + err.messages);
      });
  }

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  function renderCardRow({item, index}) {
    var published = new Date(item.published);
    published.setHours(published.getHours() + 8);
    published = published
      .toISOString()
      .split('T')
      .join(' ')
      .split(':');
    published.pop();
    published = published.join(':');

    const regex   = /(<([^>]+)>)/gi;
    const content = item.content.replace(regex, '');

    return (
      <View>
        {index === 0 ? (
          <Text style = {styles.title}>武漢肺炎相關新聞</Text>
        ) : null}
        <Card             key     = {`articles-${item._id}`} style = {styles.card}>
        <CardItem         style   = {styles.cardItem}>
        <TouchableOpacity onPress = {() => openSourceUrl(item.url)}>
              {/* news title */}
              <Text
                style={[
                  styles.cardTitle,
                  {
                    fontSize   : 20,
                    color      : constants.colors.primary,
                    alignSelf  : 'center',
                    fontWeight : 'bold',
                  },
                ]}>
                {[item.title]}
              </Text>
            </TouchableOpacity>
          </CardItem>

          <CardItem style = {styles.cardItem}>
            {/* source */}
            <TouchableOpacity
                    style   = {{flex: 1}}
                    onPress = {() => openSourceUrl(item.sourceUrl)}>
              <Text style   = {styles.timeTxt}>來源: {item.source}</Text>
            </TouchableOpacity>
            {/* updated time */}
            <View style = {styles.cardTime}>
            <Text style = {styles.timeTxt}>更新時間: {published}</Text>
            </View>
          </CardItem>

          <CardItem style = {styles.cardItem}>
            {/* news content */}
            <Text
              style={[
                styles.cardTitle,
                {fontSize: 16, fontWeight: '500', lineHeight: 20},
              ]}
              numberOfLines = {20}>
              {content}
            </Text>
          </CardItem>
        </Card>
      </View>
    );
  }

  

  return (
    <View style = {styles.container}>
      <StatusBar barStyle = {'light-content'} backgroundColor = {constants.colors.black}/>
      <FlatList
        data           = {articles}
        refreshControl = {
          <RefreshControl
            colors     = {[constants.colors.primary]}
            tintColor  = {constants.colors.primary}
            refreshing = {loading}
            onRefresh  = {() => {
              setLoading(true);
              getArticles();
            }}
          />
        }
        refreshing         = {loading}
        renderItem         = {(v, i) => renderCardRow(v, i)}
        initialNumToRender = {10}
      />
    </View>
  );
}
