import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import PatchViewer from './PatchViewer';
import PatchEditor from './PatchEditor';
import { nufFileLink } from './Common';
import FullPlayer from './FullPlayer';
import { useGlobalState } from '../../State';
import { dispatch } from '../../State';
import Rating from '@material-ui/lab/Rating';
import theme from '../../theme';
import { categories, instruments, blobUrl } from '../../Constants';
import { Typography } from '@material-ui/core';

const containsSearchTerms = (term, data) => {
  var searchArr = term
    .toLowerCase()
    .trim()
    .split(' ');
  var lowerData = data.toLowerCase();
  return searchArr.every(x => lowerData.includes(x));
};

const PatchBrowser = props => {
  const [patches] = useGlobalState('patches');
  const [myPatches] = useGlobalState('myPatches');
  const [user] = useGlobalState('user');
  const [pageSize] = useGlobalState('pageSize');
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [patchId, setPatchId] = useState(null);
  const [action, setAction] = useState('view');
  const [advancedFilters, setAdvancedFilters] = useState(false);
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
          dispatch({
            type: 'setPatches',
            patches: res
          });
        })
        .catch(err => {
          setError(true);
        });
    };
    const getMyData = async () => {
      const url = '/api/patch/user';
      const res = await RestUtilities.get(url);
      res
        .json()
        .then(res => {
          dispatch({
            type: 'setMyPatches',
            patches: res
          });
        })
        .catch(err => {
          setError(true);
        });
    };
    if (props.myPatches) {
      getMyData();
    } else {
      getAllData();
    }
  }, [props]);

  const renderRating = patch => {
    if (!patch.ratings) return null;
    const count = patch.ratings.length;
    const average = patch.ratings.reduce((p, c) => p + c.value, 0) / count;
    return (
      <Box display='flex' justifyContent='flex-end'>
        <Rating name='rating' value={average} precision={0.5} readOnly size='small' />({count})
      </Box>
    );
  };

  const renderMp3 = patch => {
    const mp3s = patch && patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
    if (mp3s.length === 0) return null;
    return mp3s.map(mp3 => {
      const link = mp3.isBlob ? `${blobUrl}/mp3s/${mp3.name}` : `${nufFileLink}${mp3.attachId}`;
      return <FullPlayer src={link} key={mp3.id} inverse />;
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

  const handlePageSizeChange = size => {
    dispatch({
      type: 'setPageSize',
      pageSize: size
    });
  };

  const getActionConfig = () => {
    const actionsConfig = [
      {
        icon: 'launch',
        onClick: (event, rowData) => {
          setAction('view');
          setPatchId(rowData.id);
          handleOpen();
        }
      },
      {
        icon: 'filter_list',
        onClick: () => {
          setAdvancedFilters(!advancedFilters);
        },
        isFreeAction: true,
        tooltip: 'Column Filters'
      }
    ];
    if (user.role === 'administrator' || props.myPatches) {
      actionsConfig.push({
        icon: 'edit',
        onClick: (event, rowData) => {
          setAction('edit');
          setPatchId(rowData.id);
          handleOpen();
        }
      });
    }
    return actionsConfig;
  };

  return (
    <div className='Patchlist'>
      {error && <p>There was an error getting data</p>}
      <MaterialTable
        theme={theme}
        localization={{
          header: {
            actions: ''
          }
        }}
        actions={getActionConfig()}
        options={{
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          filtering: advancedFilters,
          searchFieldAlignment: 'left',
          padding: 'dense'
        }}
        data={props.myPatches ? myPatches : patches}
        title={props.myPatches ? 'My Patches' : 'All Patches'}
        onChangeRowsPerPage={handlePageSizeChange}
        //parentChildData={(row, rows) => rows.find(a => a.id === row.parentPatchId)}
        columns={[
          {
            title: 'Id',
            field: 'id',
            filtering: true,
            customFilterAndSearch: (term, rowData) => {
              return rowData.id == term;
            },
            hidden: user.role !== 'administrator',
            searchable: false
          },
          {
            title: 'Name',
            field: 'name',
            customFilterAndSearch: (term, rowData) => {
              return containsSearchTerms(term, rowData.name);
            },
            filtering: false
          },
          {
            title: 'Description',
            field: 'description',
            cellStyle: { maxWidth: '300px' },
            render: rowData => (
              <Typography noWrap variant='body2'>
                {rowData.description}
              </Typography>
            ),
            customFilterAndSearch: (term, rowData) => {
              return containsSearchTerms(term, rowData.description);
            },
            filtering: false
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
            lookup: categories,
            customFilterAndSearch: (items, rowData) => items.length === 0 || (rowData.categoryId ? items.includes(rowData.categoryId.toString()) : false),
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
            searchable: false
          },
          {
            title: 'Type',
            field: 'instrumentId',
            render: rowData => <span>{instruments[rowData.instrumentId]}</span>,
            customFilterAndSearch: (items, rowData) => items.length === 0 || items.includes(rowData.instrumentId.toString()),
            lookup: instruments,
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
            searchable: false
          },
          {
            title: 'Mp3',
            field: 'patchFiles',
            render: rowData => renderMp3(rowData),
            lookup: { 1: 'Has MP3', 2: 'No Mp3' },
            customFilterAndSearch: (items, rowData) => {
              if (items.length !== 1) return true;
              const hasmp3 = rowData.patchFiles.some(x => x.file.extension === 'mp3');
              if (items[0] === '1') {
                return hasmp3;
              } else {
                return !hasmp3;
              }
            },
            filtering: true,
            searchable: false
          },
          {
            title: 'Rating',
            field: 'rating',
            render: rowData => renderRating(rowData),
            filtering: false
          }
        ]}
      />
      <Dialog maxWidth='md' open={open} onClose={handleClose} aria-labelledby='patch details' fullWidth maxWidth='md'>
        {action === 'view' && <PatchViewer patchId={patchId} onClose={handleClose} />}
        {action === 'edit' && <PatchEditor patchId={patchId} onClose={handleClose} />}
      </Dialog>
    </div>
  );
};
export default PatchBrowser;
