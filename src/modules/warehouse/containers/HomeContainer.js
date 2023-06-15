import { connect } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../../userControls/HeaderButton";
import Home from "../components/Home";

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    // onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName, location, image)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
