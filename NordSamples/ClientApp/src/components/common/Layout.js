import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import LoadingMask from '../common/LoadingMask';

function Layout(props) {
  return (
    <>
      {props.children}
      {props.loading && <LoadingMask />}
    </>
  );
}

const mapStateToProps = state => ({
  loading: state.loading
});

export default connect(mapStateToProps)(withRouter(Layout));
