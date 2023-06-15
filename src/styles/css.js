import { StyleSheet } from 'react-native';
import { Colors, scale, moderateScale, verticalScale } from '../constants/config';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginLeft: -15,
    marginRight: -15,
  },
  titleView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(5),
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#22242626',
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
  },
  pickerStyle: {
    height: 45,
    width: '80%',
    color: '#344953',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#22242626',
    borderRadius: 5,
    width: '100%',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  buttonOuterLayout: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#f8f8f9',
    marginTop: -15,
    borderColor: 'transparent',
    borderBottomColor: '#ddd',
    borderWidth: 1,
  },
  buttonLayout: {
    margin: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  elementView: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  actionList: {
    backgroundColor: 'blue',
    marginTop: -15,
  },
  scrollView: {
    paddingTop: 0,
    paddingBottom: 15,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 35,
  },
  button: {
    backgroundColor: '#6c7ae0',
  },
  backButton: {
    backgroundColor: '#1b1c1d',
  },
});

export const modalStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 0,
    height: "100%",
    width: "100%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  pickMaterialModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    height: "auto",
    width: "70%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export const signinStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    flex: 1,
  },
  inputContainer: {
    width: "80%",
    paddingBottom: 30,
  },
  input: {
    padding: 15,
    paddingVertical: 10,
  },
  landscapePasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  iconCheckBox: {
    color: Colors.grey,
  },
  viewShowPass: {
    justifyContent: "center",
    position: "absolute",
    right: scale(10),
    height: "100%",
  },
  iconShowPass: {
    color: Colors.black,
  },
  textCheckBox: {
    color: Colors.grey,
  },
  portraitPasswordContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  landscapePasswordWrapper: {
    width: "45%",
  },
  portraitPasswordWrapper: {
    width: "100%",
  },
});

export const sideDrawerStyles = StyleSheet.create({
  container: {
    paddingTop: scale(30),
    backgroundColor: "white",
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    height: "23%",
  },
  imageUser: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(38),
  },
  imageLogo: {
    width: "60%",
    height: "31%",
  },
  headerTextView: {
    paddingLeft: scale(12),
  },
  infoView: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: scale(20),
  },
  line: {
    borderWidth: 0.5,
    borderColor: Colors.grey,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(20),
    backgroundColor: "#eeeeee",
  },
  drawerItemIcon: {
    paddingRight: scale(20),
    color: Colors.primaryColor,
    width: moderateScale(70),
    justifyContent: "flex-start",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: scale(5),
  },
  textName: {
    fontSize: moderateScale(18),
  },
});
