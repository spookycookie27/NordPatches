import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import 'react-table/react-table.css';
import { actionCreators } from '../../store/ActionCreators';
import RestUtilities from '../../services/RestUtilities';

import './Songlist.css';

const categoryConfig = [
  { id: 8, description: '20s' },
  { id: 7, description: '10s' },
  { id: 13, description: '00s' },
  { id: 5, description: '90s' },
  { id: 4, description: '80s' },
  { id: 3, description: '70s' },
  { id: 2, description: '60s' },
  { id: 1, description: '50s' },
  { id: 9, description: 'Folk/Traditional' },
  { id: 10, description: 'Various' },
  { id: 11, description: 'Classical' },
  { id: 12, description: 'Ceremony and Reception Music' },
  { id: 14, description: '2 Tone/Trojan/Rocksteady/Reggae' }
];

class Songlist extends Component {
  constructor(props) {
    super(props);
    this.onDeleteRepertoire = this.onDeleteRepertoire.bind(this);
    this.onCategorySelect = this.onCategorySelect.bind(this);
    this.onAddNewSong = this.onAddNewSong.bind(this);
    this.onSelectNewSong = this.onSelectNewSong.bind(this);
    this.state = {
      show: false,
      isLoading: false
    };
    this.refreshData();
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  // refreshData() {
  //   this.props.setLoading(true);
  //   fetch('api/Repertoire/')
  //     .then(response => response.json())
  //     .then(songs => {
  //       const songOptions = [];
  //       const artistOptions = [];
  //       songs.forEach(x => {
  //         const artistName = x.songArtistName ? x.songArtistName.trim() : '';
  //         if (!songOptions.find(s => s.label === x.songName && s.songArtistName === artistName)) {
  //           songOptions.push({ id: x.songId, label: x.songName, artist: artistName, catId: x.catId, catDescription: x.category.catDescription });
  //         }
  //         if (!artistOptions.find(a => a.id === artistName)) {
  //           artistOptions.push({ id: artistName, label: artistName });
  //         }
  //       });
  //       this.setState({ songOptions, artistOptions });
  //       this.props.setLoading(false);
  //     });
  // }

  // async fetchRepertoire(artistId) {
  //   this.props.setLoading(true);
  //   const url = `api/Repertoire/${artistId}`;
  //   const response = await RestUtilities.get(url);
  //   this.props.setLoading(false);
  //   if (response.ok) {
  //     this.props.setSonglist(response.content);
  //     this.props.setLoading(false);
  //   } else {
  //     this.props.setLoading(false);
  //     this.props.history.push('/login');
  //   }
  // }

  async onSelectNewSong() {
    const { song, artist, category, isNewSong } = this.state;
    const artistId = this.props.artist.artistId;
    this.props.setLoading(true);
    if (!isNewSong) {
      const songId = song[0].id;
      const isAlreadyPresent = this.props.songlist.find(x => x.songId === songId);
      if (isAlreadyPresent) {
        this.props.setLoading(false);
        return;
      }
      const url = `api/Repertoire/${this.props.artist.artistId}`;
      const artistRepertoire = {
        songId,
        artistId: artistId
      };
      const response = await RestUtilities.post(url, artistRepertoire);
      if (response.ok) {
        this.props.addToSonglist(response.content);
      }
    } else {
      const songName = song[0].label.replace(/\b\w/g, l => l.toUpperCase());
      const songArtistName = artist[0].label.replace(/\b\w/g, l => l.toUpperCase());
      const url = `api/Repertoire/NewSong/${artistId}`;
      const newSong = {
        songName,
        songArtistName,
        catId: category.id
      };
      const response = await RestUtilities.post(url, newSong);
      if (response.ok) {
        this.props.addToSonglist(response.content);
      }
    }
    this.props.setLoading(false);
    this.setState({ song: [], artist: [], category: null, isNewSong: false });
  }

  render() {
    const { songlist } = this.props;

    return (
      <div className='Songlist'>
        <h2>Patch List</h2>
        {songlist && songlist.length > 0 && (
          <ReactTable
            minRows={10}
            data={songlist}
            defaultPageSize={10}
            filterable
            defaultFilterMethod={(filter, row) => {
              return String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase());
            }}
            columns={[
              {
                id: 'songName',
                Header: 'Song',
                accessor: s => s.song.songName,
                Filter: ({ filter, onChange }) => (
                  <input type='text' placeholder='search song name' value={filter ? filter.value : ''} onChange={event => onChange(event.target.value)} />
                )
              },
              {
                id: 'artistName',
                Header: 'Artist',
                accessor: s => s.song.songArtistName,
                Filter: ({ filter, onChange }) => (
                  <input type='text' placeholder='search artist' value={filter ? filter.value : ''} onChange={event => onChange(event.target.value)} />
                )
              },
              {
                id: 'categoryDescription',
                Header: 'Category',
                accessor: s => s.song.category.catDescription,
                filterMethod: (filter, row) => {
                  if (filter.value === 'all') {
                    return true;
                  }
                  return row[filter.id].toLowerCase() === filter.value.toLowerCase();
                },
                Filter: ({ filter, onChange }) => (
                  <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: '100%' }}
                    value={filter ? filter.value : 'all'}
                    className='category-selector'
                  >
                    <option value='all'>All</option>
                    <option value='Noughties-Present'>Noughties-Present</option>
                    {categoryConfig.map(x => (
                      <option key={x.id} value={x.description}>
                        {x.description}
                      </option>
                    ))}
                  </select>
                )
              },
              {
                id: 'deleteButton',
                Header: '',
                Cell: row => {
                  return (
                    <div className='cell-button-container'>
                      <Button className='delete-button btn-danger' onClick={() => this.onDeleteRepertoire(row)} bsSize='xs'>
                        remove
                      </Button>
                    </div>
                  );
                },
                Filter: () => null
              }
            ]}
          />
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    songlist: state.songlist,
    artist: state.artist
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Songlist);
