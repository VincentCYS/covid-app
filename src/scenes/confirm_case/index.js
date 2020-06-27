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
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import {Card, CardItem} from 'native-base';
import constants from '../../helpers/constants';
import API from '../../helpers/api';
import styles from './confirm_case_style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext, ThemeProvider} from '../../theme/theme-context.js';
// import ContentLoader, { Rect } from 'react-content-loader/native'

import ConfirmCaseListItem from '../../components/confirm_case_list_item';

export default function ConfirmCase(props) {
  const [loading, setLoading]               = useState(true);
  const [updateDate, setUpdateDate]         = useState('');
  const [source, setSource]                 = useState('');
  const [cases, setCases]                   = useState([]);
  const [relatedCases, setRelatedCases]     = useState({});
  const {theme, toggle, dark}               = React.useContext(ThemeContext);
  const [modalData, setModalData]           = useState([]);
  const [animationValue, setAnimationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchAllData();
  }, []);

  // const Loader = () => (
  //   <ContentLoader viewBox="0 0 400 400" animate = {true} backgroundColor = {theme.darkGrey} style = {{
  //             position       : 'absolute',
  //             left           : '5%',
  //             right          : '5%',
  //             top            : 0,
  //             bottom         : 0,
  //           }}>
  //     <Rect x="0" y="50" rx="4" ry="4" width="200" height="10" />
  //     <Rect x="0" y="70" rx="4" ry="4" width="200" height="10" />

  //     <Rect x="0" y="110" rx="4" ry="4" width="120" height="10" />
  //     <Rect x="0" y="130" rx="4" ry="4" width="120" height="10" />
  //     <Rect x="0" y="150" rx="4" ry="4" width="120" height="10" />

  //     <Rect x="0" y="220" rx="4" ry="4" width="200" height="10" />
  //     <Rect x="0" y="240" rx="4" ry="4" width="200" height="10" />

  //     <Rect x="210" y="110" rx="4" ry="4" width="120" height="10" />
  //     <Rect x="210" y="130" rx="4" ry="4" width="120" height="10" />
  //     <Rect x="210" y="150" rx="4" ry="4" width="120" height="10" />

  //     <Rect x="210" y="220" rx="4" ry="4" width="200" height="10" />
  //     <Rect x="210" y="240" rx="4" ry="4" width="200" height="10" />
  
  //   </ContentLoader>
  // )
  

  function fetchAllData() {
    getData('case');
    getData('building');
  }

  function getData(name) {
    API.get(`/${name}`, {})
      .then(res => {
        name == 'case' ? parseDataCase(res) : parseDataBuilding(res);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('連接伺服器失敗' + err);
      });
  }

  function parseDataCase(res) {
    var published = new Date(res.lastUpdate);
    published.setHours(published.getHours() + 8);
    published = published.toISOString().split('T').join(' ').split(':');
    published.pop();
    published = published.join(':');
    setCases(res.data);
    setSource({name: res.source, url: res.sourceURL});
    setUpdateDate(published);
  }

  function parseDataBuilding(res) {
    var d = {};
    res.data.map(v => {
      var relatedCases = [];
          relatedCases = v.relatedCase.replace(/[^\x00-\x7F]/g, '').split(',');

      relatedCases.map(r => {
        d[r] ? d[r].push(v) : Object.assign(d, {[r] : [v],})
      });
    });
    setRelatedCases(d);
  }

  function handleScroll(event) {
    props.setAnimation(event.nativeEvent.contentOffset.y > 50);
    props.setHidden();
  }

  function scaleAnimation(from, to) {
    Animated.timing(animationValue, {
      toValue  : from,
      duration : 100,
    }).start(() =>
      Animated.timing(animationValue, {
        toValue  : to,
        duration : 200,
      }).start(),
    );
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
      <StatusBar
        barStyle        = {dark ? 'light-content' : 'dark-content'}
        backgroundColor = {theme.black}
      />

      <Modal
        visible             = {modalData.length > 0}
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
          onTouchEndCapture={() => {
            setModalData([]);
          }}>
          <View
            style={{
              backgroundColor :  dark ? '#fff' : 'grey',
              padding         : '5%',
              marginLeft      : wp('5%'),
              marginRight     : wp('5%'),
              borderRadius    : 20,
            }}>
            <Text
              style={{
                color        : dark ? theme.primary : '#fff',
                fontWeight   : 'bold',
                fontSize     : 15,
                marginBottom : 5,
              }}>
              {`曾出現地區`}
            </Text>
            {modalData.map(v => {
              return <Text style = {{color: theme.black}}>{`${v.building}   ${v.lastDate}`}</Text>;
            })}
          </View>
        </Animated.View>
      </Modal>
  {
   // !loading ? 
      <FlatList
        scrollEventThrottle = {16}
        onScroll            = {e => handleScroll(e)}
        data                = {cases.sort((a, b) =>
          a.index < b.index ? 1 : b.index < a.index ? -1 : 0,
        )}
        keyExtractor   = {(item, index) => `item-${index}`}
        refreshControl = {
          <RefreshControl
            colors     = {[theme.primary]}
            tintColor  = {theme.primary}
            refreshing = {loading}
            onRefresh  = {() => {
              setLoading(true);
              fetchAllData();
            }}
          />
        }
        refreshing = {loading}
        renderItem = {item => (
          <ConfirmCaseListItem
            item           = {item.item}
            index          = {item.index}
            relatedCases   = {relatedCases}
            source         = {source}
            updateDate     = {updateDate}
            scaleAnimation = {scaleAnimation}
            setModalData   = {setModalData}
          />
        )}
        initialNumToRender        = {25}
        updateCellsBatchingPeriod = {50}
      /> //: Loader()
  }
    </View>
  );
}
