import api from "mcutils/api/api"

const connectDlg = document.querySelector('[data-role="connect"]')
const inputName = connectDlg.querySelector('input.name');
const inputPwd = connectDlg.querySelector('input.pwd');
let loadFromParams;

function showDlg(b) {
  if (b===false) {
    delete connectDlg.dataset.visible;
  } else {
    connectDlg.dataset.visible = '';
  }
}
connectDlg.addEventListener('submit', e => {
  e.stopPropagation();
  e.preventDefault();
  showDlg(false)
  // Connect
  api.login(inputName.value, inputPwd.value, (user) => {
    if (user) {
      loadFromParams();
    } else {
      showDlg()
    }
  })
})

function connect(cback) {
  loadFromParams = cback;
  showDlg();
  const user = api.getMe()
  if (user && !user.error) {
    inputName.value = user.username;
  } else {
    inputName.focus()
  }
}

export default connect