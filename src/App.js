import React, { Component } from 'react';
import queryString from 'query-string';
//import logo from './logo.svg';
import './App.css';

class PlCounter extends Component{
  render(){
    let getPlCounter = this.props.value;
    return(
      <div className = "App-counter">
        <h2>{getPlCounter.length} Playlists</h2>
      </div>
    )
  }
}

class DurCounter extends Component{
  render(){
    let getDuration = this.props.value.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])

    let getAllDuration = getDuration.reduce((sum, eachSongs) => {
      return sum + eachSongs.duration
    }, 0)

    return(
      <div className = "App-counter">
        <h2>{
            Math.floor(getAllDuration/60) //konversi ke hitungan jam
          } Hours</h2>
      </div>
    )
  }
}

class Filter extends Component{
  render(){
    return(
      <div>
        <input type="text" className= "App-text-box" onKeyUp = {event =>
          this.props.value(event.target.value)
        }/>
      </div>
    )
  }
}

class PlContainer extends Component {
  render(){
    let getPlaylists = this.props.value

    return(
      <div className = "App-playlist">
        <img className="cover-playlist" src={getPlaylists.img_url} alt=""/>
        <h3>{getPlaylists.name}</h3>
        {
          getPlaylists.songs.slice(0, 3).map((song, id) =>
            <li key={id}>{song.name}</li>
          )
        }
      </div>
    )
  }
}

class App extends Component {
  constructor(){
    super()
    this.state = {
      stringFilter: '' //serverData: {}, // user: {}, // playlists: {},
    }
  }
  componentDidMount(){
    let parsed = queryString.parse(window.location.search),
        accessToken = parsed.access_token,
        spotifyIcon = 'https://www.scdn.co/i/_global/favicon.png';

    const options = {
      headers : {
        'Authorization': 'Bearer '+ accessToken
      }
    }

    fetch('https://api.spotify.com/v1/me', options)
      .then(resp => resp.json()).then(data => this.setState({
        user: {
          uid: data.id,
          name: data.display_name,
          email: data.email,
          country: data.country
        }
      })
    ).catch(error => console.log('Buka dengan spotify'));

    fetch('https://api.spotify.com/v1/me/playlists', options)
      .then(resp => resp.json())
      .then(playlistsData => {
        let getPlaylists = playlistsData.items
        let mPromises = getPlaylists.map(playlist => {
              let reqPromise = fetch(playlist.tracks.href, options)
              let gotPromise = reqPromise.then(resp => resp.json())
              return gotPromise
            })
        let getPromise = Promise.all(mPromises)
        let mPlaylists = getPromise.then(trackData => {
          trackData.forEach((trackItem, i) => {
            getPlaylists[i].trackData = trackItem.items.map(item => item.track)
          })
          return getPlaylists
        })
        return mPlaylists
      })
      .then(playlistsData => {
          this.setState({
            playlists: playlistsData.map(item => { //console.log(item)
              return{
                pid: item.id,
                name: item.name,
                img_url: item.images[0] ? item.images[0].url : spotifyIcon,
                songs: item.trackData.map(data =>({
                  name: data.name,
                  duration: data.duration_ms / 1000
                }))
              }
            }
          )
        })
      }
    ).catch(error => console.log(error));

    // setTimeout(() => {
    //   this.setState({serverData: dataJson})
    // }, 1000);
  }
  render() {
    let getState = this.state, 
        getUsr = getState.user,
        getPls = getState.playlists
        //getUsr = getState.serverData.user

    let getPlToRender = getUsr && getPls
    ? getPls.filter(playItem =>{
        let matchPlaylist = playItem.name.toLowerCase().includes(
            getState.stringFilter.toLowerCase()
          )
        let matchSong = getUsr && playItem.songs.find(songItem => 
          songItem.name.toLowerCase().includes(
            getState.stringFilter.toLowerCase()
          )
        )
        return matchPlaylist || matchSong
        }
      )
    : []

    return (
      <div className="App">{ getUsr && getPls
        ? <div>
            <h1>{getUsr.name}'s Playlists</h1>
            <Filter value = { text => 
              this.setState({stringFilter: text})
            } />
            <PlCounter value = {getPlToRender} />
            <DurCounter value = {getPlToRender} />
            {
              getPlToRender.map((items, id) => //console.log(items)
                <PlContainer key={id} value={items} />
              )
            }
          </div> 
        : <button className="Btn-login-spotify" onClick={()=> {
              window.location = window.location.href.includes('localhost')
              ? 'http://localhost:8888/login'
              : 'https://spotizy-backend.herokuapp.com/login'
            }
          }>Open using Spotify</button> } 
      </div>
    );
  }
}

export default App;
