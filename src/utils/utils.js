export function generatePoints(data){

    let geoJson = {
            type: "FeatureCollection",
            features: []
    };

    data.forEach(element =>{
        let point = {
            type: "Feature",
            properties: {
                id: element._id,
                pm10: element.PM10,
                pm2_5: element.PM2_5,
                time: new Date(element.datetime).getHours()
            },
            geometry: {
                type: "Point",
                coordinates: [
                    element.location.longitude,
                    element.location.latitude,
                ]
            }
        };
        geoJson.features.push(point);
    });

    return geoJson;
}

export function mapToHour(value){
    let hour = new Date().getHours() - (23-value);

    if(hour>23){
        hour = hour-24;
    }
    if(hour<0){
        hour = 24 + hour;
    }
    return hour;
}

export const THEME_CHANGE_EVENT = 'THEME_CHANGE_EVENT';
export const SOURCES_CHANGE_EVENT = 'SOURCES_CHANGE_EVENT';