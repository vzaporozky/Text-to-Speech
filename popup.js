const changeValue = async (input, sign) => {
   const textToSpeechValues = await chrome.storage.local.get([
      "textToSpeechValues",
   ]);

   // if (input.value == 0 || input.value == 0.0) return;

   if (sign == "minus") {
      if (input.value <= input.min) {
         input.value = input.min;
         return;
      }

      input.name == "paragraph"
         ? (input.value = input.value - 1)
         : (input.value = (input.value - 0.1).toFixed(1));

      textToSpeechValues.textToSpeechValues[input.name] = Number(input.value);

      chrome.storage.local.set({
         textToSpeechValues: textToSpeechValues.textToSpeechValues,
      });
   } else {
      if (input.value >= input.max) {
         input.value = input.max;
         return;
      }

      input.name == "paragraph"
         ? (input.value = -(-input.value - 1))
         : (input.value = -(-input.value - 0.1).toFixed(1));

      textToSpeechValues.textToSpeechValues[input.name] = Number(input.value);

      chrome.storage.local.set({
         textToSpeechValues: textToSpeechValues.textToSpeechValues,
      });
   }
   console.log(chrome.storage.local.get(["textToSpeechValues"])); ///////////////////////
};

const loadValue = async (inputs) => {
   const textToSpeechValues = await chrome.storage.local.get([
      "textToSpeechValues",
   ]);
   console.log(inputs);
   inputs.forEach(
      (input) =>
         (input.value = textToSpeechValues.textToSpeechValues[input.name])
   );
};

function debounce(func, timeout = 300) {
   let timer;
   return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
         func.apply(this, args);
      }, timeout);
   };
}

const saveInput = async (event) => {
   const textToSpeechValues = await chrome.storage.local.get([
      "textToSpeechValues",
   ]);
   textToSpeechValues.textToSpeechValues[event.target.name] = Number(
      event.target.value
   );

   chrome.storage.local.set({
      textToSpeechValues: textToSpeechValues.textToSpeechValues,
   });
};

const processChange = debounce((event) => saveInput(event));

const documentEvents = async () => {
   // chrome.tabs.getSelected(null, function (tab) {
   //    //<-- "tab" has all the information
   //    console.log(tab.url); //returns the url
   //    console.log(tab.title); //returns the title
   // });
   const textToSpeechValues = await chrome.storage.local.get([
      "textToSpeechValues",
   ]);
   const lengthOfText = await chrome.storage.local.get(["lengthOfText"]);
   // values.textToSpeechValues.rate = 1;
   console.log(textToSpeechValues); ///////////////////////////////

   const buttonParMinus = document.querySelector(".button__paragraph_minus");
   const buttonRateMinus = document.querySelector(".button__rate_minus");
   const buttonPitchMinus = document.querySelector(".button__pitch_minus");
   const buttonVolMinus = document.querySelector(".button__volume_minus");

   const buttonParPlus = document.querySelector(".button__paragraph_plus");
   const buttonRatePlus = document.querySelector(".button__rate_plus");
   const buttonPitchPlus = document.querySelector(".button__pitch_plus");
   const buttonVolumePlus = document.querySelector(".button__volume_plus");

   const inputPar = document.querySelector(".input_paragraph");
   const inputRate = document.querySelector(".input_rate");
   const inputPitch = document.querySelector(".input_pitch");
   const inputVolume = document.querySelector(".input_volume");

   inputPar.max = lengthOfText.lengthOfText;

   loadValue([inputPar, inputRate, inputPitch, inputVolume]);

   buttonParMinus.addEventListener("click", () =>
      changeValue(inputPar, "minus")
   );
   buttonParPlus.addEventListener("click", () => changeValue(inputPar, "plus"));

   buttonRateMinus.addEventListener("click", () =>
      changeValue(inputRate, "minus")
   );
   buttonRatePlus.addEventListener("click", () =>
      changeValue(inputRate, "plus")
   );

   buttonPitchMinus.addEventListener("click", () =>
      changeValue(inputPitch, "minus")
   );
   buttonPitchPlus.addEventListener("click", () =>
      changeValue(inputPitch, "plus")
   );

   buttonVolMinus.addEventListener("click", () =>
      changeValue(inputVolume, "minus")
   );
   buttonVolumePlus.addEventListener("click", () =>
      changeValue(inputVolume, "plus")
   );

   inputPar.addEventListener("input", (event) => processChange(event));
   inputRate.addEventListener("input", (event) => processChange(event));
   inputPitch.addEventListener("input", (event) => processChange(event));
   inputVolume.addEventListener("input", (event) => processChange(event));

   // console.log(buttonPitch_plus);
};

document.addEventListener(
   "DOMContentLoaded",
   () => documentEvents(document),
   false
);
