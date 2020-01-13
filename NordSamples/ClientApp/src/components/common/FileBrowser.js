import React, { useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { nufFileLink } from './Common';
import moment from 'moment';
import theme from '../../theme';
import { Store } from '../../state/Store';

const containsSearchTerms = (term, data) => {
  var searchArr = term
    .toLowerCase()
    .trim()
    .split(' ');
  var lowerData = data.toLowerCase();
  return searchArr.every(x => lowerData.includes(x));
};

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

const FileBrowser = () => {
  const { state, dispatch } = React.useContext(Store);
  const pageSize = state.pageSize;
  useEffect(() => {
    const getData = async () => {
      const url = '/api/file';
      const res = await RestUtilities.get(url);
      res
        .json()
        .then(res => {
          dispatch({
            type: 'setFiles',
            files: res
          });
        })
        .catch(err => {
          console.log(err);
        });
    };
    getData();
  }, [dispatch]);

  const handlePageSizeChange = size => {
    dispatch({
      type: 'setPageSize',
      pageSize: size
    });
  };

  return (
    <div className='FilesList'>
      <p>TODO - Will add some functionality to assign unsed MP3s to the correct sound. Watch this space! (Eventually this page will be deleted completely.)</p>
      <MaterialTable
        theme={theme}
        options={{
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          filtering: true,
          searchFieldAlignment: 'left',
          padding: 'dense',
          filterCellStyle: { paddingTop: '16px' }
        }}
        columns={[
          { title: 'File ID', field: 'id', cellStyle: { width: '120px' } },
          {
            title: 'Name',
            field: 'name',
            customSort: (a, b) => {
              if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
              if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              return 0;
            },
            cellStyle: { width: '240px' },
            customFilterAndSearch: (term, rowData) => {
              return containsSearchTerms(term, rowData.name);
            }
          },
          {
            title: 'Comment',
            field: 'comment',
            cellStyle: { width: '240px' },
            customFilterAndSearch: (term, rowData) => {
              return containsSearchTerms(term, rowData.name);
            }
          },
          {
            title: 'Assigned to Patch ID',
            field: 'patchFiles',
            render: rowData => {
              if (rowData.patchFiles && rowData.patchFiles.length > 0) {
                return <span>{rowData.patchFiles[0].patchId}</span>;
              }
              return null;
            },
            cellStyle: { width: '80px' },
            lookup: { 0: 'Unassigned', 1: 'Assigned' },
            filterCellStyle: { padding: '4px', paddingTop: 0, paddingBottom: '16px' },
            customFilterAndSearch: (items, rowData) => {
              if (items.length !== 1) return true;
              const hasPatch = rowData.patchFiles.length > 0;
              if (items[0] === '1') {
                return hasPatch;
              } else {
                return !hasPatch;
              }
            }
          },
          { title: 'Size', field: 'size', cellStyle: { width: '80px' } },
          {
            title: 'Extension',
            field: 'extension',
            cellStyle: { width: '80px' },
            lookup: { mp3: 'mp3', nsmp: 'nsmp', nspg: 'nspg', ns2p: 'ns2p', ns2pb: 'ns2pb', jpg: 'jpg', nss: 'nss', gif: 'gif', png: 'png' },
            filterCellStyle: { padding: '4px', paddingTop: 0, paddingBottom: '16px' },
            render: rowData => <span>{rowData.extension}</span>,
            customFilterAndSearch: (items, rowData) => {
              return items.length === 0 || items.includes(rowData.extension);
            }
          }
        ]}
        data={state.files}
        title='Admins only File list'
        onChangeRowsPerPage={handlePageSizeChange}
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
export default FileBrowser;
