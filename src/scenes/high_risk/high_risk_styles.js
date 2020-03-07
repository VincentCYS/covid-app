import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../helpers/constants';

module.exports = (theme) => StyleSheet.create({
  container: {
    width           : '100%',
    height          : '100%',
    backgroundColor : theme.black,
    padding         : 10,
  },
  title: {
    fontSize   : wp('5%'),
    marginTop  : hp('3%'),
    alignSelf  : 'center',
    fontWeight : 'bold',
    color      : theme.fontWhite,
  },
  list: {
    width           : '100%',
    height          : '100%',
    marginTop       : hp('5%'),
    paddingBottom   : hp('5%'),
    backgroundColor : theme.black,
  },

  timeTxt: {
    fontSize : wp('4%'),
    color    : theme.fontWhite,
  },

  itemHeader: {
    flex            : 1,
    backgroundColor : theme.darkGrey,
    padding         : wp('5%'),
    margin          : 5,
    flexDirection   : 'row'
  },
  itemContent: {
    flex            : 1,
    backgroundColor : theme.darkGrey,
    padding         : wp('5%'),
    margin          : 5,
    marginLeft      : 20,
    marginRight     : 40,
  },
  searchBar: {
    flex              : 1,
    backgroundColor   : theme.black,
    borderBottomWidth : 0,
    marginLeft        : wp('5%'),
    marginRight       : wp('5%'),
    marginTop         : 10
  },
  input: {
    marginLeft : wp('7%'),
    marginRight : wp('7%'),
    paddingLeft  : wp('2%'),
    paddingRight : wp('2%'),
    borderBottomWidth : 0,  
    borderRadius : 20,
    fontSize : 15,
    lineHeight : 15,
    color : theme.black
  },
  infectedTxtGp : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    flexDirection : 'row',
    marginTop : 20
  }, 
  mapIcon : {
    width : wp('5%'),
    height : wp('5%'),
  }
});
