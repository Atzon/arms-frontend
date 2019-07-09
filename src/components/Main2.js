import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {ScreenGridLayer} from 'deck.gl';
import {isWebGL2} from '@luma.gl/core';
import {fetchPoints} from "../actions";
import {connect} from "react-redux";


// Set your mapbox token here
const MAPBOX_TOKEN = "pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg";


// Source data CSV
const DATA_URL =
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json'; // eslint-disable-line






const INITIAL_VIEW_STATE = {
    longitude: 19.9107528,
    latitude: 50.0679198,
    zoom: 10,
    maxZoom: 16,
    pitch: 0,
    bearing: 0
};

const colorRange = [
    [255, 255, 178, 25],
    [254, 217, 118, 85],
    [254, 178, 76, 127],
    [253, 141, 60, 170],
    [240, 59, 32, 212],
    [189, 0, 38, 255]
];

class Main2 extends Component {


    componentWillMount() {
        this.props.fetchPoints();
    }

    _renderLayers() {
        const {data = this.props.points, cellSize = 50, gpuAggregation = true, aggregation = 'Mean'} = this.props;

        return [
            new ScreenGridLayer({
                id: 'grid',
                data,
                getPosition: d => [d.location.longitude, d.location.latitude],
                getWeight: d => d.PM10,
                cellSizePixels: cellSize,
                colorRange,
                gpuAggregation,
                aggregation
            })
        ];
    }

    _onInitialized(gl) {
        if (!isWebGL2(gl)) {
            console.warn('GPU aggregation is not supported'); // eslint-disable-line
            if (this.props.disableGPUAggregation) {
                this.props.disableGPUAggregation();
            }
        }
    }

    render() {
        const {mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;

        return (
            <DeckGL
                layers={this._renderLayers()}
                initialViewState={INITIAL_VIEW_STATE}
                onWebGLInitialized={this._onInitialized.bind(this)}
                controller={true}
            >
                <StaticMap
                    reuseMaps
                    mapStyle={mapStyle}
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                />
            </DeckGL>
        );
    }
}

function mapStateToProps(state){
    return{
        points: state.points
    };
}

export default connect(mapStateToProps, {fetchPoints})(Main2);
