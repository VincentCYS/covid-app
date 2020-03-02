import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
  Share,
  BackHandler
} from 'react-native';
import constants from '../../helpers/constants';
import styles from './news_detail_styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeContext, ThemeProvider } from '../../theme/theme-context.js'

export default function NewsDetail(props) {

  const { theme, toggle, dark } = React.useContext(ThemeContext)

  var {title, content, url, sourceUrl, source, published} = props.news || {};

  const regex   = /(<([^>]+)>)/gi;
  content = content.replace(regex, '');


  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  async function onShare () {
    try {
      const result = await Share.share({
        message:
        url,
      });
    } catch (error) {
      alert(error.message);
    }
  };
    
  return (
    <Modal          animationType = 'slide' visible = {props.showNews} onRequestClose = {() => props.setShowNews(false)}>
      <SafeAreaView     style         = {{backgroundColor: theme.black}}>
       
        <TouchableOpacity onPress       = {() => props.setShowNews(false)}>
          <Image
            source = {{uri: dark ? constants.icon.closeWhite : constants.icon.closeBlack}}
            style  = {styles(theme).closeIcon}
          />
        </TouchableOpacity>

        <ScrollView style = {styles(theme).container}>

          <View       style = {[styles(theme).section, {flexDirection : 'row', justifyContent : 'flex-start'}]}>
            <View style = {{flex :4}}>
              {/* source */}
              <TouchableOpacity
                      style   = {{flex: 1}}
                      onPress = {() => openSourceUrl(sourceUrl)}>
                <Text style   = {[styles(theme).whiteTxt, {fontSize: wp('4%')}]}>{source}</Text>
              </TouchableOpacity>
            {/* updated time */}
            <View style = {styles(theme).cardTime}>
            <Text style = {styles(theme).whiteTxt}>發佈時間: {published}</Text>
            </View>
          </View>
        
          <TouchableOpacity style = {{flex : 1, alignSelf : 'flex-end'}} onPress = {() => onShare()}>
            <Image
              source = {{uri: constants.icon.share}}
              style  = {[styles(theme).closeIcon]}
            />
          </TouchableOpacity>

            </View>
        

            <View style = {styles(theme).section}>
              {/* news title */}
              <Text style = {styles(theme).title}>{title}</Text>
            </View>

            <View style = {[styles(theme).section, {paddingBottom : hp('10%')}]}>
              {/* news content */}
              <Text
                style={[
                  styles(theme).whiteTxt,
                  {fontSize: wp('4%'), fontWeight: '500', lineHeight: wp('7%')},
                ]}>
                {content}
              </Text>
            </View>
            
        </ScrollView>

      </SafeAreaView>
    </Modal>
  );
}
