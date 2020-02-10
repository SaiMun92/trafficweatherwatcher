function distance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}


// function distance2(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Radius of the earth in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a =
//         0.5 - Math.cos(dLat)/2 +
//         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//         (1 - Math.cos(dLon))/2;
//
//     return R * 2 * Math.asin(Math.sqrt(a));
// }

/**
 * @return {number}
 */
export function FindNearestGeoPoint(point, data) {
    /*
        This function returns the closest index from a point to the data source
     */
    let minDiff = 9999;
    let closest;

    for (let index=0; index<data['area_metadata'].length; index++) {
        let diff = distance(point.latitude, point.longitude,
            data['area_metadata'][index]['label_location']['latitude'],
            data['area_metadata'][index]['label_location']['longitude']);
        if (diff < minDiff) {
            closest = index;
            minDiff = diff;
        }
    }
    return closest;
}