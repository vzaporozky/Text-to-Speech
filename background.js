// import { app } from "./App";

const buttonsObj = [
   { text: "play", class1: "icon", class2: "play" },
   { text: "&#x2771;&#x2771;&#x2771;", class1: "icon", class2: "forward" },
];

const styleForButtonsBlock = `padding: 10px;
      padding-right: 2px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background-color: #1c1c1e;
      width: 120px;
      position: fixed;
      top: 55px;
      right: 30px;
      border-radius: 10px;`;

const styleForBuuton = `margin-right: 8px;
      padding: 5px;
      background-color: #1c1c1e;
      color: #ffffff;
      border-radius: 5px;
      border: none;`;

const synth = window.speechSynthesis;
let isChrome = !!window.chrome && !!window.chrome.webstore;
let voices = [];

const addPlayer = async () => {
   if (document.querySelector("body").ext) return;

   document.querySelector("body").ext = 1;

   const main = document.createElement("div");
   main.classList.add("buttons__ext");
   main.style.cssText = styleForButtonsBlock;

   buttonsObj.forEach((btn) => {
      const button = document.createElement("button");
      button.innerHTML = btn.text;
      button.classList.add(btn.class1, btn.class2);
      button.style.cssText = styleForBuuton;
      button.addEventListener(
         "enter",
         () => (button.style.background = "#3b3b3b")
      );

      main.appendChild(button);
   });

   document.querySelector(".reader-container").appendChild(main);
};

const getTextFormSite = (listOfParagraph) => {
   const lengthOfText = listOfParagraph.length;

   console.log(lengthOfText); /////////////

   chrome.storage.local.set({
      lengthOfText: lengthOfText,
   });
};

const getVoices = () => {
   voices = synth.getVoices();

   voices.forEach((voice) => {
      const option = document.createElement("option");
      option.textContent = voice.name + "(" + voice.lang + ")";

      option.setAttribute("data-lang", voice.lang);
      option.setAttribute("data-name", voice.name);
      voiceSelect.appendChild(option);
   });
};

const speak = () => {
   if (synth.speaking) {
      console.error("Already speaking...");
      return;
   }

   if (textInput.value !== "") {
      body.style.background = "#141414 url(img/wave.gif)";
      body.style.backgroundRepeat = "repeat-x";
      body.style.backgroundSize = "100% 100%";

      const speakText = new SpeechSynthesisUtterance(textInput.value);

      speakText.onend = (e) => {
         console.log("Done speaking...");
         body.style.background = "#141414";
      };

      speakText.onerror = (e) => {
         console.error("Something went wrong");
      };

      const selectedVoice =
         voiceSelect.selectedOptions[0].getAttribute("data-name");

      voices.forEach((voice) => {
         if (voice.name === selectedVoice) {
            speakText.voice = voice;
         }
      });

      speakText.rate = rate.value;
      speakText.pitch = pitch.value;
      synth.speak(speakText);
   }
};

const startPlaying = () => {
   if (isChrome) {
      if (synth.onvoiceschanged !== undefined) {
         synth.onvoiceschanged = getVoices;
      }
   }

   textForm.addEventListener("submit", (e) => {
      e.preventDefault();
      speak();
      textInput.blur();
   });

   rate.addEventListener("change", (e) => (rateValue.textContent = rate.value));

   pitch.addEventListener(
      "change",
      (e) => (pitchValue.textContent = pitch.value)
   );

   voiceSelect.addEventListener("change", (e) => speak());
};

const mainFunc = () => {
   if (window.location.toString().indexOf("ranobelib.me") == -1) return;

   const listOfParagraph = Array.from(document.querySelectorAll("p")).map(
      (tag) => tag.innerHTML
   );

   getTextFormSite(listOfParagraph);
   addPlayer();
   startPlaying();
};

document.addEventListener("click", mainFunc);
