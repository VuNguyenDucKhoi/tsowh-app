import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity,
  Dimensions, StyleSheet, Modal,
  Alert, KeyboardAvoidingView,
} from 'react-native';
import { scale, moderateScale, verticalScale, Colors } from '../constants/config'
import DefaultInput from './DefaultInput'
export default class EditContactScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      receiver: '',
      phoneContact: ''
    };

    this.onReceiverChange = this.onReceiverChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.updateReceiver = this.updateReceiver.bind(this);
  }

  async componentDidMount() {
    this.setState({
      receiver: this.context.self.state.object.address_contact_name,
      phoneContact: this.context.self.state.object.address_contact_phone
    })
  }

  onReceiverChange(text) {
    this.setState({
      receiver: text,
    });
  }

  onPhoneChange(text) {
    this.setState({
      phoneContact: text,
    });
  }

  updateReceiver(visible) {
    const { receiver, phoneContact } = this.state;

    Alert.alert(
      'Thông báo',
      'Bạn muốn thay đổi thông tin này ?',
      [
        {
          text: 'Xác nhận', onPress: async () => {
            this.context.self.setState({ modalVisible: visible });
            this.context.self.updateText(receiver, phoneContact)
          }
        },
        {
          text: 'Hủy',
          style: 'cancel',
        },
      ],
    );
  }

  setModalVisible(visible) {
    const { typeCalendar, selectedStartDate } = this.context.self.state;

    this.context.self.setState({
      modalVisible: visible,
    });
  }

  render() {
    const { receiver, phoneContact } = this.state
    const { self } = this.context;

    return (
      <Modal
        overlayColor={Colors.transparentColor}
        animationType="fade"
        transparent={true}
        visible={self.state.modalVisible}
      >
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} enabled style={styles.container}>
          <View style={styles.modalView}>
            <View style={styles.titleView}>
              <Text style={styles.title}>Vật tư sử dụng</Text>
            </View>

            <View style={styles.elementView}>
              <Text style={styles.label}>Tên </Text>
              <DefaultInput
                onChangeText={this.onReceiverChange}
                value={receiver}
                style={{ fontSize: moderateScale(15), width: "90%", }}
              />
            </View>

            <View style={styles.elementView}>
              <Text style={styles.label}>Liên hệ </Text>
              <DefaultInput
                onChangeText={this.onPhoneChange}
                value={phoneContact}
                style={{ fontSize: moderateScale(15), width: "90%", }}
              />
            </View>

            <View style={styles.bottomView}>
              <TouchableOpacity
                onPress={() => {
                  this.updateReceiver(!self.state.modalVisible);
                }}>
                <Text style={styles.textConfirm}>Sửa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!self.state.modalVisible);
                }}>
                <Text style={styles.textConfirm}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(80,80,80,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: 'white',
    borderRadius: 7,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 7,
    elevation: 1,
  },
  elementView: {
    paddingLeft: scale(10)
  },
  titleView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(5)
  },
  title: {
    color: Colors.black,
    fontSize: moderateScale(16)
  },
  label: {
    color: Colors.grey,
    fontSize: moderateScale(16)
  },
  textConfirm: {
    color: Colors.black,
    fontSize: moderateScale(16)
  },
  icon: {
    color: Colors.primaryColor
  },
  bottomView: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10)
  }
});