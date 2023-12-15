import './version.js'
import config from 'mcutils/config/config'
import setPiwik from 'mcutils/charte/setPiwik'
import story from './storymap'
// Add slide for video
import 'mcutils/charte/mcPrez'
// API
import api from './api/api'
import './api/center'
import './api/select'
import './api/popup'
import './api/layers'
import './api/etape'
import './api/editTools'
import './api/dialog'
import './api/mapControl.js'

// Story is loadeded => connect api
story.on('read', () => {
  api.postMessage('loaded', true) ;
});
// Test the story is ready (loaded)
api.setAPI({
  isReady: () => {
    return !!story.getCarte();
  }
})

/* Piwik */
if (config.sitePiwik) {
  setPiwik(config.sitePiwik)
}

/* DEBUG */
window.story = story;
window.api = api;
/**/
