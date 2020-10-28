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
      keydbord.append(buttonDiv);
    });
    mainDiv.append(textAreaDiv, keydbord, infoDiv);
    document.body.append(mainDiv);
  }

  addListenersOnKeys() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      const { code } = event;
      if (this.keyCode.indexOf(code) < 0) return;

      this.keyDownHandler(event, code);
    });
    document.addEventListener('keyup', (event) => {
      // console.log(event);
      event.preventDefault();
      const { code } = event;
      if (this.keyCode.indexOf(code) < 0) return;
      
      this.keyUpHandler(event, code);
      console.log(this.clickedButton)
    });
  }

  sendToMemoryBtn(btn) {
    this.clickedButton.add(btn)
  }

  removeFromMemoryBtn(...btns) {
    btns.forEach(btn=>(
      this.clickedButton.delete(btn)
    ))
  }

  checkFromMemoryBtn(btn) {
    return this.clickedButton.has(btn)
  }

  keyDownHandler(e, key) {
    let buttonActiveClass; // 'buttonUp' or 'button'
    if (key === 'CapsLock') {
      if (e.repeat) return;
      let classFlag;
      this.capsLockFlag = !this.capsLockFlag;
      buttonActiveClass = this.capsLockFlag ? 'buttonUp' : 'button';
      if (this.checkFromMemoryBtn('ShiftRight') || this.checkFromMemoryBtn('ShiftLeft')) {
        classFlag = buttonActiveClass !== 'button' ? false : true;
      } else {
        classFlag = buttonActiveClass === 'button' ? false : true;
      }
      Keybord.changeClassClickedButton(key, classFlag);
      if (this.checkFromMemoryBtn('CapsLock')) this.removeFromMemoryBtn('CapsLock')
      else this.sendToMemoryBtn('CapsLock')
      this.renderActiveButton(buttonActiveClass); 
      return;
    }

    if (key === 'ShiftLeft' || key === 'ShiftRight') {
      if (e.repeat) return;   
      buttonActiveClass = this.capsLockFlag ? 'button' : 'buttonUp';
      this.renderActiveButton(buttonActiveClass, key);
      this.capsLockFlag = !this.capsLockFlag;
      
      let key2 = key === 'ShiftLeft' ? 'ShiftRight' : 'ShiftLeft'
      Keybord.changeClassClickedButton(key2, true);
    } 
    this.sendToMemoryBtn(key)
    Keybord.changeClassClickedButton(key, true);
  }
  

  keyUpHandler(e, key) {
    
    let buttonActiveClass;
    if (key === 'CapsLock') return;

    if (key === 'ShiftLeft' || key === 'ShiftRight') {
      buttonActiveClass = this.capsLockFlag ? 'buttonUp' : 'button';
      this.renderActiveButton(buttonActiveClass, key);
      this.capsLockFlag = !this.capsLockFlag;
      let key2 = key === 'ShiftLeft' ? 'ShiftRight' : 'ShiftLeft'
      Keybord.changeClassClickedButton(key2, false);
      this.removeFromMemoryBtn(key2)

  }
    this.removeFromMemoryBtn(key); // remove from memory key, another CapsLock
    Keybord.changeClassClickedButton(key, false);
  }

  static changeClassClickedButton(key, flag = true) {
    const nowClickedButton = document.querySelector(`.${key}`);
    if (flag) nowClickedButton.classList.add('clicked-button');
    else nowClickedButton.classList.remove('clicked-button');
  }

  getLetter(key) {
    let buttons = document.querySelectorAll('div.key')
    let letter
    buttons.forEach((button) => {
      if (button.getAttribute('code') === key) {
        letter = button.querySelector('.active-button').innerText
      }
    })
    return letter
  }

  renderActiveButton(buttonActiveClass, btn = null) {
    const lengSpanAll = document.querySelectorAll(`.${this.language}`);
    if (btn === 'ShiftLeft' || btn === 'ShiftRight') {
      lengSpanAll.forEach(lengSpan => {
        lengSpan.childNodes.forEach(letterSpan=>{
          letterSpan.classList.toggle('active-button')
        })
      })
    } else {
      lengSpanAll.forEach(lengSpan => {
      if (lengSpan.classList.contains('notCaps')) return  
      lengSpan.childNodes.forEach(letterSpan=>{
        if (letterSpan.classList.contains(buttonActiveClass)) {
          letterSpan.classList.add('active-button')
        } else {
          letterSpan.classList.remove('active-button')
        }
      })
    })
    } 
  }
}