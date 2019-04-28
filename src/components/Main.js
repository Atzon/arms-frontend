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
import CONTENT from "./content.json";

const TOKEN = "pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg";
const HEATMAP_SOURCE_ID = "earthquakes-source";

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

const content =[];
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
            searchResultLayer: null,
            earthquakes: null
        };
        this.handleViewportChange = this.handleViewportChange.bind(this);
        this.onCloseControlPanel = this.onCloseControlPanel.bind(this);
        this._mapRef = React.createRef();
        this._handleMapLoaded = this._handleMapLoaded.bind(this);
    }

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

    _mkHeatmapLayer = (id, source) => {
        const MAX_ZOOM_LEVEL = 20;
        return {
            id,
            source,
            maxzoom: 20,
            type: 'heatmap',
            paint: {
                // Increase the heatmap weight based on frequency and property magnitude
                "heatmap-weight": [
                    "interpolate",
                    ["linear"],
                    ["get", "mag"],
                    0, 0,
                    10, 5
                ],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(0,128,0,0)",
                    0.2, "rgb(68,171,0)",
                    0.4, "rgb(190,223,0)",
                    0.6, "rgb(221,193,0)",
                    0.8, "rgb(240,101,0)",
                    0.9, "rgb(255,0,0)"
                ],
                // Adjust the heatmap radius by zoom level
                "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 2,
                    MAX_ZOOM_LEVEL, 20
                ],
            }
        }
    };

    _getMap = () => {
        return this._mapRef.current ? this._mapRef.current.getMap() : null;
    };

    _handleMapLoaded = event => {
        const map = this._getMap();


        const features = CONTENT.features;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;

        this.setState({ earthquakes: CONTENT, endTime, startTime, selectedTime: endTime });
        map.addSource(HEATMAP_SOURCE_ID, { type: "geojson", data: CONTENT});
        map.addLayer(this._mkHeatmapLayer("heatmap-layer", HEATMAP_SOURCE_ID));
    };

    _setMapData = features => {
        const map = this._getMap();
        map && map.getSource(HEATMAP_SOURCE_ID).setData(this._mkFeatureCollection(features));
    }

    render(){
        const { viewport, searchResultLayer } = this.state;

        return(
            <MapGL
                ref={this._mapRef}
                {...viewport}
                // mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={this.handleViewportChange}
                onLoad={this._handleMapLoaded}
                mapboxApiAccessToken={TOKEN} >

                { LOCATIONS.map(this._renderLocationMarker) }

                {this._renderPopup()}

                <Geocoder
                    mapRef={this._mapRef}
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
