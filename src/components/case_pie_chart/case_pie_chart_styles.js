import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import constants from "../../helpers/constants";
import React from 'react'



module.exports = (theme) => StyleSheet.create({
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
    marginTop  : 20,
    fontSize   : wp("5%"),
    fontWeight : "500",
    color      : theme.fontWhite
  },
  card: {
    backgroundColor : theme.darkGrey,
    borderColor     : theme.darkGrey,
    borderRadius    : 20,
  },
  dateTxt: {
    fontSize : 10,
    color    : theme.fontWhite
  },
  infectedTxtGp : {
    flex           : 1,
    justifyContent : 'center',
    flexDirection  : 'row',
    marginTop      : 20
  },
  infectedBtn : {
    borderRadius   : 10,
    marginRight    : wp('2%'),
    padding        : 0,
    width          : wp('20%'),
    alignItems     : 'center',
    justifyContent : 'center',
  },
  infectedBtnTxt : {
    fontSize : wp('3%'),
  }
});
