import React, { useEffect, useState } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import theme from '../../theme';
import { Store } from '../../state/Store';
import MTableFilterRow from './MTableFilterRow';
import { makeStyles } from '@material-ui/core/styles';

import FileViewer from './FileViewer';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    padding: theme.spacing(2)
  },
  details: {
    width: '89vw',
    padding: theme.spacing(2),
    backgroundColor: '#FFF'
  }
}));

const tableTheme = createMuiTheme({
  link: {
    color: '#990000'
  },
  palette: {
    primary: {
      main: '#990000'
    },
    secondary: {
      main: '#26725d'
    }
  },
  overrides: {
    MuiTableCell: {
      root: {
        height: 54
      },
      body: {
        fontSize: '.875rem'
      }
    }
  }
});

const containsSearchTerms = (term, data) => {
  const searchArr = term
    .toLowerCase()
    .trim()
    .split(' ');
  const lowerData = data.toLowerCase();
  const match = searchArr.every(x => lowerData.includes(x));
  return match;
};

const FileBrowser = () => {
  const classes = useStyles();
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

  const handleRowClick = (event, rowData, togglePanel) => {
    togglePanel();
  };

  return (
    <div className='FilesList'>
      <MuiThemeProvider theme={tableTheme}>
        <MaterialTable
          theme={theme}
          options={{
            pageSize: pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            filtering: true,
            searchFieldAlignment: 'right',
            padding: 'dense',
            filterCellStyle: { padding: '8px', paddingTop: '4px' }
          }}
          components={{ FilterRow: props => <MTableFilterRow {...props} /> }}
          columns={[
            { title: 'File ID', field: 'id', cellStyle: { width: '120px' }, type: 'numeric', searchable: false },
            {
              title: 'Name',
              field: 'name',
              customSort: (a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                return 0;
              },
              customFilterAndSearch: (term, rowData) => {
                return containsSearchTerms(term, rowData.name);
              }
            },
            {
              title: 'Comment',
              field: 'comment',
              cellStyle: { maxWidth: '300px' },
              customFilterAndSearch: (term, rowData) => {
                return containsSearchTerms(term, rowData.comment);
              }
            },
            {
              title: 'AttachID',
              field: 'attachId',
              filtering: true,
              searchable: false,
              cellStyle: { width: '80px' }
            },
            {
              title: 'SoundID',
              field: 'patchFiles',
              searchable: false,
              render: rowData => {
                if (rowData.patchFiles && rowData.patchFiles.length > 0) {
                  return <span>{rowData.patchFiles[0].patchId}</span>;
                }
                return null;
              },
              cellStyle: { width: '100px' },
              lookup: { 0: 'Unassigned', 1: 'Assigned' },
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
            {
              title: 'Extension',
              field: 'extension',
              cellStyle: { width: '80px' },
              searchable: false,
              lookup: { mp3: 'mp3', nsmp: 'nsmp', nspg: 'nspg', ns2p: 'ns2p', ns2pb: 'ns2pb', jpg: 'jpg', nss: 'nss', gif: 'gif', png: 'png' },
              render: rowData => <span>{rowData.extension}</span>,
              customFilterAndSearch: (items, rowData) => {
                return items.length === 0 || items.includes(rowData.extension);
              }
            },
            {
              title: 'Link',
              field: 'link',
              searchable: false,
              cellStyle: { width: '140px' },
              render: rowData =>
                rowData.link && (
                  <a href={rowData.link} target='_blank' rel='noopener noreferrer'>
                    Link
                  </a>
                ),
              filtering: false
            }
          ]}
          data={state.files}
          title='Admins only File list'
          onChangeRowsPerPage={handlePageSizeChange}
          onRowClick={handleRowClick}
          detailPanel={file => {
            return (
              <Box className={classes.detailsContainer}>
                <Box className={classes.details}>
                  <FileViewer file={file} />
                </Box>
              </Box>
            );
          }}
        />
      </MuiThemeProvider>
    </div>
  );
};
export default FileBrowser;
