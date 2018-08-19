"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Didact = importFromBelow();

var stories = [{ name: "Didact introduction", url: "http://bit.ly/2pX7HNn" }, { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" }, { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" }, { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" }, { name: "Components and state", url: "http://bit.ly/2rE16nh" }];

var Story = function (_Didact$Component) {
  _inherits(Story, _Didact$Component);

  function Story(props) {
    _classCallCheck(this, Story);

    var _this = _possibleConstructorReturn(this, (Story.__proto__ || Object.getPrototypeOf(Story)).call(this, props));

    _this.state = { likes: Math.ceil(Math.random() * 100) };
    return _this;
  }

  _createClass(Story, [{
    key: "like",
    value: function like() {
      this.setState({ likes: this.state.likes + 1 });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          name = _props.name,
          url = _props.url;
      var likes = this.state.likes;

      return Didact.createElement("li", null, Didact.createElement("button", {
        onClick: function onClick(e) {
          return _this2.like();
        }
      }, likes, Didact.createElement("b", null, "\u2764\uFE0F")), Didact.createElement("a", { href: url }, name));
    }
  }]);

  return Story;
}(Didact.Component);

var App = function (_Didact$Component2) {
  _inherits(App, _Didact$Component2);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return Didact.createElement("div", null, Didact.createElement("h1", null, "Didact Stories"), Didact.createElement("ul", null, this.props.stories.map(function (story) {
        return Didact.createElement(Story, { name: story.name, url: story.url });
      })));
    }
  }]);

  return App;
}(Didact.Component);

Didact.render(Didact.createElement(App, { stories: stories }), document.getElementById("root"));

function importFromBelow() {
  var rootInstance = null;
  var TEXT_ELEMENT = "TEXT ELEMENT";

  function createElement(type, config) {
    var _ref = void 0;

    var props = Object.assign({}, config);

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var hasChildren = args.length > 0;
    var rawChildren = hasChildren ? (_ref = []).concat.apply(_ref, args) : [];
    props.children = rawChildren.filter(function (c) {
      return c !== null && c !== false;
    }).map(function (c) {
      return c instanceof Object ? c : createTextElement(c);
    });
    return { type: type, props: props };
  }

  function createTextElement(val) {
    return createElement(TEXT_ELEMENT, { nodeValue: val });
  }

  function render(element, container) {
    var prevInstance = rootInstance;
    var nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;
  }

  function reconcile(parent, instance, element) {
    if (!instance) {
      var newInstance = instantiate(element);
      parent.appendChild(newInstance.dom);
      return newInstance;
    } else if (!element) {
      parent.removeChild(instance.dom);
      return null;
    } else if (instance.element.type !== element.type) {
      var _newInstance = instantiate(element);
      parent.replaceChild(_newInstance.dom, instance.dom);
      return _newInstance;
    } else if (typeof element.type === "string") {
      updateDomProperties(instance.dom, instance.element.props, element.props);
      instance.childInstances = reconcileChildren(instance, element);
      instance.element = element;
      return instance;
    }
    instance.publicInstance.props = element.props;
    var childElement = instance.publicInstance.render();
    var oldChildInstance = instance.childInstance;
    var childInstance = reconcile(parent, oldChildInstance, childElement);
    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance;
  }

  function reconcileChildren(instance, element) {
    var dom = instance.dom,
        childInstances = instance.childInstances;

    var nextChildElements = element.props.children || [];
    var newChildInstances = [];
    var count = Math.max(childInstances.length, nextChildElements.length);

    for (var i = 0; i < count; i += 1) {
      var childInstance = childInstances[i];
      var childElement = nextChildElements[i];
      var newChildInstance = reconcile(dom, childInstance, childElement);
      newChildInstances.push(newChildInstance);
    }
    return newChildInstances.filter(function (inst) {
      return inst !== null;
    });
  }

  function instantiate(element) {
    var type = element.type,
        props = element.props;

    var isDomElement = typeof type === "string";

    if (isDomElement) {
      var isTextElement = type === TEXT_ELEMENT;
      var _dom = isTextElement ? document.createTextNode("") : document.createElement(type);
      updateDomProperties(_dom, [], props);
      var childElements = props.children || [];
      var childInstances = childElements.map(instantiate);
      var childDoms = childInstances.map(function (inst) {
        return inst.dom;
      });
      childDoms.forEach(function (child) {
        return _dom.appendChild(child);
      });

      var _instance = { dom: _dom, element: element, childInstances: childInstances };
      return _instance;
    }
    var instance = {};
    var publicInstance = createPublicInstance(element, instance);
    var childElement = publicInstance.render();
    var childInstance = instantiate(childElement);
    var dom = childInstance.dom;

    Object.assign(instance, {
      dom: dom,
      element: element,
      childInstance: childInstance,
      publicInstance: publicInstance
    });
    return instance;
  }

  function updateDomProperties(dom, prevProps, nextProps) {
    var isEvent = function isEvent(name) {
      return name.startsWith("on");
    };
    var isAttribute = function isAttribute(name) {
      return !isEvent(name) && name !== "children";
    };

    Object.keys(prevProps).filter(isEvent).forEach(function (prop) {
      var eventType = prop.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[prop]);
    });

    Object.keys(prevProps).filter(isAttribute).forEach(function (prop) {
      dom[prop] = null;
    });

    Object.keys(nextProps).filter(isAttribute).forEach(function (prop) {
      dom[prop] = nextProps[prop];
    });

    Object.keys(nextProps).filter(isEvent).forEach(function (prop) {
      var eventType = prop.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[prop]);
    });
  }

  function createPublicInstance(element, internalInstance) {
    var type = element.type,
        props = element.props;

    var publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;
    return publicInstance;
  }

  var Component = function () {
    function Component(props) {
      _classCallCheck(this, Component);

      this.props = props;
      this.state = this.state || {};
    }

    _createClass(Component, [{
      key: "setState",
      value: function setState(partialState) {
        this.state = Object.assign({}, this.state, partialState);
        updateInstance(this.__internalInstance);
      }
    }]);

    return Component;
  }();

  function updateInstance(internalInstance) {
    var parent = internalInstance.dom.parentNode;
    var element = internalInstance.element;

    reconcile(parent, internalInstance, element);
  }

  return {
    createElement: createElement,
    render: render,
    Component: Component
  };
}
