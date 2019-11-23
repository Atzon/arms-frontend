import React, {Component} from 'react';
import { Menu, Icon, Dropdown, Radio, Checkbox} from 'antd';
import {fetchAirly, fetchMango, fetchPoints, toggleAirly, toggleMango, themeChange, sourceChange} from "../actions";
import {connect} from "react-redux";
import 'antd/lib/menu/style/css';
import {AIRLY, MANGO} from "../utils/utils";

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sources: ['mango'],
            theme: "",
        };
    }

    onThemeChange = (e) => {
        // this.setState({
        //     value: e.target.value,
        // });
        this.props.themeChange(e.target.value);

    };
    onSourceChange = (e) => {
        this.props.sourceChange(e);
    };


    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const options = [
            { label: 'Mango', value: MANGO },
            { label: 'Airly', value: AIRLY, style: radioStyle }
        ];
        return (
                <Dropdown overlay={
                    <Menu>
                        <p>Źródło</p>
                        <Checkbox.Group style={radioStyle} defaultValue={[MANGO]} onChange={this.onSourceChange}>
                            <Checkbox value={MANGO}>Mango</Checkbox>
                            <br />
                            <Checkbox value={AIRLY}>Airly</Checkbox>
                            <br />
                        </Checkbox.Group>
                        <br/>

                        <p>Motyw</p>
                        <Radio.Group defaultValue="mapbox://styles/mapbox/light-v10" buttonStyle="solid" onChange={this.onThemeChange}>
                            <Radio value="mapbox://styles/mapbox/light-v10" style={radioStyle}>
                                Light
                            </Radio>
                            <Radio value="mapbox://styles/mapbox/dark-v9" style={radioStyle}>
                                Dark
                            </Radio>
                            <Radio value="mapbox://styles/atzon/cjxwbiods1yq51cni28fi68ta" style={radioStyle}>
                                Rustical
                            </Radio>
                            <Radio value="mapbox://styles/atzon/cjxwbkx1b0c4j1cnztse58dmm" style={radioStyle}>
                                Decimal
                            </Radio>
                        </Radio.Group>
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

export default connect(null, {fetchPoints, sourceChange, fetchMango, fetchAirly, toggleMango, toggleAirly, themeChange})(Settings);
