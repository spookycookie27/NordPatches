import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import PatchViewer from './PatchViewer';
import PatchEditor from './PatchEditor';
import { nufFileLink } from './Common';
import FullPlayer from './FullPlayer';
import Rating from '@material-ui/lab/Rating';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { categories, categoriesLu, instruments, instrumentsLu, blobUrl } from '../../Constants';
import { Typography } from '@material-ui/core';
import { Store } from '../../state/Store';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MTableFilterRow from './MTableFilterRow';

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
        height: 50
      },
      body: {
        fontSize: '.875rem'
      }
    }
  }
});

const renderRating = patch => {
  if (!patch.ratings) return null;
  const count = patch.ratings.length;
  const average = patch.ratings.reduce((p, c) => p + c.value, 0) / count;
  return (
    <Box display='flex'>
      <Rating name='rating' value={average} precision={0.5} readOnly size='small' />({count})
    </Box>
  );
};

const renderMp3 = patch => {
  const mp3s = patch && patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
  if (mp3s.length === 0) return null;
  return mp3s.map(mp3 => {
    if (mp3.removed) return null;
    const link = mp3.isBlob ? `${blobUrl}/mp3s/${mp3.name}` : `${nufFileLink}${mp3.attachId}`;
    return <FullPlayer src={link} key={mp3.id} inverse id={mp3.id} context='patchBrowser' />;
  });
};

const getTags = tags => {
  return tags.length > 0
    ? tags.map((t, i) => (
        <span key={t.name}>
          {t.name}
          {i < tags.length - 1 && ', '}
        </span>
      ))
    : null;
};

const getInitialColumns = user => [
  {
    title: 'Name',
    field: 'name',
    customFilterAndSearch: (term, rowData) => {
      return containsSearchTerms(term, rowData.name);
    },
    filtering: false,
    customSort: (a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    },
    cellStyle: { width: '200px' }
  },
  {
    title: 'Description',
    field: 'description',
    cellStyle: { maxWidth: '320px', minWidth: '100px' },
    render: rowData => (
      <Typography noWrap variant='body2'>
        {rowData.description}
      </Typography>
    ),
    customFilterAndSearch: (term, rowData) => {
      return containsSearchTerms(term, rowData.description);
    },
    filtering: false,
    customSort: (a, b) => {
      if (a.description.toLowerCase() < b.description.toLowerCase()) return -1;
      if (a.description.toLowerCase() > b.description.toLowerCase()) return 1;
      return 0;
    }
  },
  {
    title: 'Tags',
    field: 'tags',
    render: rowData => getTags(rowData.tags),
    customFilterAndSearch: (term, rowData) => {
      const lowerTags = rowData.tags.map(t => t.name.toLowerCase());
      const searchArr = term
        .toLowerCase()
        .trim()
        .split(' ');
      return searchArr.every(x => lowerTags.some(y => y.includes(x)));
    },
    filtering: false
  },
  {
    title: 'Category',
    field: 'categoryId',
    render: rowData => <span>{categories[rowData.categoryId]}</span>,
    lookupArr: categoriesLu,
    customFilterAndSearch: (items, rowData) => items.length === 0 || (rowData.categoryId ? items.includes(rowData.categoryId) : false),
    filtering: true,
    customSort: (a, b) => {
      if (a.categoryId === b.categoryId) {
        return 0;
      } else if (!a.categoryId) {
        return 1;
      } else if (!b.categoryId) {
        return -1;
      } else {
        return categories[a.categoryId] < categories[b.categoryId] ? -1 : 1;
      }
    },
    searchable: false,
    cellStyle: { maxWidth: '130px', width: '130px' }
  },
  {
    title: 'Type',
    field: 'instrumentId',
    render: rowData => <span>{instruments[rowData.instrumentId]}</span>,
    customFilterAndSearch: (items, rowData) => items.length === 0 || items.includes(rowData.instrumentId),
    lookupArr: instrumentsLu,
    filtering: true,
    customSort: (a, b) => {
      if (a.instrumentId === b.instrumentId) {
        return 0;
      } else if (!a.instrumentId) {
        return 1;
      } else if (!b.instrumentId) {
        return -1;
      } else {
        return instruments[a.instrumentId] < instruments[b.instrumentId] ? -1 : 1;
      }
    },
    searchable: false,
    cellStyle: {
      maxWidth: '80px',
      width: '80px'
    }
  },
  {
    title: 'Mp3',
    field: 'patchFiles',
    render: rowData => renderMp3(rowData),
    customFilterAndSearch: (items, rowData) => {
      const hasmp3 = rowData.patchFiles.some(x => x.file.extension === 'mp3');
      if (items === 'checked') {
        return hasmp3;
      } else {
        return !hasmp3;
      }
    },
    filtering: true,
    searchable: false,
    cellStyle: {
      width: '80px'
    },
    type: 'boolean'
  },
  {
    title: 'User',
    field: 'user',
    render: rowData => rowData.user && rowData.user.username,
    filtering: true,
    searchable: false,
    customFilterAndSearch: (term, rowData) => {
      if (!rowData.user || rowData.user.username.length === 0) return true;
      return containsSearchTerms(term, rowData.user.username);
    },
    cellStyle: { width: '140px' }
  },
  {
    title: 'Rating',
    field: 'rating',
    render: rowData => renderRating(rowData),
    filtering: false,
    cellStyle: { width: '110px', padding: 0 }
  },
  {
    title: 'Id',
    field: 'id',
    type: 'numeric',
    filtering: true,
    customFilterAndSearch: (term, rowData) => {
      return rowData.id.toString() === term;
    },
    hidden: user.role !== 'administrator',
    searchable: false,
    cellStyle: { width: '100px' }
  }
];

const containsSearchTerms = (term, data) => {
  var searchArr = term
    .toLowerCase()
    .trim()
    .split(' ');
  var lowerData = data.toLowerCase();
  return searchArr.every(x => lowerData.includes(x));
};

const PatchBrowser = props => {
  const { state, dispatch } = React.useContext(Store);
  const [columns, setColumns] = useState(getInitialColumns(state.user));
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [patchId, setPatchId] = useState(null);
  const [action, setAction] = useState('view');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getAllData = async () => {
      const url = '/api/patch';
      const res = await RestUtilities.get(url);
      res
        .json()
        .then(res => {
          const userPatches = res ? res.filter(x => (x.user && x.user.id === state.user.id) || (x.user && x.user.nufUserId === state.user.nufUserId)) : [];
          const publicPatches = res ? res.filter(x => !x.removed) : [];
          dispatch({
            type: 'setPatches',
            patches: publicPatches
          });
          dispatch({
            type: 'setMyPatches',
            patches: userPatches
          });
        })
        .catch(err => {
          setError(true);
        });
    };
    getAllData();
  }, [props, state.user, dispatch]);

  const handlePageSizeChange = size => {
    dispatch({
      type: 'setPageSize',
      pageSize: size
    });
  };

  const shouldShowEdit = rowData => {
    return (
      state.user.role === 'administrator' ||
      (rowData.user && rowData.user.nufUserId === state.user.nufUserId) ||
      (rowData.user && rowData.user.id === state.user.id)
    );
  };

  const mySoundsToggle = (
    <FormControlLabel
      control={
        <Switch
          color='primary'
          checked={state.mySounds}
          onChange={() => {
            dispatch({
              type: 'setMySounds',
              mySounds: !state.mySounds
            });
          }}
        />
      }
      label='My Sounds'
    />
  );

  const actions = [
    {
      icon: 'launch',
      onClick: (event, rowData) => {
        dispatch({
          type: 'setPlayMp3Id',
          id: null
        });
        setAction('view');
        setPatchId(rowData.id);
        handleOpen();
      }
    },
    rowData => ({
      icon: 'edit',
      onClick: (event, rowData) => {
        dispatch({
          type: 'setPlayMp3Id',
          id: null
        });
        setAction('edit');
        setPatchId(rowData.id);
        handleOpen();
      },
      hidden: !shouldShowEdit(rowData)
    }),
    {
      icon: () => {
        return mySoundsToggle;
      },
      onClick: event => {},
      isFreeAction: true,
      tooltip: 'Show My Sounds',
      hidden: state.myPatches.length === 0
    },
    {
      icon: 'filter_list',
      onClick: () => {
        dispatch({
          type: 'setColumnFilters',
          columnFilters: !state.columnFilters
        });
      },
      isFreeAction: true,
      tooltip: 'Toggle Column Filters'
    },
    {
      icon: 'clear_all',
      onClick: () => {
        setColumns(getInitialColumns(state.user));
      },
      isFreeAction: true,
      tooltip: 'Clear Filters'
    }
  ];

  const handleRowClick = (event, rowData) => {
    if (!['svg', 'path'].includes(event.target.nodeName)) {
      setAction('view');
      setPatchId(rowData.id);
      handleOpen();
    }
  };

  return (
    <div className='Patchlist'>
      {error && <p>There was an error getting data</p>}
      <MuiThemeProvider theme={tableTheme}>
        <MaterialTable
          localization={{
            header: { actions: '' }
          }}
          onRowClick={handleRowClick}
          actions={actions}
          options={{
            pageSize: state.pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            filtering: state.columnFilters,
            searchFieldAlignment: 'left',
            padding: 'dense',
            filterCellStyle: { padding: '8px', paddingTop: '4px' }
          }}
          components={{ FilterRow: props => <MTableFilterRow {...props} /> }}
          data={state.mySounds ? state.myPatches : state.patches}
          title={state.mySounds ? 'My Sounds' : 'All Sounds'}
          onChangeRowsPerPage={handlePageSizeChange}
          //parentChildData={(row, rows) => rows.find(a => a.id === row.parentPatchId)}
          columns={columns}
        />
      </MuiThemeProvider>
      <Dialog maxWidth='md' open={open} onClose={handleClose} aria-labelledby='patch details' fullWidth>
        {action === 'view' && <PatchViewer patchId={patchId} onClose={handleClose} />}
        {action === 'edit' && <PatchEditor patchId={patchId} onClose={handleClose} />}
      </Dialog>
    </div>
  );
};
export default PatchBrowser;
