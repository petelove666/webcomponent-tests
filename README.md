# ochre-ui

Experiments with web components, exploring different approaches:

* HTML fully rendered within Shadow DOM by the web component
* Partial rendering of HTML by app, slotted into web component rendered HTML within Shadow DOM
* Component forming a light DOM 'wrapper' to handle styling and progressive enhancement
* Using server side rendered declarative shadow DOM and HTML
* Extending existing HTML elements
* Web components responsible only for data fetching and distribution

&NewLine;  
&NewLine;  

# Components

## HTML fully rendered within Shadow DOM

* **oc-button**
* **oc-quote**
* **oc-text-input**
* **oc-popover**
* **oc-table**
* **oc-list**
* **oc-table-starwars**

Web components that are responsible for rendering their own Shadow DOM and internal HTML and CSS
Robust approach giving full control of rendered HTML, but in the case of form elements quite a lot of work to replicate standard behaviour

## Partial rendering of HTML by app

* **oc-textinput**

Web component that renders its own Shadow DOM and CSS, but mostly utilises slots for internal HTML
Leaves most rendering and control of the form input in the light DOM, simplifiying development in consuming environment.
Additional styling complexity compared to full Shadow DOM rendering

## Component forming a light DOM 'wrapper'
* **oc-text-input-light**

Web component that has no Shadow DOM, but still takes responsibility for component's CSS and progressive enhancement of child elements
Simplest implementation, especially for form elements. Simplified development in consuming environment.
Lose benefits of encapsulatiion 

## Using server side rendered declarative shadow DOM
* **oc-button-server**
* **oc-textinput-server**

Web components that assume that their templates (CSS and HTML) and Shadow DOM is rendered server side.
Benefits of server side rendering (no flash of unstyled content, more efficient rendering, potential for some components to be functional without Javascript)
Additional development complexity of maintaining template within server side templating system

* **oc-button-server-hybrid**

Web component that conditionally renders Shadow DOM with template if server side template not provided.
Whilst very flexible, allowing either approach, it involves duplication of template and the risk of divergence.

## Extending existing HTML elements 
* **oc-input-extend**

Web component that extends the 'input' HTML element.\
Relies on external styling.\
It is unlikely that all browsers will ever support the extension of existing HTML inputs. Even if they do it doesn't feel appropriate to do so in a way that makes significant changes to the native element.

## Web components responsible for data fetching
* **oc-data-starwars**

Web component responsible only for fetching data and passing to child elements.

&NewLine;  
&NewLine;  

# Dependencies
There are no build steps or dependencies needed to use the web components. However "esbuild" is used to build the distribution package with all components bundled into a single file.\
All other dependencies are for running jest tests.

## Dev Dependencies

### Needed to build distribution package of es module and common js files
"esbuild"

### Needed to run demo page (index.htm, not part of Storybook) locally
"http-server"

### Needed for JEST tests
"@babel/core"\
"@babel/preset-env"\
"babel-jest"\
"jest"\
"jest-environment-jsdom"



