import React, {Component} from 'react';
import MapGL, {NavigationControl, FullscreenControl, GeolocateControl} from 'react-map-gl';
import {connect} from "react-redux";
import {mapToHour, colorRange, TOKEN, AIRLY, MANGO, EMPTY_POINT, LIGHT_THEME} from "../utils/utils";
import ControlPanel from './ControlPanel';
import Settings from './Settings';
import {DeckGL, GeoJsonLayer, ScreenGridLayer} from "deck.gl";
import {Slider, Spin} from "antd";
import {initialise, changeHour} from "../actions";
import Geocoder from 'react-map-gl-geocoder'
import Legend from "./Legend";
import 'antd/lib/menu/style/css';
import "antd/dist/antd.css";
import '../styles/map.css';
import '../styles/geocoder.css';

class Main extends Component{

    componentWillMount() {
        this.props.initialise([MANGO, AIRLY], LIGHT_THEME);
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
            popupPm10: null,
            panelVisible: false,
            searchResultLayer: null,
            airly: [],
            mangoOH: [],
            visiblePoints: []
        };
        this.handleViewportChange = this.handleViewportChange.bind(this);
        this.onCloseControlPanel = this.onCloseControlPanel.bind(this);
        this.mapRef = React.createRef();
        this.handleMapLoaded = this.handleMapLoaded.bind(this);
        this.filterByDate = this.filterByDate.bind(this);
        this.renderLayers = this.renderLayers.bind(this);
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
        this.props.changeHour(mapToHour(hour));
    }



    renderLayers() {
        const {data = this.props.points.data, cellSize = 50, gpuAggregation = false, aggregation = 'Mean'} = this.props;

        return [
            new ScreenGridLayer({
                id: 'grid',
                data,
                opacity: 0.2,
                pickable: true,
                getPosition: d => [d.location.longitude, d.location.latitude],
                getWeight: d => {
                    if(d.PM10>300)
                        return 300;
                    else
                        return d.PM10;
                },
                onClick: (info, _) => {
                  this.setState({popupPm10: info.object.cellWeight, panelVisible: true});
                },
                cellSizePixels: cellSize,
                colorDomain: [0, 300],
                highlightColor: [102, 102, 255],
                autoHighlight: true,
                colorRange,
                gpuAggregation,
                aggregation
            })
        ];
    }

    handleMapLoaded = event => {
        this.filterByDate(23);
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
                <Settings sources={this.props.settings.sources} theme={this.props.settings.theme}/>

                <MapGL
                    ref={this.mapRef}
                    {...viewport}
                    mapStyle={this.props.settings.theme}
                    onViewportChange={this.handleViewportChange}
                    onLoad={this.handleMapLoaded}
                    mapboxApiAccessToken={TOKEN}
                >
                    <DeckGL
                        viewState={viewport}
                        layers={this.renderLayers()}
                    />

                    <Geocoder
                        mapRef={this.mapRef}
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
                        <ControlPanel popupInfo={this.state.popupPm10} onClose={this.onCloseControlPanel} />
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
        points: state.points,
        settings: state.settings
    };
}

export default connect(mapStateToProps, {initialise, changeHour})(Main);
