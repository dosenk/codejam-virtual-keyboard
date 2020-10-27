import Keybord from './class.js';
import {UPPERKEY, KEY_CODE, KEYS} from './const.js';

window.onload = () => {
    document.body.innerHTML = "";
    Keybord.checkLocalstorage();
    // let capsLock = localStorage.capsLock === '1' ? true : false;
    let capsLockFlag = false; // при завгрузке страницы капслок не нажат
    const keybord = new Keybord(localStorage.lang, capsLockFlag, KEYS, KEY_CODE, UPPERKEY);
    keybord.renderKeybord();
    keybord.addListenersOnKeys();
};