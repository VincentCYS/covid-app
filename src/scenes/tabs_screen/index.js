import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Text } from 'native-base';
import News from '../news';
import Stat from '../stat';
import ConfirmCase from '../confirm_case';
import constants from '../../helpers/constants';
export default function TabsScreen () {


    return (
      <Container style = {{backgroundColor : constants.colors.black}}>
        <Header hasTabs style = {{backgroundColor : constants.colors.black}}/>
        <Tabs tabBarUnderlineStyle={{backgroundColor : '#00000000'}} tabBarTextStyle={{color: '#000'}} tab>
          <Tab heading={ <TabHeading style={{ backgroundColor: constants.colors.black }} activeTextStyle={{color : constants.colors.primary}} ><Text>圖表數據</Text></TabHeading>} >
            <Stat />
          </Tab>
          <Tab heading={ <TabHeading style={{ backgroundColor: constants.colors.black }}><Text>相關新聞</Text></TabHeading>}>
            <News />
          </Tab>
          <Tab heading={ <TabHeading style={{ backgroundColor: constants.colors.black }}><Text>案例</Text></TabHeading>}>
            <ConfirmCase />
          </Tab>
        </Tabs>
      </Container>
    );
}