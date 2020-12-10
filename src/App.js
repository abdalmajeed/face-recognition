import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';

const app = new Clarifai.App({
 apiKey: 'a961c4dd421341caa55fdd0025f09bb1'
});


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
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      temp: '',
      isSignedIn: false
    }
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
      app.models.predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
        .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));
    }
    this.setState({temp: this.state.input});
  }

  onRouteChange = (route)=>{
    if (route === 'signout') {
      this.setState({isSignedIn: false})
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
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box} imageURL={imageURL}/>
        </>
        : (route === 'signin'
        ?<Signin onRouteChange={this.onRouteChange}/>
        :<Register onRouteChange={this.onRouteChange}/>
        )
        
      }
    </div>
  );
    }
}

export default App;
