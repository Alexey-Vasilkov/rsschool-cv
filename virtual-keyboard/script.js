let keyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "done", "space", "ru/en"
    ];

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    language: true
  },
  
  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
  },
  

  _createKeys() {
    const fragment = document.createDocumentFragment();    

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };       

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "]", "enter", "?"].indexOf(key) !== -1;

      // Add attributes/classes  
      
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = "&#8679;<pre>Shift</pre>";          

          keyElement.addEventListener("click", () => {
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;
        
        case "ru/en":
          keyElement.innerHTML = "<pre>en</pre>";          

          keyElement.addEventListener("click", () => {
            this.properties.language ? keyElement.innerHTML = "<pre>ru</pre>" : keyElement.innerHTML = "<pre>en</pre>";
            this._toggleLanguage();
            // keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this._triggerEvent("oninput");
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleShift() {
    this.properties.capsLock = !this.properties.capsLock;        

    for (const key of this.elements.keys) {      
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }      
    }

    if (this.properties.shift == false) {
      let numberLayout = [];
      this.properties.language ? 
      numberLayout = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")",] :
      numberLayout = ["!", "\"", "№", ";", "%", ":", "?", "*", "(", ")",]      
      for (i=0; i < this.elements.keys.length && i < 10; i++) {
        this.elements.keys[i].textContent = numberLayout[i];
      } 
    } else {
      const numberLayout = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",];  
      for (i=0; i < this.elements.keys.length && i < 10; i++) {
        this.elements.keys[i].textContent = numberLayout[i];
      } 
    } 

    this.properties.shift = !this.properties.shift;
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;    

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleLanguage() {

    ruKeyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "/",
      "done", "space", "ru"
      ];  
    
    if (this.properties.language) {
      for (i = 11; i < this.elements.keys.length && i < 23; i++) {
        this.elements.keys[i].textContent = ruKeyLayout[i];
      } 
      for (i = 24; i < this.elements.keys.length && i < 35; i++) {
        this.elements.keys[i].textContent = ruKeyLayout[i];
      }
      for (i = 37; i < this.elements.keys.length && i < 47; i++) {
        this.elements.keys[i].textContent = ruKeyLayout[i];
      }
    } else {     
      for (i = 11; i < this.elements.keys.length && i < 23; i++) {
        this.elements.keys[i].textContent = keyLayout[i];
      } 
      for (i = 24; i < this.elements.keys.length && i < 35; i++) {
        this.elements.keys[i].textContent = keyLayout[i];
      }
      for (i = 37; i < this.elements.keys.length && i < 47; i++) {
        this.elements.keys[i].textContent = keyLayout[i];
      }
    } 
    this.properties.language = !this.properties.language;
  },    

    
 

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});