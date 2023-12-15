import element from 'ol-ext/util/element'
import Button from 'ol-ext/control/Button'

import api, { getGeoJSON } from './api'
import { addDrawTools } from 'mcutils/control/toolbar'
import { exportLayer } from './layers'

import story from '../storymap'
import dialog from 'mcutils/dialog/dialog'

import './editTools.css'

/* A dialog to set feature attributes
 * @param {Feature} feature
 */
function dialogAttributes(feature) {
  const layer = feature.getLayer();
  if (!layer || !Object.keys(layer.getAttributes()).length) return;
  const content = element.create('UL');
  const fattr = feature.getProperties()
  const changed = {}
  Object.values(layer.getAttributes()).forEach(attr => {
    const li = element.create('LI', { parent: content })
    if (attr.type !== 'checkbox') {
      element.create('LABEL', { text: attr.name, parent: li })
    }
    switch (attr.type) {
      // Select options
      case 'select': {
        const sel = element.create('SELECT', { 
          change: () => changed[attr.name] = sel.value,
          parent: li
        })
        attr.values.split('|').forEach(v => {
          element.create('OPTION', {
            text: v,
            value: v,
            parent: sel
          })
        })
        sel.value = Object.prototype.hasOwnProperty.call(fattr, attr.name) ? feature.get(attr.name) : attr.default;
        break;
      }
      // Checkbox
      case 'checkbox': {
        const check = element.createCheck({
          after: attr.name,
          checked: feature.get(attr.name),
          parent: li
        })
        check.addEventListener('change', (e) => changed[attr.name] = e.target.value);
        break;
      }
      // Text area
      case 'text': {
        element.create('TEXTAREA', {
          text: Object.prototype.hasOwnProperty.call(fattr, attr.name) ? feature.get(attr.name) : attr.default,
          change: (e) => changed[attr.name] = e.target.value,
          parent: li
        })
        break;
      }
      // String or number
      default: {
        const input = element.create('INPUT', {
          type: /number|integer/.test(attr.type) ? 'number' : 'text',
          step: attr.type === 'integer' ? 1 : 'any',
          value: Object.prototype.hasOwnProperty.call(fattr, attr.name) ? feature.get(attr.name) : attr.default,
          change: (e) => {
            let val = e.target.value
            if (attr.type==='integer') val = parseInt(val)
            if (attr.type==='number') val = parseFloat(val)
            changed[attr.name] = val
          },
          parent: li
        })
        // Only numbers
        if (attr.type === 'integer') {
          input.addEventListener('keydown', e => {
            if (e.ctrlKey || e.keyCode < 65) return;
            if (!/[0-9]|-/.test(e.key)) e.preventDefault();
          })
        }
        break;
      }
    }
  })
  // Dialog
  dialog.show({
    title: 'Attributs',
    className: 'attributes',
    content: content,
    buttons: { submit: 'ok', cancel: 'annuler' },
    onButton: b => {
      if (b === 'submit') {
        // Update attributes
        Object.keys(changed).forEach(a => {
          let val = changed[a];
          const att = layer.getAttributes()
          if (att[a].type==='number') val = parseFloat(val)
          if (att[a].type==='integer') val = parseInt(val)
          feature.set(a, val)
        })
        // post edit
        api.postMessage('edit', {
          action: 'attributes',
          attributes: changed,
          features: getGeoJSON([feature]),
          layerId: layer.get('id')
        })
        dialog.close();
      }
    }
  })
}

// Current button id
let buttonId = 0;

/** Event when a feature are changed with the edit bar
 * @memberof api
 * @event edit
 * @property {Object} edit the map position
 *  @property {string} edit.action select, addfeature, drawend, removefeature, modifyfeature, attributes, import:start, import:end, export:start, export:end
 *  @property {Array<GeoJSONFeature>} edit.features 
 *  @property {Array<string>} edit.attributes list of modified attributes
 *  @property {number} edit.layerId 
 */

// Add new functions
api.setAPI({
  /** Add a new Editbar associated with a layer
   * @memberof api
   * @fires edit
   * @param {Object} options
   *  @param {number} [options.layerId] layer to draw in, if none create a ghost one
   *  @param {Array<string>} [options.tools] a list of tools to add, 
   *    if none get all tools ['Select','DrawPoint','DrawLine','DrawPolygon','DrawRegular','Transform','Attributes','Delete','Export','Import']
   * @param {function} callback a callback function with the layer to draw in or an error code
   * @instance
   */
  addEditBar: (options) => {
    options = options || {};
    const layer = story.getCarte().getMap().getLayers().getArray().find(l => l.get('id') == options.layerId);
    if (!layer || layer.get('type') === 'Vector') {
      const layerId = layer ? layer.get('id') : null;
      // Add draw tools
      const tbar = addDrawTools(story.getCarte(), options.tools, layer)
      story.getCarte().showControl('toolbar');
      // Import events
      tbar.on(['import:start', 'import:end', 'export:start', 'export:end'], e => {
        api.postMessage('edit', {
          action: e.type,
          nb: e.nb,
          layerId: layerId
        })
      })
      // Event handler
      const drawLayer = tbar.get('layer')
      if (drawLayer) {
        // Add / remove object
        drawLayer.getSource().on(['addfeature', 'removefeature'], e => {
          api.postMessage('edit', {
            action: e.type,
            features: getGeoJSON([e.feature]),
            layerId: layerId
          })
        })
        // Select an object to edit
        tbar.getSubBar().getInteraction('Select').on('select', e => {
          api.postMessage('edit', {
            action: 'select',
            features: getGeoJSON(e.target.getFeatures()),
            layerId: layerId
          })
        })
        // Update geometry
        tbar.getSubBar().getInteraction('ModifySelect').on('modifyend', e => {
          api.postMessage('edit', {
            action: 'modifyfeature',
            features: getGeoJSON(e.features),
            layerId: layerId
          })
        });
        // Prompt attributes
        ['DrawPoint','DrawLine','DrawPolygon','DrawRegular'].forEach(i => {
          const interaction = tbar.getSubBar().getInteraction(i);
          if (interaction) {
            interaction.on('drawend', e => {
              e.feature.setLayer(drawLayer)
              api.postMessage('edit', {
                action: e.type,
                features: getGeoJSON([e.feature]),
                layerId: layerId
              })
              dialogAttributes(e.feature)
            })
          }
        });
        // Transform
        const transform = tbar.getSubBar().getInteraction('Transform');
        if (transform) {
          transform.on(['rotateend', 'translateend', 'scaleend'], e => {
            api.postMessage('edit', {
              action: e.type,
              features: getGeoJSON([e.feature]),
              layerId: layerId
            })
          })
        }
        // Select
        const select = tbar.getSubBar().getInteraction('Select')
        // Edit attributes
        if (select && options.tools && options.tools.indexOf('Attributes') >= 0) {
          const attBt = new Button({
            title: 'Modifier les attributs...',
            className: 'disabled',
            html: '<i class="fi-text"></i>',
            handleClick: () => {
              const f = select.getFeatures().item(0);
              if (f) dialogAttributes(f);
            }
          })
          tbar.getSubBar().addControl(attBt)
          // Enable on selection
          const checkSel = function() {
            if (select.getFeatures().getLength()) {
              attBt.element.classList.remove('disabled')
            } else {
              attBt.element.classList.add('disabled')
            }
          }
          select.on('select', checkSel)
          drawLayer.getSource().on('removefeature', checkSel)
        }
      }
      return {
        layer: exportLayer(layer)
      }
    } else {
      return { 
        error: true,
        msg: 'Bad layer type.'
      }
    }
  },
  
  /** Add a new nexw button in the Editbar
   * @memberof api
   * @event button
   * @param {Object} [options]
   *  @param {string} [options.title] button title
   *  @param {string} [options.name] button name, default will increment a new one
   *  @param {string} [options.icon] button icon (as font icon class)
   * @param {function} callback a function that takes button name
   * @instance
   */
  addEditButton: (options) => {
    options = options || {};
    story.getCarte().showControl('toolbar');
    const tbar = story.getCarte().getControl('toolbar');
    const name = options.name || ('button_' + (++buttonId));
    const attBt = new Button({
      title: options.title,
      html: element.create('I', { className: 'fa ' + options.icon }),
      handleClick: () => {
        api.postMessage('button', name)
      }
    })
    tbar.addControl(attBt)
    return name
  }
})