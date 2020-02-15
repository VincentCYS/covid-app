import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../helpers/constants';

module.exports = StyleSheet.create({
  container: {
    width           : '100%',
    height          : '100%',
    backgroundColor : constants.colors.black,
    padding         : 10,
    paddingBottom   : 0,
  },
  title: {
    fontSize   : wp('5%'),
    marginTop  : hp('3%'),
    alignSelf  : 'center',
    fontWeight : 'bold',
    color      : constants.colors.fontWhite,
  },
  list: {
    width           : '100%',
    height          : '100%',
    marginTop       : hp('5%'),
    paddingBottom   : hp('5%'),
    backgroundColor : constants.colors.black,
  },

  timeTxt: {
    fontSize : wp('4%'),
    color    : constants.colors.fontWhite,
  },

  itemHeader: {
    flex            : 1,
    backgroundColor : constants.colors.darkGrey,
    padding         : wp('5%'),
    margin          : 5,
  },
  itemContent: {
    flex            : 1,
    backgroundColor : constants.colors.darkGrey,
    padding         : wp('5%'),
    margin          : 5,
    marginLeft      : 20,
    marginRight     : 40,
  },
  searchBar: {
    flex              : 1,
    backgroundColor   : constants.colors.black,
    borderBottomWidth : 0,
    marginLeft        : wp('5%'),
    marginRight       : wp('5%'),
  },
  input: {
    paddingLeft  : wp('2%'),
    paddingRight : wp('2%'),
  },
});
