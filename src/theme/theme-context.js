
import React, {useEffect} from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import {
  StatusBar
} from 'react-native';

const themes = {
    dark: {
      primary     : '#a254ff',
      darkGrey    : '#1f1e21',
      black       : '#000',
      fontWhite   : '#fff',
      fontPrimary : '#a254ff'
    },
    light: {
        primary     : '#a254ff',
        darkGrey    : '#F7F7F7',
        black       : '#fff',
        fontWhite   : '#000',
        fontPrimary : '#a254ff'
    }
  }



const initialState = {
    dark: true,
    theme: themes.dark,
    toggle: () => {}
  }
  const ThemeContext = React.createContext(initialState)
  
  function ThemeProvider({ children }) {
    const [dark, setDark] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [theme, setTheme] = React.useState(themes.dark);

    useEffect(()=>{
      var isDark = true;

      AsyncStorage.getItem('dark')
      .then((dark) => {
        isDark = dark === 'true';
        setDark(isDark);
        setTheme(isDark ? themes.dark : themes.light);
      }).catch(err => {})

    },[])


    // toggle theme color
    function toggle () {
      // setRefreshing(true)
      var isDark = !dark
            
      AsyncStorage.setItem('dark',isDark+'')
      .then((res) => {
        setDark(isDark)
      }).catch(err => {})
    }
  
    return (
      <ThemeContext.Provider value={{ theme : dark ? themes.dark : themes.light, toggle,  dark}} >
      <StatusBar barStyle = {dark ? 'light-content' : 'dark-content'} backgroundColor = {dark ? '#000': '#fff'}/>
        {children}
      </ThemeContext.Provider> 
    )
  }
  
  export { ThemeProvider, ThemeContext }