import iFrameAPI from 'ol-ext/utils/IFrameAPI'
import GeoJSONFormat from 'ol/format/GeoJSON'

// Get iFrameAPI
const api = new iFrameAPI();

// GeoJSON format
const format = new GeoJSONFormat();

/* Get GeoJSON array from a feature array
 * @param {Array<Feature>} features
 */
function getGeoJSON(features, proj) {
  var json = [];
  features.forEach(function(f) {
    var p = format.writeFeatureObject(f, { 
      featureProjection: proj 
    });
    json.push(p);
  });
  return json
}

export { getGeoJSON }
export default api