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
  Switch,
  View,
  Animated,
} from 'react-native';
import News from '../news';
import Stat from '../stat';
import ConfirmCase from '../confirm_case';
import HighRisk from '../high_risk';
import AboutUs from '../about_us';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import codePush from 'react-native-code-push';
import {ThemeContext} from '../../theme/theme-context.js';
import constants from '../../helpers/constants';
import Analytics from 'appcenter-analytics';

export default function TabsScreen(props) {
  // init state
  const {theme, toggle, dark}         = React.useContext(ThemeContext);
  const [loading, setLoading]         = useState(true);

  // first time open updated version
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [hvUpdate, setHvUpdate]       = useState(false);
  const [activeTab, setAcitveTab]     = useState(0);

  const [height, setheight]                 = useState(new Animated.Value(50));
  const [isNavBarHidden, setIsNavBarHidden] = useState(true);


  // tabs properties
  const [tabs, setTabs] = useState([
    {
      name      : '圖表數據',
      isActive  : true,
      component : <Stat setHidden = {setHidden} setAnimation = {setAnimation} />,
    },
    {
      name      : '相關新聞',
      isActive  : false,
      component : <News setHidden = {setHidden} setAnimation = {setAnimation}/>,
    },
    {
      name      : '案例',
      isActive  : false,
      component : <ConfirmCase setHidden = {setHidden} setAnimation = {setAnimation}/>,
    },
    {
      name      : '高危地區',
      isActive  : false,
      component : <HighRisk setHidden = {setHidden} setAnimation = {setAnimation}/>,
    },
    {
      name      : '關於我們',
      isActive  : false,
      component : <AboutUs setHidden = {setHidden} setAnimation = {setAnimation}/>,
    },
  ]);

  // enable Microsoft tracking event
  async function trackEvent(name) {
    var isEnabled = false;
        isEnabled = await Analytics.isEnabled();
    isEnabled ? Analytics.trackEvent(name) : null;
  }

  useEffect(() => {
    // check app update
    codePush.checkForUpdate().then(update => {
      // set state
      setIsFirstTime(false);
      setLoading(false);
      setHvUpdate(update ? true : false);
    });
  }, [hvUpdate]);

  // app update button
  function updateApp() {
    setLoading(true);

    // update app
    codePush.sync(
      {
        updateDialog : true,
        installMode  : codePush.InstallMode.IMMEDIATE,
      },
      status => {
        switch (status) {
          case codePush.SyncStatus.UPDATE_INSTALLED : 
            // restart app
            codePush.allowRestart();
            codePush.restartApp(true);
            break;
        }
      },
    );
  }

  // loading spinner
  function activityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color = {theme.primary}
        size  = "small"
        style = {{
          marginRight     : 5,
          backgroundColor : theme.black,
          alignItems      : 'center',
          justifyContent  : 'center',
        }}
      />
    );
  }

  // show and hide nav bar
  function setHidden() {
    setIsNavBarHidden(!isNavBarHidden)
  }

  // set animation
  function setAnimation(disable) {
    Animated.timing(height, {
      duration: 80,
      toValue: disable ? 0 : 50,
    }).start()
  };

  return (
    <Container style    = {{backgroundColor: theme.black}}>
      <StatusBar barStyle = {'light-content'} backgroundColor = {theme.black} />

      {/* Navigation Bar */}
      <Animated.View style = {{height : height}}>
        <Header
          hasTabs
                style                 = {{backgroundColor: theme.black}}
                androidStatusBarColor = {theme.black}>
          <Left style                 = {{flex: 1}} />
          
          <Body>
            <Title
              style={{
                color     : theme.primary,
                alignSelf : 'center',
                textAlign : 'center',
              }}>
              COVID19
            </Title>
          </Body>

          <Right>
            {loading ? (
              activityIndicatorLoadingView()
            ) : hvUpdate ? (
              <TouchableOpacity onPress = {() => updateApp()}>
              <Text             style   = {{color: theme.fontWhite, fontSize: 12}}>更新</Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flexDirection  : 'row',
                  justifyContent : 'center',
                  alignItems     : 'center',
                }}>
                <Text style = {{color: theme.fontWhite, fontSize: wp('2.5%')}}>
                  光/暗
                </Text>
                <Switch
                  style         = {{height: 20}}
                  onValueChange = {() => toggle()}
                  value         = {dark}
                  thumbColor    = {constants.colors.primary}
                  trackColor    = {theme.fontWhite}
                />
              </View>
            )}
          </Right>
        </Header>
      </Animated.View>

  
      <SafeAreaView  style = {{flex: 1}}>
        <Tabs
          tabBarPosition        = {'top'}
          tabBarActiveTextColor = {theme.black}
          tabBarTextStyle       = {{color: theme.black}}
          initialPage           = {0}
          tabBarUnderlineStyle  = {{
            backgroundColor : theme.primary,
            height          : 2,
          }}
          onChangeTab={(tab, ref) => {
            setAcitveTab(tab.i);
            trackEvent(`viewed ${tab.ref.key}`);
          }}>
          {tabs.map(({name, isActive, component}, i) => (
            <Tab
              key     = {`tab-${name}`}
              heading = {
                <TabHeading style = {{backgroundColor: theme.black}}>
                  <Text
                    style={{
                      color    : activeTab == i ? theme.fontWhite : 'grey',
                      fontSize : wp('3.5%'),
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
