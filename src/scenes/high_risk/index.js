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
  StatusBar,
  Animated
} from 'react-native';
import {Header, Input, Badge, Accordion} from 'native-base';
import API from '../../helpers/api';
import styles from './high_risk_styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ThemeContext, ThemeProvider } from '../../theme/theme-context.js'
// import { List } from 'react-content-loader/native'

export default function HighRisk(props) {
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [updateDate, setUpdateDate] = useState('');
  const [source, setSource] = useState('');
  const [activePage, setActivePage] = useState('building');
  const { theme, toggle, dark } = React.useContext(ThemeContext)

  var _scrollView = null;

  useEffect(() => {
    setLoading(true);
    getData(activePage);
  }, [activePage]);

  // const Loader = () => (
  //   <View>
  //     <List backgroundColor = {theme.darkGrey} style = {{ margin : 20 }}/>
  //     <List backgroundColor = {theme.darkGrey} style = {{ margin : 20 }}/>
  //   </View>
  // )

  function getData(name) {
    setDistricts([]);
    setBuildings({});

    name = activePage == 'transport' 
    ? 'https://api.data.gov.hk/v1/filter?q=%7B%22resource%22%3A%22http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Fflights_trains_list_chi.csv%22%2C%22section%22%3A1%2C%22format%22%3A%22json%22%7D'
    : name;


    if (activePage == 'transport' ) {
      var body = new FormData();
      // append data
      body.append("Content-Type", "multipart/form-data");
      body.append("Accept", "application/json");
  
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = 4000;
      xhr.open(
        "GET",
        name
      );
  
      xhr.ontimeout = function () {
        setLoading(false)
      }

      xhr.onerror = function(error) {
        setLoading(false)
        Alert.alert(error);
      };
  
      xhr.onload = function(e) {
        let res = xhr.response;

     var d =  Object.keys(res.rows.map(r => r[0]).reduce((o, n) => 
       Object.assign(o, {[n]: ''}), {}
      ));

      
      var array = [];

      d.map((v, i) => {
        var title = v; 
        array.push({title: title, content: {
            buildings : [],
            index: i
          } 
        });
      });

      res.rows.map((v, i) => {        
        var title = d.indexOf(v[0])

        array[title].content.buildings.push({
          building: v[1],
          lastDate : v[2],
          relatedCase : v[3]
        });
      });

      array.map((v, i) => {
        v.content = JSON.stringify(v.content);
      });

      var data = []

      res.rows.map((v, i) => {
        data.push({
          district : v[1],
          building:   v[2].split('\n')[0],
          lastDate : v[3]
        });
      });      

      setBuildings(data)
      setDistricts(array);
      setLoading(false)
      };

      xhr.send(body);
 
    } else {

      API.get(`/${name}`, {})
        .then(res => {
          setLoading(false);        

          if (res.lastUpdate) {            
            var published = new Date(res.lastUpdate);
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
          d.map((v, i) => {
            array.push({title: v.split(' ')[0], content: {
              buildings : [
              ],
              index: i
            } 
          });
          });

          data.map((v, i) => {       
            v.building = v.building.split('\n')[0]
            array[d.indexOf(v.district)].content.buildings.push(v);
          });

          array.map((v, i) => {
            v.content = JSON.stringify(v.content);
          });

          setSource({name: res.source, url: res.sourceURL});
          setBuildings(res.data);          

          setDistricts(array);
          setUpdateDate(prev => (published ? published : prev));
        })
        .catch(err => {
          setLoading(false);          
          Alert.alert('Failed to fetch error: ' + err);
        });
    }
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
    var content = JSON.parse(item.content);

    var buildings = content.buildings;

    buildings = buildings.filter(
      b => item.title.includes(keywords) || b.building.includes(keywords),
    );
    return buildings.length ? (
      <View style={styles(theme).itemHeader} key={`item-${item.title}`}>
        <Badge style = {{ alignItems : 'center', justifyContent : 'center', backgroundColor : theme.primary}}>
            <Text style = {{color : 'white'}}>{buildings.length}</Text>
          </Badge>
          <Text style={[styles(theme).timeTxt, {marginLeft : 10}]}>{item.title}</Text>

      </View>
    ) : null;
  }

  function renderContent(item) {
    var buildings = JSON.parse(item.content).buildings;    
    buildings = buildings.filter(
      b => item.title.includes(keywords) || b.building.includes(keywords),
    );
    
    return buildings.length ? (
      <View style={styles(theme).itemContent} key={`item-${item.content}`}>
        {buildings.map((c, i) => (
          <TouchableOpacity
            key={`detail-${i}`}
            style={[styles(theme).itemContent, {marginLeft: 0, padding: 10}]}
            onPress={() => openMap(c.building)}>
            <Text style={[styles(theme).timeTxt]}>{`-  ${c.building}`}</Text>
            <Text style={[styles(theme).timeTxt, {fontSize: 12, marginTop: 5}]}>
              {` ${
                activePage == 'home'
                  ? '       最後檢疫日期: '
                  : activePage == 'transport'
                  ? '       乘搭日期: '
                  : '       最後出現日期: '
              } ${c.lastDate || c.lastDayofHomeConfinees}`}
            </Text>
            {activePage == 'building' || activePage == 'transport' ? (
              <Text style={[styles(theme).timeTxt, {fontSize: 12, marginTop: 5}]}>
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
      <View style={styles(theme).infectedTxtGp}>
        <TouchableOpacity
          bordered
          style={{
            borderColor:
              activePage == 'building' ? theme.primary : theme.fontWhite,
            marginRight: 5,
          }}
          onPress={() => setActivePage('building')}>
          <Text
            style={[
              styles(theme).infectedBtnTxt,
              {
                color:
                  activePage == 'building' ? theme.primary : theme.fontWhite,
              },
            ]}>
            患者曾出現地區
          </Text>
        </TouchableOpacity>

        <View style={{width: 1, height: 20, backgroundColor: theme.fontWhite,}} />

        <TouchableOpacity
          bordered
          style={{
            borderColor:
              activePage == 'home' ? theme.primary : theme.fontWhite,
            marginLeft  : 5,
            marginRight : 5
          }}
          onPress={() => setActivePage('home')}>
          <Text
            style={[
              styles(theme).infectedBtnTxt,
              {
                color: activePage == 'home' ? theme.primary : theme.fontWhite,
              },
            ]}>
            家居檢疫大廈
          </Text>
        </TouchableOpacity>

        <View style={{width: 1, height: 20, backgroundColor: theme.fontWhite}} />

        <TouchableOpacity
          bordered
          style={{
            borderColor:
              activePage == 'transport' ? theme.primary : theme.fontWhite,
              marginLeft: 5,
            }}
          onPress={() => setActivePage('transport')}>
          <Text
            style={[
              styles(theme).infectedBtnTxt,
              {
                color:
                  activePage == 'transport' ? theme.primary : theme.fontWhite,
              },
            ]}>
            航班/火車/船編號
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderSearchBar() {
    return (
      <View style = {{height : 40, marginTop : 20, marginBottom : 20, backgroundColor : theme.black}}>
          <Input
            style={styles(theme).input}
            placeholder="搜尋..."
            key
            onChangeText={k => setKeywords(k)}
            placeholderTextColor  = {dark ? 'grey' : 'white'}
            backgroundColor  = {dark ? 'white' : 'grey'}
          />
      </View>
    );
  }

  function handleScroll(event) {
    props.setAnimation((event.nativeEvent.contentOffset.y > 70));
    props.setHidden()
  }


  function scrollToRow(item) {
    var index = JSON.parse(item.content).index;
    _scrollView.scrollTo({y:index * 70});
  }

  return (
    <ScrollView
      ref={view => _scrollView = view}
      scrollEventThrottle={16} 
      onScroll={(e) => handleScroll(e)}

      style={styles(theme).container}
      refreshing={loading}
      refreshControl={
        <RefreshControl
          colors={[theme.primary]}
          refreshing={loading}
          tintColor={[theme.primary]}
          onRefresh={() => {
            setLoading(true);
            getData(activePage);
          }}
        />}
      >
      <StatusBar    barStyle = {dark ? 'light-content' : 'dark-content'} backgroundColor = {theme.black}/>
      <View style = {{alignItems : 'flex-end', marginTop : 10, marginBottom : 20}}>
        <Text
          style={
            [styles(theme).timeTxt, { fontSize : 10 }]
          }>
          更新時間 : {updateDate}
        </Text>
        <TouchableOpacity onPress={() => openSourceUrl(source.url)}>
          <Text
            style={
              [styles(theme).timeTxt, { fontSize : 10 }]
            }>
            來源: {source.name}
          </Text>
        </TouchableOpacity>
      </View>
      {renderTabs()}

    {
  
      <View>
        {renderSearchBar()}
      
       { 
       //!loading ? 
       <Accordion
          dataArray={districts.filter(d => {
            var content = JSON.parse(d.content);            
            return d.title.includes(keywords) ||
              content.buildings.filter(v => v.building.includes(keywords))
              ? d
              : null;
          }).sort((a, b) => (JSON.parse(a.content).buildings.length < JSON.parse(b.content).buildings.length ? 1 : JSON.parse(a.content).buildings.length > JSON.parse(b.content).buildings.length ? -1 : 0))}
          onAccordionOpen = {(item) => scrollToRow(item)}
          style={{marginBottom: hp('50%')}}
          animation={true}
          renderHeader={renderHeader}
          renderContent={renderContent}
          key = {'k'}
        /> //: Loader()
      }
      </View>
    }
    </ScrollView>
  );
}
