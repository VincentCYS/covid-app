import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Animated
} from 'react-native';
import API from '../../helpers/api';
import styles from './stat_style';
import {ThemeContext, } from '../../theme/theme-context.js';

import AgeBarChart from '../../components/age_bar_chart/age_bar_chart.js';
import CasePieChart from '../../components/case_pie_chart/case_pie_chart.js';
import ImmigrationLineChart from '../../components/immigration_line_chart/immigration_line_chart.js';
import FigureItem from '../../components/figure_item/figure_tiem.js';
// import ContentLoader, { Rect } from 'react-content-loader/native'

export default function Stat(props) {
  const [loading, setLoading]               = useState(true);
  const [updateDate, setUpdateDate]         = useState('');
  const [source, setSource]                 = useState('');
  const [data, setData]                     = useState({});
  const {theme, toggle, dark}               = React.useContext(ThemeContext);

  useEffect(() => {
    getData('immigration');
    getData('figure');
    getData('case');
  }, []);

// const Loader = () => (
//   <ContentLoader viewBox="0 0 400 380" animate = {true} backgroundColor = {theme.darkGrey} style = {{
//             position       : 'absolute',
//             left           : '5%',
//             right          : '5%',
//             top            : 0,
//             bottom         : 0,
//           }}>
//     <Rect x="0" y="0" rx="4" ry="4" width="120" height="130" />
//     <Rect x="140" y="0" rx="4" ry="4" width="120" height="130" />
//     <Rect x="280" y="0" rx="4" ry="4" width="120" height="130" />

//     <Rect x="0" y="150" rx="4" ry="4" width="120" height="130" />
//     <Rect x="140" y="150" rx="4" ry="4" width="120" height="130" />
//     <Rect x="280" y="150" rx="4" ry="4" width="120" height="130" />
//   </ContentLoader>
// )


  // loading spinner
  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color = {theme.primary}
        size  = "small"
        style = {{
          position : 'absolute',
          top : 0,
          bottom : 0,
          right:0,
          left:0,
          marginRight     : 5,
          backgroundColor : theme.black,
          alignItems      : 'center',
          justifyContent  : 'center',
        }}
      />
    );
  }


  async function getData(type) {
    setLoading(true);
    API.get(`/${type}`, {})
      .then(res => {
        var published = null;
        if (res.lastUpdate) {
          published = new Date(res.lastUpdate);
          published.setHours(published.getHours() + 8);
          published = published
            .toISOString()
            .split('T')
            .join(' ')
            .split(':');
          published.pop();
          published = published.join(':');
        }

        setLoading(false);
        setData(prev => ({...prev, [type]: res.data}));
        Object.keys(res).includes('source')
          ? setSource({name: res.source, url: res.sourceURL})
           :  null;
        setUpdateDate(prev => (published ? published : prev));
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Failed to fetch error: ' + err.messages);
      });
  }

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  var infectedPanel1 = [
    {
      title     : '死亡',
      keyName   : 'death',
      isReverse : true,
    },
    {
      title     : '確診',
      keyName   : 'comfirmCase',
      isReverse : true,
    },
    {
      title   : '出院',
      keyName : 'recover',
    },
  ];

  var infectedPanel2 = [
    {
      title     : '呈報',
      keyName   : 'fulfillReportingCriteria',
      isReverse : true,
    },
    {
      title   : '排除',
      keyName : 'ruleOut',
    },
    {
      title     : '住院檢查',
      keyName   : 'investigation',
      isReverse : true,
    },
  ];

 

  function handleScroll(event) {
    props.setAnimation((event.nativeEvent.contentOffset.y > 50));
    props.setHidden()
  }

  return (
    <SafeAreaView style = {styles(theme).wrapper}>
      <StatusBar
        barStyle        = {dark ? 'light-content' : 'dark-content'}
        backgroundColor = {theme.black}
      />

      {!loading ? (
        <Animated.ScrollView
          scrollEventThrottle={100} 
          onScroll={(e) => handleScroll(e)}

          style          = {styles(theme).container}
          refreshing     = {loading}
          refreshControl = {
            <RefreshControl
              colors     = {[theme.primary]}
              refreshing = {loading}
              onRefresh  = {() => {
                setLoading(false);
                getData('case');
                getData('immigration');
                getData('figure');
              }}
            />
          }>
          <View
            style={{
              flex         : 1,
              alignItems   : 'flex-end',
              marginRight  : 10,
              marginBottom : 20,
            }}>
            <Text             style   = {styles(theme).dateTxt}>更新時間: {updateDate}</Text>
            <TouchableOpacity onPress = {() => openSourceUrl(source.url)}>
            <Text             style   = {[styles(theme).dateTxt, {marginTop: 0}]}>
                來源 : {source.name}
              </Text>
            </TouchableOpacity>
          </View>

          <FigureItem figure = {data.figure} dataSource = {infectedPanel1} />
          <FigureItem figure = {data.figure} dataSource = {infectedPanel2} />

          <CasePieChart         data = {data} />
          <AgeBarChart          data = {data} />
          <ImmigrationLineChart data = {data} />
        </Animated.ScrollView>
      ) : (
        activityIndicatorLoadingView()
      )}
    </SafeAreaView>
  );
}
