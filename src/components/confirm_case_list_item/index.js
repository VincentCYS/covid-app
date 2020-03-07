import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  Modal,
  Image,
} from 'react-native';

import styles from './confirm_case_list_item_styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext, ThemeProvider} from '../../theme/theme-context.js';
import constants from '../../helpers/constants';

export default function ConfirmCaseListItem(props) {
  const {theme, toggle, dark} = React.useContext(ThemeContext);

  var {
    item,
    index,
    relatedCases,
    source,
    updateDate,
    setModalData,
    scaleAnimation,
  } = props;

  function openSourceUrl() {
    Linking.openURL(source.url).catch(err => Alert.alert(err));
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

  return (
    <View>
      {index === 0 && source ? (
        <View             style   = {{marginTop: 20, marginBottom: 20, alignItems: 'flex-end'}}>
        <Text             style   = {styles(theme).dateTxt}>更新時間: {updateDate}</Text>
        <TouchableOpacity onPress = {() => openSourceUrl()}>
        <Text             style   = {styles(theme).dateTxt}>來源 : {source.name}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View
        key   = {`card-${index}`}
        style = {[styles(theme).card, {marginBottom: 20}]}>
        <View
          style={[
            styles(theme).card,
            {
              marginBottom  : 20,
              flexDirection : 'row',
              alignItems    : 'center',
              flex          : 1,
            },
          ]}>
          {/* title */}
          <Text
            style={[
              styles(theme).subtitle,
              {
                flex       : 1,
                alignSelf  : 'flex-start',
                color      : theme.primary,
                alignItems : 'stretch',
              },
            ]}>
            {`#${item.index} ${item.hkResidents}`}
          </Text>
          {relatedCases[item.index] ? (
            <TouchableOpacity
              onPress={() => {
                setModalData(relatedCases[item.index]);
                scaleAnimation(1.1, 1);
              }}>
              <Image
                source={{
                  uri : dark
                    ? constants.icon.infoWhite
                     :  constants.icon.infoBlack,
                }}
                style  = {styles(theme).infoIcon}
                width  = {wp('5%')}
                height = {wp('5%')}
              />
            </TouchableOpacity>
          ) : null}
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
                flex        : 4,
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
            <Text             style   = {styles(theme).normalTxt}>
                {`入住${item.hospital}`}{' '}
              </Text>
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
                  {fontSize: 13, fontWeight: 'bold', color: '#fff'},
                ]}>
                {`${item.status}`}
              </Text>
            </View>

            <View style = {[styles(theme).roundWrapper, {marginBottom: 10}]}>
              <Text
                adjustsFontSizeToFit
                style={[
                  styles(theme).normalTxt,
                  {fontSize: 12, fontWeight: 'bold', color: '#fff'},
                ]}>
                {`${item.caseType}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Date */}
        <View
          style={{
            flexDirection : 'row',
            marginLeft    : wp('5%'),
            marginBottom  : 20,
          }}>
          <Text
            style={[
              styles(theme).normalTxt,
              {flex: 1, fontSize: 13},
            ]}>{`發病日期 ${item.onSetDate}`}</Text>
          <Text style = {[styles(theme).normalTxt, {flex: 1, fontSize: 13}]}>
            {`確診日期 ${item.comfirmDate}`}{' '}
          </Text>
        </View>
      </View>
    </View>
  );
}
