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

export const MANGO = 'MANGO';
export const AIRLY = 'AIRLY';
export const LIGHT_THEME = 'mapbox://styles/mapbox/light-v10';
export const DARK_THEME = 'mapbox://styles/mapbox/dark-v9';
export const RUSTICAL_THEME = 'mapbox://styles/atzon/cjxwbiods1yq51cni28fi68ta';
export const DECIMAL_THEME = 'mapbox://styles/atzon/cjxwbkx1b0c4j1cnztse58dmm';
export const TOKEN = "pk.eyJ1IjoiYXR6b24iLCJhIjoiY2p1eTZ5amo0MGUwcTRkbnJvNjdqZHRzdCJ9.Yx1QgOpBGpbL6ZlTq_TaOg";

export const EMPTY_POINT =     {
    "_id": 0,
    "datetime": "",
    "PM2_5": 0,
    "PM10": 0,
    "location": {
        "latitude": 0,
        "longitude": 0
    }
};

export const colorRange = [
    [107,201,38],
    [107,201,38],
    [209,207,30],
    [239,187,15],
    [239,113,32],
    [157,0,  40]
];