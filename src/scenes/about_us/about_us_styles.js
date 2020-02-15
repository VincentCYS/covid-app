import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import constants from "../../helpers/constants";

module.exports = StyleSheet.create({
  wrapper: {
    flex            : 1,
    backgroundColor : constants.colors.black,
  },
  container: {
    flex            : 1,
    backgroundColor : constants.colors.black,
    padding         : 5
  },

  // Font Style
  title: {
    fontSize     : wp("5%"),
    marginTop    : hp("3%"),
    marginBottom : hp("1%"),
    alignSelf    : "center",
    fontWeight   : "bold",
    color        : constants.colors.fontWhite
  },
  subtitle: {
    color      : constants.colors.primary,
    alignSelf  : "center",
    fontSize   : wp("5%"),
    fontWeight : "500",
    color      : constants.colors.fontWhite
  },
  normalTxt : {
    fontSize : wp("4%"),
    color    : constants.colors.fontWhite,
  },
  section : {
      margin : wp('5%'),
  },
  button : {
      backgroundColor : constants.colors.primary,
      borderRadius    : 20,
      alignItems      : 'center',
      justifyContent  : 'center',
      padding         : 5,
      marginLeft      : wp('5%'),
      height          : wp('10%'),
      width           : wp('40%')
  }
});
