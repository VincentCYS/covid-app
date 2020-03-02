import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {Card} from 'native-base';
import styles from './case_pie_chart_styles';
import { PieChart} from 'react-native-chart-kit';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext} from '../../theme/theme-context';

export default function CasePieChart(props) {
  const {theme, toggle, dark} = React.useContext(ThemeContext);
  const [pieChartActive, setPieChartActive] = useState('hkResidents');

  var   data                  = props.data;

    var cases      = data.case || [];
    var fieldArray = cases.length
      ? cases
          .map(d => d[pieChartActive])
          .reduce((prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), {})
        :   [];
    var dataSource = [];
    var colors     = [
      '#8C3085',
      '#593280',
      '#30348C',
      '#2F54A3',
      '#2C6B99',
      '#2A9BB0',
      '#28A697',
    ];

    Object.keys(fieldArray).map((a, i) => {
      dataSource.push({
        name            : a,
        population      : Object.values(fieldArray)[i],
        color           : colors[i],
        legendFontColor : theme.fontWhite,
        legendFontSize  : wp('2.8%'),
      });
    });

    return (
      <Card style = {styles(theme).card} bordered = {false}>
      <Text style = {[styles(theme).title, {marginBottom: 0}]}>確診人數數字</Text>
      <Text style = {[styles(theme).subtitle, {marginTop : 30}]}>
          總計 {cases.length ? cases.length : 0} 人
        </Text>

        <View style = {styles(theme).infectedTxtGp}>
          <TouchableOpacity
            bordered
            style={[styles(theme).infectedBtn, {
              borderColor : 
                pieChartActive == 'hkResidents'
                  ? theme.primary
                    :   theme.fontWhite,
            }]}
            onPress={() =>
              setPieChartActive(
                pieChartActive != 'hkResidents'
                  ? 'hkResidents'
                    :   pieChartActive,
              )
            }>
            <Text
              style={[styles(theme).infectedBtnTxt,{
                color : 
                  pieChartActive == 'hkResidents'
                    ? theme.primary
                      :   theme.fontWhite,
              }]}>
              患者居住地
            </Text>
          </TouchableOpacity>

          <View style = {{ width : 1, backgroundColor : theme.fontWhite}}/>

          <TouchableOpacity
            bordered
            style={[styles(theme).infectedBtn, {
              borderColor : pieChartActive == 'gender' ? theme.primary : theme.fontWhite,
            }]}
            onPress={() =>
              setPieChartActive(
              pieChartActive == 'gender' ? 'hkResidents' : 'gender'
              )
            }>
            <Text
              style={[styles(theme).infectedBtnTxt,{
                color : 
                  pieChartActive == 'gender'
                    ? theme.primary
                      :   theme.fontWhite,
              }]}>
              性別
            </Text>
          </TouchableOpacity>

          <View style = {{ width : 1, backgroundColor : theme.fontWhite}}/>

          <TouchableOpacity
            bordered
            style={[styles(theme).infectedBtn, {
              borderColor : 
                pieChartActive == 'caseType'
                  ? theme.primary
                    :   theme.fontWhite,
            }]}
            onPress={() =>
              setPieChartActive(
                pieChartActive == 'caseType' ? 'hkResidents' : 'caseType',
              )
            }>
            <Text
              style={[styles(theme).infectedBtnTxt,{
                color : 
                  pieChartActive == 'caseType'
                    ? theme.primary
                      :   theme.fontWhite,
              }]}>
              感染類型
            </Text>
          </TouchableOpacity>
        </View>

        <PieChart
          data        = {dataSource}
          width       = {wp('100%')}
          height      = {200}
          chartConfig = {{
            backgroundColor        : '#6F12CC',
            backgroundGradientFrom : '#6F12CC',
            backgroundGradientTo   : '#ffa726',
            color                  : (opacity = 1) => theme.fontWhite,
            labelColor             : (opacity = 1) => theme.fontWhite,
            propsForDots           : {
              r : '3',
            },
          }}
          accessor        = "population"
          backgroundColor = "transparent"
          paddingLeft     = "15"
          absolute
        />
      </Card>
    );
  
}
