import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import constants from "../../helpers/constants";

module.exports = (theme) => StyleSheet.create({
  wrapper: {
    flex            : 1,
    backgroundColor : theme.black,
  },
  container: {
    flex            : 1,
    backgroundColor : theme.black,
    padding         : 5
  },

  // Font Style
  title: {
    fontSize     : wp("5%"),
    marginTop    : hp("1%"),
    marginBottom : hp("1%"),
    alignSelf    : "center",
    fontWeight   : "bold",
    color        : theme.fontWhite
  },
  subtitle: {
    color      : theme.primary,
    alignSelf  : "center",
    fontSize   : wp("5%"),
    fontWeight : "500",
    color      : theme.fontWhite
  },
  normalTxt : {
    fontSize : wp("4%"),
    color    : theme.fontWhite,
  },
  section : {
      margin : wp('5%'),
  },
  shareIcon: {
    width       : wp('7%'),
    height      : wp('7%'),
    marginRight : 20,
    marginTop   : 20,
  },
  button : {
      backgroundColor : theme.primary,
      borderRadius    : 20,
      alignItems      : 'center',
      justifyContent  : 'center',
      padding         : 5,
      marginLeft      : wp('5%'),
      height          : wp('10%'),
      width           : wp('40%')
  }
});
