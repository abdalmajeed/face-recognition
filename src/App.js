import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';


const particlesOptions = {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    }
  }
}
const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signin',
  temp: '',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box)=> {
    console.log(box);
    this.setState({box: box})
  }
  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})
    if (this.state.temp !== this.state.input) {
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response=> response.json())
        .then(response =>{
          if (response){
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers:{'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(res => res.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, {entries:count}))
              })
              .catch(console.log)
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
    }
    this.setState({temp: this.state.input});
  }

  onRouteChange = (route)=>{
    if (route === 'signout') {
      this.setState(initialState)
    }else if (route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route});
  }
  render(){
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
    <div className="App">
      <Particles className='particles'
      params={particlesOptions} 
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {
        route === 'home'
        ?<>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box} imageURL={imageURL}/>
        </>
        : (route === 'signin'
        ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        )
        
      }
    </div>
  );
    }
}

export default App;
