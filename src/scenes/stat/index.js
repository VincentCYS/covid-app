import React from "react";
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

export default class Stat extends React.Component {
  state = {
    loading: true,
    updateDate : '',
    case : [],
    immigration : [],
    figure : []
  };

  componentDidMount() {
    this.getData('case');
    this.getData('immigration');
    this.getData('figure');
  }

  activityIndicatorLoadingView() {
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

  getData(type) {
      this.setState({ loading : true }, () => {
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

          this.setState({
            loading: false,
            [type]: res.data,
            updateDate : published ? published: this.state.updateDate
          });
        })
        .catch(err =>
          this.setState({ loading: false }, () =>
            Alert.alert("Failed to fetch error: " + err.messages[0])
          )
        );
      })
  }

  openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  renderCase() {
    var cases = this.state.case || [];
    var local = 0;
    var nonLocal = 0;

    cases.map(c => c.hkResidents === '香港居民' ? local++ : nonLocal++);

    var data = [
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
            <Text style = {styles.subtitle}>總計 {data[0].population + data[1].population} 人</Text>  

            <PieChart
                data={data}
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


  renderImmigration() {
    var immigration = this.state.immigration || [];

    var data = {
        labels: [],
        datasets: [
          {
            data: [],
          }
        ],
      };

    immigration = immigration.reverse();
    var total = 0;
    immigration.length ? immigration.map((d, i) => {
        if (i % 2 == 0 && data.labels.length < 10) {
            data.labels.push(d.dateString.split('年').pop())

            total += d.data['總計'].mainlandArrival
            data.datasets[0].data.push(d.data['總計'].mainlandArrival);
        }
    }) : null

    return (
        data.datasets[0].data.length ? 
            <LineChart
                data={data}
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
                    marginBottom : 80,
                    
                  }}
            /> : null
    );
  }


  render() {

    return (

      <SafeAreaView style = {styles.wrapper}>
      <StatusBar barStyle = {'light-content'}/>
        {
          !this.state.loading ? 
          <ScrollView style={styles.container} refreshing = {this.state.loading}
          refreshControl={
              <RefreshControl
                  colors = {[constants.colors.primary]}
                  refreshing={this.state.loading}
                  onRefresh={() => {
                      this.setState({
                          loading : true
                      }, () => {
                        this.getData('case');
                        this.getData('immigration');
                        this.getData('figure');
                      }
                      )
                  }}
                />}>
            
            <Text style={styles.title}>圖表數據</Text>
            
            <Text style={styles.dateTxt}>更新時間: {this.state.updateDate}</Text>
            { this.renderCase() }

            <Text style = {[styles.title, {marginBottom : -30}]}>大陸居民入境數字</Text>
            { this.renderImmigration() }

        
            
          
          </ScrollView> : this.activityIndicatorLoadingView()
      }
      </SafeAreaView>
    );
  }
}
