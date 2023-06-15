import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class LoadingScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textLoading}>Loading</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textLoading: {
    flex: 1,
    color: 'white'
  },
});