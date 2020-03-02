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
    paddingBottom   : 0,
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
  card: {
    backgroundColor : theme.darkGrey,
    marginTop    : 20,
    marginBottom : 20,
    padding      : 20,
    borderRadius : 10
  },
  cardTitle: {
    fontSize   : wp('4%'),
    fontWeight : '800',
    color      : theme.fontWhite,
  },
  cardTime: {
    flex      : 1,
    alignSelf : 'flex-start',
  },
  timeTxt: {
    fontSize : wp('3%'),
    color    : theme.fontWhite,
    marginLeft : -10
  },
  reloadBtn: {
    flex           : 1,
    alignItems     : 'center',
    justifyContent : 'center',
  },
  cardItem: {
    backgroundColor : theme.darkGrey,
    borderColor     : theme.darkGrey,
    borderRadius    : 0,
  },
  searchBar: {
    flex              : 1,
    backgroundColor   : theme.black,
    borderBottomWidth : 0,
    marginLeft        : wp('5%'),
    marginRight       : wp('5%'),
    marginBottom      : 30,
    marginTop      : 30
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
});
