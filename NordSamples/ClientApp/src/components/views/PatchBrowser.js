import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import PatchViewer from '../common/PatchViewer';
import PatchEditor from '../common/PatchEditor';
import PatchCreator from '../common/PatchCreator';
import { nufFileLink } from '../common/Common';
import FullPlayer from '../common/FullPlayer';
import { useGlobalState } from '../../State';
import { dispatch } from '../../State';
import theme from '../../theme';
import { categories, instruments, blobUrl } from '../../Constants';

const PatchBrowser = props => {
  const [patches] = useGlobalState('patches');
  const [user] = useGlobalState('user');
  const [pageSize] = useGlobalState('pageSize');
  const [error, setError] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [patchId, setPatchId] = React.useState(null);
  const [action, setAction] = React.useState('view');

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getData = async () => {
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
    getData();
  }, []);

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
      // {
      //   icon: 'add',
      //   tooltip: 'Add Patch',
      //   isFreeAction: true,
      //   onClick: event => {
      //     setAction('create');
      //     handleOpen();
      //   }
      // },
      {
        icon: 'chevron_right',
        onClick: (event, rowData) => {
          setAction('view');
          setPatchId(rowData.id);
          handleOpen();
        }
      }
    ];
    if (user.role === 'administrator') {
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
          { title: 'Description', field: 'description' },
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
          }
        ]}
        data={patches}
        title='Patches List'
        onChangeRowsPerPage={handlePageSizeChange}
      />
      <Dialog maxWidth='md' open={open} onClose={handleClose} aria-labelledby='patch details' fullWidth>
        {action === 'view' && <PatchViewer patchId={patchId} onClose={handleClose} />}
        {action === 'edit' && <PatchEditor patchId={patchId} onClose={handleClose} />}
        {action === 'create' && <PatchCreator onClose={handleClose} />}
      </Dialog>
    </div>
  );
};
export default PatchBrowser;
