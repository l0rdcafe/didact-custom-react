"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @jsx Didact.createElement */
var Didact = importFromBelow();

var stories = [{ name: "Didact introduction", url: "http://bit.ly/2pX7HNn" }, { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" }, { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" }, { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" }, { name: "Components and state", url: "http://bit.ly/2rE16nh" }, { name: "Fiber: Incremental reconciliation", url: "http://bit.ly/2gaF1sS" }];

var App = function (_Didact$Component) {
  _inherits(App, _Didact$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return Didact.createElement(
        "div",
        null,
        Didact.createElement(
          "h1",
          null,
          "Didact Stories"
        ),
        Didact.createElement(
          "ul",
          null,
          this.props.stories.map(function (story) {
            return Didact.createElement(Story, { name: story.name, url: story.url });
          })
        )
      );
    }
  }]);

  return App;
}(Didact.Component);

var Story = function (_Didact$Component2) {
  _inherits(Story, _Didact$Component2);

  function Story(props) {
    _classCallCheck(this, Story);

    var _this2 = _possibleConstructorReturn(this, (Story.__proto__ || Object.getPrototypeOf(Story)).call(this, props));

    _this2.state = { likes: Math.ceil(Math.random() * 100) };
    return _this2;
  }

  _createClass(Story, [{
    key: "like",
    value: function like() {
      this.setState({
        likes: this.state.likes + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          name = _props.name,
          url = _props.url;
      var likes = this.state.likes;

      var likesElement = Didact.createElement("span", null);
      return Didact.createElement(
        "li",
        null,
        Didact.createElement(
          "button",
          { onClick: function onClick(e) {
              return _this3.like();
            } },
          likes,
          Didact.createElement(
            "b",
            null,
            "\u2764\uFE0F"
          )
        ),
        Didact.createElement(
          "a",
          { href: url },
          name
        )
      );
    }
  }]);

  return Story;
}(Didact.Component);

Didact.render(Didact.createElement(App, { stories: stories }), document.getElementById("root"));

/** ⬇️⬇️⬇️⬇️⬇️ 🌼Didact🌼 ⬇️⬇️⬇️⬇️⬇️ * */

function importFromBelow() {
  // #region element.js
  var TEXT_ELEMENT = "TEXT ELEMENT";

  function createElement(type, config) {
    var _ref;

    var props = Object.assign({}, config);

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var hasChildren = args.length > 0;
    var rawChildren = hasChildren ? (_ref = []).concat.apply(_ref, args) : [];
    props.children = rawChildren.filter(function (c) {
      return c != null && c !== false;
    }).map(function (c) {
      return c instanceof Object ? c : createTextElement(c);
    });
    return { type: type, props: props };
  }

  function createTextElement(value) {
    return createElement(TEXT_ELEMENT, { nodeValue: value });
  }
  // #endregion
  // #region dom-utils.js
  var isEvent = function isEvent(name) {
    return name.startsWith("on");
  };
  var isAttribute = function isAttribute(name) {
    return !isEvent(name) && name != "children" && name != "style";
  };
  var isNew = function isNew(prev, next) {
    return function (key) {
      return prev[key] !== next[key];
    };
  };
  var isGone = function isGone(prev, next) {
    return function (key) {
      return !(key in next);
    };
  };

  function updateDomProperties(dom, prevProps, nextProps) {
    // Remove event listeners
    Object.keys(prevProps).filter(isEvent).filter(function (key) {
      return !(key in nextProps) || isNew(prevProps, nextProps)(key);
    }).forEach(function (name) {
      var eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

    // Remove attributes
    Object.keys(prevProps).filter(isAttribute).filter(isGone(prevProps, nextProps)).forEach(function (name) {
      dom[name] = null;
    });

    // Set attributes
    Object.keys(nextProps).filter(isAttribute).filter(isNew(prevProps, nextProps)).forEach(function (name) {
      dom[name] = nextProps[name];
    });

    // Set style
    prevProps.style = prevProps.style || {};
    nextProps.style = nextProps.style || {};
    Object.keys(nextProps.style).filter(isNew(prevProps.style, nextProps.style)).forEach(function (key) {
      dom.style[key] = nextProps.style[key];
    });
    Object.keys(prevProps.style).filter(isGone(prevProps.style, nextProps.style)).forEach(function (key) {
      dom.style[key] = "";
    });

    // Add event listeners
    Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(function (name) {
      var eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
  }

  function createDomElement(fiber) {
    var isTextElement = fiber.type === TEXT_ELEMENT;
    var dom = isTextElement ? document.createTextNode("") : document.createElement(fiber.type);
    updateDomProperties(dom, [], fiber.props);
    return dom;
  }
  // #endregion
  // #region component.js

  var Component = function () {
    function Component(props) {
      _classCallCheck(this, Component);

      this.props = props || {};
      this.state = this.state || {};
    }

    _createClass(Component, [{
      key: "setState",
      value: function setState(partialState) {
        scheduleUpdate(this, partialState);
      }
    }]);

    return Component;
  }();

  function createInstance(fiber) {
    var instance = new fiber.type(fiber.props);
    instance.__fiber = fiber;
    return instance;
  }
  // #endregion
  // #region reconciler.js
  // Fiber tags
  var HOST_COMPONENT = "host";
  var CLASS_COMPONENT = "class";
  var HOST_ROOT = "root";

  // Effect tags
  var PLACEMENT = 1;
  var DELETION = 2;
  var UPDATE = 3;

  var ENOUGH_TIME = 1;

  // Global state
  var updateQueue = [];
  var nextUnitOfWork = null;
  var pendingCommit = null;

  function render(elements, containerDom) {
    updateQueue.push({
      from: HOST_ROOT,
      dom: containerDom,
      newProps: { children: elements }
    });
    requestIdleCallback(performWork);
  }

  function scheduleUpdate(instance, partialState) {
    updateQueue.push({
      from: CLASS_COMPONENT,
      instance: instance,
      partialState: partialState
    });
    requestIdleCallback(performWork);
  }

  function performWork(deadline) {
    workLoop(deadline);
    if (nextUnitOfWork || updateQueue.length > 0) {
      requestIdleCallback(performWork);
    }
  }

  function workLoop(deadline) {
    if (!nextUnitOfWork) {
      resetNextUnitOfWork();
    }
    while (nextUnitOfWork) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (pendingCommit) {
      commitAllWork(pendingCommit);
    }
  }

  function resetNextUnitOfWork() {
    var update = updateQueue.shift();
    if (!update) {
      return;
    }

    // Copy the setState parameter from the update payload to the corresponding fiber
    if (update.partialState) {
      update.instance.__fiber.partialState = update.partialState;
    }

    var root = update.from == HOST_ROOT ? update.dom._rootContainerFiber : getRoot(update.instance.__fiber);

    nextUnitOfWork = {
      tag: HOST_ROOT,
      stateNode: update.dom || root.stateNode,
      props: update.newProps || root.props,
      alternate: root
    };
  }

  function getRoot(fiber) {
    var node = fiber;
    while (node.parent) {
      node = node.parent;
    }
    return node;
  }

  function performUnitOfWork(wipFiber) {
    beginWork(wipFiber);
    if (wipFiber.child) {
      return wipFiber.child;
    }

    // No child, we call completeWork until we find a sibling
    var uow = wipFiber;
    while (uow) {
      completeWork(uow);
      if (uow.sibling) {
        // Sibling needs to beginWork
        return uow.sibling;
      }
      uow = uow.parent;
    }
  }

  function beginWork(wipFiber) {
    if (wipFiber.tag == CLASS_COMPONENT) {
      updateClassComponent(wipFiber);
    } else {
      updateHostComponent(wipFiber);
    }
  }

  function updateHostComponent(wipFiber) {
    if (!wipFiber.stateNode) {
      wipFiber.stateNode = createDomElement(wipFiber);
    }

    var newChildElements = wipFiber.props.children;
    reconcileChildrenArray(wipFiber, newChildElements);
  }

  function updateClassComponent(wipFiber) {
    var instance = wipFiber.stateNode;
    if (instance == null) {
      // Call class constructor
      instance = wipFiber.stateNode = createInstance(wipFiber);
    } else if (wipFiber.props == instance.props && !wipFiber.partialState) {
      // No need to render, clone children from last time
      cloneChildFibers(wipFiber);
      return;
    }

    instance.props = wipFiber.props;
    instance.state = Object.assign({}, instance.state, wipFiber.partialState);
    wipFiber.partialState = null;

    var newChildElements = wipFiber.stateNode.render();
    reconcileChildrenArray(wipFiber, newChildElements);
  }

  function arrify(val) {
    return val == null ? [] : Array.isArray(val) ? val : [val];
  }

  function reconcileChildrenArray(wipFiber, newChildElements) {
    var elements = arrify(newChildElements);

    var index = 0;
    var oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null;
    var newFiber = null;
    while (index < elements.length || oldFiber != null) {
      var prevFiber = newFiber;
      var element = index < elements.length && elements[index];
      var sameType = oldFiber && element && element.type == oldFiber.type;

      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          tag: oldFiber.tag,
          stateNode: oldFiber.stateNode,
          props: element.props,
          parent: wipFiber,
          alternate: oldFiber,
          partialState: oldFiber.partialState,
          effectTag: UPDATE
        };
      }

      if (element && !sameType) {
        newFiber = {
          type: element.type,
          tag: typeof element.type === "string" ? HOST_COMPONENT : CLASS_COMPONENT,
          props: element.props,
          parent: wipFiber,
          effectTag: PLACEMENT
        };
      }

      if (oldFiber && !sameType) {
        oldFiber.effectTag = DELETION;
        wipFiber.effects = wipFiber.effects || [];
        wipFiber.effects.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (index == 0) {
        wipFiber.child = newFiber;
      } else if (prevFiber && element) {
        prevFiber.sibling = newFiber;
      }

      index++;
    }
  }

  function cloneChildFibers(parentFiber) {
    var oldFiber = parentFiber.alternate;
    if (!oldFiber.child) {
      return;
    }

    var oldChild = oldFiber.child;
    var prevChild = null;
    while (oldChild) {
      var newChild = {
        type: oldChild.type,
        tag: oldChild.tag,
        stateNode: oldChild.stateNode,
        props: oldChild.props,
        partialState: oldChild.partialState,
        alternate: oldChild,
        parent: parentFiber
      };
      if (prevChild) {
        prevChild.sibling = newChild;
      } else {
        parentFiber.child = newChild;
      }
      prevChild = newChild;
      oldChild = oldChild.sibling;
    }
  }

  function completeWork(fiber) {
    if (fiber.tag == CLASS_COMPONENT) {
      fiber.stateNode.__fiber = fiber;
    }

    if (fiber.parent) {
      var childEffects = fiber.effects || [];
      var thisEffect = fiber.effectTag != null ? [fiber] : [];
      var parentEffects = fiber.parent.effects || [];
      fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
    } else {
      pendingCommit = fiber;
    }
  }

  function commitAllWork(fiber) {
    fiber.effects.forEach(function (f) {
      commitWork(f);
    });
    fiber.stateNode._rootContainerFiber = fiber;
    nextUnitOfWork = null;
    pendingCommit = null;
  }

  function commitWork(fiber) {
    if (fiber.tag == HOST_ROOT) {
      return;
    }

    var domParentFiber = fiber.parent;
    while (domParentFiber.tag == CLASS_COMPONENT) {
      domParentFiber = domParentFiber.parent;
    }
    var domParent = domParentFiber.stateNode;

    if (fiber.effectTag == PLACEMENT && fiber.tag == HOST_COMPONENT) {
      domParent.appendChild(fiber.stateNode);
    } else if (fiber.effectTag == UPDATE) {
      updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag == DELETION) {
      commitDeletion(fiber, domParent);
    }
  }

  function commitDeletion(fiber, domParent) {
    var node = fiber;
    while (true) {
      if (node.tag == CLASS_COMPONENT) {
        node = node.child;
        continue;
      }
      domParent.removeChild(node.stateNode);
      while (node != fiber && !node.sibling) {
        node = node.parent;
      }
      if (node == fiber) {
        return;
      }
      node = node.sibling;
    }
  }
  // #endregion
  return {
    createElement: createElement,
    render: render,
    Component: Component
  };
}
