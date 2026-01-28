import {OcButton} from '../components/client-side/oc-button/oc-button.js';

describe('OcButton', () => {
  beforeAll(() => {
    if (!customElements.get('oc-button')) {
      customElements.define('oc-button', OcButton);
    }
  });

  it('adds the oc-button--primary class by default', () => {
    document.body.innerHTML = `<oc-button>test</oc-button>`;
    const el = document.querySelector('oc-button');
    // Wait for the custom element to upgrade and render
    // (JSDOM upgrades synchronously, but shadowRoot may not be immediately available)
    expect(el.shadowRoot).toBeTruthy();
    const button = el.shadowRoot.querySelector('.oc-button');
    expect(button).toBeTruthy();
    expect(button.classList.contains('oc-button--primary')).toBe(true);
  });

  it('adds the oc-button--secondary class when variant is set', () => {
    document.body.innerHTML = `<oc-button variant="secondary">test</oc-button>`;
    const el = document.querySelector('oc-button');
    expect(el.shadowRoot).toBeTruthy();
    const button = el.shadowRoot.querySelector('.oc-button');
    expect(button).toBeTruthy();
    expect(button.classList.contains('oc-button--secondary')).toBe(true);
  });

  it('does not add href if type is not link', () => {
    document.body.innerHTML = `<oc-button type="button" href="http://example.com/">test</oc-button>`;
    const el = document.querySelector('oc-button');
    expect(el.shadowRoot).toBeTruthy();
    const button = el.shadowRoot.querySelector('.oc-button');
    expect(button).toBeTruthy();
    expect(button.href).toBe(undefined);
  });

  it('adds href if type is a link and href is set', () => {
    document.body.innerHTML = `<oc-button type="link" href="http://example.com/">test</oc-button>`;
    const el = document.querySelector('oc-button');
    expect(el.shadowRoot).toBeTruthy();
    const button = el.shadowRoot.querySelector('.oc-button');
    expect(button).toBeTruthy();
    expect(button.href).toBe('http://example.com/');
  });

  it('sanitizes the value if unsafe URLs are passed to href', () => {
    document.body.innerHTML = `<oc-button type="link" href="javascript:alert('XSS Attack')">test</oc-button>`;
    const el = document.querySelector('oc-button');
    expect(el.shadowRoot).toBeTruthy();
    const button = el.shadowRoot.querySelector('.oc-button');
    expect(button).toBeTruthy();
    expect(button.href).toBe('http://localhost/#'); // JSDOM defaults to http://localhost/
  });
});