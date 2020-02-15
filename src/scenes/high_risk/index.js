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
} from 'react-native';
import {Header, Input, Item, Accordion} from 'native-base';
import constants from '../../helpers/constants';
import API from '../../helpers/api';
import styles from './high_risk_styles';

export default function HighRisk(props) {
  const [loading, setLoading]       = useState(true);
  const [districts, setDistricts]   = useState([]);
  const [keywords, setKeywords]     = useState([]);
  const [updateDate, setUpdateDate] = useState('');

  useEffect(() => {
    setTimeout(() => getBuilding(), 5000);
  }, [districts]);

  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color = {constants.colors.primary}
        size  = "small"
        style = {{
          position        : 'absolute',
          left            : 0,
          right           : 0,
          top             : 0,
          bottom          : 0,
          alignItems      : 'center',
          justifyContent  : 'center',
          backgroundColor : constants.colors.black,
        }}
      />
    );
  }

  function getBuilding() {
    API.get(`/building`, {})
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
        var d    = Object.keys(
          data
            .map(d => d.district)
            .reduce((o, n) => Object.assign(o, {[n]: ''}), {}),
        );

        var array = [];
        d.map(v => {
          array.push({title: v, content: ''});
        });

        data.map((v, i) => {
          array[d.indexOf(v.district)].content += 
          array[d.indexOf(v.district)].content.length === 0
              ? `${v.building}`
               :  `\n${v.building}`;
        });

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
      ? Linking.openURL(`http://maps.apple.com/maps?address=${location}`)
       :  Linking.openURL(`http://maps.google.com/maps?address=${location}`);
  }

  function renderHeader(item, isExpanded) {
    return (
      <View style = {styles.itemHeader}>
      <Text style = {styles.timeTxt}>{item.title}</Text>
      </View>
    );
  }

  function renderContent(item) {
    var buildings = item.content.split('\n');
        buildings = buildings.filter(b => b.includes(keywords));
    return buildings.length ? (
      <View style = {styles.itemContent} key = {`item-${item.content}`}>
        {buildings.map((c, i) => (
          <TouchableOpacity
                  key     = {`detail-${i}`}
                  style   = {[styles.itemContent, {marginLeft: 0, padding: 5}]}
                  onPress = {() => openMap(c)}>
            <Text style   = {styles.timeTxt}>{`-  ${c}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ) : null;
  }

  return (
    // <SafeAreaView>
    !loading ? (
      <ScrollView
        style          = {styles.container}
        refreshing     = {loading}
        refreshControl = {
          <RefreshControl
            colors     = {[constants.colors.primary]}
            refreshing = {loading}
            onRefresh  = {() => {
              setLoading(true);
              getBuilding();
            }}
          />
        }>
        <Text style = {styles.title}>家居檢疫大廈一覽</Text>
        <Text
          style={[
            styles.timeTxt,
            {alignSelf: 'flex-end', fontSize: 14, marginTop: 30},
          ]}>
          更新時間 : {updateDate}
        </Text>

        <Header searchBar rounded style = {styles.searchBar}>
          <Item>
            <Input
              style       = {styles.input}
              placeholder = "搜尋..."
              key
              onChangeText = {k => setKeywords(k)}
            />
          </Item>
        </Header>
        {
          <Accordion
            dataArray={districts.filter(
              d => d.title.includes(keywords) || d.content.includes(keywords),
            )}
            style         = {{marginTop: 20, marginBottom: 20,  height: '80%'}}
            animation     = {true}
            renderHeader  = {renderHeader}
            renderContent = {renderContent}
          />
        }
      </ScrollView>
    ) : (
      activityIndicatorLoadingView()
    )
  );
}
