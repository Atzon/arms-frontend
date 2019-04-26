import React, {Component} from 'react';
import MapGL, {Marker, Popup, NavigationControl, FullscreenControl} from 'react-map-gl';

import ControlPanel from './ControlPanel';
import LocationPin from './LocationPin';
import LocationInfo from './LocationInfo';


import LOCATIONS from "./LocationsDb.json";

const TOKEN = "pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg";

const fullscreenControlStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px'
};

const navStyle = {
    position: 'absolute',
    top: 36,
    left: 0,
    padding: '10px'
};

export default class Main extends Component{

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: "100wh",
                height: "100vh",
                latitude: 50.0679198,
                longitude: 19.9107528,
                zoom: 15,
                bearing: 0,
                pitch: 0
            },
            popupInfo: null
        };
    }


    _updateViewport = (viewport) => {
        this.setState({viewport});
    };

    _renderLocationMarker = (location, index) => {
        return (
            <Marker
                key={`marker-${index}`}
                longitude={location.longitude}
                latitude={location.latitude} >
                <LocationPin size={20} onClick={() => this.setState({popupInfo: location})} />
            </Marker>
        );
    }

    _renderPopup() {
        const {popupInfo} = this.state;

        return popupInfo && (
            <Popup tipSize={5}
                   anchor="top"
                   longitude={popupInfo.longitude}
                   latitude={popupInfo.latitude}
                   closeOnClick={false}
                   onClose={() => this.setState({popupInfo: null})} >
                <LocationInfo info={popupInfo} />
            </Popup>
        );
    }



    render(){
        const {viewport} = this.state;

        return(
            <div>
                <MapGL
                    {...viewport}
                    // mapStyle="mapbox://styles/mapbox/dark-v9"
                    onViewportChange={this._updateViewport}
                    mapboxApiAccessToken={TOKEN} >

                    { LOCATIONS.map(this._renderLocationMarker) }

                    {this._renderPopup()}

                    <div className="fullscreen" style={fullscreenControlStyle}>
                        <FullscreenControl />
                    </div>
                    <div className="nav" style={navStyle}>
                        <NavigationControl onViewportChange={this._updateViewport} />
                    </div>

                    {/*<ControlPanel containerComponent={this.props.containerComponent} />*/}
                </MapGL>
            </div>
        );
    }
}
