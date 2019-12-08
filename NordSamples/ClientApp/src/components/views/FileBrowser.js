import React from 'react';
// import RestUtilities from '../../services/RestUtilities';
// import MaterialTable from 'material-table';
// import Box from '@material-ui/core/Box';
// import Grid from '@material-ui/core/Grid';
// import { nufFileLink } from '../common/Common';
// import moment from 'moment';

// function getPatchData(patch) {
//   var mp3s = patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
//   var displayDate = patch.dateCreated ? moment(patch.dateCreated).format('Do MMM YYYY') : 'unknown';
//   return (
//     <>
//       <Box>
//         <strong>Patch ID:</strong> {patch.id}
//       </Box>
//       <Box>
//         <strong>Date Created:</strong> {displayDate}
//       </Box>
//       <Box>
//         <strong>Category:</strong> {patch.category || 'none'}
//       </Box>
//       <Box>
//         <strong>Description:</strong> {patch.description || 'none'}
//       </Box>
//       <Box>
//         <strong>Instrument Type:</strong> {patch.instrument.name || 'none'}
//       </Box>
//       <Box>
//         <strong>User:</strong> {patch.user.username || 'none'}
//       </Box>
//       <Box>
//         <strong>User ID:</strong> {patch.user.nufUserId || 'none'}
//       </Box>
//       {mp3s && (
//         <Box>
//           {mp3s.map(mp3 => (
//             <audio key={mp3.id} controls>
//               <source src={`${nufFileLink}${mp3.attachId}`} type='audio/mpeg' />
//             </audio>
//           ))}
//         </Box>
//       )}
//     </>
//   );
// }

// function getFileData(file) {
//   return (
//     <Box key={file.id}>
//       <Box>
//         <strong>File ID:</strong> {file.id}
//       </Box>
//       <Box>
//         <strong>Name:</strong> {file.name}
//       </Box>
//       <Box>
//         <strong>Size (bytes):</strong> {file.size}
//       </Box>
//       <Box>
//         <strong>Extension:</strong> {file.extension}
//       </Box>
//       <Box>
//         <strong>Version:</strong> {file.version}
//       </Box>
//       <Box>
//         <a href={`${nufFileLink}${file.attachId}`}>Download: {file.name}</a>
//       </Box>
//     </Box>
//   );
// }

const FileBrowser = () => {
  // const [data, setData] = useState([]);
  // const [error, setError] = useState(false);
  // async function getData() {
  //   console.log('getting data');
  //   const url = '/api/patches';
  //   const res = await RestUtilities.get(url);
  //   res
  //     .json()
  //     .then(res => {
  //       setData(res);
  //       console.log(res[0]);
  //     })
  //     .catch(err => {
  //       setError(true);
  //       console.log(err);
  //     });
  // }
  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <div className='Filelist'>
      <p>Under Construction</p>
      {/* <MaterialTable
        options={{ pageSize: 20, padding: 'dense' }}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Description', field: 'description' },
          { title: 'Category', field: 'category' },
          { title: 'Type', field: 'instrument', render: rowData => <span>{rowData.instrument.name}</span> },
          { title: 'User', field: 'user', render: rowData => <span>{rowData.user.username}</span> },
          {
            title: 'Link',
            field: 'link',
            render: rowData => (
              <a href={rowData.link} target='_blank' rel='noopener noreferrer'>
                Click
              </a>
            )
          }
        ]}
        data={data}
        title='Programs and Samples list'
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
      /> */}
    </div>
  );
};
export default FileBrowser;
