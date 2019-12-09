import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import { nufFileLink } from '../common/Common';
import moment from 'moment';

function getPatchData(patch) {
  var mp3s = patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
  console.log(patch);
  return (
    <>
      <Box>
        <strong>Patch ID:</strong> {patch.id}
      </Box>
      <Box>
        <strong>Date Created:</strong> {patch.dateCreated ? moment(patch.dateCreated).format('Do MMM YYYY') : 'unknown'}
      </Box>
      <Box>
        <strong>Category:</strong> {patch.category ? patch.category.name : 'TBC'}
      </Box>
      <Box>
        <strong>Description:</strong> {patch.description || 'TBC'}
      </Box>
      <Box>
        <strong>Instrument Type:</strong> {patch.instrument.name || 'none'}
      </Box>
      <Box>
        <strong>User:</strong> {patch.user.username || 'none'}
      </Box>
      <Box>
        <strong>User ID:</strong> {patch.user.nufUserId || 'none'}
      </Box>
      {mp3s && (
        <Box>
          {mp3s.map(mp3 => (
            <audio key={mp3.id} controls>
              <source src={`${nufFileLink}${mp3.attachId}`} type='audio/mpeg' />
            </audio>
          ))}
        </Box>
      )}
      <Box>
        <strong>Related Patches:</strong> {patch.parent ? <span>{patch.parent.name}</span> : null}
        {patch.children.map(x => (
          <span>{x.name}</span>
        ))}
      </Box>
    </>
  );
}

function getFileData(file) {
  return (
    <Box key={file.id}>
      <Box>
        <strong>File ID:</strong> {file.id}
      </Box>
      <Box>
        <strong>Name:</strong> {file.name}
      </Box>
      <Box>
        <strong>Size (bytes):</strong> {file.size}
      </Box>
      <Box>
        <strong>Extension:</strong> {file.extension}
      </Box>
      <Box>
        <strong>Version:</strong> {file.version + 1}
      </Box>
      <Box>
        <strong>Download:</strong> <a href={`${nufFileLink}${file.attachId}`}>{file.name}</a>
      </Box>
    </Box>
  );
}

const PatchBrowser = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  async function getData() {
    const url = '/api/patch';
    const res = await RestUtilities.get(url);
    res
      .json()
      .then(res => {
        setData(res);
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
          {
            title: 'Mp3',
            field: 'patchFiles',
            render: rowData => <span>{!!rowData.patchFiles.find(x => x.file.extension === 'mp3') ? <AudiotrackIcon /> : null}</span>
          },
          { title: 'Category', field: 'category', render: rowData => <span>{rowData.category ? rowData.category.name : ''}</span> },
          { title: 'Type', field: 'instrument', render: rowData => <span>{rowData.instrument.name}</span> },
          {
            title: 'Forum Link',
            field: 'link',
            render: rowData => (
              <a href={rowData.link} target='_blank' rel='noopener noreferrer'>
                Click
              </a>
            )
          }
        ]}
        data={data}
        title='Patches List'
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
