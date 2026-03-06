import './version.js'
import config from 'mcutils/config/config'
import setPiwik from 'mcutils/charte/setPiwik'
import story from './storymap'
// Add slide for video
import 'mcutils/charte/mcPrez'

// Font Open sans
import "@fontsource/open-sans/800.css";
import "@fontsource/open-sans/800-italic.css"; 
import "@fontsource/open-sans/700.css";
import "@fontsource/open-sans/700-italic.css"; 
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/600-italic.css"; 
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/500-italic.css"; 
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/400-italic.css"; 
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/300-italic.css"; 
// Fonts Fira sans
import '@fontsource/fira-sans/800.css'
import '@fontsource/fira-sans/800-italic.css'
import '@fontsource/fira-sans/700.css'
import '@fontsource/fira-sans/700-italic.css'
import '@fontsource/fira-sans/600.css'
import '@fontsource/fira-sans/600-italic.css'
import '@fontsource/fira-sans/500.css'
import '@fontsource/fira-sans/500-italic.css'
import '@fontsource/fira-sans/400.css'
import '@fontsource/fira-sans/400-italic.css'
import '@fontsource/fira-sans/300.css'
import '@fontsource/fira-sans/300-italic.css'

// API
import api from './api/api'
import './api/center'
import './api/select'
import './api/popup'
import './api/layers'
import './api/etape'
import './api/editTools'
import './api/dialog'
import './api/mapControl'
import './api/layout.js'
import './api/tab.js'

// Story is loadeded => connect api
story.on('read', () => {
  api.postMessage('loaded', true) ;
});

// Test the story is ready (loaded)
api.setAPI({
  isReady: () => {
    if (story.get('model') === 'onglet') return true;
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
