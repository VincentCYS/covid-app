import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import constants from '../../helpers/constants';
import styles from './about_us_styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function AboutUs(props) {
  const [loading, setLoading] = useState(false);

  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color = {constants.colors.primary}
        size  = "small"
        style = {{
          position        : 'absolute',
          backgroundColor : constants.colors.black,
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

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }
  return !loading ? (
    <ScrollView style = {styles.container}>
    <Text       style = {styles.title}>關於我們</Text>

      <View style = {styles.section}>
      <Text style = {styles.normalTxt}>
          這個網站沒有《關於我們》，因為這是一位 Developer
          在工餘的時間花一個周末去建成的。 事源於有人要找政府所謂的 Open Data
          去研究「武漢肺炎」的資訊時，發現香港政府只提供 .CSV / PDF 資料。{'\n'}
        </Text>
        <Text style = {styles.normalTxt}>
          如果被外國的 Programmer 知道，這肯定是 2020 年的國際級的笑話。 感謝有
          Data Scientist 公開 api.n-cov.info 這個API{'\n'}
        </Text>
        <Text style = {styles.normalTxt}>
          另外，這個網站 oneshop.cloud 承擔流量的，感謝公司提供的支持。
        </Text>
      </View>

      <View style = {[styles.section, {flexDirection: 'row'}]}>
      <View style = {{flex: 1}}>
      <Text style = {[styles.normalTxt, {fontWeight: 'bold'}]}>
            如果你對 coding 有興趣。
          </Text>
        </View>
        <TouchableOpacity
          style   = {styles.button}
          onPress = {() =>
            openSourceUrl(
              'https://oneshop.academy/courses/6ef2c7d1d434b898fc74412b636387ecc7d44c40',
            )
          }>
          <Text style = {styles.normalTxt}>關於更多</Text>
        </TouchableOpacity>
      </View>

      <View style = {[styles.section, {flexDirection: 'row'}]}>
      <View style = {{flex: 1}}>
      <Text style = {[styles.normalTxt, {fontWeight: 'bold'}]}>
            口罩緊張，切密亂買。
            市面上口罩供應仍然短缺，建議大家不要亂買。如果想知道多少個是安全範圍。
          </Text>
        </View>

        <TouchableOpacity
                style   = {styles.button}
                onPress = {() => openSourceUrl('https://wars-mask.surge.sh/')}>
          <Text style   = {styles.normalTxt}>口罩需求計算器</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.section,
          {
            alignItems     : 'center',
            justifyContent : 'center',
            marginTop      : hp('5%'),
          },
        ]}>
        <TouchableOpacity
                style   = {[styles.button, {backgroundColor: '#403f3e'}]}
                onPress = {() => openSourceUrl('https://www.facebook.com/oneshop.cloud/')}>
          <Text style   = {styles.normalTxt}>提供意見</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ) : (
    activityIndicatorLoadingView()
  );
}
