import React, { useState } from "react";
import { Text, View, Alert, TouchableOpacity, RefreshControl, SafeAreaView, Linking } from "react-native";
import { Container, Body, List, Card, CardItem, Icon } from "native-base";
import constants from "../../helpers/constants";
import API from "../../helpers/api";
import styles from "./home_style";


export default function Home(props)  {


  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  getArticles();

  function getArticles() {
    API.get(`/articles/100`, {})
      .then(res => {
        console.log(res);
        setLoading(false);
        setArticles(res.data);
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
      <Card key={`articles-${row.index}`}>

        <CardItem bordered>
          <TouchableOpacity onPress = {() => openSourceUrl(item.url)}>
            {/* news title */}
            <Text style = {styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        </CardItem>

        <CardItem>
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

  // function sorting(){
  //   articles.reverse();
  //   setArticles(articles)
  // }
    return (
      <SafeAreaView>
          <Text style={styles.title}>武漢肺炎相關新聞</Text>
    
          <TouchableOpacity>

          </TouchableOpacity>

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
                        setArticles([]);
                        setLoading(true);
                      }}
                  />
                            }
            /> 
          
          }      
      </SafeAreaView>
    );
  
}
