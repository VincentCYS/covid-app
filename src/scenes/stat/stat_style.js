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
    padding         : 10
  },
  title: {
    fontSize     : wp("5%"),
    marginTop    : hp("3%"),
    marginBottom : hp("1%"),
    alignSelf    : "center",
    fontWeight   : "bold",
    color      : constants.colors.fontWhite
  },
  subtitle: {
    color      : constants.colors.primary,
    alignSelf  : "center",
    marginTop  : 20,
    fontSize   : wp("5%"),
    fontWeight : "500",
    color      : constants.colors.fontWhite
  },
  card: {
    backgroundColor : constants.colors.darkGrey,
    borderColor : constants.colors.darkGrey,
    borderRadius : 20
  },
  dateTxt: {
    width     : "46%",
    alignSelf : "flex-end",
    marginTop : 20,
    color      : constants.colors.fontWhite
  }
});
