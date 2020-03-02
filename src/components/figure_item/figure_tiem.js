import React, {useState} from 'react';
import {Text, View, Image} from 'react-native';
import {Card} from 'native-base';
import styles from './figure_item_styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext, ThemeProvider} from '../../theme/theme-context';

export default function FigureItem(props) {
  const {theme, toggle, dark} = React.useContext(ThemeContext);

  
  var figure     = props.figure || [];
  var prevFigure = figure[figure.length - 2] || {};
      figure     = figure[figure.length - 1] || {};



  function renderInfectedItem(title, fig, diff, index, isReverse = false) {
    return (
      <Card style                      = {[styles(theme).infectedCard, { marginRight : 5, marginLeft : 5, width : '50%'}]} key = {`item-${index}`}>
      <Text adjustsFontSizeToFit style = {[styles(theme).subtitle, {flex: 1,}]}>
          {title}
        </Text>

        <View style = {styles(theme).infectedTxtGp}>
        <View style = {{flex: 3}}>
            <Text
              adjustsFontSizeToFit
              style = {[styles(theme).subtitle, {textAlign: 'center', marginTop: 0, width : '100%'}]}>
              {fig || '-'}
            </Text>
          </View>
          {diff && diff != 0 ? (
            <View style = {styles(theme).diffWrapper}>
              {diff > 0 ? (
                !isReverse ? 
                <Image
                  style  = {styles(theme).diffImage}
                  source = {require('../../assets/green-up.png')}
                /> : <Image
                style  = {styles(theme).diffImage}
                source = {require('../../assets/red-up.png')}
              />
              ) : null}

              <Text
                adjustsFontSizeToFit
                style = {[styles(theme).subtitle, {fontSize: diff % 100 != diff ? wp('2.3%') : wp('3%'), marginTop: 0, textAlign : 'center', alignSelf: 'stretch'}]}>
                {Math.abs(diff) || '-'}
              </Text>

              {diff < 0 ? (
                !isReverse ? 
                <Image
                  style  = {styles(theme).diffImage}
                  source = {require('../../assets/red-down.png')}
                /> : <Image
                style  = {styles(theme).diffImage}
                source = {require('../../assets/green-down.png')}
              /> 
              ) : null}
            </View>
          ) : null}
        </View>
      </Card>
    );
  }


  return (
    <View style = {styles(theme).infectedWrapper}>
    {props.dataSource.map((d, i) =>
      renderInfectedItem(
        d.title,
        figure[d.keyName],
        figure[d.keyName] - prevFigure[d.keyName],
        i,
        d.isReverse
      ),
    )}
  </View>
  )
}
