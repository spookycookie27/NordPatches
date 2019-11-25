import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import { actionCreators } from '../../store/ActionCreators';
//import RestUtilities from '../../services/RestUtilities';

import './Songlist.css';

class Songlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isLoading: false
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    return (
      <div className='Patchlist'>
        <h2>Patch List</h2>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Songlist);
