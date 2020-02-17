import React, {useState, useEffect} from 'react';
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
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import News from '../news';
import Stat from '../stat';
import ConfirmCase from '../confirm_case';
import HighRisk from '../high_risk';
import AboutUs from '../about_us';
import constants from '../../helpers/constants';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import codePush from 'react-native-code-push';

// TabsScreen = codePush({ checkFrequency: codePush.CheckFrequency.MANUAL, installMode: codePush.InstallMode.IMMEDIATE })(TabsScreen);

export default function TabsScreen(props) {
  // codePush.sync({ updateDialog: true },
  //   (status) => {
  //       switch (status) {
  //           case codePush.SyncStatus.DOWNLOADING_PACKAGE:
  //               // Show "downloading" modal
  //               break;
  //           case codePush.SyncStatus.INSTALLING_UPDATE:
  //               // Hide "downloading" modal
  //               break;
  //       }
  //   },
  //   ({ receivedBytes, totalBytes, }) => {
  //     /* Update download modal progress */
  //   }
  // );

  const [loading, setLoading]   = useState(true);
  const [isFirstTime, setIsFirstTime]   = useState(true);
  const [hvUpdate, setHvUpdate] = useState(false);
  const [tabs, setTabs]         = useState([
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

  
  useEffect(() => {
    if (isFirstTime) {
      codePush.checkForUpdate()
      .then((update) => {
        setIsFirstTime(false)
      setLoading(false)
      if (!update) {        
        setHvUpdate(false)
      } else {
        setHvUpdate(true)
      }
      });
    }
  })

  function onButtonPress() {
    setLoading(true)

    codePush.sync({
      updateDialog : true,
      installMode  : codePush.InstallMode.IMMEDIATE,
    }, (status) => {
      switch (status) {
          case codePush.SyncStatus.UPDATE_INSTALLED:
              codePush.allowRestart()
              codePush.restartApp(true);
              // Hide "downloading" modal
              break;
      }
    });
  }

  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color = {constants.colors.primary}
        size  = "small"
        style = {{
          marginRight : 5,
          backgroundColor : constants.colors.black,
          alignItems      : 'center',
          justifyContent  : 'center',
        }}
      />
    );
  }



  return (
    <Container style = {{backgroundColor: constants.colors.black}}>
      <StatusBar
        barStyle        = {'light-content'}
        backgroundColor = {constants.colors.black}
      />

      <Header
        hasTabs
              style                 = {{backgroundColor: constants.colors.black}}
              androidStatusBarColor = {constants.colors.darkGrey}>
        <Left style                 = {{flex: 1}} />
        <Body>
          <Title
            style={{
              color     : constants.colors.primary,
              alignSelf : 'center',
              textAlign : 'center',
            }}>
            COVID 19
          </Title>
        </Body>
        <Right>
          {
            loading ? activityIndicatorLoadingView() : 
            hvUpdate? 
              <TouchableOpacity onPress = {() => onButtonPress()}>
                <Text             style   = {{color: 'white', fontSize : 12}}>更新</Text>
              </TouchableOpacity>
             : 
              <Image
                style  = {{width: 20, height: 20, marginRight : 5}}
                source = {{uri : constants.icon.tick}}
              />
          }
        
        </Right>
      </Header>

      <SafeAreaView style = {{flex: 1}}>
        <Tabs
          tabBarPosition        = {'top'}
          tabBarActiveTextColor = {'#000'}
          tabBarUnderlineStyle  = {{
            backgroundColor : constants.colors.primary,
            height          : 2,
          }}
          onChangeTab={(tab, ref) => {
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
                  <Text
                    style={{
                      color    : isActive ? 'white'          : 'grey',
                      fontSize : widthPercentageToDP('3.5%'),
                    }}>
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
