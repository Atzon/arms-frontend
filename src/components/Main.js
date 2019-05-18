import React, {Component} from 'react';
import MapGL, {Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl} from 'react-map-gl';
import {connect} from "react-redux";
import ControlPanel from './ControlPanel';
import LocationPin from './LocationPin';
import LocationInfo from './LocationInfo';
import DeckGL, { GeoJsonLayer } from "deck.gl";
import {Slider} from "antd";
import Geocoder from 'react-map-gl-geocoder'
import 'antd/lib/menu/style/css';
import '../Geocoder.css';

import {fetchPoints} from "../actions";

import pointGenerator from "../utils/pointGenerator";



const TOKEN = "pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg";
const HEATMAP_SOURCE_ID = "points-source";


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

const geolocateStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 10,
};

const sliderStyle = {
    position: "absolute",
    width: "25%",
    top: "85%",
    left: "35%",
    padding: "10px"
};

function mapToHour(value){
    let hour = new Date().getHours() - (23-value);

    if(hour>23){
        hour = hour-24;
    }
    if(hour<0){
        hour = 24 + hour;
    }
    return hour;
}


class Main extends Component{

    componentWillMount() {
        this.props.fetchPoints();
    }

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: '100vw',
                height: '100vh',
                latitude: 50.0679198,
                longitude: 19.9107528,
                zoom: 15,
                minZoom: 10
            },
            popupInfo: null,
            panelVisible: false,
            searchResultLayer: null,
            points: null,
            visiblePoints: []
        };
        this.handleViewportChange = this.handleViewportChange.bind(this);
        this.onCloseControlPanel = this.onCloseControlPanel.bind(this);
        this._mapRef = React.createRef();
        this._handleMapLoaded = this._handleMapLoaded.bind(this);
        this.filterByDate = this.filterByDate.bind(this);
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
                longitude={location.geometry.coordinates[0]}
                latitude={location.geometry.coordinates[1]} >
                <LocationPin size={20} onClick={() => this.setState({popupInfo: location, panelVisible: true})} />
            </Marker>
        );
    };



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
                   longitude={popupInfo.geometry.coordinates[0]}
                   latitude={popupInfo.geometry.coordinates[1]}
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
        // console.log(event.result);
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

    _mkCirclemapLayer = (id, source) => {
        return{
            "id": id,
            "source": source,
            "type": "circle",
            // "minzoom": 7,
            "paint": {
                "circle-radius":
                    [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 90,
                        16, 190,
                    ],

                "circle-blur": 1,
                "circle-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "pm10"],
                    1, "rgba(33,102,172, 0)",
                    20, "rgb(0,255,0)",
                    50, "rgb(127,255,0)",
                    100, "rgb(255,255,0)",
                    200, "rgb(255,127,0)",
                    300, "rgb(255,0,0)"
                ],
                "circle-opacity": 0.4
            }
        }
    };

    _getMap = () => {
        return this._mapRef.current ? this._mapRef.current.getMap() : null;
    };

    filterByCracow = (item) =>{
        return item.context.map(function (i) {
            return (i.id.split('.').shift() === 'place' && i.text === 'Kraków');
        }).reduce(function (acc, cur) {
                return acc || cur;
            });
    };

    filterByDate(hour){
        const map = this._getMap();


        const filter =
            [  "all",
                [">", "time", hour-2],
                ["<", "time", hour+2]
            ];

        map.setFilter('heatmap-layer', filter);

        const features = map.querySourceFeatures(HEATMAP_SOURCE_ID, {
            sourceLayer: "heatmap-layer",
            filter: filter
        });

        this.setState({
            visiblePoints: features
        });

    }

    _handleMapLoaded = event => {
        const map = this._getMap();

        const CONTENT = pointGenerator(this.props.points);
        console.log(CONTENT);
        const features = CONTENT.features;
        // const endTime = features[0].properties.time;
        // const startTime = features[features.length - 1].properties.time;

        this.setState({ points: CONTENT /*,endTime, startTime, selectedTime: endTime */});
        map.addSource(HEATMAP_SOURCE_ID, { type: "geojson", data: CONTENT});
        map.addLayer(this._mkCirclemapLayer("heatmap-layer", HEATMAP_SOURCE_ID));
        this.filterByDate(new Date().getHours());
    };

    _setMapData = features => {
        const map = this._getMap();
        map && map.getSource(HEATMAP_SOURCE_ID).setData(this._mkFeatureCollection(features));
    };



    formatter(value){
        return mapToHour(value).toString();
    }

    render(){
        const { viewport, searchResultLayer } = this.state;

        if(!this.props.points){
            return(
                <div>Loading...</div>
            );
        }

        return(
            <div>
                <MapGL
                    ref={this._mapRef}
                    {...viewport}
                    // mapStyle="mapbox://styles/mapbox/dark-v9"
                    onViewportChange={this.handleViewportChange}
                    onLoad={this._handleMapLoaded}
                    mapboxApiAccessToken={TOKEN} >

                    { this.state.visiblePoints.map(this._renderLocationMarker) }

                    {this._renderPopup()}

                    <Geocoder
                        mapRef={this._mapRef}
                        countries='pl'
                        onResult={this.handleOnResult}
                        onViewportChange={this.handleGeocoderViewportChange}
                        mapboxApiAccessToken={TOKEN}
                        position="top-left"
                        filter={this.filterByCracow}
                    />

                    <GeolocateControl
                        style={geolocateStyle}
                        onViewportChange={this.handleViewportChange}
                        positionOptions={{enableHighAccuracy: true}}
                        trackUserLocation={true}
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
                <div style={sliderStyle}>
                    <Slider min={0} max={23} defaultValue={23} tipFormatter={this.formatter} onChange={this.filterByDate}/>
                </div>
            </div>

        );
    }
}

function mapStateToProps(state){
    return{
        points: state.points
    };
}

export default connect(mapStateToProps, {fetchPoints})(Main);

