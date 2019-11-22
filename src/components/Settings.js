import React, {Component} from 'react';
import { Menu, Icon, Dropdown, Radio} from 'antd';
import {fetchAirly, fetchMango, fetchPoints, toggleAirly, toggleMango} from "../actions";
import {THEME_CHANGE_EVENT, SOURCES_CHANGE_EVENT} from '../utils/utils';
import {connect} from "react-redux";

const { SubMenu } = Menu;

const choosed = {
    backgroundColor: 'red'
};

const notChoosed = {
    backgroundColor: ''
};

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sources: ['mango'],
            theme: "mapbox://styles/mapbox/light-v10",
        };
        this.selectSource = this.selectSource.bind(this);
        this.setTheme = this.setTheme.bind(this);
    }

    isSource = (key) => {
        return this.state.sources.includes(key);
    } ;


    isTheme = (key) => {
        return this.state.theme == key;
    } ;

    selectSource = key => {
        let {sources} = this.state;

        if (key == 'mango'){
            this.props.toggleMango();

        }
        else{
            this.props.toggleAirly();
        }

        if (sources.includes(key)) {
            this.setState({sources: sources.filter(x => x != key)});
            this.props.onChange(SOURCES_CHANGE_EVENT, sources.filter(x => x != key));
        }
        else {
            this.setState({sources: [...sources, key]});
            this.props.onChange(SOURCES_CHANGE_EVENT, [...sources, key]);
        }
    };

    setTheme = key => {
        this.setState({theme: key});
        this.props.onChange(THEME_CHANGE_EVENT, key);
    };



    render() {
        return (

                <Dropdown overlay={
                    <Menu>
                        <span>Źródło</span>
                        <Menu.Item style={this.isSource('mango') ? choosed : notChoosed}
                        onClick={_ => this.selectSource('mango')}>
                            MangoOH
                        </Menu.Item>
                        <Menu.Item style={this.isSource( 'airly') ? choosed : notChoosed}
                        onClick={_ => this.selectSource('airly')}>
                            Airly
                        </Menu.Item>
                        <span>Motyw</span>
                        <Menu.Item style={this.isTheme( 'mapbox://styles/mapbox/light-v10') ? choosed : notChoosed}
                                   onClick={_ => this.setTheme('mapbox://styles/mapbox/light-v10')}>
                            Light
                        </Menu.Item>
                        <Menu.Item style={this.isTheme( 'mapbox://styles/mapbox/dark-v9') ? choosed : notChoosed}
                                   onClick={_ => this.setTheme('mapbox://styles/mapbox/dark-v9')}>
                            Dark
                        </Menu.Item>
                        <Menu.Item style={this.isTheme( 'mapbox://styles/atzon/cjxwbiods1yq51cni28fi68ta') ? choosed : notChoosed}
                                   onClick={_ => this.setTheme('mapbox://styles/atzon/cjxwbiods1yq51cni28fi68ta')}>
                            Rustical
                        </Menu.Item>
                        <Menu.Item style={this.isTheme( 'mapbox://styles/atzon/cjxwbkx1b0c4j1cnztse58dmm') ? choosed : notChoosed}
                                   onClick={_ => this.setTheme('mapbox://styles/atzon/cjxwbkx1b0c4j1cnztse58dmm')}>
                        Decimal
                        </Menu.Item>
                    </Menu>
                }>
                    <div className="mapboxgl-ctrl mapboxgl-ctrl-group settingsStyle">
                        <a className="ant-dropdown-link">
                            <Icon theme="filled" style={{fontSize: "25px", color: "black"}} type="setting" />
                        </a>
                    </div>
                </Dropdown>
        );
    }
}

export default connect(null, {fetchPoints, fetchMango, fetchAirly, toggleMango, toggleAirly})(Settings);
