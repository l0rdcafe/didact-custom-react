const Didact = importFromBelow();

const stories = [
  { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

class Story extends Didact.Component {
  constructor(props) {
    super(props);
    this.state = { likes: Math.ceil(Math.random() * 100) };
  }
  like() {
    this.setState({ likes: this.state.likes + 1 });
  }
  render() {
    const { name, url } = this.props;
    const { likes } = this.state;
    return (
      <li>
        <button onClick={e => this.like()}>
          {likes}
          <b>❤️</b>
        </button>
        <a href={url}>{name}</a>
      </li>
    );
  }
}

class App extends Didact.Component {
  render() {
    return (
      <div>
        <h1>Didact Stories</h1>
        <ul>{this.props.stories.map(story => <Story name={story.name} url={story.url} />)}</ul>
      </div>
    );
  }
}

Didact.render(<App stories={stories} />, document.getElementById("root"));

function importFromBelow() {
  let rootInstance = null;
  const TEXT_ELEMENT = "TEXT ELEMENT";

  function createElement(type, config, ...args) {
    const props = Object.assign({}, config);
    const hasChildren = args.length > 0;
    const rawChildren = hasChildren ? [].concat(...args) : [];
    props.children = rawChildren
      .filter(c => c !== null && c !== false)
      .map(c => (c instanceof Object ? c : createTextElement(c)));
    return { type, props };
  }

  function createTextElement(val) {
    return createElement(TEXT_ELEMENT, { nodeValue: val });
  }

  function render(element, container) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;
  }

  function reconcile(parent, instance, element) {
    if (!instance) {
      const newInstance = instantiate(element);
      parent.appendChild(newInstance.dom);
      return newInstance;
    } else if (!element) {
      parent.removeChild(instance.dom);
      return null;
    } else if (instance.element.type !== element.type) {
      const newInstance = instantiate(element);
      parent.replaceChild(newInstance.dom, instance.dom);
      return newInstance;
    } else if (typeof element.type === "string") {
      updateDomProperties(instance.dom, instance.element.props, element.props);
      instance.childInstances = reconcileChildren(instance, element);
      instance.element = element;
      return instance;
    }
    instance.publicInstance.props = element.props;
    const childElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parent, oldChildInstance, childElement);
    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance;
  }

  function reconcileChildren(instance, element) {
    const { dom, childInstances } = instance;
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length, nextChildElements.length);

    for (let i = 0; i < count; i += 1) {
      const childInstance = childInstances[i];
      const childElement = nextChildElements[i];
      const newChildInstance = reconcile(dom, childInstance, childElement);
      newChildInstances.push(newChildInstance);
    }
    return newChildInstances.filter(inst => inst !== null);
  }

  function instantiate(element) {
    const { type, props } = element;
    const isDomElement = typeof type === "string";

    if (isDomElement) {
      const isTextElement = type === TEXT_ELEMENT;
      const dom = isTextElement ? document.createTextNode("") : document.createElement(type);
      updateDomProperties(dom, [], props);
      const childElements = props.children || [];
      const childInstances = childElements.map(instantiate);
      const childDoms = childInstances.map(inst => inst.dom);
      childDoms.forEach(child => dom.appendChild(child));

      const instance = { dom, element, childInstances };
      return instance;
    }
    const instance = {};
    const publicInstance = createPublicInstance(element, instance);
    const childElement = publicInstance.render();
    const childInstance = instantiate(childElement);
    const { dom } = childInstance;

    Object.assign(instance, { dom, element, childInstance, publicInstance });
    return instance;
  }

  function updateDomProperties(dom, prevProps, nextProps) {
    const isEvent = name => name.startsWith("on");
    const isAttribute = name => !isEvent(name) && name !== "children";

    Object.keys(prevProps)
      .filter(isEvent)
      .forEach(prop => {
        const eventType = prop.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[prop]);
      });

    Object.keys(prevProps)
      .filter(isAttribute)
      .forEach(prop => {
        dom[prop] = null;
      });

    Object.keys(nextProps)
      .filter(isAttribute)
      .forEach(prop => {
        dom[prop] = nextProps[prop];
      });

    Object.keys(nextProps)
      .filter(isEvent)
      .forEach(prop => {
        const eventType = prop.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[prop]);
      });
  }

  function createPublicInstance(element, internalInstance) {
    const { type, props } = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;
    return publicInstance;
  }

  class Component {
    constructor(props) {
      this.props = props;
      this.state = this.state || {};
    }
    setState(partialState) {
      this.state = Object.assign({}, this.state, partialState);
      updateInstance(this.__internalInstance);
    }
  }

  function updateInstance(internalInstance) {
    const parent = internalInstance.dom.parentNode;
    const { element } = internalInstance;
    reconcile(parent, internalInstance, element);
  }

  return {
    createElement,
    render,
    Component
  };
}
