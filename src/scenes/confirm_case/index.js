import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Alert,
  StatusBar,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Linking,
  FlatList,
  Animated
} from 'react-native';
import {Card, CardItem} from 'native-base';
import constants from '../../helpers/constants';
import API from '../../helpers/api';
import styles from './confirm_case_style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeContext, ThemeProvider } from '../../theme/theme-context.js'

export default function ConfirmCase(props) {
  const [loading, setLoading]       = useState(true);
  const [updateDate, setUpdateDate] = useState('');
  const [source, setSource]         = useState('');
  const [cases, setCases]           = useState({});
  const { theme, toggle, dark } = React.useContext(ThemeContext)


  useEffect(() => {
    getCase()
  }, [updateDate]);

  function getCase() {
    API.get(`/case`, {})
      .then(res => {
        var published = new Date(res.lastUpdate);
        published.setHours(published.getHours() + 8);
        published = published
          .toISOString()
          .split('T')
          .join(' ')
          .split(':');
        published.pop();
        published = published.join(':');
        setLoading(false);
        setCases(res.data || []);
        setSource({name: res.source, url: res.sourceURL});
        setUpdateDate(published);
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Failed to fetch error: ' + err.messages);
      });
  }

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  function openMap(location) {
    Platform.OS === 'ios'
      ? Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${location}`,
        )
      : Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${location}`,
        );
  }

  function renderCase({item, index}) {
    return (
      <View>
        {index === 0 ? (
          <View style = {{ marginTop : 20, marginBottom : 20, alignItems : 'flex-end' }}>
            {/* <Text             style   = {styles(theme).title}>香港武漢肺炎案例</Text> */}
            <Text             style   = {styles(theme).dateTxt}>更新時間: {updateDate}</Text>
            <TouchableOpacity onPress = {() => openSourceUrl(source.url)}>
              <Text
                style={
                  styles(theme).dateTxt}>
                來源 : {source.name}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View key   = {`card-${index}`} style = {[styles(theme).card, {marginBottom : 20}]}>
        <View style = {[styles(theme).card, {marginTop: 20}]}>
            {/* title */}
            <Text
              style={[
                styles(theme).subtitle,
                {
                  alignSelf  : 'flex-start',
                  color      : theme.primary,
                },
              ]}>
              {`#${item.index} ${item.hkResidents}`}{' '}
            </Text>
          </View>

          <View style = {{flexDirection: 'row'}}>
            {/* age and hospital */}
            <View
              style={[
                styles(theme).card,
                {
                  marginLeft  : wp('5%'),
                  marginTop   : 10,
                  marginRight : 20,
                  flex : 4,
                },
              ]}>
              <Text
                style={[
                  styles(theme).subtitle,
                  {alignSelf: 'flex-start', marginBottom: 10},
                ]}>
                {`${item.age}歲 ${item.gender}`}{' '}
              </Text>
              <TouchableOpacity onPress = {() => openMap(item.hospital)}>
              <Text             style   = {styles(theme).normalTxt}>{`入住${item.hospital}`} </Text>
              </TouchableOpacity>
            </View>

            {/* case information */}
            <View
              style={[
                styles(theme).card,
                {flex: 5, flexDirection: 'column', alignItems: 'flex-start'},
              ]}>
              <View style = {[styles(theme).roundWrapper, {marginBottom: 10}]}>
                <Text
                  adjustsFontSizeToFit
                  style={[
                    styles(theme).normalTxt,
                    {fontSize: 13, fontWeight: 'bold', color : '#fff' },
                  ]}>
                  {`${item.status}`}{' '}
                </Text>
              </View>
              <View style = {styles(theme).roundWrapper}>
                <Text
                  adjustsFontSizeToFit
                  style={[
                    styles(theme).normalTxt,
                    {fontSize: 13, fontWeight: 'bold', color : '#fff' },
                  ]}>
                  {`${item.caseType}`}{' '}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Date */}
          <View style = {{flexDirection: 'row', marginLeft: wp('5%'), marginBottom : 20}}>
            <Text
              style={[
                styles(theme).normalTxt,
                {flex: 1, fontSize : 13},
              ]}>{`發病日期 ${item.onSetDate}`}</Text>
            <Text style = {[styles(theme).normalTxt, {flex: 1, fontSize : 13},]}>
              {`確診日期 ${item.comfirmDate}`}{' '}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  var c = cases.length ? cases : [];
  c.sort((a, b) => (a.index < b.index ? 1 : b.index < a.index ? -1 : 0));


  function handleScroll(event) {
    props.setAnimation((event.nativeEvent.contentOffset.y > 50));
    props.setHidden()
  }

  return (
    <View style = {styles(theme).container}>
      <StatusBar
        barStyle        = {dark ? 'light-content' : 'dark-content'}
        backgroundColor = {theme.black}
      />
      <FlatList
        scrollEventThrottle={16} 
        onScroll={(e) => handleScroll(e)}
        data           = {c}
        keyExtractor   = {(item, index) => `item-${index}`}
        refreshControl = {
          <RefreshControl
            colors     = {[theme.primary]}
            tintColor  = {theme.primary}
            refreshing = {loading}
            onRefresh  = {() => {
              setLoading(true);
              getCase();
            }}
          />
        }
        refreshing = {loading}
        renderItem = {item => renderCase(item)}
        initialNumToRender = {25}
        updateCellsBatchingPeriod ={50}
      />
    </View>
  );
}
