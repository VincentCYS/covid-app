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
} from 'react-native';
import {Card, CardItem} from 'native-base';
import constants from '../../helpers/constants';
import API from '../../helpers/api';
import styles from './confirm_case_style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function ConfirmCase(props) {
  const [loading, setLoading]       = useState(true);
  const [updateDate, setUpdateDate] = useState('');
  const [cases, setCases]           = useState({});

  useEffect(() => {
    setTimeout(() => getCase(), 5000);
  }, [cases]);

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
        setUpdateDate(prev => (published ? published : prev));
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Failed to fetch error: ' + err.messages);
      });
  }

  function openMap(location) {
    Platform.OS === 'ios'
      ? Linking.openURL(`http://maps.apple.com/maps?address=${location}`)
       :  Linking.openURL(`http://maps.google.com/maps?address=${location}`);
  }

  function renderCase({item, index}) {
    return (
      <View>
        {index === 0 ? (
          <View>
            <Text style = {styles.title}>香港武漢肺炎案例</Text>
            <Text style = {styles.dateTxt}>更新時間: {updateDate}</Text>
          </View>
        ) : null}
        <Card
                key   = {`card-${index}`}
                style = {[styles.card, {marginTop: wp('2%'), marginBottom: wp('3%')}]}>
          <View style = {[styles.card, {marginTop: 5}]}>
            <CardItem
              style = {[styles.card, {flex: 4, alignItems: 'flex-start'}]}>
              <Text
                style={[
                  styles.subtitle,
                  {alignSelf: 'flex-start', color: constants.colors.primary},
                ]}>
                {`#${item.index} ${item.hkResidents}`}{' '}
              </Text>
            </CardItem>
          </View>

          <CardItem style = {styles.card}>
            <View
              style={[
                styles.card,
                {flex: 4, flexDirection: 'column', alignItems: 'flex-start'},
              ]}>
              <Text
                style={[
                  styles.subtitle,
                  {alignSelf: 'flex-start', marginBottom: 10},
                ]}>
                {`${item.age}歲 ${item.gender}`}{' '}
              </Text>
              <TouchableOpacity onPress = {() => openMap(v.hospital)}>
              <Text             style   = {styles.normalTxt}>{`入住${item.hospital}`} </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.card,
                {flex: 4, flexDirection: 'column', alignItems: 'flex-start'},
              ]}>
              <View style = {[styles.roundWrapper, {marginBottom: 10}]}>
                <Text
                  style={[
                    styles.normalTxt,
                    {fontSize: 13, fontWeight: 'bold'},
                  ]}>
                  {`${item.status}`}{' '}
                </Text>
              </View>
              <View style = {styles.roundWrapper}>
                <Text
                  style={[
                    styles.normalTxt,
                    {fontSize: 13, fontWeight: 'bold'},
                  ]}>
                  {`${item.caseType}`}{' '}
                </Text>
              </View>
            </View>
          </CardItem>
          <View
            style={[
              styles.card,
              {flex: 1, flexDirection: 'row', alignItems: 'flex-start'},
            ]}>
            <CardItem
              style={[
                styles.card,
                {flex: 1, flexDirection: 'row', alignItems: 'flex-start'},
              ]}>
              <Text
                style = {styles.normalTxt}>{`發病日期 ${item.onSetDate}`}</Text>
            </CardItem>
            <CardItem
              style={[
                styles.card,
                {flex: 1, flexDirection: 'row', alignItems: 'flex-start'},
              ]}>
              <Text style = {styles.normalTxt}>
                {`確診日期 ${item.comfirmDate}`}{' '}
              </Text>
            </CardItem>
          </View>
        </Card>
      </View>
    );
  }

  var c = cases.length ? cases : [];
  c.sort((a, b) => (a.index < b.index ? 1 : b.index < a.index ? -1 : 0));

  return (
    <SafeAreaView style    = {styles.wrapper}>
    <StatusBar    barStyle = {'light-content'} />
      <FlatList
        data           = {c}
        refreshControl = {
          <RefreshControl
            colors     = {[constants.colors.primary]}
            tintColor  = {constants.colors.primary}
            refreshing = {loading}
            onRefresh  = {() => {
              setLoading(true);
              getCase();
            }}
          />
        }
        refreshing         = {loading}
        renderItem         = {item => renderCase(item)}
        initialNumToRender = {10}
      />
    </SafeAreaView>
  );
}
