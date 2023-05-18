import { css, html, LitElement } from "lit";

import mobileDivider from "./assets/images/pattern-divider-mobile.svg";
import desktopDivider from "./assets/images/pattern-divider-desktop.svg";
import diceButton from "./assets/images/icon-dice.svg";

export class AdviceCard extends LitElement {
  static get properties() {
    return {
      advice: { type: Object, state: true },
      buttonDisabled: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.buttonDisabled = false;
    this.advice = {};
    this.getAdvice();
  }

  render() {
    return html`
      <h1>advice #${this.advice.id}</h1>
      <p>${this.advice.advice}</p>

      <img class="divider" 
        srcset="${mobileDivider} 375w, ${desktopDivider} 500w"
        sizes="(max-width: 500px) 375px, 500px"
      >
      
      <button @click="${this.newAdvice}" ?disabled="${this.buttonDisabled}">
        <img src="${diceButton}">
        <span>another piece of advice!</span>
      </button>
    `;
  }

  async getAdvice() {
    const res = await fetch("https://api.adviceslip.com/advice");
    const { slip: json } = await res.json();

    console.log(json);

    this.advice = { ...json };
  }

  newAdvice() {
    this.buttonDisabled = true;
    this.getAdvice();

    setTimeout(() => {
      this.buttonDisabled = false;
    }, 2000);
  }

  static get styles() {
    return css`
      :host {
        --highlight-color: lime;
        --text-color: inherit;
        --bg-color: grey;
        display: block;
        border-radius: 0.25em;
        padding: 1em 1em 0.125em;
        background-color: var(--bg-color);

        width: min(500px, 100% - 1em);

        text-align: center;
      }

      @media (min-width: 400px) {
        :host {
          border-radius: 0.5em;
        }
      }

      img {
        display: block;
        max-width: 100%;
        margin-inline: auto;
      }

      h1 {
        font-size: 0.4em;
        font-weight: 600;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--highlight-color);
      }

      p {
        font-weight: 800;
        font-size: 0.85em;
      }

      p::before {
        content: open-quote;
      }

      p::after {
        content: close-quote;
      }

      button {
        position: relative;
        top: 2em;
        border: none;
        background-color: var(--highlight-color);
        padding: 1.25em;
        border-radius: 100vmax;
        transform-origin: center;
        cursor: pointer;
        filter: drop-shadow(0px 0px 0px var(--highlight-color));
        transition: filter 0.25s ease;
      }

      button:disabled {
        filter: saturate(0);
        opacity: 0.125;
        animation: slowFadeIn 2s forwards;
      }

      button:not(:disabled):active {
        transform: scale(0.85);
      }

      button:not(:disabled):hover {
        filter: drop-shadow(0px 0px 20px var(--highlight-color));
      }

      button > span {
        display: none;
        opacity: 0;
      }

      @keyframes slowFadeIn {
        80% {
          opacity: 0.125;
          filter: saturate(0);
        }
        to {
          opacity: 1;
          filter: saturate(1)
        }
      }
    `;
  }
}

window.customElements.define("advice-card", AdviceCard);
