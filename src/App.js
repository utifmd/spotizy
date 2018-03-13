import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let dataJson = {
  user: {
    name: 'Khalid',
    playlists: [
      {
        name: 'My favorites',
        songs: [
          {
            name: 'Bulughul haram',
            duration: 1345
          },
          {
            name: 'Minhajil muslim',
            duration: 1232
          },
          {
            name: 'Dosa besar',
            duration: 1000
          }
        ]
      },
      {
        name: 'Discover weekly',
        songs: [
          {
            name: 'Tingkatan zina', 
            duration: 1322
          },
          {
            name: 'Riyadushalihin', 
            duration: 2000
          },
          {
            name: 'Indahnya menjalin hubungan dgn sang pencipta',
            duration: 1022
          }
        ]
      },
      {
        name: 'Daily mix',
        songs: [
          {
            name: 'Mutiara musibah & cobaan', 
            duration: 1322
          },
          {
            name: 'Kitab tauhid',
            duration: 1324
          },
          {
            name:  'Sirah Nabawiyah',
            duration: 1333
          }
        ]
      }
    ]
  }
}

class PlCounter extends Component{
  render(){
    let getPlCounter = this.props.pl_counter;
    return(
      <div className = "App-counter">
        <h2>{getPlCounter.length} Playlists</h2>
      </div>
    )
  }
}

class DurCounter extends Component{
  render(){
    let getDuration = this.props.dur_counter.reduce((songs, eachPlaylist) => {
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
          this.props.txt_filter(event.target.value)
        }/>
      </div>
    )
  }
}

class PlContainer extends Component {
  render(){
    let getPlaylists = this.props.list

    return(
      <div className = "App-playlist">
        <h3>{getPlaylists.name}</h3>
        {
          getPlaylists.songs.map(song =>
            <li>{song.name}</li>
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
      serverData: {},
      stringFilter: ''
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.setState({serverData: dataJson})
    }, 1000);
  }
  render() {
    let getState = this.state, 
        getUsr = getState.serverData.user;

    let getPlToRender = getUsr && getUsr.playlists.filter(item =>
      item.name.toLowerCase().includes(
        this.state.stringFilter.toLowerCase()
      )
    )

    return (
      <div className="App">{ getUsr ? 
          <div>
            <h1>{getUsr.name}'s Playlists</h1>
            <Filter txt_filter = { text => 
              this.setState({stringFilter: text})
            } />
            <PlCounter pl_counter = {getPlToRender} />
            <DurCounter dur_counter = {getPlToRender} />
            {
              getPlToRender.map(items => 
                <PlContainer list = {items} />
              )
            }

          </div> : <h1>Loading..</h1> } 
      </div>
    );
  }
}

export default App;
