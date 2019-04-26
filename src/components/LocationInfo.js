import React, {PureComponent} from 'react';


export default class LocationInfo extends PureComponent {

    render() {
        const {info} = this.props;
        const displayName = `${info.name}, ${info.value}`;

        return (
            <div>
                {displayName}
            </div>
        );
    }
}