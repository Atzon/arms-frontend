import React, {PureComponent} from 'react';


export default class LocationInfo extends PureComponent {

    render() {
        const {info} = this.props;
        const displayName = `${info.properties.id}, ${info.properties.pm10}`;

        return (
            <div>
                {displayName}
            </div>
        );
    }
}