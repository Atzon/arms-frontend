export default function generatePoints(data){

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