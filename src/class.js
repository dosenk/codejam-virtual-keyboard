export default class Keybord {
  constructor(lang, capsLock, keys, keyCode, upperkey) {
    this.keys = keys;
    this.keyCode = keyCode;
    this.language = lang;
    this.clickedButton = new Set();
    this.clickedMouse = new Set();
    this.capsLockFlag = capsLock;
    this.upperkey = upperkey;
  }

  static createButton(tagName, innerText = null, ...classes) {
    const element = document.createElement(tagName);
    classes.forEach((className) => {
      element.classList.add(className);
      if (innerText !== null) element.innerText = innerText;
    });
    return element;
  }


  static checkLocalstorage() {
    if (typeof localStorage.lang === 'undefined') localStorage.lang = 'ru';
    if (typeof localStorage.capsLock === 'undefined') localStorage.capsLock = 1;
    return localStorage;
  }

  static setAttribute(tagName, ...attribute) {
    attribute.forEach((attr) => {
      tagName.setAttribute(attr[0], attr[1]);
    });
    return tagName;
  }

  renderKeybord() {
    this.clickedButton.clear();
    this.clickedMouse.clear();
    const mainDiv = Keybord.createButton('div', null, 'wrapper');
    const textAreaDiv = Keybord.createButton('div', null, 'textArea');
    const textArea = Keybord.createButton('textarea');
    Keybord.setAttribute(textArea, ['autofocus', ''], ['cols', '55'], ['rows', '10']);
    textArea.focus();
    textArea.onblur = () => textArea.focus();
    const keydbord = Keybord.createButton('div', null, 'keydbord-wrapper');
    const infoDiv = Keybord.createButton('div', null, 'info');
    const innerText = 'Клавиатура создана в операционной системе Windows \t\n Для переключения языка комбинация: левыe Shift + Alt';
    const infoDivText = Keybord.createButton('p', innerText, 'infoText');
    infoDiv.append(infoDivText);
    textAreaDiv.append(textArea);

    this.keyCode.forEach((key) => {
      const buttonDiv = Keybord.createButton('div', null, 'key', key);
      buttonDiv.setAttribute('code', key);
      const buttonSpanRu = Keybord.createButton('span', null, 'lang', 'ru');
      const buttonSpanEn = Keybord.createButton('span', null, 'lang', 'en');
      const index = this.keyCode.indexOf(key);
      let capslockClassRu = 'notCaps'
      let capslockClassEn = 'notCaps'
      if (index < 1) {
        capslockClassRu = 'Caps'
        capslockClassEn = 'notCaps'
      }
      if (index >=1 && index <= 14) {
        capslockClassRu = 'notCaps'
        capslockClassEn = 'notCaps'
      }
      if (index >=15 && index <= 24) {
        capslockClassRu = 'Caps'
        capslockClassEn = 'Caps'
      }
      if (index >=25 && index <= 26) {
        capslockClassRu = 'Caps'
        capslockClassEn = 'notCaps'
      }
      if (index >=29 && index <= 38) {
        capslockClassRu = 'Caps'
        capslockClassEn = 'Caps'
      }
      if (index >=39 && index <= 40) {
        capslockClassRu = 'Caps'
      }
      if (index >=43 && index <= 49) {
        capslockClassRu = 'Caps'
        capslockClassEn = 'Caps'
      }
      if (index >= 50 && index <= 51) {
        capslockClassRu = 'Caps'
      }
      const buttonSpanUpEn = Keybord.createButton('span', this.keys.EN_CAPS[index], 'buttonUp', capslockClassEn);
      const buttonSpanUpRu = Keybord.createButton('span', this.keys.RU_CAPS[index], 'buttonUp', capslockClassRu);
      const buttonSpanDownEn = Keybord.createButton('span', this.keys.EN[index], 'button', capslockClassEn);
      const buttonSpanDownRu = Keybord.createButton('span', this.keys.RU[index], 'button', capslockClassRu);
      buttonSpanEn.append(buttonSpanDownEn, buttonSpanUpEn);
      buttonSpanRu.append(buttonSpanDownRu, buttonSpanUpRu);
      if (this.language === 'ru') {
        buttonSpanRu.classList.add('active');
        if (this.capsLockFlag) buttonSpanUpRu.classList.add('active-button');
        else buttonSpanDownRu.classList.add('active-button');
      } else if (this.language === 'en') {
        buttonSpanEn.classList.add('active');
        if (this.capsLockFlag) buttonSpanUpEn.classList.add('active-button');
        else buttonSpanDownEn.classList.add('active-button');
      }
      buttonDiv.append(buttonSpanRu, buttonSpanEn);
      // if (key === 'CapsLock' && this.capsLockFlag) {
      //   if (!buttonDiv.classList.contains('clicked-button-capslock')) {
      //     buttonDiv.classList.add('clicked-button-capslock');
      //     this.clickedButton.add('CapsLock');
      //     this.clickedMouse.add('CapsLock');
      //   }
      // }
      keydbord.append(buttonDiv);
    });
    mainDiv.append(textAreaDiv, keydbord, infoDiv);
    document.body.append(mainDiv);
   
  }

  addListenersOnKeys() {
    window.onblur = () => {
      document.querySelectorAll('.clicked-button').forEach((child) => {
        if (child.getAttribute('code') !== 'CapsLock') child.classList.remove('clicked-button');
      });
    };
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      const { code } = event;
      if (this.keyCode.indexOf(code) < 0) return;
      this.clickedButton.add(code)
      this.keyDownHandler(event, code);
    });
    document.addEventListener('keyup', (event) => {
      event.preventDefault();
      const { code } = event;
      if (this.keyCode.indexOf(code) < 0) return;
      if (this.upperkey.indexOf(code) < 0) this.clickedButton.delete(code);
      this.keyUpHandler(event, code);
    });
    document.addEventListener('mousedown', (event) => {
      if (event.target.classList.contains('active-button')) {
        const code = event.target.parentNode.parentNode.getAttribute('code');
        this.clickedMouse.add(code);
        this.keyDownHandler(event, code);
      }
    });
    document.addEventListener('mouseup', (event) => {
      if (!this.clickedMouse.has('CapsLock')) this.clickedMouse.clear();
      document.querySelectorAll('.clicked-button').forEach((elem) => elem.classList.remove('clicked-button'));
      if (event.target.classList.contains('active-button')) {
        const code = event.target.parentNode.parentNode.getAttribute('code');
        this.keyUpHandler(event, code);
      }
    });
    Keybord.renderActiveButton(this.language, 'button', null, true);
  }

  keyDownHandler(e, key) {
    console.log(e.code);
    if (key === 'CapsLock') {
      if (e.repeat) return;
      localStorage.capsLock = this.capsLockFlag ? 2 : 1;
      this.capsLockFlag = !this.capsLockFlag;
      const capslock = this.capsLockFlag ? 'buttonUp' : 'button';

      if (!document.querySelector(`.${key}`).classList.contains('clicked-button-capslock')) {
        document.querySelector(`.${key}`).classList.add('clicked-button-capslock');
      } else {
        document.querySelector(`.${key}`).classList.remove('clicked-button-capslock');
        this.clickedButton.delete(key);
        this.clickedMouse.delete(key);
      }
      Keybord.renderActiveButton(this.language, capslock, 'notCaps');

      return;
    }
    if (e.shiftKey && e.altKey) {
      if (this.clickedButton.has('ShiftLeft') && this.clickedButton.has('AltLeft')) {
        localStorage.lang = localStorage.lang === 'ru' ? 'en' : 'ru';
        this.language = localStorage.lang;
        document.querySelectorAll('.lang').forEach((span) => {
          span.classList.toggle('active');
          span.childNodes.forEach((item) => item.classList.remove('active-button'));
        });
        const letterClass = this.capsLockFlag ? 'buttonUp' : 'button';
        Keybord.renderActiveButton(this.language, letterClass, null, true);
      }
    }
    if (key === 'ShiftLeft' || key === 'ShiftRight') {
      document.querySelector('.ShiftLeft').classList.remove('clicked-button-capslock');
      document.querySelector('.ShiftRight').classList.remove('clicked-button-capslock');
      document.querySelector(`.${key}`).classList.add('clicked-button-capslock');
      if (e.repeat) return;
      if (this.clickedButton.has('ShiftLeft') || this.clickedButton.has('ShiftRight')) {
        if (this.clickedMouse.has('ShiftLeft') || this.clickedMouse.has('ShiftRight')) return;
      }
      if (this.clickedButton.has('ShiftLeft') && key === 'ShiftRight') {
        this.clickedButton.delete('ShiftLeft');
        this.clickedMouse.delete('ShiftLeft');
      }
      if (this.clickedButton.has('ShiftRight') && key === 'ShiftLeft') {
        this.clickedButton.delete('ShiftRight');
        this.clickedMouse.delete('ShiftRight');
      }
      this.capsLockFlag = !this.capsLockFlag;
      const letterClass = this.capsLockFlag ? 'buttonUp' : 'button';
      Keybord.renderActiveButton(this.language, letterClass);
      return;
    }
    if (key === 'AltLeft' || key === 'AltRight' || key === 'ControlLeft' || key === 'ControlRight' || key === 'MetaLeft') {
      document.querySelector(`.${key}`).classList.add('clicked-button');
      return;
    }
    this.input = document.querySelector('textarea');
    let { selectionStart } = this.input;
    let { selectionEnd } = this.input;
    let keyValue = this.getLetter(key);

    Keybord.changeClassClickedButton(key, true);

    if (key === 'Backspace' || key === 'Delete') {
      if (key === 'Backspace') {
        if (selectionEnd === 0) return;
        if (selectionEnd === selectionStart) selectionStart -= 1;
      }
      if (key === 'Delete') {
        if (this.input.value.length <= 0) return;
        if (selectionEnd === selectionStart) selectionEnd += 1;
      }
      this.input.value = this.input.value.slice(0, selectionStart)
      + this.input.value.slice(selectionEnd);
      this.input.selectionStart = selectionStart;
      this.input.selectionEnd = selectionStart;
      return;
    }
    if (key === 'Tab') keyValue = '\t';
    if (key === 'Enter') keyValue = '\n';
    if (key === 'Space') keyValue = ' ';
    if (key === 'ArrowLeft') keyValue = '←';
    if (key === 'ArrowRight') keyValue = '→';
    if (key === 'ArrowUp') keyValue = '↑';
    if (key === 'ArrowDown') keyValue = '↓';

    this.input.value = this.input.value.slice(0, selectionStart) + keyValue
    + this.input.value.slice(selectionEnd);
    this.input.selectionStart = selectionStart + 1;
    this.input.selectionEnd = selectionStart + 1;
  }

  keyUpHandler(e, key) {
    if (key === 'CapsLock') return;

    if (key === 'ShiftLeft' || key === 'ShiftRight') {
      document.querySelector('.ShiftLeft').classList.remove('clicked-button-capslock');
      document.querySelector('.ShiftRight').classList.remove('clicked-button-capslock');
      this.clickedButton.delete('ShiftLeft');
      this.clickedButton.delete('ShiftRight');
      this.clickedMouse.delete('ShiftLeft');
      this.clickedMouse.delete('ShiftRight');
    
    if (this.clickedButton.has('CapsLock') || this.clickedMouse.has('CapsLock')) {
      this.capsLockFlag = true;
      Keybord.renderActiveButton(this.language, 'buttonUp');
    } else {
      this.capsLockFlag = false;
      Keybord.renderActiveButton(this.language, 'button');
    }
    if (this.clickedButton.has('ShiftLeft') || this.clickedButton.has('ShiftRight')) {
      this.capsLockFlag = true;
      let letterClass = 'buttonUp';
      if (this.clickedButton.has('CapsLock') || this.clickedMouse.has('CapsLock')) letterClass = 'button';
      Keybord.renderActiveButton(this.language, letterClass);
    }
    if (this.clickedMouse.has('ShiftLeft') || this.clickedMouse.has('ShiftRight')) {
      this.capsLockFlag = true;
      let letterClass = 'buttonUp';
      if (this.clickedButton.has('CapsLock') || this.clickedMouse.has('CapsLock')) letterClass = 'button';
      Keybord.renderActiveButton(this.language, letterClass);
    }
  }
    Keybord.changeClassClickedButton(key, false);
  }

  static changeClassClickedButton(key, flag) {
    const nowClickedButton = document.querySelector(`.${key}`);
    if (flag) nowClickedButton.classList.add('clicked-button');
    else nowClickedButton.classList.remove('clicked-button');
  }

  getLetter(key) {
<<<<<<< HEAD
    let buttons = document.querySelectorAll('div.key')
    let letter
    buttons.forEach((button) => {
      if (button.getAttribute('code') === key) {
        letter = button.querySelector('.active-button').innerText
      }
    })
    return letter
=======
    const keyIndex = this.keyCode.indexOf(key);
    const lang = this.language.toUpperCase();
    const capslock = document.querySelector('.CapsLock').classList.contains('clicked-button-capslock');
    const leftShift = document.querySelector('.ShiftLeft').classList.contains('clicked-button-capslock');
    const rightShift = document.querySelector('.ShiftRight').classList.contains('clicked-button-capslock');
    if (capslock && (leftShift || rightShift)) {
      return this.getLetterWithCapsShift(keyIndex, lang)
    } 
    if (capslock) {
      return this.getLetterWithCaps(keyIndex, lang);
    } 
    if (rightShift || leftShift) {
      return this.keys[`${lang}_CAPS`][keyIndex];
    }
    return this.keys[`${lang}`][keyIndex];
>>>>>>> d99dbef567cdb3b5afcf24eec20c4ae38d69ca27
  }

  static renderActiveButton(language, capslock, capslockClass = null, flag = null) {
    const activeLangSpan = document.querySelectorAll(`.${language}`);
    activeLangSpan.forEach((span) => {
      span.childNodes.forEach((elem) => {
        if (capslockClass === 'notCaps' ) {
          if (elem.classList.contains(capslockClass)) {
            return
          }
        }
        if (flag !== null) {
          elem.classList.remove('active-button');
          if (elem.classList.contains(capslock)) elem.classList.add('active-button');
          return
        }
        elem.classList.toggle('active-button');
      });
    });
  }

  getLetterWithCaps(index, lang) {
    let letter;
    if (index < 1) {
      if (lang === 'RU') letter = this.keys[`${lang}_CAPS`][index]
      if (lang === 'EN') letter = this.keys[`${lang}`][index]
    } else if (index >=1 && index <= 14) {
      letter = this.keys[`${lang}`][index]
    } else if (index >=15 && index <= 24) {
      letter = this.keys[`${lang}_CAPS`][index]
    } else if (index >=25 && index <= 26) {
      if (lang === 'RU') letter = this.keys[`${lang}_CAPS`][index]
      if (lang === 'EN') letter = this.keys[`${lang}`][index]
    } else if (index >=29 && index <= 38) {
      letter = this.keys[`${lang}_CAPS`][index]
    } else if (index >=39 && index <= 40) {
      if (lang === 'RU') letter = this.keys[`${lang}_CAPS`][index]
      if (lang === 'EN') letter = this.keys[`${lang}`][index]
    } else if (index >=43 && index <= 49) {
      letter = this.keys[`${lang}_CAPS`][index]
    } else if (index >= 50 && index <= 51) {
      if (lang === 'RU') letter = this.keys[`${lang}_CAPS`][index]
      if (lang === 'EN') letter = this.keys[`${lang}`][index]
    } else {
      letter = this.keys[`${lang}`][index]
    }
    return letter
  }

  getLetterWithCapsShift(index, lang) {
    let letter;
    if (index < 1) {
      if (lang === 'RU') letter = this.keys[`${lang}`][index]
      if (lang === 'EN') letter = this.keys[`${lang}_CAPS`][index]
    } else if (index >=1 && index <= 14) {
      letter = this.keys[`${lang}_CAPS`][index]
    } else if (index >=15 && index <= 24) {
      letter = this.keys[`${lang}`][index]
    } else if (index >=25 && index <= 26) {
      if (lang === 'RU') letter = this.keys[`${lang}`][index]
      if (lang === 'EN') letter = this.keys[`${lang}_CAPS`][index]
    } else if (index >=29 && index <= 38) {
      letter = this.keys[`${lang}`][index]
    } else if (index >=39 && index <= 40) {
      if (lang === 'RU') letter = this.keys[`${lang}`][index]
      if (lang === 'EN') letter = this.keys[`${lang}_CAPS`][index]
    } else if (index >=43 && index <= 49) {
      letter = this.keys[`${lang}`][index]
    } else if (index >= 50 && index <= 51) {
      if (lang === 'RU') letter = this.keys[`${lang}`][index]
      if (lang === 'EN') letter = this.keys[`${lang}_CAPS`][index]
    } else {
      letter = this.keys[`${lang}_CAPS`][index]
    }
    return letter
  }
}