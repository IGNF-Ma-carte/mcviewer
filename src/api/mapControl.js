import api from './api'
import story from '../storymap'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'

// Add collapsed fn
LayerSwitcher.prototype.isCollapsed = function() {
  return !this.isOpen()
}

const mapControls = [ 'toolbar', 'zoom', 'scaleLine', 'attribution', 'mousePosition', 'layerSwitcher', 'profil', 'printDlg', 'legend', 'searchBar', 'locate' ]

// mapControl api
api.setAPI({
  /** Get map control properties (visible, collapsed)
   * @memberof api
   * @param {Object|string} options options to set the control properties or the control id
   *  @param {string} options.id the control id: toolbar,zoom,scaleLine,attribution,mousePosition,layerSwitcher,profil,printDlg,legend,searchBar,locate
   *  @param {boolean} [options.visible]
   *  @param {boolean} [options.collapsed]
   * @instance
   */
  mapControl: options => {
    // Get options
    options = options || {};
    if (typeof(options) === 'string') options = { id: options };
    if (mapControls.indexOf(options.id) >= 0) {
      const carte = story.getCarte();
      const ctrl = carte.getControl(options.id);
      if (ctrl) {
        // Set visible
        if (options.visible !== undefined) {
          carte.showControl(options.id, options.visible);
        }
        // Set collapsed
        if (options.collapsed !== undefined) {
          if (ctrl.collapse) {
            ctrl.collapse(options.collapsed);
          } else if (ctrl.show) {
            if (options.collapsed) ctrl.hide();
            else ctrl.show();
          }
          
        }
        // Response
        const resp = {
          id: options.id,
          visible: carte.hasControl(options.id),
        }
        if (ctrl.isCollapsed) {
          resp.collapsed = ctrl.isCollapsed()
        }
        return resp;
      }
    }
    return { error: 'nocontrol', message: 'No control ' + options.id }
  }
})