import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { nufFileLink } from '../common/Common';
import moment from 'moment';

function getFileMetaData(file) {
  return (
    <>
      <Box>
        <strong>File ID:</strong> {file.id}
      </Box>
      <Box>
        <strong>Attach ID:</strong> {file.attachId}
      </Box>
      <Box>
        <strong>Date Created:</strong> {file.dateCreated ? moment(file.dateCreated).format('Do MMM YYYY') : 'unknown'}
      </Box>
      <Box>
        <strong>Comment:</strong> {file.comment}
      </Box>
      <Box>
        <strong>User:</strong> {file.user ? file.user.username : ''}
      </Box>
    </>
  );
}

function getFileData(file) {
  return (
    <>
      <Box>
        <strong>Extension:</strong> {file.extension}
      </Box>
      <Box>
        <strong>Size:</strong> {file.size}
      </Box>
      <Box>
        <strong>Download:</strong> <a href={`${nufFileLink}${file.attachId}`}>{file.name}</a>
      </Box>
    </>
  );
}

const PatchBrowser = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const url = '/api/file';
      const res = await RestUtilities.get(url);
      res
        .json()
        .then(res => {
          setData(res);
        })
        .catch(err => {
          setError(true);
        });
    };
    getData();
  }, []);

  return (
    <div className='Patchlist'>
      {error && <p>There was an error getting data</p>}
      <MaterialTable
        options={{ pageSize: 20, padding: 'dense' }}
        columns={[
          { title: 'ID', field: 'id' },
          { title: 'Name', field: 'name' },
          { title: 'Comment', field: 'comment' },
          { title: 'Size', field: 'size' },
          { title: 'Extension', field: 'extension' }
        ]}
        data={data}
        title='Files List'
        detailPanel={file => {
          return (
            <Box m={2}>
              <Grid container spacing={3} justify='center'>
                <Grid item xs={6}>
                  {getFileMetaData(file)}
                </Grid>
                <Grid item xs={6}>
                  {getFileData(file)}
                </Grid>
              </Grid>
            </Box>
          );
        }}
      />
    </div>
  );
};
export default PatchBrowser;
