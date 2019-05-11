import React, {PureComponent} from 'react';
import { Card, Button, Progress, Icon } from 'antd';
import 'antd/lib/menu/style/css';
import 'antd/dist/antd.css';

const PM10_MAX = 300;
const PM2_5_MAX = 150;

export default class ControlPanel extends PureComponent {

    getColor = (value)=>{
        if(value <= 30){
            return '#00ff00';
        }
        else if(value > 30 && value <= 60){
            return '#FFFF00';
        }
        else if(value > 60 && value <= 90){
            return '#FF7F00'
        }
        else{
            return '#FF0000';
        }
    };

    getIcon = (value, color) =>{
        const style={
            float: "left",
            paddingRight: "10px",
            fontSize: "30px",
            color: color,
        };
        if(value <= 50){
            return <Icon style={style} type="smile"   />;
        }
        else if(value > 50 && value < 80){
            return <Icon style={style} type="meh"  />;
        }
        else{
            return <Icon style={style} type="frown"  />;
        }
    };

    renderPMBar(type, value, maks){
        const percent = parseFloat(value)/maks*100;
        const color = this.getColor(percent);
        return(
            <div>
                {this.getIcon(percent, color)}
                <p>{type} = {value}</p>
                <Progress
                    successPercent={0}
                    strokeColor={color}
                    strokeLinecap={'round'}
                    percent={percent}
                    showInfo={false}
                />
            </div>
        );
    }

    render() {
        return (
            <div style={{ marginTop: "10vh", float: "right", width: "25vw", height: "100%"}}>
                <Card title={this.props.popupInfo.name} bordered={false} style={{height: "100%"}}>
                    {this.renderPMBar("PM10", this.props.popupInfo.pm10, PM10_MAX)}
                    {this.renderPMBar("PM2.5", this.props.popupInfo.pm2_5, PM2_5_MAX)}
                    <Button type="primary" onClick={this.props.onClose}>Hide</Button>
                </Card>
            </div>
        );
    }
}