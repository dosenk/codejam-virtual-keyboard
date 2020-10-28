import Keybord from './modules/Keybord';
import { UPPERKEY, KEY_CODE, KEYS } from './modules/const';

window.onload = () => {
  document.body.innerHTML = '';
  Keybord.checkLocalstorage();
  // const capsLock = localStorage.capsLock === '1';
  const capsLockFlag = false;
  const keybord = new Keybord(localStorage.lang, capsLockFlag, KEYS, KEY_CODE, UPPERKEY);
  keybord.renderKeybord();
  keybord.addListenersOnKeys();
};
