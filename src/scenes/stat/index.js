import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Linking
} from 'react-native';
import {Card} from 'native-base';
import constants from '../../helpers/constants';
import API from '../../helpers/api';
import styles from './stat_style';
import {LineChart, PieChart} from 'react-native-chart-kit';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Stat(props) {
  const [loading, setLoading]               = useState(true);
  const [updateDate, setUpdateDate]         = useState('');
  const [source, setSource]                 = useState('');
  const [data, setData]                     = useState({});
  const [pieChartActive, setPieChartActive] = useState('hkResidents');

  useEffect(() => {
    getData('immigration');
    getData('figure');
    getData('case');
  }, []);

  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color = {constants.colors.primary}
        size  = "small"
        style = {{
          position       : 'absolute',
          left           : 0,
          right          : 0,
          top            : 0,
          bottom         : 0,
          alignItems     : 'center',
          justifyContent : 'center',
        }}
      />
    );
  }

  function getData(type) {
    setLoading(true);
    API.get(`/${type}`, {})
      .then(res => {
        var published = null;
        if (res.lastUpdate) {
          published = new Date(res.lastUpdate);
          published.setHours(published.getHours() + 8);
          published = published
            .toISOString()
            .split('T')
            .join(' ')
            .split(':');
          published.pop();
          published = published.join(':');
        }
        setLoading(false);
        setData(prev => ({...prev, [type]: res.data}));        
        Object.keys(res).includes('source') ? setSource({name: res.source, url: res.sourceURL}) : null;
        setUpdateDate(prev => (published ? published : prev));
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Failed to fetch error: ' + err.messages);
      });
  }

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  function renderInfectedItem(title, fig, diff, index) {
    return (
      <Card style                      = {styles.infectedCard} key = {`item-${index}`}>
      <Text adjustsFontSizeToFit style = {[styles.subtitle, {flex: 1,}]}>
          {title}
        </Text>

        <View style = {styles.infectedTxtGp}>
        <View style = {{flex: 3}}>
            <Text
              adjustsFontSizeToFit
              style = {[styles.subtitle, {textAlign: 'center', marginTop: 0, width : '100%'}]}>
              {fig || '-'}
            </Text>
          </View>
          {diff && diff != 0 ? (
            <View style = {styles.diffWrapper}>
              {diff > 0 ? (
                <Image
                  style  = {styles.diffImage}
                  source = {require('../../assets/up.png')}
                />
              ) : null}

              <Text
                adjustsFontSizeToFit
                style = {[styles.subtitle, {fontSize: diff % 100 != diff ?wp('2.3%') : wp('3%'), marginTop: 0, textAlign : 'center', padding:'2%'}]}>
                {Math.abs(diff) || '-'}
              </Text>
              {diff < 0 ? (
                <Image
                  style  = {styles.diffImage}
                  source = {require('../../assets/down.png')}
                />
              ) : null}
            </View>
          ) : null}
        </View>
      </Card>
    );
  }

  function renderInfectedCase() {
    var figure     = data.figure || [];
    var prevFigure = figure[figure.length - 2] || {};
        figure     = figure[figure.length - 1] || {};

    var dataSource = [
      {
        title   : '死亡',
        keyName : 'death',
      },
      {
        title   : '確診',
        keyName : 'comfirmCase',
      },
      {
        title   : '呈報',
        keyName : 'fulfillReportingCriteria',
      },
      {
        title   : '排除',
        keyName : 'ruleOut',
      },
    ];

    return (
      <View style = {styles.infectedWrapper}>
        {dataSource.map((d, i) =>
          renderInfectedItem(
            d.title,
            figure[d.keyName],
            figure[d.keyName] - prevFigure[d.keyName],
            i,
          ),
        )}
      </View>
    );
  }

  function renderCase() {
    var cases      = data.case || [];
    var fieldArray = cases.length
      ? cases
          .map(d => d[pieChartActive])
          .reduce((prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), {})
       :  [];
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
        legendFontColor : constants.colors.fontWhite,
        legendFontSize  : wp('2.8%'),
      });
    });

    return (
      <Card style = {styles.card} bordered = {false}>
      <Text style = {[styles.title, {marginBottom: 0}]}>確診人數數字</Text>
        <Text style = {[styles.subtitle, {marginTop : 30}]}>
          總計 {cases.length ? cases.length : 0} 人
        </Text>

        <View style = {styles.infectedTxtGp}>
          <TouchableOpacity
            bordered
            style={[styles.infectedBtn, {
              borderColor : 
                pieChartActive == 'hkResidents'
                  ? constants.colors.primary
                   :  '#fff',
            }]}
            onPress={() =>
              setPieChartActive(
                pieChartActive != 'hkResidents'
                  ? 'hkResidents'
                   :  pieChartActive,
              )
            }>
            <Text
              style={[styles.infectedBtnTxt,{
                color : 
                  pieChartActive == 'hkResidents'
                    ? constants.colors.primary
                     :  '#fff',
              }]}>
              患者居住地
            </Text>
          </TouchableOpacity>

          <View style = {{ width : 1, backgroundColor : '#fff'}}/>

          <TouchableOpacity
            bordered
            style={[styles.infectedBtn, {
              borderColor : pieChartActive == 'gender' ? constants.colors.primary : '#fff',
            }]}
            onPress={() =>
              setPieChartActive(
              pieChartActive == 'gender' ? 'hkResidents' : 'gender'
              )
            }>
            <Text
              style={[styles.infectedBtnTxt,{
                color : 
                  pieChartActive == 'gender'
                    ? constants.colors.primary
                     :  '#fff',
              }]}>
              性別
            </Text>
          </TouchableOpacity>

          <View style = {{ width : 1, backgroundColor : '#fff'}}/>

          <TouchableOpacity
            bordered
            style={[styles.infectedBtn, {
              borderColor : 
                pieChartActive == 'caseType'
                  ? constants.colors.primary
                   :  '#fff',
            }]}
            onPress={() =>
              setPieChartActive(
                pieChartActive == 'caseType' ? 'hkResidents' : 'caseType',
              )
            }>
            <Text
              style={[styles.infectedBtnTxt,{
                color : 
                  pieChartActive == 'caseType'
                    ? constants.colors.primary
                     :  '#fff',
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
            color                  : (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor             : (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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

  function renderImmigration() {
    var immigration = data.immigration || [];
    var dataset = {
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
              style = {[styles.card, {marginTop: hp('2%'), marginBottom: hp('5%')}]}>
        <Text style = {[styles.title, {marginBottom: -10}]}>
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
            backgroundColor        : constants.colors.darkGrey,
            backgroundGradientFrom : constants.colors.darkGrey,
            backgroundGradientTo   : constants.colors.darkGrey,
            decimalPlaces          : 0,                                                    // optional, defaults to 2dp
            color                  : (opacity = 1) => constants.colors.primary,
            labelColor             : (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style                  : {
              borderRadius : 16,
            },
            propsForDots: {
              r           : '3',
              strokeWidth : '2',
              stroke      : '#fff',
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

  return (
    <SafeAreaView style = {styles.wrapper}>
      <StatusBar barStyle = {'light-content'} backgroundColor = {constants.colors.black}/>

      {!loading ? (
        <ScrollView
          style          = {styles.container}
          refreshing     = {loading}
          refreshControl = {
            <RefreshControl
              colors     = {[constants.colors.primary]}
              refreshing = {loading}
              onRefresh  = {() => {
                setLoading(false);
                getData('case');
                getData('immigration');
                getData('figure');
              }}
            />
          }>
          <Text style = {styles.title}>圖表數據</Text>
          <View style = {{flex: 1, alignItems: 'flex-end', marginRight : 10}}>
          <Text style = {styles.dateTxt}>更新時間: {updateDate}</Text>
          <TouchableOpacity  onPress = {() => openSourceUrl(source.url)}>
            <Text
              style={[
                styles.dateTxt, {marginTop : 0}
              ]}>來源: {source.name}</Text>
          </TouchableOpacity>
          </View>

          {renderInfectedCase()}

          {renderCase()}

          {renderImmigration()}
        </ScrollView>
      ) : (
        activityIndicatorLoadingView()
      )}
    </SafeAreaView>
  );
}
