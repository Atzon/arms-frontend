import React, {Component} from 'react';
import MapGL, {InteractiveMap, Popup, NavigationControl, FullscreenControl, GeolocateControl} from 'react-map-gl';
import {connect} from "react-redux";
import {mapToHour} from "../utils/utils";
import ControlPanel2 from './ControlPanel2';
import LocationInfo from './LocationInfo';
import {DeckGL, GeoJsonLayer, ScreenGridLayer} from "deck.gl";
import {Slider, Spin, Select} from "antd";
import {fetchPoints, fetchPointsFromFile} from "../actions";
import Geocoder from 'react-map-gl-geocoder'
import Legend from "./Legend";
import 'antd/lib/menu/style/css';
import '../styles/map.css';
import '../styles/geocoder.css';

const TOKEN = "pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg";


const colorRange = [
    [107,201,38],
    [107,201,38],
    [209,207,30],
    [239,187,15],
    [239,113,32],
    [157,0,  40]
];

class Main2 extends Component{

    componentWillMount() {
        const { source } = this.props.match.params;
        if(source){
            this.props.fetchPointsFromFile(source);
        }
        else{
            this.props.fetchPoints();
        }
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
            theme: "mapbox://styles/mapbox/light-v10",
            popupPm10: null,
            panelVisible: false,
            searchResultLayer: null,
            visiblePoints: [],
            visibleHour: new Date().getHours(),
        };
        this.handleViewportChange = this.handleViewportChange.bind(this);
        this.onCloseControlPanel = this.onCloseControlPanel.bind(this);
        this._mapRef = React.createRef();
        this._handleMapLoaded = this._handleMapLoaded.bind(this);
        this.filterByDate = this.filterByDate.bind(this);
        this._renderLayers = this._renderLayers.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
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


    filterByCracow = (item) =>{
        return item.context.map(function (i) {
            return (i.id.split('.').shift() === 'place' && i.text === 'Kraków');
        }).reduce(function (acc, cur) {
            return acc || cur;
        });
    };

    filterByDate(hour){
        const visiblePoints = this.props.points.filter(point => new Date(point.datetime).getHours() == hour);
        this.setState({
            visiblePoints: visiblePoints,
            visibleHour: hour
        })
    }



    _renderLayers() {
        const {data = this.state.visiblePoints, cellSize = 50, gpuAggregation = false, aggregation = 'Mean'} = this.props;

        return [
            new ScreenGridLayer({
                id: 'grid',
                data,
                opacity: 0.2,
                pickable: true,
                getPosition: d => [d.location.longitude, d.location.latitude],
                getWeight: d => d.PM10,
                onClick: (info, _) => {
                  console.log(info.object.cellWeight);
                  this.setState({popupPm10: info.object.cellWeight, panelVisible: true});
                },
                cellSizePixels: cellSize,
                colorDomain: [0, 150],
                colorRange,
                gpuAggregation,
                aggregation
            })
        ];
    }

    _handleMapLoaded = event => {
        this.filterByDate(new Date().getHours());
    };


    handleThemeChange(value){
        this.setState({theme: value});
    }

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
                    mapStyle={this.state.theme}
                    onViewportChange={this.handleViewportChange}
                    onLoad={this._handleMapLoaded}
                    mapboxApiAccessToken={TOKEN}
                >


                    <Select defaultValue="Light" className="themeSelectStyle" onChange={this.handleThemeChange}>
                        <Select.Option value="mapbox://styles/mapbox/light-v10">Light</Select.Option>
                        <Select.Option value="mapbox://styles/mapbox/dark-v9">Dark</Select.Option>
                        <Select.Option value="mapbox://styles/atzon/cjxwbiods1yq51cni28fi68ta">Rustical</Select.Option>
                        <Select.Option value="mapbox://styles/atzon/cjxwbkx1b0c4j1cnztse58dmm">Decimal</Select.Option>
                    </Select>

                    <DeckGL
                        viewState={viewport}
                        layers={this._renderLayers()}
                    />


                    <Geocoder
                        mapRef={this._mapRef}
                        countries='pl'
                        onResult={this.handleOnResult}
                        onViewportChange={this.handleGeocoderViewportChange}
                        mapboxApiAccessToken={TOKEN}
                        position="top-left"
                        width="200px"
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
                        <ControlPanel2 popupInfo={this.state.popupPm10} onClose={this.onCloseControlPanel} />
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

export default connect(mapStateToProps, {fetchPoints, fetchPointsFromFile})(Main2);

