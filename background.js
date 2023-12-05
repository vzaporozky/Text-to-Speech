// import { app } from "./App";

const buttonsObj = [
   { text: "play", class1: "icon", class2: "play" },
   { text: "&#x2771;&#x2771;&#x2771;", class1: "icon", class2: "forward" },
];

const styleForButtonsBlock = `
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1c1c1e;
      width: 112px;
      position: fixed;
      top: 55px;
      right: 30px;
      border-radius: 10px;`;

const styleForBuuton = `
      padding: 15px;
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
      if (btn.class2 == "play") {
         button.style.borderTopRightRadius = 0;
         button.style.borderBottomRightRadius = 0;
      } else {
         button.style.borderTopLeftRadius = 0;
         button.style.borderBottomLeftRadius = 0;
      }

      button.addEventListener(
         "mouseover",
         () => (button.style.background = "#3b3b3b")
      );
      button.addEventListener(
         "mouseout",
         () => (button.style.background = "#1c1c1e")
      );

      main.appendChild(button);
   });

   document.querySelector(".reader-container").appendChild(main);
};

const getTextFormSite = (listOfParagraph) => {
   const lengthOfText = listOfParagraph.length;

   // console.log(lengthOfText); /////////////

   chrome.storage.local.set({
      lengthOfText: lengthOfText,
   });
};

const getVoices = () => {
   voices = synth.getVoices();
   console.log(voices);

   voices.forEach((voice) => {
      const option = document.createElement("option");
      option.textContent = voice.name + "(" + voice.lang + ")";

      option.setAttribute("data-lang", voice.lang);
      option.setAttribute("data-name", voice.name);
      // voiceSelect.appendChild(option);
   });
};

const speak = async (event, listOfParagraph) => {
   event.stopPropagation();
   if (synth.speaking || listOfParagraph[0] === "") return;
   // if (textInput.value === "") return;

   const speakText = new SpeechSynthesisUtterance(listOfParagraph[0]);

   speakText.onend = (e) => {
      console.log("Done speaking...");
   };

   speakText.onerror = (e) => {
      console.error("Something went wrong");
   };

   // const selectedVoice =
   //    voiceSelect.selectedOptions[0].getAttribute("data-name");
   const selectedVoice = "Microsoft Irina - Russian (Russia)";

   voices.forEach((voice) => {
      if (voice.name === selectedVoice) speakText.voice = voice;
   });

   const textToSpeechValues = await chrome.storage.local.get([
      "textToSpeechValues",
   ]);

   // console.log(voices);
   // console.log(speakText);
   // console.log(textToSpeechValues.textToSpeechValues);

   speakText.rate = textToSpeechValues.textToSpeechValues.rate;
   speakText.volume = textToSpeechValues.textToSpeechValues.volume;
   speakText.pitch = textToSpeechValues.textToSpeechValues.pitch;
   synth.speak(speakText);
};

const startPlaying = (listOfParagraph) => {
   // if (isChrome) {
   // if (synth.onvoiceschanged !== undefined) {
   // synth.onvoiceschanged = getVoices;
   // }
   // }
   // console.log(e);
   getVoices();

   // textForm.addEventListener("submit", (e) => {
   //    e.preventDefault();
   //    speak(listOfParagraph);
   // });

   const playButton = document.querySelector(".play");
   playButton.addEventListener("click", (event) =>
      speak(event, listOfParagraph)
   );

   // voiceSelect.addEventListener("change", (e) => speak(listOfParagraph));
};

const mainFunc = () => {
   if (window.location.toString().indexOf("ranobelib.me") == -1) return;
   // console.log(synth);
   // console.log(isChrome);
   // console.log(window.chrome);
   // console.log(window.chrome.webstore);
   // !!window.chrome && !!window.chrome.webstore;

   const listOfParagraph = Array.from(document.querySelectorAll("p")).map(
      (tag) => tag.innerHTML
   );

   getTextFormSite(listOfParagraph);
   addPlayer();

   // const playButton = document.querySelector(".play");
   // playButton.addEventListener("click", (e) =>
   startPlaying(listOfParagraph);
   // );
};

document.addEventListener("click", mainFunc);
