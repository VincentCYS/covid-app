import React, {useState, useEffect} from "react";
import { Text, View, ActivityIndicator, Alert, StatusBar, RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { Container, Body, List, Card, CardItem, Icon } from "native-base";
import constants from "../../helpers/constants";
import API from "../../helpers/api";
import styles from "./stat_style";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { widthPercentageToDP, heightPercentageToDP } from "react-native-responsive-screen";
import Home from "../news";

export default function Stat (props) {


  const [loading, setLoading] = useState(true)
  const [updateDate, setUpdateDate] = useState('')
  const [data, setData] = useState({})
  // const [cases, setCase] = useState([])
  // const [immigration, setImmigration] = useState([])
  // const [figure, setFigure] = useState([])

  useEffect(() => {
    getData('case');
    getData('figure');

    getData('immigration');
  }, [])
 
  


  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color={constants.colors.primary}
        size="small"
        style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        }}
      />
    );
}

  function getData (type) {
      setLoading(true);
      API.get(`/${type}`, {})
      .then(res => {
          var published = null
          if (res.lastUpdate) {
              published = new Date(res.lastUpdate);
              published.setHours(published.getHours() + 8);
              published = published
                .toISOString()
                .split("T")
                .join(" ")
                .split(":");
              published.pop();
              published = published.join(":");
          }
          setLoading(false);
          setData(prev => ({...prev, [type] : res.data}))
          setUpdateDate(prev => (published ? published: prev))    
      })
      .catch(err => {
          setLoading(false)
          Alert.alert("Failed to fetch error: " + err.messages)
      });
  }

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  function renderInfectedCase() {
    var figure = data.figure || [];
    // var figure = (data || {}).figure || [];
    figure = figure[figure.length - 1] || {};

    return (
      <View style = {styles.infectedWrapper}>
      
      <Card style = {styles.infectedCard}>
      <Text style = {styles.subtitle}>死亡</Text>
      <Text style = {styles.subtitle}>{figure.death || '-'}</Text>

      </Card>

      <Card style = {styles.infectedCard}>
      <Text style = {styles.subtitle}>確診</Text>
      <Text style = {styles.subtitle}>{figure.comfirmCase || '-'}</Text>

      </Card>

      <Card style = {styles.infectedCard}>
      <Text style = {styles.subtitle}>呈報</Text>
      <Text style = {styles.subtitle}>{figure.fulfillReportingCriteria || '-'}</Text>

      </Card>

      <Card style = {styles.infectedCard}>
      <Text style = {styles.subtitle}>排除</Text>
      <Text style = {styles.subtitle}>{figure.ruleOut || '-'}</Text>

      </Card>

      </View>
    )
  }



  function renderCase() {

    var cases = data.case || [];
    var local = 0;
    var nonLocal = 0;

    cases.map(c => c.hkResidents === '香港居民' ? local++ : nonLocal++);

    var d = [
        {
            name: "香港居民",
            population: local,
            color: "#593280",
            legendFontColor: constants.colors.fontWhite,
            legendFontSize: 15
        },
        {
            name: "非香港居民",
            population: nonLocal,
            color: "#6F12CC",
            legendFontColor: constants.colors.fontWhite,
            legendFontSize: 15
        }
    ];

    return (
        <Card style = {styles.card} bordered = {false}>
            <Text style = {[styles.title, {marginBottom : 0}]}>確診人數數字</Text>
            <Text style = {styles.subtitle}>總計 {d.reduce((a, c) => a.population + c.population)} 人</Text>  

            <PieChart
                data={d}
                width={widthPercentageToDP('100%')}
                height={220}
                chartConfig={{
                    backgroundColor: "#6F12CC",
                    backgroundGradientFrom: "#6F12CC",
                    backgroundGradientTo: "#ffa726",
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    propsForDots: {
                    r: "3",
                    }
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                />  
        </Card>
    );
  }

  function renderImmigration() {

    var immigration = data.immigration || [];

    var dataset = {
        labels: [],
        datasets: [
          {
            data: [],
          }
        ],
      };

    immigration.reverse();

    var total = 0;
    immigration.length ? immigration.map((d, i) => {
        if (i % 2 == 0 && dataset.labels.length < 10) {
          var date = d.dateString.split('年').pop();
          date  = date.split('月').reverse().join('/').split('日').join('').replace(' ', '')          
          dataset.labels.push(date)
            total += d.data['總計'].mainlandArrival
            dataset.datasets[0].data.push(d.data['總計'].mainlandArrival);
        }
    }) : null

    
      return (
        dataset.datasets[0].data.length ? 
        <Card style = {[styles.card, {marginTop : heightPercentageToDP('2%')}]}>
              <Text style = {[styles.title, {marginBottom : -10}]}>大陸居民入境數字</Text>
              <LineChart
                  data={dataset}
                  width={widthPercentageToDP('94%')}
                  height={heightPercentageToDP('50%')}
                  verticalLabelRotation = {90}
                  fromZero
                  segments = {5}
                  chartConfig={{
                      backgroundColor: constants.colors.darkGrey,
                      backgroundGradientFrom: constants.colors.darkGrey,
                      backgroundGradientTo: constants.colors.darkGrey,
                      decimalPlaces: 0, // optional, defaults to 2dp
                      color: (opacity = 1) => constants.colors.primary,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: "3",
                        strokeWidth: "2",
                        stroke: "#fff"
                      }
                    }}
                  style={{
                      borderRadius: 16,
                      paddingTop : 40,                      
                    }}
              /> 
          </Card>: null
      );
    }     

console.log('===> data: ', data);


    return (
      <SafeAreaView style = {styles.wrapper}>
      <StatusBar barStyle = {'light-content'}/>
        {
          !loading ? 
          <ScrollView style={styles.container} refreshing = {loading}
          refreshControl={
              <RefreshControl
                  colors = {[constants.colors.primary]}
                  refreshing={loading}
                  onRefresh={() => {
                        setLoading(false)
                        getData('case');
                        getData('immigration');
                        getData('figure');
                  }}
                />}>
            
            <Text style={styles.title}>圖表數據</Text>
            <Text style={styles.dateTxt}>更新時間: {updateDate}</Text>
            
            { renderInfectedCase() }
          
            { renderCase() }

            { renderImmigration() }

            <Text style={[styles.subtitle, {marginBottom : -70, marginTop : 30}]}>最新消息</Text>
            <Home numOfArticles = {3} showContent = {true} showTitle = {false}/>
            
          
          </ScrollView> : activityIndicatorLoadingView()
      }
      </SafeAreaView>
    );
  }

