import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  StatusBar,
  Share,
  Image,
  Platform,
  Animated,
} from 'react-native';
import constants from '../../helpers/constants';
import styles from './about_us_styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {ThemeContext} from '../../theme/theme-context.js';

export default function AboutUs(props) {
  const [loading, setLoading] = useState(false);
  const {theme, toggle, dark} = React.useContext(ThemeContext);

  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color = {theme.primary}
        size  = "small"
        style = {{
          position        : 'absolute',
          backgroundColor : theme.black,
          left            : 0,
          right           : 0,
          top             : 0,
          bottom          : 0,
          alignItems      : 'center',
          justifyContent  : 'center',
        }}
      />
    );
  }

  async function onShare() {
    try {
      const result = await Share.share({
        message : 
          Platform.OS == 'android'
            ? 'https://play.google.com/store/apps/details?id=com.ncov'
             :  '',
      });
    } catch (error) {
      alert(error.message);
    }
  }

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  function handleScroll(event) {
    props.setAnimation((event.nativeEvent.contentOffset.y > 50));
    props.setHidden()
  }

  return !loading ? (
    <Animated.ScrollView
      scrollEventThrottle={16} 
      onScroll={(e) => handleScroll(e)}
      style = {styles(theme).container}>
      <StatusBar
        barStyle        = {dark ? 'light-content' : 'dark-content'}
        backgroundColor = {theme.black}
      />

      <TouchableOpacity
        style   = {{alignSelf: 'flex-end'}}
        onPress = {() => onShare()}>
        <Image
          source = {{uri: constants.icon.share}}
          style  = {[styles(theme).shareIcon]}
        />
      </TouchableOpacity>

      <Text style = {styles(theme).title}>關於我們</Text>

      <View style = {styles(theme).section}>
        <Text style = {styles(theme).normalTxt}>
          這個網站沒有《關於我們》，因為這是一位 Developer
          在工餘的時間花一個周末去建成的。 事源於有人要找政府所謂的 Open Data
          去研究「武漢肺炎」的資訊時，發現香港政府只提供 .CSV / PDF 資料。{'\n'}
        </Text>

        <Text style = {styles(theme).normalTxt}>
          如果被外國的 Programmer 知道，這肯定是 2020 年的國際級的笑話。 感謝有
          Data Scientist 公開 api.n-cov.info 這個API{'\n'}
        </Text>

        <Text style = {styles(theme).normalTxt}>
          另外，這個網站 oneshop.cloud 承擔流量的，感謝公司提供的支持。
        </Text>
      </View>

      <View style = {[styles(theme).section, {flexDirection: 'row'}]}>
        <View style = {{flex: 1}}>
          <Text style = {[styles(theme).normalTxt, {fontWeight: 'bold'}]}>
            如果你對 coding 有興趣。
          </Text>
        </View>

        <TouchableOpacity
          style   = {styles(theme).button}
          onPress = {() =>
            openSourceUrl(
              'https://oneshop.academy/courses/6ef2c7d1d434b898fc74412b636387ecc7d44c40',
            )
          }>
          <Text style = {[styles(theme).normalTxt, {color: 'white'}]}>
            關於更多
          </Text>
        </TouchableOpacity>
      </View>

      <View style = {[styles(theme).section, {flexDirection: 'row'}]}>
        <View style = {{flex: 1}}>
          <Text style = {[styles(theme).normalTxt, {fontWeight: 'bold'}]}>
            口罩緊張，切密亂買。
            市面上口罩供應仍然短缺，建議大家不要亂買。如果想知道多少個是安全範圍。
          </Text>
        </View>


        <TouchableOpacity
          style   = {styles(theme).button}
          onPress = {() => openSourceUrl('https://wars-mask.surge.sh/')}>
          <Text style   = {[styles(theme).normalTxt, {color: 'white'}]}>
            口罩需求計算器
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles(theme).section,
          {
            alignItems     : 'center',
            justifyContent : 'center',
            marginTop      : hp('5%'),
          }
          ]}>


        <TouchableOpacity
          style   = {[styles(theme).button, {backgroundColor: 'grey', marginBottom : 100}]}
          onPress = {() =>
            openSourceUrl('https://www.facebook.com/oneshop.cloud/')
          }>

          <Text style = {[styles(theme).normalTxt, {color: 'white'}]}>
            提供意見
          </Text>

        </TouchableOpacity>

      </View>
    </Animated.ScrollView>
  ) : (
    activityIndicatorLoadingView()
  );
}
