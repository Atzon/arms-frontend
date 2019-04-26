import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';


export default class Main extends Component{

    state = {
        viewport: {
            width: 400,
            height: 400,
            latitude: 50.0679198,
            longitude: 19.9107528,
            zoom: 15
        }
    };

    render(){
        const position = [51.505, -0.09];
        return(
            <div>
                <ReactMapGL
                    {...this.state.viewport}
                    mapboxApiAccessToken={"pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg"}
                    onViewportChange={(viewport) => this.setState({viewport})}
                >
                </ReactMapGL>
            </div>
        );
    }
}
