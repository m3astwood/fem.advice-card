import { css, html, LitElement } from "lit";

import mobileDivider from "./assets/images/pattern-divider-mobile.svg";
import desktopDivider from "./assets/images/pattern-divider-desktop.svg";
import diceButton from "./assets/images/icon-dice.svg";

export class AdviceCard extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean, state: true },
      advice: { type: Object, state: true },
      buttonDisabled: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.buttonDisabled = false;
    this.advice = {};
    this.getAdvice();
  }

  render() {
    return html`
    <div 
      class="card ${this.buttonDisabled ? "disabled" : ""}"
    >
      <h1>advice #${this.advice.id}</h1>
      <p>${this.advice.advice}</p>

      <img class="divider" 
        srcset="${mobileDivider} 375w, ${desktopDivider} 500w"
        sizes="(max-width: 500px) 375px, 500px"
      >
    </div>

    <div class="control">
      <button 
        @click="${this.newAdvice}" 
        class="${this.buttonDisabled ? "disabled" : ""}"
        ?disabled="${this.buttonDisabled}"
      >
      
        <img src="${diceButton}">
        <span>another piece of advice!</span>
      </button>
    </div>
    `;
  }

  async getAdvice() {
    const res = await fetch("https://api.adviceslip.com/advice", {
      cache: "no-cache",
    });
    const { slip: json } = await res.json();

    this.advice = { ...json };
  }

  newAdvice() {
    this.buttonDisabled = true;
    setTimeout(() => {
      this.getAdvice();
    }, 500);

    setTimeout(() => {
      this.buttonDisabled = false;
    }, 1500);
  }

  static get styles() {
    return css`
      :host {
        --highlight-color: lime;
        --text-color: inherit;
        --bg-color: grey;
        --drop-shadow-color: black;
        width: max-content;
      }


      .card  {
        display: block;
        border-radius: 0.25em;
        padding: 1em 1em 2em;
        background-color: var(--bg-color);

        max-width: 500px;

        text-align: center;
        box-shadow: 0px 0px 20px var(--drop-shadow-color);
        transition: opacity 0.125s;
      }

      .card.disabled {
        opacity: 0;
      }

      @media (min-width: 400px) {
        .card {
          border-radius: 0.5em;
        }
      }

      .control {
        transform: translateY(-50%);
        display: flex;
        justify-content: center;
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
        border: none;
        background-color: var(--highlight-color);
        padding: 1.25em;
        border-radius: 100vmax;
        transform-origin: center;
        filter: drop-shadow(0px 0px 0px var(--highlight-color));
        transition: filter 0.25s ease, transform 0.125s ease, opacity 0.125s ease;
        transform: translateY(0%);
      }

      button:not(:disabled) {
        cursor: pointer;
      }

      button.disabled {
        transform: translateY(110%);
        opacity: 0;
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
    `;
  }
}

window.customElements.define("advice-card", AdviceCard);
