export default class Keybord {
  constructor(lang, capsLockFlag, keys, keyCode, upperkey) {
    this.keys = keys;
    this.keyCode = keyCode;
    this.language = lang;
    this.clickedButton = new Set();
    this.capsLockFlag = capsLockFlag;
    this.pressedShift = false;
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
    const mainDiv = Keybord.createButton('div', null, 'wrapper');
    const textAreaDiv = Keybord.createButton('div', null, 'textArea');
    this.textArea = Keybord.createButton('textarea');
    Keybord.setAttribute(this.textArea, ['cols', '55'], ['rows', '10']);
    this.keydbord = Keybord.createButton('div', null, 'keydbord-wrapper');
    const infoDiv = Keybord.createButton('div', null, 'info');
    const innerText = 'Клавиатура создана в операционной системе Windows \t\n Для переключения языка комбинация: левыe Shift + Alt';
    const infoDivText = Keybord.createButton('p', innerText, 'infoText');
    infoDiv.append(infoDivText);
    textAreaDiv.append(this.textArea);
    this.textArea.focus();
    this.textArea.onblur = () => this.textArea.focus();
    this.keyCode.forEach((key) => {
      const buttonDiv = Keybord.createButton('div', null, 'key', key);
      buttonDiv.setAttribute('code', key);
      const index = this.keyCode.indexOf(key);
      let capslockClassRu = 'notCaps';
      let capslockClassEn = 'notCaps';
      if (index < 1) {
        capslockClassRu = 'Caps';
        capslockClassEn = 'notCaps';
      }
      if (index >= 1 && index <= 14) {
        capslockClassRu = 'notCaps';
        capslockClassEn = 'notCaps';
      }
      if (index >= 15 && index <= 24) {
        capslockClassRu = 'Caps';
        capslockClassEn = 'Caps';
      }
      if (index >= 25 && index <= 26) {
        capslockClassRu = 'Caps';
        capslockClassEn = 'notCaps';
      }
      if (index >= 29 && index <= 38) {
        capslockClassRu = 'Caps';
        capslockClassEn = 'Caps';
      }
      if (index >= 39 && index <= 40) {
        capslockClassRu = 'Caps';
      }
      if (index >= 43 && index <= 49) {
        capslockClassRu = 'Caps';
        capslockClassEn = 'Caps';
      }
      if (index >= 50 && index <= 51) {
        capslockClassRu = 'Caps';
      }
      const buttonSpanRu = Keybord.createButton('span', null, 'lang', 'ru', capslockClassRu);
      const buttonSpanEn = Keybord.createButton('span', null, 'lang', 'en', capslockClassEn);
      const buttonSpanUpEn = Keybord.createButton('span', this.keys.EN_CAPS[index], 'buttonUp');
      const buttonSpanUpRu = Keybord.createButton('span', this.keys.RU_CAPS[index], 'buttonUp');
      const buttonSpanDownEn = Keybord.createButton('span', this.keys.EN[index], 'button');
      const buttonSpanDownRu = Keybord.createButton('span', this.keys.RU[index], 'button');
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
      //   }
      // }
      this.keydbord.append(buttonDiv);
    });
    mainDiv.append(infoDiv, textAreaDiv, this.keydbord);
    document.body.append(mainDiv);
  }

  addListenersOnKeys() {
    window.onblur = () => {
      document.querySelectorAll('.clicked-button').forEach((child) => {
        if (child.getAttribute('code') !== 'CapsLock') child.classList.remove('clicked-button');
      });
    };
    document.addEventListener('keydown', (event) => {
      const { code } = event;
      if (this.keyCode.indexOf(code) < 0) return;
      if (event.code !== 'ArrowUp' && event.code !== 'ArrowDown') {
        event.preventDefault();
      }

      this.keyDownHandler(event, code);
    });
    document.addEventListener('keyup', (event) => {
      event.preventDefault();
      const { code } = event;
      if (this.keyCode.indexOf(code) < 0) return;
      this.keyUpHandler(event, code);
    });
    document.addEventListener('mousedown', (event) => {
      if (event.target.closest('.textArea')) {
        this.displayKeybord();
      } else if (!event.target.closest('.keydbord-wrapper')) {
        this.displayKeybord(false);
      }
    });
    document.addEventListener('mouseup', (event) => {
      if (event.target.classList.contains('active-button')) {
        const code = event.target.parentNode.parentNode.getAttribute('code');
        if (code === 'ShiftRight' || code === 'ShiftLeft') {
          this.pressedShift = !this.pressedShift;
          this.changeShiftForMouse(code);
          return;
        }
        if (code === 'Lang') {
          this.changeLang(code);
          return;
        }

        this.keyDownHandler(event, code);
        if (this.pressedShift && code !== 'CapsLock') {
          this.pressedShift = !this.pressedShift;
          this.capsLockFlag = true;
          const btnShift = this.checkFromMemoryBtn('ShiftRight') ? 'ShiftRight' : 'ShiftLeft';
          this.changeShiftForMouse(btnShift);
        }
        document.querySelectorAll('.clicked-button').forEach((elem) => {
          if (elem.getAttribute('code') === 'CapsLock' || elem.getAttribute('code') === 'ShiftLeft' || elem.getAttribute('code') === 'ShiftRight') return;
          elem.classList.remove('clicked-button');
        });
      }
    });
  }

  changeLang(code) {
    this.language = this.language === 'ru' ? 'en' : 'ru';
    document.querySelectorAll('.lang').forEach((span) => {
      span.classList.toggle('active');
      span.childNodes.forEach((item) => item.classList.remove('active-button'));
    });
    const buttonActiveClass = this.capsLockFlag ? 'buttonUp' : 'button';
    this.renderActiveButton(buttonActiveClass, code);
  }

  changeShiftForMouse(code) {
    Keybord.changeClassClickedButton('ShiftRight', this.pressedShift);
    Keybord.changeClassClickedButton('ShiftLeft', this.pressedShift);
    this.capsLockFlag = this.checkFromMemoryBtn('CapsLock') ? this.capsLockFlag : !this.capsLockFlag;
    const buttonActiveClass = !this.capsLockFlag ? 'button' : 'buttonUp';
    this.renderActiveButton(buttonActiveClass, code);
    if (this.pressedShift) this.sendToMemoryBtn(code);
    else this.removeFromMemoryBtn(code);
  }

  sendToMemoryBtn(btn) {
    this.clickedButton.add(btn);
  }

  removeFromMemoryBtn(...btns) {
    btns.forEach((btn) => (
      this.clickedButton.delete(btn)
    ));
  }

  checkFromMemoryBtn(btn) {
    return this.clickedButton.has(btn);
  }

  keyDownHandler(e, key) {
    let buttonActiveClass; // 'buttonUp' or 'button'
    /* *************************************** CAPSLOCK *********************************** */
    if (key === 'CapsLock') {
      if (e.repeat) return;
      let classFlag;
      this.capsLockFlag = !this.capsLockFlag;
      buttonActiveClass = this.capsLockFlag ? 'buttonUp' : 'button';
      if (this.checkFromMemoryBtn('ShiftRight') || this.checkFromMemoryBtn('ShiftLeft')) {
        classFlag = buttonActiveClass === 'button';
      } else {
        classFlag = buttonActiveClass !== 'button';
      }
      Keybord.changeClassClickedButton(key, classFlag);
      if (this.checkFromMemoryBtn('CapsLock')) this.removeFromMemoryBtn('CapsLock');
      else this.sendToMemoryBtn('CapsLock');
      this.renderActiveButton(buttonActiveClass);
      return;
    }
    /* *************************************** SHIFT ************************************* */
    if (key === 'ShiftLeft' || key === 'ShiftRight') {
      if (e.repeat) return;
      if (this.checkFromMemoryBtn('ShiftLeft') || this.checkFromMemoryBtn('ShiftRight')) return;
      if (this.pressedShift) this.pressedShift = !this.pressedShift;
      buttonActiveClass = this.capsLockFlag ? 'button' : 'buttonUp';
      this.sendToMemoryBtn(key);
      this.renderActiveButton(buttonActiveClass, key);
      this.capsLockFlag = !this.capsLockFlag;
      const key2 = key === 'ShiftLeft' ? 'ShiftRight' : 'ShiftLeft';
      Keybord.changeClassClickedButton(key, true);
      Keybord.changeClassClickedButton(key2, true);
      return;
    }

    this.sendToMemoryBtn(key);
    Keybord.changeClassClickedButton(key, true);

    /* *********************************** ALT CTRL META ******************************** */
    if (key === 'AltLeft' || key === 'AltRight' || key === 'ControlLeft' || key === 'ControlRight' || key === 'MetaLeft') {
      document.querySelector(`.${key}`).classList.add('clicked-button');
      return;
    }
    /* *********************************** UP DOWN *********************************** */
    if (key === 'ArrowUp' || key === 'ArrowDown') return;

    let { selectionStart } = this.textArea;
    let { selectionEnd } = this.textArea;
    /* *********************************** Backspace Delete********************************* */
    if (key === 'Backspace' || key === 'Delete') {
      if (key === 'Backspace') {
        if (selectionEnd === 0) return;
        if (selectionEnd === selectionStart) selectionStart -= 1;
      }
      if (key === 'Delete') {
        if (this.textArea.value.length <= 0) return;
        if (selectionEnd === selectionStart) selectionEnd += 1;
      }
      this.printLetter(selectionStart, selectionEnd, 0, '');
      return;
    }

    let keyValue = Keybord.getLetter(key);
    let shift = 1;
    if (key === 'Tab') keyValue = '\t';
    if (key === 'Enter') keyValue = '\n';
    if (key === 'Space') keyValue = ' ';
    if (key === 'ArrowLeft') {
      keyValue = '';
      shift -= selectionStart === 0 ? 1 : 2;
    }
    if (key === 'ArrowRight') {
      keyValue = '';
    }

    this.printLetter(selectionStart, selectionEnd, shift, keyValue);
  }

  printLetter(selectionStart, selectionEnd, shift = 0, keyValue = '') {
    if (this.keybordVisible) {
      this.textArea.value = this.textArea.value.slice(0, selectionStart) + keyValue
      + this.textArea.value.slice(selectionEnd);
      this.textArea.selectionStart = selectionStart + shift;
      this.textArea.selectionEnd = selectionStart + shift;
    }
  }

  keyUpHandler(e, key) {
    let buttonActiveClass;
    if (key === 'CapsLock') return;

    if (key === 'ShiftLeft' || key === 'ShiftRight') {
      buttonActiveClass = this.capsLockFlag ? 'button' : 'buttonUp';
      const key2 = key === 'ShiftLeft' ? 'ShiftRight' : 'ShiftLeft';
      this.removeFromMemoryBtn(key);
      this.removeFromMemoryBtn(key2);
      this.renderActiveButton(buttonActiveClass, key);
      this.capsLockFlag = !this.capsLockFlag;
      Keybord.changeClassClickedButton(key, false);
      Keybord.changeClassClickedButton(key2, false);
      return;
    }
    this.removeFromMemoryBtn(key);
    Keybord.changeClassClickedButton(key, false);
  }

  static changeClassClickedButton(key, flag = true) {
    const nowClickedButton = document.querySelector(`.${key}`);
    if (flag) nowClickedButton.classList.add('clicked-button');
    else nowClickedButton.classList.remove('clicked-button');
  }

  static getLetter(key) {
    const buttons = document.querySelectorAll('div.key');
    // console.log(key);
    let letter;
    buttons.forEach((button) => {
      if (button.getAttribute('code') === key) {
        letter = button.querySelector('.active-button').innerText;
      }
    });
    return letter;
  }

  renderActiveButton(buttonActiveClass, btn = null) {
    let btnAcCl = buttonActiveClass;
    const lengSpanAll = document.querySelectorAll(`.${this.language}`);
    if (btn === 'ShiftLeft' || btn === 'ShiftRight') {
      lengSpanAll.forEach((lengSpan) => {
        if (this.checkFromMemoryBtn('ShiftLeft') && btn === 'ShiftRight') return;
        if (this.checkFromMemoryBtn('ShiftRight') && btn === 'ShiftLeft') return;
        lengSpan.childNodes.forEach((letterSpan) => {
          letterSpan.classList.toggle('active-button');
        });
      });
    } else if (btn === 'Lang') {
      lengSpanAll.forEach((lengSpan) => {
        if (lengSpan.classList.contains('notCaps') && this.checkFromMemoryBtn('CapsLock')) btnAcCl = 'button';
        else if (this.checkFromMemoryBtn('CapsLock')) btnAcCl = 'buttonUp';
        if (this.checkFromMemoryBtn('CapsLock') && this.checkFromMemoryBtn('ShiftLeft')) {
          btnAcCl = btnAcCl === 'button' ? 'buttonUp' : 'button';
        }
        lengSpan.childNodes.forEach((letterSpan) => {
          if (letterSpan.classList.contains(btnAcCl)) {
            letterSpan.classList.add('active-button');
          } else {
            letterSpan.classList.remove('active-button');
          }
        });
      });
    } else {
      lengSpanAll.forEach((lengSpan) => {
        if (lengSpan.classList.contains('notCaps')) return;
        lengSpan.childNodes.forEach((letterSpan) => {
          if (letterSpan.classList.contains(btnAcCl)) {
            letterSpan.classList.add('active-button');
          } else {
            letterSpan.classList.remove('active-button');
          }
        });
      });
    }
  }

  displayKeybord(flag = true) {
    if (flag) {
      this.textArea.autofocus = true;
      this.keydbord.style.top = '0px';
    } else {
      this.keydbord.removeAttribute('style');
    }
    this.keybordVisible = flag;
  }
}
