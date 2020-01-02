import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
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

const PatchBrowser = props => {
  const [patches] = useGlobalState('patches');
  const [myPatches] = useGlobalState('myPatches');
  const [user] = useGlobalState('user');
  const [pageSize] = useGlobalState('pageSize');
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
    return <Rating name='rating' value={average} precision={0.5} readOnly size='small' />;
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
        icon: 'chevron_right',
        onClick: (event, rowData) => {
          setAction('view');
          setPatchId(rowData.id);
          handleOpen();
        }
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
          pageSize: pageSize
        }}
        columns={[
          { title: 'Id', field: 'id' },
          { title: 'Name', field: 'name' },
          {
            title: 'Description',
            field: 'description',
            cellStyle: { maxWidth: '300px' },
            render: rowData => (
              <Typography noWrap variant='body2'>
                {rowData.description}
              </Typography>
            )
          },
          {
            title: 'Tags',
            field: 'tags',
            render: rowData => getTags(rowData.tags),
            customFilterAndSearch: (term, rowData) => {
              return rowData.tags
                .map(t => t.name.toLowerCase())
                .some(v => {
                  return v.indexOf(term.toLowerCase()) >= 0;
                });
            }
          },
          {
            title: 'Category',
            field: 'categoryId',
            render: rowData => <span>{categories[rowData.categoryId]}</span>,
            customFilterAndSearch: (term, rowData) => rowData.categoryId && categories[rowData.categoryId].toLowerCase().includes(term.toLowerCase()),
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
            }
          },
          {
            title: 'Type',
            field: 'instrumentId',
            render: rowData => <span>{instruments[rowData.instrumentId]}</span>,
            customFilterAndSearch: (term, rowData) => instruments[rowData.instrumentId].toLowerCase().includes(term.toLowerCase()),
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
            }
          },
          {
            title: 'Mp3',
            field: 'patchFiles',
            render: rowData => renderMp3(rowData)
          },
          {
            title: 'Rating',
            field: 'rating',
            render: rowData => renderRating(rowData)
          }
        ]}
        data={props.myPatches ? myPatches : patches}
        title={props.myPatches ? 'My Patches' : 'All Patches'}
        onChangeRowsPerPage={handlePageSizeChange}
      />
      <Dialog maxWidth='md' open={open} onClose={handleClose} aria-labelledby='patch details' fullWidth>
        {action === 'view' && <PatchViewer patchId={patchId} onClose={handleClose} />}
        {action === 'edit' && <PatchEditor patchId={patchId} onClose={handleClose} />}
      </Dialog>
    </div>
  );
};
export default PatchBrowser;
