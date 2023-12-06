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

let voices = [];
let listOfParagraph;

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

const goPlaying = async (event) => {
   const lastText = await chrome.storage.local.get(["lastText"]);

   speak(event, listOfParagraph, lastText);
};

const speak = async (event, listOfParagraph, lastText) => {
   const textToSpeechValues = await chrome.storage.local.get([
      "textToSpeechValues",
   ]);
   const playButton = document.querySelector(".play");
   event.stopPropagation();

   let i;

   Array.from(listOfParagraph).forEach((paragraph) => {
      if (lastText.lastText == paragraph.innerText) {
         i = Array.from(listOfParagraph).findIndex((el) => el == paragraph);
         console.log(i);
      }
   });
   if (lastText.lastText) console.log(listOfParagraph);

   for (i; i < Array.from(listOfParagraph).length; i++) {
      const speakText = new SpeechSynthesisUtterance(
         listOfParagraph[i].outerText
      );

      const stopPlaying = () => {
         synth.pause();
         playButton.addEventListener("click", goPlaying, { once: true });

         chrome.storage.local.set({
            lastText: speakText.text,
         });
      };

      speakText.onstart = (e) => {
         playButton.addEventListener("click", stopPlaying, { once: true });
      };

      speakText.onend = (e) => {};

      speakText.rate = textToSpeechValues.textToSpeechValues.rate;
      speakText.volume = textToSpeechValues.textToSpeechValues.volume;
      speakText.pitch = textToSpeechValues.textToSpeechValues.pitch;
      // speakText.voice = textToSpeechValues.textToSpeechValues.voice;
      // console.log(textToSpeechValues.textToSpeechValues.voice);
      synth.speak(speakText);
   }
};

const startPlaying = () => {
   const playButton = document.querySelector(".play");

   playButton.addEventListener("click", goPlaying, { once: true });
};

const mainFunc = () => {
   if (window.location.toString().indexOf("ranobelib.me") == -1) return;

   listOfParagraph = document.querySelectorAll("p");
   const lengthOfList = listOfParagraph.length;

   chrome.storage.local.set({
      lengthOfList: lengthOfList,
   });

   addPlayer();
   startPlaying(listOfParagraph);
};

document.addEventListener("click", mainFunc, { once: true });
