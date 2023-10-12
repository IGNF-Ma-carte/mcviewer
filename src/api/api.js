import iFrameAPI from 'ol-ext/utils/IFrameAPI'
import GeoJSONFormat from 'ol/format/GeoJSON'

// Get iFrameAPI
const api = new iFrameAPI();

// GeoJSON format
const format = new GeoJSONFormat();

/* Get GeoJSON array from a feature array
 * @param {Array<Feature>} features
 * @param {string} [proj='EPSG:3857']
 */
function getGeoJSON(features, proj) {
  var json = [];
  features.forEach(function(f) {
    var p = format.writeFeatureObject(f, { 
      featureProjection: proj || 'EPSG:3857'
    });
    json.push(p);
  });
  return json
}

export { getGeoJSON }
export default api