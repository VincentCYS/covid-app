
import React, {useEffect} from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import {
  StatusBar
} from 'react-native';

//setup theme color
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


// init state
const initialState = {
    dark: true,
    theme: themes.dark,
    toggle: () => {}
  }
  const ThemeContext = React.createContext(initialState)
  
  function ThemeProvider({ children }) {
    const [dark, setDark] = React.useState(true);
    const [theme, setTheme] = React.useState(themes.dark);

    
    useEffect(()=>{
      // default is dark theme
      var isDark = true;

      // get cache data 
      AsyncStorage.getItem('dark')
      .then((dark) => {
        // check theme
        isDark = dark === 'true';
        // set theme
        setDark(isDark);
        setTheme(isDark ? themes.dark : themes.light);
      }).catch(err => {})
    },[])

    // theme toggle
    function toggle () {
      // toggle
      var isDark = !dark;

      // set cache
      AsyncStorage.setItem('dark', isDark+'')
      .then((res) => {       
        // set state 
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