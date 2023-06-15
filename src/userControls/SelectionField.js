import { Component } from "react";
import PropTypes from 'prop-types';
import DropDownPicker from 'react-native-dropdown-picker';

export class SelectionField extends Component {
  static get propTypes() {
    return {
      options: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.bool,
          PropTypes.number,
        ]),
        text: PropTypes.string,
      })),
    };
  }

  static get defaultProps() {
    return {
      options: undefined,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      value: null,
    };

    this.setValue = this.setValue.bind(this);
  }

  setOpen(open) {
    this.setState({
      open
    });
  }

  setValue(callback) {
    this.setState(state => ({
      value: callback(state.value)
    }));
  }

  setItems(callback) {
    this.setState(state => ({
      items: callback(state.items)
    }));
  }

  render() {
    const { self } = this.context;
    const { options } = this.props;
    const { open, value, items } = this.state;

    return (
      <DropDownPicker
        open={open}
        value={value}
        items={options}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
    );
  }
}