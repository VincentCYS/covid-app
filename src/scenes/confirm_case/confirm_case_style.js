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
    fontSize     : wp("4%"),
    color        : constants.colors.fontWhite,
    marginTop    : 5,
    marginBottom : 5,
  },
  dateTxt: {
    alignSelf    : "flex-end",
    marginRight  : 10,
    marginTop    : 20,
    marginBottom : 20,
    color        : constants.colors.fontWhite
  },

  // Body
  infectedCard : {
    flex            : 1,
    backgroundColor : constants.colors.darkGrey,
    borderColor     : constants.colors.black,
    margin          : 5,
    padding         : wp('3%'),
    paddingTop      : 0,
    borderRadius    : 5
  },
  card: {
    backgroundColor : constants.colors.darkGrey,
    borderColor     : constants.colors.darkGrey,
    borderRadius    : 20,
    margin : 5,
    marginBottom : 10
  },
  roundWrapper : {
    backgroundColor : constants.colors.primary,
    borderRadius    : 20,
    padding         : 5,
    paddingLeft     : 15,
    paddingRight    : 15,

  }
});
