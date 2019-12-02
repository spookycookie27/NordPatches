import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/ActionCreators';
import RestUtilities from '../../services/RestUtilities';

import './PatchList.css';

class PatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {}

  getData() {
    console.log('getting data');
    this.props.setLoading(true);
    const url = '/api/patches';
    RestUtilities.get(url).then(async response => {
      if (response.ok) {
        this.setState({ data: response.content });
        console.log('got data');
      } else {
        this.setState({ error: true });
      }
      this.props.setLoading(false);
    });
  }

  render() {
    return (
      <div className='Patchlist'>
        <h2>Patch List</h2>
        {this.state.error && <p>There was an error getting data</p>}
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(PatchList);
