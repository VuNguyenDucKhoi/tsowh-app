import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Icon } from 'native-base';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/config';
import { scale, moderateScale, verticalScale } from '../constants/config';
class InfoText extends Component {
  static get propTypes() {
    return {
      textHeader: PropTypes.string,
      textItem: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.number,
      ]),
      editText: PropTypes.bool,
      setModalVisible: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      textHeader: '',
      textItem: '',
      editText: false,
      setModalVisible: undefined,
    };
  }
  render() {
    const { self } = this.context;

    if (!self || !self.state) return (<React.Fragment />);

    const { textHeader, textItem, contactPhone, callNumber } = this.props;
    const { state, setModalVisible } = self;

    let disableHeader = false;
    let indexPhoneNumber = 0;
    let itemView = (<Text style={styles.textItem}>{textItem}</Text>);

    if (textHeader === 'Sản phẩm') {
      disableHeader = true;
      itemView = (
        <Text style={styles.textProduct}>{textItem}SP</Text>
      )
    }

    else if (contactPhone) {
      indexPhoneNumber = textItem.indexOf(contactPhone, 0)
      itemView = (
        <View>
          <Text>
            <Text style={styles.textItem}>
              {textItem.slice(0, indexPhoneNumber)}
            </Text>
            <Text style={styles.phoneNumber} onPress={callNumber}>
              {textItem.slice(
                indexPhoneNumber,
                indexPhoneNumber + contactPhone.length
              )}
            </Text>
            <Text style={styles.textItem}>
              {textItem.slice(indexPhoneNumber + contactPhone.length)}
            </Text>
          </Text>

          {
            textHeader === "Người nhận" &&
            state.object.state !== "intransit" &&
            state.object.state !== "failed" && (
              <View style={{ width: moderateScale(25) }}>
                <Icon
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  style={styles.iconEdit}
                  ios="edit"
                  android="edit"
                  type="Feather"
                />
              </View>
            )
          }
        </View>
      );
    }

    return (
      <View style={styles.element} >
        <View style={styles.elementHeader}>
          <Text style={styles.textHeader}>{disableHeader ? '' : textHeader}</Text>
        </View>

        <View style={styles.elementItem}>
          {itemView}
        </View>
      </View >
    )
  }
}


const styles = StyleSheet.create({
  element: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: scale(5),
    paddingBottom: scale(5),
  },
  elementHeader: {
    flex: 5 / 16, // width: '31.25%'
  },
  elementItem: {
    flex: 11 / 16, // width: '68.75%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingRight: scale(3)
  },
  iconEdit: {
    color: Colors.primaryColor,
    fontSize: moderateScale(25),
  },
  textInput: {
    borderColor: Colors.black,
    borderWidth: 0.5,
    fontSize: moderateScale(16),
  },
  textHeader: {
    color: Colors.black,
    paddingLeft: scale(13),
    fontSize: moderateScale(16),
  },
  textItem: {
    color: Colors.grey,
    fontSize: moderateScale(16)
  },
  textProduct: {
    color: Colors.secondaryColor,
    fontSize: moderateScale(16),
    borderRadius: verticalScale(11),
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
    paddingLeft: scale(2),
    paddingRight: scale(2)
  },
  phoneNumber: {
    fontSize: moderateScale(16),
    color: '#0093e0',
    textDecorationLine: 'underline'
  }
});

export default InfoText;