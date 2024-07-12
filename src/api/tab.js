import api from './api'
import story from '../storymap';

function tabObj(t, i) {
  if (!t) return {};
  return {
    index: i,
    id: t.id,
    title: t.title,
    type: t.type,
    active: t.button.classList.contains('selected')
  }
}


api.setAPI({
  /** Get the current tab index
   * @memberof api
   * @param {function} callback a function that takes the current tab
   * @instance 
   */
  getTab: () => {
    const i = story.getSelectTabIndex();
    return tabObj(story.tabs.item(i), i);
  },
  /** Change the current tab
   * @memberof api
   * @param {number|string} id the current tab index (or the carte public id)
   * @param {function} callback a function that takes the current tab
   * @instance 
   */
  setTab: (id) => {
    story.selectTab(id);
    const i = story.getSelectTabIndex();
    return tabObj(story.tabs.item(i), i);
  },
  /** Get the list of tabs
   * @memberof api
   * @param {function} callback a function that takes an array of tabs
   * @instance 
   */
  getTabs: () => {
    const tabs = [];
    story.tabs.forEach((t,i) => {
      tabs.push(tabObj(t, i))
    })
    return tabs
  },
})