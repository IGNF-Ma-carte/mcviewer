import api from './api'
import jCSSRule from 'mcutils/layout/jCSSRule'

const stylesheet = document.createElement('style');
stylesheet.setAttribute('type', 'text/css');
if (document.body) document.body.appendChild(stylesheet);
else document.head.appendChild(stylesheet);

api.setAPI({
  /** Change the map layout
   * @memberof api
   * @param {Object} options 
   *  @param {string} [options.css] full text css declaration
   *  @param {string} [options.jcss] css declaration as an array [selector, { prop: value }]
   *  @param {string} [options.styleURI] url to a css file
   * @example
   * api.layout({ css: '.ol-control button { background-color: red!important; font-size: 2em; }' });
   * api.layout({ jcss: ['button',  { "background-color": "red!important", "font-size": "2em" } ]});
   * api.layout({ styleURI: 'http://server.fr/style.css' });
   * @instance
   */
  layout: options => {
    // Full text CSS
    if (options.css) {
      stylesheet.innerHTML = options.css;
    }
    // Json CSS
    if (options.jcss) {
      jCSSRule(options.jcss[0], options.jcss[1])
    }
    // Style URL
    if (options.styleURI) {
      const stylesheet = document.createElement('link');
      stylesheet.setAttribute('rel', 'stylesheet');
      stylesheet.setAttribute('href', options.styleURI);
      if (document.body) document.body.appendChild(stylesheet);
      else document.head.appendChild(stylesheet);
      console.log(document.body)
    }
  }
})
