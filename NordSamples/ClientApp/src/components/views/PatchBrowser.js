import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import PatchViewer from './PatchViewer';
import { nufFileLink } from '../common/Common';
import Player from '../common/Player';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

const PatchBrowser = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [patchId, setPatchId] = React.useState(null);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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

  function renderMp3(patch) {
    const mp3s = patch && patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
    if (!mp3s[0]) return null;
    return <Player src={`${nufFileLink}${mp3s[0].attachId}`} />;
  }

  function renderViewIcon(patch) {
    return <ZoomInIcon />;
  }

  return (
    <div className='Patchlist'>
      {error && <p>There was an error getting data</p>}
      <MaterialTable
        //onRowClick={(e, rowData) => {}}
        actions={[
          {
            icon: () => <ZoomInIcon />,
            onClick: (event, rowData) => {
              setPatchId(rowData.id);
              handleOpen();
            }
          }
        ]}
        options={{ pageSize: 10, padding: 'dense' }}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Description', field: 'description' },
          {
            title: 'Mp3',
            field: 'patchFiles',
            render: rowData => renderMp3(rowData)
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
      />
      <Dialog maxWidth='md' open={open} onClose={handleClose} aria-labelledby='patch details' fullWidth>
        <DialogContent dividers>
          <PatchViewer patchId={patchId} />
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
