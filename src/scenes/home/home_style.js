import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import constants from "../../helpers/constants";


module.exports = StyleSheet.create({
  container: {
    // flex            : 1,
    width : '100%',
    height : '100%',
    backgroundColor : "#fff",
    padding : 10,
    paddingBottom : 0
  },
  title : {
      fontSize : wp('5%'),
      marginTop : hp('3%'),
      alignSelf : 'center',
      fontWeight : 'bold'
  },
  list : {
      marginTop : hp('5%'),
      paddingBottom : hp('5%')
  },

  cardTitle : {
    fontSize : wp('4%'),
    fontWeight : '800',
  },
  cardTime : {
    flex : 1,
    alignSelf : 'flex-start',
    marginLeft : 10
  },
  timeTxt : {
      fontSize : wp('3%')
  },
  icon : {
    transform: [{ rotate: '180deg'}],
  }, 
  reloadBtn : {
      flex : 1,
      alignItems : 'center',
      justifyContent : 'center'
  }
});
