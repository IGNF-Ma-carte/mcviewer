import api from './api'
import { getGeoJSON } from './api'
import story from '../storymap'
import VectorStyle from 'mcutils/layer/VectorStyle';
import Statistic from 'mcutils/layer/Statistic';
import SelectBase from 'ol-ext/control/SelectBase'
import ol_ext_element from 'ol-ext/util/element'

const selector = {};
let map;

/* Get layer id (or first one) */
function getLayerId(data) {
  return data[0].layerId || Object.keys(selector)[0];
}

/* Get selected features */
function selectFeatures(data) {
  if (!(data instanceof Array)) data = [data];
  const id = getLayerId(data)
  if (!selector[id]) return [];
  // Get all features
  if (data.length === 1 && !data[0].attr) {
    return selector[id].getSources()[0].getFeatures()
  }
  // Select
  return selector[id].doSelect({
    conditions: data,
    useCase: data[0].useCase,
    matchAll: data[0].matchAll
  });
}

/** Listen to new selection
 * @memberof api
 * @event select
 * @event select:show
 * @property {Array<GeoJSONFeature>} selection an array of features in a GeoJSON format
 */
story.on('read', () => {
  if (!story.getCarte()) return;
  // Select interaction
  map = story.getCarte().getMap();
  map.getLayers().forEach(l => {
    if (l instanceof VectorStyle || l instanceof Statistic) {
      selector[l.get('id')] = new SelectBase({
        source: l.getSource(),
        content: ol_ext_element.create('DIV')
      });
    }
  })

  // Handle event
  const select = story.getCarte().getInteraction('select');
  select.on('select', () => {
    if (api.id > 0) {
      const selected = getGeoJSON(select.getFeatures(), map.getView().getProjection());
      // Clusters
      selected.forEach(f => {
        if (f.properties && Array.isArray(f.properties.features)) {
          f.properties.features = f.properties.features.length
        }
      })
      api.postMessage('select', selected);
    }
  });
  // Show feature
  select.on('select:show', (e) => {
    const selected = e.shown_feature ? getGeoJSON([e.shown_feature]) : [];
    api.postMessage('select:show', selected[0]);
  })
})

// Add feature selection
api.setAPI({
  /** Search features using conditions
   * @memberof api
   * @param {Condition|Array<Condition>} condition
   * @param {function} [callback] a function that takes a {@link GeoJSONFeature} array
   * @instance 
   */
  getFeatures: data => {
    if (map) {
      const features = selectFeatures(data);
      return getGeoJSON(features, map.getView().getProjection());
    }
  },

  /** Select features matching conditions   
   * The layer to search in is the layer of the first condition (other are ignored)   
   * useCase and matchAll options are set in the first condition (other are ignored)
   * @memberof api
   * @param {Condition|Array<Condition>} condition
   * @param {function} [callback] a function that takes the number of features selected as argument
   * @instance 
   */
  selectFeatures: data => {
    if (selector) {
      const select = story.getCarte().getInteraction('select').getFeatures();
      const deselect = select.getArray();
      select.clear();
      const features = selectFeatures(data);
      features.forEach(f => select.push(f));
      story.getCarte().getInteraction('select').dispatchEvent({
        type: 'select',
        selected: features,
        deselected: deselect
      });
      return features.length;
    }
  },
  
  /** Get the current selection
   * @memberof api
   * @param {function} [callback] a function that takes a {@link GeoJSONFeature} array
   * @instance 
   */
  getSelection: () => {
    const select = story.getCarte().getInteraction('select');
    return getGeoJSON(select.getFeatures(), map.getView().getProjection());
  },

  /** Delete selected features
   * @memberof api
   * @param {function} [callback] a function that takes the number of features deleted
   * @instance 
   */
  deleteSelection: () => {
    const select = story.getCarte().getInteraction('select');
    select.getFeatures().forEach(f => {
      f.getLayer().getSource().removeFeature(f)
    })
    const features = select.getFeatures().getLength()
    select.getFeatures().clear();
    return features
  },

  /** Filter feature on condition: hide features that don't match the condition.   
   * The layer to search in is the layer of the first condition (other are ignored)   
   * useCase and matchAll options are set in the first condition (other are ignored)   
   * If attr option is missing all features will be selected
   * @memberof api
   * @param {Condition|Array<Condition>} condition
   * @param {function} [callback] a function that takes a {@link filterResult} 
   * @instance 
   */
  filterFeatures: (data) => {
    if (map) {
      if (!(data instanceof Array)) data = [data];
      const id = getLayerId(data)
      const layer = story.getCarte().getMap().getLayers().getArray().find(l => l.get('id') == id)
      if (!data[0].attr) {
        // Show all features
        layer.getSource().getFeatures().forEach(function(f) {
          f.setStyle(null);
        });
        return { nb: layer.getSource().getFeatures().length, size: layer.getSource().getFeatures().length }
      } else {
        const features = selectFeatures(data);
        // Clear selected features
        story.getCarte().getSelect().getFeatures().clear();
        story.getCarte().popup.hide();
        // Hide features
        layer.getSource().getFeatures().forEach(function(f) {
          f.setStyle([]);
        });
        // Show current
        features.forEach(function(f) {
          f.setStyle(null);
        });
        return { nb: features.length, size: layer.getSource().getFeatures().length }
      }
    }
  }
});

window.selector = selector