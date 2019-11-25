import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import { actionCreators } from '../../store/ActionCreators';
//import RestUtilities from '../../services/RestUtilities';

import './Songlist.css';

const categoryConfig = [
  { id: 8, description: '20s' },
  { id: 7, description: '10s' },
  { id: 13, description: '00s' },
  { id: 5, description: '90s' },
  { id: 4, description: '80s' },
  { id: 3, description: '70s' },
  { id: 2, description: '60s' },
  { id: 1, description: '50s' },
  { id: 9, description: 'Folk/Traditional' },
  { id: 10, description: 'Various' },
  { id: 11, description: 'Classical' },
  { id: 12, description: 'Ceremony and Reception Music' },
  { id: 14, description: '2 Tone/Trojan/Rocksteady/Reggae' }
];

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
