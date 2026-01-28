const styles = new CSSStyleSheet();

styles.replaceSync(`

    .oc-quote {
      margin: 0 0 1.25rem 0;
      font-style: italic;
    }

    @container (width > 540px) {
      .oc-quote {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .oc-quote footer {
        width: 35%;
      }

      ::slotted(p){
        width: 65%;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .oc-quote--animated {
        animation: oc-quote-popin 2.2s ease 0s 1 normal forwards;
        animation-delay: 2s;
      }
    }

    ::slotted(p){
      margin: 0;
    }

    .oc-quote__author {
      margin-top: 0.25rem;
      margin-bottom: 0;
      font-weight: bold;
    }

    @keyframes oc-quote-popin {
        0% {
            animation-timing-function: ease-out;
            transform: scale(1);
            transform-origin: center center;
        }

        20% {
            animation-timing-function: ease-in;
            transform: scale(0.90);
        }

        45% {
            animation-timing-function: ease-out;
            transform: scale(1);
        }
    }

`);

export { styles};
