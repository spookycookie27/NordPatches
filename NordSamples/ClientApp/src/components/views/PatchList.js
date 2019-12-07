import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/ActionCreators';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';

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

  async getData() {
    console.log('getting data');
    this.props.setLoading(true);
    const url = '/api/patches';
    const response = await RestUtilities.get(url);
    if (response.ok) {
      await this.setState({ data: response.content });
      console.log(response.content);
    } else {
      await this.setState({ error: true, data: [] });
    }
    this.props.setLoading(false);
  }

  render() {
    //console.log(this.state.data);
    return (
      <div className='Patchlist'>
        {this.state.error && <p>There was an error getting data</p>}
        <MaterialTable
          options={{ pageSize: 20, padding: 'dense' }}
          columns={[
            { title: 'Name', field: 'name' },
            { title: 'Description', field: 'description' },
            { title: 'Category', field: 'category' },
            { title: 'Type', field: 'instrument', render: rowData => <span>{rowData.instrument.name}</span> },
            { title: 'User', field: 'user', render: rowData => <span>{rowData.user.username}</span> },
            {
              title: 'Link',
              field: 'link',
              render: rowData => (
                <a href={rowData.link} target='_blank' rel='noopener noreferrer'>
                  Click
                </a>
              )
            }
          ]}
          data={this.state.data ? this.state.data : []}
          title='Programs and Samples list'
        />
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(PatchList);
