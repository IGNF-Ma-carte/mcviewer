import 'mcutils/charte/charte.css'
import config from 'mcutils/config/config'
import StoryMap from 'mcutils/StoryMap'
import { getUrlParameter, hasUrlParameter } from 'mcutils/control/url'
import loader from 'mcutils/dialog/loader'
import VectorStyle from 'mcutils/layer/VectorStyle'
import ProgressBar from 'ol-ext/control/ProgressBar.js'

import dialog from 'mcutils/dialog/dialog'
import serviceURL from 'mcutils/api/serviceURL'

import { loadFile, loadMap } from './loader.js'

import './index.css'

// Get parameters
const params = {
  mapID: getUrlParameter('map'),
  file: getUrlParameter('file')
}
if (!params.file && !params.mapID) {
  // Try to get ID in the url path: path/ID/TITLE
  const path = document.location.pathname.split('/');
  params.mapID = path[path.length-2];
}

// The storymap
const story = new StoryMap({
  fullscreen: true,
  target: (params.mapID || params.file) ? document.querySelector('[data-role="storymap"]') : null,
  key: config.gppKey
});
  
// Error link
const elt = document.createElement('A');
elt.innerHTML = 'consulter l\'atlas...<i class="fa fa-external-link"></i>';
elt.href = config.atlasUrl || serviceURL.search;

// Load from map param
if (!loadMap(story, params)) {
  // If no map, load from file param / show error
  if (!loadFile(story, params)) {
    setTimeout(() => {
      story.dispatchEvent({ type: 'error' })
    })
  }
}

// Action when readed
story.on('read', () => {
  // Get url position on read
  story.useUrlPosition();
  loader.hide();
  // Remove title
  if (hasUrlParameter('notitle') || hasUrlParameter('noTitle')) {
    story.showTitle(false);
  }
  // Layerswitcher model
  story.switcherModel();
  // Display tools
  story.addToolBar();

  // Add progress bar (on load)
  [ story.getCarte(0), story.getCarte(1) ].forEach(carte => {
    if (carte) {
      const map =  carte.getMap()
      if (map) {
        const pbar = new ProgressBar({
          label: ''
        });
        map.addControl(pbar)
        const layers = [];
        map.getLayers().forEach(l => {
          if (l.getSource()) {
            layers.push(l)
          }
        })
        pbar.setLayers(layers)
      }
    }
  })

/* OPTIONS */

  // Load layer as images
  if (getUrlParameter('mode')==='image') {
    story.getCarte(0).getMap().getLayers().forEach(l => {
      if (l instanceof VectorStyle) {
        l.setMode('image');
      }
    })
  }

  // Model RLT
  if (hasUrlParameter('rlt') && story.get('model')==='compare') {
    story.setModel('compareRLT');
  }

/* DEBUG * /
  // Special models
  if (hasUrlParameter('model')) {
    story.setModel(getUrlParameter('model'));
    if (getUrlParameter('model')==='differentiel') {
      story.setLayerSelection('Découpage :<br>');
      //story.setIndicators('Indicateur 1,Indicateur 2');
      story.setIndicators([
        'indic1::Usage agricole',
        'indic2::Infrastructures routières',
        'indic3::Potentiel de compensation',
        'indic4::Sobriété foncière',
      ].join(','));
      story.setControl('searchBar', true)
    }
  }
/**/
});

// Error
story.on('error', e => {
  loader.hide();
  if (e.recursive) {
    dialog.show404('Le modèle onglet ne peut pas contenir une carte onglet', 'Impossible de charger la carte')
  } else {
    dialog.show404(elt , 'Pas de carte à cette adresse')
  }
})

/* Macarte API: Handle position / parent window (simple API) */
story.on('read', () => {
  if (window.parent !== window && story.getCarte() && story.getCarte().getMap()){
    const view = story.getCarte().getMap().getView();
    story.getCarte().getMap().on('moveend', () => {
      window.parent.postMessage({ 
        type: 'centermap', 
        center: view.getCenter(), 
        zoom: view.getZoom(), 
        rotation: view.getRotation() 
      }, '*');
    })
    window.addEventListener('message', function(e) {
      if (e.data.type === 'centermap') {
        if (Object.prototype.hasOwnProperty.call(e.data, 'center')) view.setCenter(e.data.center)
        if (Object.prototype.hasOwnProperty.call(e.data, 'zoom')) view.setZoom(e.data.zoom)
        if (Object.prototype.hasOwnProperty.call(e.data, 'rotation')) view.setRotation(e.data.rotation)
      }
    })
  }
})

// Enable drop file if no params
if (!params.mapID && !params.file) {
  // Enable drag / drop
  function ondrag(e) {
    e.preventDefault();
  } 
  window.addEventListener('dragover', ondrag);
  // Open Story on drop
  function ondrop(e) {
    e.preventDefault()
    const files = e.dataTransfer.files;
    if (files.length) {
      var reader = new FileReader();
      reader.onload = function () {
        const carte = JSON.parse(reader.result);
        story.readData(carte)
        window.removeEventListener('dragover', ondrag)
        window.removeEventListener('drop', ondrop)
      }
      // Reload
      story.setTarget(document.querySelector('[data-role="storymap"]'))
      dialog.hide()
      loader.show()
      // Load
      reader.readAsText(files[0]);
    }
  }
  window.addEventListener('drop', ondrop);
}


export default story