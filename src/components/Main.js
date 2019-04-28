import React, {Component} from 'react';
import MapGL, {Marker, Popup, NavigationControl, FullscreenControl} from 'react-map-gl';

import ControlPanel from './ControlPanel';
import LocationPin from './LocationPin';
import LocationInfo from './LocationInfo';
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from 'react-map-gl-geocoder'
import 'antd/lib/menu/style/css';
import '../Geocoder.css';

import LOCATIONS from "./LocationsDb.json";

const TOKEN = "pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg";


const fullscreenControlStyle = {
    position: 'absolute',
    bottom: 50,
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
                width: '100vw',
                height: '100vh',
                latitude: 50.0679198,
                longitude: 19.9107528,
                zoom: 15
            },
            popupInfo: null,
            panelVisible: false,
            searchResultLayer: null
        };
        this.handleViewportChange = this.handleViewportChange.bind(this);
        this.onCloseControlPanel = this.onCloseControlPanel.bind(this);
    }


    mapRef = React.createRef();

    componentDidMount() {
        window.addEventListener("resize", this.resize);
        this.resize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    resize = () => {
        this.handleViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    handleViewportChange = viewport => {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    };


    _renderLocationMarker = (location, index) => {
        return (
            <Marker
                key={`marker-${index}`}
                longitude={location.longitude}
                latitude={location.latitude} >
                <LocationPin size={20} onClick={() => this.setState({popupInfo: location, panelVisible: true})} />
            </Marker>
        );
    }

    onCloseControlPanel(){
        this.setState({
            panelVisible: false
        })
    }
    _renderPopup() {
        const {popupInfo} = this.state;

        return popupInfo && (
            <Popup tipSize={5}
                   anchor="top"
                   longitude={popupInfo.longitude}
                   latitude={popupInfo.latitude}
                   closeOnClick={false}
                   onClose={() => this.setState({popupInfo: null, panelVisible: false})} >
                <LocationInfo info={popupInfo} />
            </Popup>
        );
    }

    handleGeocoderViewportChange = viewport => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 };

        return this.handleViewportChange({
            ...viewport,
            ...geocoderDefaultOverrides
        });
    };

    handleOnResult = event => {
        console.log(event.result);
        this.setState({
            searchResultLayer: new GeoJsonLayer({
                id: "search-result",
                data: event.result.geometry,
                getFillColor: [255, 0, 0, 128],
                getRadius: 1000,
                pointRadiusMinPixels: 10,
                pointRadiusMaxPixels: 10
            })
        });
    };

    render(){
        const { viewport, searchResultLayer } = this.state;

        return(
            <MapGL
                ref={this.mapRef}
                {...viewport}
                // mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={this.handleViewportChange}
                mapboxApiAccessToken={TOKEN} >

                { LOCATIONS.map(this._renderLocationMarker) }

                {this._renderPopup()}

                <Geocoder
                    mapRef={this.mapRef}
                    onResult={this.handleOnResult}
                    onViewportChange={this.handleGeocoderViewportChange}
                    mapboxApiAccessToken={TOKEN}
                    position="top-left"
                />
                {/*<DeckGL {...viewport} layers={[searchResultLayer]} />*/}

                <div className="fullscreen" style={fullscreenControlStyle}>
                    <FullscreenControl />
                </div>
                <div className="nav" style={navStyle}>
                    <NavigationControl onViewportChange={this.handleViewportChange} />
                </div>
                {this.state.panelVisible ?
                    <ControlPanel popupInfo={this.state.popupInfo} onClose={this.onCloseControlPanel} />
                    :
                    <div></div>
                }
            </MapGL>

        );
    }
}
