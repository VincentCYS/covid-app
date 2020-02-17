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
    color        : constants.colors.fontWhite
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
    borderColor     : constants.colors.darkGrey,
    borderRadius    : 20
  },
  dateTxt: {
    marginTop    : 20,
    marginBottom : 20,
    color        : constants.colors.fontWhite
  },
  infectedWrapper : {
    flexDirection   : 'row',
    marginBottom    : hp('5%'),
    backgroundColor : constants.colors.black
  },
  infectedCard : {
    flex            : 1,
    backgroundColor : constants.colors.darkGrey,
    borderColor     : constants.colors.black,
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
  infectedBtn : {
    borderRadius : 10,
    marginRight : wp('2%'),
    padding : 0,
    width : wp('20%'),
    alignItems : 'center',
    justifyContent : 'center',
  },
  infectedBtnTxt : {
    fontSize : wp('3%'),
  }
});
