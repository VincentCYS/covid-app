import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";


module.exports = (theme) => StyleSheet.create({

  title: {
    fontSize     : wp("5%"),
    marginTop    : hp("3%"),
    marginBottom : hp("1%"),
    alignSelf    : "center",
    fontWeight   : "bold",
    color        : theme.fontWhite
  },
  card: {
    backgroundColor : theme.darkGrey,
    borderColor     : theme.darkGrey,
    borderRadius    : 20
  },
});
