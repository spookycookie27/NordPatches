import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function getPatchData(patch) {
  return (
    <>
      <Box>Patch ID: {patch.id}</Box>
      <Box>Date Created: {patch.dateCreated || 'none'}</Box>
      <Box>Category: {patch.category || 'none'}</Box>
      <Box>Description: {patch.description || 'none'}</Box>
      <Box>Instrument Type: {patch.instrument.name || 'none'}</Box>
      <Box>User: {patch.user.username || 'none'}</Box>
      <Box>User ID: {patch.user.nufUserId || 'none'}</Box>
    </>
  );
}

function getFileData(file) {
  return (
    <Box key={file.id}>
      <Box>File ID: {file.id}</Box>
      <Box>Filename: {file.name}</Box>
      <Box>File size: {file.size}</Box>
      <Box>Extension: {file.extension}</Box>
      <Box>Version: {file.version}</Box>
      <Box>Download (TBC) : {file.name}</Box>
    </Box>
  );
}

const PatchBrowser = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  async function getData() {
    console.log('getting data');
    const url = '/api/patches';
    const res = await RestUtilities.get(url);
    res
      .json()
      .then(res => {
        setData(res);
        console.log(res[0]);
      })
      .catch(err => {
        setError(true);
        console.log(err);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='Patchlist'>
      {error && <p>There was an error getting data</p>}
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
        data={data}
        title='Programs and Samples list'
        detailPanel={patch => {
          return (
            <Box m={2}>
              <Grid container spacing={3} justify='center'>
                <Grid item xs={6}>
                  {getPatchData(patch)}
                </Grid>
                <Grid item xs={6}>
                  {patch.patchFiles.map(x => getFileData(x.file))}
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
