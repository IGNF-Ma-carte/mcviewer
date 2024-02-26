import api from './api'
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj'
import story from '../storymap'
// Add flyTo
import 'ol-ext/util/View'

// Add new functions
api.setAPI({
  /** Change map center
   * @memberof api
   * @param { Array<number> | centerOptions } center an array of [longitude, latitude and zoom (optional)] or center options
   * @instance
   */
  setCenter: data => {
    const view = story.getCarte().getMap().getView();
    if (Array.isArray(data)) {
      const center = fromLonLat([data[0], data[1]]);
      view.setCenter(center);
      if (data[2]) view.setZoom(data[2]);
    } else {
      if (data.center) {
        const center = fromLonLat(data.center);
        view.setCenter(center);
        if (data.zoom) view.setZoom(data.zoom);
      } else if (data.extent) {
        const extent = transformExtent(data.extent, 'EPSG:4326', view.getProjection())
        view.fit(extent, story.getCarte().getMap().getSize())
        if (data.zoom && view.getZoom() > data.zoom) {
          view.setZoom(data.zoom);
        }
      }
    }
  },
  
  /** Move map to place
   * @memberof api
   * @param {Object} position the position to move to
   *  @param {Array<number>} position.center an array of longitude, latitude
   *  @param {number} position.zoom
   *  @param {number} position.rotation
   *  @param {string} position.type the type of movement use 'flyTo' to have a fly to effect
   * @instance
   */ 
  moveTo: data => {
    story.getCarte().getMap().getView().takeTour([{
      center: fromLonLat([data.destination[0], data.destination[1]]),
      zoom: data.zoom,
      rotation: data.rotation,
      type: data.type
    }])
  },

  /** Get the center of the map
   * @memberof api
   * @param {function} callback a function that takes the center of the maps as an array of longitude, latitude
   * @instance
   */ 
  getCenter: function() {
    return toLonLat(story.getCarte().getMap().getView().getCenter());
  },

  /** Set map zoom level
   * @memberof api
   * @param {number} zoom the zoom level
   * @instance
   */
  setZoom: function(data) {
    story.getCarte().getMap().getView().setZoom(data);
  },

  /** Get map zoom level
   * @memberof api
   * @function
   * @param {function} callback a function that takes the zoom level as argument
   * @instance 
   */
  getZoom: function() {
    return story.getCarte().getMap().getView().getZoom()
  }
})

/** Listen to position change
 * @memberof api
 * @event move
 * @property {Object} position the map position
 *  @property {Array<number>} position.center the center of the maps as an array of longitude, latitude
 *  @property {number} position.zoom the zoom level
 */
story.on('read', () => {
  // Change position event
  if (story.getCarte()) {
    story.getCarte().getMap().on('moveend', () => {
      if (api.id > 0) {
        const view = story.getCarte().getMap().getView();
        api.postMessage('move', { 
          center: toLonLat(view.getCenter()),
          zoom: view.getZoom()
        })
      }
    });
  }
})
