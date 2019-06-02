import React, {PureComponent} from "react";
import {Icon, Modal} from "antd";

import '../Legend.css';


function info() {
    Modal.info({
        title: 'Normy dla pyłów drobnych',
        content: (
            <div style={{marginLeft: "-38px", marginBottom: "-21px", textAlign: "justify"}}>
                <p>W Polsce normy dla pyłów drobnych PM10 są ustalone na
                    trzech poziomach:</p>
                    <ul>
                        <li>poziom dopuszczalny 50 µg/m3 (dobowy) </li>
                        <li>poziom informowania 200 µg/m3 (dobowy)</li>
                        <li>poziom alarmowy 300 µg/m3 (dobowy)</li>
                    </ul>
                    <p>Z kolei Unia Europejska dla pyłów drobnych PM10 i PM2,5 ustaliła jedynie poziom dopuszczalny,
                        odpowiednio dla PM10 – 50 µg/m3 (dobowy) i 40 µg/m3 (średni-roczny), a dla pyłu PM2,5 - 25 µg/m3
                        (średni-roczny).</p><p>Normy odnośnie dopuszczalnych stężeń dobowych ustalone przez Światową
                        Organizację Zdrowia, to i 25 μg/m3 dla PM2.5 oraz 50 μg/m3 dla PM10.</p>
            </div>
        ),
        onOk() {},
    });
}


export default class Legend extends PureComponent {

    render() {

        return (
            <div>
                <div className="map-legend__colors">
                    <div className="map-legend__list">
                        <div className="map-legend__label">Niski</div>
                        <div className="map-legend__color map-legend__color--level-VERY_LOW"/>
                        <div className="map-legend__color map-legend__color--level-LOW"/>
                        <div className="map-legend__color map-legend__color--level-MEDIUM"/>
                        <div className="map-legend__color map-legend__color--level-HIGH"/>
                        <div className="map-legend__color map-legend__color--level-VERY_HIGH"/>
                        <div className="map-legend__color map-legend__color--level-AIRMAGEDDON"/>
                        <div className="map-legend__label">Wysoki</div>
                        <Icon type="info-circle" className="map-legend_info" onClick={info} />
                    </div>
                </div>
            </div>
        );
    }
}

