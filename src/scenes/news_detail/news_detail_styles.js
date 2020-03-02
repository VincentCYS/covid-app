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
    padding         : 30,
  },
  title: {
    fontSize   : wp('5%'),
    alignSelf  : 'center',
    fontWeight : 'bold',
    color      : theme.primary,
  },
  closeIcon: {
    width      : wp('7%'),
    height     : wp('7%'),
    marginLeft : 20,
    marginTop  : 20,
    marginBottom : 20
  },
  shareIcon: {
    width       : wp('7%'),
    height      : wp('7%'),
    marginRight : 20,
    marginTop   : 20,
  },
  section : {
    marginBottom : hp('7%')
  },
  whiteTxt : {
    color : theme.fontWhite,
  }
});
