import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Header, Input, Item, Accordion} from 'native-base';
import constants from '../../helpers/constants';
import API from '../../helpers/api';
import styles from './high_risk_styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function HighRisk(props) {
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [updateDate, setUpdateDate] = useState('');
  const [source, setSource] = useState('');
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    setLoading(true);
    getData(activePage);
  }, [updateDate, activePage, showMap]);

  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color={constants.colors.primary}
        size="small"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: constants.colors.black,
        }}
      />
    );
  }

  function getData(name) {
    API.get(`/${name}`, {})
      .then(res => {
        setLoading(false);

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

        var data = res.data;
        var d = Object.keys(
          data
            .map(d => d.district)
            .reduce((o, n) => Object.assign(o, {[n]: ''}), {}),
        );

        var array = [];
        d.map(v => {
          array.push({title: v, content: []});
        });

        data.map((v, i) => {
          array[d.indexOf(v.district)].content.push(v);
        });

        array.map((v, i) => {
          v.content = JSON.stringify(v.content);
        });

        setSource({name: res.source, url: res.sourceURL});
        setBuildings(res.data)
        setDistricts(array);
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

  function openMap(location) {
    Platform.OS === 'ios'
      ? Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${location}`,
        )
      : Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${location}`,
        );
  }

  function renderHeader(item, isExpanded) {
    var buildings = JSON.parse(item.content);
    buildings = buildings.filter(
      b => item.title.includes(keywords) || b.building.includes(keywords),
    );
    return buildings.length ? (
      <View style={styles.itemHeader} key={`item-${item.title}`}>
        <Text style={styles.timeTxt}>{item.title}</Text>
      </View>
    ) : null;
  }

  function renderContent(item) {
    var buildings = JSON.parse(item.content);
    buildings = buildings.filter(
      b => item.title.includes(keywords) || b.building.includes(keywords),
    );
    return buildings.length ? (
      <View style={styles.itemContent} key={`item-${item.content}`}>
        {buildings.map((c, i) => (
          <TouchableOpacity
            key={`detail-${i}`}
            style={[styles.itemContent, {marginLeft: 0, padding: 5}]}
            onPress={() => openMap(c.building)}>
            <Text style={styles.timeTxt}>{`-  ${c.building}`}</Text>
            <Text style={[styles.timeTxt, {fontSize: 12, marginTop: 5}]}>
              {` ${
                activePage == 'building'
                  ? '       最後檢疫日期: '
                  : '       最後出現日期: '
              } ${c.lastDate || c.lastDayofHomeConfinees}`}
            </Text>
            {activePage == 'building' ? (
              <Text style={[styles.timeTxt, {fontSize: 12, marginTop: 5}]}>
                {`       相關案例:  ${c.relatedCase}`}
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    ) : null;
  }

  function renderTabs() {
    return (
      <View style={styles.infectedTxtGp}>
        <TouchableOpacity
          bordered
          style={{
            borderColor:
              activePage == 'building' ? constants.colors.primary : '#fff',
            marginRight: 5,
          }}
          onPress={() => setActivePage('building')}>
          <Text
            style={[
              styles.infectedBtnTxt,
              {
                color:
                  activePage == 'building' ? constants.colors.primary : '#fff',
              },
            ]}>
            家居檢疫大廈
          </Text>
        </TouchableOpacity>

        <View style={{width: 1, height: 20, backgroundColor: '#fff'}} />

        <TouchableOpacity
          bordered
          style={{
            borderColor:
              activePage == 'home' ? constants.colors.primary : '#fff',
            marginLeft: 5,
          }}
          onPress={() => setActivePage('home')}>
          <Text
            style={[
              styles.infectedBtnTxt,
              {
                color: activePage == 'home' ? constants.colors.primary : '#fff',
              },
            ]}>
            患者曾出現地區
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderSearchBar() {
    return (
      <Header searchBar rounded style={styles.searchBar}>
        <Item>
          <Input
            style={styles.input}
            placeholder="搜尋..."
            key
            onChangeText={k => setKeywords(k)}
          />
        </Item>
      </Header>
    );
  }

  return !loading ? (
    <ScrollView
      style={styles.container}
      refreshing={loading}
      refreshControl={
        <RefreshControl
          colors={[constants.colors.primary]}
          refreshing={loading}
          tintColor={[constants.colors.primary]}
          onRefresh={() => {
            setLoading(true);
            getData(activePage);
          }}
        />
      }>
      {/* <TouchableOpacity style = {{flex : 1, alignItems : 'flex-end'}} onPress = {() => setShowMap(!showMap)}>
        <Image style = {styles.mapIcon} source = {!showMap ? require('../../assets/map-icon.png') : require('../../assets/bulleted-list.png')}/>
      </TouchableOpacity> */}
      {renderTabs()}

      <Text
        style={[
          styles.timeTxt,
          {alignSelf: 'flex-end', fontSize: 14, marginTop: 50},
        ]}>
        更新時間 : {updateDate}
      </Text>
      <TouchableOpacity onPress={() => openSourceUrl(source.url)}>
        <Text
          style={[
            styles.timeTxt,
            {
              alignSelf: 'flex-end',
              fontSize: 14,
              marginTop: 10,
              marginBottom: 10,
            },
          ]}>
          來源: {source.name}
        </Text>
      </TouchableOpacity>


    {
      showMap ? <MapView
          initialRegion={{
            latitude: 22.3524813,
            longitude: 113.846819,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            
          }}
          style={{width : wp('100%'), height : hp('50%')}}/>
        
       : 
      <View>
        {renderSearchBar()}
      
        <Accordion
          dataArray={districts.filter(d => {
            var content = JSON.parse(d.content);
            return d.title.includes(keywords) ||
              content.filter(v => v.building.includes(keywords))
              ? d
              : null;
          })}
          style={{marginTop: 20, marginBottom: 100, height: '80%'}}
          animation={true}
          renderHeader={renderHeader}
          renderContent={renderContent}
          key = {'k'}
        />
      </View>
    }

     
    </ScrollView>
  ) : (
    activityIndicatorLoadingView()
  );
}
