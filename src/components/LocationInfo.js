import React, {PureComponent} from 'react';


export default class LocationInfo extends PureComponent {

    render() {
        const {info} = this.props;
        const displayName = `${info.name}, ${info.pm10}`;

        return (
            <div>
                {displayName}
            </div>
        );
    }
}