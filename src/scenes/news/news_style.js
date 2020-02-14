import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import constants from "../../helpers/constants";


module.exports = StyleSheet.create({
  container: {
    width           : '100%',
    height          : '100%',
    backgroundColor : "#fff",
    padding         : 10,
    paddingBottom   : 0
  },
  title : {
      fontSize   : wp('5%'),
      marginTop  : hp('3%'),
      alignSelf  : 'center',
      fontWeight : 'bold',
      color : constants.colors.fontWhite
  },
  list : {
      width : '100%',
      height : '100%',
      marginTop     : hp('5%'),
      paddingBottom : hp('5%'),
      backgroundColor : constants.colors.black
  },

  cardTitle : {
    fontSize   : wp('4%'),
    fontWeight : '800',
    color : constants.colors.fontWhite
  },
  cardTime : {
    flex       : 1,
    alignSelf  : 'flex-end',
  },
  timeTxt : {
      fontSize : wp('3%'),
      color : constants.colors.fontWhite
  },
  icon : {
    transform : [{ rotate: '180deg'}],
  }, 
  reloadBtn : {
      flex           : 1,
      alignItems     : 'center',
      justifyContent : 'center'
  },
  cardItem : {
    backgroundColor : constants.colors.darkGrey,
    borderColor : constants.colors.darkGrey,
  }
});
