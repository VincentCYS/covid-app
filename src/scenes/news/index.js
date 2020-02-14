import React, { useState, useEffect } from "react";
import { Text, View, Alert, TouchableOpacity, RefreshControl, SafeAreaView, Linking } from "react-native";
import { Container, Body, List, Card, CardItem, Icon } from "native-base";
import constants from "../../helpers/constants";
import API from "../../helpers/api";
import styles from "./news_style";




export default function News(props)  {

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);


  useEffect(() => {
    getArticles();
  },[])

  function getArticles() {    
    setLoading(true);
    API.get(`/articles/${props.numOfArticles || 100}`, {})
      .then(res => {
        setLoading(false);
        setArticles(res.data);
        console.log('===> articles', articles);
        
      })
      .catch(err => {
        setLoading(false);
        Alert.alert("Failed to fetch error: " + err.messages);
      });
  }

  function openSourceUrl(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  function renderCardRow(row) {
    var item = row.item;
    var published = new Date(item.published);
    published.setHours(published.getHours() + 8);
    published = published
      .toISOString()
      .split("T")
      .join(" ")
      .split(":");
    published.pop();
    published = published.join(":");

    return (
      <Card key={`articles-${row.index}`} style = {{borderColor : constants.colors.darkGrey}}>

        <CardItem  style = {styles.cardItem}>
          <TouchableOpacity onPress = {() => openSourceUrl(item.url)}>
              {/* news title */}
              <Text style = {styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
        </CardItem>

        <CardItem  style = {styles.cardItem}>
            {/* news title */}
            <Text style = {[styles.cardTitle, {fontSize : 16, fontWeight: '500', lineHeight : 20}]}>{item.content}</Text>
        </CardItem>

        <CardItem  style = {styles.cardItem}>
          {/* source */}
          <TouchableOpacity style = {{flex : 1}} onPress = {() => openSourceUrl(item.sourceUrl)}>
              <Text style = {styles.timeTxt}>來源: {item.source}</Text>
          </TouchableOpacity>
          {/* updated time */}
          <View style = {styles.cardTime}>
              <Text style = {styles.timeTxt}>更新時間: {published}</Text>
          </View>
        </CardItem>

      </Card>
    );
  }

    return (
      // <SafeAreaView>
      <View style = {{backgroundColor : constants.colors.black}}>
          <Text style={styles.title}>武漢肺炎相關新聞</Text>
          {
              <List
              style={styles.list}
              dataArray={articles}
              renderItem={row => renderCardRow(row)}
              keyExtractor={item => item.id}
              refreshing = {loading}
              refreshControl={
                  <RefreshControl
                      colors = {[constants.colors.primary]}
                      refreshing={loading}
                      onRefresh={() => {
                        getArticles();
                      }}
                  />}
            /> 
          
          }    
        </View>  
    );
  
}
