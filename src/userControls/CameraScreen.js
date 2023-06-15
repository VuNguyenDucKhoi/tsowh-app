import React, { Component } from 'react';
import { Text, View, TouchableOpacity, CameraRoll, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Icon } from 'native-base';
export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this._snap = this._snap.bind(this);
    this._closeCamera = this._closeCamera.bind(this);
    this._flashonChange = this._flashonChange.bind(this);
    this._flashonOnPress = this._flashonOnPress.bind(this);
    this.state = {
      ...this.state,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      image: '',
      flashonColor: 'white',
      flashonName: 'ios-flash',
      flashMode: 'auto',
      flashChoosing: false,
      snap: false,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const temp = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _snap = async () => {
    const { snap } = this.state

    if (this.camera && !snap) {
      this.setState({
        snap: true
      });

      let photo = await this.camera.takePictureAsync();
      CameraRoll.saveToCameraRoll(photo.uri, 'photo').then(function (result) {
        console.log('save succeeded ' + result);

      }).catch(function (error) {
        console.log('save failed ' + error);
      });

      let { images } = this.context.self.state;
      images.push({ source: { ...photo, id: '' } });

      this.context.self.setState({
        images: images,
        isShowCamera: false
      });
    }
  };

  _closeCamera = () => {
    this.context.self.setState({ isShowCamera: false })
  }

  _flashonChange = (type) => {
    if (type === 'auto') {
      this.setState({
        flashMode: 'auto',
        flashonName: 'ios-flash',
        flashChoosing: false,
        flashonColor: 'white'
      });
    } else if (type === 'on') {
      this.setState({
        flashMode: 'on',
        flashonName: 'ios-flash',
        flashChoosing: false,
        flashonColor: 'yellow'
      });
    } else {
      this.setState({
        flashMode: 'off',
        flashonName: 'ios-flash-off',
        flashChoosing: false,
        flashonColor: 'white'
      });
    }
  }

  _flashonOnPress = () => {
    this.setState({ flashChoosing: !this.state.flashChoosing })
  }

  render() {
    const { self } = this.context;
    const { hasCameraPermission, snap } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Không cho phép dùng camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Camera type={this.state.type} flashMode={this.state.flashMode} ref={ref => { this.camera = ref; }} style={styles.cameraStyle}>
            <View style={[styles.topAndBottomView, { flex: 1 / 8 }]}>
              <TouchableOpacity
                onPress={() => { this._closeCamera() }}>
                <Icon ios='md-close' android='md-close' style={[styles.icon, styles.backIcon]} type="Ionicons" />
              </TouchableOpacity>

              {
                this.state.flashChoosing ?
                  <View style={styles.iconsFlashView}>
                    <TouchableOpacity onPress={() => this._flashonChange('auto')}>
                      <Text style={styles.textFlash}> Tự động</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._flashonChange('on')}>
                      <Text style={styles.textFlash}> Bật</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._flashonChange('off')}>
                      <Text style={styles.textFlash}> Tắt</ Text>
                    </TouchableOpacity>
                  </View >
                  :
                  <View />
              }

              <TouchableOpacity
                onPress={() => this._flashonOnPress()}>
                <Icon ios={this.state.flashonName} android={this.state.flashonName} style={[styles.icon, { color: this.state.flashonColor }]} type="Ionicons" />
              </TouchableOpacity>
            </View >

            <View style={[styles.topAndBottomView,]}>
              <View style={{ width: 40, height: 40, paddingLeft: 25, backgroundColor: 'transparent' }} />

              <TouchableOpacity disabled={snap}
                onPress={() => { this._snap(); }}>
                <Icon ios='circle-slice-8' android='circle-slice-8' style={[styles.icon, styles.snapIcon]} type="MaterialCommunityIcons" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}
              >
                <Icon ios='ios-reverse-camera' android='ios-reverse-camera' style={[styles.icon, styles.flipIcon]} type="Ionicons" />
              </TouchableOpacity>
            </View>
          </Camera >
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topAndBottomView: {
    flex: 1 / 6,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  icon: {
    color: 'white',
    fontSize: 35
  },
  iconsFlashView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  textFlash: {
    color: 'white'
  },

  backIcon: {

  },
  snapIcon: {
    fontSize: 80
  },
  flipIcon: {
    fontSize: 50
  },
});