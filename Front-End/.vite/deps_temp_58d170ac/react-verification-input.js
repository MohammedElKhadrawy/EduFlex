import {
  require_react
} from "./chunk-FQO5W7GE.js";
import {
  __commonJS
} from "./chunk-ZS7NZCD4.js";

// node_modules/react-verification-input/lib/index.js
var require_lib = __commonJS({
  "node_modules/react-verification-input/lib/index.js"(exports) {
    (() => {
      var e = { 184: (e2, n2) => {
        var t2;
        !function() {
          "use strict";
          var r2 = {}.hasOwnProperty;
          function o2() {
            for (var e3 = [], n3 = 0; n3 < arguments.length; n3++) {
              var t3 = arguments[n3];
              if (t3) {
                var a2 = typeof t3;
                if ("string" === a2 || "number" === a2)
                  e3.push(t3);
                else if (Array.isArray(t3)) {
                  if (t3.length) {
                    var c = o2.apply(null, t3);
                    c && e3.push(c);
                  }
                } else if ("object" === a2) {
                  if (t3.toString !== Object.prototype.toString && !t3.toString.toString().includes("[native code]")) {
                    e3.push(t3.toString());
                    continue;
                  }
                  for (var i in t3)
                    r2.call(t3, i) && t3[i] && e3.push(i);
                }
              }
            }
            return e3.join(" ");
          }
          e2.exports ? (o2.default = o2, e2.exports = o2) : void 0 === (t2 = (function() {
            return o2;
          }).apply(n2, [])) || (e2.exports = t2);
        }();
      }, 28: (e2, n2, t2) => {
        "use strict";
        t2.d(n2, { Z: () => i });
        var r2 = t2(81), o2 = t2.n(r2), a2 = t2(645), c = t2.n(a2)()(o2());
        c.push([e2.id, ".vi {\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  box-sizing: border-box;\n  position: absolute;\n  color: transparent;\n  background: transparent;\n  caret-color: transparent;\n  outline: none;\n  border: 0 none transparent;\n}\n\n.vi::-ms-reveal,\n.vi::-ms-clear {\n  display: none;\n}\n\n.vi::selection {\n  background: transparent;\n}\n\n/* :where() gives the styles specificity 0, which makes them overridable */\n:where(.vi__container) {\n  position: relative;\n  display: flex;\n  gap: 8px;\n  height: 50px;\n  width: 300px;\n}\n\n:where(.vi__character) {\n  height: 100%;\n  flex-grow: 1;\n  flex-basis: 0;\n  text-align: center;\n  font-size: 36px;\n  line-height: 50px;\n  color: black;\n  background-color: white;\n  border: 1px solid black;\n  cursor: default;\n  user-select: none;\n  box-sizing: border-box;\n}\n\n:where(.vi__character--inactive) {\n  color: dimgray;\n  background-color: lightgray;\n}\n\n:where(.vi__character--selected) {\n  outline: 2px solid cornflowerblue;\n  color: cornflowerblue;\n}\n", ""]);
        const i = c;
      }, 645: (e2) => {
        "use strict";
        e2.exports = function(e3) {
          var n2 = [];
          return n2.toString = function() {
            return this.map(function(n3) {
              var t2 = "", r2 = void 0 !== n3[5];
              return n3[4] && (t2 += "@supports (".concat(n3[4], ") {")), n3[2] && (t2 += "@media ".concat(n3[2], " {")), r2 && (t2 += "@layer".concat(n3[5].length > 0 ? " ".concat(n3[5]) : "", " {")), t2 += e3(n3), r2 && (t2 += "}"), n3[2] && (t2 += "}"), n3[4] && (t2 += "}"), t2;
            }).join("");
          }, n2.i = function(e4, t2, r2, o2, a2) {
            "string" == typeof e4 && (e4 = [[null, e4, void 0]]);
            var c = {};
            if (r2)
              for (var i = 0; i < this.length; i++) {
                var l = this[i][0];
                null != l && (c[l] = true);
              }
            for (var s = 0; s < e4.length; s++) {
              var u = [].concat(e4[s]);
              r2 && c[u[0]] || (void 0 !== a2 && (void 0 === u[5] || (u[1] = "@layer".concat(u[5].length > 0 ? " ".concat(u[5]) : "", " {").concat(u[1], "}")), u[5] = a2), t2 && (u[2] ? (u[1] = "@media ".concat(u[2], " {").concat(u[1], "}"), u[2] = t2) : u[2] = t2), o2 && (u[4] ? (u[1] = "@supports (".concat(u[4], ") {").concat(u[1], "}"), u[4] = o2) : u[4] = "".concat(o2)), n2.push(u));
            }
          }, n2;
        };
      }, 81: (e2) => {
        "use strict";
        e2.exports = function(e3) {
          return e3[1];
        };
      }, 703: (e2, n2, t2) => {
        "use strict";
        var r2 = t2(414);
        function o2() {
        }
        function a2() {
        }
        a2.resetWarningCache = o2, e2.exports = function() {
          function e3(e4, n4, t4, o3, a3, c) {
            if (c !== r2) {
              var i = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
              throw i.name = "Invariant Violation", i;
            }
          }
          function n3() {
            return e3;
          }
          e3.isRequired = e3;
          var t3 = { array: e3, bigint: e3, bool: e3, func: e3, number: e3, object: e3, string: e3, symbol: e3, any: e3, arrayOf: n3, element: e3, elementType: e3, instanceOf: n3, node: e3, objectOf: n3, oneOf: n3, oneOfType: n3, shape: n3, exact: n3, checkPropTypes: a2, resetWarningCache: o2 };
          return t3.PropTypes = t3, t3;
        };
      }, 697: (e2, n2, t2) => {
        e2.exports = t2(703)();
      }, 414: (e2) => {
        "use strict";
        e2.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
      } }, n = {};
      function t(r2) {
        var o2 = n[r2];
        if (void 0 !== o2)
          return o2.exports;
        var a2 = n[r2] = { id: r2, exports: {} };
        return e[r2](a2, a2.exports, t), a2.exports;
      }
      t.n = (e2) => {
        var n2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return t.d(n2, { a: n2 }), n2;
      }, t.d = (e2, n2) => {
        for (var r2 in n2)
          t.o(n2, r2) && !t.o(e2, r2) && Object.defineProperty(e2, r2, { enumerable: true, get: n2[r2] });
      }, t.o = (e2, n2) => Object.prototype.hasOwnProperty.call(e2, n2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      };
      var r = {};
      (() => {
        "use strict";
        t.r(r), t.d(r, { default: () => g });
        const e2 = require_react();
        var n2 = t.n(e2), o2 = t(184), a2 = t.n(o2), c = t(697), i = t.n(c), l = t(28), s = ["className", "type"], u = ["className"];
        function p() {
          return p = Object.assign ? Object.assign.bind() : function(e3) {
            for (var n3 = 1; n3 < arguments.length; n3++) {
              var t2 = arguments[n3];
              for (var r2 in t2)
                Object.prototype.hasOwnProperty.call(t2, r2) && (e3[r2] = t2[r2]);
            }
            return e3;
          }, p.apply(this, arguments);
        }
        function f(e3, n3) {
          if (null == e3)
            return {};
          var t2, r2, o3 = function(e4, n4) {
            if (null == e4)
              return {};
            var t3, r3, o4 = {}, a4 = Object.keys(e4);
            for (r3 = 0; r3 < a4.length; r3++)
              t3 = a4[r3], n4.indexOf(t3) >= 0 || (o4[t3] = e4[t3]);
            return o4;
          }(e3, n3);
          if (Object.getOwnPropertySymbols) {
            var a3 = Object.getOwnPropertySymbols(e3);
            for (r2 = 0; r2 < a3.length; r2++)
              t2 = a3[r2], n3.indexOf(t2) >= 0 || Object.prototype.propertyIsEnumerable.call(e3, t2) && (o3[t2] = e3[t2]);
          }
          return o3;
        }
        function d(e3, n3) {
          return function(e4) {
            if (Array.isArray(e4))
              return e4;
          }(e3) || function(e4, n4) {
            var t2 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
            if (null != t2) {
              var r2, o3, a3, c2, i2 = [], l2 = true, s2 = false;
              try {
                if (a3 = (t2 = t2.call(e4)).next, 0 === n4) {
                  if (Object(t2) !== t2)
                    return;
                  l2 = false;
                } else
                  for (; !(l2 = (r2 = a3.call(t2)).done) && (i2.push(r2.value), i2.length !== n4); l2 = true)
                    ;
              } catch (e5) {
                s2 = true, o3 = e5;
              } finally {
                try {
                  if (!l2 && null != t2.return && (c2 = t2.return(), Object(c2) !== c2))
                    return;
                } finally {
                  if (s2)
                    throw o3;
                }
              }
              return i2;
            }
          }(e3, n3) || h(e3, n3) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }();
        }
        function h(e3, n3) {
          if (e3) {
            if ("string" == typeof e3)
              return v(e3, n3);
            var t2 = Object.prototype.toString.call(e3).slice(8, -1);
            return "Object" === t2 && e3.constructor && (t2 = e3.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(e3) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? v(e3, n3) : void 0;
          }
        }
        function v(e3, n3) {
          (null == n3 || n3 > e3.length) && (n3 = e3.length);
          for (var t2 = 0, r2 = new Array(n3); t2 < n3; t2++)
            r2[t2] = e3[t2];
          return r2;
        }
        var y = (0, e2.forwardRef)(function(t2, r2) {
          var o3 = t2.value, c2 = t2.length, i2 = t2.validChars, y2 = t2.placeholder, g2 = t2.autoFocus, b = t2.passwordMode, m = t2.inputProps, _ = t2.containerProps, w = t2.classNames, x = t2.onChange, O = t2.onFocus, S = t2.onBlur, j = t2.onComplete, P = d((0, e2.useState)(""), 2), A = P[0], k = P[1], C = d((0, e2.useState)(false), 2), T = C[0], E = C[1], I = (0, e2.useRef)(null);
          (0, e2.useEffect)(function() {
            g2 && I.current.focus();
          }, [g2]);
          var N, R = function() {
            I.current.focus();
          }, M = function() {
            return null != o3 ? o3 : A;
          }, F = function(e3) {
            var n3 = M();
            return (n3.length === e3 || n3.length === e3 + 1 && c2 === e3 + 1) && T;
          }, D = function(e3) {
            return M().length < e3;
          }, z = m.className, B = m.type, L = f(m, s), U = _.className, W = f(_, u);
          return n2().createElement(n2().Fragment, null, n2().createElement("div", p({ "data-testid": "container", className: a2()("vi__container", w.container, U), onClick: function() {
            return I.current.focus();
          } }, W), n2().createElement("input", p({ "aria-label": "verification input", spellCheck: false, value: M(), onChange: function(e3) {
            var n3 = e3.target.value.replace(/\s/g, "");
            RegExp("^[".concat(i2, "]{0,").concat(c2, "}$")).test(n3) && (x && (null == x || x(n3)), k(n3), n3.length === c2 && (null == j || j(n3)));
          }, ref: function(e3) {
            I.current = e3, "function" == typeof r2 ? r2(e3) : r2 && (r2.current = e3);
          }, className: a2()("vi", z), onKeyDown: function(e3) {
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e3.key) && e3.preventDefault();
          }, onFocus: function() {
            E(true), null == O || O();
          }, onBlur: function() {
            E(false), null == S || S();
          }, onSelect: function(e3) {
            var n3 = e3.target.value;
            e3.target.setSelectionRange(n3.length, n3.length);
          }, type: b ? "password" : B }, L)), (N = Array(c2), function(e3) {
            if (Array.isArray(e3))
              return v(e3);
          }(N) || function(e3) {
            if ("undefined" != typeof Symbol && null != e3[Symbol.iterator] || null != e3["@@iterator"])
              return Array.from(e3);
          }(N) || h(N) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }()).map(function(e3, t3) {
            return n2().createElement("div", { className: a2()("vi__character", w.character, { "vi__character--selected": F(t3), "vi__character--inactive": D(t3) }, F(t3) && w.characterSelected, D(t3) && w.characterInactive), onClick: R, id: "field-".concat(t3), "data-testid": "character-".concat(t3), key: t3 }, b && M()[t3] ? "*" : M()[t3] || y2);
          })), n2().createElement("style", { dangerouslySetInnerHTML: { __html: l.Z } }));
        });
        y.displayName = "VerificationInput", y.propTypes = { value: i().string, length: i().number, validChars: i().string, placeholder: i().string, autoFocus: i().bool, passwordMode: i().bool, inputProps: i().object, containerProps: i().object, classNames: i().shape({ container: i().string, character: i().string, characterInactive: i().string, characterSelected: i().string }), onChange: i().func, onFocus: i().func, onBlur: i().func, onComplete: i().func }, y.defaultProps = { length: 6, validChars: "A-Za-z0-9", placeholder: "·", autoFocus: false, inputProps: {}, containerProps: {}, classNames: {} };
        const g = y;
      })();
      var o = exports;
      for (var a in r)
        o[a] = r[a];
      r.__esModule && Object.defineProperty(o, "__esModule", { value: true });
    })();
  }
});
export default require_lib();
/*! Bundled license information:

react-verification-input/lib/index.js:
  (*! For license information please see index.js.LICENSE.txt *)
*/
//# sourceMappingURL=react-verification-input.js.map
