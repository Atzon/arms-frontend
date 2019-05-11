export default function generatePoints(data){

    let geoJson = {
            type: "FeatureCollection",
            features: []
    };

    data.forEach(element =>{
        let point = {
            type: "Feature",
            properties: {
                id: element.id,
                pm10: element.pm10,
                pm2_5: element.pm2_5,
            },
            geometry: {
                type: "Point",
                coordinates: [
                    element.longitude,
                    element.latitude,
                ]
            }
        };
        geoJson.features.push(point);
    });

    return geoJson;
}