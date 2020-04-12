import Keybord from './class.js';
import {UPPERKEY, KEY_CODE, KEYS} from './const.js';

window.onload = () => {
    document.body.innerHTML = "";
    Keybord.checkLocalstorage();
    let capsLock = localStorage.capsLock === '1' ? true : false;
    const keybord = new Keybord(localStorage.lang, capsLock, KEYS, KEY_CODE, UPPERKEY);
    keybord.renderKeybord();
    keybord.addListenersOnKeys();
};