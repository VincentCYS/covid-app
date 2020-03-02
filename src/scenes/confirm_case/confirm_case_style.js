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
    padding         : 10
  },

  // Font Style
  title: {
    fontSize     : wp("5%"),
    marginTop    : hp("3%"),
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
    fontSize     : wp("4%"),
    color        : theme.fontWhite,
    marginTop    : 5,
    marginBottom : 5,
  },
  dateTxt: {
    alignSelf   : "flex-end",
    marginRight : 10,
    fontSize    : 10,
    color       : theme.fontWhite
  },

  // Body
  infectedCard : {
    flex            : 1,
    backgroundColor : theme.darkGrey,
    borderColor     : theme.black,
    margin          : 5,
    padding         : wp('3%'),
    paddingTop      : 0,
    borderRadius    : 5
  },
  card: {
    backgroundColor : theme.darkGrey,
    borderColor     : theme.darkGrey,
    borderRadius    : 10,
    margin          : 15,
  },
  roundWrapper : {
    backgroundColor : theme.primary,
    borderRadius    : 20,
    padding         : 5,
    paddingLeft     : 15,
    paddingRight    : 15,

  }
});
