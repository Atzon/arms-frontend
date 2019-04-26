import React, {PureComponent} from 'react';
import { Card, Button } from 'antd';
import 'antd/lib/menu/style/css';
import 'antd/dist/antd.css';

export default class ControlPanel extends PureComponent {
    render() {
        return (
            <div style={{ background: '#ECECEC', padding: '10px', float: "right", width: "25vw", height: "100%"}}>
                <Card title={this.props.popupInfo.name} bordered={false} style={{height: "100%"}}>
                    <p>PM10 = {this.props.popupInfo.value}</p>
                    <Button type="primary" onClick={this.props.onClose}>Hide</Button>
                </Card>
            </div>
        );
    }
}