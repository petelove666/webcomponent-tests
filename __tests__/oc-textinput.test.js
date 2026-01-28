import {OcTextinput} from '../components/client-side/oc-textinput/oc-textinput.js';

describe('OcTextinput', () => {
  beforeAll(() => {
    if (!customElements.get('oc-textinput')) {
      customElements.define('oc-textinput', OcTextinput);
    }
  });

  it('adds prefix element when prefix is set', () => {
    document.body.innerHTML = `<oc-textinput prefix="pound">test</oc-textinput>`;
    const el = document.querySelector('oc-textinput');
    expect(el.shadowRoot).toBeTruthy();
    const wrapper = el.shadowRoot.querySelector('.prefix');
    expect(wrapper).toBeTruthy();
  });
});