import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Linking,
  FlatList,
  StatusBar,
  Modal,
  Animated,
} from 'react-native';
import {Input} from 'native-base';
import constants from '../../helpers/constants';
import API from '../../helpers/api';
import styles from './news_style';
import NewsDetail from '../news_detail';
import {ThemeContext, ThemeProvider} from '../../theme/theme-context.js';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default function News(props) {
  const [loading, setLoading]               = useState(true);
  const [articles, setArticles]             = useState([]);
  const [timer, setTimer]                   = useState();
  const [showNews, setShowNews]             = useState(false);
  const [preview, setPreview]               = useState(null);
  const [news, setNews]                     = useState();
  const [isLongPress, setIsLongPress]       = useState(false);
  const [animationValue, setAnimationValue] = useState(new Animated.Value(0));

  const {theme, toggle, dark} = React.useContext(ThemeContext);

  useEffect(() => {
    getArticles();
  }, []);

  var timeout = null;
  
  function scaleAnimation(from, to) {
    Animated.timing(animationValue, {
      toValue  : from,
      duration : 200,
    }).start(() =>
      Animated.timing(animationValue, {
        toValue  : to,
        duration : 200,
      }).start(),
    );
  }

  function getArticles(k) {
    setLoading(true);
    API.get(
      k ? `/articles/search/${k}` : `/articles/${props.numOfArticles || 700}`,
      {},
    )
      .then(res => {
        res.data.map(v => {
          v.published = getPublishTimeString(v.published);
        });

        setLoading(false);
        setArticles(res.data);
        forceUpdate();
      })
      .catch(err => {
        setLoading(false);
      });
  }

  function getPublishTimeString(published) {
    var updateTime  = null;
    var diff        = new Date().getTime() - published;
    var hrDiff      = Math.floor(diff / 1000 / 60 / 60);
        updateTime  = hrDiff < 23 && hrDiff > 0 ? `${hrDiff}小時前` : null;
        diff       -= hrDiff * 1000 * 60 * 60;

    var minDiff    = Math.floor(diff / 1000 / 60);
        updateTime = 
      minDiff < 60 && minDiff > 0 && !updateTime
        ? `${minDiff}分鐘前`
         :  updateTime;
    diff -= minDiff * 1000 * 60;

    var secondsDifference = Math.floor(diff / 1000);
        updateTime        = 
      secondsDifference < 60 && secondsDifference > 0 && !updateTime
        ? `${secondsDifference}秒前`
         :  updateTime;

    if (!updateTime) {
      published = new Date(published);
      published.setHours(published.getHours() + 8);
      published = published
        .toISOString()
        .split('T')
        .join(' ')
        .split(':');
      published.pop();
      published  = published.join(':');
      updateTime = published;
    }

    return updateTime;
  }

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  function onChangeText(k) {
    if (timer) {
      setTimer();
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        getArticles(k);
      }, 1000),
    );
  }

  function renderSearchBar() {
    return (
      <View
        style={{
          height          : 40,
          marginTop       : 20,
          marginBottom    : 20,
          backgroundColor : theme.black,
        }}>
        <Input
          style                = {styles(theme).input}
          placeholder          = "搜尋..."
          onChangeText         = {k => onChangeText(k)}
          placeholderTextColor = {dark ? 'grey' : 'white'}
          backgroundColor      = {dark ? 'white' : 'grey'}
        />
      </View>
    );
  }

  function renderCardRow({item, index}) {
    return (
      <View key = {`articles-${item._id}`} style = {styles(theme).card}>
        <View
          style={[
            styles(theme).cardItem,
            {paddingBottom: 10, paddingLeft: 10, flexDirection: 'row'},
          ]}>
          {/* source */}
          <TouchableOpacity
                  style   = {{flex: 5}}
                  onPress = {() => openSourceUrl(item.sourceUrl)}>
            <Text style   = {[styles(theme).timeTxt, {fontSize: 15}]}>
              {item.source}
            </Text>
          </TouchableOpacity>

          <View
                  style = {[styles(theme).cardTime, {flex: 1, alignSelf: 'flex-end'}]}>
            <Text style = {styles(theme).timeTxt}>{item.published}</Text>
          </View>
          
        </View>

        <View
          style = {[styles(theme).cardItem]}
     >
          <TouchableOpacity   
            onPress = {() => {
              if (!isLongPress) {
                setNews(item);
                setShowNews(true)
              }
            }}
          onPressIn = {() => {            
            timeout = setTimeout(() => {
              setIsLongPress(true);
              scaleAnimation(1.1, 1);
              setPreview(item);
              clearTimeout(timeout);
            }, 250);
            
          }} 
            onPressOut={() => {

              if (timeout == null || isLongPress) {
                setPreview(null);
                setIsLongPress(false);
                clearTimeout(timeout);

              } else {
                clearTimeout(timeout);
           
                setIsLongPress(false);
              }
            }}
          >
            {/* news title */}
            <Text
              style={[
                styles(theme).cardTitle,
                {
                  fontSize   : 20,
                  color      : theme.fontWhite,
                  alignSelf  : 'center',
                  fontWeight : 'bold',
                },
              ]}>
              {[item.title]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function handleScroll(event) {
    props.setAnimation(event.nativeEvent.contentOffset.y > 50);
    props.setHidden();
  }

  const animatedStyle = {
    transform: [
      {
        scale : animationValue,
      },
    ],
  };

  return (
    <View style = {styles(theme).container}>
      <Modal
        visible             = {preview != null}
        hardwareAccelerated = {true}
        transparent         = {true}>
        <Animated.View
          style={[
            animatedStyle,
            {
              flex            : 1,
              backgroundColor : '#00000000',
              alignItems      : 'center',
              justifyContent  : 'center',
              elevation       : 11,
            },
          ]}
          onTouchEndCapture = {() => setPreview(null)}>
          <View
            style={{
              backgroundColor : dark ? '#fff' : 'grey',
              padding         : '5%',
              marginLeft      : wp('5%'),
              marginRight     : wp('5%'),
              borderRadius    : 20,
            }}>
            <Text style = {{color: theme.black}} numberOfLines = {15}>
              {preview != null
                ? preview.content.replace(/(<([^>]+)>)/gi, '')
                : ''}
            </Text>
          </View>
        </Animated.View>
      </Modal>

      <StatusBar
        barStyle        = {dark ? 'light-content' : 'dark-content'}
        backgroundColor = {theme.black}
      />

      {renderSearchBar()}

      <FlatList
        data                = {articles}
        scrollEventThrottle = {16}
        onScroll            = {e => handleScroll(e)}
        refreshControl      = {
          <RefreshControl
            colors     = {[theme.primary]}
            tintColor  = {theme.primary}
            refreshing = {loading}
            onRefresh  = {() => {
              setLoading(true);
              getArticles();
            }}
          />
        }
        refreshing                = {loading}
        renderItem                = {(v, i) => renderCardRow(v, i)}
        initialNumToRender        = {50}
        updateCellsBatchingPeriod = {50}
      />
      {news ? (
        <NewsDetail news = {news} setShowNews = {setShowNews} showNews = {showNews} />
      ) : null}
    </View>
  );
}
