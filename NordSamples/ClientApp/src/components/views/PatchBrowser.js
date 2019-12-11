import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import PatchViewer from '../common/PatchViewer';
import PatchEditor from '../common/PatchEditor';
import { nufFileLink } from '../common/Common';
import FullPlayer from '../common/FullPlayer';
import { useGlobalState } from '../../State';
import theme from '../../theme';

const PatchBrowser = props => {
  const [user] = useGlobalState('user');
  const [data, setData] = useState([]);
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
          setData(res);
        })
        .catch(err => {
          setError(true);
        });
    };
    getData();
  }, []);

  function renderMp3(patch) {
    const mp3s = patch && patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
    if (!mp3s[0]) return null;
    return <FullPlayer src={`${nufFileLink}${mp3s[0].attachId}`} onClick={preventDefault} inverse />;
  }

  const getActionConfig = () => {
    console.log(user);
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
          pageSize: 10,
          filtering: true,
          search: false
        }}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Description', field: 'description' },
          {
            title: 'Category',
            field: 'category',
            customFilterAndSearch: (term, rowData) => rowData.category && rowData.category.name.toLowerCase().includes(term.toLowerCase()),
            render: rowData => <span>{rowData.category ? rowData.category.name : ''}</span>
          },
          {
            title: 'Type',
            field: 'instrument',
            render: rowData => <span>{rowData.instrument.name}</span>,
            customFilterAndSearch: (term, rowData) => rowData.instrument && rowData.instrument.name.toLowerCase().includes(term.toLowerCase())
          },
          {
            title: 'Forum Link',
            field: 'link',
            filtering: false,
            render: rowData => (
              <a href={rowData.link} target='_blank' rel='noopener noreferrer'>
                Click
              </a>
            )
          },
          {
            title: 'Mp3',
            field: 'patchFiles',
            render: rowData => renderMp3(rowData),
            filtering: false
          }
        ]}
        data={data}
        title='Patches List'
      />
      <Dialog maxWidth='md' open={open} onClose={handleClose} aria-labelledby='patch details' fullWidth>
        <DialogContent dividers>
          {action === 'view' && <PatchViewer patchId={patchId} />}
          {action === 'edit' && <PatchEditor patchId={patchId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary' variant='contained'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default PatchBrowser;
