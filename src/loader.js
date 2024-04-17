import config from 'mcutils/config/config'
import loader from 'mcutils/dialog/loader'
import api from 'mcutils/api/api'

function loadFile(story, params) {
  if (!params.file) return false
  // Load from file
  const atlas = config.atlas;
  let url = params.file;
  if (atlas && atlas.maps && atlas.maps[params.file]) {
    url = (atlas.path || './') + atlas.maps[params.file].url;
  }
  fetch(url).then(e => {
    e.text().then(carte => {
      try {
        story.readData(JSON.parse(carte), undefined, atlas.maps[params.file])
      } catch(err) {
        story.dispatchEvent({ type: 'error' })
      }
    })
  })
  return true
}

function loadMap(story, params) {
  if (!params.mapID) return false;

  // Start loading
  loader.show(0);
  
  // Get the map
  api.getMap(params.mapID, (e) => {
    if (e.error) {
      e.type = 'error';
      story.dispatchEvent(e)
      return;
    }
    if (e.premium === 'edugeo') story.set('key', config.edugeoKey)
    if (!e.active) document.body.dataset.active = 0;
    if (!e.valid) document.body.dataset.valid = 0;
    // Load story
    story.load(e)
  })
  // OK
  return true;
}

export { loadFile, loadMap }