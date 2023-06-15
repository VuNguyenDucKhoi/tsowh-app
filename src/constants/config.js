import { Dimensions } from "react-native";

const APP_NAME = "Barcode scan";
const APP_CODE = "warehouse";


const API_URL = 'http://172.16.1.193:30001';
const API_UPIMAGE_URL = 'http://172.16.1.193:30001/v2/files/';
export const SOCKET_GATEWAY_URL = 'http://172.16.1.193:30006';

// const API_URL = "http://172.16.20.129:30001";
// const API_UPIMAGE_URL = "http://172.16.20.129:30001/v2/files/";
// export const SOCKET_GATEWAY_URL = "http://172.16.20.129:30006";

const DATE_FORMAT = "DD/MM/YYYY";
const DATETIME_FORMAT = "HH:mm DD/MM/YYYY";

const { width, height } = Dimensions.get("window");
const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const months = [
  "Tháng 1,",
  "Tháng 2,",
  "Tháng 3,",
  "Tháng 4,",
  "Tháng 5,",
  "Tháng 6,",
  "Tháng 7,",
  "Tháng 8,",
  "Tháng 9,",
  "Tháng 10,",
  "Tháng 11,",
  "Tháng 12,",
];
//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export {
  scale,
  verticalScale,
  moderateScale,
  APP_NAME,
  APP_CODE,
  API_URL,
  DATE_FORMAT,
  DATETIME_FORMAT,
  API_UPIMAGE_URL,
  weekdays,
  months,
};

export const frontSize = 15;
const tintColor = "#2f95dc";

export const Colors = {
  transparentColor: "#FFFFFF",
  logoColor: "#6452fe",
  primaryColor: "#104aa5",
  secondaryColor: "#24b24b",
  lightGrey: "#F6F6F6",
  black: "#333333",
  grey: "grey",
  green: "green",
  lightGreen: "#24b248",
  disableButtonColor: "#fdd6a2",
  accentColor: "#ff6f00",
  tintColor,
  tabIconDefault: "#ccc",
  tabIconSelected: tintColor,
  tabBar: "#fefefe",
  errorBackground: "red",
  errorText: "#fff",
  warningBackground: "#EAEB5E",
  warningText: "#666804",
  noticeBackground: tintColor,
  noticeText: "#fff",
};
