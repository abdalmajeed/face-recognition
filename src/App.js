import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
 apiKey: 'a961c4dd421341caa55fdd0025f09bb1'
});

// app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
//       .then(generalModel => {
//         return generalModel.predict("@@sampleTrain");
//       })
//       .then(response => {
//         let concepts = response['outputs'][0]['data']['concepts']
//       })

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

    }
  }

  onInputChange = (event)=> {
    console.log(event.target.value);
  }

  onButtonSubmit = () => {
    console.log('click');

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      "https://samples.clarifai.com/metro-north.jpg")
      .then(
    function(response) {
      // do something with response
      console.log(response);
    },
    function(err) {
      // there was an error
      console.log(err)
    }
  );
  }

  render(){
    return (
    <div className="App">
      <Particles className='particles'
      params={particlesOptions} 
      />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition />

    </div>
  );
    }
}

export default App;
