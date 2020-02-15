import React, {useState} from 'react';
import {
  Container,
  Header,
  Tab,
  Tabs,
  TabHeading,
  Text,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';
import {SafeAreaView, StatusBar} from 'react-native';
import News from '../news';
import Stat from '../stat';
import ConfirmCase from '../confirm_case';
import HighRisk from '../high_risk';
import AboutUs from '../about_us';
import constants from '../../helpers/constants';
import { widthPercentageToDP } from 'react-native-responsive-screen';
export default function TabsScreen(props) {
  const [tabs, setTabs] = useState([
    {
      name      : '圖表數據',
      isActive  : true,
      component : <Stat />,
    },
    {
      name      : '相關新聞',
      isActive  : false,
      component : <News />,
    },
    {
      name      : '案例',
      isActive  : false,
      component : <ConfirmCase />,
    },
    {
      name      : '高危地區',
      isActive  : false,
      component : <HighRisk />,
    },
    {
      name      : '關於我們',
      isActive  : false,
      component : <AboutUs />,
    },
  ]);

  return (
    <Container style    = {{backgroundColor: constants.colors.black}}>
    <StatusBar barStyle = {'light-content'} />

      <Header hasTabs style = {{backgroundColor: constants.colors.black}}>
        <Left />
        <Body>
          <Title style = {{color: constants.colors.primary}}>NCOV</Title>
        </Body>
        <Right />
      </Header>

      <SafeAreaView style = {{flex: 1}}>
        <Tabs
          tabBarPosition        = {'top'}
          tabBarActiveTextColor = {'#000'}
          tabBarUnderlineStyle  = {{backgroundColor: constants.colors.primary, height : 2}}
          onChangeTab           = {(tab, ref) => {
            setTabs(
              [...tabs].map((t, idx) => {
                t.isActive = idx == tab.i ? true : false;
                return t;
              }),
            );
          }}>
          {tabs.map(({name, isActive, component}, i) => (
            <Tab
              key     = {`tab-${i}`}
              heading = {
                <TabHeading style = {{backgroundColor: constants.colors.black}}>
                <Text       style = {{color: isActive ? 'white' : 'grey', fontSize: widthPercentageToDP('3.5%')}}>
                    {name}
                  </Text>
                </TabHeading>
              }>
              {component}
            </Tab>
          ))}
        </Tabs>
      </SafeAreaView>
    </Container>
  );
}
