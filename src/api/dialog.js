import api from './api';
import notification from 'mcutils/dialog/notification';
import Dialog from 'ol-ext/control/Dialog'
import fakemap from 'mcutils/dialog/fakeMap'

const dialog = new Dialog({ 
  className: 'md',
  closeBox: true,
  target: document.body
});
dialog.setMap(fakemap);

// Add new functions
api.setAPI({
  /** Display a message on the map
   * @memberof api
   * @param {string|Object} [options] the message or a list of options, if none close the dialog
   *  @param {string} options.message the message
   *  @param {string} [options.type=notification] the message type (notification, message, alert, wait)
   * @instance
   */
  message: (options) => {
    // Close ?
    if (!options) {
      dialog.close();
      notification.hide()
      return;
    }
    // Show message
    if (typeof(options) === 'string') {
      notification.show(options)
    } else {
      switch(options.type) {
        case 'message':
        case 'wait': 
        case 'alert': {
          dialog.show({
            className: options.type,
            content: options.message,
            closeBox: false,
            buttons: /wait/.test(options.type) ? null : { cancel: 'ok'},
          })
          break;
        }
        default: {
          notification.show(options.message)
          break;
        }
      }
    }
  },
})