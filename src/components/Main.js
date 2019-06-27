import React, {Component} from 'react';
import MapGL, {Popup, NavigationControl, FullscreenControl, GeolocateControl} from 'react-map-gl';
import {connect} from "react-redux";
import ControlPanel from './ControlPanel';
import LocationInfo from './LocationInfo';
import { GeoJsonLayer } from "deck.gl";
import {Slider, Spin} from "antd";
import {fetchPoints} from "../actions";
import pointGenerator from "../utils/pointGenerator";
import Geocoder from 'react-map-gl-geocoder'
import Legend from "./Legend";
import 'antd/lib/menu/style/css';
import '../styles/map.css';
import '../styles/geocoder.css';


import Lines from './LinesDb.json';


const TOKEN = "pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg";
const HEATMAP_SOURCE_ID = "points-source";
const LINES_SOURCE_ID = 'lines-source';


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
                zoom: 10,
                minZoom: 10
            },
            popupInfo: null,
            panelVisible: false,
            searchResultLayer: null,
            points: null,
            visiblePoints: [],
            visibleHour: new Date().getHours(),
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

    _mkPinmapLayer = (id, source) =>{
        return{
            "id": id,
            "source": source,
            "type": "circle",
            "paint": {
                "circle-radius": {
                    stops: [
                        [0, 2],
                        [20, 300]
                    ],
                    base: 2
                },
                "circle-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "pm10"],
                    1, "rgba(107,201,38,0)",
                    21, "rgb(107,201,38)",
                    61, "rgb(209,207,30)",
                    101, "rgb(239,187,15)",
                    141, "rgb(239,113,32)",
                    201, "rgb(157,0,40)"
                ],
                "circle-opacity": 0.8
            }
        }
    };

    _mkLinesLayer = (id, source) => {
        return {
            type: 'line',
            source: source,
            id: id,
            paint: {
                'line-color': 'red',
                'line-width': 5,
                // 'line-gradient' must be specified using an expression
                // with the special 'line-progress' property
                'line-gradient': [
                    'interpolate',
                    ['linear'],
                    ['line-progress'],
                    0, "green",
                    0.1, "green",
                    0.3, "yellow",
                    0.5, "yellow",
                    0.7, "red",
                    1, "red"
                ]
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            }
        };
    };


    _mkCirclemapLayer = (id, source) => {
        return{
            "id": id,
            "source": source,
            "type": "circle",
            // "minzoom": 7,
            // "maxzoom": 16,
            "paint": {

                "circle-radius": {
                    stops: [
                        [0, 0],
                        [20, 8000]
                    ],
                    base: 2
                },

                "circle-blur": 1,
                "circle-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "pm10"],
                    1, "rgba(107,201,38,0)",
                    21, "rgb(107,201,38)",
                    61, "rgb(209,207,30)",
                    101, "rgb(239,187,15)",
                    141, "rgb(239,113,32)",
                    201, "rgb(157,0,40)"
                ],
                "circle-opacity": 0.5
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
                ["==", "time", hour],
                // ["<", "time", hour]
            ];

        map.setFilter('heatmap-layer', filter);
        map.setFilter('pin-layer', filter);


        const features = map.querySourceFeatures(HEATMAP_SOURCE_ID, {
            sourceLayer: "heatmap-layer",
            filter: filter
        });

        this.setState({
            visiblePoints: features,
            visibleHour: hour
        });

    }

    _handleMapLoaded = event => {
        const map = this._getMap();

        const CONTENT = pointGenerator(this.props.points);
        const features = CONTENT.features;

        this.setState({ points: CONTENT /*,endTime, startTime, selectedTime: endTime */});
        map.addSource(HEATMAP_SOURCE_ID, { type: "geojson", data: CONTENT});
        map.addSource(LINES_SOURCE_ID, { type: 'geojson', lineMetrics: true, data: Lines});
        map.addLayer(this._mkCirclemapLayer("heatmap-layer", HEATMAP_SOURCE_ID));
        map.addLayer(this._mkPinmapLayer("pin-layer", HEATMAP_SOURCE_ID));
        // map.addLayer(this._mkLinesLayer("lines-layer", LINES_SOURCE_ID));

        this.filterByDate(new Date().getHours());
    };


    formatter(value){
        return mapToHour(value).toString()+":00";
    }

    render(){
        const { viewport } = this.state;

        if(!this.props.points){
            return(
                <div className="loadingStyle">
                    <p>ARMS</p>
                    <Spin size="large" />
                </div>
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
                    mapboxApiAccessToken={TOKEN}
                    onClick={(e)=>{

                        const map = this._getMap();

                        const filter =
                            [  "all",
                                ["==", "time", this.state.visibleHour],
                            ];

                        let visiblePoints = map.querySourceFeatures(HEATMAP_SOURCE_ID, {
                            sourceLayer: "heatmap-layer",
                            filter: filter
                        });

                        visiblePoints.forEach(point =>{
                            if(Math.abs(point.geometry.coordinates[0] - e.lngLat[0]) <= 0.00016 &&
                                Math.abs(point.geometry.coordinates[1] - e.lngLat[1]) <= 0.00016){
                                this.setState({popupInfo: point, panelVisible: true});
                            }
                        });
                        }
                    }
                >

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
                        className={"geolocateStyle"}
                        onViewportChange={this.handleViewportChange}
                        positionOptions={{enableHighAccuracy: true}}
                        trackUserLocation={true}
                    />

                    <div className="fullscreen fullscreenControlStyle">
                        <FullscreenControl />
                    </div>
                    <div className="nav navStyle">
                        <NavigationControl onViewportChange={this.handleViewportChange} />
                    </div>
                    {this.state.panelVisible ?
                        <ControlPanel popupInfo={this.state.popupInfo} onClose={this.onCloseControlPanel} />
                        :
                        <div></div>
                    }
                    <Legend/>
                </MapGL>
                <div className={"sliderStyle"}>
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

