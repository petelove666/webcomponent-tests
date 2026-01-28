import {OcTextInputLight} from '../components/client-side/oc-text-input-light/oc-text-input-light.js';

describe('OcTextInputLight', () => {
  beforeAll(() => {
    if (!customElements.get('oc-text-input-light')) {
      customElements.define('oc-text-input-light', OcTextInputLight);
    }
  });

  it('adds prefix element when prefix is set', async () => {
    document.body.innerHTML = `<oc-text-input-light prefix="pound"><input type="text" /></oc-text-input-light>`;
    const el = document.querySelector('oc-text-input-light');
    await customElements.whenDefined('oc-text-input-light');
    // Add a small delay to ensure component has fully rendered
    await new Promise(resolve => setTimeout(resolve, 0));
    const wrapper = el.querySelector('.prefix');
    expect(wrapper).toBeTruthy();
  });
});