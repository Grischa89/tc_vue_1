import axios from 'axios';

const state = {

};

const getters = {

};

const actions = {

  copyCodeToClipboard({ commit, dispatch }, codeToCopy) {
    // Since the click event listener was registered on the parent (e.g <td>)
    // a click on any of its child elements (e.g. the <div> that has the code in its textContent and the <svg>)
    // bubbles up to the parent where the click is listened to and the handler function is invoked!
    // Event delegation!
    const trainerCode = codeToCopy;
    // const trainerCode = e.currentTarget.dataset.code;
    
    // Check if Clipboard API of navigator is supported - if not execute fallbackCopyToClipboard()
    if (!navigator.clipboard) {
      console.log('No navigator.clipboard available!');
      dispatch('fallbackCopyCodeToClipboard', trainerCode);
      return;
    }

    let copyPromise = navigator.clipboard.writeText(trainerCode);

    copyPromise
    .then(() => {
      console.log(`${trainerCode} was copied to clipboard!`);
    })
    .catch((err) => {
      console.log(`Something went wrong while trying to copy trainer code ${trainerCode}. \n
      Error message: ${err}`)
    });

  },

  fallbackCopyCodeToClipboard({ commit }, trainerCode) {
    let tempElement = document.createElement('input');
    tempElement.value = trainerCode;

    document.body.appendChild(tempElement);
    tempElement.select();

    try {
      let success = document.execCommand('copy');
      let message = success ? 'successful' : 'failed';

      console.log(`The fallback function with execCommand() was ${message}!`);
    } catch (err) {
      console.log(`The fallback function ${message}! \n
      Error message: ${err}`);
    }

    document.body.removeChild(tempElement);
  },

};

const mutations = {

};

export default {
  state, getters, actions, mutations
}