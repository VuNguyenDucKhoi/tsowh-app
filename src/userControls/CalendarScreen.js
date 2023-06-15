import React, { Component } from 'react';
import { 
  Text, View, TouchableOpacity, 
  Dimensions, StyleSheet, Modal 
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Icon } from 'native-base';
import { moderateScale, Colors, months, weekdays } from '../constants/config'

export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    };
    console.log('this.context :', this.context)
    this.onDateChange = this.onDateChange.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  async componentDidMount() {
  }

  onDateChange(date) {
    this.context.self.setState({
      selectedStartDate: date,
    });
  }

  setModalVisible(visible) {
    const { typeCalendar, selectedStartDate } = this.context.self.state;
    if (typeCalendar === 'fromdate') {
      this.context.self.setState({
        modalVisible: visible,
        fromDate: selectedStartDate,
      });
    } else {
      this.context.self.setState({
        modalVisible: visible,
        toDate: selectedStartDate,
      });
    }
  }

  render() {
    const { self } = this.context;
    console.log('Calendar screen :');

    return (
      <Modal
        overlayColor={Colors.transparentColor}
        animationType="fade"
        transparent={true}
        visible={self.state.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.container}>
          <View style={styles.modalView}>
            <CalendarPicker
              onDateChange={this.onDateChange}
              startFromMonday={true}
              previousTitle={<Icon ios='ios-arrow-round-back' android="ios-arrow-round-back" style={styles.icon} type="Ionicons" />}
              nextTitle={<Icon ios='ios-arrow-round-forward' android="ios-arrow-round-forward" style={styles.icon} type="Ionicons" />}
              weekdays={weekdays}
              months={months}
              todayBackgroundColor={Colors.grey}
              selectedDayColor={Colors.primaryColor}
              width={Dimensions.get("window").width * 0.9}
            />

            <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!self.state.modalVisible);
                }}>
                <Text style={styles.textConfirm}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(80,80,80,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.5,
    backgroundColor: 'white',
    borderRadius: 7,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 7,
    elevation: 1,
  },
  textConfirm: {
    color: Colors.black,
    fontSize: moderateScale(16)
  },
  icon: {
    color: Colors.primaryColor
  },
});