import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import PatchViewer from '../common/PatchViewer';
import PatchEditor from '../common/PatchEditor';
import { nufFileLink } from '../common/Common';
import FullPlayer from '../common/FullPlayer';
import { useGlobalState } from '../../State';
import { dispatch } from '../../State';
import theme from '../../theme';
import { categories, instruments } from '../../Constants';

const PatchBrowser = props => {
  const [patches] = useGlobalState('patches');
  const [user] = useGlobalState('user');
  const [error, setError] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [patchId, setPatchId] = React.useState(null);
  const [action, setAction] = React.useState('view');
  const preventDefault = event => event.preventDefault();

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
    if (!mp3s[0]) return null;
    return <FullPlayer src={`${nufFileLink}${mp3s[0].attachId}`} onClick={preventDefault} inverse />;
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

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

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
          pageSize: 10
        }}
        columns={[
          { title: 'Id', field: 'id', filtering: false },
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
            field: 'category',
            render: rowData => <span>{categories[rowData.categoryId]}</span>,
            customFilterAndSearch: (term, rowData) => rowData.categoryId && categories[rowData.categoryId].toLowerCase().includes(term.toLowerCase())
          },
          {
            title: 'Type',
            field: 'instrument',
            render: rowData => <span>{instruments[rowData.instrumentId]}</span>,
            customFilterAndSearch: (term, rowData) => instruments[rowData.instrumentId].toLowerCase().includes(term.toLowerCase())
          },
          {
            title: 'Mp3',
            field: 'patchFiles',
            render: rowData => renderMp3(rowData),
            filtering: false
          }
        ]}
        data={patches}
        title='Patches List'
      />
      <Dialog maxWidth='md' open={open} onClose={handleClose} aria-labelledby='patch details' fullWidth>
        {action === 'view' && <PatchViewer patchId={patchId} onClose={handleClose} />}
        {action === 'edit' && <PatchEditor patchId={patchId} onClose={handleClose} />}
      </Dialog>
    </div>
  );
};
export default PatchBrowser;
