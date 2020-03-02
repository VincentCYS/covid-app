import React from 'react';
import {
  Text,
} from 'react-native';
import {Card} from 'native-base';
import styles from './age_bar_chart_styles';
import { BarChart} from 'react-native-chart-kit';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext, ThemeProvider} from '../../theme/theme-context';

export default function AgeBarChart(props) {
  const {theme, toggle, dark} = React.useContext(ThemeContext);
  var   data                  = props.data;

  var range = [10, 11, 21, 31, 41, 51, 61, 71];

  var cases = [0, 0, 0, 0, 0, 0, 0, 0];
  data.case
    ? data.case.map((c, i) => {
        cases[
          range.findIndex((r, i) => {
            if (i == 0) {
              return c.age <= r;
            } else if (i == 7) {
              return c.age >= r;
            } else {
              return c.age >= r && c.age <= r + 9;
            }
          })
        ]++;
      })
     :  null;

  const dataSource = {
    labels: [
      '<10',
      '11-20',
      '21-30',
      '31-40',
      '41-50',
      '51-60',
      '61-70',
      '>71',
    ],
    datasets: [
      {
        data : cases,
      },
    ],
  };

  return data.case ? (
    <Card
      style={[
        styles(theme).card,
        {marginTop: hp('2%'), marginBottom: hp('5%')},
      ]}>
      <Text style = {[styles(theme).title, {marginBottom: 10}]}>
        感染者年紀分佈
      </Text>
      <BarChart
        data  = {dataSource}
        style = {{
          marginVertical : 8,
          borderRadius   : 16,
        }}
        width      = {wp('90%')}
        height     = {300}
        yAxisLabel = ""
        fromZero
        chartConfig={{
          withInnerLines         : true,
          barPercentage          : 0.8,
          backgroundGradientFrom : '#1E2923',
          backgroundColor        : theme.darkGrey,
          backgroundGradientFrom : theme.darkGrey,
          backgroundGradientTo   : theme.darkGrey,
          decimalPlaces          : 0,
          color                  : (opacity = 1) => theme.primary,
          labelColor             : (opacity = 1) => theme.fontWhite,
          style                  : {
            borderRadius : 16,
          },
        }}
        segments              = {10}
        verticalLabelRotation = {90}
      />
    </Card>
  ) : null;
}
