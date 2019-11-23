import React, {Component} from 'react';
import { Menu, Icon, Dropdown, Radio, Checkbox} from 'antd';
import {themeChange, sourceChange} from "../actions";
import {connect} from "react-redux";
import {AIRLY, MANGO, LIGHT_THEME, DARK_THEME, RUSTICAL_THEME, DECIMAL_THEME} from "../utils/utils";

class Settings extends Component {

    onThemeChange = (e) => {
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
            margin: '5px'
        };
        return (
                <Dropdown overlay={
                    <Menu>
                        <h style={{display: "flex", justifyContent: "center"}}>Źródło</h>
                        <div>
                            <Checkbox.Group style={radioStyle} defaultValue={this.props.sources} onChange={this.onSourceChange}>
                                <Checkbox value={MANGO}>Mango</Checkbox>
                                <br />
                                <Checkbox value={AIRLY}>Airly</Checkbox>
                            </Checkbox.Group>
                        </div>
                        <br/>
                        <br/>
                        <h style={{display: "flex", justifyContent: "center"}}>Motyw</h>
                        <Radio.Group defaultValue={this.props.theme} buttonStyle="solid" onChange={this.onThemeChange}>
                          <Radio value={LIGHT_THEME} style={radioStyle}>
                                Light
                          </Radio>
                            <Radio value={DARK_THEME} style={radioStyle}>
                                Dark
                            </Radio>
                            <Radio value={RUSTICAL_THEME} style={radioStyle}>
                                Rustical
                            </Radio>
                            <Radio value={DECIMAL_THEME} style={radioStyle}>
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

export default connect(null, {sourceChange, themeChange})(Settings);
