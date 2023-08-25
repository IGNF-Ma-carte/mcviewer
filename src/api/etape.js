import api from './api'
import story from '../storymap';
import { toLonLat } from 'ol/proj'

api.setAPI({
  /** Get the current step (model 'etape' only)
   * @memberof api
   * @param {function} callback a function that takes the current step index
   * @instance 
   */
  getStep: () => {
    return story.currentStep || 0;
  },
  /** Get a list of steps (model 'etape' only)
   * @memberof api
   * @param {function} callback a function that takes a list of steps
   * @instance 
   */
  getSteps: () => {
    const steps = [];
    story.getSteps().forEach(s => {
      steps.push({
        title: s.title,
        center: toLonLat(s.center),
        zoom: s.zoom
      })
    })
    return steps;
  },
  /** Go to a step (model 'etape' only)
   * @memberof api
   * @param {number} n step index to goto
   * @instance 
   */
  setStep: (n) => {
    story.setStep(n);
  }
});

/** Listen to step change (model 'etape' only)
 * @memberof api
 * @event step
 * @property {number} step current step
 */
story.on('read', () => {
  story.on('change:step', (step) => {
    api.postMessage('step', step.position);
  })
});