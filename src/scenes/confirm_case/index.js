import React, {useState, useEffect} from "react";
import { Text, View, ActivityIndicator, Alert, StatusBar, RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { Container, Body, List, Card, CardItem, Icon } from "native-base";
import constants from "../../helpers/constants";
import API from "../../helpers/api";
import styles from "./confirm_case_style";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { widthPercentageToDP, heightPercentageToDP } from "react-native-responsive-screen";

export default function ConfirmCase (props) {


  const [loading, setLoading] = useState(true)
  const [updateDate, setUpdateDate] = useState('')
  const [cases, setCases] = useState({})
  // const [cases, setCase] = useState([])
  // const [immigration, setImmigration] = useState([])
  // const [figure, setFigure] = useState([])

  useEffect(() => {
    getCase();
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

  function getCase () {
      setLoading(true);
      API.get(`/case`, {})
      .then(res => {
          // if (res.lastUpdate) {
              var published = new Date(res.lastUpdate);
              published.setHours(published.getHours() + 8);
              published = published
                .toISOString()
                .split("T")
                .join(" ")
                .split(":");
              published.pop();
              published = published.join(":");
          // }
          setLoading(false);
          setCases(res.data || [])
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



  function renderCase() {
    var c = cases.length ? cases.reverse() : [];
    return (
      c.map(v => {
        return(
          <Card style = {styles.card}>
          <CardItem style = {styles.card}>
          {/* <Text style = {[styles.title, {marginBottom : 0, alignSelf : 'flex-start'}]}>確診人數數字</Text> */}
            <Text style = {[styles.subtitle, { alignSelf : 'flex-start'}]}>{`#${v.index} ${v.hkResidents}`} </Text>  
          </CardItem>
          

          </Card>
        )
      })
       
    );
  }


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
                        getCase();
                
                  }}
                />}>
            
            <Text style={styles.title}>香港武漢肺炎案例</Text>
            <Text style={styles.dateTxt}>更新時間: {updateDate}</Text>
            
          
          { renderCase() }
          </ScrollView> : activityIndicatorLoadingView()
      }
      </SafeAreaView>
    );
  }

