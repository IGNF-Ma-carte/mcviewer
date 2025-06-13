import api from './api'
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj'
import { extend, isEmpty, createEmpty } from 'ol/extent'
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
    // Onglet model
    if (story.get('model') === 'onglet') {
      const t = story.getTab(story.getSelectTabIndex())
      if (data) {
        data.type = 'centermap';
        if (data.center) data.center = fromLonLat(data.center)
        t.iframe.contentWindow.postMessage(data, '*')
      }
      return;
    }
    // Get center
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
        // Center to extent
        const extent = transformExtent(data.extent, 'EPSG:4326', view.getProjection())
        if (extent && !isEmpty(extent)) {
          view.fit(extent, story.getCarte().getMap().getSize())
          if (data.zoom && view.getZoom() > data.zoom) {
            view.setZoom(data.zoom);
          }
        }
      } else if (data.layerId) {
        // Center to layer content
        story.getCarte().getMap().getLayers().forEach(l => {
          if (l.get('id') === data.layerId) {
            let extent;
            if (l.getSource() && l.getSource().getExtent) {
              extent = l.getSource().getExtent()
            }
            if (!extent && l.getExtent) {
              extent = l.getExtent()
            }
            if (extent && !isEmpty(extent)) {
              view.fit(extent, story.getCarte().getMap().getSize())
              if (data.offsetZoom) view.setZoom(view.getZoom() + data.offsetZoom);
            }
          }
        });
      } else if (data.selection) {
        const features = story.getCarte().getSelect().getFeatures();
        let extent = createEmpty();
        features.forEach(f => {
          extend(extent, f.getGeometry().getExtent())
        })
        if (!isEmpty(extent)) {
          view.fit(extent, story.getCarte().getMap().getSize())
          if (data.offsetZoom) view.setZoom(view.getZoom() + data.offsetZoom);
        }
      }
    }
    return toLonLat(story.getCarte().getMap().getView().getCenter());
  },
  
  /** Move map to place
   * @memberof api
   * @param {Object} position the position to move to
   *  @param {Array<number>} position.destination an array of longitude, latitude
   *  @param {number} position.zoom
   *  @param {number} position.rotation
   *  @param {string} position.type the type of movement use 'flyTo' to have a fly to effect
   * @instance
   */ 
  moveTo: data => {
    // Model onglet
    if (!story.getCarte()) {
      return;
    }
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
    // Model onglet
    if (!story.getCarte()) {
      return;
    }
    return toLonLat(story.getCarte().getMap().getView().getCenter());
  },

  /** Set map zoom level
   * @memberof api
   * @param {number} zoom the zoom level
   * @instance
   */
  setZoom: function(data) {
    // Model onglet
    if (!story.getCarte()) {
      return;
    }   
    story.getCarte().getMap().getView().setZoom(data);
  },

  /** Get map zoom level
   * @memberof api
   * @function
   * @param {function} callback a function that takes the zoom level as argument
   * @instance 
   */
  getZoom: function() {
    // Model onglet
    if (!story.getCarte()) {
      return;
    }
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
