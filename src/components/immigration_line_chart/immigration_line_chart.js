import React, {useState} from 'react';
import {Text} from 'react-native';
import {Card} from 'native-base';
import styles from './immigration_line_chart_styles';
import {LineChart} from 'react-native-chart-kit';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext, ThemeProvider} from '../../theme/theme-context';

export default function ImmigrationLineChart(props) {
  const {theme, toggle, dark}               = React.useContext(ThemeContext);

  var data = props.data;

  var immigration = data.immigration || [];
  var dataset     = {
    labels   : [],
    datasets : [
      {
        data : [],
      },
    ],
  };
  immigration = immigration.sort((a, b) =>
    a.datetime > b.datetime ? 1 : b.datetime > a.datetime ? -1 : 0,
  );

  var total = 0;
  immigration.length
    ? immigration.map((d, i) => {
        if (i > immigration.length - 11) {
          var date = d.dateString.split('年').pop();
              date = date
            .split('月')
            .reverse()
            .join('/')
            .split('日')
            .join('')
            .replace(' ', '');
          dataset.labels.push(date);
          total += d.data['總計'].mainlandArrival;
          dataset.datasets[0].data.push(d.data['總計'].mainlandArrival);
        }
      })
     :  null;

  return dataset.datasets[0].data.length ? (
    <Card
      style={[
        styles(theme).card,
        {marginTop: hp('2%'), marginBottom: hp('5%')},
      ]}>
      <Text style = {[styles(theme).title, {marginBottom: -10}]}>
        大陸居民入境數字
      </Text>
      <LineChart
        data                  = {dataset}
        width                 = {wp('94%')}
        height                = {wp('94%') * 1.2}
        verticalLabelRotation = {90}
        fromZero
        segments    = {5}
        chartConfig = {{
          backgroundColor        : theme.darkGrey,
          backgroundGradientFrom : theme.darkGrey,
          backgroundGradientTo   : theme.darkGrey,
          decimalPlaces          : 0,
          color                  : (opacity = 1) => theme.primary,
          labelColor             : (opacity = 1) => theme.fontWhite,
          style                  : {
            borderRadius : 16,
          },
          propsForDots: {
            r           : '3',
            strokeWidth : '2',
            stroke      : theme.fontWhite,
          },
        }}
        style={{
          borderRadius : 16,
          paddingTop   : 40,
        }}
      />
    </Card>
  ) : null;
}
