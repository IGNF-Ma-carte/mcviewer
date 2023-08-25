import api from './api'
import story from '../storymap'

import { fromLonLat } from 'ol/proj'
import Popup from 'ol-ext/overlay/Popup'
import md2html from 'mcutils/md/md2html';

const popup = new Popup({
  positioning: 'bottom-center',
  closeBox: true,
  minibar: true,
  anim: true
});

story.on('read', () => {
  if (!story.getCarte()) return;
  const map = story.getCarte().getMap();
  map.addOverlay(popup);
})

api.setAPI({
  /** Show a popup on the map
   * @memberof api
   * @param {Object} options
   *  @param {JSONCoordinate} options.position longitude / latitude of the popup
   *  @param {string} options.content the popup content (formated with Markdown)
   * @instance 
   */
  popup: (data) => {
    popup.hide();
    if (data) {
      const map = story.getCarte().getMap();
      const pos = fromLonLat(data.position) || map.getView().getCenter();
      popup.show(pos, md2html.element(data.content));
    }
  },
});