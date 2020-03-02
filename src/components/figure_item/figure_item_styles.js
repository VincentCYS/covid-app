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
    borderRadius    : 20
  },
  infectedWrapper : {
    flexDirection   : 'row',
    marginBottom    : hp('5%'),
    backgroundColor : theme.black
  },
  infectedCard : {
    flex            : 1,
    backgroundColor : theme.darkGrey,
    borderColor     : theme.black,
    margin          : 5,
    paddingLeft         : wp('3%'),
    paddingRight         : wp('3%'),
    paddingBottom   : wp('5%'),
    borderRadius    : 5
  },
  infectedTxtGp : {
    flex : 1,
    justifyContent : 'center',
    flexDirection : 'row',
    marginTop : 20
  }, 
  diffWrapper : {
    flex : 1,
    flexDirection : 'column',
    alignItems : 'center',
    justifyContent : 'center',
  },
  diffImage : {
    width : wp('3%'),
    height : wp('3%'),
  },
});
