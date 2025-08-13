import api from './api'
import story from '../storymap';
import GeoJSONFormat from 'ol/format/GeoJSON'
import CarteFormat from 'mcutils/format/Carte'
import ol_format_Guesser from 'mcutils/format/Guesser';

function exportLayer(l) {
  if (!l) return null;
  const layer = {
    id: l.get('id'),
    name: l.get('name'),
    title: l.get('title'),
    description: l.get('description'),
    visible: l.getVisible(),
    opacity: l.getOpacity(),
    displayInLayerSwitcher: l.get('displayInLayerSwitcher') !== false,
    theme: l.get('theme') !== false,
    inview: l.get('inview'),
    type: l.get('type')
  }
  if (l.getAttributes) layer.attributes = l.getAttributes();
  return layer
}

// API
api.setAPI({
  /** Get all layers associated with the map
   * @memberof api
   * @param {function} callback a callback function that takes a {@link JSONLayer} array
   * @instance 
   */
  getLayers: () => {
    const layers = [];
    story.getCarte().getMap().getLayers().forEach(l => {
      layers.push(exportLayer(l))
    });
    return layers;
  },

  /** Set the layer options
   * @memberof api
   * @param {Object} options
   *  @param {number} options.id layer id
   *  @param {boolean} [options.visible] layer visibility
   *  @param {boolean} [options.opacity] layer opacity
   *  @param {boolean} [options.displayInLayerSwitcher] display the layer in the switcher
   *  @param {string} [options.title] layer title
   *  @param {string} [options.url] layer url (only for external file layer)
   * @instance 
   */
  setLayer: (options) => {
    options = options || {};
    let layer;
    if (options.id) {
      layer = story.getCarte().getMap().getLayers().getArray().find(l => l.get('id') == options.id);
      if (layer) {
        if (options.visible !== undefined) {
          layer.setVisible(options.visible);
          // Force inview if visible
          if (options.visible) options.inview = true;
        }
        if (options.opacity !== undefined) layer.setOpacity(options.opacity);
        ['displayInLayerSwitcher', 'title'].forEach(k => {
          if (options[k] !== undefined) layer.set(k, options[k])
        })
        // In view
        if (options.inview !== undefined) {
          layer.set('inview', options.inview)
          // hide if not inview
          if (!options.inview) layer.setVisible(false)
        }
        // Replace file url
        if (options.url && layer.get('type') === 'file') {
          // Read features
          fetch(options.url)
          .then(resp => resp.text())
          .then(data => {
            const format = new ol_format_Guesser();
            const features = format.readFeatures(data, {
              featureProjection: 'EPSG:3857',
              extractStyles: layer.get('extractStyles')
            })
            layer.getSource().clear();
            layer.set('url', options.url);
            layer.getSource().addFeatures(features);
          })
          .catch(() => {})
        }
        // refresh switcher
        story.getCarte().getControl('layerSwitcher').drawPanel()
      }
    }
    return exportLayer(layer)
  },

  /** Add new features to a layer
   * @memberof api
   * @param {Object} options
   *  @param {number} options.id layer id
   *  @param {GeoJSON|Array<GeoJSONFeature>} [options.features] features to add in the layer
   *  @param {boolean} [options.clear] clear the layer before add
   * @param {function} [callback] function that takes an object with the number of features readed and the total features length
   * @instance 
   */
  addLayerFeatures: (options) => {
    const layer = story.getCarte().getMap().getLayers().getArray().find(l => l.get('id') == options.id)
    // Update features
    if (layer && layer.getSource && layer.getSource().addFeatures) {
      const source = layer.getSource();
      // Clear
      if (options.clear) {
        source.clear();
      }
      let features = []
      if (options.features) {
        const format = new GeoJSONFormat({ featureProjection: story.getCarte().getMap().getView().getProjection() });
        // Try to read GeoJSON
        try {
          features = format.readFeatures(options.features)
          source.addFeatures(features)
        } catch(e) {
          // Read an array of features
          features = [];
          try {
            options.features.forEach(f => {
              features.push(format.readFeature(f))
            })
            source.addFeatures(features)
          } catch(e) { /* oops */ }
        }
      }
      // Calculate statisitic (if some)
      if (layer.setStatistic) {
        const stat = layer.getStatistic()
        layer.setStatistic(stat);
      }
      // OK
      return { read: features.length, length: source.getFeatures().length }
    } else {
      return { error: !layer ? 'BadLayer' : 'BadLayerType' }
    }

  },

  /** Insert a new layer on the map
   * @memberof api
   * @param {Object} options
   *  @param {number} [options.position] position in the layer switcher, default on top
   *  @param {Object} options.layerOptions layer options as in .carte
   * @param {function} callback a callback function that takes a {@link JSONLayer} 
   * @instance 
   */
  addLayer: (options) => {
    try {
      const format = new CarteFormat;
      delete options.layerOptions.id;
      const layer = format.readLayer(options.layerOptions)
      if (layer) {
        if (options.position >= 0) {
          story.getCarte().getMap().getLayers().insertAt(options.position, layer)
        } else {
          story.getCarte().getMap().addLayer(layer)
        }
        return exportLayer(layer)
      }
    } catch(e) { /* ok */ }
    return false;
  },

  /** Remove a layer from the map
   * @memberof api
   * @param {number} layerId
   * @param {function} callback a callback function that takes a boolean
   * @instance 
   */
  removeLayer: (layerId) => {
    const layer = story.getCarte().getMap().getLayers().getArray().find(l => l.get('id') == layerId)
    if (layer) {
      story.getCarte().getMap().removeLayer(layer)
      return true
    }
    return false
  }

});

export { exportLayer }