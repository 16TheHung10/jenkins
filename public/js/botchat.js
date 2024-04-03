!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.BotChat = t())
    : (e.BotChat = t());
})(this, function () {
  return (function (e) {
    function t(r) {
      if (n[r]) return n[r].exports;
      var i = (n[r] = { i: r, l: !1, exports: {} });
      return e[r].call(i.exports, i, i.exports, t), (i.l = !0), i.exports;
    }
    var n = {};
    return (
      (t.m = e),
      (t.c = n),
      (t.i = function (e) {
        return e;
      }),
      (t.d = function (e, n, r) {
        t.o(e, n) ||
          Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: r,
          });
      }),
      (t.n = function (e) {
        var n =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return t.d(n, "a", n), n;
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (t.p = ""),
      t((t.s = 102))
    );
  })([
    function (e, t, n) {
      "use strict";
      var r = n(5),
        i = n(262),
        o = n(36),
        s = (function () {
          function e(e) {
            (this._isScalar = !1), e && (this._subscribe = e);
          }
          return (
            (e.prototype.lift = function (t) {
              var n = new e();
              return (n.source = this), (n.operator = t), n;
            }),
            (e.prototype.subscribe = function (e, t, n) {
              var r = this.operator,
                o = i.toSubscriber(e, t, n);
              if (
                (r
                  ? r.call(o, this.source)
                  : o.add(
                      this.source ? this._subscribe(o) : this._trySubscribe(o),
                    ),
                o.syncErrorThrowable &&
                  ((o.syncErrorThrowable = !1), o.syncErrorThrown))
              )
                throw o.syncErrorValue;
              return o;
            }),
            (e.prototype._trySubscribe = function (e) {
              try {
                return this._subscribe(e);
              } catch (t) {
                (e.syncErrorThrown = !0), (e.syncErrorValue = t), e.error(t);
              }
            }),
            (e.prototype.forEach = function (e, t) {
              var n = this;
              if (
                (t ||
                  (r.root.Rx && r.root.Rx.config && r.root.Rx.config.Promise
                    ? (t = r.root.Rx.config.Promise)
                    : r.root.Promise && (t = r.root.Promise)),
                !t)
              )
                throw new Error("no Promise impl found");
              return new t(function (t, r) {
                var i;
                i = n.subscribe(
                  function (t) {
                    if (i)
                      try {
                        e(t);
                      } catch (e) {
                        r(e), i.unsubscribe();
                      }
                    else e(t);
                  },
                  r,
                  t,
                );
              });
            }),
            (e.prototype._subscribe = function (e) {
              return this.source.subscribe(e);
            }),
            (e.prototype[o.observable] = function () {
              return this;
            }),
            (e.create = function (t) {
              return new e(t);
            }),
            e
          );
        })();
      t.Observable = s;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return Object.prototype.toString.call(e);
      }
      function i(e) {
        return "[object String]" === r(e);
      }
      function o(e, t) {
        return w.call(e, t);
      }
      function s(e) {
        return (
          Array.prototype.slice.call(arguments, 1).forEach(function (t) {
            if (t) {
              if ("object" != typeof t)
                throw new TypeError(t + "must be object");
              Object.keys(t).forEach(function (n) {
                e[n] = t[n];
              });
            }
          }),
          e
        );
      }
      function a(e, t, n) {
        return [].concat(e.slice(0, t), n, e.slice(t + 1));
      }
      function l(e) {
        return (
          !(e >= 55296 && e <= 57343) &&
          !(e >= 64976 && e <= 65007) &&
          65535 != (65535 & e) &&
          65534 != (65535 & e) &&
          !(e >= 0 && e <= 8) &&
          11 !== e &&
          !(e >= 14 && e <= 31) &&
          !(e >= 127 && e <= 159) &&
          !(e > 1114111)
        );
      }
      function c(e) {
        if (e > 65535) {
          e -= 65536;
          var t = 55296 + (e >> 10),
            n = 56320 + (1023 & e);
          return String.fromCharCode(t, n);
        }
        return String.fromCharCode(e);
      }
      function u(e, t) {
        var n = 0;
        return o(E, t)
          ? E[t]
          : 35 === t.charCodeAt(0) &&
            x.test(t) &&
            ((n =
              "x" === t[1].toLowerCase()
                ? parseInt(t.slice(2), 16)
                : parseInt(t.slice(1), 10)),
            l(n))
          ? c(n)
          : e;
      }
      function p(e) {
        return e.indexOf("\\") < 0 ? e : e.replace(C, "$1");
      }
      function d(e) {
        return e.indexOf("\\") < 0 && e.indexOf("&") < 0
          ? e
          : e.replace(k, function (e, t, n) {
              return t || u(e, n);
            });
      }
      function h(e) {
        return O[e];
      }
      function f(e) {
        return T.test(e) ? e.replace(A, h) : e;
      }
      function m(e) {
        return e.replace(P, "\\$&");
      }
      function g(e) {
        switch (e) {
          case 9:
          case 32:
            return !0;
        }
        return !1;
      }
      function y(e) {
        if (e >= 8192 && e <= 8202) return !0;
        switch (e) {
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 32:
          case 160:
          case 5760:
          case 8239:
          case 8287:
          case 12288:
            return !0;
        }
        return !1;
      }
      function v(e) {
        return I.test(e);
      }
      function b(e) {
        switch (e) {
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
          case 40:
          case 41:
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
          case 58:
          case 59:
          case 60:
          case 61:
          case 62:
          case 63:
          case 64:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 123:
          case 124:
          case 125:
          case 126:
            return !0;
          default:
            return !1;
        }
      }
      function _(e) {
        return e.trim().replace(/\s+/g, " ").toUpperCase();
      }
      var w = Object.prototype.hasOwnProperty,
        C = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g,
        S = /&([a-z#][a-z0-9]{1,31});/gi,
        k = new RegExp(C.source + "|" + S.source, "gi"),
        x = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i,
        E = n(47),
        T = /[&<>"]/,
        A = /[&<>"]/g,
        O = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" },
        P = /[.?*+^$[\]\\(){}|-]/g,
        I = n(39);
      (t.lib = {}),
        (t.lib.mdurl = n(51)),
        (t.lib.ucmicro = n(269)),
        (t.assign = s),
        (t.isString = i),
        (t.has = o),
        (t.unescapeMd = p),
        (t.unescapeAll = d),
        (t.isValidEntityCode = l),
        (t.fromCodePoint = c),
        (t.escapeHtml = f),
        (t.arrayReplaceAt = a),
        (t.isSpace = g),
        (t.isWhiteSpace = y),
        (t.isMdAsciiPunct = b),
        (t.isPunctChar = v),
        (t.escapeRE = m),
        (t.normalizeReference = _);
    },
    function (e, t, n) {
      "use strict";
      e.exports = n(196);
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(38),
        o = n(8),
        s = n(64),
        a = n(37),
        l = (function (e) {
          function t(n, r, i) {
            switch (
              (e.call(this),
              (this.syncErrorValue = null),
              (this.syncErrorThrown = !1),
              (this.syncErrorThrowable = !1),
              (this.isStopped = !1),
              arguments.length)
            ) {
              case 0:
                this.destination = s.empty;
                break;
              case 1:
                if (!n) {
                  this.destination = s.empty;
                  break;
                }
                if ("object" == typeof n) {
                  n instanceof t
                    ? ((this.destination = n), this.destination.add(this))
                    : ((this.syncErrorThrowable = !0),
                      (this.destination = new c(this, n)));
                  break;
                }
              default:
                (this.syncErrorThrowable = !0),
                  (this.destination = new c(this, n, r, i));
            }
          }
          return (
            r(t, e),
            (t.prototype[a.rxSubscriber] = function () {
              return this;
            }),
            (t.create = function (e, n, r) {
              var i = new t(e, n, r);
              return (i.syncErrorThrowable = !1), i;
            }),
            (t.prototype.next = function (e) {
              this.isStopped || this._next(e);
            }),
            (t.prototype.error = function (e) {
              this.isStopped || ((this.isStopped = !0), this._error(e));
            }),
            (t.prototype.complete = function () {
              this.isStopped || ((this.isStopped = !0), this._complete());
            }),
            (t.prototype.unsubscribe = function () {
              this.closed ||
                ((this.isStopped = !0), e.prototype.unsubscribe.call(this));
            }),
            (t.prototype._next = function (e) {
              this.destination.next(e);
            }),
            (t.prototype._error = function (e) {
              this.destination.error(e), this.unsubscribe();
            }),
            (t.prototype._complete = function () {
              this.destination.complete(), this.unsubscribe();
            }),
            (t.prototype._unsubscribeAndRecycle = function () {
              var e = this,
                t = e._parent,
                n = e._parents;
              return (
                (this._parent = null),
                (this._parents = null),
                this.unsubscribe(),
                (this.closed = !1),
                (this.isStopped = !1),
                (this._parent = t),
                (this._parents = n),
                this
              );
            }),
            t
          );
        })(o.Subscription);
      t.Subscriber = l;
      var c = (function (e) {
        function t(t, n, r, o) {
          e.call(this), (this._parentSubscriber = t);
          var a,
            l = this;
          i.isFunction(n)
            ? (a = n)
            : n &&
              ((a = n.next),
              (r = n.error),
              (o = n.complete),
              n !== s.empty &&
                ((l = Object.create(n)),
                i.isFunction(l.unsubscribe) && this.add(l.unsubscribe.bind(l)),
                (l.unsubscribe = this.unsubscribe.bind(this)))),
            (this._context = l),
            (this._next = a),
            (this._error = r),
            (this._complete = o);
        }
        return (
          r(t, e),
          (t.prototype.next = function (e) {
            if (!this.isStopped && this._next) {
              var t = this._parentSubscriber;
              t.syncErrorThrowable
                ? this.__tryOrSetError(t, this._next, e) && this.unsubscribe()
                : this.__tryOrUnsub(this._next, e);
            }
          }),
          (t.prototype.error = function (e) {
            if (!this.isStopped) {
              var t = this._parentSubscriber;
              if (this._error)
                t.syncErrorThrowable
                  ? (this.__tryOrSetError(t, this._error, e),
                    this.unsubscribe())
                  : (this.__tryOrUnsub(this._error, e), this.unsubscribe());
              else {
                if (!t.syncErrorThrowable) throw (this.unsubscribe(), e);
                (t.syncErrorValue = e),
                  (t.syncErrorThrown = !0),
                  this.unsubscribe();
              }
            }
          }),
          (t.prototype.complete = function () {
            var e = this;
            if (!this.isStopped) {
              var t = this._parentSubscriber;
              if (this._complete) {
                var n = function () {
                  return e._complete.call(e._context);
                };
                t.syncErrorThrowable
                  ? (this.__tryOrSetError(t, n), this.unsubscribe())
                  : (this.__tryOrUnsub(n), this.unsubscribe());
              } else this.unsubscribe();
            }
          }),
          (t.prototype.__tryOrUnsub = function (e, t) {
            try {
              e.call(this._context, t);
            } catch (e) {
              throw (this.unsubscribe(), e);
            }
          }),
          (t.prototype.__tryOrSetError = function (e, t, n) {
            try {
              t.call(this._context, n);
            } catch (t) {
              return (e.syncErrorValue = t), (e.syncErrorThrown = !0), !0;
            }
            return !1;
          }),
          (t.prototype._unsubscribe = function () {
            var e = this._parentSubscriber;
            (this._context = null),
              (this._parentSubscriber = null),
              e.unsubscribe();
          }),
          t
        );
      })(l);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        function n() {
          this.constructor = e;
        }
        v(e, t),
          (e.prototype =
            null === t
              ? Object.create(t)
              : ((n.prototype = t.prototype), new n()));
      }
      function i(e, t) {
        var n = {};
        for (var r in e)
          Object.prototype.hasOwnProperty.call(e, r) &&
            t.indexOf(r) < 0 &&
            (n[r] = e[r]);
        if (null != e && "function" == typeof Object.getOwnPropertySymbols)
          for (
            var i = 0, r = Object.getOwnPropertySymbols(e);
            i < r.length;
            i++
          )
            t.indexOf(r[i]) < 0 && (n[r[i]] = e[r[i]]);
        return n;
      }
      function o(e, t, n, r) {
        var i,
          o = arguments.length,
          s =
            o < 3
              ? t
              : null === r
              ? (r = Object.getOwnPropertyDescriptor(t, n))
              : r;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, n, r);
        else
          for (var a = e.length - 1; a >= 0; a--)
            (i = e[a]) &&
              (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
        return o > 3 && s && Object.defineProperty(t, n, s), s;
      }
      function s(e, t) {
        return function (n, r) {
          t(n, r, e);
        };
      }
      function a(e, t) {
        if ("object" == typeof Reflect && "function" == typeof Reflect.metadata)
          return Reflect.metadata(e, t);
      }
      function l(e, t, n, r) {
        return new (n || (n = Promise))(function (i, o) {
          function s(e) {
            try {
              l(r.next(e));
            } catch (e) {
              o(e);
            }
          }
          function a(e) {
            try {
              l(r.throw(e));
            } catch (e) {
              o(e);
            }
          }
          function l(e) {
            e.done
              ? i(e.value)
              : new n(function (t) {
                  t(e.value);
                }).then(s, a);
          }
          l((r = r.apply(e, t || [])).next());
        });
      }
      function c(e, t) {
        function n(e) {
          return function (t) {
            return r([e, t]);
          };
        }
        function r(n) {
          if (i) throw new TypeError("Generator is already executing.");
          for (; l; )
            try {
              if (
                ((i = 1),
                o &&
                  (s = o[2 & n[0] ? "return" : n[0] ? "throw" : "next"]) &&
                  !(s = s.call(o, n[1])).done)
              )
                return s;
              switch (((o = 0), s && (n = [0, s.value]), n[0])) {
                case 0:
                case 1:
                  s = n;
                  break;
                case 4:
                  return l.label++, { value: n[1], done: !1 };
                case 5:
                  l.label++, (o = n[1]), (n = [0]);
                  continue;
                case 7:
                  (n = l.ops.pop()), l.trys.pop();
                  continue;
                default:
                  if (
                    ((s = l.trys),
                    !(s = s.length > 0 && s[s.length - 1]) &&
                      (6 === n[0] || 2 === n[0]))
                  ) {
                    l = 0;
                    continue;
                  }
                  if (3 === n[0] && (!s || (n[1] > s[0] && n[1] < s[3]))) {
                    l.label = n[1];
                    break;
                  }
                  if (6 === n[0] && l.label < s[1]) {
                    (l.label = s[1]), (s = n);
                    break;
                  }
                  if (s && l.label < s[2]) {
                    (l.label = s[2]), l.ops.push(n);
                    break;
                  }
                  s[2] && l.ops.pop(), l.trys.pop();
                  continue;
              }
              n = t.call(e, l);
            } catch (e) {
              (n = [6, e]), (o = 0);
            } finally {
              i = s = 0;
            }
          if (5 & n[0]) throw n[1];
          return { value: n[0] ? n[1] : void 0, done: !0 };
        }
        var i,
          o,
          s,
          a,
          l = {
            label: 0,
            sent: function () {
              if (1 & s[0]) throw s[1];
              return s[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (a = { next: n(0), throw: n(1), return: n(2) }),
          "function" == typeof Symbol &&
            (a[Symbol.iterator] = function () {
              return this;
            }),
          a
        );
      }
      function u(e, t) {
        for (var n in e) t.hasOwnProperty(n) || (t[n] = e[n]);
      }
      function p(e) {
        var t = "function" == typeof Symbol && e[Symbol.iterator],
          n = 0;
        return t
          ? t.call(e)
          : {
              next: function () {
                return (
                  e && n >= e.length && (e = void 0),
                  { value: e && e[n++], done: !e }
                );
              },
            };
      }
      function d(e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n) return e;
        var r,
          i,
          o = n.call(e),
          s = [];
        try {
          for (; (void 0 === t || t-- > 0) && !(r = o.next()).done; )
            s.push(r.value);
        } catch (e) {
          i = { error: e };
        } finally {
          try {
            r && !r.done && (n = o.return) && n.call(o);
          } finally {
            if (i) throw i.error;
          }
        }
        return s;
      }
      function h() {
        for (var e = [], t = 0; t < arguments.length; t++)
          e = e.concat(d(arguments[t]));
        return e;
      }
      function f(e) {
        return this instanceof f ? ((this.v = e), this) : new f(e);
      }
      function m(e, t, n) {
        function r(e) {
          u[e] &&
            (c[e] = function (t) {
              return new Promise(function (n, r) {
                p.push([e, t, n, r]) > 1 || i(e, t);
              });
            });
        }
        function i(e, t) {
          try {
            o(u[e](t));
          } catch (e) {
            l(p[0][3], e);
          }
        }
        function o(e) {
          e.value instanceof f
            ? Promise.resolve(e.value.v).then(s, a)
            : l(p[0][2], e);
        }
        function s(e) {
          i("next", e);
        }
        function a(e) {
          i("throw", e);
        }
        function l(e, t) {
          e(t), p.shift(), p.length && i(p[0][0], p[0][1]);
        }
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var c,
          u = n.apply(e, t || []),
          p = [];
        return (
          (c = {}),
          r("next"),
          r("throw"),
          r("return"),
          (c[Symbol.asyncIterator] = function () {
            return this;
          }),
          c
        );
      }
      function g(e) {
        function t(t, i) {
          e[t] &&
            (n[t] = function (n) {
              return (r = !r)
                ? { value: f(e[t](n)), done: "return" === t }
                : i
                ? i(n)
                : n;
            });
        }
        var n, r;
        return (
          (n = {}),
          t("next"),
          t("throw", function (e) {
            throw e;
          }),
          t("return"),
          (n[Symbol.iterator] = function () {
            return this;
          }),
          n
        );
      }
      function y(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : "function" == typeof p
          ? p(e)
          : e[Symbol.iterator]();
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.__extends = r),
        n.d(t, "__assign", function () {
          return b;
        }),
        (t.__rest = i),
        (t.__decorate = o),
        (t.__param = s),
        (t.__metadata = a),
        (t.__awaiter = l),
        (t.__generator = c),
        (t.__exportStar = u),
        (t.__values = p),
        (t.__read = d),
        (t.__spread = h),
        (t.__await = f),
        (t.__asyncGenerator = m),
        (t.__asyncDelegator = g),
        (t.__asyncValues =
          y); /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
      var v =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (e, t) {
              e.__proto__ = t;
            }) ||
          function (e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
          },
        b =
          Object.assign ||
          function (e) {
            for (var t, n = 1, r = arguments.length; n < r; n++) {
              t = arguments[n];
              for (var i in t)
                Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
            }
            return e;
          };
    },
    function (e, t, n) {
      "use strict";
      (function (e) {
        var n = "undefined" != typeof window && window,
          r =
            "undefined" != typeof self &&
            "undefined" != typeof WorkerGlobalScope &&
            self instanceof WorkerGlobalScope &&
            self,
          i = void 0 !== e && e,
          o = n || i || r;
        (t.root = o),
          (function () {
            if (!o)
              throw new Error(
                "RxJS could not find any global context (window, self, global)",
              );
          })();
      }).call(t, n(15));
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(3),
        o = (function (e) {
          function t() {
            e.apply(this, arguments);
          }
          return (
            r(t, e),
            (t.prototype.notifyNext = function (e, t, n, r, i) {
              this.destination.next(t);
            }),
            (t.prototype.notifyError = function (e, t) {
              this.destination.error(e);
            }),
            (t.prototype.notifyComplete = function (e) {
              this.destination.complete();
            }),
            t
          );
        })(i.Subscriber);
      t.OuterSubscriber = o;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n, r) {
        var d = new u.InnerSubscriber(e, n, r);
        if (d.closed) return null;
        if (t instanceof l.Observable)
          return t._isScalar
            ? (d.next(t.value), d.complete(), null)
            : t.subscribe(d);
        if (o.isArrayLike(t)) {
          for (var h = 0, f = t.length; h < f && !d.closed; h++) d.next(t[h]);
          d.closed || d.complete();
        } else {
          if (s.isPromise(t))
            return (
              t
                .then(
                  function (e) {
                    d.closed || (d.next(e), d.complete());
                  },
                  function (e) {
                    return d.error(e);
                  },
                )
                .then(null, function (e) {
                  i.root.setTimeout(function () {
                    throw e;
                  });
                }),
              d
            );
          if (t && "function" == typeof t[c.iterator])
            for (var m = t[c.iterator](); ; ) {
              var g = m.next();
              if (g.done) {
                d.complete();
                break;
              }
              if ((d.next(g.value), d.closed)) break;
            }
          else if (t && "function" == typeof t[p.observable]) {
            var y = t[p.observable]();
            if ("function" == typeof y.subscribe)
              return y.subscribe(new u.InnerSubscriber(e, n, r));
            d.error(
              new TypeError(
                "Provided object does not correctly implement Symbol.observable",
              ),
            );
          } else {
            var v = a.isObject(t) ? "an invalid object" : "'" + t + "'",
              b =
                "You provided " +
                v +
                " where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.";
            d.error(new TypeError(b));
          }
        }
        return null;
      }
      var i = n(5),
        o = n(80),
        s = n(82),
        a = n(81),
        l = n(0),
        c = n(35),
        u = n(205),
        p = n(36);
      t.subscribeToResult = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e.reduce(function (e, t) {
          return e.concat(t instanceof c.UnsubscriptionError ? t.errors : t);
        }, []);
      }
      var i = n(22),
        o = n(81),
        s = n(38),
        a = n(14),
        l = n(11),
        c = n(259),
        u = (function () {
          function e(e) {
            (this.closed = !1),
              (this._parent = null),
              (this._parents = null),
              (this._subscriptions = null),
              e && (this._unsubscribe = e);
          }
          return (
            (e.prototype.unsubscribe = function () {
              var e,
                t = !1;
              if (!this.closed) {
                var n = this,
                  u = n._parent,
                  p = n._parents,
                  d = n._unsubscribe,
                  h = n._subscriptions;
                (this.closed = !0),
                  (this._parent = null),
                  (this._parents = null),
                  (this._subscriptions = null);
                for (var f = -1, m = p ? p.length : 0; u; )
                  u.remove(this), (u = (++f < m && p[f]) || null);
                if (s.isFunction(d)) {
                  var g = a.tryCatch(d).call(this);
                  g === l.errorObject &&
                    ((t = !0),
                    (e =
                      e ||
                      (l.errorObject.e instanceof c.UnsubscriptionError
                        ? r(l.errorObject.e.errors)
                        : [l.errorObject.e])));
                }
                if (i.isArray(h))
                  for (f = -1, m = h.length; ++f < m; ) {
                    var y = h[f];
                    if (o.isObject(y)) {
                      var g = a.tryCatch(y.unsubscribe).call(y);
                      if (g === l.errorObject) {
                        (t = !0), (e = e || []);
                        var v = l.errorObject.e;
                        v instanceof c.UnsubscriptionError
                          ? (e = e.concat(r(v.errors)))
                          : e.push(v);
                      }
                    }
                  }
                if (t) throw new c.UnsubscriptionError(e);
              }
            }),
            (e.prototype.add = function (t) {
              if (!t || t === e.EMPTY) return e.EMPTY;
              if (t === this) return this;
              var n = t;
              switch (typeof t) {
                case "function":
                  n = new e(t);
                case "object":
                  if (n.closed || "function" != typeof n.unsubscribe) return n;
                  if (this.closed) return n.unsubscribe(), n;
                  if ("function" != typeof n._addParent) {
                    var r = n;
                    (n = new e()), (n._subscriptions = [r]);
                  }
                  break;
                default:
                  throw new Error(
                    "unrecognized teardown " + t + " added to Subscription.",
                  );
              }
              return (
                (this._subscriptions || (this._subscriptions = [])).push(n),
                n._addParent(this),
                n
              );
            }),
            (e.prototype.remove = function (e) {
              var t = this._subscriptions;
              if (t) {
                var n = t.indexOf(e);
                -1 !== n && t.splice(n, 1);
              }
            }),
            (e.prototype._addParent = function (e) {
              var t = this,
                n = t._parent,
                r = t._parents;
              n && n !== e
                ? r
                  ? -1 === r.indexOf(e) && r.push(e)
                  : (this._parents = [e])
                : (this._parent = e);
            }),
            (e.EMPTY = (function (e) {
              return (e.closed = !0), e;
            })(new e())),
            e
          );
        })();
      t.Subscription = u;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return 1 === e.length ? e : v[e];
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i = n(4),
        o = n(2),
        s = n(30),
        a = n(24),
        l = n(13),
        c = n(110),
        u = n(12),
        p = n(16),
        d = n(18),
        h = n(106),
        f = n(107),
        m = n(108),
        g = (function (e) {
          function t(t) {
            var n = e.call(this, t) || this;
            (n.store = d.createStore()),
              (n.resizeListener = function () {
                return n.setSize();
              }),
              (n._handleCardAction = n.handleCardAction.bind(n)),
              (n._handleKeyDownCapture = n.handleKeyDownCapture.bind(n)),
              (n._saveChatviewPanelRef = n.saveChatviewPanelRef.bind(n)),
              (n._saveHistoryRef = n.saveHistoryRef.bind(n)),
              (n._saveShellRef = n.saveShellRef.bind(n)),
              u.log("BotChat.Chat props", t),
              n.store.dispatch({
                type: "Set_Locale",
                locale:
                  t.locale ||
                  window.navigator.userLanguage ||
                  window.navigator.language ||
                  "en",
              }),
              t.adaptiveCardsHostConfig &&
                n.store.dispatch({
                  type: "Set_AdaptiveCardsHostConfig",
                  payload: t.adaptiveCardsHostConfig,
                });
            var r = t.chatTitle;
            return (
              t.formatOptions &&
                (console.warn(
                  'DEPRECATED: "formatOptions.showHeader" is deprecated, use "chatTitle" instead. See https://github.com/Microsoft/BotFramework-WebChat/blob/master/CHANGELOG.md#formatoptionsshowheader-is-deprecated-use-chattitle-instead.',
                ),
                void 0 !== t.formatOptions.showHeader &&
                  void 0 === t.chatTitle &&
                  (r = t.formatOptions.showHeader)),
              void 0 !== r &&
                n.store.dispatch({ type: "Set_Chat_Title", chatTitle: r }),
              n.store.dispatch({
                type: "Toggle_Upload_Button",
                showUploadButton: !1 !== t.showUploadButton,
              }),
              t.sendTyping &&
                n.store.dispatch({
                  type: "Set_Send_Typing",
                  sendTyping: t.sendTyping,
                }),
              t.speechOptions &&
                (p.Speech.SpeechRecognizer.setSpeechRecognizer(
                  t.speechOptions.speechRecognizer,
                ),
                p.Speech.SpeechSynthesizer.setSpeechSynthesizer(
                  t.speechOptions.speechSynthesizer,
                )),
              n
            );
          }
          return (
            i.__extends(t, e),
            (t.prototype.handleIncomingActivity = function (e) {
              var t = this.store.getState();
              switch (e.type) {
                case "message":
                  this.store.dispatch({
                    type:
                      e.from.id === t.connection.user.id
                        ? "Receive_Sent_Message"
                        : "Receive_Message",
                    activity: e,
                  });
                  break;
                case "typing":
                  e.from.id !== t.connection.user.id &&
                    this.store.dispatch({ type: "Show_Typing", activity: e });
              }
            }),
            (t.prototype.setSize = function () {
              this.store.dispatch({
                type: "Set_Size",
                width: this.chatviewPanelRef.offsetWidth,
                height: this.chatviewPanelRef.offsetHeight,
              });
            }),
            (t.prototype.handleCardAction = function () {
              try {
                var e = s.findDOMNode(this.historyRef);
                e && e.focus();
              } catch (e) {}
            }),
            (t.prototype.handleKeyDownCapture = function (e) {
              var t = e.target,
                n = c.getTabIndex(t);
              if (
                !(
                  e.altKey ||
                  e.ctrlKey ||
                  e.metaKey ||
                  (!r(e.key) && "Backspace" !== e.key)
                ) &&
                (t === s.findDOMNode(this.historyRef) ||
                  "number" != typeof n ||
                  n < 0)
              ) {
                e.stopPropagation();
                var i = void 0;
                /(^|\s)Edge\/16\./.test(navigator.userAgent) && (i = r(e.key)),
                  this.shellRef && this.shellRef.focus(i);
              }
            }),
            (t.prototype.saveChatviewPanelRef = function (e) {
              this.chatviewPanelRef = e;
            }),
            (t.prototype.saveHistoryRef = function (e) {
              this.historyRef = e && e.getWrappedInstance();
            }),
            (t.prototype.saveShellRef = function (e) {
              this.shellRef = e && e.getWrappedInstance();
            }),
            (t.prototype.componentDidMount = function () {
              var e = this;
              this.setSize();
              var t = this.props.directLine
                ? (this.botConnection = new a.DirectLine(this.props.directLine))
                : this.props.botConnection;
              "window" === this.props.resize &&
                window.addEventListener("resize", this.resizeListener),
                this.store.dispatch({
                  type: "Start_Connection",
                  user: this.props.user,
                  bot: this.props.bot,
                  botConnection: t,
                  selectedActivity: this.props.selectedActivity,
                }),
                (this.connectionStatusSubscription =
                  t.connectionStatus$.subscribe(function (n) {
                    if (
                      e.props.speechOptions &&
                      e.props.speechOptions.speechRecognizer
                    ) {
                      var r = t.referenceGrammarId;
                      r &&
                        (e.props.speechOptions.speechRecognizer.referenceGrammarId =
                          r);
                    }
                    e.store.dispatch({
                      type: "Connection_Change",
                      connectionStatus: n,
                    });
                  })),
                (this.activitySubscription = t.activity$.subscribe(
                  function (t) {
                    return e.handleIncomingActivity(t);
                  },
                  function (e) {
                    return u.log("activity$ error", e);
                  },
                )),
                this.props.selectedActivity &&
                  (this.selectedActivitySubscription =
                    this.props.selectedActivity.subscribe(function (t) {
                      e.store.dispatch({
                        type: "Select_Activity",
                        selectedActivity:
                          t.activity ||
                          e.store
                            .getState()
                            .history.activities.find(function (e) {
                              return e.id === t.id;
                            }),
                      });
                    }));
            }),
            (t.prototype.componentWillUnmount = function () {
              this.connectionStatusSubscription.unsubscribe(),
                this.activitySubscription.unsubscribe(),
                this.selectedActivitySubscription &&
                  this.selectedActivitySubscription.unsubscribe(),
                this.botConnection && this.botConnection.end(),
                window.removeEventListener("resize", this.resizeListener);
            }),
            (t.prototype.componentWillReceiveProps = function (e) {
              this.props.adaptiveCardsHostConfig !==
                e.adaptiveCardsHostConfig &&
                this.store.dispatch({
                  type: "Set_AdaptiveCardsHostConfig",
                  payload: e.adaptiveCardsHostConfig,
                }),
                this.props.showUploadButton !== e.showUploadButton &&
                  this.store.dispatch({
                    type: "Toggle_Upload_Button",
                    showUploadButton: e.showUploadButton,
                  }),
                this.props.chatTitle !== e.chatTitle &&
                  this.store.dispatch({
                    type: "Set_Chat_Title",
                    chatTitle: e.chatTitle,
                  });
            }),
            (t.prototype.render = function () {
              var e = this.store.getState();
              return (
                u.log("BotChat.Chat state", e),
                o.createElement(
                  l.Provider,
                  { store: this.store },
                  o.createElement(
                    "div",
                    {
                      className: "wc-chatview-panel",
                      onKeyDownCapture: this._handleKeyDownCapture,
                      ref: this._saveChatviewPanelRef,
                    },
                    !!e.format.chatTitle &&
                      o.createElement(
                        "div",
                        { className: "wc-header" },
                        o.createElement(
                          "span",
                          null,
                          "string" == typeof e.format.chatTitle
                            ? e.format.chatTitle
                            : e.format.strings.title,
                        ),
                      ),
                    o.createElement(
                      f.MessagePane,
                      { disabled: this.props.disabled },
                      o.createElement(h.History, {
                        disabled: this.props.disabled,
                        onCardAction: this._handleCardAction,
                        ref: this._saveHistoryRef,
                      }),
                    ),
                    !this.props.disabled &&
                      o.createElement(m.Shell, {
                        autoFocus: !1 !== this.props.autoFocus,
                        ref: this._saveShellRef,
                      }),
                    "detect" === this.props.resize &&
                      o.createElement(y, { onresize: this.resizeListener }),
                  ),
                )
              );
            }),
            t
          );
        })(o.Component);
      (t.Chat = g),
        (t.doCardAction = function (e, n, r, i) {
          return function (o, s) {
            var a = "string" == typeof s ? s : void 0,
              l = "object" == typeof s ? s : void 0;
            switch (o) {
              case "imBack":
                "string" == typeof a && i(a, n, r);
                break;
              case "postBack":
                t.sendPostBack(e, a, l, n, r);
                break;
              case "call":
              case "openUrl":
              case "playAudio":
              case "playVideo":
              case "showImage":
              case "downloadFile":
                window.open(a);
                break;
              case "signin":
                var c = window.open();
                e.getSessionId
                  ? e.getSessionId().subscribe(
                      function (e) {
                        u.log("received sessionId: " + e),
                          (c.location.href =
                            a + encodeURIComponent("&code_challenge=" + e));
                      },
                      function (e) {
                        u.log("failed to get sessionId", e);
                      },
                    )
                  : (c.location.href = a);
                break;
              default:
                u.log("unknown button type", o);
            }
          };
        }),
        (t.sendPostBack = function (e, t, n, r, i) {
          e.postActivity({
            type: "message",
            text: t,
            value: n,
            from: r,
            locale: i,
            channelData: { postback: !0 },
          }).subscribe(
            function (e) {
              return u.log("success sending postBack", e);
            },
            function (e) {
              return u.log("failed to send postBack", e);
            },
          );
        }),
        (t.renderIfNonempty = function (e, t) {
          if (
            void 0 !== e &&
            null !== e &&
            ("string" != typeof e || e.length > 0)
          )
            return t(e);
        }),
        (t.classList = function () {
          for (var e = [], t = 0; t < arguments.length; t++)
            e[t] = arguments[t];
          return e.filter(Boolean).join(" ");
        });
      var y = function (e) {
          return o.createElement("iframe", {
            style: {
              border: "none",
              height: "100%",
              left: 0,
              margin: "1px 0 0",
              opacity: 0,
              pointerEvents: "none",
              position: "absolute",
              top: "-100%",
              visibility: "hidden",
              width: "100%",
            },
            ref: function (t) {
              t && (t.contentWindow.onresize = e.onresize);
            },
          });
        },
        v = {
          Add: "+",
          Decimal: ".",
          Divide: "/",
          Multiply: "*",
          Subtract: "-",
        };
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(0),
        o = n(3),
        s = n(8),
        a = n(79),
        l = n(207),
        c = n(37),
        u = (function (e) {
          function t(t) {
            e.call(this, t), (this.destination = t);
          }
          return r(t, e), t;
        })(o.Subscriber);
      t.SubjectSubscriber = u;
      var p = (function (e) {
        function t() {
          e.call(this),
            (this.observers = []),
            (this.closed = !1),
            (this.isStopped = !1),
            (this.hasError = !1),
            (this.thrownError = null);
        }
        return (
          r(t, e),
          (t.prototype[c.rxSubscriber] = function () {
            return new u(this);
          }),
          (t.prototype.lift = function (e) {
            var t = new d(this, this);
            return (t.operator = e), t;
          }),
          (t.prototype.next = function (e) {
            if (this.closed) throw new a.ObjectUnsubscribedError();
            if (!this.isStopped)
              for (
                var t = this.observers, n = t.length, r = t.slice(), i = 0;
                i < n;
                i++
              )
                r[i].next(e);
          }),
          (t.prototype.error = function (e) {
            if (this.closed) throw new a.ObjectUnsubscribedError();
            (this.hasError = !0), (this.thrownError = e), (this.isStopped = !0);
            for (
              var t = this.observers, n = t.length, r = t.slice(), i = 0;
              i < n;
              i++
            )
              r[i].error(e);
            this.observers.length = 0;
          }),
          (t.prototype.complete = function () {
            if (this.closed) throw new a.ObjectUnsubscribedError();
            this.isStopped = !0;
            for (
              var e = this.observers, t = e.length, n = e.slice(), r = 0;
              r < t;
              r++
            )
              n[r].complete();
            this.observers.length = 0;
          }),
          (t.prototype.unsubscribe = function () {
            (this.isStopped = !0), (this.closed = !0), (this.observers = null);
          }),
          (t.prototype._trySubscribe = function (t) {
            if (this.closed) throw new a.ObjectUnsubscribedError();
            return e.prototype._trySubscribe.call(this, t);
          }),
          (t.prototype._subscribe = function (e) {
            if (this.closed) throw new a.ObjectUnsubscribedError();
            return this.hasError
              ? (e.error(this.thrownError), s.Subscription.EMPTY)
              : this.isStopped
              ? (e.complete(), s.Subscription.EMPTY)
              : (this.observers.push(e), new l.SubjectSubscription(this, e));
          }),
          (t.prototype.asObservable = function () {
            var e = new i.Observable();
            return (e.source = this), e;
          }),
          (t.create = function (e, t) {
            return new d(e, t);
          }),
          t
        );
      })(i.Observable);
      t.Subject = p;
      var d = (function (e) {
        function t(t, n) {
          e.call(this), (this.destination = t), (this.source = n);
        }
        return (
          r(t, e),
          (t.prototype.next = function (e) {
            var t = this.destination;
            t && t.next && t.next(e);
          }),
          (t.prototype.error = function (e) {
            var t = this.destination;
            t && t.error && this.destination.error(e);
          }),
          (t.prototype.complete = function () {
            var e = this.destination;
            e && e.complete && this.destination.complete();
          }),
          (t.prototype._subscribe = function (e) {
            return this.source
              ? this.source.subscribe(e)
              : s.Subscription.EMPTY;
          }),
          t
        );
      })(p);
      t.AnonymousSubject = d;
    },
    function (e, t, n) {
      "use strict";
      t.errorObject = { e: {} };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.log = function (e) {
          for (var t = [], n = 1; n < arguments.length; n++)
            t[n - 1] = arguments[n];
          "undefined" != typeof window &&
            window.botchatDebug &&
            e &&
            console.log.apply(console, [e].concat(t));
        });
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(187),
        i = n(54),
        o = n(188);
      n.d(t, "Provider", function () {
        return r.a;
      }),
        n.d(t, "createProvider", function () {
          return r.b;
        }),
        n.d(t, "connectAdvanced", function () {
          return i.a;
        }),
        n.d(t, "connect", function () {
          return o.a;
        });
    },
    function (e, t, n) {
      "use strict";
      function r() {
        try {
          return o.apply(this, arguments);
        } catch (e) {
          return (s.errorObject.e = e), s.errorObject;
        }
      }
      function i(e) {
        return (o = e), r;
      }
      var o,
        s = n(11);
      t.tryCatch = i;
    },
    function (e, t) {
      var n;
      n = (function () {
        return this;
      })();
      try {
        n = n || Function("return this")() || (0, eval)("this");
      } catch (e) {
        "object" == typeof window && (n = window);
      }
      e.exports = n;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return (
          void 0 === t && (t = ["moz", "ms", "webkit"]),
          [""].concat(t).reduce(function (t, n) {
            return t || window[n + e];
          }, null)
        );
      }
      function i(e, t) {
        return new Promise(function (n, r) {
          var i = function () {
              e.removeEventListener(t, o), e.removeEventListener(t, s);
            },
            o = function (e) {
              i(), r(e);
            },
            s = function (e) {
              i(), n(e);
            };
          e.addEventListener(t, s), e.addEventListener("error", o);
        });
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var o = n(4),
        s = n(117);
      !(function (e) {
        var t = (function () {
          function e() {}
          return (
            (e.setSpeechRecognizer = function (t) {
              e.instance = t;
            }),
            (e.startRecognizing = function (t, n, r, i, s, a) {
              return (
                void 0 === t && (t = "en-US"),
                void 0 === r && (r = null),
                void 0 === i && (i = null),
                void 0 === s && (s = null),
                void 0 === a && (a = null),
                o.__awaiter(this, void 0, void 0, function () {
                  return o.__generator(this, function (o) {
                    switch (o.label) {
                      case 0:
                        return e.speechIsAvailable()
                          ? t && e.instance.locale !== t
                            ? [4, e.instance.stopRecognizing()]
                            : [3, 2]
                          : [2];
                      case 1:
                        o.sent(), (e.instance.locale = t), (o.label = 2);
                      case 2:
                        return (
                          e.instance.setGrammars(n),
                          e.alreadyRecognizing()
                            ? [4, e.stopRecognizing()]
                            : [3, 4]
                        );
                      case 3:
                        o.sent(), (o.label = 4);
                      case 4:
                        return (
                          (e.instance.onIntermediateResult = r),
                          (e.instance.onFinalResult = i),
                          (e.instance.onAudioStreamingToService = s),
                          (e.instance.onRecognitionFailed = a),
                          [4, e.instance.startRecognizing()]
                        );
                      case 5:
                        return o.sent(), [2];
                    }
                  });
                })
              );
            }),
            (e.stopRecognizing = function () {
              return o.__awaiter(this, void 0, void 0, function () {
                return o.__generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return e.speechIsAvailable()
                        ? [4, e.instance.stopRecognizing()]
                        : [2];
                    case 1:
                      return t.sent(), [2];
                  }
                });
              });
            }),
            (e.warmup = function () {
              e.speechIsAvailable() && e.instance.warmup();
            }),
            (e.speechIsAvailable = function () {
              return null != e.instance && e.instance.speechIsAvailable();
            }),
            (e.alreadyRecognizing = function () {
              return !!e.instance && e.instance.isStreamingToService;
            }),
            e
          );
        })();
        (t.instance = null), (e.SpeechRecognizer = t);
        var n = (function () {
          function e() {}
          return (
            (e.setSpeechSynthesizer = function (t) {
              e.instance = t;
            }),
            (e.speak = function (t, n, r, i) {
              void 0 === r && (r = null),
                void 0 === i && (i = null),
                null != e.instance && e.instance.speak(t, n, r, i);
            }),
            (e.stopSpeaking = function () {
              null != e.instance && e.instance.stopSpeaking();
            }),
            e
          );
        })();
        (n.instance = null), (e.SpeechSynthesizer = n);
        var a = (function () {
          function e() {
            var e = this;
            if (
              ((this.locale = null),
              (this.isStreamingToService = !1),
              (this.onIntermediateResult = null),
              (this.onFinalResult = null),
              (this.onAudioStreamingToService = null),
              (this.onRecognitionFailed = null),
              (this.recognizer = null),
              !window.webkitSpeechRecognition)
            )
              return void console.error(
                "This browser does not support speech recognition",
              );
            (this.recognizer = new window.webkitSpeechRecognition()),
              (this.recognizer.lang = "en-US"),
              (this.recognizer.interimResults = !0),
              (this.recognizer.onaudiostart = function () {
                e.onAudioStreamingToService && e.onAudioStreamingToService();
              }),
              (this.recognizer.onresult = function (t) {
                if (null != t.results && 0 !== t.length) {
                  var n = t.results[0];
                  if (!0 === n.isFinal && null != e.onFinalResult)
                    e.onFinalResult(n[0].transcript);
                  else if (!1 === n.isFinal && null != e.onIntermediateResult) {
                    for (var r = "", i = 0; i < t.results.length; ++i)
                      r += t.results[i][0].transcript;
                    e.onIntermediateResult(r);
                  }
                }
              }),
              (this.recognizer.onerror = function (t) {
                throw (e.onRecognitionFailed && e.onRecognitionFailed(), t);
              }),
              (this.recognizer.onend = function () {
                e.isStreamingToService = !1;
              });
          }
          return (
            (e.prototype.speechIsAvailable = function () {
              return null != this.recognizer;
            }),
            (e.prototype.warmup = function () {}),
            (e.prototype.startRecognizing = function () {
              return (
                (this.isStreamingToService = !0),
                this.recognizer.start(),
                i(this.recognizer, "start").then(function () {})
              );
            }),
            (e.prototype.stopRecognizing = function () {
              return this.isStreamingToService
                ? (this.recognizer.stop(),
                  i(this.recognizer, "end").then(function () {}))
                : Promise.resolve();
            }),
            (e.prototype.setGrammars = function (e) {
              void 0 === e && (e = []);
              var t = new (r("SpeechGrammarList"))();
              if (!t)
                return void (
                  e.length &&
                  console.warn(
                    "This browser does not support speech grammar list",
                  )
                );
              if (e.length) {
                var n = s.default("listenfor");
                n.public.rule("hint", e.join(" | ")),
                  t.addFromString(n.stringify()),
                  (this.recognizer.grammars = t);
              }
            }),
            e
          );
        })();
        e.BrowserSpeechRecognizer = a;
        var l = (function () {
          function e() {
            (this.lastOperation = null),
              (this.audioElement = null),
              (this.speakRequests = []);
          }
          return (
            (e.prototype.speak = function (e, t, n, r) {
              var i = this;
              if (
                (void 0 === n && (n = null),
                void 0 === r && (r = null),
                "SpeechSynthesisUtterance" in window && e)
              ) {
                if (null === this.audioElement) {
                  var o = document.createElement("audio");
                  (o.id = "player"), (o.autoplay = !0), (this.audioElement = o);
                }
                var s = new Array();
                if ("<" === e[0]) {
                  0 !== e.indexOf("<speak") &&
                    (e = "<speak>\n" + e + "\n</speak>\n");
                  var a = new DOMParser(),
                    l = a.parseFromString(e, "text/xml"),
                    u = l.documentElement.childNodes;
                  this.processNodes(u, s);
                } else s.push(e);
                var p = function () {
                    null !== r && r(),
                      i.speakRequests.length &&
                        (i.speakRequests[0].completed(),
                        i.speakRequests.splice(0, 1)),
                      i.speakRequests.length &&
                        i.playNextTTS(i.speakRequests[0], 0);
                  },
                  d = new c(
                    s,
                    t,
                    function (e) {
                      i.lastOperation = e;
                    },
                    n,
                    p,
                  );
                0 === this.speakRequests.length
                  ? ((this.speakRequests = [d]),
                    this.playNextTTS(this.speakRequests[0], 0))
                  : this.speakRequests.push(d);
              }
            }),
            (e.prototype.stopSpeaking = function () {
              if (
                "SpeechSynthesisUtterance" in window != !1 &&
                this.speakRequests.length
              ) {
                this.audioElement && this.audioElement.pause(),
                  this.speakRequests.forEach(function (e) {
                    e.abandon();
                  }),
                  (this.speakRequests = []);
                var e = window.speechSynthesis;
                (e.speaking || e.pending) &&
                  (this.lastOperation && (this.lastOperation.onend = null),
                  e.cancel());
              }
            }),
            (e.prototype.playNextTTS = function (e, t) {
              var n = this,
                r = function () {
                  n.playNextTTS(e, t + 1);
                };
              if (t < e.speakChunks.length) {
                var i = e.speakChunks[t];
                if ("number" == typeof i) setTimeout(r, i);
                else if (0 === i.indexOf("http")) {
                  var o = this.audioElement;
                  (o.src = i), (o.onended = r), (o.onerror = r), o.play();
                } else {
                  var s = new SpeechSynthesisUtterance();
                  (s.text = i),
                    (s.lang = e.lang),
                    (s.onstart = 0 === t ? e.onSpeakingStarted : null),
                    (s.onend = r),
                    (s.onerror = r),
                    e.onSpeakQueued && e.onSpeakQueued(s),
                    window.speechSynthesis.speak(s);
                }
              } else e.onSpeakingFinished && e.onSpeakingFinished();
            }),
            (e.prototype.processNodes = function (e, t) {
              for (var n = 0; n < e.length; n++) {
                var r = e[n];
                switch (r.nodeName) {
                  case "p":
                    this.processNodes(r.childNodes, t), t.push(250);
                    break;
                  case "break":
                    if (r.attributes.getNamedItem("strength")) {
                      var i = r.attributes.getNamedItem("strength").nodeValue;
                      "weak" === i ||
                        ("medium" === i
                          ? t.push(50)
                          : "strong" === i
                          ? t.push(100)
                          : "x-strong" === i && t.push(250));
                    } else
                      r.attributes.getNamedItem("time") &&
                        t.push(
                          JSON.parse(r.attributes.getNamedItem("time").value),
                        );
                    break;
                  case "audio":
                    r.attributes.getNamedItem("src") &&
                      t.push(r.attributes.getNamedItem("src").value);
                    break;
                  case "say-as":
                  case "prosody":
                  case "emphasis":
                  case "w":
                  case "phoneme":
                  case "voice":
                    this.processNodes(r.childNodes, t);
                    break;
                  default:
                    t.push(r.textContent);
                }
              }
            }),
            e
          );
        })();
        e.BrowserSpeechSynthesizer = l;
        var c = (function () {
          function e(e, t, n, r, i) {
            void 0 === n && (n = null),
              void 0 === r && (r = null),
              void 0 === i && (i = null),
              (this._onSpeakQueued = null),
              (this._onSpeakingStarted = null),
              (this._onSpeakingFinished = null),
              (this._speakChunks = []),
              (this._lang = null),
              (this._onSpeakQueued = n),
              (this._onSpeakingStarted = r),
              (this._onSpeakingFinished = i),
              (this._speakChunks = e),
              (this._lang = t);
          }
          return (
            (e.prototype.abandon = function () {
              this._speakChunks = [];
            }),
            (e.prototype.completed = function () {
              this._speakChunks = [];
            }),
            Object.defineProperty(e.prototype, "onSpeakQueued", {
              get: function () {
                return this._onSpeakQueued;
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(e.prototype, "onSpeakingStarted", {
              get: function () {
                return this._onSpeakingStarted;
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(e.prototype, "onSpeakingFinished", {
              get: function () {
                return this._onSpeakingFinished;
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(e.prototype, "speakChunks", {
              get: function () {
                return this._speakChunks;
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(e.prototype, "lang", {
              get: function () {
                return this._lang;
              },
              enumerable: !0,
              configurable: !0,
            }),
            e
          );
        })();
      })(t.Speech || (t.Speech = {}));
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      !(function (e) {
        (e[(e.Auto = 0)] = "Auto"),
          (e[(e.Stretch = 1)] = "Stretch"),
          (e[(e.Small = 2)] = "Small"),
          (e[(e.Medium = 3)] = "Medium"),
          (e[(e.Large = 4)] = "Large");
      })(t.Size || (t.Size = {}));
      !(function (e) {
        (e[(e.Small = 0)] = "Small"),
          (e[(e.Default = 1)] = "Default"),
          (e[(e.Medium = 2)] = "Medium"),
          (e[(e.Large = 3)] = "Large"),
          (e[(e.ExtraLarge = 4)] = "ExtraLarge");
      })(t.TextSize || (t.TextSize = {}));
      !(function (e) {
        (e[(e.None = 0)] = "None"),
          (e[(e.Small = 1)] = "Small"),
          (e[(e.Default = 2)] = "Default"),
          (e[(e.Medium = 3)] = "Medium"),
          (e[(e.Large = 4)] = "Large"),
          (e[(e.ExtraLarge = 5)] = "ExtraLarge"),
          (e[(e.Padding = 6)] = "Padding");
      })(t.Spacing || (t.Spacing = {}));
      !(function (e) {
        (e[(e.Lighter = 0)] = "Lighter"),
          (e[(e.Default = 1)] = "Default"),
          (e[(e.Bolder = 2)] = "Bolder");
      })(t.TextWeight || (t.TextWeight = {}));
      !(function (e) {
        (e[(e.Default = 0)] = "Default"),
          (e[(e.Dark = 1)] = "Dark"),
          (e[(e.Light = 2)] = "Light"),
          (e[(e.Accent = 3)] = "Accent"),
          (e[(e.Good = 4)] = "Good"),
          (e[(e.Warning = 5)] = "Warning"),
          (e[(e.Attention = 6)] = "Attention");
      })(t.TextColor || (t.TextColor = {}));
      !(function (e) {
        (e[(e.Left = 0)] = "Left"),
          (e[(e.Center = 1)] = "Center"),
          (e[(e.Right = 2)] = "Right");
      })(t.HorizontalAlignment || (t.HorizontalAlignment = {}));
      !(function (e) {
        (e[(e.Top = 0)] = "Top"),
          (e[(e.Center = 1)] = "Center"),
          (e[(e.Bottom = 2)] = "Bottom");
      })(t.VerticalAlignment || (t.VerticalAlignment = {}));
      !(function (e) {
        (e[(e.Left = 0)] = "Left"),
          (e[(e.Center = 1)] = "Center"),
          (e[(e.Right = 2)] = "Right"),
          (e[(e.Stretch = 3)] = "Stretch");
      })(t.ActionAlignment || (t.ActionAlignment = {}));
      !(function (e) {
        (e[(e.Default = 0)] = "Default"), (e[(e.Person = 1)] = "Person");
      })(t.ImageStyle || (t.ImageStyle = {}));
      !(function (e) {
        (e[(e.Inline = 0)] = "Inline"), (e[(e.Popup = 1)] = "Popup");
      })(t.ShowCardActionMode || (t.ShowCardActionMode = {}));
      !(function (e) {
        (e[(e.Horizontal = 0)] = "Horizontal"),
          (e[(e.Vertical = 1)] = "Vertical");
      })(t.Orientation || (t.Orientation = {}));
      !(function (e) {
        (e[(e.Stretch = 0)] = "Stretch"),
          (e[(e.RepeatHorizontally = 1)] = "RepeatHorizontally"),
          (e[(e.RepeatVertically = 2)] = "RepeatVertically"),
          (e[(e.Repeat = 3)] = "Repeat");
      })(t.BackgroundImageMode || (t.BackgroundImageMode = {}));
      !(function (e) {
        (e.Default = "default"), (e.Emphasis = "emphasis");
      })(t.ContainerStyle || (t.ContainerStyle = {}));
      !(function (e) {
        (e[(e.Hint = 0)] = "Hint"),
          (e[(e.ActionTypeNotAllowed = 1)] = "ActionTypeNotAllowed"),
          (e[(e.CollectionCantBeEmpty = 2)] = "CollectionCantBeEmpty"),
          (e[(e.Deprecated = 3)] = "Deprecated"),
          (e[(e.ElementTypeNotAllowed = 4)] = "ElementTypeNotAllowed"),
          (e[(e.InteractivityNotAllowed = 5)] = "InteractivityNotAllowed"),
          (e[(e.InvalidPropertyValue = 6)] = "InvalidPropertyValue"),
          (e[(e.MissingCardType = 7)] = "MissingCardType"),
          (e[(e.PropertyCantBeNull = 8)] = "PropertyCantBeNull"),
          (e[(e.TooManyActions = 9)] = "TooManyActions"),
          (e[(e.UnknownActionType = 10)] = "UnknownActionType"),
          (e[(e.UnknownElementType = 11)] = "UnknownElementType"),
          (e[(e.UnsupportedCardVersion = 12)] = "UnsupportedCardVersion");
      })(t.ValidationError || (t.ValidationError = {}));
      !(function (e) {
        (e[(e.FullyInContainer = 0)] = "FullyInContainer"),
          (e[(e.Overflowing = 1)] = "Overflowing"),
          (e[(e.FullyOutOfContainer = 2)] = "FullyOutOfContainer");
      })(t.ContainerFitStatus || (t.ContainerFitStatus = {}));
    },
    function (e, t, n) {
      "use strict";
      var r = this;
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i,
        o = n(4),
        s = n(19),
        a = n(24),
        l = n(12),
        c = n(16),
        u = n(109);
      !(function (e) {
        (e[(e.STOPPED = 0)] = "STOPPED"),
          (e[(e.STARTING = 1)] = "STARTING"),
          (e[(e.STARTED = 2)] = "STARTED"),
          (e[(e.STOPPING = 3)] = "STOPPING");
      })((i = t.ListeningState || (t.ListeningState = {}))),
        (t.sendMessage = function (e, t, n) {
          return {
            type: "Send_Message",
            activity: {
              type: "message",
              text: e,
              from: t,
              locale: n,
              textFormat: "plain",
              timestamp: new Date().toISOString(),
            },
          };
        }),
        (t.sendFiles = function (e, t, n) {
          return {
            type: "Send_Message",
            activity: {
              type: "message",
              attachments: p(e),
              from: t,
              locale: n,
            },
          };
        });
      var p = function (e) {
        for (var t = [], n = 0, r = e.length; n < r; n++) {
          var i = e[n];
          t.push({
            contentType: i.type,
            contentUrl: window.URL.createObjectURL(i),
            name: i.name,
          });
        }
        return t;
      };
      (t.shell = function (e, t) {
        switch (
          (void 0 === e &&
            (e = {
              input: "",
              sendTyping: !1,
              listeningState: i.STOPPED,
              lastInputViaSpeech: !1,
            }),
          t.type)
        ) {
          case "Update_Input":
            return o.__assign({}, e, {
              input: t.input,
              lastInputViaSpeech: "speech" === t.source,
            });
          case "Listening_Start":
            return o.__assign({}, e, { listeningState: i.STARTED });
          case "Listening_Stop":
            return o.__assign({}, e, { listeningState: i.STOPPED });
          case "Listening_Starting":
            return o.__assign({}, e, { listeningState: i.STARTING });
          case "Listening_Stopping":
            return o.__assign({}, e, { listeningState: i.STOPPING });
          case "Send_Message":
            return o.__assign({}, e, { input: "" });
          case "Set_Send_Typing":
            return o.__assign({}, e, { sendTyping: t.sendTyping });
          case "Card_Action_Clicked":
            return o.__assign({}, e, { lastInputViaSpeech: !1 });
          default:
            return e;
        }
      }),
        (t.format = function (e, t) {
          switch (
            (void 0 === e &&
              (e = {
                chatTitle: !0,
                locale: "en-us",
                showUploadButton: !0,
                strings: u.defaultStrings,
                carouselMargin: void 0,
              }),
            t.type)
          ) {
            case "Set_Chat_Title":
              return o.__assign({}, e, {
                chatTitle: void 0 === t.chatTitle || t.chatTitle,
              });
            case "Set_Locale":
              return o.__assign({}, e, {
                locale: t.locale,
                strings: u.strings(t.locale),
              });
            case "Set_Measurements":
              return o.__assign({}, e, { carouselMargin: t.carouselMargin });
            case "Toggle_Upload_Button":
              return o.__assign({}, e, {
                showUploadButton: t.showUploadButton,
              });
            default:
              return e;
          }
        }),
        (t.size = function (e, t) {
          switch (
            (void 0 === e && (e = { width: void 0, height: void 0 }), t.type)
          ) {
            case "Set_Size":
              return o.__assign({}, e, { width: t.width, height: t.height });
            default:
              return e;
          }
        }),
        (t.connection = function (e, t) {
          switch (
            (void 0 === e &&
              (e = {
                connectionStatus: a.ConnectionStatus.Uninitialized,
                botConnection: void 0,
                selectedActivity: void 0,
                user: void 0,
                bot: void 0,
              }),
            t.type)
          ) {
            case "Start_Connection":
              return o.__assign({}, e, {
                botConnection: t.botConnection,
                user: t.user,
                bot: t.bot,
                selectedActivity: t.selectedActivity,
              });
            case "Connection_Change":
              return o.__assign({}, e, {
                connectionStatus: t.connectionStatus,
              });
            default:
              return e;
          }
        });
      var d = function (e, t, n) {
        return e.slice(0, t).concat([n], e.slice(t + 1));
      };
      (t.history = function (e, t) {
        switch (
          (void 0 === e &&
            (e = {
              activities: [],
              clientActivityBase:
                Date.now().toString() +
                Math.random().toString().substr(1) +
                ".",
              clientActivityCounter: 0,
              selectedActivity: null,
            }),
          l.log("history action", t),
          t.type)
        ) {
          case "Receive_Sent_Message":
            if (t.activity.channelData && t.activity.channelData.postBack)
              return e;
            var n = e.activities.findIndex(function (e) {
              return (
                e.channelData &&
                e.channelData.clientActivityId ===
                  t.activity.channelData.clientActivityId
              );
            });
            if (-1 !== n) {
              var r = e.activities[n];
              return o.__assign({}, e, {
                activities: d(e.activities, n, r),
                selectedActivity:
                  e.selectedActivity === r ? t.activity : e.selectedActivity,
              });
            }
          case "Receive_Message":
            return e.activities.find(function (e) {
              return e.id === t.activity.id;
            })
              ? e
              : o.__assign({}, e, {
                  activities: e.activities
                    .filter(function (e) {
                      return "typing" !== e.type;
                    })
                    .concat(
                      [t.activity],
                      e.activities.filter(function (e) {
                        return (
                          e.from.id !== t.activity.from.id &&
                          "typing" === e.type
                        );
                      }),
                    ),
                });
          case "Send_Message":
            return o.__assign({}, e, {
              activities: e.activities
                .filter(function (e) {
                  return "typing" !== e.type;
                })
                .concat(
                  [
                    o.__assign({}, t.activity, {
                      timestamp: new Date().toISOString(),
                      channelData: {
                        clientActivityId:
                          e.clientActivityBase + e.clientActivityCounter,
                      },
                    }),
                  ],
                  e.activities.filter(function (e) {
                    return "typing" === e.type;
                  }),
                ),
              clientActivityCounter: e.clientActivityCounter + 1,
            });
          case "Send_Message_Retry":
            var i = e.activities.find(function (e) {
                return (
                  e.channelData &&
                  e.channelData.clientActivityId === t.clientActivityId
                );
              }),
              s = void 0 === i.id ? i : o.__assign({}, i, { id: void 0 });
            return o.__assign({}, e, {
              activities: e.activities
                .filter(function (e) {
                  return "typing" !== e.type && e !== i;
                })
                .concat(
                  [s],
                  e.activities.filter(function (e) {
                    return "typing" === e.type;
                  }),
                ),
              selectedActivity:
                e.selectedActivity === i ? s : e.selectedActivity,
            });
          case "Send_Message_Succeed":
          case "Send_Message_Fail":
            var a = e.activities.findIndex(function (e) {
              return (
                e.channelData &&
                e.channelData.clientActivityId === t.clientActivityId
              );
            });
            if (-1 === a) return e;
            var c = e.activities[a];
            if (c.id && "retry" !== c.id) return e;
            var u = o.__assign({}, c, {
              id: "Send_Message_Succeed" === t.type ? t.id : null,
            });
            return o.__assign({}, e, {
              activities: d(e.activities, a, u),
              clientActivityCounter: e.clientActivityCounter + 1,
              selectedActivity:
                e.selectedActivity === c ? u : e.selectedActivity,
            });
          case "Show_Typing":
            return o.__assign({}, e, {
              activities: e.activities
                .filter(function (e) {
                  return "typing" !== e.type;
                })
                .concat(
                  e.activities.filter(function (e) {
                    return (
                      e.from.id !== t.activity.from.id && "typing" === e.type
                    );
                  }),
                  [t.activity],
                ),
            });
          case "Clear_Typing":
            return o.__assign({}, e, {
              activities: e.activities.filter(function (e) {
                return e.id !== t.id;
              }),
              selectedActivity:
                e.selectedActivity && e.selectedActivity.id === t.id
                  ? null
                  : e.selectedActivity,
            });
          case "Select_Activity":
            return t.selectedActivity === e.selectedActivity
              ? e
              : o.__assign({}, e, { selectedActivity: t.selectedActivity });
          case "Take_SuggestedAction":
            var p = e.activities.findIndex(function (e) {
                return e === t.message;
              }),
              h = e.activities[p],
              f = o.__assign({}, h, { suggestedActions: void 0 });
            return o.__assign({}, e, {
              activities: d(e.activities, p, f),
              selectedActivity:
                e.selectedActivity === h ? f : e.selectedActivity,
            });
          default:
            return e;
        }
      }),
        (t.adaptiveCards = function (e, t) {
          switch ((void 0 === e && (e = { hostConfig: null }), t.type)) {
            case "Set_AdaptiveCardsHostConfig":
              return o.__assign({}, e, {
                hostConfig:
                  t.payload &&
                  (t.payload instanceof s.HostConfig
                    ? t.payload
                    : new s.HostConfig(t.payload)),
              });
            default:
              return e;
          }
        });
      var h = { type: null },
        f = function (e, t) {
          var n = e.speak;
          if (
            (((!n && null == e.textFormat) || "plain" === e.textFormat) &&
              (n = e.text),
            !n &&
              e.channelData &&
              e.channelData.speechOutput &&
              e.channelData.speechOutput.speakText &&
              (n = e.channelData.speechOutput.speakText),
            !n && e.attachments && e.attachments.length > 0)
          )
            for (var r = 0; r < e.attachments.length; r++) {
              var i = e;
              if (i.attachments[r].content && i.attachments[r].content.speak) {
                n = i.attachments[r].content.speak;
                break;
              }
            }
          return {
            type: "Speak_SSML",
            ssml: n,
            locale: e.locale || t,
            autoListenAfterSpeak:
              "expectingInput" === e.inputHint ||
              (e.channelData &&
                "WaitingForAnswerToQuestion" === e.channelData.botState),
          };
        },
        m = n(32),
        g = n(0);
      n(67),
        n(68),
        n(69),
        n(70),
        n(71),
        n(217),
        n(72),
        n(221),
        n(222),
        n(208),
        n(65),
        n(66);
      var y = function (e, t) {
          return e.ofType("Send_Message").map(function (e) {
            var n = t.getState();
            return {
              type: "Send_Message_Try",
              clientActivityId:
                n.history.clientActivityBase +
                (n.history.clientActivityCounter - 1),
            };
          });
        },
        v = function (e, t) {
          return e.ofType("Send_Message_Try").flatMap(function (e) {
            var n = t.getState(),
              r = e.clientActivityId,
              i = n.history.activities.find(function (e) {
                return e.channelData && e.channelData.clientActivityId === r;
              });
            if (!i)
              return (
                l.log("trySendMessage: activity not found"),
                g.Observable.empty()
              );
            if (1 === n.history.clientActivityCounter) {
              var o = {
                type: "ClientCapabilities",
                requiresBotState: !0,
                supportsTts: !0,
                supportsListening: !0,
              };
              i.entities = null == i.entities ? [o] : i.entities.concat([o]);
            }
            return n.connection.botConnection
              .postActivity(i)
              .map(function (e) {
                return {
                  type: "Send_Message_Succeed",
                  clientActivityId: r,
                  id: e,
                };
              })
              .catch(function (e) {
                return g.Observable.of({
                  type: "Send_Message_Fail",
                  clientActivityId: r,
                });
              });
          });
        },
        b = g.Observable.bindCallback(c.Speech.SpeechSynthesizer.speak),
        _ = function (e, t) {
          return e
            .ofType("Speak_SSML")
            .filter(function (e) {
              return e.ssml;
            })
            .mergeMap(function (e) {
              var t = null,
                n = function () {
                  return h;
                };
              return (
                e.autoListenAfterSpeak &&
                  ((t = function () {
                    return c.Speech.SpeechRecognizer.warmup();
                  }),
                  (n = function () {
                    return { type: "Listening_Starting" };
                  })),
                b(e.ssml, e.locale, t)
                  .map(n)
                  .catch(function (e) {
                    return g.Observable.of(h);
                  })
              );
            })
            .merge(
              e.ofType("Speak_SSML").map(function (e) {
                return { type: "Listening_Stopping" };
              }),
            );
        },
        w = function (e, t) {
          return e
            .ofType("Receive_Message")
            .filter(function (e) {
              return e.activity && t.getState().shell.lastInputViaSpeech;
            })
            .map(function (e) {
              return f(e.activity, t.getState().format.locale);
            });
        },
        C = function (e) {
          return e
            .ofType(
              "Update_Input",
              "Listening_Starting",
              "Send_Message",
              "Card_Action_Clicked",
              "Stop_Speaking",
            )
            .do(c.Speech.SpeechSynthesizer.stopSpeaking)
            .map(function (e) {
              return h;
            });
        },
        S = function (e, t) {
          return e
            .ofType("Listening_Stopping", "Card_Action_Clicked")
            .do(function () {
              return o.__awaiter(r, void 0, void 0, function () {
                return o.__generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, c.Speech.SpeechRecognizer.stopRecognizing()];
                    case 1:
                      return (
                        e.sent(), t.dispatch({ type: "Listening_Stop" }), [2]
                      );
                  }
                });
              });
            })
            .map(function (e) {
              return h;
            });
        },
        k = function (e, n) {
          return e
            .ofType("Listening_Starting")
            .do(function (e) {
              return o.__awaiter(r, void 0, void 0, function () {
                var e, r, i, s, a, l, u, p, d;
                return o.__generator(this, function (o) {
                  switch (o.label) {
                    case 0:
                      return (
                        (e = n.getState()),
                        (r = e.history.activities),
                        (i = e.format.locale),
                        (s = r
                          .slice()
                          .reverse()
                          .find(function (e) {
                            return "message" === e.type;
                          })),
                        (a = s && s.listenFor),
                        (l = function (e) {
                          n.dispatch({
                            type: "Update_Input",
                            input: e,
                            source: "speech",
                          });
                        }),
                        (u = function (e) {
                          (e = e.replace(/^[.\s]+|[.\s]+$/g, "")),
                            l(e),
                            n.dispatch({ type: "Listening_Stopping" }),
                            n.dispatch(
                              t.sendMessage(e, n.getState().connection.user, i),
                            );
                        }),
                        (p = function () {
                          n.dispatch({ type: "Listening_Start" });
                        }),
                        (d = function () {
                          n.dispatch({ type: "Listening_Stopping" });
                        }),
                        [
                          4,
                          c.Speech.SpeechRecognizer.startRecognizing(
                            i,
                            a,
                            l,
                            u,
                            p,
                            d,
                          ),
                        ]
                      );
                    case 1:
                      return o.sent(), [2];
                  }
                });
              });
            })
            .map(function (e) {
              return h;
            });
        },
        x = function (e, t) {
          var n = e.ofType("Update_Input", "Listening_Stopping");
          return e.ofType("Listening_Start").mergeMap(function (e) {
            return g.Observable.of({ type: "Listening_Stopping" })
              .delay(5e3)
              .takeUntil(n);
          });
        },
        E = function (e) {
          return e.ofType("Send_Message_Retry").map(function (e) {
            return {
              type: "Send_Message_Try",
              clientActivityId: e.clientActivityId,
            };
          });
        },
        T = function (e, t) {
          return e
            .ofType(
              "Send_Message_Succeed",
              "Send_Message_Fail",
              "Show_Typing",
              "Clear_Typing",
            )
            .map(function (e) {
              var n = t.getState();
              return (
                n.connection.selectedActivity &&
                  n.connection.selectedActivity.next({
                    activity: n.history.selectedActivity,
                  }),
                h
              );
            });
        },
        A = function (e) {
          return e
            .ofType("Show_Typing")
            .delay(3e3)
            .map(function (e) {
              return { type: "Clear_Typing", id: e.activity.id };
            });
        },
        O = function (e, t) {
          return e
            .ofType("Update_Input")
            .map(function (e) {
              return t.getState();
            })
            .filter(function (e) {
              return e.shell.sendTyping;
            })
            .throttleTime(3e3)
            .do(function (e) {
              return l.log("sending typing");
            })
            .flatMap(function (e) {
              return e.connection.botConnection
                .postActivity({ type: "typing", from: e.connection.user })
                .map(function (e) {
                  return h;
                })
                .catch(function (e) {
                  return g.Observable.of(h);
                });
            });
        },
        P = n(32),
        I = n(199);
      t.createStore = function () {
        return P.createStore(
          P.combineReducers({
            adaptiveCards: t.adaptiveCards,
            connection: t.connection,
            format: t.format,
            history: t.history,
            shell: t.shell,
            size: t.size,
          }),
          m.applyMiddleware(
            I.createEpicMiddleware(
              I.combineEpics(T, y, v, E, A, O, _, w, k, S, C, x),
            ),
          ),
        );
      };
    },
    function (e, t, n) {
      (function (t) {
        e.exports = t.AdaptiveCards = n(97);
      }).call(t, n(15));
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(0),
        o = n(73),
        s = n(21),
        a = n(83),
        l = (function (e) {
          function t(t, n) {
            e.call(this),
              (this.array = t),
              (this.scheduler = n),
              n ||
                1 !== t.length ||
                ((this._isScalar = !0), (this.value = t[0]));
          }
          return (
            r(t, e),
            (t.create = function (e, n) {
              return new t(e, n);
            }),
            (t.of = function () {
              for (var e = [], n = 0; n < arguments.length; n++)
                e[n - 0] = arguments[n];
              var r = e[e.length - 1];
              a.isScheduler(r) ? e.pop() : (r = null);
              var i = e.length;
              return i > 1
                ? new t(e, r)
                : 1 === i
                ? new o.ScalarObservable(e[0], r)
                : new s.EmptyObservable(r);
            }),
            (t.dispatch = function (e) {
              var t = e.array,
                n = e.index,
                r = e.count,
                i = e.subscriber;
              if (n >= r) return void i.complete();
              i.next(t[n]), i.closed || ((e.index = n + 1), this.schedule(e));
            }),
            (t.prototype._subscribe = function (e) {
              var n = this.array,
                r = n.length,
                i = this.scheduler;
              if (i)
                return i.schedule(t.dispatch, 0, {
                  array: n,
                  index: 0,
                  count: r,
                  subscriber: e,
                });
              for (var o = 0; o < r && !e.closed; o++) e.next(n[o]);
              e.complete();
            }),
            t
          );
        })(i.Observable);
      t.ArrayObservable = l;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(0),
        o = (function (e) {
          function t(t) {
            e.call(this), (this.scheduler = t);
          }
          return (
            r(t, e),
            (t.create = function (e) {
              return new t(e);
            }),
            (t.dispatch = function (e) {
              e.subscriber.complete();
            }),
            (t.prototype._subscribe = function (e) {
              var n = this.scheduler;
              if (n) return n.schedule(t.dispatch, 0, { subscriber: e });
              e.complete();
            }),
            t
          );
        })(i.Observable);
      t.EmptyObservable = o;
    },
    function (e, t, n) {
      "use strict";
      t.isArray =
        Array.isArray ||
        function (e) {
          return e && "number" == typeof e.length;
        };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(4),
        i = n(19),
        o = n(2),
        s = n(101),
        a = n(103),
        l = /\^application\/vnd\.microsoft\.card\./i;
      t.queryParams = function (e) {
        return e
          .substr(1)
          .split("&")
          .reduce(function (e, t) {
            var n = t.split("=");
            return (e[decodeURIComponent(n[0])] = decodeURIComponent(n[1])), e;
          }, {});
      };
      var c = function (e) {
          return Object.keys(e)
            .map(function (t) {
              return (
                encodeURIComponent(t) +
                "=" +
                encodeURIComponent(e[t].toString())
              );
            })
            .join("&");
        },
        u = function (e) {
          return null != e && void 0 !== e;
        },
        p = function (e) {
          return o.createElement("iframe", {
            src:
              "https://youtube.com/embed/" +
              e.embedId +
              "?" +
              c({
                modestbranding: "1",
                loop: e.loop ? "1" : "0",
                autoplay: e.autoPlay ? "1" : "0",
              }),
          });
        },
        d = function (e) {
          return o.createElement("iframe", {
            src:
              "https://player.vimeo.com/video/" +
              e.embedId +
              "?" +
              c({
                title: "0",
                byline: "0",
                portrait: "0",
                badge: "0",
                autoplay: e.autoPlay ? "1" : "0",
                loop: e.loop ? "1" : "0",
              }),
          });
        },
        h = function (e) {
          var n = document.createElement("a");
          n.href = e.src;
          var i = t.queryParams(n.search),
            s = n.pathname.substr(1).split("/");
          switch (n.hostname) {
            case "youtube.com":
            case "youtu.be":
            case "www.youtube.com":
            case "www.youtu.be":
              return o.createElement(p, {
                autoPlay: !e.disabled && e.autoPlay,
                embedId:
                  "youtube.com" === n.hostname ||
                  "www.youtube.com" === n.hostname
                    ? i.v
                    : s[s.length - 1],
                loop: e.loop,
              });
            case "www.vimeo.com":
            case "vimeo.com":
              return o.createElement(d, {
                autoPlay: !e.disabled && e.autoPlay,
                embedId: s[s.length - 1],
                loop: e.loop,
              });
            default:
              return o.createElement("video", r.__assign({ controls: !0 }, e));
          }
        },
        f = function (e) {
          switch (e.type) {
            case "video":
              return o.createElement(h, r.__assign({}, e));
            case "audio":
              return o.createElement(
                "audio",
                r.__assign({ controls: !0 }, e, {
                  autoPlay: !e.disabled && e.autoPlay,
                }),
              );
            default:
              return o.createElement("img", r.__assign({}, e));
          }
        },
        m = function (e) {
          return l.test(e.contentType)
            ? o.createElement(
                "span",
                null,
                e.format.strings.unknownCard.replace("%1", e.contentType),
              )
            : e.contentUrl
            ? o.createElement(
                "div",
                null,
                o.createElement(
                  "a",
                  {
                    className: "wc-link-download",
                    href: e.contentUrl,
                    target: "_blank",
                    title: e.contentUrl,
                  },
                  o.createElement(
                    "div",
                    { className: "wc-text-download" },
                    e.name ||
                      e.format.strings.unknownFile.replace("%1", e.contentType),
                  ),
                  o.createElement("div", { className: "wc-icon-download" }),
                ),
              )
            : o.createElement(
                "span",
                null,
                e.format.strings.unknownFile.replace("%1", e.contentType),
              );
        },
        g = function (e) {
          return "gif" ===
            e.slice(2 + ((e.lastIndexOf(".") - 1) >>> 0)).toLowerCase()
            ? "image"
            : "video";
        };
      t.AttachmentView = function (e) {
        if (e.attachment) {
          var t = e.attachment,
            n = function (t) {
              return (
                t &&
                !e.disabled &&
                function (n) {
                  e.onCardAction(t.type, t.value), n.stopPropagation();
                }
              );
            },
            r = function (t, n) {
              return n.media && 0 !== n.media.length
                ? n.media.map(function (r, i) {
                    var s = "string" == typeof t ? t : t(r.url);
                    return o.createElement(f, {
                      autoPlay: n.autostart,
                      disabled: e.disabled,
                      key: i,
                      loop: n.autoloop,
                      onLoad: e.onImageLoad,
                      poster: n.image && n.image.url,
                      src: r.url,
                      type: s,
                    });
                  })
                : null;
            };
          switch (t.contentType) {
            case "application/vnd.microsoft.card.hero":
              if (!t.content) return null;
              var l = new a.AdaptiveCardBuilder();
              return (
                t.content.images &&
                  t.content.images.forEach(function (e) {
                    return l.addImage(e.url, null, e.tap);
                  }),
                l.addCommon(t.content),
                o.createElement(s.default, {
                  className: "hero",
                  disabled: e.disabled,
                  nativeCard: l.card,
                  onCardAction: e.onCardAction,
                  onClick: n(t.content.tap),
                  onImageLoad: e.onImageLoad,
                })
              );
            case "application/vnd.microsoft.card.thumbnail":
              if (!t.content) return null;
              var c = new a.AdaptiveCardBuilder();
              if (t.content.images && t.content.images.length > 0) {
                var p = c.addColumnSet([75, 25]);
                c.addTextBlock(
                  t.content.title,
                  { size: i.TextSize.Medium, weight: i.TextWeight.Bolder },
                  p[0],
                ),
                  c.addTextBlock(
                    t.content.subtitle,
                    { isSubtle: !0, wrap: !0 },
                    p[0],
                  ),
                  c.addImage(
                    t.content.images[0].url,
                    p[1],
                    t.content.images[0].tap,
                  ),
                  c.addTextBlock(t.content.text, { wrap: !0 }),
                  c.addButtons(t.content.buttons);
              } else c.addCommon(t.content);
              return o.createElement(s.default, {
                className: "thumbnail",
                disabled: e.disabled,
                nativeCard: c.card,
                onCardAction: e.onCardAction,
                onClick: n(t.content.tap),
                onImageLoad: e.onImageLoad,
              });
            case "application/vnd.microsoft.card.video":
              return t.content &&
                t.content.media &&
                0 !== t.content.media.length
                ? o.createElement(
                    s.default,
                    {
                      className: "video",
                      disabled: e.disabled,
                      nativeCard: a.buildCommonCard(t.content),
                      onCardAction: e.onCardAction,
                    },
                    r("video", t.content),
                  )
                : null;
            case "application/vnd.microsoft.card.animation":
              return t.content &&
                t.content.media &&
                0 !== t.content.media.length
                ? o.createElement(
                    s.default,
                    {
                      className: "animation",
                      disabled: e.disabled,
                      onCardAction: e.onCardAction,
                      nativeCard: a.buildCommonCard(t.content),
                    },
                    r(g, t.content),
                  )
                : null;
            case "application/vnd.microsoft.card.audio":
              return t.content &&
                t.content.media &&
                0 !== t.content.media.length
                ? o.createElement(
                    s.default,
                    {
                      className: "audio",
                      disabled: e.disabled,
                      nativeCard: a.buildCommonCard(t.content),
                      onCardAction: e.onCardAction,
                    },
                    r("audio", t.content),
                  )
                : null;
            case "application/vnd.microsoft.card.signin":
              return t.content
                ? o.createElement(s.default, {
                    className: "signin",
                    disabled: e.disabled,
                    nativeCard: a.buildCommonCard(t.content),
                    onCardAction: e.onCardAction,
                  })
                : null;
            case "application/vnd.microsoft.card.oauth":
              return t.content
                ? o.createElement(s.default, {
                    className: "signin",
                    disabled: e.disabled,
                    nativeCard: a.buildOAuthCard(t.content),
                    onCardAction: e.onCardAction,
                  })
                : null;
            case "application/vnd.microsoft.card.receipt":
              if (!t.content) return null;
              var d = new a.AdaptiveCardBuilder();
              d.addTextBlock(t.content.title, {
                size: i.TextSize.Medium,
                weight: i.TextWeight.Bolder,
              });
              var h = d.addColumnSet([75, 25]);
              if (
                (t.content.facts &&
                  t.content.facts.map(function (e, t) {
                    d.addTextBlock(e.key, { size: i.TextSize.Medium }, h[0]),
                      d.addTextBlock(
                        e.value,
                        {
                          size: i.TextSize.Medium,
                          horizontalAlignment: i.HorizontalAlignment.Right,
                        },
                        h[1],
                      );
                  }),
                t.content.items &&
                  t.content.items.map(function (e, t) {
                    if (e.image) {
                      var n = d.addColumnSet([15, 75, 10]);
                      d.addImage(e.image.url, n[0], e.image.tap),
                        d.addTextBlock(
                          e.title,
                          {
                            size: i.TextSize.Medium,
                            weight: i.TextWeight.Bolder,
                            wrap: !0,
                          },
                          n[1],
                        ),
                        d.addTextBlock(
                          e.subtitle,
                          { size: i.TextSize.Medium, wrap: !0 },
                          n[1],
                        ),
                        d.addTextBlock(
                          e.price,
                          { horizontalAlignment: i.HorizontalAlignment.Right },
                          n[2],
                        );
                    } else {
                      var r = d.addColumnSet([75, 25]);
                      d.addTextBlock(
                        e.title,
                        {
                          size: i.TextSize.Medium,
                          weight: i.TextWeight.Bolder,
                          wrap: !0,
                        },
                        r[0],
                      ),
                        d.addTextBlock(
                          e.subtitle,
                          { size: i.TextSize.Medium, wrap: !0 },
                          r[0],
                        ),
                        d.addTextBlock(
                          e.price,
                          { horizontalAlignment: i.HorizontalAlignment.Right },
                          r[1],
                        );
                    }
                  }),
                u(t.content.vat))
              ) {
                var y = d.addColumnSet([75, 25]);
                d.addTextBlock(
                  e.format.strings.receiptVat,
                  { size: i.TextSize.Medium, weight: i.TextWeight.Bolder },
                  y[0],
                ),
                  d.addTextBlock(
                    t.content.vat,
                    { horizontalAlignment: i.HorizontalAlignment.Right },
                    y[1],
                  );
              }
              if (u(t.content.tax)) {
                var v = d.addColumnSet([75, 25]);
                d.addTextBlock(
                  e.format.strings.receiptTax,
                  { size: i.TextSize.Medium, weight: i.TextWeight.Bolder },
                  v[0],
                ),
                  d.addTextBlock(
                    t.content.tax,
                    { horizontalAlignment: i.HorizontalAlignment.Right },
                    v[1],
                  );
              }
              if (u(t.content.total)) {
                var b = d.addColumnSet([75, 25]);
                d.addTextBlock(
                  e.format.strings.receiptTotal,
                  { size: i.TextSize.Medium, weight: i.TextWeight.Bolder },
                  b[0],
                ),
                  d.addTextBlock(
                    t.content.total,
                    {
                      horizontalAlignment: i.HorizontalAlignment.Right,
                      size: i.TextSize.Medium,
                      weight: i.TextWeight.Bolder,
                    },
                    b[1],
                  );
              }
              return (
                d.addButtons(t.content.buttons),
                o.createElement(s.default, {
                  className: "receipt",
                  disabled: e.disabled,
                  nativeCard: d.card,
                  onCardAction: e.onCardAction,
                  onClick: n(t.content.tap),
                })
              );
            case "application/vnd.microsoft.card.adaptive":
              return t.content
                ? o.createElement(s.default, {
                    disabled: e.disabled,
                    jsonCard: t.content,
                    onCardAction: e.onCardAction,
                    onImageLoad: e.onImageLoad,
                  })
                : null;
            case "application/vnd.microsoft.card.flex":
              return t.content
                ? o.createElement(
                    s.default,
                    {
                      className: "flex",
                      disabled: e.disabled,
                      nativeCard: a.buildCommonCard(t.content),
                      onCardAction: e.onCardAction,
                    },
                    (function (t) {
                      return (
                        t &&
                        t.length > 0 &&
                        o.createElement(f, {
                          alt: t[0].alt,
                          disabled: e.disabled,
                          onClick: n(t[0].tap),
                          onLoad: e.onImageLoad,
                          src: t[0].url,
                        })
                      );
                    })(t.content.images),
                  )
                : null;
            case "image/svg+xml":
            case "image/png":
            case "image/jpg":
            case "image/jpeg":
            case "image/gif":
              return o.createElement(f, {
                disabled: e.disabled,
                onLoad: e.onImageLoad,
                src: t.contentUrl,
              });
            case "audio/mpeg":
            case "audio/mp4":
              return o.createElement(f, {
                disabled: e.disabled,
                src: t.contentUrl,
                type: "audio",
              });
            case "video/mp4":
              return o.createElement(f, {
                disabled: e.disabled,
                onLoad: e.onImageLoad,
                poster: t.thumbnailUrl,
                src: t.contentUrl,
                type: "video",
              });
            default:
              var _ = e.attachment;
              return o.createElement(m, {
                contentType: _.contentType,
                contentUrl: _.contentUrl,
                format: e.format,
                name: _.name,
              });
          }
        }
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(93);
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.DirectLine = t.ConnectionStatus = void 0);
      var i = r(n(95)),
        o = r(n(94)),
        s = r(n(91)),
        a = r(n(92)),
        l = r(n(40)),
        c = n(204),
        u = n(0);
      n(67),
        n(215),
        n(216),
        n(68),
        n(69),
        n(70),
        n(71),
        n(72),
        n(218),
        n(219),
        n(220),
        n(209),
        n(65),
        n(210),
        n(212),
        n(66),
        n(214);
      var p;
      (t.ConnectionStatus = p),
        (function (e) {
          (e[(e.Uninitialized = 0)] = "Uninitialized"),
            (e[(e.Connecting = 1)] = "Connecting"),
            (e[(e.Online = 2)] = "Online"),
            (e[(e.ExpiredToken = 3)] = "ExpiredToken"),
            (e[(e.FailedToConnect = 4)] = "FailedToConnect"),
            (e[(e.Ended = 5)] = "Ended");
        })(p || (t.ConnectionStatus = p = {}));
      var d = 200,
        h = new Error("expired token"),
        f = new Error("conversation ended"),
        m = new Error("failed to connect"),
        g = {
          log: function (e) {
            for (
              var t,
                n = arguments.length,
                r = new Array(n > 1 ? n - 1 : 0),
                i = 1;
              i < n;
              i++
            )
              r[i - 1] = arguments[i];
            "undefined" != typeof window &&
              window.botchatDebug &&
              e &&
              (t = console).log.apply(t, [e].concat(r));
          },
        },
        y = (function () {
          function e(t) {
            (0, s.default)(this, e),
              (0, l.default)(
                this,
                "connectionStatus$",
                new c.BehaviorSubject(p.Uninitialized),
              ),
              (0, l.default)(this, "activity$", void 0),
              (0, l.default)(
                this,
                "domain",
                "https://directline.botframework.com/v3/directline",
              ),
              (0, l.default)(this, "webSocket", void 0),
              (0, l.default)(this, "conversationId", void 0),
              (0, l.default)(this, "expiredTokenExhaustion", void 0),
              (0, l.default)(this, "secret", void 0),
              (0, l.default)(this, "token", void 0),
              (0, l.default)(this, "watermark", ""),
              (0, l.default)(this, "streamUrl", void 0),
              (0, l.default)(this, "_botAgent", ""),
              (0, l.default)(this, "_userAgent", void 0),
              (0, l.default)(this, "referenceGrammarId", void 0),
              (0, l.default)(this, "pollingInterval", 1e3),
              (0, l.default)(this, "tokenRefreshSubscription", void 0),
              (this.secret = t.secret),
              (this.token = t.secret || t.token),
              (this.webSocket =
                (void 0 === t.webSocket || t.webSocket) &&
                "undefined" != typeof WebSocket &&
                void 0 !== WebSocket),
              t.domain && (this.domain = t.domain),
              t.conversationId && (this.conversationId = t.conversationId),
              t.watermark && (this.watermark = t.watermark),
              t.streamUrl &&
                (t.token && t.conversationId
                  ? (this.streamUrl = t.streamUrl)
                  : console.warn(
                      "DirectLineJS: streamUrl was ignored: you need to provide a token and a conversationid",
                    )),
              (this._botAgent = this.getBotAgent(t.botAgent));
            var n = ~~t.pollingInterval;
            n < d
              ? void 0 !== t.pollingInterval &&
                console.warn(
                  "DirectLineJS: provided pollingInterval (".concat(
                    t.pollingInterval,
                    ") is under lower bound (200ms), using default of 1000ms",
                  ),
                )
              : (this.pollingInterval = n),
              (this.expiredTokenExhaustion = this.setConnectionStatusFallback(
                p.ExpiredToken,
                p.FailedToConnect,
                5,
              )),
              (this.activity$ = (
                this.webSocket
                  ? this.webSocketActivity$()
                  : this.pollingGetActivity$()
              ).share());
          }
          return (
            (0, a.default)(e, [
              {
                key: "checkConnection",
                value: function () {
                  var e = this,
                    t =
                      arguments.length > 0 &&
                      void 0 !== arguments[0] &&
                      arguments[0],
                    n = this.connectionStatus$
                      .flatMap(function (t) {
                        return t === p.Uninitialized
                          ? (e.connectionStatus$.next(p.Connecting),
                            e.token && e.streamUrl
                              ? (e.connectionStatus$.next(p.Online),
                                u.Observable.of(t))
                              : e
                                  .startConversation()
                                  .do(
                                    function (t) {
                                      (e.conversationId = t.conversationId),
                                        (e.token = e.secret || t.token),
                                        (e.streamUrl = t.streamUrl),
                                        (e.referenceGrammarId =
                                          t.referenceGrammarId),
                                        e.secret || e.refreshTokenLoop(),
                                        e.connectionStatus$.next(p.Online);
                                    },
                                    function (t) {
                                      e.connectionStatus$.next(
                                        p.FailedToConnect,
                                      );
                                    },
                                  )
                                  .map(function (e) {
                                    return t;
                                  }))
                          : u.Observable.of(t);
                      })
                      .filter(function (e) {
                        return e != p.Uninitialized && e != p.Connecting;
                      })
                      .flatMap(function (e) {
                        switch (e) {
                          case p.Ended:
                            return u.Observable.throw(f);
                          case p.FailedToConnect:
                            return u.Observable.throw(m);
                          case p.ExpiredToken:
                          default:
                            return u.Observable.of(e);
                        }
                      });
                  return t ? n.take(1) : n;
                },
              },
              {
                key: "setConnectionStatusFallback",
                value: function (e, t) {
                  var n =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : 5;
                  n--;
                  var r = 0,
                    i = null;
                  return function (o) {
                    return o === e && i === o && r >= n
                      ? ((r = 0), t)
                      : (r++, (i = o), o);
                  };
                },
              },
              {
                key: "expiredToken",
                value: function () {
                  var e = this.connectionStatus$.getValue();
                  e != p.Ended &&
                    e != p.FailedToConnect &&
                    this.connectionStatus$.next(p.ExpiredToken);
                  var t = this.expiredTokenExhaustion(
                    this.connectionStatus$.getValue(),
                  );
                  this.connectionStatus$.next(t);
                },
              },
              {
                key: "startConversation",
                value: function () {
                  var e = this.conversationId
                      ? ""
                          .concat(this.domain, "/conversations/")
                          .concat(this.conversationId, "?watermark=")
                          .concat(this.watermark)
                      : "".concat(this.domain, "/conversations"),
                    t = this.conversationId ? "GET" : "POST";
                  return u.Observable.ajax({
                    method: t,
                    url: e,
                    timeout: 2e4,
                    headers: (0, o.default)(
                      { Accept: "application/json" },
                      this.commonHeaders(),
                    ),
                  })
                    .map(function (e) {
                      return e.response;
                    })
                    .retryWhen(function (e) {
                      return e
                        .mergeMap(function (e) {
                          return e.status >= 400 && e.status < 600
                            ? u.Observable.throw(e)
                            : u.Observable.of(e);
                        })
                        .delay(2e4)
                        .take(45);
                    });
                },
              },
              {
                key: "refreshTokenLoop",
                value: function () {
                  var e = this;
                  this.tokenRefreshSubscription = u.Observable.interval(9e5)
                    .flatMap(function (t) {
                      return e.refreshToken();
                    })
                    .subscribe(function (t) {
                      g.log("refreshing token", t, "at", new Date()),
                        (e.token = t);
                    });
                },
              },
              {
                key: "refreshToken",
                value: function () {
                  var e = this;
                  return this.checkConnection(!0).flatMap(function (t) {
                    return u.Observable.ajax({
                      method: "POST",
                      url: "".concat(e.domain, "/tokens/refresh"),
                      timeout: 2e4,
                      headers: (0, o.default)({}, e.commonHeaders()),
                    })
                      .map(function (e) {
                        return e.response.token;
                      })
                      .retryWhen(function (t) {
                        return t
                          .mergeMap(function (t) {
                            return 403 === t.status
                              ? (e.expiredToken(), u.Observable.throw(t))
                              : 404 === t.status
                              ? u.Observable.throw(t)
                              : u.Observable.of(t);
                          })
                          .delay(2e4)
                          .take(45);
                      });
                  });
                },
              },
              {
                key: "reconnect",
                value: function (e) {
                  (this.token = e.token),
                    (this.streamUrl = e.streamUrl),
                    this.connectionStatus$.getValue() === p.ExpiredToken &&
                      this.connectionStatus$.next(p.Online);
                },
              },
              {
                key: "end",
                value: function () {
                  this.tokenRefreshSubscription &&
                    this.tokenRefreshSubscription.unsubscribe();
                  try {
                    this.connectionStatus$.next(p.Ended);
                  } catch (e) {
                    if (e === f) return;
                    throw e;
                  }
                },
              },
              {
                key: "getSessionId",
                value: function () {
                  var e = this;
                  return (
                    g.log("getSessionId"),
                    this.checkConnection(!0)
                      .flatMap(function (t) {
                        return u.Observable.ajax({
                          method: "GET",
                          url: "".concat(e.domain, "/session/getsessionid"),
                          withCredentials: !0,
                          timeout: 2e4,
                          headers: (0, o.default)(
                            { "Content-Type": "application/json" },
                            e.commonHeaders(),
                          ),
                        })
                          .map(function (e) {
                            return e && e.response && e.response.sessionId
                              ? (g.log(
                                  "getSessionId response: " +
                                    e.response.sessionId,
                                ),
                                e.response.sessionId)
                              : "";
                          })
                          .catch(function (e) {
                            return (
                              g.log("getSessionId error: " + e.status),
                              u.Observable.of("")
                            );
                          });
                      })
                      .catch(function (t) {
                        return e.catchExpiredToken(t);
                      })
                  );
                },
              },
              {
                key: "postActivity",
                value: function (e) {
                  var t = this;
                  return "message" === e.type &&
                    e.attachments &&
                    e.attachments.length > 0
                    ? this.postMessageWithAttachments(e)
                    : (g.log("postActivity", e),
                      this.checkConnection(!0)
                        .flatMap(function (n) {
                          return u.Observable.ajax({
                            method: "POST",
                            url: ""
                              .concat(t.domain, "/conversations/")
                              .concat(t.conversationId, "/activities"),
                            body: e,
                            timeout: 2e4,
                            headers: (0, o.default)(
                              { "Content-Type": "application/json" },
                              t.commonHeaders(),
                            ),
                          })
                            .map(function (e) {
                              return e.response.id;
                            })
                            .catch(function (e) {
                              return t.catchPostError(e);
                            });
                        })
                        .catch(function (e) {
                          return t.catchExpiredToken(e);
                        }));
                },
              },
              {
                key: "postMessageWithAttachments",
                value: function (e) {
                  var t,
                    n = this,
                    r = e.attachments,
                    s = (0, i.default)(e, ["attachments"]);
                  return this.checkConnection(!0)
                    .flatMap(function (e) {
                      return (
                        (t = new FormData()),
                        t.append(
                          "activity",
                          new Blob([JSON.stringify(s)], {
                            type: "application/vnd.microsoft.activity",
                          }),
                        ),
                        u.Observable.from(r || [])
                          .flatMap(function (e) {
                            return u.Observable.ajax({
                              method: "GET",
                              url: e.contentUrl,
                              responseType: "arraybuffer",
                            }).do(function (n) {
                              return t.append(
                                "file",
                                new Blob([n.response], { type: e.contentType }),
                                e.name,
                              );
                            });
                          })
                          .count()
                      );
                    })
                    .flatMap(function (e) {
                      return u.Observable.ajax({
                        method: "POST",
                        url: ""
                          .concat(n.domain, "/conversations/")
                          .concat(n.conversationId, "/upload?userId=")
                          .concat(s.from.id),
                        body: t,
                        timeout: 2e4,
                        headers: (0, o.default)({}, n.commonHeaders()),
                      })
                        .map(function (e) {
                          return e.response.id;
                        })
                        .catch(function (e) {
                          return n.catchPostError(e);
                        });
                    })
                    .catch(function (e) {
                      return n.catchPostError(e);
                    });
                },
              },
              {
                key: "catchPostError",
                value: function (e) {
                  if (403 === e.status) this.expiredToken();
                  else if (e.status >= 400 && e.status < 500)
                    return u.Observable.throw(e);
                  return u.Observable.of("retry");
                },
              },
              {
                key: "catchExpiredToken",
                value: function (e) {
                  return e === h
                    ? u.Observable.of("retry")
                    : u.Observable.throw(e);
                },
              },
              {
                key: "pollingGetActivity$",
                value: function () {
                  var e = this,
                    t = u.Observable.create(function (t) {
                      var n = new c.BehaviorSubject({});
                      n.subscribe(function () {
                        if (e.connectionStatus$.getValue() === p.Online) {
                          var r = Date.now();
                          u.Observable.ajax({
                            headers: (0, o.default)(
                              { Accept: "application/json" },
                              e.commonHeaders(),
                            ),
                            method: "GET",
                            url: ""
                              .concat(e.domain, "/conversations/")
                              .concat(
                                e.conversationId,
                                "/activities?watermark=",
                              )
                              .concat(e.watermark),
                            timeout: 2e4,
                          }).subscribe(
                            function (i) {
                              t.next(i),
                                setTimeout(
                                  function () {
                                    return n.next(null);
                                  },
                                  Math.max(
                                    0,
                                    e.pollingInterval - Date.now() + r,
                                  ),
                                );
                            },
                            function (r) {
                              switch (r.status) {
                                case 403:
                                  e.connectionStatus$.next(p.ExpiredToken),
                                    setTimeout(function () {
                                      return n.next(null);
                                    }, e.pollingInterval);
                                  break;
                                case 404:
                                  e.connectionStatus$.next(p.Ended);
                                  break;
                                default:
                                  t.error(r);
                              }
                            },
                          );
                        }
                      });
                    });
                  return this.checkConnection().flatMap(function (n) {
                    return t
                      .catch(function () {
                        return u.Observable.empty();
                      })
                      .map(function (e) {
                        return e.response;
                      })
                      .flatMap(function (t) {
                        return e.observableFromActivityGroup(t);
                      });
                  });
                },
              },
              {
                key: "observableFromActivityGroup",
                value: function (e) {
                  return (
                    e.watermark && (this.watermark = e.watermark),
                    u.Observable.from(e.activities)
                  );
                },
              },
              {
                key: "webSocketActivity$",
                value: function () {
                  var e = this;
                  return this.checkConnection()
                    .flatMap(function (t) {
                      return e.observableWebSocket().retryWhen(function (t) {
                        return t
                          .delay(e.getRetryDelay())
                          .mergeMap(function (t) {
                            return e.reconnectToConversation();
                          });
                      });
                    })
                    .flatMap(function (t) {
                      return e.observableFromActivityGroup(t);
                    });
                },
              },
              {
                key: "getRetryDelay",
                value: function () {
                  return Math.floor(3e3 + 12e3 * Math.random());
                },
              },
              {
                key: "observableWebSocket",
                value: function () {
                  var e = this;
                  return u.Observable.create(function (t) {
                    g.log("creating WebSocket", e.streamUrl);
                    var n,
                      r = new WebSocket(e.streamUrl);
                    return (
                      (r.onopen = function (e) {
                        g.log("WebSocket open", e),
                          (n = u.Observable.interval(2e4).subscribe(
                            function (e) {
                              try {
                                r.send("");
                              } catch (e) {
                                g.log("Ping error", e);
                              }
                            },
                          ));
                      }),
                      (r.onclose = function (e) {
                        g.log("WebSocket close", e),
                          n && n.unsubscribe(),
                          t.error(e);
                      }),
                      (r.onmessage = function (e) {
                        return e.data && t.next(JSON.parse(e.data));
                      }),
                      function () {
                        (0 !== r.readyState && 1 !== r.readyState) || r.close();
                      }
                    );
                  });
                },
              },
              {
                key: "reconnectToConversation",
                value: function () {
                  var e = this;
                  return this.checkConnection(!0).flatMap(function (t) {
                    return u.Observable.ajax({
                      method: "GET",
                      url: ""
                        .concat(e.domain, "/conversations/")
                        .concat(e.conversationId, "?watermark=")
                        .concat(e.watermark),
                      timeout: 2e4,
                      headers: (0, o.default)(
                        { Accept: "application/json" },
                        e.commonHeaders(),
                      ),
                    })
                      .do(function (t) {
                        e.secret || (e.token = t.response.token),
                          (e.streamUrl = t.response.streamUrl);
                      })
                      .map(function (e) {
                        return null;
                      })
                      .retryWhen(function (t) {
                        return t
                          .mergeMap(function (t) {
                            if (403 === t.status) e.expiredToken();
                            else if (404 === t.status)
                              return u.Observable.throw(f);
                            return u.Observable.of(t);
                          })
                          .delay(2e4)
                          .take(45);
                      });
                  });
                },
              },
              {
                key: "commonHeaders",
                value: function () {
                  return {
                    Authorization: "Bearer ".concat(this.token),
                    "x-ms-bot-agent": this._botAgent,
                  };
                },
              },
              {
                key: "getBotAgent",
                value: function () {
                  var e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : "",
                    t = "directlinejs";
                  return (
                    e && (t += "; ".concat(e)),
                    "".concat("DirectLine/3.0", " (").concat(t, ")")
                  );
                },
              },
            ]),
            e
          );
        })();
      t.DirectLine = y;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return e || t;
      }
      function i(e) {
        return void 0 === e || null === e || "" === e;
      }
      function o(e, t) {
        null != t && void 0 != t && e.appendChild(t);
      }
      function s(e, t, n) {
        if (i(t)) return n;
        for (var r in e) {
          if (parseInt(r, 10) >= 0) {
            var o = e[r];
            if (
              o &&
              "string" == typeof o &&
              o.toLowerCase() === t.toLowerCase()
            )
              return parseInt(r, 10);
          }
        }
        return n;
      }
      function a(e, t, n) {
        return "string" == typeof t
          ? s(e, t, n)
          : "number" == typeof t
          ? r(t, n)
          : n;
      }
      function l(e, t) {
        if (e.spacing > 0 || e.lineThickness > 0) {
          var n = document.createElement("div");
          return (
            t == f.Orientation.Horizontal
              ? e.lineThickness
                ? ((n.style.marginTop = e.spacing / 2 + "px"),
                  (n.style.paddingTop = e.spacing / 2 + "px"),
                  (n.style.borderTop =
                    e.lineThickness + "px solid " + c(e.lineColor)))
                : (n.style.height = e.spacing + "px")
              : e.lineThickness
              ? ((n.style.marginLeft = e.spacing / 2 + "px"),
                (n.style.paddingLeft = e.spacing / 2 + "px"),
                (n.style.borderLeft =
                  e.lineThickness + "px solid " + c(e.lineColor)))
              : (n.style.width = e.spacing + "px"),
            (n.style.overflow = "hidden"),
            n
          );
        }
        return null;
      }
      function c(e) {
        var t = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?/gi,
          n = t.exec(e);
        if (n && n[4]) {
          var r = parseInt(n[1], 16) / 255;
          return (
            "rgba(" +
            parseInt(n[2], 16) +
            "," +
            parseInt(n[3], 16) +
            "," +
            parseInt(n[4], 16) +
            "," +
            r +
            ")"
          );
        }
        return e;
      }
      function u(e, t, n) {
        var r = function () {
          return t - e.scrollHeight >= -1;
        };
        if (!r()) {
          for (
            var i = e.innerHTML,
              o = function (t) {
                e.innerHTML = i.substring(0, t) + "...";
              },
              s = p(i),
              a = 0,
              l = s.length,
              c = 0;
            a < l;

          ) {
            var u = Math.floor((a + l) / 2);
            o(s[u]), r() ? ((c = s[u]), (a = u + 1)) : (l = u);
          }
          if ((o(c), n && t - e.scrollHeight >= n - 1)) {
            for (var h = d(i, c); h < i.length && (o(h), r()); )
              (c = h), (h = d(i, h));
            o(c);
          }
        }
      }
      function p(e) {
        for (var t = [], n = d(e, -1); n < e.length; )
          " " == e[n] && t.push(n), (n = d(e, n));
        return t;
      }
      function d(e, t) {
        for (t += 1; t < e.length && "<" == e[t]; )
          for (; t < e.length && ">" != e[t++]; );
        return t;
      }
      function h(e, t) {
        var n = e.offsetTop;
        return n + e.clientHeight <= t
          ? f.ContainerFitStatus.FullyInContainer
          : n < t
          ? f.ContainerFitStatus.Overflowing
          : f.ContainerFitStatus.FullyOutOfContainer;
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var f = n(17);
      (t.ContentTypes = {
        applicationJson: "application/json",
        applicationXWwwFormUrlencoded: "application/x-www-form-urlencoded",
      }),
        (t.getValueOrDefault = r),
        (t.isNullOrEmpty = i),
        (t.appendChild = o),
        (t.getEnumValueOrDefault = s),
        (t.parseHostConfigEnum = a),
        (t.renderSeparation = l),
        (t.stringToCssColor = c);
      var m = (function () {
        function e() {
          (this._isProcessed = !1),
            (this._original = null),
            (this._processed = null);
        }
        return (
          (e.prototype.substituteInputValues = function (e, n) {
            this._processed = this._original;
            for (
              var r, i = /\{{2}([a-z0-9_$@]+).value\}{2}/gi;
              null != (r = i.exec(this._original));

            ) {
              for (var o = null, s = 0; s < e.length; s++)
                if (e[s].id.toLowerCase() == r[1].toLowerCase()) {
                  o = e[s];
                  break;
                }
              if (o) {
                var a = "";
                o.value && (a = o.value),
                  n === t.ContentTypes.applicationJson
                    ? ((a = JSON.stringify(a)), (a = a.slice(1, -1)))
                    : n === t.ContentTypes.applicationXWwwFormUrlencoded &&
                      (a = encodeURIComponent(a)),
                  (this._processed = this._processed.replace(r[0], a));
              }
            }
            this._isProcessed = !0;
          }),
          (e.prototype.get = function () {
            return this._isProcessed ? this._processed : this._original;
          }),
          (e.prototype.set = function (e) {
            (this._original = e), (this._isProcessed = !1);
          }),
          e
        );
      })();
      (t.StringWithSubstitutions = m), (t.truncate = u), (t.getFitStatus = h);
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = function (e, t) {
          if (!t) throw new TypeError("illegal rule token");
          return "<" + e + "> = " + t;
        });
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        if (!n.i(s.a)(e) || n.i(i.a)(e) != a) return !1;
        var t = n.i(o.a)(e);
        if (null === t) return !0;
        var r = p.call(t, "constructor") && t.constructor;
        return "function" == typeof r && r instanceof r && u.call(r) == d;
      }
      var i = n(127),
        o = n(129),
        s = n(134),
        a = "[object Object]",
        l = Function.prototype,
        c = Object.prototype,
        u = l.toString,
        p = c.hasOwnProperty,
        d = u.call(Object);
      t.a = r;
    },
    function (e, t, n) {
      "use strict";
      function r() {
        (this.__rules__ = []), (this.__cache__ = null);
      }
      (r.prototype.__find__ = function (e) {
        for (var t = 0; t < this.__rules__.length; t++)
          if (this.__rules__[t].name === e) return t;
        return -1;
      }),
        (r.prototype.__compile__ = function () {
          var e = this,
            t = [""];
          e.__rules__.forEach(function (e) {
            e.enabled &&
              e.alt.forEach(function (e) {
                t.indexOf(e) < 0 && t.push(e);
              });
          }),
            (e.__cache__ = {}),
            t.forEach(function (t) {
              (e.__cache__[t] = []),
                e.__rules__.forEach(function (n) {
                  n.enabled &&
                    ((t && n.alt.indexOf(t) < 0) || e.__cache__[t].push(n.fn));
                });
            });
        }),
        (r.prototype.at = function (e, t, n) {
          var r = this.__find__(e),
            i = n || {};
          if (-1 === r) throw new Error("Parser rule not found: " + e);
          (this.__rules__[r].fn = t),
            (this.__rules__[r].alt = i.alt || []),
            (this.__cache__ = null);
        }),
        (r.prototype.before = function (e, t, n, r) {
          var i = this.__find__(e),
            o = r || {};
          if (-1 === i) throw new Error("Parser rule not found: " + e);
          this.__rules__.splice(i, 0, {
            name: t,
            enabled: !0,
            fn: n,
            alt: o.alt || [],
          }),
            (this.__cache__ = null);
        }),
        (r.prototype.after = function (e, t, n, r) {
          var i = this.__find__(e),
            o = r || {};
          if (-1 === i) throw new Error("Parser rule not found: " + e);
          this.__rules__.splice(i + 1, 0, {
            name: t,
            enabled: !0,
            fn: n,
            alt: o.alt || [],
          }),
            (this.__cache__ = null);
        }),
        (r.prototype.push = function (e, t, n) {
          var r = n || {};
          this.__rules__.push({
            name: e,
            enabled: !0,
            fn: t,
            alt: r.alt || [],
          }),
            (this.__cache__ = null);
        }),
        (r.prototype.enable = function (e, t) {
          Array.isArray(e) || (e = [e]);
          var n = [];
          return (
            e.forEach(function (e) {
              var r = this.__find__(e);
              if (r < 0) {
                if (t) return;
                throw new Error("Rules manager: invalid rule name " + e);
              }
              (this.__rules__[r].enabled = !0), n.push(e);
            }, this),
            (this.__cache__ = null),
            n
          );
        }),
        (r.prototype.enableOnly = function (e, t) {
          Array.isArray(e) || (e = [e]),
            this.__rules__.forEach(function (e) {
              e.enabled = !1;
            }),
            this.enable(e, t);
        }),
        (r.prototype.disable = function (e, t) {
          Array.isArray(e) || (e = [e]);
          var n = [];
          return (
            e.forEach(function (e) {
              var r = this.__find__(e);
              if (r < 0) {
                if (t) return;
                throw new Error("Rules manager: invalid rule name " + e);
              }
              (this.__rules__[r].enabled = !1), n.push(e);
            }, this),
            (this.__cache__ = null),
            n
          );
        }),
        (r.prototype.getRules = function (e) {
          return (
            null === this.__cache__ && this.__compile__(),
            this.__cache__[e] || []
          );
        }),
        (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        (this.type = e),
          (this.tag = t),
          (this.attrs = null),
          (this.map = null),
          (this.nesting = n),
          (this.level = 0),
          (this.children = null),
          (this.content = ""),
          (this.markup = ""),
          (this.info = ""),
          (this.meta = null),
          (this.block = !1),
          (this.hidden = !1);
      }
      (r.prototype.attrIndex = function (e) {
        var t, n, r;
        if (!this.attrs) return -1;
        for (t = this.attrs, n = 0, r = t.length; n < r; n++)
          if (t[n][0] === e) return n;
        return -1;
      }),
        (r.prototype.attrPush = function (e) {
          this.attrs ? this.attrs.push(e) : (this.attrs = [e]);
        }),
        (r.prototype.attrSet = function (e, t) {
          var n = this.attrIndex(e),
            r = [e, t];
          n < 0 ? this.attrPush(r) : (this.attrs[n] = r);
        }),
        (r.prototype.attrGet = function (e) {
          var t = this.attrIndex(e),
            n = null;
          return t >= 0 && (n = this.attrs[t][1]), n;
        }),
        (r.prototype.attrJoin = function (e, t) {
          var n = this.attrIndex(e);
          n < 0
            ? this.attrPush([e, t])
            : (this.attrs[n][1] = this.attrs[n][1] + " " + t);
        }),
        (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      function r() {
        if (
          "undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
          "function" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE
        )
          try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r);
          } catch (e) {
            console.error(e);
          }
      }
      r(), (e.exports = n(186));
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        "undefined" != typeof console &&
          "function" == typeof console.error &&
          console.error(e);
        try {
          throw new Error(e);
        } catch (e) {}
      }
      t.a = r;
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(61),
        i = n(202),
        o = n(201),
        s = n(200),
        a = n(60);
      n(62);
      n.d(t, "createStore", function () {
        return r.b;
      }),
        n.d(t, "combineReducers", function () {
          return i.a;
        }),
        n.d(t, "bindActionCreators", function () {
          return o.a;
        }),
        n.d(t, "applyMiddleware", function () {
          return s.a;
        }),
        n.d(t, "compose", function () {
          return a.a;
        });
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        if ("function" != typeof e)
          throw new TypeError(
            "argument is not a function. Are you looking for `mapTo()`?",
          );
        return this.lift(new s(e, t));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(3);
      t.map = r;
      var s = (function () {
        function e(e, t) {
          (this.project = e), (this.thisArg = t);
        }
        return (
          (e.prototype.call = function (e, t) {
            return t.subscribe(new a(e, this.project, this.thisArg));
          }),
          e
        );
      })();
      t.MapOperator = s;
      var a = (function (e) {
        function t(t, n, r) {
          e.call(this, t),
            (this.project = n),
            (this.count = 0),
            (this.thisArg = r || this);
        }
        return (
          i(t, e),
          (t.prototype._next = function (e) {
            var t;
            try {
              t = this.project.call(this.thisArg, e, this.count++);
            } catch (e) {
              return void this.destination.error(e);
            }
            this.destination.next(t);
          }),
          t
        );
      })(o.Subscriber);
    },
    function (e, t, n) {
      "use strict";
      var r = n(256),
        i = n(257);
      t.async = new i.AsyncScheduler(r.AsyncAction);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = e.Symbol;
        if ("function" == typeof t)
          return (
            t.iterator || (t.iterator = t("iterator polyfill")), t.iterator
          );
        var n = e.Set;
        if (n && "function" == typeof new n()["@@iterator"])
          return "@@iterator";
        var r = e.Map;
        if (r)
          for (
            var i = Object.getOwnPropertyNames(r.prototype), o = 0;
            o < i.length;
            ++o
          ) {
            var s = i[o];
            if (
              "entries" !== s &&
              "size" !== s &&
              r.prototype[s] === r.prototype.entries
            )
              return s;
          }
        return "@@iterator";
      }
      var i = n(5);
      (t.symbolIteratorPonyfill = r),
        (t.iterator = r(i.root)),
        (t.$$iterator = t.iterator);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t,
          n = e.Symbol;
        return (
          "function" == typeof n
            ? n.observable
              ? (t = n.observable)
              : ((t = n("observable")), (n.observable = t))
            : (t = "@@observable"),
          t
        );
      }
      var i = n(5);
      (t.getSymbolObservable = r),
        (t.observable = r(i.root)),
        (t.$$observable = t.observable);
    },
    function (e, t, n) {
      "use strict";
      var r = n(5),
        i = r.root.Symbol;
      (t.rxSubscriber =
        "function" == typeof i && "function" == typeof i.for
          ? i.for("rxSubscriber")
          : "@@rxSubscriber"),
        (t.$$rxSubscriber = t.rxSubscriber);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return "function" == typeof e;
      }
      t.isFunction = r;
    },
    function (e, t) {
      e.exports =
        /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E44\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD807[\uDC41-\uDC45\uDC70\uDC71]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
    },
    function (e, t) {
      function n(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      e.exports = n;
    },
    function (e, t, n) {
      "use strict";
      var r =
        (this && this.__extends) ||
        (function () {
          var e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            };
          return function (t, n) {
            function r() {
              this.constructor = t;
            }
            e(t, n),
              (t.prototype =
                null === n
                  ? Object.create(n)
                  : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i = n(17),
        o = n(25),
        s = (function () {
          function e(e) {
            (this.default = "#000000"),
              (this.subtle = "#666666"),
              e &&
                ((this.default = e.default || this.default),
                (this.subtle = e.subtle || this.subtle));
          }
          return e;
        })();
      t.TextColorDefinition = s;
      var a = (function () {
        function e(e) {
          (this.allowCustomStyle = !1),
            e &&
              (this.allowCustomStyle =
                e.allowCustomStyle || this.allowCustomStyle);
        }
        return e;
      })();
      t.AdaptiveCardConfig = a;
      var l = (function () {
        function e(e) {
          (this.imageSize = i.Size.Medium),
            (this.maxImageHeight = 100),
            e &&
              ((this.imageSize =
                null != e.imageSize ? e.imageSize : this.imageSize),
              (this.maxImageHeight = o.getValueOrDefault(
                e.maxImageHeight,
                100,
              )));
        }
        return (
          (e.prototype.toJSON = function () {
            return {
              imageSize: i.Size[this.imageSize],
              maxImageHeight: this.maxImageHeight,
            };
          }),
          e
        );
      })();
      t.ImageSetConfig = l;
      var c = (function () {
        function e(e) {
          (this.size = i.TextSize.Default),
            (this.color = i.TextColor.Default),
            (this.isSubtle = !1),
            (this.weight = i.TextWeight.Default),
            (this.wrap = !0),
            e &&
              ((this.size = o.parseHostConfigEnum(
                i.TextSize,
                e.size,
                i.TextSize.Default,
              )),
              (this.color = o.parseHostConfigEnum(
                i.TextColor,
                e.color,
                i.TextColor.Default,
              )),
              (this.isSubtle = e.isSubtle || this.isSubtle),
              (this.weight = o.parseHostConfigEnum(
                i.TextWeight,
                e.weight,
                i.TextWeight.Default,
              )),
              (this.wrap = null != e.wrap ? e.wrap : this.wrap));
        }
        return (
          (e.prototype.toJSON = function () {
            return {
              size: i.TextSize[this.size],
              color: i.TextColor[this.color],
              isSubtle: this.isSubtle,
              weight: i.TextWeight[this.weight],
              warp: this.wrap,
            };
          }),
          e
        );
      })();
      t.FactTextDefinition = c;
      var u = (function (e) {
        function t(t) {
          var n = e.call(this, t) || this;
          return (
            (n.maxWidth = 150),
            (n.weight = i.TextWeight.Bolder),
            t && (n.maxWidth = null != t.maxWidth ? t.maxWidth : n.maxWidth),
            n
          );
        }
        return r(t, e), t;
      })(c);
      t.FactTitleDefinition = u;
      var p = (function () {
        function e(e) {
          (this.title = new u()),
            (this.value = new c()),
            (this.spacing = 10),
            e &&
              ((this.title = new u(e.title)),
              (this.value = new c(e.value)),
              (this.spacing =
                e.spacing && null != e.spacing
                  ? e.spacing && e.spacing
                  : this.spacing));
        }
        return e;
      })();
      t.FactSetConfig = p;
      var d = (function () {
        function e(e) {
          (this.actionMode = i.ShowCardActionMode.Inline),
            (this.inlineTopMargin = 16),
            (this.style = i.ContainerStyle.Emphasis),
            e &&
              ((this.actionMode = o.parseHostConfigEnum(
                i.ShowCardActionMode,
                e.actionMode,
                i.ShowCardActionMode.Inline,
              )),
              (this.inlineTopMargin =
                null != e.inlineTopMargin
                  ? e.inlineTopMargin
                  : this.inlineTopMargin),
              (this.style =
                e.style && "string" == typeof e.style
                  ? e.style
                  : i.ContainerStyle.Emphasis));
        }
        return (
          (e.prototype.toJSON = function () {
            return {
              actionMode: i.ShowCardActionMode[this.actionMode],
              inlineTopMargin: this.inlineTopMargin,
              style: this.style,
            };
          }),
          e
        );
      })();
      t.ShowCardActionConfig = d;
      var h = (function () {
        function e(e) {
          (this.maxActions = 5),
            (this.spacing = i.Spacing.Default),
            (this.buttonSpacing = 20),
            (this.showCard = new d()),
            (this.preExpandSingleShowCardAction = !1),
            (this.actionsOrientation = i.Orientation.Horizontal),
            (this.actionAlignment = i.ActionAlignment.Left),
            e &&
              ((this.maxActions =
                null != e.maxActions ? e.maxActions : this.maxActions),
              (this.spacing = o.parseHostConfigEnum(
                i.Spacing,
                e.spacing && e.spacing,
                i.Spacing.Default,
              )),
              (this.buttonSpacing =
                null != e.buttonSpacing ? e.buttonSpacing : this.buttonSpacing),
              (this.showCard = new d(e.showCard)),
              (this.preExpandSingleShowCardAction = o.getValueOrDefault(
                e.preExpandSingleShowCardAction,
                !1,
              )),
              (this.actionsOrientation = o.parseHostConfigEnum(
                i.Orientation,
                e.actionsOrientation,
                i.Orientation.Horizontal,
              )),
              (this.actionAlignment = o.parseHostConfigEnum(
                i.ActionAlignment,
                e.actionAlignment,
                i.ActionAlignment.Left,
              )));
        }
        return (
          (e.prototype.toJSON = function () {
            return {
              maxActions: this.maxActions,
              spacing: i.Spacing[this.spacing],
              buttonSpacing: this.buttonSpacing,
              showCard: this.showCard,
              preExpandSingleShowCardAction: this.preExpandSingleShowCardAction,
              actionsOrientation: i.Orientation[this.actionsOrientation],
              actionAlignment: i.ActionAlignment[this.actionAlignment],
            };
          }),
          e
        );
      })();
      t.ActionsConfig = h;
      var f = (function () {
        function e(e) {
          (this.foregroundColors = {
            default: new s(),
            dark: new s(),
            light: new s(),
            accent: new s(),
            good: new s(),
            warning: new s(),
            attention: new s(),
          }),
            this.parse(e);
        }
        return (
          (e.prototype.getTextColorDefinitionOrDefault = function (e, t) {
            return new s(e || t);
          }),
          (e.prototype.parse = function (e) {
            e &&
              ((this.backgroundColor = e.backgroundColor),
              e.foregroundColors &&
                ((this.foregroundColors.default =
                  this.getTextColorDefinitionOrDefault(
                    e.foregroundColors.default,
                    { default: "#333333", subtle: "#EE333333" },
                  )),
                (this.foregroundColors.dark =
                  this.getTextColorDefinitionOrDefault(
                    e.foregroundColors.dark,
                    { default: "#000000", subtle: "#66000000" },
                  )),
                (this.foregroundColors.light =
                  this.getTextColorDefinitionOrDefault(
                    e.foregroundColors.light,
                    { default: "#FFFFFF", subtle: "#33000000" },
                  )),
                (this.foregroundColors.accent =
                  this.getTextColorDefinitionOrDefault(
                    e.foregroundColors.accent,
                    { default: "#2E89FC", subtle: "#882E89FC" },
                  )),
                (this.foregroundColors.good =
                  this.getTextColorDefinitionOrDefault(
                    e.foregroundColors.good,
                    { default: "#54A254", subtle: "#DD54A254" },
                  )),
                (this.foregroundColors.warning =
                  this.getTextColorDefinitionOrDefault(
                    e.foregroundColors.warning,
                    { default: "#E69500", subtle: "#DDE69500" },
                  )),
                (this.foregroundColors.attention =
                  this.getTextColorDefinitionOrDefault(
                    e.foregroundColors.attention,
                    { default: "#CC3300", subtle: "#DDCC3300" },
                  ))));
          }),
          Object.defineProperty(e.prototype, "isBuiltIn", {
            get: function () {
              return !1;
            },
            enumerable: !0,
            configurable: !0,
          }),
          e
        );
      })();
      t.ContainerStyleDefinition = f;
      var m = (function (e) {
          function t() {
            return (null !== e && e.apply(this, arguments)) || this;
          }
          return (
            r(t, e),
            Object.defineProperty(t.prototype, "isBuiltIn", {
              get: function () {
                return !0;
              },
              enumerable: !0,
              configurable: !0,
            }),
            t
          );
        })(f),
        g = (function () {
          function e(e) {
            if (
              ((this._allStyles = {}),
              (this._allStyles[i.ContainerStyle.Default] = new m()),
              (this._allStyles[i.ContainerStyle.Emphasis] = new m()),
              e)
            ) {
              this._allStyles[i.ContainerStyle.Default].parse(
                e[i.ContainerStyle.Default],
              ),
                this._allStyles[i.ContainerStyle.Emphasis].parse(
                  e[i.ContainerStyle.Emphasis],
                );
              var t = e.customStyles;
              if (t && Array.isArray(t))
                for (var n = 0, r = t; n < r.length; n++) {
                  var o = r[n];
                  if (o) {
                    var s = o.name;
                    s &&
                      "string" == typeof s &&
                      (this._allStyles.hasOwnProperty(s)
                        ? this._allStyles[s].parse(o.style)
                        : (this._allStyles[s] = new f(o.style)));
                  }
                }
            }
          }
          return (
            (e.prototype.toJSON = function () {
              var e = this,
                t = [];
              Object.keys(this._allStyles).forEach(function (n) {
                e._allStyles[n].isBuiltIn ||
                  t.push({ name: n, style: e._allStyles[n] });
              });
              var n = { default: this.default, emphasis: this.emphasis };
              return t.length > 0 && (n.customStyles = t), n;
            }),
            (e.prototype.getStyleByName = function (e, t) {
              return (
                void 0 === t && (t = null),
                this._allStyles.hasOwnProperty(e) ? this._allStyles[e] : t
              );
            }),
            Object.defineProperty(e.prototype, "default", {
              get: function () {
                return this._allStyles[i.ContainerStyle.Default];
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(e.prototype, "emphasis", {
              get: function () {
                return this._allStyles[i.ContainerStyle.Emphasis];
              },
              enumerable: !0,
              configurable: !0,
            }),
            e
          );
        })();
      t.ContainerStyleSet = g;
      var y = (function () {
        function e(e) {
          (this.choiceSetInputValueSeparator = ","),
            (this.supportsInteractivity = !0),
            (this.fontFamily =
              "Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif"),
            (this.spacing = {
              small: 3,
              default: 8,
              medium: 20,
              large: 30,
              extraLarge: 40,
              padding: 15,
            }),
            (this.separator = { lineThickness: 1, lineColor: "#EEEEEE" }),
            (this.fontSizes = {
              small: 12,
              default: 14,
              medium: 17,
              large: 21,
              extraLarge: 26,
            }),
            (this.fontWeights = { lighter: 200, default: 400, bolder: 600 }),
            (this.imageSizes = { small: 40, medium: 80, large: 160 }),
            (this.containerStyles = new g()),
            (this.actions = new h()),
            (this.adaptiveCard = new a()),
            (this.imageSet = new l()),
            (this.factSet = new p()),
            e &&
              (("string" == typeof e || e instanceof String) &&
                (e = JSON.parse(e)),
              (this.choiceSetInputValueSeparator =
                e && "string" == typeof e.choiceSetInputValueSeparator
                  ? e.choiceSetInputValueSeparator
                  : this.choiceSetInputValueSeparator),
              (this.supportsInteractivity =
                e && "boolean" == typeof e.supportsInteractivity
                  ? e.supportsInteractivity
                  : this.supportsInteractivity),
              (this.fontFamily = e.fontFamily || this.fontFamily),
              (this.fontSizes = {
                small:
                  (e.fontSizes && e.fontSizes.small) || this.fontSizes.small,
                default:
                  (e.fontSizes && e.fontSizes.default) ||
                  this.fontSizes.default,
                medium:
                  (e.fontSizes && e.fontSizes.medium) || this.fontSizes.medium,
                large:
                  (e.fontSizes && e.fontSizes.large) || this.fontSizes.large,
                extraLarge:
                  (e.fontSizes && e.fontSizes.extraLarge) ||
                  this.fontSizes.extraLarge,
              }),
              (this.fontWeights = {
                lighter:
                  (e.fontWeights && e.fontWeights.lighter) ||
                  this.fontWeights.lighter,
                default:
                  (e.fontWeights && e.fontWeights.default) ||
                  this.fontWeights.default,
                bolder:
                  (e.fontWeights && e.fontWeights.bolder) ||
                  this.fontWeights.bolder,
              }),
              (this.imageSizes = {
                small:
                  (e.imageSizes && e.imageSizes.small) || this.imageSizes.small,
                medium:
                  (e.imageSizes && e.imageSizes.medium) ||
                  this.imageSizes.medium,
                large:
                  (e.imageSizes && e.imageSizes.large) || this.imageSizes.large,
              }),
              (this.containerStyles = new g(e.containerStyles)),
              (this.spacing = {
                small: (e.spacing && e.spacing.small) || this.spacing.small,
                default:
                  (e.spacing && e.spacing.default) || this.spacing.default,
                medium: (e.spacing && e.spacing.medium) || this.spacing.medium,
                large: (e.spacing && e.spacing.large) || this.spacing.large,
                extraLarge:
                  (e.spacing && e.spacing.extraLarge) ||
                  this.spacing.extraLarge,
                padding:
                  (e.spacing && e.spacing.padding) || this.spacing.padding,
              }),
              (this.separator = {
                lineThickness:
                  (e.separator && e.separator.lineThickness) ||
                  this.separator.lineThickness,
                lineColor:
                  (e.separator && e.separator.lineColor) ||
                  this.separator.lineColor,
              }),
              (this.actions = new h(e.actions || this.actions)),
              (this.adaptiveCard = new a(e.adaptiveCard || this.adaptiveCard)),
              (this.imageSet = new l(e.imageSet)),
              (this.factSet = new p(e.factSet)));
        }
        return (
          (e.prototype.getEffectiveSpacing = function (e) {
            switch (e) {
              case i.Spacing.Small:
                return this.spacing.small;
              case i.Spacing.Default:
                return this.spacing.default;
              case i.Spacing.Medium:
                return this.spacing.medium;
              case i.Spacing.Large:
                return this.spacing.large;
              case i.Spacing.ExtraLarge:
                return this.spacing.extraLarge;
              case i.Spacing.Padding:
                return this.spacing.padding;
              default:
                return 0;
            }
          }),
          e
        );
      })();
      t.HostConfig = y;
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(4),
        i = n(2);
      n(211), n(213);
      var o = n(0),
        s = (function (e) {
          function t(t) {
            var n = e.call(this, t) || this;
            return (n.handleLoad = n.updateScrollButtons.bind(n)), n;
          }
          return (
            r.__extends(t, e),
            (t.prototype.clearScrollTimers = function () {
              clearInterval(this.scrollStartTimer),
                clearInterval(this.scrollSyncTimer),
                clearTimeout(this.scrollDurationTimer),
                document.body.removeChild(this.animateDiv),
                (this.animateDiv = null),
                (this.scrollStartTimer = null),
                (this.scrollSyncTimer = null),
                (this.scrollDurationTimer = null);
            }),
            (t.prototype.updateScrollButtons = function () {
              (this.prevButton.disabled =
                !this.scrollDiv || Math.round(this.scrollDiv.scrollLeft) <= 0),
                (this.nextButton.disabled =
                  !this.scrollDiv ||
                  Math.round(this.scrollDiv.scrollLeft) >=
                    Math.round(
                      this.scrollDiv.scrollWidth - this.scrollDiv.offsetWidth,
                    ));
            }),
            (t.prototype.componentDidMount = function () {
              var e = this;
              (this.scrollDiv.style.marginBottom =
                -(this.scrollDiv.offsetHeight - this.scrollDiv.clientHeight) +
                "px"),
                (this.scrollSubscription = o.Observable.fromEvent(
                  this.scrollDiv,
                  "scroll",
                ).subscribe(function (t) {
                  e.updateScrollButtons();
                })),
                (this.clickSubscription = o.Observable.merge(
                  o.Observable.fromEvent(this.prevButton, "click").map(
                    function (e) {
                      return -1;
                    },
                  ),
                  o.Observable.fromEvent(this.nextButton, "click").map(
                    function (e) {
                      return 1;
                    },
                  ),
                ).subscribe(function (t) {
                  e.scrollBy(t);
                })),
                this.updateScrollButtons();
            }),
            (t.prototype.componentDidUpdate = function () {
              (this.scrollDiv.scrollLeft = 0), this.updateScrollButtons();
            }),
            (t.prototype.componentWillUnmount = function () {
              this.scrollSubscription.unsubscribe(),
                this.clickSubscription.unsubscribe();
            }),
            (t.prototype.scrollAmount = function (e) {
              if ("item" === this.props.scrollUnit) {
                var t = this.scrollDiv.querySelector("ul > li");
                return t ? e * t.offsetWidth : 0;
              }
              return e * (this.scrollDiv.offsetWidth - 70);
            }),
            (t.prototype.scrollBy = function (e) {
              var t = this,
                n = "wc-animate-scroll";
              this.animateDiv &&
                ((n = "wc-animate-scroll-rapid"), this.clearScrollTimers());
              var r = this.scrollAmount(e),
                i = this.scrollDiv.scrollLeft,
                o = i + r;
              (o = Math.max(o, 0)),
                (o = Math.min(
                  o,
                  this.scrollDiv.scrollWidth - this.scrollDiv.offsetWidth,
                )),
                i !== o &&
                  (Math.abs(o - i) < 60 && (n = "wc-animate-scroll-near"),
                  (this.animateDiv = document.createElement("div")),
                  (this.animateDiv.className = n),
                  (this.animateDiv.style.left = i + "px"),
                  document.body.appendChild(this.animateDiv),
                  (this.scrollSyncTimer = window.setInterval(function () {
                    var e = parseFloat(getComputedStyle(t.animateDiv).left);
                    t.scrollDiv.scrollLeft = e;
                  }, 1)),
                  (this.scrollStartTimer = window.setTimeout(function () {
                    t.animateDiv.style.left = o + "px";
                    var e =
                      1e3 *
                      parseFloat(
                        getComputedStyle(t.animateDiv).transitionDuration,
                      );
                    e
                      ? ((e += 50),
                        (t.scrollDurationTimer = window.setTimeout(function () {
                          return t.clearScrollTimers();
                        }, e)))
                      : t.clearScrollTimers();
                  }, 1)));
            }),
            (t.prototype.render = function () {
              var e = this;
              return i.createElement(
                "div",
                { onLoad: this.handleLoad },
                i.createElement(
                  "button",
                  {
                    className: "scroll previous",
                    disabled: !0,
                    ref: function (t) {
                      return (e.prevButton = t);
                    },
                    type: "button",
                  },
                  i.createElement(
                    "svg",
                    null,
                    i.createElement("path", { d: this.props.prevSvgPathData }),
                  ),
                ),
                i.createElement(
                  "div",
                  { className: "wc-hscroll-outer" },
                  i.createElement(
                    "div",
                    {
                      className: "wc-hscroll",
                      ref: function (t) {
                        return (e.scrollDiv = t);
                      },
                    },
                    this.props.children,
                  ),
                ),
                i.createElement(
                  "button",
                  {
                    className: "scroll next",
                    disabled: !0,
                    ref: function (t) {
                      return (e.nextButton = t);
                    },
                    type: "button",
                  },
                  i.createElement(
                    "svg",
                    null,
                    i.createElement("path", { d: this.props.nextSvgPathData }),
                  ),
                ),
              );
            }),
            t
          );
        })(i.Component);
      t.HScroll = s;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        if (e && 0 !== e.length) {
          var t = e[e.length - 1];
          return "message" === t.type &&
            t.suggestedActions &&
            t.suggestedActions.actions.length > 0
            ? t
            : void 0;
        }
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.activityWithSuggestedActions = r);
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      (t.RULE = "rule"), (t.WORD = "word"), (t.ALTERNATIVE = "alt");
    },
    function (e, t, n) {
      "use strict";
      var r = n(133),
        i = r.a.Symbol;
      t.a = i;
    },
    function (e, t, n) {
      "use strict";
      e.exports = n(140);
    },
    function (e, t, n) {
      "use strict";
      e.exports = n(111);
    },
    function (e, t, n) {
      "use strict";
      var r =
          "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>",
        i = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>",
        o = new RegExp(
          "^(?:" +
            r +
            "|" +
            i +
            "|\x3c!----\x3e|\x3c!--(?:-?[^>-])(?:-?[^-])*--\x3e|<[?].*?[?]>|<![A-Z]+\\s+[^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)",
        ),
        s = new RegExp("^(?:" + r + "|" + i + ")");
      (e.exports.HTML_TAG_RE = o), (e.exports.HTML_OPEN_CLOSE_TAG_RE = s);
    },
    function (e, t, n) {
      "use strict";
      (e.exports.tokenize = function (e, t) {
        var n,
          r,
          i,
          o = e.pos,
          s = e.src.charCodeAt(o);
        if (t) return !1;
        if (95 !== s && 42 !== s) return !1;
        for (r = e.scanDelims(e.pos, 42 === s), n = 0; n < r.length; n++)
          (i = e.push("text", "", 0)),
            (i.content = String.fromCharCode(s)),
            e.delimiters.push({
              marker: s,
              length: r.length,
              jump: n,
              token: e.tokens.length - 1,
              level: e.level,
              end: -1,
              open: r.can_open,
              close: r.can_close,
            });
        return (e.pos += r.length), !0;
      }),
        (e.exports.postProcess = function (e) {
          var t,
            n,
            r,
            i,
            o,
            s,
            a = e.delimiters,
            l = e.delimiters.length;
          for (t = 0; t < l; t++)
            (n = a[t]),
              (95 !== n.marker && 42 !== n.marker) ||
                (-1 !== n.end &&
                  ((r = a[n.end]),
                  (s =
                    t + 1 < l &&
                    a[t + 1].end === n.end - 1 &&
                    a[t + 1].token === n.token + 1 &&
                    a[n.end - 1].token === r.token - 1 &&
                    a[t + 1].marker === n.marker),
                  (o = String.fromCharCode(n.marker)),
                  (i = e.tokens[n.token]),
                  (i.type = s ? "strong_open" : "em_open"),
                  (i.tag = s ? "strong" : "em"),
                  (i.nesting = 1),
                  (i.markup = s ? o + o : o),
                  (i.content = ""),
                  (i = e.tokens[r.token]),
                  (i.type = s ? "strong_close" : "em_close"),
                  (i.tag = s ? "strong" : "em"),
                  (i.nesting = -1),
                  (i.markup = s ? o + o : o),
                  (i.content = ""),
                  s &&
                    ((e.tokens[a[t + 1].token].content = ""),
                    (e.tokens[a[n.end - 1].token].content = ""),
                    t++)));
        });
    },
    function (e, t, n) {
      "use strict";
      (e.exports.tokenize = function (e, t) {
        var n,
          r,
          i,
          o,
          s,
          a = e.pos,
          l = e.src.charCodeAt(a);
        if (t) return !1;
        if (126 !== l) return !1;
        if (
          ((r = e.scanDelims(e.pos, !0)),
          (o = r.length),
          (s = String.fromCharCode(l)),
          o < 2)
        )
          return !1;
        for (
          o % 2 && ((i = e.push("text", "", 0)), (i.content = s), o--), n = 0;
          n < o;
          n += 2
        )
          (i = e.push("text", "", 0)),
            (i.content = s + s),
            e.delimiters.push({
              marker: l,
              jump: n,
              token: e.tokens.length - 1,
              level: e.level,
              end: -1,
              open: r.can_open,
              close: r.can_close,
            });
        return (e.pos += r.length), !0;
      }),
        (e.exports.postProcess = function (e) {
          var t,
            n,
            r,
            i,
            o,
            s = [],
            a = e.delimiters,
            l = e.delimiters.length;
          for (t = 0; t < l; t++)
            (r = a[t]),
              126 === r.marker &&
                -1 !== r.end &&
                ((i = a[r.end]),
                (o = e.tokens[r.token]),
                (o.type = "s_open"),
                (o.tag = "s"),
                (o.nesting = 1),
                (o.markup = "~~"),
                (o.content = ""),
                (o = e.tokens[i.token]),
                (o.type = "s_close"),
                (o.tag = "s"),
                (o.nesting = -1),
                (o.markup = "~~"),
                (o.content = ""),
                "text" === e.tokens[i.token - 1].type &&
                  "~" === e.tokens[i.token - 1].content &&
                  s.push(i.token - 1));
          for (; s.length; ) {
            for (
              t = s.pop(), n = t + 1;
              n < e.tokens.length && "s_close" === e.tokens[n].type;

            )
              n++;
            n--,
              t !== n &&
                ((o = e.tokens[n]),
                (e.tokens[n] = e.tokens[t]),
                (e.tokens[t] = o));
          }
        });
    },
    function (e, t, n) {
      "use strict";
      (e.exports.encode = n(180)),
        (e.exports.decode = n(179)),
        (e.exports.format = n(181)),
        (e.exports.parse = n(182));
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        if (null === e || void 0 === e)
          throw new TypeError(
            "Object.assign cannot be called with null or undefined",
          );
        return Object(e);
      } /*
object-assign
(c) Sindre Sorhus
@license MIT
*/
      var i = Object.getOwnPropertySymbols,
        o = Object.prototype.hasOwnProperty,
        s = Object.prototype.propertyIsEnumerable;
      e.exports = (function () {
        try {
          if (!Object.assign) return !1;
          var e = new String("abc");
          if (((e[5] = "de"), "5" === Object.getOwnPropertyNames(e)[0]))
            return !1;
          for (var t = {}, n = 0; n < 10; n++)
            t["_" + String.fromCharCode(n)] = n;
          if (
            "0123456789" !==
            Object.getOwnPropertyNames(t)
              .map(function (e) {
                return t[e];
              })
              .join("")
          )
            return !1;
          var r = {};
          return (
            "abcdefghijklmnopqrst".split("").forEach(function (e) {
              r[e] = e;
            }),
            "abcdefghijklmnopqrst" ===
              Object.keys(Object.assign({}, r)).join("")
          );
        } catch (e) {
          return !1;
        }
      })()
        ? Object.assign
        : function (e, t) {
            for (var n, a, l = r(e), c = 1; c < arguments.length; c++) {
              n = Object(arguments[c]);
              for (var u in n) o.call(n, u) && (l[u] = n[u]);
              if (i) {
                a = i(n);
                for (var p = 0; p < a.length; p++)
                  s.call(n, a[p]) && (l[a[p]] = n[a[p]]);
              }
            }
            return l;
          };
    },
    function (e, t, n) {
      e.exports = n(183)();
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      function i(e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return !t || ("object" != typeof t && "function" != typeof t) ? e : t;
      }
      function o(e, t) {
        if ("function" != typeof t && null !== t)
          throw new TypeError(
            "Super expression must either be null or a function, not " +
              typeof t,
          );
        (e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
          t &&
            (Object.setPrototypeOf
              ? Object.setPrototypeOf(e, t)
              : (e.__proto__ = t));
      }
      function s(e, t) {
        var n = {};
        for (var r in e)
          t.indexOf(r) >= 0 ||
            (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]));
        return n;
      }
      function a() {}
      function l(e, t) {
        var n = {
          run: function (r) {
            try {
              var i = e(t.getState(), r);
              (i !== n.props || n.error) &&
                ((n.shouldComponentUpdate = !0),
                (n.props = i),
                (n.error = null));
            } catch (e) {
              (n.shouldComponentUpdate = !0), (n.error = e);
            }
          },
        };
        return n;
      }
      function c(e) {
        var t,
          c,
          u =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          d = u.getDisplayName,
          _ =
            void 0 === d
              ? function (e) {
                  return "ConnectAdvanced(" + e + ")";
                }
              : d,
          w = u.methodName,
          C = void 0 === w ? "connectAdvanced" : w,
          S = u.renderCountProp,
          k = void 0 === S ? void 0 : S,
          x = u.shouldHandleStateChanges,
          E = void 0 === x || x,
          T = u.storeKey,
          A = void 0 === T ? "store" : T,
          O = u.withRef,
          P = void 0 !== O && O,
          I = s(u, [
            "getDisplayName",
            "methodName",
            "renderCountProp",
            "shouldHandleStateChanges",
            "storeKey",
            "withRef",
          ]),
          D = A + "Subscription",
          L = v++,
          N = ((t = {}), (t[A] = g.a), (t[D] = g.b), t),
          M = ((c = {}), (c[D] = g.b), c);
        return function (t) {
          h()(
            "function" == typeof t,
            "You must pass a component to the function returned by connect. Instead received " +
              JSON.stringify(t),
          );
          var s = t.displayName || t.name || "Component",
            c = _(s),
            u = y({}, I, {
              getDisplayName: _,
              methodName: C,
              renderCountProp: k,
              shouldHandleStateChanges: E,
              storeKey: A,
              withRef: P,
              displayName: c,
              wrappedComponentName: s,
              WrappedComponent: t,
            }),
            d = (function (s) {
              function p(e, t) {
                r(this, p);
                var n = i(this, s.call(this, e, t));
                return (
                  (n.version = L),
                  (n.state = {}),
                  (n.renderCount = 0),
                  (n.store = e[A] || t[A]),
                  (n.propsMode = Boolean(e[A])),
                  (n.setWrappedInstance = n.setWrappedInstance.bind(n)),
                  h()(
                    n.store,
                    'Could not find "' +
                      A +
                      '" in either the context or props of "' +
                      c +
                      '". Either wrap the root component in a <Provider>, or explicitly pass "' +
                      A +
                      '" as a prop to "' +
                      c +
                      '".',
                  ),
                  n.initSelector(),
                  n.initSubscription(),
                  n
                );
              }
              return (
                o(p, s),
                (p.prototype.getChildContext = function () {
                  var e,
                    t = this.propsMode ? null : this.subscription;
                  return (e = {}), (e[D] = t || this.context[D]), e;
                }),
                (p.prototype.componentDidMount = function () {
                  E &&
                    (this.subscription.trySubscribe(),
                    this.selector.run(this.props),
                    this.selector.shouldComponentUpdate && this.forceUpdate());
                }),
                (p.prototype.componentWillReceiveProps = function (e) {
                  this.selector.run(e);
                }),
                (p.prototype.shouldComponentUpdate = function () {
                  return this.selector.shouldComponentUpdate;
                }),
                (p.prototype.componentWillUnmount = function () {
                  this.subscription && this.subscription.tryUnsubscribe(),
                    (this.subscription = null),
                    (this.notifyNestedSubs = a),
                    (this.store = null),
                    (this.selector.run = a),
                    (this.selector.shouldComponentUpdate = !1);
                }),
                (p.prototype.getWrappedInstance = function () {
                  return (
                    h()(
                      P,
                      "To access the wrapped instance, you need to specify { withRef: true } in the options argument of the " +
                        C +
                        "() call.",
                    ),
                    this.wrappedInstance
                  );
                }),
                (p.prototype.setWrappedInstance = function (e) {
                  this.wrappedInstance = e;
                }),
                (p.prototype.initSelector = function () {
                  var t = e(this.store.dispatch, u);
                  (this.selector = l(t, this.store)),
                    this.selector.run(this.props);
                }),
                (p.prototype.initSubscription = function () {
                  if (E) {
                    var e = (this.propsMode ? this.props : this.context)[D];
                    (this.subscription = new m.a(
                      this.store,
                      e,
                      this.onStateChange.bind(this),
                    )),
                      (this.notifyNestedSubs =
                        this.subscription.notifyNestedSubs.bind(
                          this.subscription,
                        ));
                  }
                }),
                (p.prototype.onStateChange = function () {
                  this.selector.run(this.props),
                    this.selector.shouldComponentUpdate
                      ? ((this.componentDidUpdate =
                          this.notifyNestedSubsOnComponentDidUpdate),
                        this.setState(b))
                      : this.notifyNestedSubs();
                }),
                (p.prototype.notifyNestedSubsOnComponentDidUpdate =
                  function () {
                    (this.componentDidUpdate = void 0), this.notifyNestedSubs();
                  }),
                (p.prototype.isSubscribed = function () {
                  return (
                    Boolean(this.subscription) &&
                    this.subscription.isSubscribed()
                  );
                }),
                (p.prototype.addExtraProps = function (e) {
                  if (!(P || k || (this.propsMode && this.subscription)))
                    return e;
                  var t = y({}, e);
                  return (
                    P && (t.ref = this.setWrappedInstance),
                    k && (t[k] = this.renderCount++),
                    this.propsMode &&
                      this.subscription &&
                      (t[D] = this.subscription),
                    t
                  );
                }),
                (p.prototype.render = function () {
                  var e = this.selector;
                  if (((e.shouldComponentUpdate = !1), e.error)) throw e.error;
                  return n.i(f.createElement)(t, this.addExtraProps(e.props));
                }),
                p
              );
            })(f.Component);
          return (
            (d.WrappedComponent = t),
            (d.displayName = c),
            (d.childContextTypes = M),
            (d.contextTypes = N),
            (d.propTypes = N),
            p()(d, t)
          );
        };
      }
      var u = n(114),
        p = n.n(u),
        d = n(115),
        h = n.n(d),
        f = n(2),
        m = (n.n(f), n(194)),
        g = n(56);
      t.a = c;
      var y =
          Object.assign ||
          function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          },
        v = 0,
        b = {};
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return function (t, n) {
          function r() {
            return i;
          }
          var i = e(t, n);
          return (r.dependsOnOwnProps = !1), r;
        };
      }
      function i(e) {
        return null !== e.dependsOnOwnProps && void 0 !== e.dependsOnOwnProps
          ? Boolean(e.dependsOnOwnProps)
          : 1 !== e.length;
      }
      function o(e, t) {
        return function (t, n) {
          var r =
            (n.displayName,
            function (e, t) {
              return r.dependsOnOwnProps ? r.mapToProps(e, t) : r.mapToProps(e);
            });
          return (
            (r.dependsOnOwnProps = !0),
            (r.mapToProps = function (t, n) {
              (r.mapToProps = e), (r.dependsOnOwnProps = i(e));
              var o = r(t, n);
              return (
                "function" == typeof o &&
                  ((r.mapToProps = o),
                  (r.dependsOnOwnProps = i(o)),
                  (o = r(t, n))),
                o
              );
            }),
            r
          );
        };
      }
      n(57);
      (t.b = r), (t.a = o);
    },
    function (e, t, n) {
      "use strict";
      var r = n(53),
        i = n.n(r);
      n.d(t, "b", function () {
        return o;
      }),
        n.d(t, "a", function () {
          return s;
        });
      var o = i.a.shape({
          trySubscribe: i.a.func.isRequired,
          tryUnsubscribe: i.a.func.isRequired,
          notifyNestedSubs: i.a.func.isRequired,
          isSubscribed: i.a.func.isRequired,
        }),
        s = i.a.shape({
          subscribe: i.a.func.isRequired,
          dispatch: i.a.func.isRequired,
          getState: i.a.func.isRequired,
        });
    },
    function (e, t, n) {
      "use strict";
      n(27), n(31);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      function i(e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return !t || ("object" != typeof t && "function" != typeof t) ? e : t;
      }
      function o(e, t) {
        if ("function" != typeof t && null !== t)
          throw new TypeError(
            "Super expression must either be null or a function, not " +
              typeof t,
          );
        (e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
          t &&
            (Object.setPrototypeOf
              ? Object.setPrototypeOf(e, t)
              : (e.__proto__ = t));
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ActionsObservable = void 0);
      var s = (function () {
          function e(e, t) {
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(e, r.key, r);
            }
          }
          return function (t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t;
          };
        })(),
        a = n(0),
        l = n(76),
        c = n(74),
        u = n(77);
      t.ActionsObservable = (function (e) {
        function t(e) {
          r(this, t);
          var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
          return (n.source = e), n;
        }
        return (
          o(t, e),
          s(t, null, [
            {
              key: "of",
              value: function () {
                return new this(l.of.apply(void 0, arguments));
              },
            },
            {
              key: "from",
              value: function (e, t) {
                return new this((0, c.from)(e, t));
              },
            },
          ]),
          s(t, [
            {
              key: "lift",
              value: function (e) {
                var n = new t(this);
                return (n.operator = e), n;
              },
            },
            {
              key: "ofType",
              value: function () {
                for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
                  t[n] = arguments[n];
                return u.filter.call(this, function (e) {
                  var n = e.type,
                    r = t.length;
                  if (1 === r) return n === t[0];
                  for (var i = 0; i < r; i++) if (t[i] === n) return !0;
                  return !1;
                });
              },
            },
          ]),
          t
        );
      })(a.Observable);
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      t.EPIC_END = "@@redux-observable/EPIC_END";
    },
    function (e, t, n) {
      "use strict";
      function r() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return 0 === t.length
          ? function (e) {
              return e;
            }
          : 1 === t.length
          ? t[0]
          : t.reduce(function (e, t) {
              return function () {
                return e(t.apply(void 0, arguments));
              };
            });
      }
      t.a = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, o) {
        function l() {
          v === y && (v = y.slice());
        }
        function c() {
          return g;
        }
        function u(e) {
          if ("function" != typeof e)
            throw new Error("Expected listener to be a function.");
          var t = !0;
          return (
            l(),
            v.push(e),
            function () {
              if (t) {
                (t = !1), l();
                var n = v.indexOf(e);
                v.splice(n, 1);
              }
            }
          );
        }
        function p(e) {
          if (!n.i(i.a)(e))
            throw new Error(
              "Actions must be plain objects. Use custom middleware for async actions.",
            );
          if (void 0 === e.type)
            throw new Error(
              'Actions may not have an undefined "type" property. Have you misspelled a constant?',
            );
          if (b) throw new Error("Reducers may not dispatch actions.");
          try {
            (b = !0), (g = m(g, e));
          } finally {
            b = !1;
          }
          for (var t = (y = v), r = 0; r < t.length; r++) {
            (0, t[r])();
          }
          return e;
        }
        function d(e) {
          if ("function" != typeof e)
            throw new Error("Expected the nextReducer to be a function.");
          (m = e), p({ type: a.INIT });
        }
        function h() {
          var e,
            t = u;
          return (
            (e = {
              subscribe: function (e) {
                function n() {
                  e.next && e.next(c());
                }
                if ("object" != typeof e)
                  throw new TypeError("Expected the observer to be an object.");
                return n(), { unsubscribe: t(n) };
              },
            }),
            (e[s.a] = function () {
              return this;
            }),
            e
          );
        }
        var f;
        if (
          ("function" == typeof t && void 0 === o && ((o = t), (t = void 0)),
          void 0 !== o)
        ) {
          if ("function" != typeof o)
            throw new Error("Expected the enhancer to be a function.");
          return o(r)(e, t);
        }
        if ("function" != typeof e)
          throw new Error("Expected the reducer to be a function.");
        var m = e,
          g = t,
          y = [],
          v = y,
          b = !1;
        return (
          p({ type: a.INIT }),
          (f = { dispatch: p, subscribe: u, getState: c, replaceReducer: d }),
          (f[s.a] = h),
          f
        );
      }
      var i = n(27),
        o = n(265),
        s = n.n(o);
      n.d(t, "a", function () {
        return a;
      }),
        (t.b = r);
      var a = { INIT: "@@redux/INIT" };
    },
    function (e, t, n) {
      "use strict";
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = (function () {
          function e(e, t, n) {
            (this.kind = e),
              (this.value = t),
              (this.error = n),
              (this.hasValue = "N" === e);
          }
          return (
            (e.prototype.observe = function (e) {
              switch (this.kind) {
                case "N":
                  return e.next && e.next(this.value);
                case "E":
                  return e.error && e.error(this.error);
                case "C":
                  return e.complete && e.complete();
              }
            }),
            (e.prototype.do = function (e, t, n) {
              switch (this.kind) {
                case "N":
                  return e && e(this.value);
                case "E":
                  return t && t(this.error);
                case "C":
                  return n && n();
              }
            }),
            (e.prototype.accept = function (e, t, n) {
              return e && "function" == typeof e.next
                ? this.observe(e)
                : this.do(e, t, n);
            }),
            (e.prototype.toObservable = function () {
              switch (this.kind) {
                case "N":
                  return r.Observable.of(this.value);
                case "E":
                  return r.Observable.throw(this.error);
                case "C":
                  return r.Observable.empty();
              }
              throw new Error("unexpected notification kind value");
            }),
            (e.createNext = function (t) {
              return void 0 !== t
                ? new e("N", t)
                : e.undefinedValueNotification;
            }),
            (e.createError = function (t) {
              return new e("E", void 0, t);
            }),
            (e.createComplete = function () {
              return e.completeNotification;
            }),
            (e.completeNotification = new e("C")),
            (e.undefinedValueNotification = new e("N", void 0)),
            e
          );
        })();
      t.Notification = i;
    },
    function (e, t, n) {
      "use strict";
      t.empty = {
        closed: !0,
        next: function (e) {},
        error: function (e) {
          throw e;
        },
        complete: function () {},
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(235);
      r.Observable.empty = i.empty;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(76);
      r.Observable.of = i.of;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(239);
      (r.Observable.prototype.catch = i._catch),
        (r.Observable.prototype._catch = i._catch);
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(242);
      r.Observable.prototype.delay = i.delay;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(243);
      (r.Observable.prototype.do = i._do), (r.Observable.prototype._do = i._do);
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(77);
      r.Observable.prototype.filter = i.filter;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(33);
      r.Observable.prototype.map = i.map;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(245);
      (r.Observable.prototype.mergeMap = i.mergeMap),
        (r.Observable.prototype.flatMap = i.mergeMap);
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(0),
        o = (function (e) {
          function t(t, n) {
            e.call(this),
              (this.value = t),
              (this.scheduler = n),
              (this._isScalar = !0),
              n && (this._isScalar = !1);
          }
          return (
            r(t, e),
            (t.create = function (e, n) {
              return new t(e, n);
            }),
            (t.dispatch = function (e) {
              var t = e.done,
                n = e.value,
                r = e.subscriber;
              if (t) return void r.complete();
              r.next(n), r.closed || ((e.done = !0), this.schedule(e));
            }),
            (t.prototype._subscribe = function (e) {
              var n = this.value,
                r = this.scheduler;
              if (r)
                return r.schedule(t.dispatch, 0, {
                  done: !1,
                  value: n,
                  subscriber: e,
                });
              e.next(n), e.closed || e.complete();
            }),
            t
          );
        })(i.Observable);
      t.ScalarObservable = o;
    },
    function (e, t, n) {
      "use strict";
      var r = n(228);
      t.from = r.FromObservable.create;
    },
    function (e, t, n) {
      "use strict";
      var r = n(78);
      t.merge = r.mergeStatic;
    },
    function (e, t, n) {
      "use strict";
      var r = n(20);
      t.of = r.ArrayObservable.of;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return this.lift(new s(e, t));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(3);
      t.filter = r;
      var s = (function () {
          function e(e, t) {
            (this.predicate = e), (this.thisArg = t);
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(new a(e, this.predicate, this.thisArg));
            }),
            e
          );
        })(),
        a = (function (e) {
          function t(t, n, r) {
            e.call(this, t),
              (this.predicate = n),
              (this.thisArg = r),
              (this.count = 0);
          }
          return (
            i(t, e),
            (t.prototype._next = function (e) {
              var t;
              try {
                t = this.predicate.call(this.thisArg, e, this.count++);
              } catch (e) {
                return void this.destination.error(e);
              }
              t && this.destination.next(e);
            }),
            t
          );
        })(o.Subscriber);
    },
    function (e, t, n) {
      "use strict";
      function r() {
        for (var e = [], t = 0; t < arguments.length; t++)
          e[t - 0] = arguments[t];
        return this.lift.call(i.apply(void 0, [this].concat(e)));
      }
      function i() {
        for (var e = [], t = 0; t < arguments.length; t++)
          e[t - 0] = arguments[t];
        var n = Number.POSITIVE_INFINITY,
          r = null,
          i = e[e.length - 1];
        return (
          l.isScheduler(i)
            ? ((r = e.pop()),
              e.length > 1 &&
                "number" == typeof e[e.length - 1] &&
                (n = e.pop()))
            : "number" == typeof i && (n = e.pop()),
          null === r && 1 === e.length && e[0] instanceof o.Observable
            ? e[0]
            : new s.ArrayObservable(e, r).lift(new a.MergeAllOperator(n))
        );
      }
      var o = n(0),
        s = n(20),
        a = n(244),
        l = n(83);
      (t.merge = r), (t.mergeStatic = i);
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = (function (e) {
          function t() {
            var t = e.call(this, "object unsubscribed");
            (this.name = t.name = "ObjectUnsubscribedError"),
              (this.stack = t.stack),
              (this.message = t.message);
          }
          return r(t, e), t;
        })(Error);
      t.ObjectUnsubscribedError = i;
    },
    function (e, t, n) {
      "use strict";
      t.isArrayLike = function (e) {
        return e && "number" == typeof e.length;
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return null != e && "object" == typeof e;
      }
      t.isObject = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return (
          e && "function" != typeof e.subscribe && "function" == typeof e.then
        );
      }
      t.isPromise = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && "function" == typeof e.schedule;
      }
      t.isScheduler = r;
    },
    function (e, t) {
      e.exports = /[\0-\x1F\x7F-\x9F]/;
    },
    function (e, t) {
      e.exports = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;
    },
    function (e, t) {
      e.exports =
        /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    },
    function (e, t) {
      e.exports = function (e) {
        return (
          e.webpackPolyfill ||
            ((e.deprecate = function () {}),
            (e.paths = []),
            e.children || (e.children = []),
            Object.defineProperty(e, "loaded", {
              enumerable: !0,
              get: function () {
                return e.l;
              },
            }),
            Object.defineProperty(e, "id", {
              enumerable: !0,
              get: function () {
                return e.i;
              },
            }),
            (e.webpackPolyfill = 1)),
          e
        );
      };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(4),
        i = n(2),
        o = n(30),
        s = n(9),
        a = n(12);
      t.App = function (e, t) {
        a.log("BotChat.App props", e), o.render(i.createElement(l, e), t);
      };
      var l = function (e) {
        return i.createElement(
          "div",
          { className: "wc-app" },
          i.createElement(s.Chat, r.__assign({}, e)),
        );
      };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = (function () {
        function e() {}
        return e;
      })();
      t.SpeechOptions = r;
    },
    function (e, t) {
      e.exports = {
        supportsInteractivity: !0,
        spacing: {
          small: 4,
          default: 8,
          medium: 16,
          large: 24,
          extraLarge: 32,
          padding: 8,
        },
        separator: { lineThickness: 1, lineColor: "#cccccc" },
        fontFamily: '"Segoe UI", sans-serif',
        fontSizes: {
          small: 12,
          default: 13,
          medium: 15,
          large: 17,
          extraLarge: 19,
        },
        fontWeights: { lighter: 200, default: 400, bolder: 700 },
        containerStyles: {
          default: {
            backgroundColor: "#00000000",
            foregroundColors: {
              default: { default: "#000000", subtle: "#808c95" },
              accent: { default: "#2e89fc", subtle: "#802E8901" },
              attention: { default: "#ffd800", subtle: "#CCFFD800" },
              good: { default: "#00ff00", subtle: "#CC00FF00" },
              warning: { default: "#ff0000", subtle: "#CCFF0000" },
            },
          },
          emphasis: {
            backgroundColor: "#08000000",
            foregroundColors: {
              default: { default: "#333333", subtle: "#EE333333" },
              accent: { default: "#2e89fc", subtle: "#882E89FC" },
              attention: { default: "#cc3300", subtle: "#DDCC3300" },
              good: { default: "#54a254", subtle: "#DD54A254" },
              warning: { default: "#e69500", subtle: "#DDE69500" },
            },
          },
        },
        imageSizes: { small: 40, medium: 80, large: 160 },
        actions: {
          maxActions: 100,
          spacing: "default",
          buttonSpacing: 8,
          showCard: { actionMode: "inline", inlineTopMargin: 8 },
          actionsOrientation: "vertical",
          actionAlignment: "stretch",
        },
        adaptiveCard: { allowCustomStyle: !1 },
        imageSet: { imageSize: "medium", maxImageHeight: 100 },
        factSet: {
          title: {
            color: "default",
            size: "default",
            isSubtle: !1,
            weight: "bolder",
            wrap: !0,
            maxWidth: 150,
          },
          value: {
            color: "default",
            size: "default",
            isSubtle: !1,
            weight: "default",
            wrap: !0,
          },
          spacing: 8,
        },
      };
    },
    function (e, t) {
      function n(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      e.exports = n;
    },
    function (e, t) {
      function n(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            "value" in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function r(e, t, r) {
        return t && n(e.prototype, t), r && n(e, r), e;
      }
      e.exports = r;
    },
    function (e, t) {
      function n(e) {
        return e && e.__esModule ? e : { default: e };
      }
      e.exports = n;
    },
    function (e, t, n) {
      function r(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            r = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols &&
            (r = r.concat(
              Object.getOwnPropertySymbols(n).filter(function (e) {
                return Object.getOwnPropertyDescriptor(n, e).enumerable;
              }),
            )),
            r.forEach(function (t) {
              i(e, t, n[t]);
            });
        }
        return e;
      }
      var i = n(40);
      e.exports = r;
    },
    function (e, t, n) {
      function r(e, t) {
        if (null == e) return {};
        var n,
          r,
          o = i(e, t);
        if (Object.getOwnPropertySymbols) {
          var s = Object.getOwnPropertySymbols(e);
          for (r = 0; r < s.length; r++)
            (n = s[r]),
              t.indexOf(n) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(e, n) &&
                  (o[n] = e[n]));
        }
        return o;
      }
      var i = n(96);
      e.exports = r;
    },
    function (e, t) {
      function n(e, t) {
        if (null == e) return {};
        var n,
          r,
          i = {},
          o = Object.keys(e);
        for (r = 0; r < o.length; r++)
          (n = o[r]), t.indexOf(n) >= 0 || (i[n] = e[n]);
        return i;
      }
      e.exports = n;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        for (var n in e) t.hasOwnProperty(n) || (t[n] = e[n]);
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        r(n(98)),
        r(n(17)),
        r(n(41));
      var i = n(25);
      t.getEnumValueOrDefault = i.getEnumValueOrDefault;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        e && e.setCollection(t);
      }
      function i(e, t) {
        if (t)
          for (var n = 0; n < t.length; n++)
            if (e.getJsonTypeName() === t[n]) return !1;
        return !0;
      }
      function o(e) {
        var t = e.type,
          n = X.actionTypeRegistry.createInstance(t);
        return (
          n
            ? n.parse(e)
            : p({
                error: h.ValidationError.UnknownActionType,
                message: "Unknown action type: " + t,
              }),
          n
        );
      }
      function s(e, t) {
        var n = e.getRootElement(),
          r = n && n.onAnchorClicked ? n.onAnchorClicked : X.onAnchorClicked;
        return null != r && r(n, t);
      }
      function a(e) {
        var t = e.parent.getRootElement(),
          n = t && t.onExecuteAction ? t.onExecuteAction : X.onExecuteAction;
        n && (e.prepare(e.parent.getRootElement().getAllInputs()), n(e));
      }
      function l(e, t) {
        var n = e.parent.getRootElement(),
          r =
            n && n.onInlineCardExpanded
              ? n.onInlineCardExpanded
              : X.onInlineCardExpanded;
        r && r(e, t);
      }
      function c(e, t) {
        void 0 === t && (t = !0);
        var n = e.getRootElement();
        t && n.updateLayout();
        var r = n,
          i =
            r && r.onElementVisibilityChanged
              ? r.onElementVisibilityChanged
              : X.onElementVisibilityChanged;
        null != i && i(e);
      }
      function u(e, t) {
        var n = e.getRootElement(),
          r = n && n.onParseElement ? n.onParseElement : X.onParseElement;
        null != r && r(e, t);
      }
      function p(e) {
        null != X.onParseError && X.onParseError(e);
      }
      var d =
        (this && this.__extends) ||
        (function () {
          var e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            };
          return function (t, n) {
            function r() {
              this.constructor = t;
            }
            e(t, n),
              (t.prototype =
                null === n
                  ? Object.create(n)
                  : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(t, "__esModule", { value: !0 });
      var h = n(17),
        f = n(25),
        m = n(41),
        g = n(99);
      t.createActionInstance = o;
      var y = (function () {
        function e(e, t, n, r) {
          void 0 === e && (e = 0),
            void 0 === t && (t = 0),
            void 0 === n && (n = 0),
            void 0 === r && (r = 0),
            (this.left = 0),
            (this.top = 0),
            (this.right = 0),
            (this.bottom = 0),
            (this.top = e),
            (this.right = t),
            (this.bottom = n),
            (this.left = r);
        }
        return e;
      })();
      t.SpacingDefinition = y;
      var v = (function () {
        function e(e, t, n, r) {
          void 0 === e && (e = h.Spacing.None),
            void 0 === t && (t = h.Spacing.None),
            void 0 === n && (n = h.Spacing.None),
            void 0 === r && (r = h.Spacing.None),
            (this.top = h.Spacing.None),
            (this.right = h.Spacing.None),
            (this.bottom = h.Spacing.None),
            (this.left = h.Spacing.None),
            (this.top = e),
            (this.right = t),
            (this.bottom = n),
            (this.left = r);
        }
        return (
          (e.prototype.toSpacingDefinition = function (e) {
            return new y(
              e.getEffectiveSpacing(this.top),
              e.getEffectiveSpacing(this.right),
              e.getEffectiveSpacing(this.bottom),
              e.getEffectiveSpacing(this.left),
            );
          }),
          e
        );
      })();
      t.PaddingDefinition = v;
      var b = (function () {
        function e() {
          (this._lang = void 0),
            (this._hostConfig = null),
            (this._internalPadding = null),
            (this._parent = null),
            (this._renderedElement = null),
            (this._separatorElement = null),
            (this._isVisible = !0),
            (this._truncatedDueToOverflow = !1),
            (this._defaultRenderedElementDisplayMode = null),
            (this._padding = null),
            (this.horizontalAlignment = null),
            (this.spacing = h.Spacing.Default),
            (this.separator = !1),
            (this.height = "auto");
        }
        return (
          (e.prototype.internalRenderSeparator = function () {
            return f.renderSeparation(
              {
                spacing: this.hostConfig.getEffectiveSpacing(this.spacing),
                lineThickness: this.separator
                  ? this.hostConfig.separator.lineThickness
                  : null,
                lineColor: this.separator
                  ? this.hostConfig.separator.lineColor
                  : null,
              },
              this.separatorOrientation,
            );
          }),
          (e.prototype.updateRenderedElementVisibility = function () {
            this._renderedElement &&
              (this._renderedElement.style.display = this._isVisible
                ? this._defaultRenderedElementDisplayMode
                : "none"),
              this._separatorElement &&
                (this._separatorElement.style.display = this._isVisible
                  ? this._defaultRenderedElementDisplayMode
                  : "none");
          }),
          (e.prototype.hideElementDueToOverflow = function () {
            this._renderedElement &&
              this._isVisible &&
              ((this._renderedElement.style.visibility = "hidden"),
              (this._isVisible = !1),
              c(this, !1));
          }),
          (e.prototype.showElementHiddenDueToOverflow = function () {
            this._renderedElement &&
              !this._isVisible &&
              ((this._renderedElement.style.visibility = null),
              (this._isVisible = !0),
              c(this, !1));
          }),
          (e.prototype.handleOverflow = function (e) {
            if (this.isVisible || this.isHiddenDueToOverflow()) {
              var t = this.truncateOverflow(e);
              (this._truncatedDueToOverflow =
                t || this._truncatedDueToOverflow),
                t
                  ? t &&
                    !this._isVisible &&
                    this.showElementHiddenDueToOverflow()
                  : this.hideElementDueToOverflow();
            }
          }),
          (e.prototype.resetOverflow = function () {
            var e = !1;
            return (
              this._truncatedDueToOverflow &&
                (this.undoOverflowTruncation(),
                (this._truncatedDueToOverflow = !1),
                (e = !0)),
              this.isHiddenDueToOverflow &&
                this.showElementHiddenDueToOverflow(),
              e
            );
          }),
          (e.prototype.internalGetNonZeroPadding = function (e, t, n, r, i) {
            void 0 === t && (t = !0),
              void 0 === n && (n = !0),
              void 0 === r && (r = !0),
              void 0 === i && (i = !0),
              t &&
                e.top == h.Spacing.None &&
                (e.top = this.internalPadding.top),
              n &&
                e.right == h.Spacing.None &&
                (e.right = this.internalPadding.right),
              r &&
                e.bottom == h.Spacing.None &&
                (e.bottom = this.internalPadding.bottom),
              i &&
                e.left == h.Spacing.None &&
                (e.left = this.internalPadding.left),
              this.parent &&
                this.parent.internalGetNonZeroPadding(
                  e,
                  t && this.isAtTheVeryTop(),
                  n && this.isAtTheVeryRight(),
                  r && this.isAtTheVeryBottom(),
                  i && this.isAtTheVeryLeft(),
                );
          }),
          (e.prototype.adjustRenderedElementSize = function (e) {
            "auto" === this.height
              ? (e.style.flex = "0 0 auto")
              : (e.style.flex = "1 1 100%");
          }),
          (e.prototype.showBottomSpacer = function (e) {
            this.parent && this.parent.showBottomSpacer(e);
          }),
          (e.prototype.hideBottomSpacer = function (e) {
            this.parent && this.parent.hideBottomSpacer(e);
          }),
          (e.prototype.truncateOverflow = function (e) {
            return !1;
          }),
          (e.prototype.undoOverflowTruncation = function () {}),
          Object.defineProperty(e.prototype, "useDefaultSizing", {
            get: function () {
              return !0;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "allowCustomPadding", {
            get: function () {
              return !0;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "defaultPadding", {
            get: function () {
              return new v();
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "internalPadding", {
            get: function () {
              return this._padding
                ? this._padding
                : this._internalPadding && this.allowCustomPadding
                ? this._internalPadding
                : this.defaultPadding;
            },
            set: function (e) {
              this._internalPadding = e;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "separatorOrientation", {
            get: function () {
              return h.Orientation.Horizontal;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (e.prototype.getPadding = function () {
            return this._padding;
          }),
          (e.prototype.setPadding = function (e) {
            (this._padding = e),
              this._padding && (X.useAutomaticContainerBleeding = !1);
          }),
          (e.prototype.setParent = function (e) {
            this._parent = e;
          }),
          (e.prototype.getNonZeroPadding = function () {
            var e = new v();
            return this.internalGetNonZeroPadding(e), e;
          }),
          (e.prototype.getForbiddenElementTypes = function () {
            return null;
          }),
          (e.prototype.getForbiddenActionTypes = function () {
            return null;
          }),
          (e.prototype.parse = function (e) {
            u(this, e),
              (this.id = e.id),
              (this.speak = e.speak),
              (this.horizontalAlignment = f.getEnumValueOrDefault(
                h.HorizontalAlignment,
                e.horizontalAlignment,
                null,
              )),
              (this.spacing = f.getEnumValueOrDefault(
                h.Spacing,
                e.spacing,
                h.Spacing.Default,
              )),
              (this.separator = e.separator);
            var t = e.separation;
            void 0 !== t &&
              ("none" === t
                ? ((this.spacing = h.Spacing.None), (this.separator = !1))
                : "strong" === t
                ? ((this.spacing = h.Spacing.Large), (this.separator = !0))
                : "default" === t &&
                  ((this.spacing = h.Spacing.Default), (this.separator = !1)),
              p({
                error: h.ValidationError.Deprecated,
                message:
                  'The "separation" property is deprecated and will be removed. Use the "spacing" and "separator" properties instead.',
              }));
            var n = e.height;
            ("auto" !== n && "stretch" !== n) || (this.height = n);
          }),
          (e.prototype.validate = function () {
            return [];
          }),
          (e.prototype.render = function () {
            return (
              (this._renderedElement = this.internalRender()),
              (this._separatorElement = this.internalRenderSeparator()),
              this._renderedElement &&
                ((this._renderedElement.style.boxSizing = "border-box"),
                (this._defaultRenderedElementDisplayMode =
                  this._renderedElement.style.display),
                this.adjustRenderedElementSize(this._renderedElement),
                this.updateLayout(!1),
                this.updateRenderedElementVisibility()),
              this._renderedElement
            );
          }),
          (e.prototype.updateLayout = function (e) {
            void 0 === e && (e = !0);
          }),
          (e.prototype.isRendered = function () {
            return (
              this._renderedElement && this._renderedElement.offsetHeight > 0
            );
          }),
          (e.prototype.isAtTheVeryTop = function () {
            return (
              !this.parent ||
              (this.parent.isFirstElement(this) && this.parent.isAtTheVeryTop())
            );
          }),
          (e.prototype.isFirstElement = function (e) {
            return !0;
          }),
          (e.prototype.isAtTheVeryBottom = function () {
            return (
              !this.parent ||
              (this.parent.isLastElement(this) &&
                this.parent.isAtTheVeryBottom())
            );
          }),
          (e.prototype.isLastElement = function (e) {
            return !0;
          }),
          (e.prototype.isAtTheVeryLeft = function () {
            return (
              !this.parent ||
              (this.parent.isLeftMostElement(this) &&
                this.parent.isAtTheVeryLeft())
            );
          }),
          (e.prototype.isLeftMostElement = function (e) {
            return !0;
          }),
          (e.prototype.isAtTheVeryRight = function () {
            return (
              !this.parent ||
              (this.parent.isRightMostElement(this) &&
                this.parent.isAtTheVeryRight())
            );
          }),
          (e.prototype.isRightMostElement = function (e) {
            return !0;
          }),
          (e.prototype.isHiddenDueToOverflow = function () {
            return (
              this._renderedElement &&
              "hidden" == this._renderedElement.style.visibility
            );
          }),
          (e.prototype.canContentBleed = function () {
            return !this.parent || this.parent.canContentBleed();
          }),
          (e.prototype.getRootElement = function () {
            for (var e = this; e.parent; ) e = e.parent;
            return e;
          }),
          (e.prototype.getParentContainer = function () {
            for (var e = this.parent; e; ) {
              if (e instanceof H) return e;
              e = e.parent;
            }
            return null;
          }),
          (e.prototype.getAllInputs = function () {
            return [];
          }),
          (e.prototype.getElementById = function (e) {
            return this.id === e ? this : null;
          }),
          (e.prototype.getActionById = function (e) {
            return null;
          }),
          Object.defineProperty(e.prototype, "lang", {
            get: function () {
              return this._lang
                ? this._lang
                : this.parent
                ? this.parent.lang
                : void 0;
            },
            set: function (e) {
              if (e && "" != e) {
                if (!/^[a-z]{2,3}$/gi.exec(e))
                  throw new Error("Invalid language identifier: " + e);
              }
              this._lang = e;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "hostConfig", {
            get: function () {
              return this._hostConfig
                ? this._hostConfig
                : this.parent
                ? this.parent.hostConfig
                : ee;
            },
            set: function (e) {
              this._hostConfig = e;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "isInteractive", {
            get: function () {
              return !1;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "isStandalone", {
            get: function () {
              return !0;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "parent", {
            get: function () {
              return this._parent;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "isVisible", {
            get: function () {
              return this._isVisible;
            },
            set: function (e) {
              X.useAdvancedCardBottomTruncation &&
                !e &&
                this.undoOverflowTruncation(),
                this._isVisible != e &&
                  ((this._isVisible = e),
                  this.updateRenderedElementVisibility(),
                  this._renderedElement && c(this));
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "renderedElement", {
            get: function () {
              return this._renderedElement;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "separatorElement", {
            get: function () {
              return this._separatorElement;
            },
            enumerable: !0,
            configurable: !0,
          }),
          e
        );
      })();
      t.CardElement = b;
      var _ = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (
            (t.size = h.TextSize.Default),
            (t.weight = h.TextWeight.Default),
            (t.color = h.TextColor.Default),
            (t.isSubtle = !1),
            (t.wrap = !1),
            (t.useMarkdown = !0),
            t
          );
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            var e = this;
            if (f.isNullOrEmpty(this.text)) return null;
            var t = document.createElement("div");
            switch (
              ((t.style.overflow = "hidden"),
              this.hostConfig.fontFamily &&
                (t.style.fontFamily = this.hostConfig.fontFamily),
              this.horizontalAlignment)
            ) {
              case h.HorizontalAlignment.Center:
                t.style.textAlign = "center";
                break;
              case h.HorizontalAlignment.Right:
                t.style.textAlign = "right";
                break;
              default:
                t.style.textAlign = "left";
            }
            var n;
            switch (this.size) {
              case h.TextSize.Small:
                n = this.hostConfig.fontSizes.small;
                break;
              case h.TextSize.Medium:
                n = this.hostConfig.fontSizes.medium;
                break;
              case h.TextSize.Large:
                n = this.hostConfig.fontSizes.large;
                break;
              case h.TextSize.ExtraLarge:
                n = this.hostConfig.fontSizes.extraLarge;
                break;
              default:
                n = this.hostConfig.fontSizes.default;
            }
            (this._computedLineHeight = 1.33 * n),
              (t.style.fontSize = n + "px"),
              (t.style.lineHeight = this._computedLineHeight + "px");
            var r,
              i = this.getParentContainer(),
              o = this.hostConfig.containerStyles.getStyleByName(
                i ? i.style : h.ContainerStyle.Default,
                this.hostConfig.containerStyles.default,
              ),
              a = this.color ? this.color : h.TextColor.Default;
            switch (a) {
              case h.TextColor.Accent:
                r = o.foregroundColors.accent;
                break;
              case h.TextColor.Dark:
                r = o.foregroundColors.dark;
                break;
              case h.TextColor.Light:
                r = o.foregroundColors.light;
                break;
              case h.TextColor.Good:
                r = o.foregroundColors.good;
                break;
              case h.TextColor.Warning:
                r = o.foregroundColors.warning;
                break;
              case h.TextColor.Attention:
                r = o.foregroundColors.attention;
                break;
              default:
                r = o.foregroundColors.default;
            }
            t.style.color = f.stringToCssColor(
              this.isSubtle ? r.subtle : r.default,
            );
            var l;
            switch (this.weight) {
              case h.TextWeight.Lighter:
                l = this.hostConfig.fontWeights.lighter;
                break;
              case h.TextWeight.Bolder:
                l = this.hostConfig.fontWeights.bolder;
                break;
              default:
                l = this.hostConfig.fontWeights.default;
            }
            t.style.fontWeight = l.toString();
            var c = g.formatText(this.lang, this.text);
            if (
              ((t.innerHTML = this.useMarkdown ? X.processMarkdown(c) : c),
              t.firstElementChild instanceof HTMLElement)
            ) {
              var u = t.firstElementChild;
              (u.style.marginTop = "0px"),
                (u.style.width = "100%"),
                this.wrap ||
                  ((u.style.overflow = "hidden"),
                  (u.style.textOverflow = "ellipsis"));
            }
            t.lastElementChild instanceof HTMLElement &&
              (t.lastElementChild.style.marginBottom = "0px");
            for (
              var p = t.getElementsByTagName("a"), d = 0;
              d < p.length;
              d++
            ) {
              var m = p[d];
              m.classList.add("ac-anchor"),
                (m.target = "_blank"),
                (m.onclick = function (t) {
                  s(e, t.target) && t.preventDefault();
                });
            }
            return (
              this.wrap
                ? ((t.style.wordWrap = "break-word"),
                  this.maxLines > 0 &&
                    ((t.style.maxHeight =
                      this._computedLineHeight * this.maxLines + "px"),
                    (t.style.overflow = "hidden")))
                : ((t.style.whiteSpace = "nowrap"),
                  (t.style.textOverflow = "ellipsis")),
              (X.useAdvancedTextBlockTruncation ||
                X.useAdvancedCardBottomTruncation) &&
                (this._originalInnerHtml = t.innerHTML),
              t
            );
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t), (this.text = t.text);
            var n = t.size;
            n && "string" == typeof n && "normal" === n.toLowerCase()
              ? ((this.size = h.TextSize.Default),
                p({
                  error: h.ValidationError.Deprecated,
                  message:
                    'The TextBlock.size value "normal" is deprecated and will be removed. Use "default" instead.',
                }))
              : (this.size = f.getEnumValueOrDefault(h.TextSize, n, this.size));
            var r = t.weight;
            r && "string" == typeof r && "normal" === r.toLowerCase()
              ? ((this.weight = h.TextWeight.Default),
                p({
                  error: h.ValidationError.Deprecated,
                  message:
                    'The TextBlock.weight value "normal" is deprecated and will be removed. Use "default" instead.',
                }))
              : (this.weight = f.getEnumValueOrDefault(
                  h.TextWeight,
                  r,
                  this.weight,
                )),
              (this.color = f.getEnumValueOrDefault(
                h.TextColor,
                t.color,
                this.color,
              )),
              (this.isSubtle = t.isSubtle),
              (this.wrap = void 0 !== t.wrap && t.wrap),
              (this.maxLines = t.maxLines);
          }),
          (t.prototype.getJsonTypeName = function () {
            return "TextBlock";
          }),
          (t.prototype.renderSpeech = function () {
            return null != this.speak
              ? this.speak + "\n"
              : this.text
              ? "<s>" + this.text + "</s>\n"
              : null;
          }),
          (t.prototype.updateLayout = function (e) {
            if (
              (void 0 === e && (e = !1),
              X.useAdvancedTextBlockTruncation &&
                this.maxLines &&
                this.isRendered())
            ) {
              this.restoreOriginalContent();
              var t = this._computedLineHeight * this.maxLines;
              this.truncateIfSupported(t);
            }
          }),
          (t.prototype.truncateOverflow = function (e) {
            return e >= this._computedLineHeight && this.truncateIfSupported(e);
          }),
          (t.prototype.undoOverflowTruncation = function () {
            if (
              (this.restoreOriginalContent(),
              X.useAdvancedTextBlockTruncation && this.maxLines)
            ) {
              var e = this._computedLineHeight * this.maxLines;
              this.truncateIfSupported(e);
            }
          }),
          (t.prototype.restoreOriginalContent = function () {
            var e = this.maxLines
              ? this._computedLineHeight * this.maxLines + "px"
              : null;
            (this.renderedElement.style.maxHeight = e),
              (this.renderedElement.innerHTML = this._originalInnerHtml);
          }),
          (t.prototype.truncateIfSupported = function (e) {
            var t = this.renderedElement.children,
              n = !t.length;
            if (n || (1 == t.length && "p" == t[0].tagName.toLowerCase())) {
              var r = n ? this.renderedElement : t[0];
              return f.truncate(r, e, this._computedLineHeight), !0;
            }
            return !1;
          }),
          t
        );
      })(b);
      t.TextBlock = _;
      var w = (function () {
        function e() {}
        return (
          (e.prototype.renderSpeech = function () {
            return null != this.speak
              ? this.speak + "\n"
              : "<s>" + this.name + " " + this.value + "</s>\n";
          }),
          e
        );
      })();
      t.Fact = w;
      var C = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (t.facts = []), t;
        }
        return (
          d(t, e),
          Object.defineProperty(t.prototype, "useDefaultSizing", {
            get: function () {
              return !1;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.internalRender = function () {
            var e = null;
            if (this.facts.length > 0) {
              (e = document.createElement("table")),
                (e.style.borderWidth = "0px"),
                (e.style.borderSpacing = "0px"),
                (e.style.borderStyle = "none"),
                (e.style.borderCollapse = "collapse"),
                (e.style.display = "block"),
                (e.style.overflow = "hidden");
              for (var t = 0; t < this.facts.length; t++) {
                var n = document.createElement("tr");
                t > 0 &&
                  (n.style.marginTop = this.hostConfig.factSet.spacing + "px");
                var r = document.createElement("td");
                (r.style.padding = "0"),
                  this.hostConfig.factSet.title.maxWidth &&
                    (r.style.maxWidth =
                      this.hostConfig.factSet.title.maxWidth + "px"),
                  (r.style.verticalAlign = "top");
                var i = new _();
                (i.hostConfig = this.hostConfig),
                  (i.text = this.facts[t].name),
                  (i.size = this.hostConfig.factSet.title.size),
                  (i.color = this.hostConfig.factSet.title.color),
                  (i.isSubtle = this.hostConfig.factSet.title.isSubtle),
                  (i.weight = this.hostConfig.factSet.title.weight),
                  (i.wrap = this.hostConfig.factSet.title.wrap),
                  (i.spacing = h.Spacing.None),
                  f.appendChild(r, i.render()),
                  f.appendChild(n, r),
                  (r = document.createElement("td")),
                  (r.style.padding = "0px 0px 0px 10px"),
                  (r.style.verticalAlign = "top"),
                  (i = new _()),
                  (i.hostConfig = this.hostConfig),
                  (i.text = this.facts[t].value),
                  (i.size = this.hostConfig.factSet.value.size),
                  (i.color = this.hostConfig.factSet.value.color),
                  (i.isSubtle = this.hostConfig.factSet.value.isSubtle),
                  (i.weight = this.hostConfig.factSet.value.weight),
                  (i.wrap = this.hostConfig.factSet.value.wrap),
                  (i.spacing = h.Spacing.None),
                  f.appendChild(r, i.render()),
                  f.appendChild(n, r),
                  f.appendChild(e, n);
              }
            }
            return e;
          }),
          (t.prototype.getJsonTypeName = function () {
            return "FactSet";
          }),
          (t.prototype.parse = function (t) {
            if ((e.prototype.parse.call(this, t), null != t.facts)) {
              var n = t.facts;
              this.facts = [];
              for (var r = 0; r < n.length; r++) {
                var i = new w();
                (i.name = n[r].title),
                  (i.value = n[r].value),
                  (i.speak = n[r].speak),
                  this.facts.push(i);
              }
            }
          }),
          (t.prototype.renderSpeech = function () {
            if (null != this.speak) return this.speak + "\n";
            var e = null;
            if (this.facts.length > 0) {
              e = "";
              for (var t = 0; t < this.facts.length; t++) {
                var n = this.facts[t].renderSpeech();
                n && (e += n);
              }
            }
            return "<p>" + e + "\n</p>\n";
          }),
          t
        );
      })(b);
      t.FactSet = C;
      var S = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (
            (t.style = h.ImageStyle.Default),
            (t.size = h.Size.Auto),
            (t.pixelWidth = null),
            (t.pixelHeight = null),
            (t.altText = ""),
            t
          );
        }
        return (
          d(t, e),
          Object.defineProperty(t.prototype, "useDefaultSizing", {
            get: function () {
              return !1;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.internalRender = function () {
            var e = this,
              t = null;
            if (!f.isNullOrEmpty(this.url)) {
              switch (
                ((t = document.createElement("div")),
                t.classList.add("ac-image"),
                (t.style.display = "flex"),
                (t.style.alignItems = "flex-start"),
                null != this.selectAction &&
                  this.hostConfig.supportsInteractivity &&
                  ((t.tabIndex = 0),
                  t.setAttribute("role", "button"),
                  t.setAttribute("aria-label", this.selectAction.title),
                  t.classList.add("ac-selectable")),
                (t.onkeypress = function (t) {
                  e.selectAction &&
                    ((13 != t.keyCode && 32 != t.keyCode) ||
                      e.selectAction.execute());
                }),
                (t.onclick = function (t) {
                  e.selectAction &&
                    (e.selectAction.execute(), (t.cancelBubble = !0));
                }),
                this.horizontalAlignment)
              ) {
                case h.HorizontalAlignment.Center:
                  t.style.justifyContent = "center";
                  break;
                case h.HorizontalAlignment.Right:
                  t.style.justifyContent = "flex-end";
                  break;
                default:
                  t.style.justifyContent = "flex-start";
              }
              var n = document.createElement("img");
              if (
                ((n.style.maxHeight = "100%"),
                (n.style.minWidth = "0"),
                this.pixelWidth || this.pixelHeight)
              )
                this.pixelWidth && (n.style.width = this.pixelWidth + "px"),
                  this.pixelHeight &&
                    (n.style.height = this.pixelHeight + "px");
              else
                switch (this.size) {
                  case h.Size.Stretch:
                    n.style.width = "100%";
                    break;
                  case h.Size.Auto:
                    n.style.maxWidth = "100%";
                    break;
                  case h.Size.Small:
                    n.style.width = this.hostConfig.imageSizes.small + "px";
                    break;
                  case h.Size.Large:
                    n.style.width = this.hostConfig.imageSizes.large + "px";
                    break;
                  case h.Size.Medium:
                    n.style.width = this.hostConfig.imageSizes.medium + "px";
                }
              this.style === h.ImageStyle.Person &&
                ((n.style.borderRadius = "50%"),
                (n.style.backgroundPosition = "50% 50%"),
                (n.style.backgroundRepeat = "no-repeat")),
                f.isNullOrEmpty(this.backgroundColor) ||
                  (n.style.backgroundColor = f.stringToCssColor(
                    this.backgroundColor,
                  )),
                (n.src = this.url),
                (n.alt = this.altText),
                t.appendChild(n);
            }
            return t;
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Image";
          }),
          (t.prototype.getActionById = function (t) {
            var n = e.prototype.getActionById.call(this, t);
            return (
              !n &&
                this.selectAction &&
                (n = this.selectAction.getActionById(t)),
              n
            );
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t), (this.url = t.url);
            var n = t.style;
            n && "string" == typeof n && "normal" === n.toLowerCase()
              ? ((this.style = h.ImageStyle.Default),
                p({
                  error: h.ValidationError.Deprecated,
                  message:
                    'The Image.style value "normal" is deprecated and will be removed. Use "default" instead.',
                }))
              : (this.style = f.getEnumValueOrDefault(
                  h.ImageStyle,
                  n,
                  this.style,
                )),
              (this.size = f.getEnumValueOrDefault(h.Size, t.size, this.size)),
              (this.altText = t.altText);
            var r = t.selectAction;
            void 0 != r && (this.selectAction = o(r)),
              t.pixelWidth &&
                "number" == typeof t.pixelWidth &&
                (this.pixelWidth = t.pixelWidth),
              t.pixelHeight &&
                "number" == typeof t.pixelHeight &&
                (this.pixelHeight = t.pixelHeight);
          }),
          (t.prototype.renderSpeech = function () {
            return null != this.speak ? this.speak + "\n" : null;
          }),
          Object.defineProperty(t.prototype, "selectAction", {
            get: function () {
              return this._selectAction;
            },
            set: function (e) {
              (this._selectAction = e),
                this._selectAction && this._selectAction.setParent(this);
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(b);
      t.Image = S;
      var k = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (t._images = []), (t.imageSize = h.Size.Medium), t;
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            var e = null;
            if (this._images.length > 0) {
              (e = document.createElement("div")),
                (e.style.display = "flex"),
                (e.style.flexWrap = "wrap");
              for (var t = 0; t < this._images.length; t++) {
                var n = this._images[t].render();
                (n.style.display = "inline-flex"),
                  (n.style.margin = "0px"),
                  (n.style.marginRight = "10px"),
                  (n.style.maxHeight =
                    this.hostConfig.imageSet.maxImageHeight + "px"),
                  f.appendChild(e, n);
              }
            }
            return e;
          }),
          (t.prototype.getJsonTypeName = function () {
            return "ImageSet";
          }),
          (t.prototype.parse = function (t) {
            if (
              (e.prototype.parse.call(this, t),
              (this.imageSize = f.getEnumValueOrDefault(
                h.Size,
                t.imageSize,
                h.Size.Medium,
              )),
              null != t.images)
            ) {
              var n = t.images;
              this._images = [];
              for (var r = 0; r < n.length; r++) {
                var i = new S();
                i.parse(n[r]), (i.size = this.imageSize), this.addImage(i);
              }
            }
          }),
          (t.prototype.addImage = function (e) {
            if (e.parent)
              throw new Error("This image already belongs to another ImageSet");
            this._images.push(e), e.setParent(this);
          }),
          (t.prototype.renderSpeech = function () {
            if (null != this.speak) return this.speak;
            var e = null;
            if (this._images.length > 0) {
              e = "";
              for (var t = 0; t < this._images.length; t++)
                e += this._images[t].renderSpeech();
            }
            return e;
          }),
          t
        );
      })(b);
      t.ImageSet = k;
      var x = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          d(t, e),
          (t.prototype.validate = function () {
            return this.id
              ? []
              : [
                  {
                    error: h.ValidationError.PropertyCantBeNull,
                    message: "All inputs must have a unique Id",
                  },
                ];
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t),
              (this.id = t.id),
              (this.defaultValue = t.value);
          }),
          (t.prototype.renderSpeech = function () {
            return null != this.speak
              ? this.speak
              : this.title
              ? "<s>" + this.title + "</s>\n"
              : null;
          }),
          (t.prototype.getAllInputs = function () {
            return [this];
          }),
          Object.defineProperty(t.prototype, "isInteractive", {
            get: function () {
              return !0;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(b);
      t.Input = x;
      var E = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            return this.isMultiline
              ? ((this._textareaElement = document.createElement("textarea")),
                (this._textareaElement.className =
                  "ac-input ac-textInput ac-multiline"),
                (this._textareaElement.style.width = "100%"),
                (this._textareaElement.tabIndex = 0),
                f.isNullOrEmpty(this.placeholder) ||
                  ((this._textareaElement.placeholder = this.placeholder),
                  this._textareaElement.setAttribute(
                    "aria-label",
                    this.placeholder,
                  )),
                f.isNullOrEmpty(this.defaultValue) ||
                  (this._textareaElement.value = this.defaultValue),
                this.maxLength > 0 &&
                  (this._textareaElement.maxLength = this.maxLength),
                this._textareaElement)
              : ((this._inputElement = document.createElement("input")),
                (this._inputElement.type = "text"),
                (this._inputElement.className = "ac-input ac-textInput"),
                (this._inputElement.style.width = "100%"),
                (this._inputElement.tabIndex = 0),
                f.isNullOrEmpty(this.placeholder) ||
                  ((this._inputElement.placeholder = this.placeholder),
                  this._inputElement.setAttribute(
                    "aria-label",
                    this.placeholder,
                  )),
                f.isNullOrEmpty(this.defaultValue) ||
                  (this._inputElement.value = this.defaultValue),
                this.maxLength > 0 &&
                  (this._inputElement.maxLength = this.maxLength),
                this._inputElement);
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Input.Text";
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t),
              (this.maxLength = t.maxLength),
              (this.isMultiline = t.isMultiline),
              (this.placeholder = t.placeholder);
          }),
          Object.defineProperty(t.prototype, "value", {
            get: function () {
              return this.isMultiline
                ? this._textareaElement
                  ? this._textareaElement.value
                  : null
                : this._inputElement
                ? this._inputElement.value
                : null;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(x);
      t.TextInput = E;
      var T = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (t.valueOn = "true"), (t.valueOff = "false"), t;
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            var e = document.createElement("div");
            (e.className = "ac-input"),
              (e.style.width = "100%"),
              (e.style.display = "flex"),
              (this._checkboxInputElement = document.createElement("input")),
              (this._checkboxInputElement.type = "checkbox"),
              (this._checkboxInputElement.style.display = "inline-block"),
              (this._checkboxInputElement.style.verticalAlign = "middle"),
              (this._checkboxInputElement.style.margin = "0"),
              (this._checkboxInputElement.style.flex = "0 0 auto"),
              this._checkboxInputElement.setAttribute("aria-label", this.title),
              (this._checkboxInputElement.tabIndex = 0),
              this.defaultValue == this.valueOn &&
                (this._checkboxInputElement.checked = !0);
            var t = new _();
            (t.hostConfig = this.hostConfig),
              (t.text = this.title),
              (t.useMarkdown = X.useMarkdownInRadioButtonAndCheckbox);
            var n = t.render();
            (n.style.display = "inline-block"),
              (n.style.marginLeft = "6px"),
              (n.style.verticalAlign = "middle");
            document.createElement("div");
            return (
              f.appendChild(e, this._checkboxInputElement),
              f.appendChild(e, n),
              e
            );
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Input.Toggle";
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t),
              (this.title = t.title),
              (this.valueOn = f.getValueOrDefault(t.valueOn, this.valueOn)),
              (this.valueOff = f.getValueOrDefault(t.valueOff, this.valueOff));
          }),
          Object.defineProperty(t.prototype, "value", {
            get: function () {
              return this._checkboxInputElement
                ? this._checkboxInputElement.checked
                  ? this.valueOn
                  : this.valueOff
                : null;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(x);
      t.ToggleInput = T;
      var A = (function () {
        function e() {}
        return e;
      })();
      t.Choice = A;
      var O = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (t.choices = []), t;
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            if (this.isMultiSelect) {
              var e = this.defaultValue
                  ? this.defaultValue.split(
                      this.hostConfig.choiceSetInputValueSeparator,
                    )
                  : null,
                t = document.createElement("div");
              (t.className = "ac-input"),
                (t.style.width = "100%"),
                (this._toggleInputs = []);
              for (var n = 0; n < this.choices.length; n++) {
                var r = document.createElement("input");
                (r.type = "checkbox"),
                  (r.style.margin = "0"),
                  (r.style.display = "inline-block"),
                  (r.style.verticalAlign = "middle"),
                  (r.value = this.choices[n].value),
                  (r.style.flex = "0 0 auto"),
                  r.setAttribute("aria-label", this.choices[n].title),
                  e &&
                    e.indexOf(this.choices[n].value) >= 0 &&
                    (r.checked = !0),
                  this._toggleInputs.push(r);
                var i = new _();
                (i.hostConfig = this.hostConfig),
                  (i.text = this.choices[n].title),
                  (i.useMarkdown = X.useMarkdownInRadioButtonAndCheckbox);
                var o = i.render();
                (o.style.display = "inline-block"),
                  (o.style.marginLeft = "6px"),
                  (o.style.verticalAlign = "middle");
                var s = document.createElement("div");
                (s.style.display = "flex"),
                  f.appendChild(s, r),
                  f.appendChild(s, o),
                  f.appendChild(t, s);
              }
              return t;
            }
            if (this.isCompact) {
              (this._selectElement = document.createElement("select")),
                (this._selectElement.className =
                  "ac-input ac-multichoiceInput"),
                (this._selectElement.style.width = "100%");
              var a = document.createElement("option");
              (a.selected = !0),
                (a.disabled = !0),
                (a.hidden = !0),
                this.placeholder && (a.text = this.placeholder),
                f.appendChild(this._selectElement, a);
              for (var n = 0; n < this.choices.length; n++) {
                var a = document.createElement("option");
                (a.value = this.choices[n].value),
                  (a.text = this.choices[n].title),
                  a.setAttribute("aria-label", this.choices[n].title),
                  this.choices[n].value == this.defaultValue &&
                    (a.selected = !0),
                  f.appendChild(this._selectElement, a);
              }
              return this._selectElement;
            }
            var t = document.createElement("div");
            (t.className = "ac-input"),
              (t.style.width = "100%"),
              (this._toggleInputs = []);
            for (var n = 0; n < this.choices.length; n++) {
              var l = document.createElement("input");
              (l.type = "radio"),
                (l.style.margin = "0"),
                (l.style.display = "inline-block"),
                (l.style.verticalAlign = "middle"),
                (l.name = this.id),
                (l.value = this.choices[n].value),
                (l.style.flex = "0 0 auto"),
                l.setAttribute("aria-label", this.choices[n].title),
                this.choices[n].value == this.defaultValue && (l.checked = !0),
                this._toggleInputs.push(l);
              var i = new _();
              (i.hostConfig = this.hostConfig),
                (i.text = this.choices[n].title),
                (i.useMarkdown = X.useMarkdownInRadioButtonAndCheckbox);
              var o = i.render();
              (o.style.display = "inline-block"),
                (o.style.marginLeft = "6px"),
                (o.style.verticalAlign = "middle");
              var s = document.createElement("div");
              (s.style.display = "flex"),
                f.appendChild(s, l),
                f.appendChild(s, o),
                f.appendChild(t, s);
            }
            return t;
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Input.ChoiceSet";
          }),
          (t.prototype.validate = function () {
            var e = [];
            0 == this.choices.length &&
              (e = [
                {
                  error: h.ValidationError.CollectionCantBeEmpty,
                  message:
                    "An Input.ChoiceSet must have at least one choice defined.",
                },
              ]);
            for (var t = 0; t < this.choices.length; t++)
              if (!this.choices[t].title || !this.choices[t].value) {
                e = e.concat([
                  {
                    error: h.ValidationError.PropertyCantBeNull,
                    message:
                      "All choices in an Input.ChoiceSet must have their title and value properties set.",
                  },
                ]);
                break;
              }
            return e;
          }),
          (t.prototype.parse = function (t) {
            if (
              (e.prototype.parse.call(this, t),
              (this.isCompact = !("expanded" === t.style)),
              (this.isMultiSelect = t.isMultiSelect),
              (this.placeholder = t.placeholder),
              void 0 != t.choices)
            ) {
              var n = t.choices;
              this.choices = [];
              for (var r = 0; r < n.length; r++) {
                var i = new A();
                (i.title = n[r].title),
                  (i.value = n[r].value),
                  this.choices.push(i);
              }
            }
          }),
          Object.defineProperty(t.prototype, "value", {
            get: function () {
              if (this.isMultiSelect) {
                if (!this._toggleInputs || 0 == this._toggleInputs.length)
                  return null;
                for (var e = "", t = 0; t < this._toggleInputs.length; t++)
                  this._toggleInputs[t].checked &&
                    ("" != e &&
                      (e += this.hostConfig.choiceSetInputValueSeparator),
                    (e += this._toggleInputs[t].value));
                return "" == e ? null : e;
              }
              if (this.isCompact)
                return this._selectElement ? this._selectElement.value : null;
              if (!this._toggleInputs || 0 == this._toggleInputs.length)
                return null;
              for (var t = 0; t < this._toggleInputs.length; t++)
                if (this._toggleInputs[t].checked)
                  return this._toggleInputs[t].value;
              return null;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(x);
      t.ChoiceSetInput = O;
      var P = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            return (
              (this._numberInputElement = document.createElement("input")),
              this._numberInputElement.setAttribute("type", "number"),
              (this._numberInputElement.className = "ac-input ac-numberInput"),
              this._numberInputElement.setAttribute("min", this.min),
              this._numberInputElement.setAttribute("max", this.max),
              (this._numberInputElement.style.width = "100%"),
              (this._numberInputElement.tabIndex = 0),
              f.isNullOrEmpty(this.defaultValue) ||
                (this._numberInputElement.value = this.defaultValue),
              f.isNullOrEmpty(this.placeholder) ||
                ((this._numberInputElement.placeholder = this.placeholder),
                this._numberInputElement.setAttribute(
                  "aria-label",
                  this.placeholder,
                )),
              this._numberInputElement
            );
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Input.Number";
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t),
              (this.placeholder = t.placeholder),
              (this.min = t.min),
              (this.max = t.max);
          }),
          Object.defineProperty(t.prototype, "value", {
            get: function () {
              return this._numberInputElement
                ? this._numberInputElement.value
                : null;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(x);
      t.NumberInput = P;
      var I = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            return (
              (this._dateInputElement = document.createElement("input")),
              this._dateInputElement.setAttribute("type", "date"),
              (this._dateInputElement.className = "ac-input ac-dateInput"),
              (this._dateInputElement.style.width = "100%"),
              f.isNullOrEmpty(this.defaultValue) ||
                (this._dateInputElement.value = this.defaultValue),
              this._dateInputElement
            );
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Input.Date";
          }),
          Object.defineProperty(t.prototype, "value", {
            get: function () {
              return this._dateInputElement
                ? this._dateInputElement.value
                : null;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(x);
      t.DateInput = I;
      var D = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            return (
              (this._timeInputElement = document.createElement("input")),
              this._timeInputElement.setAttribute("type", "time"),
              (this._timeInputElement.className = "ac-input ac-timeInput"),
              (this._timeInputElement.style.width = "100%"),
              f.isNullOrEmpty(this.defaultValue) ||
                (this._timeInputElement.value = this.defaultValue),
              this._timeInputElement
            );
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Input.Time";
          }),
          Object.defineProperty(t.prototype, "value", {
            get: function () {
              return this._timeInputElement
                ? this._timeInputElement.value
                : null;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(x);
      t.TimeInput = D;
      var L;
      !(function (e) {
        (e[(e.Normal = 0)] = "Normal"),
          (e[(e.Expanded = 1)] = "Expanded"),
          (e[(e.Subdued = 2)] = "Subdued");
      })(L || (L = {}));
      var N = (function () {
          function e(e) {
            var t = this;
            (this._element = null),
              (this._state = L.Normal),
              (this.onClick = null),
              (this._action = e),
              (this._element = document.createElement("button")),
              (this._element.type = "button"),
              (this._element.style.overflow = "hidden"),
              (this._element.style.whiteSpace = "nowrap"),
              (this._element.style.textOverflow = "ellipsis"),
              (this._element.onclick = function (e) {
                t.click();
              }),
              this.updateCssStyle();
          }
          return (
            (e.prototype.click = function () {
              null != this.onClick && this.onClick(this);
            }),
            (e.prototype.updateCssStyle = function () {
              switch (
                ((this._element.className = "ac-pushButton"),
                this._action instanceof B &&
                  this._element.classList.add("expandable"),
                this._state)
              ) {
                case L.Expanded:
                  this._element.classList.add("expanded");
                  break;
                case L.Subdued:
                  this._element.classList.add("subdued");
              }
            }),
            Object.defineProperty(e.prototype, "action", {
              get: function () {
                return this._action;
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(e.prototype, "text", {
              get: function () {
                return this._text;
              },
              set: function (e) {
                (this._text = e),
                  (this._element.innerText = this._text),
                  this._element.setAttribute("aria-label", this._text);
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(e.prototype, "element", {
              get: function () {
                return this._element;
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(e.prototype, "state", {
              get: function () {
                return this._state;
              },
              set: function (e) {
                (this._state = e), this.updateCssStyle();
              },
              enumerable: !0,
              configurable: !0,
            }),
            e
          );
        })(),
        M = (function () {
          function e() {
            (this._parent = null), (this._actionCollection = null);
          }
          return (
            (e.prototype.setParent = function (e) {
              this._parent = e;
            }),
            (e.prototype.execute = function () {
              a(this);
            }),
            (e.prototype.setCollection = function (e) {
              this._actionCollection = e;
            }),
            (e.prototype.setStatus = function (e) {
              if (null != this._actionCollection)
                if (e) {
                  var t = new Q();
                  t.parse(e), this._actionCollection.showStatusCard(t);
                } else this._actionCollection.hideStatusCard();
            }),
            (e.prototype.validate = function () {
              return [];
            }),
            (e.prototype.prepare = function (e) {}),
            (e.prototype.parse = function (e) {
              (this.id = e.id), (this.title = e.title);
            }),
            (e.prototype.getAllInputs = function () {
              return [];
            }),
            (e.prototype.getActionById = function (e) {
              if (this.id == e) return this;
            }),
            Object.defineProperty(e.prototype, "parent", {
              get: function () {
                return this._parent;
              },
              enumerable: !0,
              configurable: !0,
            }),
            e
          );
        })();
      t.Action = M;
      var j = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (t._isPrepared = !1), t;
        }
        return (
          d(t, e),
          (t.prototype.getJsonTypeName = function () {
            return "Action.Submit";
          }),
          (t.prototype.prepare = function (e) {
            this._originalData
              ? (this._processedData = JSON.parse(
                  JSON.stringify(this._originalData),
                ))
              : (this._processedData = {});
            for (var t = 0; t < e.length; t++) {
              null != e[t].value && (this._processedData[e[t].id] = e[t].value);
            }
            this._isPrepared = !0;
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t), (this.data = t.data);
          }),
          Object.defineProperty(t.prototype, "data", {
            get: function () {
              return this._isPrepared
                ? this._processedData
                : this._originalData;
            },
            set: function (e) {
              (this._originalData = e), (this._isPrepared = !1);
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(M);
      t.SubmitAction = j;
      var z = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          d(t, e),
          (t.prototype.getJsonTypeName = function () {
            return "Action.OpenUrl";
          }),
          (t.prototype.validate = function () {
            return this.url
              ? []
              : [
                  {
                    error: h.ValidationError.PropertyCantBeNull,
                    message:
                      "An Action.OpenUrl must have its url property set.",
                  },
                ];
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t), (this.url = t.url);
          }),
          t
        );
      })(M);
      t.OpenUrlAction = z;
      var F = (function () {
        function e() {
          this._value = new f.StringWithSubstitutions();
        }
        return (
          (e.prototype.prepare = function (e) {
            this._value.substituteInputValues(
              e,
              f.ContentTypes.applicationXWwwFormUrlencoded,
            );
          }),
          Object.defineProperty(e.prototype, "value", {
            get: function () {
              return this._value.get();
            },
            set: function (e) {
              this._value.set(e);
            },
            enumerable: !0,
            configurable: !0,
          }),
          e
        );
      })();
      t.HttpHeader = F;
      var R = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (
            (t._url = new f.StringWithSubstitutions()),
            (t._body = new f.StringWithSubstitutions()),
            (t._headers = []),
            t
          );
        }
        return (
          d(t, e),
          (t.prototype.getJsonTypeName = function () {
            return "Action.Http";
          }),
          (t.prototype.validate = function () {
            var e = [];
            if (
              (this.url ||
                (e = [
                  {
                    error: h.ValidationError.PropertyCantBeNull,
                    message: "An Action.Http must have its url property set.",
                  },
                ]),
              this.headers.length > 0)
            )
              for (var t = 0; t < this.headers.length; t++)
                if (!this.headers[t].name || !this.headers[t].value) {
                  e = e.concat([
                    {
                      error: h.ValidationError.PropertyCantBeNull,
                      message:
                        "All headers of an Action.Http must have their name and value properties set.",
                    },
                  ]);
                  break;
                }
            return e;
          }),
          (t.prototype.prepare = function (e) {
            this._url.substituteInputValues(
              e,
              f.ContentTypes.applicationXWwwFormUrlencoded,
            );
            for (
              var t = f.ContentTypes.applicationJson, n = 0;
              n < this._headers.length;
              n++
            )
              this._headers[n].prepare(e),
                this._headers[n].name &&
                  "content-type" == this._headers[n].name.toLowerCase() &&
                  (t = this._headers[n].value);
            this._body.substituteInputValues(e, t);
          }),
          (t.prototype.parse = function (t) {
            if (
              (e.prototype.parse.call(this, t),
              (this.url = t.url),
              (this.method = t.method),
              (this.body = t.body),
              null != t.headers)
            ) {
              var n = t.headers;
              this._headers = [];
              for (var r = 0; r < n.length; r++) {
                var i = new F();
                (i.name = n[r].name),
                  (i.value = n[r].value),
                  this.headers.push(i);
              }
            }
          }),
          Object.defineProperty(t.prototype, "url", {
            get: function () {
              return this._url.get();
            },
            set: function (e) {
              this._url.set(e);
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "body", {
            get: function () {
              return this._body.get();
            },
            set: function (e) {
              this._body.set(e);
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "headers", {
            get: function () {
              return this._headers;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(M);
      t.HttpAction = R;
      var B = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (t.card = new Q()), t;
        }
        return (
          d(t, e),
          (t.prototype.getJsonTypeName = function () {
            return "Action.ShowCard";
          }),
          (t.prototype.validate = function () {
            return this.card.validate();
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t), this.card.parse(t.card);
          }),
          (t.prototype.setParent = function (t) {
            e.prototype.setParent.call(this, t), this.card.setParent(t);
          }),
          (t.prototype.getAllInputs = function () {
            return this.card.getAllInputs();
          }),
          (t.prototype.getActionById = function (t) {
            var n = e.prototype.getActionById.call(this, t);
            return n || (n = this.card.getActionById(t)), n;
          }),
          t
        );
      })(M);
      t.ShowCardAction = B;
      var V = (function () {
          function e(e) {
            (this._actionButtons = []),
              (this._expandedAction = null),
              (this._renderedActionCount = 0),
              (this._statusCard = null),
              (this._actionCard = null),
              (this.items = []),
              (this.onHideActionCardPane = null),
              (this.onShowActionCardPane = null),
              (this._owner = e);
          }
          return (
            (e.prototype.showStatusCard = function (e) {
              e.setParent(this._owner),
                (this._statusCard = e.render()),
                this.refreshContainer();
            }),
            (e.prototype.hideStatusCard = function () {
              (this._statusCard = null), this.refreshContainer();
            }),
            (e.prototype.refreshContainer = function () {
              if (
                ((this._actionCardContainer.innerHTML = ""),
                null === this._actionCard && null === this._statusCard)
              )
                return (
                  (this._actionCardContainer.style.padding = "0px"),
                  (this._actionCardContainer.style.marginTop = "0px"),
                  void (
                    this.onHideActionCardPane && this.onHideActionCardPane()
                  )
                );
              this.onShowActionCardPane && this.onShowActionCardPane(null),
                (this._actionCardContainer.style.marginTop =
                  this._renderedActionCount > 0
                    ? this._owner.hostConfig.actions.showCard.inlineTopMargin +
                      "px"
                    : "0px");
              var e = this._owner
                .getNonZeroPadding()
                .toSpacingDefinition(this._owner.hostConfig);
              null !== this._actionCard &&
                ((this._actionCard.style.paddingLeft = e.left + "px"),
                (this._actionCard.style.paddingRight = e.right + "px"),
                (this._actionCard.style.marginLeft = "-" + e.left + "px"),
                (this._actionCard.style.marginRight = "-" + e.right + "px"),
                f.appendChild(this._actionCardContainer, this._actionCard)),
                null !== this._statusCard &&
                  ((this._statusCard.style.paddingLeft = e.left + "px"),
                  (this._statusCard.style.paddingRight = e.right + "px"),
                  (this._statusCard.style.marginLeft = "-" + e.left + "px"),
                  (this._statusCard.style.marginRight = "-" + e.right + "px"),
                  f.appendChild(this._actionCardContainer, this._statusCard));
            }),
            (e.prototype.hideActionCard = function () {
              this._expandedAction && l(this._expandedAction, !1),
                (this._expandedAction = null),
                (this._actionCard = null),
                this.refreshContainer();
            }),
            (e.prototype.showActionCard = function (e, t) {
              if ((void 0 === t && (t = !1), null != e.card)) {
                e.card.suppressStyle = t;
                var n = e.card.render();
                (this._actionCard = n),
                  (this._expandedAction = e),
                  this.refreshContainer(),
                  l(e, !0);
              }
            }),
            (e.prototype.actionClicked = function (e) {
              if (e.action instanceof B)
                if (
                  (this.hideStatusCard(),
                  this._owner.hostConfig.actions.showCard.actionMode ===
                    h.ShowCardActionMode.Popup)
                )
                  e.action.execute();
                else if (e.action === this._expandedAction) {
                  for (var t = 0; t < this._actionButtons.length; t++)
                    this._actionButtons[t].state = L.Normal;
                  this.hideActionCard();
                } else {
                  for (var t = 0; t < this._actionButtons.length; t++)
                    this._actionButtons[t] !== e &&
                      (this._actionButtons[t].state = L.Subdued);
                  (e.state = L.Expanded),
                    this.showActionCard(
                      e.action,
                      !(
                        this._owner.isAtTheVeryLeft() &&
                        this._owner.isAtTheVeryRight()
                      ),
                    );
                }
              else {
                for (var t = 0; t < this._actionButtons.length; t++)
                  this._actionButtons[t].state = L.Normal;
                this.hideStatusCard(),
                  this.hideActionCard(),
                  e.action.execute();
              }
            }),
            (e.prototype.getActionById = function (e) {
              for (
                var t = null, n = 0;
                n < this.items.length && !(t = this.items[n].getActionById(e));
                n++
              );
              return t;
            }),
            (e.prototype.validate = function () {
              var e = [];
              this._owner.hostConfig.actions.maxActions &&
                this.items.length > this._owner.hostConfig.actions.maxActions &&
                e.push({
                  error: h.ValidationError.TooManyActions,
                  message:
                    "A maximum of " +
                    this._owner.hostConfig.actions.maxActions +
                    " actions are allowed.",
                }),
                this.items.length > 0 &&
                  !this._owner.hostConfig.supportsInteractivity &&
                  e.push({
                    error: h.ValidationError.InteractivityNotAllowed,
                    message: "Interactivity is not allowed.",
                  });
              for (var t = 0; t < this.items.length; t++)
                i(this.items[t], this._owner.getForbiddenActionTypes()) ||
                  e.push({
                    error: h.ValidationError.ActionTypeNotAllowed,
                    message:
                      "Actions of type " +
                      this.items[t].getJsonTypeName() +
                      " are not allowe.",
                  });
              for (var t = 0; t < this.items.length; t++)
                e = e.concat(this.items[t].validate());
              return e;
            }),
            (e.prototype.render = function (e) {
              var t = this;
              if (!this._owner.hostConfig.supportsInteractivity) return null;
              var n = document.createElement("div");
              (this._actionCardContainer = document.createElement("div")),
                (this._renderedActionCount = 0);
              var r = this._owner.hostConfig.actions.maxActions
                  ? Math.min(
                      this._owner.hostConfig.actions.maxActions,
                      this.items.length,
                    )
                  : this.items.length,
                o = this._owner.getForbiddenActionTypes();
              if (
                X.preExpandSingleShowCardAction &&
                1 == r &&
                this.items[0] instanceof B &&
                i(this.items[a], o)
              )
                this.showActionCard(this.items[0], !0),
                  (this._renderedActionCount = 1);
              else {
                var s = document.createElement("div");
                if (((s.style.display = "flex"), e == h.Orientation.Horizontal))
                  if (
                    ((s.style.flexDirection = "row"),
                    this._owner.horizontalAlignment &&
                      this._owner.hostConfig.actions.actionAlignment !=
                        h.ActionAlignment.Stretch)
                  )
                    switch (this._owner.horizontalAlignment) {
                      case h.HorizontalAlignment.Center:
                        s.style.justifyContent = "center";
                        break;
                      case h.HorizontalAlignment.Right:
                        s.style.justifyContent = "flex-end";
                        break;
                      default:
                        s.style.justifyContent = "flex-start";
                    }
                  else
                    switch (this._owner.hostConfig.actions.actionAlignment) {
                      case h.ActionAlignment.Center:
                        s.style.justifyContent = "center";
                        break;
                      case h.ActionAlignment.Right:
                        s.style.justifyContent = "flex-end";
                        break;
                      default:
                        s.style.justifyContent = "flex-start";
                    }
                else if (
                  ((s.style.flexDirection = "column"),
                  this._owner.horizontalAlignment &&
                    this._owner.hostConfig.actions.actionAlignment !=
                      h.ActionAlignment.Stretch)
                )
                  switch (this._owner.horizontalAlignment) {
                    case h.HorizontalAlignment.Center:
                      s.style.alignItems = "center";
                      break;
                    case h.HorizontalAlignment.Right:
                      s.style.alignItems = "flex-end";
                      break;
                    default:
                      s.style.alignItems = "flex-start";
                  }
                else
                  switch (this._owner.hostConfig.actions.actionAlignment) {
                    case h.ActionAlignment.Center:
                      s.style.alignItems = "center";
                      break;
                    case h.ActionAlignment.Right:
                      s.style.alignItems = "flex-end";
                      break;
                    case h.ActionAlignment.Stretch:
                      s.style.alignItems = "stretch";
                      break;
                    default:
                      s.style.alignItems = "flex-start";
                  }
                for (var a = 0; a < this.items.length; a++)
                  if (i(this.items[a], o)) {
                    var l = new N(this.items[a]);
                    if (
                      ((l.element.style.overflow = "hidden"),
                      (l.element.style.overflow = "table-cell"),
                      (l.element.style.flex =
                        this._owner.hostConfig.actions.actionAlignment ===
                        h.ActionAlignment.Stretch
                          ? "0 1 100%"
                          : "0 1 auto"),
                      (l.text = this.items[a].title),
                      (l.onClick = function (e) {
                        t.actionClicked(e);
                      }),
                      this._actionButtons.push(l),
                      s.appendChild(l.element),
                      ++this._renderedActionCount >=
                        this._owner.hostConfig.actions.maxActions ||
                        a == this.items.length - 1)
                    )
                      break;
                    if (this._owner.hostConfig.actions.buttonSpacing > 0) {
                      var c = document.createElement("div");
                      e === h.Orientation.Horizontal
                        ? ((c.style.flex = "0 0 auto"),
                          (c.style.width =
                            this._owner.hostConfig.actions.buttonSpacing +
                            "px"))
                        : (c.style.height =
                            this._owner.hostConfig.actions.buttonSpacing +
                            "px"),
                        f.appendChild(s, c);
                    }
                  }
                var u = document.createElement("div");
                (u.style.overflow = "hidden"),
                  u.appendChild(s),
                  f.appendChild(n, u);
              }
              return (
                f.appendChild(n, this._actionCardContainer),
                this._renderedActionCount > 0 ? n : null
              );
            }),
            (e.prototype.addAction = function (e) {
              if (e.parent)
                throw new Error(
                  "The action already belongs to another element.",
                );
              this.items.push(e), e.setParent(this._owner), r(e, this);
            }),
            (e.prototype.clear = function () {
              this.items = [];
            }),
            (e.prototype.getAllInputs = function () {
              for (var e = [], t = 0; t < this.items.length; t++) {
                var n = this.items[t];
                e = e.concat(n.getAllInputs());
              }
              return e;
            }),
            e
          );
        })(),
        U = (function (e) {
          function t() {
            var t = e.call(this) || this;
            return (
              (t.orientation = null),
              (t._actionCollection = new V(t)),
              (t._actionCollection.onHideActionCardPane = function () {
                t.showBottomSpacer(t);
              }),
              (t._actionCollection.onShowActionCardPane = function (e) {
                t.hideBottomSpacer(t);
              }),
              t
            );
          }
          return (
            d(t, e),
            (t.prototype.internalRender = function () {
              return this._actionCollection.render(
                this.orientation
                  ? this.orientation
                  : this.hostConfig.actions.actionsOrientation,
              );
            }),
            (t.prototype.getJsonTypeName = function () {
              return "ActionSet";
            }),
            (t.prototype.validate = function () {
              return this._actionCollection.validate();
            }),
            (t.prototype.parse = function (t, n) {
              void 0 === n && (n = "items"), e.prototype.parse.call(this, t);
              var r = t.orientation;
              if (
                (r &&
                  (this.orientation = f.getEnumValueOrDefault(
                    h.Orientation,
                    r,
                    h.Orientation.Horizontal,
                  )),
                void 0 != t.actions)
              )
                for (var i = t.actions, s = 0; s < i.length; s++)
                  this.addAction(o(i[s]));
            }),
            (t.prototype.addAction = function (e) {
              null != e && this._actionCollection.addAction(e);
            }),
            (t.prototype.getAllInputs = function () {
              return this._actionCollection.getAllInputs();
            }),
            (t.prototype.renderSpeech = function () {
              return "";
            }),
            Object.defineProperty(t.prototype, "isInteractive", {
              get: function () {
                return !0;
              },
              enumerable: !0,
              configurable: !0,
            }),
            t
          );
        })(b);
      t.ActionSet = U;
      var q = (function () {
        function e() {
          (this.mode = h.BackgroundImageMode.Stretch),
            (this.horizontalAlignment = h.HorizontalAlignment.Left),
            (this.verticalAlignment = h.VerticalAlignment.Top);
        }
        return (
          (e.prototype.parse = function (e) {
            (this.url = e.url),
              (this.mode = f.getEnumValueOrDefault(
                h.BackgroundImageMode,
                e.mode,
                this.mode,
              )),
              (this.horizontalAlignment = f.getEnumValueOrDefault(
                h.HorizontalAlignment,
                e.horizontalAlignment,
                this.horizontalAlignment,
              )),
              (this.verticalAlignment = f.getEnumValueOrDefault(
                h.VerticalAlignment,
                e.verticalAlignment,
                this.verticalAlignment,
              ));
          }),
          (e.prototype.apply = function (e) {
            if (this.url) {
              switch (
                ((e.style.backgroundImage = "url('" + this.url + "')"),
                this.mode)
              ) {
                case h.BackgroundImageMode.Repeat:
                  e.style.backgroundRepeat = "repeat";
                  break;
                case h.BackgroundImageMode.RepeatHorizontally:
                  e.style.backgroundRepeat = "repeat-x";
                  break;
                case h.BackgroundImageMode.RepeatVertically:
                  e.style.backgroundRepeat = "repeat-y";
                  break;
                case h.BackgroundImageMode.Stretch:
                default:
                  (e.style.backgroundRepeat = "no-repeat"),
                    (e.style.backgroundSize = "cover");
              }
              switch (this.horizontalAlignment) {
                case h.HorizontalAlignment.Center:
                  e.style.backgroundPositionX = "center";
                  break;
                case h.HorizontalAlignment.Right:
                  e.style.backgroundPositionX = "right";
              }
              switch (this.verticalAlignment) {
                case h.VerticalAlignment.Center:
                  e.style.backgroundPositionY = "center";
                  break;
                case h.VerticalAlignment.Bottom:
                  e.style.backgroundPositionY = "bottom";
              }
            }
          }),
          e
        );
      })();
      t.BackgroundImage = q;
      var H = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (
            (t._items = []),
            (t._style = null),
            (t.verticalContentAlignment = h.VerticalAlignment.Top),
            t
          );
        }
        return (
          d(t, e),
          (t.prototype.isElementAllowed = function (e, t) {
            if (!this.hostConfig.supportsInteractivity && e.isInteractive)
              return !1;
            if (t)
              for (var n = 0; n < t.length; n++)
                if (e.getJsonTypeName() === t[n]) return !1;
            return !0;
          }),
          Object.defineProperty(t.prototype, "hasExplicitStyle", {
            get: function () {
              return null != this._style;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.showBottomSpacer = function (t) {
            (t && !this.isLastElement(t)) ||
              (this.applyPadding(), e.prototype.showBottomSpacer.call(this, t));
          }),
          (t.prototype.hideBottomSpacer = function (t) {
            (t && !this.isLastElement(t)) ||
              (this.renderedElement &&
                (this.renderedElement.style.paddingBottom = "0px"),
              e.prototype.hideBottomSpacer.call(this, t));
          }),
          (t.prototype.applyPadding = function () {
            if (this.padding) {
              if (this.renderedElement) {
                var e = this.padding.toSpacingDefinition(this.hostConfig);
                (this.renderedElement.style.paddingTop = e.top + "px"),
                  (this.renderedElement.style.paddingRight = e.right + "px"),
                  (this.renderedElement.style.paddingBottom = e.bottom + "px"),
                  (this.renderedElement.style.paddingLeft = e.left + "px");
              }
            } else if (this.hasBackground) {
              var t = new y(),
                e = new y(),
                n =
                  !!this.parent &&
                  this.parent.canContentBleed() &&
                  X.useAutomaticContainerBleeding;
              if (n) {
                var r = this.getNonZeroPadding(),
                  i = new v(r.top, r.right, r.bottom, r.left);
                this.isAtTheVeryTop() ||
                  ((r.top = h.Spacing.None), (i.top = h.Spacing.None)),
                  this.isAtTheVeryBottom() ||
                    ((r.bottom = h.Spacing.None), (i.bottom = h.Spacing.None)),
                  this.isAtTheVeryLeft() ||
                    ((r.left = h.Spacing.None), (i.left = h.Spacing.None)),
                  this.isAtTheVeryRight() ||
                    ((r.right = h.Spacing.None), (i.right = h.Spacing.None)),
                  (r.left == h.Spacing.None && r.right == h.Spacing.None) ||
                    (r.left == h.Spacing.None && (r.left = r.right),
                    r.right == h.Spacing.None && (r.right = r.left)),
                  (r.top == h.Spacing.None && r.bottom == h.Spacing.None) ||
                    (r.top == h.Spacing.None && (r.top = r.bottom),
                    r.bottom == h.Spacing.None && (r.bottom = r.top)),
                  (r.top == h.Spacing.None &&
                    r.right == h.Spacing.None &&
                    r.bottom == h.Spacing.None &&
                    r.left == h.Spacing.None) ||
                    (r.top == h.Spacing.None && (r.top = h.Spacing.Default),
                    r.right == h.Spacing.None && (r.right = h.Spacing.Default),
                    r.bottom == h.Spacing.None &&
                      (r = Object.assign({}, r, { bottom: h.Spacing.Default })),
                    r.left == h.Spacing.None &&
                      (r = Object.assign({}, r, { left: h.Spacing.Default }))),
                  r.top == h.Spacing.None &&
                    r.right == h.Spacing.None &&
                    r.bottom == h.Spacing.None &&
                    r.left == h.Spacing.None &&
                    (r = new v(
                      h.Spacing.Padding,
                      h.Spacing.Padding,
                      h.Spacing.Padding,
                      h.Spacing.Padding,
                    )),
                  (t = i.toSpacingDefinition(this.hostConfig)),
                  (e = r.toSpacingDefinition(this.hostConfig));
              } else
                e = new v(
                  h.Spacing.Padding,
                  h.Spacing.Padding,
                  h.Spacing.Padding,
                  h.Spacing.Padding,
                ).toSpacingDefinition(this.hostConfig);
              this.renderedElement &&
                ((this.renderedElement.style.marginTop = "-" + t.top + "px"),
                (this.renderedElement.style.marginRight = "-" + t.right + "px"),
                (this.renderedElement.style.marginBottom =
                  "-" + t.bottom + "px"),
                (this.renderedElement.style.marginLeft = "-" + t.left + "px"),
                (this.renderedElement.style.paddingTop = e.top + "px"),
                (this.renderedElement.style.paddingRight = e.right + "px"),
                (this.renderedElement.style.paddingBottom = e.bottom + "px"),
                (this.renderedElement.style.paddingLeft = e.left + "px")),
                this.separatorElement &&
                  (this.separatorOrientation == h.Orientation.Horizontal
                    ? ((this.separatorElement.style.marginLeft =
                        "-" + t.left + "px"),
                      (this.separatorElement.style.marginRight =
                        "-" + t.right + "px"))
                    : ((this.separatorElement.style.marginTop =
                        "-" + t.top + "px"),
                      (this.separatorElement.style.marginBottom =
                        "-" + t.bottom + "px")));
            }
          }),
          (t.prototype.internalRender = function () {
            var e = this,
              t = document.createElement("div");
            switch (
              ((t.className = "ac-container"),
              (t.style.display = "flex"),
              (t.style.flexDirection = "column"),
              X.useAdvancedCardBottomTruncation &&
                (t.style.minHeight = "-webkit-min-content"),
              this.verticalContentAlignment)
            ) {
              case h.VerticalAlignment.Center:
                t.style.justifyContent = "center";
                break;
              case h.VerticalAlignment.Bottom:
                t.style.justifyContent = "flex-end";
                break;
              default:
                t.style.justifyContent = "flex-start";
            }
            if (this.hasBackground) {
              this.backgroundImage && this.backgroundImage.apply(t);
              var n = this.hostConfig.containerStyles.getStyleByName(
                this.style,
                this.hostConfig.containerStyles.default,
              );
              f.isNullOrEmpty(n.backgroundColor) ||
                (t.style.backgroundColor = f.stringToCssColor(
                  n.backgroundColor,
                ));
            }
            if (
              (this.selectAction &&
                this.hostConfig.supportsInteractivity &&
                (t.classList.add("ac-selectable"),
                (t.tabIndex = 0),
                t.setAttribute("role", "button"),
                t.setAttribute("aria-label", this.selectAction.title),
                (t.onclick = function (t) {
                  null != e.selectAction &&
                    (e.selectAction.execute(), (t.cancelBubble = !0));
                }),
                (t.onkeypress = function (t) {
                  null != e.selectAction &&
                    ((13 != t.keyCode && 32 != t.keyCode) ||
                      e.selectAction.execute());
                })),
              this._items.length > 0)
            )
              for (var r = 0, i = 0; i < this._items.length; i++) {
                var o = this.isElementAllowed(
                  this._items[i],
                  this.getForbiddenElementTypes(),
                )
                  ? this._items[i].render()
                  : null;
                o &&
                  (r > 0 &&
                    this._items[i].separatorElement &&
                    ((this._items[i].separatorElement.style.flex = "0 0 auto"),
                    f.appendChild(t, this._items[i].separatorElement)),
                  f.appendChild(t, o),
                  r++);
              }
            return t;
          }),
          (t.prototype.truncateOverflow = function (e) {
            for (
              var t = this.renderedElement.offsetTop + e + 1,
                n = function (e) {
                  var r = e.renderedElement;
                  if (r)
                    switch (f.getFitStatus(r, t)) {
                      case h.ContainerFitStatus.FullyInContainer:
                        e.resetOverflow() && n(e);
                        break;
                      case h.ContainerFitStatus.Overflowing:
                        var i = t - r.offsetTop;
                        e.handleOverflow(i);
                        break;
                      case h.ContainerFitStatus.FullyOutOfContainer:
                        e.handleOverflow(0);
                    }
                },
                r = 0,
                i = this._items;
              r < i.length;
              r++
            ) {
              var o = i[r];
              n(o);
            }
            return !0;
          }),
          (t.prototype.undoOverflowTruncation = function () {
            for (var e = 0, t = this._items; e < t.length; e++) {
              t[e].resetOverflow();
            }
          }),
          Object.defineProperty(t.prototype, "hasBackground", {
            get: function () {
              var e = this.getParentContainer();
              return (
                void 0 != this.backgroundImage ||
                (this.hasExplicitStyle && !!e && e.style != this.style)
              );
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "defaultStyle", {
            get: function () {
              return h.ContainerStyle.Default;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "allowCustomStyle", {
            get: function () {
              return !0;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "style", {
            get: function () {
              return this.allowCustomStyle &&
                this._style &&
                this.hostConfig.containerStyles.getStyleByName(this._style)
                ? this._style
                : this.defaultStyle;
            },
            set: function (e) {
              this._style = e;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "padding", {
            get: function () {
              return this.getPadding();
            },
            set: function (e) {
              this.setPadding(e);
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Container";
          }),
          (t.prototype.isFirstElement = function (e) {
            for (var t = 0; t < this._items.length; t++)
              if (this._items[t].isVisible) return this._items[t] == e;
            return !1;
          }),
          (t.prototype.isLastElement = function (e) {
            for (var t = this._items.length - 1; t >= 0; t--)
              if (this._items[t].isVisible) return this._items[t] == e;
            return !1;
          }),
          (t.prototype.validate = function () {
            var e = [];
            if (this._style) {
              this.hostConfig.containerStyles.getStyleByName(this._style) ||
                e.push({
                  error: h.ValidationError.InvalidPropertyValue,
                  message: "Unknown container style: " + this._style,
                });
            }
            for (var t = 0; t < this._items.length; t++)
              !this.hostConfig.supportsInteractivity &&
                this._items[t].isInteractive &&
                e.push({
                  error: h.ValidationError.InteractivityNotAllowed,
                  message: "Interactivity is not allowed.",
                }),
                this.isElementAllowed(
                  this._items[t],
                  this.getForbiddenElementTypes(),
                ) ||
                  e.push({
                    error: h.ValidationError.InteractivityNotAllowed,
                    message:
                      "Elements of type " +
                      this._items[t].getJsonTypeName() +
                      " are not allowed in this container.",
                  }),
                (e = e.concat(this._items[t].validate()));
            return e;
          }),
          (t.prototype.parse = function (t, n) {
            void 0 === n && (n = "items"), e.prototype.parse.call(this, t);
            var r = t.backgroundImage;
            if (
              (r &&
                ((this.backgroundImage = new q()),
                "string" == typeof r
                  ? ((this.backgroundImage.url = r),
                    (this.backgroundImage.mode = h.BackgroundImageMode.Stretch))
                  : "object" == typeof r &&
                    ((this.backgroundImage = new q()),
                    this.backgroundImage.parse(t.backgroundImage))),
              (this.verticalContentAlignment = f.getEnumValueOrDefault(
                h.VerticalAlignment,
                t.verticalContentAlignment,
                this.verticalContentAlignment,
              )),
              (this._style = t.style),
              null != t[n])
            ) {
              var i = t[n];
              this.clear();
              for (var s = 0; s < i.length; s++) {
                var a = i[s].type,
                  l = X.elementTypeRegistry.createInstance(a);
                l
                  ? (this.addItem(l), l.parse(i[s]))
                  : p({
                      error: h.ValidationError.UnknownElementType,
                      message: "Unknown element type: " + a,
                    });
              }
            }
            var c = t.selectAction;
            void 0 != c && (this.selectAction = o(c));
          }),
          (t.prototype.addItem = function (e) {
            if (e.parent)
              throw new Error(
                "The element already belongs to another container.",
              );
            if (!e.isStandalone)
              throw new Error(
                "Elements of type " +
                  e.getJsonTypeName() +
                  " cannot be used as standalone elements.",
              );
            this._items.push(e), e.setParent(this);
          }),
          (t.prototype.clear = function () {
            this._items = [];
          }),
          (t.prototype.canContentBleed = function () {
            return (
              !this.hasBackground && e.prototype.canContentBleed.call(this)
            );
          }),
          (t.prototype.getAllInputs = function () {
            for (var e = [], t = 0; t < this._items.length; t++) {
              var n = this._items[t];
              e = e.concat(n.getAllInputs());
            }
            return e;
          }),
          (t.prototype.getElementById = function (t) {
            var n = e.prototype.getElementById.call(this, t);
            if (!n)
              for (
                var r = 0;
                r < this._items.length &&
                !(n = this._items[r].getElementById(t));
                r++
              );
            return n;
          }),
          (t.prototype.getActionById = function (t) {
            var n = e.prototype.getActionById.call(this, t);
            if (
              !n &&
              (this.selectAction && (n = this.selectAction.getActionById(t)),
              !n)
            )
              for (
                var r = 0;
                r < this._items.length &&
                !(n = this._items[r].getActionById(t));
                r++
              );
            return n;
          }),
          (t.prototype.renderSpeech = function () {
            if (null != this.speak) return this.speak;
            var e = null;
            if (this._items.length > 0) {
              e = "";
              for (var t = 0; t < this._items.length; t++) {
                var n = this._items[t].renderSpeech();
                n && (e += n);
              }
            }
            return e;
          }),
          (t.prototype.updateLayout = function (e) {
            if ((void 0 === e && (e = !0), this.applyPadding(), e))
              for (var t = 0; t < this._items.length; t++)
                this._items[t].updateLayout();
          }),
          Object.defineProperty(t.prototype, "selectAction", {
            get: function () {
              return this._selectAction;
            },
            set: function (e) {
              (this._selectAction = e),
                this._selectAction && this._selectAction.setParent(this);
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(b);
      t.Container = H;
      var W = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (
            (t._computedWeight = 0), (t.width = "auto"), (t.pixelWidth = 0), t
          );
        }
        return (
          d(t, e),
          (t.prototype.adjustRenderedElementSize = function (e) {
            (e.style.minWidth = "0"),
              this.pixelWidth > 0
                ? (e.style.flex = "0 0 " + this.pixelWidth + "px")
                : "number" == typeof this.width
                ? (e.style.flex =
                    "1 1 " +
                    (this._computedWeight > 0
                      ? this._computedWeight
                      : this.width) +
                    "%")
                : "auto" === this.width
                ? (e.style.flex = "0 1 auto")
                : (e.style.flex = "1 1 50px");
          }),
          Object.defineProperty(t.prototype, "separatorOrientation", {
            get: function () {
              return h.Orientation.Vertical;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.getJsonTypeName = function () {
            return "Column";
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t);
            var n = t.width;
            void 0 === n &&
              void 0 !== (n = t.size) &&
              p({
                error: h.ValidationError.Deprecated,
                message:
                  'The "Column.size" property is deprecated and will be removed. Use the "Column.width" property instead.',
              });
            var r = !1;
            if ("number" == typeof n) n <= 0 && (r = !0);
            else if ("string" == typeof n) {
              if ("auto" != n && "stretch" != n) {
                var i = parseInt(n);
                isNaN(i) ? (r = !0) : (n = i);
              }
            } else n && (r = !0);
            r
              ? p({
                  error: h.ValidationError.InvalidPropertyValue,
                  message: "Invalid column width: " + n,
                })
              : (this.width = n);
          }),
          Object.defineProperty(t.prototype, "isStandalone", {
            get: function () {
              return !1;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(H);
      t.Column = W;
      var $ = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (t._columns = []), t;
        }
        return (
          d(t, e),
          (t.prototype.applyPadding = function () {
            if (this.padding && this.renderedElement) {
              var e = this.padding.toSpacingDefinition(this.hostConfig);
              (this.renderedElement.style.paddingTop = e.top + "px"),
                (this.renderedElement.style.paddingRight = e.right + "px"),
                (this.renderedElement.style.paddingBottom = e.bottom + "px"),
                (this.renderedElement.style.paddingLeft = e.left + "px");
            }
          }),
          (t.prototype.internalRender = function () {
            var e = this;
            if (this._columns.length > 0) {
              var t = document.createElement("div");
              switch (
                ((t.className = "ac-columnSet"),
                (t.style.display = "flex"),
                X.useAdvancedCardBottomTruncation &&
                  (t.style.minHeight = "-webkit-min-content"),
                this.selectAction &&
                  this.hostConfig.supportsInteractivity &&
                  (t.classList.add("ac-selectable"),
                  (t.onclick = function (t) {
                    e.selectAction.execute(), (t.cancelBubble = !0);
                  })),
                this.horizontalAlignment)
              ) {
                case h.HorizontalAlignment.Center:
                  t.style.justifyContent = "center";
                  break;
                case h.HorizontalAlignment.Right:
                  t.style.justifyContent = "flex-end";
                  break;
                default:
                  t.style.justifyContent = "flex-start";
              }
              for (var n = 0, r = 0; r < this._columns.length; r++)
                "number" == typeof this._columns[r].width &&
                  (n += this._columns[r].width);
              for (var i = 0, r = 0; r < this._columns.length; r++) {
                if ("number" == typeof this._columns[r].width && n > 0) {
                  var o = (100 / n) * this._columns[r].width;
                  this._columns[r]._computedWeight = o;
                }
                var s = this._columns[r].render();
                s &&
                  (i > 0 &&
                    this._columns[r].separatorElement &&
                    ((this._columns[r].separatorElement.style.flex =
                      "0 0 auto"),
                    f.appendChild(t, this._columns[r].separatorElement)),
                  f.appendChild(t, s),
                  i++);
              }
              return i > 0 ? t : null;
            }
            return null;
          }),
          (t.prototype.truncateOverflow = function (e) {
            for (var t = 0, n = this._columns; t < n.length; t++) {
              n[t].handleOverflow(e);
            }
            return !0;
          }),
          (t.prototype.undoOverflowTruncation = function () {
            for (var e = 0, t = this._columns; e < t.length; e++) {
              t[e].resetOverflow();
            }
          }),
          Object.defineProperty(t.prototype, "padding", {
            get: function () {
              return this.getPadding();
            },
            set: function (e) {
              this.setPadding(e);
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.getJsonTypeName = function () {
            return "ColumnSet";
          }),
          (t.prototype.parse = function (t) {
            e.prototype.parse.call(this, t);
            var n = t.selectAction;
            if (
              (void 0 != n && (this.selectAction = o(n)), null != t.columns)
            ) {
              var r = t.columns;
              this._columns = [];
              for (var i = 0; i < r.length; i++) {
                var s = new W();
                s.parse(r[i]), this.addColumn(s);
              }
            }
          }),
          (t.prototype.validate = function () {
            for (var e = [], t = 0, n = 0, r = 0; r < this._columns.length; r++)
              "number" == typeof this._columns[r].width
                ? t++
                : "stretch" === this._columns[r].width && n++,
                (e = e.concat(this._columns[r].validate()));
            return (
              t > 0 &&
                n > 0 &&
                e.push({
                  error: h.ValidationError.Hint,
                  message:
                    "It is not recommended to use weighted and stretched columns in the same ColumnSet, because in such a situation stretched columns will always get the minimum amount of space.",
                }),
              e
            );
          }),
          (t.prototype.updateLayout = function (e) {
            if ((void 0 === e && (e = !0), this.applyPadding(), e))
              for (var t = 0; t < this._columns.length; t++)
                this._columns[t].updateLayout();
          }),
          (t.prototype.addColumn = function (e) {
            if (e.parent)
              throw new Error(
                "This column already belongs to another ColumnSet.",
              );
            this._columns.push(e), e.setParent(this);
          }),
          (t.prototype.isLeftMostElement = function (e) {
            return 0 == this._columns.indexOf(e);
          }),
          (t.prototype.isRightMostElement = function (e) {
            return this._columns.indexOf(e) == this._columns.length - 1;
          }),
          (t.prototype.getAllInputs = function () {
            for (var e = [], t = 0; t < this._columns.length; t++)
              e = e.concat(this._columns[t].getAllInputs());
            return e;
          }),
          (t.prototype.getElementById = function (t) {
            var n = e.prototype.getElementById.call(this, t);
            if (!n)
              for (
                var r = 0;
                r < this._columns.length &&
                !(n = this._columns[r].getElementById(t));
                r++
              );
            return n;
          }),
          (t.prototype.getActionById = function (e) {
            for (
              var t = null, n = 0;
              n < this._columns.length &&
              !(t = this._columns[n].getActionById(e));
              n++
            );
            return t;
          }),
          (t.prototype.renderSpeech = function () {
            if (null != this.speak) return this.speak;
            var e = "";
            if (this._columns.length > 0)
              for (var t = 0; t < this._columns.length; t++)
                e += this._columns[t].renderSpeech();
            return e;
          }),
          Object.defineProperty(t.prototype, "selectAction", {
            get: function () {
              return this._selectAction;
            },
            set: function (e) {
              (this._selectAction = e),
                this._selectAction && this._selectAction.setParent(this);
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(b);
      t.ColumnSet = $;
      var G = (function () {
        function e(e, t) {
          void 0 === e && (e = 1),
            void 0 === t && (t = 1),
            (this._isValid = !0),
            (this._major = e),
            (this._minor = t);
        }
        return (
          (e.parse = function (t) {
            if (!t) return null;
            var n = new e();
            n._versionString = t;
            var r = /(\d+).(\d+)/gi,
              i = r.exec(t);
            return (
              null != i && 3 == i.length
                ? ((n._major = parseInt(i[1])), (n._minor = parseInt(i[2])))
                : (n._isValid = !1),
              n
            );
          }),
          (e.prototype.toString = function () {
            return this._isValid
              ? this._major + "." + this._minor
              : this._versionString;
          }),
          Object.defineProperty(e.prototype, "major", {
            get: function () {
              return this._major;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "minor", {
            get: function () {
              return this._minor;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "isValid", {
            get: function () {
              return this._isValid;
            },
            enumerable: !0,
            configurable: !0,
          }),
          e
        );
      })();
      t.Version = G;
      var Z = (function (e) {
        function t() {
          var t = e.call(this) || this;
          return (
            (t._actionCollection = new V(t)),
            (t._actionCollection.onHideActionCardPane = function () {
              t.showBottomSpacer(null);
            }),
            (t._actionCollection.onShowActionCardPane = function (e) {
              t.hideBottomSpacer(null);
            }),
            t
          );
        }
        return (
          d(t, e),
          (t.prototype.internalRender = function () {
            var t = e.prototype.internalRender.call(this),
              n = this._actionCollection.render(
                this.hostConfig.actions.actionsOrientation,
              );
            return (
              n &&
                (f.appendChild(
                  t,
                  f.renderSeparation(
                    {
                      spacing: this.hostConfig.getEffectiveSpacing(
                        this.hostConfig.actions.spacing,
                      ),
                      lineThickness: null,
                      lineColor: null,
                    },
                    h.Orientation.Horizontal,
                  ),
                ),
                f.appendChild(t, n)),
              t.children.length > 0 ? t : null
            );
          }),
          (t.prototype.getActionById = function (t) {
            var n = this._actionCollection.getActionById(t);
            return n || e.prototype.getActionById.call(this, t);
          }),
          (t.prototype.parse = function (t, n) {
            if (
              (void 0 === n && (n = "items"),
              e.prototype.parse.call(this, t, n),
              void 0 != t.actions)
            )
              for (var r = t.actions, i = 0; i < r.length; i++) {
                var s = o(r[i]);
                null != s && this.addAction(s);
              }
          }),
          (t.prototype.validate = function () {
            var t = e.prototype.validate.call(this);
            return (
              this._actionCollection &&
                (t = t.concat(this._actionCollection.validate())),
              t
            );
          }),
          (t.prototype.isLastElement = function (t) {
            return (
              e.prototype.isLastElement.call(this, t) &&
              0 == this._actionCollection.items.length
            );
          }),
          (t.prototype.addAction = function (e) {
            this._actionCollection.addAction(e);
          }),
          (t.prototype.clear = function () {
            e.prototype.clear.call(this), this._actionCollection.clear();
          }),
          (t.prototype.getAllInputs = function () {
            return e.prototype.getAllInputs
              .call(this)
              .concat(this._actionCollection.getAllInputs());
          }),
          Object.defineProperty(t.prototype, "isStandalone", {
            get: function () {
              return !1;
            },
            enumerable: !0,
            configurable: !0,
          }),
          t
        );
      })(H);
      t.ContainerWithActions = Z;
      var K = (function () {
        function e() {
          (this._items = []), this.reset();
        }
        return (
          (e.prototype.findTypeRegistration = function (e) {
            for (var t = 0; t < this._items.length; t++)
              if (this._items[t].typeName === e) return this._items[t];
            return null;
          }),
          (e.prototype.clear = function () {
            this._items = [];
          }),
          (e.prototype.registerType = function (e, t) {
            var n = this.findTypeRegistration(e);
            null != n
              ? (n.createInstance = t)
              : ((n = { typeName: e, createInstance: t }), this._items.push(n));
          }),
          (e.prototype.unregisterType = function (e) {
            for (var t = 0; t < this._items.length; t++)
              if (this._items[t].typeName === e)
                return void this._items.splice(t, 1);
          }),
          (e.prototype.createInstance = function (e) {
            var t = this.findTypeRegistration(e);
            return t ? t.createInstance() : null;
          }),
          e
        );
      })();
      t.TypeRegistry = K;
      var J = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          d(t, e),
          (t.prototype.reset = function () {
            this.clear(),
              this.registerType("Container", function () {
                return new H();
              }),
              this.registerType("TextBlock", function () {
                return new _();
              }),
              this.registerType("Image", function () {
                return new S();
              }),
              this.registerType("ImageSet", function () {
                return new k();
              }),
              this.registerType("FactSet", function () {
                return new C();
              }),
              this.registerType("ColumnSet", function () {
                return new $();
              }),
              this.registerType("Input.Text", function () {
                return new E();
              }),
              this.registerType("Input.Date", function () {
                return new I();
              }),
              this.registerType("Input.Time", function () {
                return new D();
              }),
              this.registerType("Input.Number", function () {
                return new P();
              }),
              this.registerType("Input.ChoiceSet", function () {
                return new O();
              }),
              this.registerType("Input.Toggle", function () {
                return new T();
              });
          }),
          t
        );
      })(K);
      t.ElementTypeRegistry = J;
      var Y = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          d(t, e),
          (t.prototype.reset = function () {
            this.clear(),
              this.registerType("Action.OpenUrl", function () {
                return new z();
              }),
              this.registerType("Action.Submit", function () {
                return new j();
              }),
              this.registerType("Action.ShowCard", function () {
                return new B();
              });
          }),
          t
        );
      })(K);
      t.ActionTypeRegistry = Y;
      var X = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (
            (t._cardTypeName = "AdaptiveCard"),
            (t.onAnchorClicked = null),
            (t.onExecuteAction = null),
            (t.onElementVisibilityChanged = null),
            (t.onInlineCardExpanded = null),
            (t.onParseElement = null),
            (t.version = new G(1, 0)),
            t
          );
        }
        return (
          d(t, e),
          (t.prototype.isVersionSupported = function () {
            return (
              !!this.bypassVersionCheck ||
              !(
                !this.version ||
                t.currentVersion.major < this.version.major ||
                (t.currentVersion.major == this.version.major &&
                  t.currentVersion.minor < this.version.minor)
              )
            );
          }),
          (t.prototype.showBottomSpacer = function (e) {
            (e && !this.isLastElement(e)) || this.applyPadding();
          }),
          (t.prototype.hideBottomSpacer = function (e) {
            (e && !this.isLastElement(e)) ||
              (this.renderedElement &&
                (this.renderedElement.style.paddingBottom = "0px"));
          }),
          (t.prototype.applyPadding = function () {
            var e = this.padding
              ? this.padding.toSpacingDefinition(this.hostConfig)
              : this.internalPadding.toSpacingDefinition(this.hostConfig);
            (this.renderedElement.style.paddingTop = e.top + "px"),
              (this.renderedElement.style.paddingRight = e.right + "px"),
              (this.renderedElement.style.paddingBottom = e.bottom + "px"),
              (this.renderedElement.style.paddingLeft = e.left + "px");
          }),
          (t.prototype.internalRender = function () {
            var n = e.prototype.internalRender.call(this);
            return (
              t.useAdvancedCardBottomTruncation && (n.style.minHeight = null), n
            );
          }),
          Object.defineProperty(t.prototype, "bypassVersionCheck", {
            get: function () {
              return !1;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "defaultPadding", {
            get: function () {
              return new v(
                h.Spacing.Padding,
                h.Spacing.Padding,
                h.Spacing.Padding,
                h.Spacing.Padding,
              );
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "allowCustomPadding", {
            get: function () {
              return !1;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "allowCustomStyle", {
            get: function () {
              return (
                this.hostConfig.adaptiveCard &&
                this.hostConfig.adaptiveCard.allowCustomStyle
              );
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "hasBackground", {
            get: function () {
              return !0;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.getJsonTypeName = function () {
            return "AdaptiveCard";
          }),
          (t.prototype.validate = function () {
            var n = [];
            return (
              "AdaptiveCard" != this._cardTypeName &&
                n.push({
                  error: h.ValidationError.MissingCardType,
                  message:
                    'Invalid or missing card type. Make sure the card\'s type property is set to "AdaptiveCard".',
                }),
              this.bypassVersionCheck || (this.version && this.version.isValid)
                ? this.isVersionSupported() ||
                  n.push({
                    error: h.ValidationError.UnsupportedCardVersion,
                    message:
                      "The specified card version (" +
                      this.version +
                      ") is not supported. The maximum supported card version is " +
                      t.currentVersion,
                  })
                : n.push({
                    error: h.ValidationError.PropertyCantBeNull,
                    message: this.version
                      ? "Invalid version: " + this.version
                      : "The version property must be specified.",
                  }),
              n.concat(e.prototype.validate.call(this))
            );
          }),
          (t.prototype.parse = function (t) {
            this._cardTypeName = t.type;
            var n = t.lang;
            if (n && "string" == typeof n)
              try {
                this.lang = n;
              } catch (e) {
                p({
                  error: h.ValidationError.InvalidPropertyValue,
                  message: e.message,
                });
              }
            (this.version = G.parse(t.version)),
              (this.fallbackText = t.fallbackText),
              e.prototype.parse.call(this, t, "body");
          }),
          (t.prototype.render = function (t) {
            var n;
            return (
              this.isVersionSupported()
                ? (n = e.prototype.render.call(this)) &&
                  ((n.tabIndex = 0),
                  f.isNullOrEmpty(this.speak) ||
                    n.setAttribute("aria-label", this.speak))
                : ((n = document.createElement("div")),
                  (n.innerHTML = this.fallbackText
                    ? this.fallbackText
                    : "The specified card version is not supported.")),
              t && (t.appendChild(n), this.updateLayout()),
              n
            );
          }),
          (t.prototype.updateLayout = function (n) {
            if (
              (void 0 === n && (n = !0),
              e.prototype.updateLayout.call(this, n),
              t.useAdvancedCardBottomTruncation && this.isRendered())
            ) {
              var r = this.renderedElement,
                i = this.hostConfig.getEffectiveSpacing(h.Spacing.Default);
              this.handleOverflow(r.offsetHeight - i);
            }
          }),
          (t.prototype.canContentBleed = function () {
            return !0;
          }),
          (t.currentVersion = new G(1, 0)),
          (t.useAutomaticContainerBleeding = !1),
          (t.preExpandSingleShowCardAction = !1),
          (t.useAdvancedTextBlockTruncation = !0),
          (t.useAdvancedCardBottomTruncation = !1),
          (t.useMarkdownInRadioButtonAndCheckbox = !0),
          (t.elementTypeRegistry = new J()),
          (t.actionTypeRegistry = new Y()),
          (t.onAnchorClicked = null),
          (t.onExecuteAction = null),
          (t.onElementVisibilityChanged = null),
          (t.onInlineCardExpanded = null),
          (t.onParseElement = null),
          (t.onParseError = null),
          (t.processMarkdown = function (e) {
            return window.markdownit ? window.markdownit().render(e) : e;
          }),
          t
        );
      })(Z);
      t.AdaptiveCard = X;
      var Q = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (t.suppressStyle = !1), t;
          }
          return (
            d(t, e),
            Object.defineProperty(t.prototype, "bypassVersionCheck", {
              get: function () {
                return !0;
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(t.prototype, "defaultPadding", {
              get: function () {
                return new v(
                  this.suppressStyle ? h.Spacing.None : h.Spacing.Padding,
                  h.Spacing.Padding,
                  this.suppressStyle ? h.Spacing.None : h.Spacing.Padding,
                  h.Spacing.Padding,
                );
              },
              enumerable: !0,
              configurable: !0,
            }),
            Object.defineProperty(t.prototype, "defaultStyle", {
              get: function () {
                return this.suppressStyle
                  ? h.ContainerStyle.Default
                  : this.hostConfig.actions.showCard.style
                  ? this.hostConfig.actions.showCard.style
                  : h.ContainerStyle.Emphasis;
              },
              enumerable: !0,
              configurable: !0,
            }),
            (t.prototype.render = function (t) {
              var n = e.prototype.render.call(this, t);
              return (
                n.setAttribute("aria-live", "polite"),
                n.removeAttribute("tabindex"),
                n
              );
            }),
            (t.prototype.getForbiddenActionTypes = function () {
              return [B];
            }),
            t
          );
        })(X),
        ee = new m.HostConfig({
          supportsInteractivity: !0,
          fontFamily: "Segoe UI",
          spacing: {
            small: 10,
            default: 20,
            medium: 30,
            large: 40,
            extraLarge: 50,
            padding: 20,
          },
          separator: { lineThickness: 1, lineColor: "#EEEEEE" },
          fontSizes: {
            small: 12,
            default: 14,
            medium: 17,
            large: 21,
            extraLarge: 26,
          },
          fontWeights: { lighter: 200, default: 400, bolder: 600 },
          imageSizes: { small: 40, medium: 80, large: 160 },
          containerStyles: {
            default: {
              backgroundColor: "#FFFFFF",
              foregroundColors: {
                default: { default: "#333333", subtle: "#EE333333" },
                dark: { default: "#000000", subtle: "#66000000" },
                light: { default: "#FFFFFF", subtle: "#33000000" },
                accent: { default: "#2E89FC", subtle: "#882E89FC" },
                attention: { default: "#cc3300", subtle: "#DDcc3300" },
                good: { default: "#54a254", subtle: "#DD54a254" },
                warning: { default: "#e69500", subtle: "#DDe69500" },
              },
            },
            emphasis: {
              backgroundColor: "#08000000",
              foregroundColors: {
                default: { default: "#333333", subtle: "#EE333333" },
                dark: { default: "#000000", subtle: "#66000000" },
                light: { default: "#FFFFFF", subtle: "#33000000" },
                accent: { default: "#2E89FC", subtle: "#882E89FC" },
                attention: { default: "#cc3300", subtle: "#DDcc3300" },
                good: { default: "#54a254", subtle: "#DD54a254" },
                warning: { default: "#e69500", subtle: "#DDe69500" },
              },
            },
          },
          actions: {
            maxActions: 5,
            spacing: h.Spacing.Default,
            buttonSpacing: 10,
            showCard: {
              actionMode: h.ShowCardActionMode.Inline,
              inlineTopMargin: 16,
            },
            actionsOrientation: h.Orientation.Horizontal,
            actionAlignment: h.ActionAlignment.Left,
          },
          adaptiveCard: { allowCustomStyle: !1 },
          imageSet: { imageSize: h.Size.Medium, maxImageHeight: 100 },
          factSet: {
            title: {
              color: h.TextColor.Default,
              size: h.TextSize.Default,
              isSubtle: !1,
              weight: h.TextWeight.Bolder,
              wrap: !0,
              maxWidth: 150,
            },
            value: {
              color: h.TextColor.Default,
              size: h.TextSize.Default,
              isSubtle: !1,
              weight: h.TextWeight.Default,
              wrap: !0,
            },
            spacing: 10,
          },
        });
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        for (
          var n = [
              new s(
                /\{{2}DATE\((\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|(?:(?:-|\+)\d{2}:\d{2})))(?:, ?(COMPACT|LONG|SHORT))?\)\}{2}/g,
              ),
              new a(
                /\{{2}TIME\((\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|(?:(?:-|\+)\d{2}:\d{2})))\)\}{2}/g,
              ),
            ],
            r = t,
            i = 0;
          i < n.length;
          i++
        )
          r = n[i].format(e, r);
        return r;
      }
      var i =
        (this && this.__extends) ||
        (function () {
          var e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            };
          return function (t, n) {
            function r() {
              this.constructor = t;
            }
            e(t, n),
              (t.prototype =
                null === n
                  ? Object.create(n)
                  : ((r.prototype = n.prototype), new r()));
          };
        })();
      Object.defineProperty(t, "__esModule", { value: !0 });
      var o = (function () {
          function e(e) {
            this._regularExpression = e;
          }
          return (
            (e.prototype.format = function (e, t) {
              for (
                var n, r = t;
                null != (n = this._regularExpression.exec(t));

              )
                r = r.replace(n[0], this.internalFormat(e, n));
              return r;
            }),
            e
          );
        })(),
        s = (function (e) {
          function t() {
            return (null !== e && e.apply(this, arguments)) || this;
          }
          return (
            i(t, e),
            (t.prototype.internalFormat = function (e, t) {
              var n = new Date(Date.parse(t[1])),
                r = void 0 != t[2] ? t[2].toLowerCase() : "compact";
              return "compact" != r
                ? n.toLocaleDateString(e, {
                    day: "numeric",
                    weekday: r,
                    month: r,
                    year: "numeric",
                  })
                : n.toLocaleDateString();
            }),
            t
          );
        })(o),
        a = (function (e) {
          function t() {
            return (null !== e && e.apply(this, arguments)) || this;
          }
          return (
            i(t, e),
            (t.prototype.internalFormat = function (e, t) {
              return new Date(Date.parse(t[1])).toLocaleTimeString(e, {
                hour: "numeric",
                minute: "2-digit",
              });
            }),
            t
          );
        })(o);
      t.formatText = r;
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(4),
        i = n(2),
        o = n(23),
        s = n(104),
        a = n(105),
        l = function (e) {
          var t = e.attachments,
            n = e.attachmentLayout,
            a = r.__rest(e, ["attachments", "attachmentLayout"]);
          return t && 0 !== t.length
            ? "carousel" === n
              ? i.createElement(
                  s.Carousel,
                  r.__assign({ attachments: t, disabled: e.disabled }, a),
                )
              : i.createElement(
                  "div",
                  { className: "wc-list" },
                  t.map(function (t, n) {
                    return i.createElement(o.AttachmentView, {
                      attachment: t,
                      format: e.format,
                      disabled: e.disabled,
                      key: n,
                      onCardAction: e.onCardAction,
                      onImageLoad: e.onImageLoad,
                    });
                  }),
                )
            : null;
        },
        c = (function (e) {
          function t(t) {
            return e.call(this, t) || this;
          }
          return (
            r.__extends(t, e),
            (t.prototype.shouldComponentUpdate = function (e) {
              return (
                this.props.activity !== e.activity ||
                this.props.format !== e.format ||
                ("message" === this.props.activity.type &&
                  "carousel" === this.props.activity.attachmentLayout &&
                  this.props.size !== e.size) ||
                !this.props.disabled != !e.disabled
              );
            }),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.activity,
                n = r.__rest(e, ["activity"]);
              switch (t.type) {
                case "message":
                  return i.createElement(
                    "div",
                    null,
                    i.createElement(a.FormattedText, {
                      text: t.text,
                      format: t.textFormat,
                      onImageLoad: n.onImageLoad,
                    }),
                    i.createElement(l, {
                      attachments: t.attachments,
                      attachmentLayout: t.attachmentLayout,
                      disabled: n.disabled,
                      format: n.format,
                      onCardAction: n.onCardAction,
                      onImageLoad: n.onImageLoad,
                      size: n.size,
                    }),
                  );
                case "typing":
                  return i.createElement("div", { className: "wc-typing" });
              }
            }),
            t
          );
        })(i.Component);
      t.ActivityView = c;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        if (!e.actions) return e;
        var t = e.actions.reduce(function (e, t) {
          switch (t.type) {
            case "Action.Submit":
              break;
            case "Action.ShowCard":
              e.push(i.__assign({}, t, { card: r(t.card) }));
              break;
            default:
              e.push(t);
          }
          return e;
        }, []);
        return i.__assign({}, e, { nextActions: t });
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i = n(4),
        o = n(19),
        s = n(46),
        a = n(2),
        l = n(30),
        c = n(13),
        u = n(90),
        p = n(9),
        d = new s({
          breaks: !0,
          html: !1,
          linkify: !0,
          typographer: !0,
          xhtmlOut: !0,
        });
      o.AdaptiveCard.processMarkdown = function (e) {
        return d.render(e);
      };
      var h = new o.HostConfig(u),
        f = (function (e) {
          function t(t) {
            var n = e.call(this, t) || this;
            return (
              (n.handleImageLoad = n.handleImageLoad.bind(n)),
              (n.onClick = n.onClick.bind(n)),
              (n.saveDiv = n.saveDiv.bind(n)),
              n
            );
          }
          return (
            i.__extends(t, e),
            (t.prototype.saveDiv = function (e) {
              this.divRef = e;
            }),
            (t.prototype.onClick = function (e) {
              if (!this.props.disabled && this.props.onClick)
                switch (e.target.tagName) {
                  case "A":
                  case "AUDIO":
                  case "VIDEO":
                  case "BUTTON":
                  case "INPUT":
                  case "LABEL":
                  case "TEXTAREA":
                  case "SELECT":
                    break;
                  default:
                    this.props.onClick(e);
                }
            }),
            (t.prototype.onExecuteAction = function (e) {
              if (!this.props.disabled)
                if (e instanceof o.OpenUrlAction) window.open(e.url);
                else if (e instanceof o.SubmitAction && void 0 !== e.data)
                  if (
                    "object" == typeof e.data &&
                    e.data.__isBotFrameworkCardAction
                  ) {
                    var t = e.data;
                    this.props.onCardAction(t.type, t.value);
                  } else
                    this.props.onCardAction(
                      "string" == typeof e.data ? "imBack" : "postBack",
                      e.data,
                    );
            }),
            (t.prototype.componentDidMount = function () {
              this.mountAdaptiveCards();
            }),
            (t.prototype.componentDidUpdate = function (e) {
              (e.hostConfig === this.props.hostConfig &&
                e.jsonCard === this.props.jsonCard &&
                !e.disabled == !this.props.disabled &&
                e.nativeCard === this.props.nativeCard) ||
                (this.unmountAdaptiveCards(), this.mountAdaptiveCards());
            }),
            (t.prototype.handleImageLoad = function () {
              this.props.onImageLoad &&
                this.props.onImageLoad.apply(this, arguments);
            }),
            (t.prototype.unmountAdaptiveCards = function () {
              var e = l.findDOMNode(this.divRef);
              [].forEach.call(e.children, function (t) {
                return e.removeChild(t);
              });
            }),
            (t.prototype.mountAdaptiveCards = function () {
              var e = this,
                t = this.props.nativeCard || new o.AdaptiveCard();
              t.hostConfig = this.props.hostConfig || h;
              var n = [];
              if (!this.props.nativeCard && this.props.jsonCard)
                try {
                  (this.props.jsonCard.version =
                    this.props.jsonCard.version || "0.5"),
                    t.parse(r(this.props.jsonCard)),
                    (n = t.validate());
                } catch (e) {
                  n.push(e);
                }
              if (
                ((t.onExecuteAction = this.onExecuteAction.bind(this)),
                0 === n.length)
              ) {
                var i = void 0;
                try {
                  i = t.render();
                } catch (e) {
                  var s = { error: -1, message: e };
                  n.push(s), e.stack && (s.message += "\n" + e.stack);
                }
                if (i) {
                  if (this.props.disabled) {
                    var a = i.querySelectorAll("a"),
                      c = i.querySelectorAll("button, input, select, textarea");
                    [].forEach.call(c, function (e) {
                      e.disabled = !0;
                    }),
                      [].forEach.call(a, function (e) {
                        e.addEventListener("click", function (e) {
                          e.preventDefault(),
                            e.stopImmediatePropagation(),
                            e.stopPropagation();
                        });
                      });
                  }
                  if (this.props.onImageLoad) {
                    var u = i.querySelectorAll("img");
                    u &&
                      u.length > 0 &&
                      [].forEach.call(u, function (t) {
                        t.addEventListener("load", e.handleImageLoad);
                      });
                  }
                  return void l.findDOMNode(this.divRef).appendChild(i);
                }
              } else
                console.log("Error(s) rendering AdaptiveCard:"),
                  n.forEach(function (e) {
                    return console.log(e.message);
                  }),
                  this.setState({
                    errors: n.map(function (e) {
                      return e.message;
                    }),
                  });
            }),
            (t.prototype.render = function () {
              var e,
                t =
                  this.state &&
                  this.state.errors &&
                  this.state.errors.length > 0;
              return (
                (e = t
                  ? a.createElement(
                      "div",
                      null,
                      a.createElement(
                        "svg",
                        { className: "error-icon", viewBox: "0 0 15 12.01" },
                        a.createElement("path", {
                          d: "M7.62 8.63v-.38H.94a.18.18 0 0 1-.19-.19V.94A.18.18 0 0 1 .94.75h10.12a.18.18 0 0 1 .19.19v3.73H12V.94a.91.91 0 0 0-.07-.36 1 1 0 0 0-.5-.5.91.91 0 0 0-.37-.08H.94a.91.91 0 0 0-.37.07 1 1 0 0 0-.5.5.91.91 0 0 0-.07.37v7.12a.91.91 0 0 0 .07.36 1 1 0 0 0 .5.5.91.91 0 0 0 .37.08h6.72c-.01-.12-.04-.24-.04-.37z M11.62 5.26a3.27 3.27 0 0 1 1.31.27 3.39 3.39 0 0 1 1.8 1.8 3.36 3.36 0 0 1 0 2.63 3.39 3.39 0 0 1-1.8 1.8 3.36 3.36 0 0 1-2.62 0 3.39 3.39 0 0 1-1.8-1.8 3.36 3.36 0 0 1 0-2.63 3.39 3.39 0 0 1 1.8-1.8 3.27 3.27 0 0 1 1.31-.27zm0 6a2.53 2.53 0 0 0 1-.21A2.65 2.65 0 0 0 14 9.65a2.62 2.62 0 0 0 0-2 2.65 2.65 0 0 0-1.39-1.39 2.62 2.62 0 0 0-2 0A2.65 2.65 0 0 0 9.2 7.61a2.62 2.62 0 0 0 0 2A2.65 2.65 0 0 0 10.6 11a2.53 2.53 0 0 0 1.02.26zM13 7.77l-.86.86.86.86-.53.53-.86-.86-.86.86-.53-.53.86-.86-.86-.86.53-.53.86.86.86-.86zM1.88 7.13h2.25V4.88H1.88zm.75-1.5h.75v.75h-.75zM5.63 2.63h4.5v.75h-4.5zM1.88 4.13h2.25V1.88H1.88zm.75-1.5h.75v.75h-.75zM9 5.63H5.63v.75h2.64A4 4 0 0 1 9 5.63z",
                        }),
                      ),
                      a.createElement(
                        "div",
                        { className: "error-text" },
                        "Can't render card",
                      ),
                    )
                  : this.props.children
                  ? a.createElement(
                      "div",
                      { className: "non-adaptive-content" },
                      this.props.children,
                    )
                  : null),
                a.createElement(
                  "div",
                  {
                    className: p.classList(
                      "wc-card",
                      "wc-adaptive-card",
                      this.props.className,
                      t && "error",
                    ),
                    onClick: this.onClick,
                  },
                  e,
                  a.createElement("div", { ref: this.saveDiv }),
                )
              );
            }),
            t
          );
        })(a.Component);
      t.default = c.connect(
        function (e) {
          return { hostConfig: e.adaptiveCards.hostConfig };
        },
        {},
        function (e, t, n) {
          return i.__assign({}, n, e);
        },
      )(f);
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(88);
      t.App = r.App;
      var i = n(9);
      (t.Chat = i.Chat),
        (function (e) {
          for (var n in e) t.hasOwnProperty(n) || (t[n] = e[n]);
        })(n(24));
      var o = n(23);
      t.queryParams = o.queryParams;
      var s = n(89);
      t.SpeechOptions = s.SpeechOptions;
      var a = n(16);
      t.Speech = a.Speech;
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(19),
        i = (function () {
          function e() {
            (this.card = new r.AdaptiveCard()),
              (this.container = new r.Container()),
              this.card.addItem(this.container);
          }
          return (
            (e.prototype.addColumnSet = function (e, t) {
              t = t || this.container;
              var n = new r.ColumnSet();
              return (
                t.addItem(n),
                e.map(function (e) {
                  var t = new r.Column();
                  return (t.width = e), n.addColumn(t), t;
                })
              );
            }),
            (e.prototype.addItems = function (e, t) {
              (t = t || this.container),
                e.forEach(function (e) {
                  return t.addItem(e);
                });
            }),
            (e.prototype.addTextBlock = function (e, t, n) {
              if (((n = n || this.container), void 0 !== e)) {
                var i = new r.TextBlock();
                for (var o in t) i[o] = t[o];
                (i.text = e), n.addItem(i);
              }
            }),
            (e.prototype.addButtons = function (t, n) {
              var r = this;
              t &&
                t.forEach(function (t) {
                  r.card.addAction(e.addCardAction(t, n));
                });
            }),
            (e.addCardAction = function (e, t) {
              if ("imBack" === e.type || "postBack" === e.type) {
                var n = new r.SubmitAction(),
                  i = {
                    __isBotFrameworkCardAction: !0,
                    type: e.type,
                    value: e.value,
                  };
                return (n.data = i), (n.title = e.title), n;
              }
              if ("signin" === e.type && t) {
                var n = new r.SubmitAction(),
                  i = {
                    __isBotFrameworkCardAction: !0,
                    type: e.type,
                    value: e.value,
                  };
                return (n.data = i), (n.title = e.title), n;
              }
              var n = new r.OpenUrlAction(),
                i = {
                  __isBotFrameworkCardAction: !0,
                  type: e.type,
                  value: e.value,
                };
              return (
                (n.title = e.title),
                (n.url = "call" === e.type ? "tel:" + e.value : e.value),
                n
              );
            }),
            (e.prototype.addCommonHeaders = function (e) {
              this.addTextBlock(e.title, {
                size: r.TextSize.Medium,
                weight: r.TextWeight.Bolder,
              }),
                this.addTextBlock(e.subtitle, { isSubtle: !0, wrap: !0 }),
                this.addTextBlock(e.text, { wrap: !0 });
            }),
            (e.prototype.addCommon = function (e) {
              this.addCommonHeaders(e), this.addButtons(e.buttons);
            }),
            (e.prototype.addImage = function (t, n, i) {
              n = n || this.container;
              var o = new r.Image();
              (o.url = t),
                (o.size = r.Size.Stretch),
                i && (o.selectAction = e.addCardAction(i)),
                n.addItem(o);
            }),
            e
          );
        })();
      (t.AdaptiveCardBuilder = i),
        (t.buildCommonCard = function (e) {
          if (!e) return null;
          var t = new i();
          return t.addCommon(e), t.card;
        }),
        (t.buildOAuthCard = function (e) {
          if (!e) return null;
          var t = new i();
          return t.addCommonHeaders(e), t.addButtons(e.buttons, !0), t.card;
        });
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(4),
        i = n(2),
        o = n(23),
        s = n(42),
        a = n(12),
        l = (function (e) {
          function t(t) {
            return e.call(this, t) || this;
          }
          return (
            r.__extends(t, e),
            (t.prototype.updateContentWidth = function () {
              var e = this.props.size.width - this.props.format.carouselMargin;
              (this.root.style.width = ""),
                this.root.offsetWidth > e &&
                  ((this.root.style.width = e.toString() + "px"),
                  this.hscroll.updateScrollButtons());
            }),
            (t.prototype.componentDidMount = function () {
              this.updateContentWidth();
            }),
            (t.prototype.componentDidUpdate = function () {
              this.updateContentWidth();
            }),
            (t.prototype.render = function () {
              var e = this;
              return i.createElement(
                "div",
                {
                  className: "wc-carousel",
                  ref: function (t) {
                    return (e.root = t);
                  },
                },
                i.createElement(
                  s.HScroll,
                  {
                    ref: function (t) {
                      return (e.hscroll = t);
                    },
                    prevSvgPathData:
                      "M 16.5 22 L 19 19.5 L 13.5 14 L 19 8.5 L 16.5 6 L 8.5 14 L 16.5 22 Z",
                    nextSvgPathData:
                      "M 12.5 22 L 10 19.5 L 15.5 14 L 10 8.5 L 12.5 6 L 20.5 14 L 12.5 22 Z",
                    scrollUnit: "item",
                  },
                  i.createElement(c, r.__assign({}, this.props)),
                ),
              );
            }),
            t
          );
        })(i.PureComponent);
      t.Carousel = l;
      var c = (function (e) {
        function t() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          r.__extends(t, e),
          (t.prototype.render = function () {
            a.log("rendering CarouselAttachments");
            var e = this.props,
              t = (e.attachments, r.__rest(e, ["attachments"]));
            return i.createElement(
              "ul",
              null,
              this.props.attachments.map(function (e, n) {
                return i.createElement(
                  "li",
                  { className: "wc-carousel-item", key: n },
                  i.createElement(o.AttachmentView, {
                    attachment: e,
                    disabled: t.disabled,
                    format: t.format,
                    onCardAction: t.onCardAction,
                    onImageLoad: t.onImageLoad,
                  }),
                );
              }),
            );
          }),
          t
        );
      })(i.PureComponent);
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(46),
        i = n(2);
      t.FormattedText = function (e) {
        if (!e.text || "" === e.text) return null;
        switch (e.format) {
          case "xml":
          case "plain":
            return o(e.text);
          default:
            return l(e.text, e.onImageLoad);
        }
      };
      var o = function (e) {
          var t = e.replace("\r", "").split("\n"),
            n = t.map(function (e, t) {
              return i.createElement(
                "span",
                { key: t },
                e,
                i.createElement("br", null),
              );
            });
          return i.createElement("span", { className: "format-plain" }, n);
        },
        s = new r({
          html: !1,
          xhtmlOut: !0,
          breaks: !0,
          linkify: !0,
          typographer: !0,
        }),
        a =
          s.renderer.rules.link_open ||
          function (e, t, n, r, i) {
            return i.renderToken(e, t, n);
          };
      s.renderer.rules.link_open = function (e, t, n, r, i) {
        var o = e[t].attrIndex("target");
        return (
          o < 0
            ? e[t].attrPush(["target", "_blank"])
            : (e[t].attrs[o][1] = "_blank"),
          a(e, t, n, r, i)
        );
      };
      var l = function (e, t) {
        var n;
        if (e.trim()) {
          n = e
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(
              /\[(.*?)\]\((.*?)( +".*?"){0,1}\)/gi,
              function (e, t, n, r) {
                return (
                  "[" +
                  t +
                  "](" +
                  s.normalizeLink(n) +
                  (void 0 === r ? "" : r) +
                  ")"
                );
              },
            )
            .split(/\n *\n|\r\n *\r\n|\r *\r/)
            .map(function (e) {
              return s.render(e);
            })
            .join("<br/>");
        } else n = e.replace(/ */, " ");
        return i.createElement("div", {
          className: "format-markdown",
          dangerouslySetInnerHTML: { __html: n },
        });
      };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(4),
        i = n(2),
        o = n(13),
        s = n(100),
        a = n(43),
        l = n(9),
        c = n(12),
        u = n(18),
        p = (function (e) {
          function t(t) {
            var n = e.call(this, t) || this;
            return (
              (n.scrollToBottom = !0),
              (n.measurableCarousel = function () {
                return i.createElement(
                  g,
                  {
                    ref: function (e) {
                      return (n.carouselActivity = e);
                    },
                    activity: {
                      type: "message",
                      id: "",
                      from: { id: "" },
                      attachmentLayout: "carousel",
                    },
                    format: null,
                    fromMe: !1,
                    onClickActivity: null,
                    onClickRetry: null,
                    selected: !1,
                    showTimestamp: !1,
                  },
                  i.createElement(
                    "div",
                    { style: { width: n.largeWidth } },
                    " ",
                  ),
                );
              }),
              n
            );
          }
          return (
            r.__extends(t, e),
            (t.prototype.componentWillUpdate = function (e) {
              var t = 1;
              !this.props.hasActivityWithSuggestedActions &&
                e.hasActivityWithSuggestedActions &&
                (t = 40),
                (this.scrollToBottom =
                  Math.abs(
                    this.scrollMe.scrollHeight -
                      this.scrollMe.scrollTop -
                      this.scrollMe.offsetHeight,
                  ) <= t);
            }),
            (t.prototype.componentDidUpdate = function () {
              if (void 0 === this.props.format.carouselMargin) {
                var e = f(this.carouselActivity.messageDiv) - this.largeWidth,
                  t = this.carouselActivity.messageDiv.offsetParent;
                if (t) {
                  var n = t.offsetWidth - e,
                    r = this.props.size.width - n;
                  c.log("history measureMessage " + r),
                    this.props.setMeasurements(r),
                    (this.carouselActivity = null);
                }
              }
              this.autoscroll();
            }),
            (t.prototype.autoscroll = function () {
              var e = Math.max(
                0,
                h(this.scrollMe) - this.scrollContent.offsetHeight,
              );
              this.scrollContent.style.marginTop = e + "px";
              var t = this.props.activities[this.props.activities.length - 1],
                n = t && this.props.isFromMe && this.props.isFromMe(t);
              (this.scrollToBottom || n) &&
                (this.scrollMe.scrollTop =
                  this.scrollMe.scrollHeight - this.scrollMe.offsetHeight);
            }),
            (t.prototype.doCardAction = function (e, t) {
              return (
                this.props.onClickCardAction(),
                this.props.onCardAction && this.props.onCardAction(),
                this.props.doCardAction(e, t)
              );
            }),
            (t.prototype.render = function () {
              var e = this;
              c.log("History props", this);
              var t;
              void 0 !== this.props.size.width &&
                (void 0 === this.props.format.carouselMargin
                  ? ((this.largeWidth = 2 * this.props.size.width),
                    (t = i.createElement(this.measurableCarousel, null)))
                  : (t = this.props.activities.map(function (t, n) {
                      return (
                        ("message" !== t.type ||
                          t.text ||
                          (t.attachments && !!t.attachments.length)) &&
                        i.createElement(
                          g,
                          {
                            format: e.props.format,
                            key: "message" + n,
                            activity: t,
                            showTimestamp:
                              n === e.props.activities.length - 1 ||
                              (n + 1 < e.props.activities.length &&
                                m(t, e.props.activities[n + 1])),
                            selected: e.props.isSelected(t),
                            fromMe: e.props.isFromMe(t),
                            onClickActivity: e.props.onClickActivity(t),
                            onClickRetry: function (n) {
                              n.preventDefault(),
                                n.stopPropagation(),
                                e.props.onClickRetry(t);
                            },
                          },
                          i.createElement(s.ActivityView, {
                            activity: t,
                            disabled: e.props.disabled,
                            format: e.props.format,
                            onCardAction: function (t, n) {
                              return e.doCardAction(t, n);
                            },
                            onImageLoad: function () {
                              return e.autoscroll();
                            },
                            size: e.props.size,
                          }),
                        )
                      );
                    })));
              var n = l.classList(
                "wc-message-groups",
                !this.props.format.chatTitle && "no-header",
                this.props.disabled && "disabled",
              );
              return i.createElement(
                "div",
                {
                  className: n,
                  ref: function (t) {
                    return (e.scrollMe = t || e.scrollMe);
                  },
                  role: "log",
                  tabIndex: 0,
                },
                i.createElement(
                  "div",
                  {
                    className: "wc-message-group-content",
                    ref: function (t) {
                      t && (e.scrollContent = t);
                    },
                  },
                  t,
                ),
              );
            }),
            t
          );
        })(i.Component);
      (t.HistoryView = p),
        (t.History = o.connect(
          function (e) {
            return {
              activities: e.history.activities,
              format: e.format,
              hasActivityWithSuggestedActions: !!a.activityWithSuggestedActions(
                e.history.activities,
              ),
              size: e.size,
              botConnection: e.connection.botConnection,
              connectionSelectedActivity: e.connection.selectedActivity,
              selectedActivity: e.history.selectedActivity,
              user: e.connection.user,
            };
          },
          {
            onClickCardAction: function () {
              return { type: "Card_Action_Clicked" };
            },
            onClickRetry: function (e) {
              return {
                type: "Send_Message_Retry",
                clientActivityId: e.channelData.clientActivityId,
              };
            },
            setMeasurements: function (e) {
              return { type: "Set_Measurements", carouselMargin: e };
            },
            sendMessage: u.sendMessage,
          },
          function (e, t, n) {
            return {
              activities: e.activities,
              format: e.format,
              hasActivityWithSuggestedActions:
                e.hasActivityWithSuggestedActions,
              size: e.size,
              onClickCardAction: t.onClickCardAction,
              onClickRetry: t.onClickRetry,
              setMeasurements: t.setMeasurements,
              disabled: n.disabled,
              doCardAction: l.doCardAction(
                e.botConnection,
                e.user,
                e.format.locale,
                t.sendMessage,
              ),
              isFromMe: function (t) {
                return (
                  !!t.from &&
                  ("user" === t.from.role || t.from.id === e.user.id)
                );
              },
              isSelected: function (t) {
                return t === e.selectedActivity;
              },
              onCardAction: n.onCardAction,
              onClickActivity: function (t) {
                return (
                  e.connectionSelectedActivity &&
                  function () {
                    return e.connectionSelectedActivity.next({ activity: t });
                  }
                );
              },
            };
          },
          { withRef: !0 },
        )(p));
      var d = function (e, t) {
          var n = window.getComputedStyle(e),
            r = {};
          return (
            t.forEach(function (e) {
              return (r[e] = parseInt(n.getPropertyValue(e)));
            }),
            r
          );
        },
        h = function (e) {
          var t = d(e, ["padding-top", "padding-bottom"]);
          return e.offsetHeight - t["padding-top"] - t["padding-bottom"];
        },
        f = function (e) {
          var t = d(e, ["padding-left", "padding-right"]);
          return e.offsetWidth + t["padding-left"] + t["padding-right"];
        },
        m = function (e, t) {
          return Date.parse(t.timestamp) - Date.parse(e.timestamp) > 3e5;
        },
        g = (function (e) {
          function t(t) {
            var n = e.call(this, t) || this;
            return (n.handleKeyPress = n.handleKeyPress.bind(n)), n;
          }
          return (
            r.__extends(t, e),
            (t.prototype.handleKeyPress = function (e) {
              (13 !== e.keyCode && 32 !== e.keyCode) ||
                this.props.onClickActivity(e);
            }),
            (t.prototype.render = function () {
              var e,
                t = this;
              switch (this.props.activity.id) {
                case void 0:
                  e = i.createElement(
                    "span",
                    null,
                    this.props.format.strings.messageSending,
                  );
                  break;
                case null:
                  e = i.createElement(
                    "span",
                    null,
                    this.props.format.strings.messageFailed,
                  );
                  break;
                case "retry":
                  e = i.createElement(
                    "span",
                    null,
                    this.props.format.strings.messageFailed,
                    " ",
                    i.createElement(
                      "a",
                      { href: ".", onClick: this.props.onClickRetry },
                      this.props.format.strings.messageRetry,
                    ),
                  );
                  break;
                default:
                  var n = void 0;
                  this.props.showTimestamp &&
                    (n = this.props.format.strings.timeSent.replace(
                      "%1",
                      new Date(
                        this.props.activity.timestamp,
                      ).toLocaleTimeString(),
                    )),
                    (e = i.createElement(
                      "span",
                      null,
                      this.props.activity.from.name ||
                        this.props.activity.from.id,
                      n,
                    ));
              }
              var r = this.props.fromMe ? "me" : "bot",
                o = this.props.onClickActivity,
                s = l.classList(
                  "wc-message-wrapper",
                  this.props.activity.attachmentLayout || "list",
                  this.props.onClickActivity && "clickable",
                ),
                a = l.classList(
                  "wc-message-content",
                  this.props.selected && "selected",
                );
              return i.createElement(
                "div",
                {
                  className: s,
                  "data-activity-id": this.props.activity.id,
                  onClick: this.props.onClickActivity,
                  onKeyUp: this.handleKeyPress,
                  role: o ? "button" : void 0,
                  tabIndex: o ? 0 : void 0,
                },
                i.createElement(
                  "div",
                  {
                    className: "wc-message wc-message-from-" + r,
                    ref: function (e) {
                      return (t.messageDiv = e);
                    },
                  },
                  i.createElement(
                    "div",
                    { className: a },
                    i.createElement(
                      "svg",
                      { className: "wc-message-callout" },
                      i.createElement("path", {
                        className: "point-left",
                        d: "m0,6 l6 6 v-12 z",
                      }),
                      i.createElement("path", {
                        className: "point-right",
                        d: "m6,6 l-6 6 v-12 z",
                      }),
                    ),
                    this.props.children,
                  ),
                ),
                i.createElement(
                  "div",
                  { className: "wc-message-from wc-message-from-" + r },
                  e,
                ),
              );
            }),
            t
          );
        })(i.Component);
      t.WrappedActivity = g;
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(4),
        i = n(2),
        o = n(13),
        s = n(43),
        a = n(9),
        l = n(42),
        c = n(18),
        u = function (e) {
          return i.createElement(
            "div",
            {
              className: a.classList(
                "wc-message-pane",
                e.activityWithSuggestedActions && "show-actions",
              ),
            },
            e.children,
            i.createElement(
              "div",
              {
                className: a.classList(
                  "wc-suggested-actions",
                  !!e.disabled && "disabled",
                ),
              },
              i.createElement(p, r.__assign({}, e)),
            ),
          );
        },
        p = (function (e) {
          function t(t) {
            return e.call(this, t) || this;
          }
          return (
            r.__extends(t, e),
            (t.prototype.actionClick = function (e, t) {
              this.props.activityWithSuggestedActions &&
                (this.props.takeSuggestedAction(
                  this.props.activityWithSuggestedActions,
                ),
                this.props.doCardAction(t.type, t.value),
                e.stopPropagation());
            }),
            (t.prototype.shouldComponentUpdate = function (e) {
              return !!e.activityWithSuggestedActions;
            }),
            (t.prototype.render = function () {
              var e = this;
              return this.props.activityWithSuggestedActions
                ? i.createElement(
                    l.HScroll,
                    {
                      prevSvgPathData:
                        "M 16.5 22 L 19 19.5 L 13.5 14 L 19 8.5 L 16.5 6 L 8.5 14 L 16.5 22 Z",
                      nextSvgPathData:
                        "M 12.5 22 L 10 19.5 L 15.5 14 L 10 8.5 L 12.5 6 L 20.5 14 L 12.5 22 Z",
                      scrollUnit: "page",
                    },
                    i.createElement(
                      "ul",
                      null,
                      this.props.activityWithSuggestedActions.suggestedActions.actions.map(
                        function (t, n) {
                          return i.createElement(
                            "li",
                            { key: n },
                            i.createElement(
                              "button",
                              {
                                disabled: e.props.disabled,
                                onClick: function (n) {
                                  return e.actionClick(n, t);
                                },
                                title: t.title,
                                type: "button",
                              },
                              t.title,
                            ),
                          );
                        },
                      ),
                    ),
                  )
                : null;
            }),
            t
          );
        })(i.Component);
      t.MessagePane = o.connect(
        function (e) {
          return {
            activityWithSuggestedActions: s.activityWithSuggestedActions(
              e.history.activities,
            ),
            botConnection: e.connection.botConnection,
            user: e.connection.user,
            locale: e.format.locale,
          };
        },
        {
          takeSuggestedAction: function (e) {
            return { type: "Take_SuggestedAction", message: e };
          },
          sendMessage: c.sendMessage,
        },
        function (e, t, n) {
          return {
            activityWithSuggestedActions: e.activityWithSuggestedActions,
            takeSuggestedAction: t.takeSuggestedAction,
            children: n.children,
            disabled: n.disabled,
            doCardAction: a.doCardAction(
              e.botConnection,
              e.user,
              e.locale,
              t.sendMessage,
            ),
          };
        },
      )(u);
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(4),
        i = n(2),
        o = n(13),
        s = n(9),
        a = n(16),
        l = n(18),
        c = (function (e) {
          function t() {
            return (null !== e && e.apply(this, arguments)) || this;
          }
          return (
            r.__extends(t, e),
            (t.prototype.sendMessage = function () {
              this.props.inputText.trim().length > 0 &&
                this.props.sendMessage(this.props.inputText);
            }),
            (t.prototype.handleSendButtonKeyPress = function (e) {
              ("Enter" !== e.key && " " !== e.key) ||
                (e.preventDefault(),
                this.sendMessage(),
                this.textInput && this.textInput.focus());
            }),
            (t.prototype.handleUploadButtonKeyPress = function (e) {
              ("Enter" !== e.key && " " !== e.key) ||
                (e.preventDefault(), this.fileInput.click());
            }),
            (t.prototype.onKeyPress = function (e) {
              "Enter" === e.key && this.sendMessage();
            }),
            (t.prototype.onClickSend = function () {
              this.sendMessage();
            }),
            (t.prototype.onChangeFile = function () {
              this.fileInput.files.length &&
                (this.props.sendFiles(this.fileInput.files),
                (this.fileInput.value = null)),
                this.textInput && this.textInput.focus();
            }),
            (t.prototype.onTextInputFocus = function () {
              this.props.listeningState === l.ListeningState.STARTED &&
                this.props.stopListening();
            }),
            (t.prototype.onClickMic = function () {
              this.props.listeningState === l.ListeningState.STARTED
                ? this.props.stopListening()
                : this.props.listeningState === l.ListeningState.STOPPED &&
                  this.props.startListening();
            }),
            (t.prototype.focus = function (e) {
              this.textInput && this.textInput.focus(),
                e && this.props.onChangeText(this.props.inputText + e);
            }),
            (t.prototype.render = function () {
              var e = this,
                t = s.classList(
                  "wc-console",
                  this.props.inputText.length > 0 && "has-text",
                  this.props.showUploadButton && "has-upload-button",
                ),
                n =
                  this.props.listeningState !== l.ListeningState.STOPPED ||
                  (a.Speech.SpeechRecognizer.speechIsAvailable() &&
                    !this.props.inputText.length),
                r = s.classList("wc-send", n && "hidden"),
                o = s.classList(
                  "wc-mic",
                  !n && "hidden",
                  this.props.listeningState === l.ListeningState.STARTED &&
                    "active",
                  this.props.listeningState !== l.ListeningState.STARTED &&
                    "inactive",
                ),
                c =
                  this.props.listeningState === l.ListeningState.STARTED
                    ? this.props.strings.listeningIndicator
                    : this.props.strings.consolePlaceholder;
              return i.createElement(
                "div",
                { className: t },
                this.props.showUploadButton &&
                  i.createElement(
                    "label",
                    {
                      className: "wc-upload",
                      htmlFor: "wc-upload-input",
                      onKeyPress: function (t) {
                        return e.handleUploadButtonKeyPress(t);
                      },
                      tabIndex: 0,
                    },
                    i.createElement(
                      "svg",
                      null,
                      i.createElement("path", {
                        d: "M19.96 4.79m-2 0a2 2 0 0 1 4 0 2 2 0 0 1-4 0zM8.32 4.19L2.5 15.53 22.45 15.53 17.46 8.56 14.42 11.18 8.32 4.19ZM1.04 1L1.04 17 24.96 17 24.96 1 1.04 1ZM1.03 0L24.96 0C25.54 0 26 0.45 26 0.99L26 17.01C26 17.55 25.53 18 24.96 18L1.03 18C0.46 18 0 17.55 0 17.01L0 0.99C0 0.45 0.47 0 1.03 0Z",
                      }),
                    ),
                  ),
                this.props.showUploadButton &&
                  i.createElement("input", {
                    id: "wc-upload-input",
                    tabIndex: -1,
                    type: "file",
                    ref: function (t) {
                      return (e.fileInput = t);
                    },
                    multiple: !0,
                    onChange: function () {
                      return e.onChangeFile();
                    },
                    "aria-label": this.props.strings.uploadFile,
                    role: "button",
                  }),
                i.createElement(
                  "div",
                  { className: "wc-textbox" },
                  i.createElement("input", {
                    type: "text",
                    className: "wc-shellinput",
                    ref: function (t) {
                      return (e.textInput = t);
                    },
                    value: this.props.inputText,
                    onChange: function (t) {
                      return e.props.onChangeText(e.textInput.value);
                    },
                    onKeyPress: function (t) {
                      return e.onKeyPress(t);
                    },
                    onFocus: function () {
                      return e.onTextInputFocus();
                    },
                    placeholder: c,
                    "aria-label": this.props.inputText ? null : c,
                    "aria-live": "polite",
                    autoFocus: this.props.autoFocus,
                  }),
                ),
                i.createElement(
                  "button",
                  {
                    className: r,
                    onClick: function () {
                      return e.onClickSend();
                    },
                    "aria-label": this.props.strings.send,
                    role: "button",
                    onKeyPress: function (t) {
                      return e.handleSendButtonKeyPress(t);
                    },
                    tabIndex: 0,
                    type: "button",
                  },
                  i.createElement(
                    "svg",
                    null,
                    i.createElement("path", {
                      d: "M26.79 9.38A0.31 0.31 0 0 0 26.79 8.79L0.41 0.02C0.36 0 0.34 0 0.32 0 0.14 0 0 0.13 0 0.29 0 0.33 0.01 0.37 0.03 0.41L3.44 9.08 0.03 17.76A0.29 0.29 0 0 0 0.01 17.8 0.28 0.28 0 0 0 0.01 17.86C0.01 18.02 0.14 18.16 0.3 18.16A0.3 0.3 0 0 0 0.41 18.14L26.79 9.38ZM0.81 0.79L24.84 8.79 3.98 8.79 0.81 0.79ZM3.98 9.37L24.84 9.37 0.81 17.37 3.98 9.37Z",
                    }),
                  ),
                ),
                i.createElement(
                  "button",
                  {
                    className: o,
                    onClick: function () {
                      return e.onClickMic();
                    },
                    "aria-label": this.props.strings.speak,
                    role: "button",
                    tabIndex: 0,
                    type: "button",
                  },
                  i.createElement(
                    "svg",
                    { width: "28", height: "22", viewBox: "0 0 58 58" },
                    i.createElement("path", {
                      d: "M 44 28 C 43.448 28 43 28.447 43 29 L 43 35 C 43 42.72 36.72 49 29 49 C 21.28 49 15 42.72 15 35 L 15 29 C 15 28.447 14.552 28 14 28 C 13.448 28 13 28.447 13 29 L 13 35 C 13 43.485 19.644 50.429 28 50.949 L 28 56 L 23 56 C 22.448 56 22 56.447 22 57 C 22 57.553 22.448 58 23 58 L 35 58 C 35.552 58 36 57.553 36 57 C 36 56.447 35.552 56 35 56 L 30 56 L 30 50.949 C 38.356 50.429 45 43.484 45 35 L 45 29 C 45 28.447 44.552 28 44 28 Z",
                    }),
                    i.createElement("path", {
                      id: "micFilling",
                      d: "M 28.97 44.438 L 28.97 44.438 C 23.773 44.438 19.521 40.033 19.521 34.649 L 19.521 11.156 C 19.521 5.772 23.773 1.368 28.97 1.368 L 28.97 1.368 C 34.166 1.368 38.418 5.772 38.418 11.156 L 38.418 34.649 C 38.418 40.033 34.166 44.438 28.97 44.438 Z",
                    }),
                    i.createElement("path", {
                      d: "M 29 46 C 35.065 46 40 41.065 40 35 L 40 11 C 40 4.935 35.065 0 29 0 C 22.935 0 18 4.935 18 11 L 18 35 C 18 41.065 22.935 46 29 46 Z M 20 11 C 20 6.037 24.038 2 29 2 C 33.962 2 38 6.037 38 11 L 38 35 C 38 39.963 33.962 44 29 44 C 24.038 44 20 39.963 20 35 L 20 11 Z",
                    }),
                  ),
                ),
              );
            }),
            t
          );
        })(i.Component);
      t.Shell = o.connect(
        function (e) {
          return {
            inputText: e.shell.input,
            showUploadButton: e.format.showUploadButton,
            strings: e.format.strings,
            locale: e.format.locale,
            user: e.connection.user,
            listeningState: e.shell.listeningState,
          };
        },
        {
          onChangeText: function (e) {
            return { type: "Update_Input", input: e, source: "text" };
          },
          stopListening: function () {
            return { type: "Listening_Stopping" };
          },
          startListening: function () {
            return { type: "Listening_Starting" };
          },
          sendMessage: l.sendMessage,
          sendFiles: l.sendFiles,
        },
        function (e, t, n) {
          return {
            inputText: e.inputText,
            showUploadButton: e.showUploadButton,
            strings: e.strings,
            listeningState: e.listeningState,
            onChangeText: t.onChangeText,
            autoFocus: n.autoFocus,
            sendMessage: function (n) {
              return t.sendMessage(n, e.user, e.locale);
            },
            sendFiles: function (n) {
              return t.sendFiles(n, e.user, e.locale);
            },
            startListening: function () {
              return t.startListening();
            },
            stopListening: function () {
              return t.stopListening();
            },
          };
        },
        { withRef: !0 },
      )(c);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return (
          (e = e && e.toLowerCase()),
          e in i
            ? e
            : e.startsWith("cs")
            ? "cs-cz"
            : e.startsWith("da")
            ? "da-dk"
            : e.startsWith("de")
            ? "de-de"
            : e.startsWith("el")
            ? "el-gr"
            : e.startsWith("es")
            ? "es-es"
            : e.startsWith("fi")
            ? "fi-fi"
            : e.startsWith("fr")
            ? "fr-fr"
            : e.startsWith("he")
            ? "he-il"
            : e.startsWith("hu")
            ? "hu-hu"
            : e.startsWith("it")
            ? "it-it"
            : e.startsWith("ja")
            ? "ja-jp"
            : e.startsWith("ko")
            ? "ko-kr"
            : e.startsWith("lv")
            ? "lv-lv"
            : e.startsWith("nb") || e.startsWith("nn") || e.startsWith("no")
            ? "nb-no"
            : e.startsWith("nl")
            ? "nl-nl"
            : e.startsWith("pl")
            ? "pl-pl"
            : e.startsWith("pt")
            ? "pt-br" === e
              ? "pt-br"
              : "pt-pt"
            : e.startsWith("ru")
            ? "ru-ru"
            : e.startsWith("sv")
            ? "sv-se"
            : e.startsWith("tr")
            ? "tr-tr"
            : e.startsWith("zh")
            ? "zh-hk" === e || "zh-mo" === e || "zh-tw" === e
              ? "zh-hant"
              : "zh-hans"
            : "en-us"
        );
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i = {
        "en-us": {
          title: "Chat",
          send: "Send",
          unknownFile: "[File of type '%1']",
          unknownCard: "[Unknown Card '%1']",
          receiptVat: "VAT",
          receiptTax: "Tax",
          receiptTotal: "Total",
          messageRetry: "retry",
          messageFailed: "couldn't send",
          messageSending: "sending",
          timeSent: " at %1",
          consolePlaceholder: "Type your message...",
          listeningIndicator: "Listening...",
          uploadFile: "Upload file",
          speak: "Speak",
        },
        "ja-jp": {
          title: "チャット",
          send: "送信",
          unknownFile: "[ファイルタイプ '%1']",
          unknownCard: "[不明なカード '%1']",
          receiptVat: "消費税",
          receiptTax: "税",
          receiptTotal: "合計",
          messageRetry: "再送",
          messageFailed: "送信できませんでした。",
          messageSending: "送信中",
          timeSent: " %1",
          consolePlaceholder: "メッセージを入力してください...",
          listeningIndicator: "聴いてます...",
          uploadFile: "",
          speak: "",
        },
        "nb-no": {
          title: "Chat",
          send: "Send",
          unknownFile: "[Fil av typen '%1']",
          unknownCard: "[Ukjent Kort '%1']",
          receiptVat: "MVA",
          receiptTax: "Skatt",
          receiptTotal: "Totalt",
          messageRetry: "prøv igjen",
          messageFailed: "kunne ikke sende",
          messageSending: "sender",
          timeSent: " %1",
          consolePlaceholder: "Skriv inn melding...",
          listeningIndicator: "Lytter...",
          uploadFile: "Last opp fil",
          speak: "Snakk",
        },
        "da-dk": {
          title: "Chat",
          send: "Send",
          unknownFile: "[Fil af typen '%1']",
          unknownCard: "[Ukendt kort '%1']",
          receiptVat: "Moms",
          receiptTax: "Skat",
          receiptTotal: "Total",
          messageRetry: "prøv igen",
          messageFailed: "ikke sendt",
          messageSending: "sender",
          timeSent: " kl %1",
          consolePlaceholder: "Skriv din besked...",
          listeningIndicator: "Lytter...",
          uploadFile: "",
          speak: "",
        },
        "de-de": {
          title: "Chat",
          send: "Senden",
          unknownFile: "[Datei vom Typ '%1']",
          unknownCard: "[Unbekannte Card '%1']",
          receiptVat: "VAT",
          receiptTax: "MwSt.",
          receiptTotal: "Gesamtbetrag",
          messageRetry: "wiederholen",
          messageFailed: "konnte nicht senden",
          messageSending: "sendet",
          timeSent: " um %1",
          consolePlaceholder: "Verfasse eine Nachricht...",
          listeningIndicator: "Hören...",
          uploadFile: "",
          speak: "",
        },
        "pl-pl": {
          title: "Chat",
          send: "Wyślij",
          unknownFile: "[Plik typu '%1']",
          unknownCard: "[Nieznana karta '%1']",
          receiptVat: "VAT",
          receiptTax: "Podatek",
          receiptTotal: "Razem",
          messageRetry: "wyślij ponownie",
          messageFailed: "wysłanie nieudane",
          messageSending: "wysyłanie",
          timeSent: " o %1",
          consolePlaceholder: "Wpisz swoją wiadomość...",
          listeningIndicator: "Słuchanie...",
          uploadFile: "Wyślij plik",
          speak: "Mów",
        },
        "ru-ru": {
          title: "Чат",
          send: "Отправить",
          unknownFile: "[Неизвестный тип '%1']",
          unknownCard: "[Неизвестная карта '%1']",
          receiptVat: "VAT",
          receiptTax: "Налог",
          receiptTotal: "Итого",
          messageRetry: "повторить",
          messageFailed: "не удалось отправить",
          messageSending: "отправка",
          timeSent: " в %1",
          consolePlaceholder: "Введите ваше сообщение...",
          listeningIndicator: "прослушивание...",
          uploadFile: "",
          speak: "",
        },
        "nl-nl": {
          title: "Chat",
          send: "Verstuur",
          unknownFile: "[Bestand van het type '%1']",
          unknownCard: "[Onbekende kaart '%1']",
          receiptVat: "VAT",
          receiptTax: "BTW",
          receiptTotal: "Totaal",
          messageRetry: "opnieuw",
          messageFailed: "versturen mislukt",
          messageSending: "versturen",
          timeSent: " om %1",
          consolePlaceholder: "Typ je bericht...",
          listeningIndicator: "Aan het luisteren...",
          uploadFile: "Bestand uploaden",
          speak: "Spreek",
        },
        "lv-lv": {
          title: "Tērzēšana",
          send: "Sūtīt",
          unknownFile: "[Nezināms tips '%1']",
          unknownCard: "[Nezināma kartīte '%1']",
          receiptVat: "VAT",
          receiptTax: "Nodoklis",
          receiptTotal: "Kopsumma",
          messageRetry: "Mēģināt vēlreiz",
          messageFailed: "Neizdevās nosūtīt",
          messageSending: "Nosūtīšana",
          timeSent: " %1",
          consolePlaceholder: "Ierakstiet savu ziņu...",
          listeningIndicator: "Klausoties...",
          uploadFile: "",
          speak: "",
        },
        "pt-br": {
          title: "Bate-papo",
          send: "Enviar",
          unknownFile: "[Arquivo do tipo '%1']",
          unknownCard: "[Cartão desconhecido '%1']",
          receiptVat: "VAT",
          receiptTax: "Imposto",
          receiptTotal: "Total",
          messageRetry: "repetir",
          messageFailed: "não pude enviar",
          messageSending: "enviando",
          timeSent: " às %1",
          consolePlaceholder: "Digite sua mensagem...",
          listeningIndicator: "Ouvindo...",
          uploadFile: "Subir arquivo",
          speak: "Falar",
        },
        "fr-fr": {
          title: "Chat",
          send: "Envoyer",
          unknownFile: "[Fichier de type '%1']",
          unknownCard: "[Carte inconnue '%1']",
          receiptVat: "TVA",
          receiptTax: "Taxe",
          receiptTotal: "Total",
          messageRetry: "réessayer",
          messageFailed: "envoi impossible",
          messageSending: "envoi",
          timeSent: " à %1",
          consolePlaceholder: "Écrivez votre message...",
          listeningIndicator: "Écoute...",
          uploadFile: "",
          speak: "",
        },
        "es-es": {
          title: "Chat",
          send: "Enviar",
          unknownFile: "[Archivo de tipo '%1']",
          unknownCard: "[Tarjeta desconocida '%1']",
          receiptVat: "IVA",
          receiptTax: "Impuestos",
          receiptTotal: "Total",
          messageRetry: "reintentar",
          messageFailed: "no enviado",
          messageSending: "enviando",
          timeSent: " a las %1",
          consolePlaceholder: "Escribe tu mensaje...",
          listeningIndicator: "Escuchando...",
          uploadFile: "",
          speak: "",
        },
        "el-gr": {
          title: "Συνομιλία",
          send: "Αποστολή",
          unknownFile: "[Αρχείο τύπου '%1']",
          unknownCard: "[Αγνωστη Κάρτα '%1']",
          receiptVat: "VAT",
          receiptTax: "ΦΠΑ",
          receiptTotal: "Σύνολο",
          messageRetry: "δοκιμή",
          messageFailed: "αποτυχία",
          messageSending: "αποστολή",
          timeSent: " την %1",
          consolePlaceholder: "Πληκτρολόγηση μηνύματος...",
          listeningIndicator: "Ακούγοντας...",
          uploadFile: "",
          speak: "",
        },
        "it-it": {
          title: "Chat",
          send: "Invia",
          unknownFile: "[File di tipo '%1']",
          unknownCard: "[Card sconosciuta '%1']",
          receiptVat: "VAT",
          receiptTax: "Tasse",
          receiptTotal: "Totale",
          messageRetry: "riprova",
          messageFailed: "impossibile inviare",
          messageSending: "invio",
          timeSent: " %1",
          consolePlaceholder: "Scrivi il tuo messaggio...",
          listeningIndicator: "Ascoltando...",
          uploadFile: "",
          speak: "",
        },
        "zh-hans": {
          title: "聊天",
          send: "发送",
          unknownFile: "[类型为'%1'的文件]",
          unknownCard: "[未知的'%1'卡片]",
          receiptVat: "消费税",
          receiptTax: "税",
          receiptTotal: "共计",
          messageRetry: "重试",
          messageFailed: "无法发送",
          messageSending: "正在发送",
          timeSent: " 用时 %1",
          consolePlaceholder: "输入你的消息...",
          listeningIndicator: "正在倾听...",
          uploadFile: "上传文件",
          speak: "发言",
        },
        "zh-hant": {
          title: "聊天",
          send: "發送",
          unknownFile: "[類型為'%1'的文件]",
          unknownCard: "[未知的'%1'卡片]",
          receiptVat: "消費稅",
          receiptTax: "税",
          receiptTotal: "總共",
          messageRetry: "重試",
          messageFailed: "無法發送",
          messageSending: "正在發送",
          timeSent: " 於 %1",
          consolePlaceholder: "輸入你的訊息...",
          listeningIndicator: "正在聆聽...",
          uploadFile: "上載檔案",
          speak: "發言",
        },
        "zh-yue": {
          title: "傾偈",
          send: "傳送",
          unknownFile: "[類型係'%1'嘅文件]",
          unknownCard: "[唔知'%1'係咩卡片]",
          receiptVat: "消費稅",
          receiptTax: "税",
          receiptTotal: "總共",
          messageRetry: "再嚟一次",
          messageFailed: "傳送唔倒",
          messageSending: "而家傳送緊",
          timeSent: " 喺 %1",
          consolePlaceholder: "輸入你嘅訊息...",
          listeningIndicator: "聽緊你講嘢...",
          uploadFile: "上載檔案",
          speak: "講嘢",
        },
        "cs-cz": {
          title: "Chat",
          send: "Odeslat",
          unknownFile: "[Soubor typu '%1']",
          unknownCard: "[Neznámá karta '%1']",
          receiptVat: "DPH",
          receiptTax: "Daň z prod.",
          receiptTotal: "Celkem",
          messageRetry: "opakovat",
          messageFailed: "nepodařilo se odeslat",
          messageSending: "Odesílání",
          timeSent: " v %1",
          consolePlaceholder: "Napište svou zprávu...",
          listeningIndicator: "Poslouchám...",
          uploadFile: "Nahrát soubor",
          speak: "Použít hlas",
        },
        "ko-kr": {
          title: "채팅",
          send: "전송",
          unknownFile: "[파일 형식 '%1']",
          unknownCard: "[알수없는 타입의 카드 '%1']",
          receiptVat: "부가세",
          receiptTax: "세액",
          receiptTotal: "합계",
          messageRetry: "재전송",
          messageFailed: "전송할 수 없습니다",
          messageSending: "전송중",
          timeSent: " %1",
          consolePlaceholder: "메세지를 입력하세요...",
          listeningIndicator: "수신중...",
          uploadFile: "",
          speak: "",
        },
        "hu-hu": {
          title: "Csevegés",
          send: "Küldés",
          unknownFile: "[Fájltípus '%1']",
          unknownCard: "[Ismeretlen kártya '%1']",
          receiptVat: "ÁFA",
          receiptTax: "Adó",
          receiptTotal: "Összesen",
          messageRetry: "próbálja újra",
          messageFailed: "nem sikerült elküldeni",
          messageSending: "küldés",
          timeSent: " ekkor: %1",
          consolePlaceholder: "Írja be üzenetét...",
          listeningIndicator: "Figyelés...",
          uploadFile: "",
          speak: "",
        },
        "sv-se": {
          title: "Chatt",
          send: "Skicka",
          unknownFile: "[Filtyp '%1']",
          unknownCard: "[Okänt kort '%1']",
          receiptVat: "Moms",
          receiptTax: "Skatt",
          receiptTotal: "Totalt",
          messageRetry: "försök igen",
          messageFailed: "kunde inte skicka",
          messageSending: "skickar",
          timeSent: " %1",
          consolePlaceholder: "Skriv ett meddelande...",
          listeningIndicator: "Lyssnar...",
          uploadFile: "",
          speak: "",
        },
        "tr-tr": {
          title: "Sohbet",
          send: "Gönder",
          unknownFile: "[Dosya türü: '%1']",
          unknownCard: "[Bilinmeyen Kart: '%1']",
          receiptVat: "KDV",
          receiptTax: "Vergi",
          receiptTotal: "Toplam",
          messageRetry: "yeniden deneyin",
          messageFailed: "gönderilemedi",
          messageSending: "gönderiliyor",
          timeSent: ", %1",
          consolePlaceholder: "İletinizi yazın...",
          listeningIndicator: "Dinliyor...",
          uploadFile: "",
          speak: "",
        },
        "pt-pt": {
          title: "Chat",
          send: "Enviar",
          unknownFile: '[Ficheiro do tipo "%1"]',
          unknownCard: '[Cartão Desconhecido "%1"]',
          receiptVat: "IVA",
          receiptTax: "Imposto",
          receiptTotal: "Total",
          messageRetry: "repetir",
          messageFailed: "não foi possível enviar",
          messageSending: "a enviar",
          timeSent: " em %1",
          consolePlaceholder: "Escreva a sua mensagem...",
          listeningIndicator: "A Escutar...",
          uploadFile: "",
          speak: "",
        },
        "fi-fi": {
          title: "Chat",
          send: "Lähetä",
          unknownFile: "[Tiedosto tyyppiä '%1']",
          unknownCard: "[Tuntematon kortti '%1']",
          receiptVat: "ALV",
          receiptTax: "Vero",
          receiptTotal: "Yhteensä",
          messageRetry: "yritä uudelleen",
          messageFailed: "ei voitu lähettää",
          messageSending: "lähettää",
          timeSent: " klo %1",
          consolePlaceholder: "Kirjoita viesti...",
          listeningIndicator: "Kuuntelee...",
          uploadFile: "Lataa tiedosto",
          speak: "Puhu",
        },
        "he-il": {
          title: "צ'אט",
          send: "שלח",
          unknownFile: "[קובץ מסוג '%1']",
          unknownCard: "[כרטיס לא ידוע '%1']",
          receiptVat: 'מע"מ',
          receiptTax: "מס",
          receiptTotal: "סך הכל",
          messageRetry: "נסה שוב",
          messageFailed: "השליחה נכשלה",
          messageSending: "שולח",
          timeSent: " %1",
          consolePlaceholder: "כתוב כאן...",
          listeningIndicator: "מאזין...",
          uploadFile: "העלה קובץ",
          speak: "דבר",
        },
      };
      (t.defaultStrings = i["en-us"]),
        (t.strings = function (e) {
          return i[r(e)];
        });
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = e.tabIndex;
        if (s) {
          var n = e.attributes.getNamedItem("tabindex");
          if (!n || !n.specified)
            return ~i.indexOf(e.nodeName.toLowerCase()) ? 0 : null;
        } else if (!~t) {
          var r = e.getAttribute("tabindex");
          if (null === r || ("" === r && !o)) return null;
        }
        return t;
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i = [
          "a",
          "body",
          "button",
          "frame",
          "iframe",
          "img",
          "input",
          "isindex",
          "object",
          "select",
          "textarea",
        ],
        o = /Firefox\//i.test(navigator.userAgent),
        s = /Trident\//i.test(navigator.userAgent);
      t.getTabIndex = r;
    },
    function (e, t) {
      e.exports = {
        Aacute: "Á",
        aacute: "á",
        Abreve: "Ă",
        abreve: "ă",
        ac: "∾",
        acd: "∿",
        acE: "∾̳",
        Acirc: "Â",
        acirc: "â",
        acute: "´",
        Acy: "А",
        acy: "а",
        AElig: "Æ",
        aelig: "æ",
        af: "⁡",
        Afr: "𝔄",
        afr: "𝔞",
        Agrave: "À",
        agrave: "à",
        alefsym: "ℵ",
        aleph: "ℵ",
        Alpha: "Α",
        alpha: "α",
        Amacr: "Ā",
        amacr: "ā",
        amalg: "⨿",
        amp: "&",
        AMP: "&",
        andand: "⩕",
        And: "⩓",
        and: "∧",
        andd: "⩜",
        andslope: "⩘",
        andv: "⩚",
        ang: "∠",
        ange: "⦤",
        angle: "∠",
        angmsdaa: "⦨",
        angmsdab: "⦩",
        angmsdac: "⦪",
        angmsdad: "⦫",
        angmsdae: "⦬",
        angmsdaf: "⦭",
        angmsdag: "⦮",
        angmsdah: "⦯",
        angmsd: "∡",
        angrt: "∟",
        angrtvb: "⊾",
        angrtvbd: "⦝",
        angsph: "∢",
        angst: "Å",
        angzarr: "⍼",
        Aogon: "Ą",
        aogon: "ą",
        Aopf: "𝔸",
        aopf: "𝕒",
        apacir: "⩯",
        ap: "≈",
        apE: "⩰",
        ape: "≊",
        apid: "≋",
        apos: "'",
        ApplyFunction: "⁡",
        approx: "≈",
        approxeq: "≊",
        Aring: "Å",
        aring: "å",
        Ascr: "𝒜",
        ascr: "𝒶",
        Assign: "≔",
        ast: "*",
        asymp: "≈",
        asympeq: "≍",
        Atilde: "Ã",
        atilde: "ã",
        Auml: "Ä",
        auml: "ä",
        awconint: "∳",
        awint: "⨑",
        backcong: "≌",
        backepsilon: "϶",
        backprime: "‵",
        backsim: "∽",
        backsimeq: "⋍",
        Backslash: "∖",
        Barv: "⫧",
        barvee: "⊽",
        barwed: "⌅",
        Barwed: "⌆",
        barwedge: "⌅",
        bbrk: "⎵",
        bbrktbrk: "⎶",
        bcong: "≌",
        Bcy: "Б",
        bcy: "б",
        bdquo: "„",
        becaus: "∵",
        because: "∵",
        Because: "∵",
        bemptyv: "⦰",
        bepsi: "϶",
        bernou: "ℬ",
        Bernoullis: "ℬ",
        Beta: "Β",
        beta: "β",
        beth: "ℶ",
        between: "≬",
        Bfr: "𝔅",
        bfr: "𝔟",
        bigcap: "⋂",
        bigcirc: "◯",
        bigcup: "⋃",
        bigodot: "⨀",
        bigoplus: "⨁",
        bigotimes: "⨂",
        bigsqcup: "⨆",
        bigstar: "★",
        bigtriangledown: "▽",
        bigtriangleup: "△",
        biguplus: "⨄",
        bigvee: "⋁",
        bigwedge: "⋀",
        bkarow: "⤍",
        blacklozenge: "⧫",
        blacksquare: "▪",
        blacktriangle: "▴",
        blacktriangledown: "▾",
        blacktriangleleft: "◂",
        blacktriangleright: "▸",
        blank: "␣",
        blk12: "▒",
        blk14: "░",
        blk34: "▓",
        block: "█",
        bne: "=⃥",
        bnequiv: "≡⃥",
        bNot: "⫭",
        bnot: "⌐",
        Bopf: "𝔹",
        bopf: "𝕓",
        bot: "⊥",
        bottom: "⊥",
        bowtie: "⋈",
        boxbox: "⧉",
        boxdl: "┐",
        boxdL: "╕",
        boxDl: "╖",
        boxDL: "╗",
        boxdr: "┌",
        boxdR: "╒",
        boxDr: "╓",
        boxDR: "╔",
        boxh: "─",
        boxH: "═",
        boxhd: "┬",
        boxHd: "╤",
        boxhD: "╥",
        boxHD: "╦",
        boxhu: "┴",
        boxHu: "╧",
        boxhU: "╨",
        boxHU: "╩",
        boxminus: "⊟",
        boxplus: "⊞",
        boxtimes: "⊠",
        boxul: "┘",
        boxuL: "╛",
        boxUl: "╜",
        boxUL: "╝",
        boxur: "└",
        boxuR: "╘",
        boxUr: "╙",
        boxUR: "╚",
        boxv: "│",
        boxV: "║",
        boxvh: "┼",
        boxvH: "╪",
        boxVh: "╫",
        boxVH: "╬",
        boxvl: "┤",
        boxvL: "╡",
        boxVl: "╢",
        boxVL: "╣",
        boxvr: "├",
        boxvR: "╞",
        boxVr: "╟",
        boxVR: "╠",
        bprime: "‵",
        breve: "˘",
        Breve: "˘",
        brvbar: "¦",
        bscr: "𝒷",
        Bscr: "ℬ",
        bsemi: "⁏",
        bsim: "∽",
        bsime: "⋍",
        bsolb: "⧅",
        bsol: "\\",
        bsolhsub: "⟈",
        bull: "•",
        bullet: "•",
        bump: "≎",
        bumpE: "⪮",
        bumpe: "≏",
        Bumpeq: "≎",
        bumpeq: "≏",
        Cacute: "Ć",
        cacute: "ć",
        capand: "⩄",
        capbrcup: "⩉",
        capcap: "⩋",
        cap: "∩",
        Cap: "⋒",
        capcup: "⩇",
        capdot: "⩀",
        CapitalDifferentialD: "ⅅ",
        caps: "∩︀",
        caret: "⁁",
        caron: "ˇ",
        Cayleys: "ℭ",
        ccaps: "⩍",
        Ccaron: "Č",
        ccaron: "č",
        Ccedil: "Ç",
        ccedil: "ç",
        Ccirc: "Ĉ",
        ccirc: "ĉ",
        Cconint: "∰",
        ccups: "⩌",
        ccupssm: "⩐",
        Cdot: "Ċ",
        cdot: "ċ",
        cedil: "¸",
        Cedilla: "¸",
        cemptyv: "⦲",
        cent: "¢",
        centerdot: "·",
        CenterDot: "·",
        cfr: "𝔠",
        Cfr: "ℭ",
        CHcy: "Ч",
        chcy: "ч",
        check: "✓",
        checkmark: "✓",
        Chi: "Χ",
        chi: "χ",
        circ: "ˆ",
        circeq: "≗",
        circlearrowleft: "↺",
        circlearrowright: "↻",
        circledast: "⊛",
        circledcirc: "⊚",
        circleddash: "⊝",
        CircleDot: "⊙",
        circledR: "®",
        circledS: "Ⓢ",
        CircleMinus: "⊖",
        CirclePlus: "⊕",
        CircleTimes: "⊗",
        cir: "○",
        cirE: "⧃",
        cire: "≗",
        cirfnint: "⨐",
        cirmid: "⫯",
        cirscir: "⧂",
        ClockwiseContourIntegral: "∲",
        CloseCurlyDoubleQuote: "”",
        CloseCurlyQuote: "’",
        clubs: "♣",
        clubsuit: "♣",
        colon: ":",
        Colon: "∷",
        Colone: "⩴",
        colone: "≔",
        coloneq: "≔",
        comma: ",",
        commat: "@",
        comp: "∁",
        compfn: "∘",
        complement: "∁",
        complexes: "ℂ",
        cong: "≅",
        congdot: "⩭",
        Congruent: "≡",
        conint: "∮",
        Conint: "∯",
        ContourIntegral: "∮",
        copf: "𝕔",
        Copf: "ℂ",
        coprod: "∐",
        Coproduct: "∐",
        copy: "©",
        COPY: "©",
        copysr: "℗",
        CounterClockwiseContourIntegral: "∳",
        crarr: "↵",
        cross: "✗",
        Cross: "⨯",
        Cscr: "𝒞",
        cscr: "𝒸",
        csub: "⫏",
        csube: "⫑",
        csup: "⫐",
        csupe: "⫒",
        ctdot: "⋯",
        cudarrl: "⤸",
        cudarrr: "⤵",
        cuepr: "⋞",
        cuesc: "⋟",
        cularr: "↶",
        cularrp: "⤽",
        cupbrcap: "⩈",
        cupcap: "⩆",
        CupCap: "≍",
        cup: "∪",
        Cup: "⋓",
        cupcup: "⩊",
        cupdot: "⊍",
        cupor: "⩅",
        cups: "∪︀",
        curarr: "↷",
        curarrm: "⤼",
        curlyeqprec: "⋞",
        curlyeqsucc: "⋟",
        curlyvee: "⋎",
        curlywedge: "⋏",
        curren: "¤",
        curvearrowleft: "↶",
        curvearrowright: "↷",
        cuvee: "⋎",
        cuwed: "⋏",
        cwconint: "∲",
        cwint: "∱",
        cylcty: "⌭",
        dagger: "†",
        Dagger: "‡",
        daleth: "ℸ",
        darr: "↓",
        Darr: "↡",
        dArr: "⇓",
        dash: "‐",
        Dashv: "⫤",
        dashv: "⊣",
        dbkarow: "⤏",
        dblac: "˝",
        Dcaron: "Ď",
        dcaron: "ď",
        Dcy: "Д",
        dcy: "д",
        ddagger: "‡",
        ddarr: "⇊",
        DD: "ⅅ",
        dd: "ⅆ",
        DDotrahd: "⤑",
        ddotseq: "⩷",
        deg: "°",
        Del: "∇",
        Delta: "Δ",
        delta: "δ",
        demptyv: "⦱",
        dfisht: "⥿",
        Dfr: "𝔇",
        dfr: "𝔡",
        dHar: "⥥",
        dharl: "⇃",
        dharr: "⇂",
        DiacriticalAcute: "´",
        DiacriticalDot: "˙",
        DiacriticalDoubleAcute: "˝",
        DiacriticalGrave: "`",
        DiacriticalTilde: "˜",
        diam: "⋄",
        diamond: "⋄",
        Diamond: "⋄",
        diamondsuit: "♦",
        diams: "♦",
        die: "¨",
        DifferentialD: "ⅆ",
        digamma: "ϝ",
        disin: "⋲",
        div: "÷",
        divide: "÷",
        divideontimes: "⋇",
        divonx: "⋇",
        DJcy: "Ђ",
        djcy: "ђ",
        dlcorn: "⌞",
        dlcrop: "⌍",
        dollar: "$",
        Dopf: "𝔻",
        dopf: "𝕕",
        Dot: "¨",
        dot: "˙",
        DotDot: "⃜",
        doteq: "≐",
        doteqdot: "≑",
        DotEqual: "≐",
        dotminus: "∸",
        dotplus: "∔",
        dotsquare: "⊡",
        doublebarwedge: "⌆",
        DoubleContourIntegral: "∯",
        DoubleDot: "¨",
        DoubleDownArrow: "⇓",
        DoubleLeftArrow: "⇐",
        DoubleLeftRightArrow: "⇔",
        DoubleLeftTee: "⫤",
        DoubleLongLeftArrow: "⟸",
        DoubleLongLeftRightArrow: "⟺",
        DoubleLongRightArrow: "⟹",
        DoubleRightArrow: "⇒",
        DoubleRightTee: "⊨",
        DoubleUpArrow: "⇑",
        DoubleUpDownArrow: "⇕",
        DoubleVerticalBar: "∥",
        DownArrowBar: "⤓",
        downarrow: "↓",
        DownArrow: "↓",
        Downarrow: "⇓",
        DownArrowUpArrow: "⇵",
        DownBreve: "̑",
        downdownarrows: "⇊",
        downharpoonleft: "⇃",
        downharpoonright: "⇂",
        DownLeftRightVector: "⥐",
        DownLeftTeeVector: "⥞",
        DownLeftVectorBar: "⥖",
        DownLeftVector: "↽",
        DownRightTeeVector: "⥟",
        DownRightVectorBar: "⥗",
        DownRightVector: "⇁",
        DownTeeArrow: "↧",
        DownTee: "⊤",
        drbkarow: "⤐",
        drcorn: "⌟",
        drcrop: "⌌",
        Dscr: "𝒟",
        dscr: "𝒹",
        DScy: "Ѕ",
        dscy: "ѕ",
        dsol: "⧶",
        Dstrok: "Đ",
        dstrok: "đ",
        dtdot: "⋱",
        dtri: "▿",
        dtrif: "▾",
        duarr: "⇵",
        duhar: "⥯",
        dwangle: "⦦",
        DZcy: "Џ",
        dzcy: "џ",
        dzigrarr: "⟿",
        Eacute: "É",
        eacute: "é",
        easter: "⩮",
        Ecaron: "Ě",
        ecaron: "ě",
        Ecirc: "Ê",
        ecirc: "ê",
        ecir: "≖",
        ecolon: "≕",
        Ecy: "Э",
        ecy: "э",
        eDDot: "⩷",
        Edot: "Ė",
        edot: "ė",
        eDot: "≑",
        ee: "ⅇ",
        efDot: "≒",
        Efr: "𝔈",
        efr: "𝔢",
        eg: "⪚",
        Egrave: "È",
        egrave: "è",
        egs: "⪖",
        egsdot: "⪘",
        el: "⪙",
        Element: "∈",
        elinters: "⏧",
        ell: "ℓ",
        els: "⪕",
        elsdot: "⪗",
        Emacr: "Ē",
        emacr: "ē",
        empty: "∅",
        emptyset: "∅",
        EmptySmallSquare: "◻",
        emptyv: "∅",
        EmptyVerySmallSquare: "▫",
        emsp13: " ",
        emsp14: " ",
        emsp: " ",
        ENG: "Ŋ",
        eng: "ŋ",
        ensp: " ",
        Eogon: "Ę",
        eogon: "ę",
        Eopf: "𝔼",
        eopf: "𝕖",
        epar: "⋕",
        eparsl: "⧣",
        eplus: "⩱",
        epsi: "ε",
        Epsilon: "Ε",
        epsilon: "ε",
        epsiv: "ϵ",
        eqcirc: "≖",
        eqcolon: "≕",
        eqsim: "≂",
        eqslantgtr: "⪖",
        eqslantless: "⪕",
        Equal: "⩵",
        equals: "=",
        EqualTilde: "≂",
        equest: "≟",
        Equilibrium: "⇌",
        equiv: "≡",
        equivDD: "⩸",
        eqvparsl: "⧥",
        erarr: "⥱",
        erDot: "≓",
        escr: "ℯ",
        Escr: "ℰ",
        esdot: "≐",
        Esim: "⩳",
        esim: "≂",
        Eta: "Η",
        eta: "η",
        ETH: "Ð",
        eth: "ð",
        Euml: "Ë",
        euml: "ë",
        euro: "€",
        excl: "!",
        exist: "∃",
        Exists: "∃",
        expectation: "ℰ",
        exponentiale: "ⅇ",
        ExponentialE: "ⅇ",
        fallingdotseq: "≒",
        Fcy: "Ф",
        fcy: "ф",
        female: "♀",
        ffilig: "ﬃ",
        fflig: "ﬀ",
        ffllig: "ﬄ",
        Ffr: "𝔉",
        ffr: "𝔣",
        filig: "ﬁ",
        FilledSmallSquare: "◼",
        FilledVerySmallSquare: "▪",
        fjlig: "fj",
        flat: "♭",
        fllig: "ﬂ",
        fltns: "▱",
        fnof: "ƒ",
        Fopf: "𝔽",
        fopf: "𝕗",
        forall: "∀",
        ForAll: "∀",
        fork: "⋔",
        forkv: "⫙",
        Fouriertrf: "ℱ",
        fpartint: "⨍",
        frac12: "½",
        frac13: "⅓",
        frac14: "¼",
        frac15: "⅕",
        frac16: "⅙",
        frac18: "⅛",
        frac23: "⅔",
        frac25: "⅖",
        frac34: "¾",
        frac35: "⅗",
        frac38: "⅜",
        frac45: "⅘",
        frac56: "⅚",
        frac58: "⅝",
        frac78: "⅞",
        frasl: "⁄",
        frown: "⌢",
        fscr: "𝒻",
        Fscr: "ℱ",
        gacute: "ǵ",
        Gamma: "Γ",
        gamma: "γ",
        Gammad: "Ϝ",
        gammad: "ϝ",
        gap: "⪆",
        Gbreve: "Ğ",
        gbreve: "ğ",
        Gcedil: "Ģ",
        Gcirc: "Ĝ",
        gcirc: "ĝ",
        Gcy: "Г",
        gcy: "г",
        Gdot: "Ġ",
        gdot: "ġ",
        ge: "≥",
        gE: "≧",
        gEl: "⪌",
        gel: "⋛",
        geq: "≥",
        geqq: "≧",
        geqslant: "⩾",
        gescc: "⪩",
        ges: "⩾",
        gesdot: "⪀",
        gesdoto: "⪂",
        gesdotol: "⪄",
        gesl: "⋛︀",
        gesles: "⪔",
        Gfr: "𝔊",
        gfr: "𝔤",
        gg: "≫",
        Gg: "⋙",
        ggg: "⋙",
        gimel: "ℷ",
        GJcy: "Ѓ",
        gjcy: "ѓ",
        gla: "⪥",
        gl: "≷",
        glE: "⪒",
        glj: "⪤",
        gnap: "⪊",
        gnapprox: "⪊",
        gne: "⪈",
        gnE: "≩",
        gneq: "⪈",
        gneqq: "≩",
        gnsim: "⋧",
        Gopf: "𝔾",
        gopf: "𝕘",
        grave: "`",
        GreaterEqual: "≥",
        GreaterEqualLess: "⋛",
        GreaterFullEqual: "≧",
        GreaterGreater: "⪢",
        GreaterLess: "≷",
        GreaterSlantEqual: "⩾",
        GreaterTilde: "≳",
        Gscr: "𝒢",
        gscr: "ℊ",
        gsim: "≳",
        gsime: "⪎",
        gsiml: "⪐",
        gtcc: "⪧",
        gtcir: "⩺",
        gt: ">",
        GT: ">",
        Gt: "≫",
        gtdot: "⋗",
        gtlPar: "⦕",
        gtquest: "⩼",
        gtrapprox: "⪆",
        gtrarr: "⥸",
        gtrdot: "⋗",
        gtreqless: "⋛",
        gtreqqless: "⪌",
        gtrless: "≷",
        gtrsim: "≳",
        gvertneqq: "≩︀",
        gvnE: "≩︀",
        Hacek: "ˇ",
        hairsp: " ",
        half: "½",
        hamilt: "ℋ",
        HARDcy: "Ъ",
        hardcy: "ъ",
        harrcir: "⥈",
        harr: "↔",
        hArr: "⇔",
        harrw: "↭",
        Hat: "^",
        hbar: "ℏ",
        Hcirc: "Ĥ",
        hcirc: "ĥ",
        hearts: "♥",
        heartsuit: "♥",
        hellip: "…",
        hercon: "⊹",
        hfr: "𝔥",
        Hfr: "ℌ",
        HilbertSpace: "ℋ",
        hksearow: "⤥",
        hkswarow: "⤦",
        hoarr: "⇿",
        homtht: "∻",
        hookleftarrow: "↩",
        hookrightarrow: "↪",
        hopf: "𝕙",
        Hopf: "ℍ",
        horbar: "―",
        HorizontalLine: "─",
        hscr: "𝒽",
        Hscr: "ℋ",
        hslash: "ℏ",
        Hstrok: "Ħ",
        hstrok: "ħ",
        HumpDownHump: "≎",
        HumpEqual: "≏",
        hybull: "⁃",
        hyphen: "‐",
        Iacute: "Í",
        iacute: "í",
        ic: "⁣",
        Icirc: "Î",
        icirc: "î",
        Icy: "И",
        icy: "и",
        Idot: "İ",
        IEcy: "Е",
        iecy: "е",
        iexcl: "¡",
        iff: "⇔",
        ifr: "𝔦",
        Ifr: "ℑ",
        Igrave: "Ì",
        igrave: "ì",
        ii: "ⅈ",
        iiiint: "⨌",
        iiint: "∭",
        iinfin: "⧜",
        iiota: "℩",
        IJlig: "Ĳ",
        ijlig: "ĳ",
        Imacr: "Ī",
        imacr: "ī",
        image: "ℑ",
        ImaginaryI: "ⅈ",
        imagline: "ℐ",
        imagpart: "ℑ",
        imath: "ı",
        Im: "ℑ",
        imof: "⊷",
        imped: "Ƶ",
        Implies: "⇒",
        incare: "℅",
        in: "∈",
        infin: "∞",
        infintie: "⧝",
        inodot: "ı",
        intcal: "⊺",
        int: "∫",
        Int: "∬",
        integers: "ℤ",
        Integral: "∫",
        intercal: "⊺",
        Intersection: "⋂",
        intlarhk: "⨗",
        intprod: "⨼",
        InvisibleComma: "⁣",
        InvisibleTimes: "⁢",
        IOcy: "Ё",
        iocy: "ё",
        Iogon: "Į",
        iogon: "į",
        Iopf: "𝕀",
        iopf: "𝕚",
        Iota: "Ι",
        iota: "ι",
        iprod: "⨼",
        iquest: "¿",
        iscr: "𝒾",
        Iscr: "ℐ",
        isin: "∈",
        isindot: "⋵",
        isinE: "⋹",
        isins: "⋴",
        isinsv: "⋳",
        isinv: "∈",
        it: "⁢",
        Itilde: "Ĩ",
        itilde: "ĩ",
        Iukcy: "І",
        iukcy: "і",
        Iuml: "Ï",
        iuml: "ï",
        Jcirc: "Ĵ",
        jcirc: "ĵ",
        Jcy: "Й",
        jcy: "й",
        Jfr: "𝔍",
        jfr: "𝔧",
        jmath: "ȷ",
        Jopf: "𝕁",
        jopf: "𝕛",
        Jscr: "𝒥",
        jscr: "𝒿",
        Jsercy: "Ј",
        jsercy: "ј",
        Jukcy: "Є",
        jukcy: "є",
        Kappa: "Κ",
        kappa: "κ",
        kappav: "ϰ",
        Kcedil: "Ķ",
        kcedil: "ķ",
        Kcy: "К",
        kcy: "к",
        Kfr: "𝔎",
        kfr: "𝔨",
        kgreen: "ĸ",
        KHcy: "Х",
        khcy: "х",
        KJcy: "Ќ",
        kjcy: "ќ",
        Kopf: "𝕂",
        kopf: "𝕜",
        Kscr: "𝒦",
        kscr: "𝓀",
        lAarr: "⇚",
        Lacute: "Ĺ",
        lacute: "ĺ",
        laemptyv: "⦴",
        lagran: "ℒ",
        Lambda: "Λ",
        lambda: "λ",
        lang: "⟨",
        Lang: "⟪",
        langd: "⦑",
        langle: "⟨",
        lap: "⪅",
        Laplacetrf: "ℒ",
        laquo: "«",
        larrb: "⇤",
        larrbfs: "⤟",
        larr: "←",
        Larr: "↞",
        lArr: "⇐",
        larrfs: "⤝",
        larrhk: "↩",
        larrlp: "↫",
        larrpl: "⤹",
        larrsim: "⥳",
        larrtl: "↢",
        latail: "⤙",
        lAtail: "⤛",
        lat: "⪫",
        late: "⪭",
        lates: "⪭︀",
        lbarr: "⤌",
        lBarr: "⤎",
        lbbrk: "❲",
        lbrace: "{",
        lbrack: "[",
        lbrke: "⦋",
        lbrksld: "⦏",
        lbrkslu: "⦍",
        Lcaron: "Ľ",
        lcaron: "ľ",
        Lcedil: "Ļ",
        lcedil: "ļ",
        lceil: "⌈",
        lcub: "{",
        Lcy: "Л",
        lcy: "л",
        ldca: "⤶",
        ldquo: "“",
        ldquor: "„",
        ldrdhar: "⥧",
        ldrushar: "⥋",
        ldsh: "↲",
        le: "≤",
        lE: "≦",
        LeftAngleBracket: "⟨",
        LeftArrowBar: "⇤",
        leftarrow: "←",
        LeftArrow: "←",
        Leftarrow: "⇐",
        LeftArrowRightArrow: "⇆",
        leftarrowtail: "↢",
        LeftCeiling: "⌈",
        LeftDoubleBracket: "⟦",
        LeftDownTeeVector: "⥡",
        LeftDownVectorBar: "⥙",
        LeftDownVector: "⇃",
        LeftFloor: "⌊",
        leftharpoondown: "↽",
        leftharpoonup: "↼",
        leftleftarrows: "⇇",
        leftrightarrow: "↔",
        LeftRightArrow: "↔",
        Leftrightarrow: "⇔",
        leftrightarrows: "⇆",
        leftrightharpoons: "⇋",
        leftrightsquigarrow: "↭",
        LeftRightVector: "⥎",
        LeftTeeArrow: "↤",
        LeftTee: "⊣",
        LeftTeeVector: "⥚",
        leftthreetimes: "⋋",
        LeftTriangleBar: "⧏",
        LeftTriangle: "⊲",
        LeftTriangleEqual: "⊴",
        LeftUpDownVector: "⥑",
        LeftUpTeeVector: "⥠",
        LeftUpVectorBar: "⥘",
        LeftUpVector: "↿",
        LeftVectorBar: "⥒",
        LeftVector: "↼",
        lEg: "⪋",
        leg: "⋚",
        leq: "≤",
        leqq: "≦",
        leqslant: "⩽",
        lescc: "⪨",
        les: "⩽",
        lesdot: "⩿",
        lesdoto: "⪁",
        lesdotor: "⪃",
        lesg: "⋚︀",
        lesges: "⪓",
        lessapprox: "⪅",
        lessdot: "⋖",
        lesseqgtr: "⋚",
        lesseqqgtr: "⪋",
        LessEqualGreater: "⋚",
        LessFullEqual: "≦",
        LessGreater: "≶",
        lessgtr: "≶",
        LessLess: "⪡",
        lesssim: "≲",
        LessSlantEqual: "⩽",
        LessTilde: "≲",
        lfisht: "⥼",
        lfloor: "⌊",
        Lfr: "𝔏",
        lfr: "𝔩",
        lg: "≶",
        lgE: "⪑",
        lHar: "⥢",
        lhard: "↽",
        lharu: "↼",
        lharul: "⥪",
        lhblk: "▄",
        LJcy: "Љ",
        ljcy: "љ",
        llarr: "⇇",
        ll: "≪",
        Ll: "⋘",
        llcorner: "⌞",
        Lleftarrow: "⇚",
        llhard: "⥫",
        lltri: "◺",
        Lmidot: "Ŀ",
        lmidot: "ŀ",
        lmoustache: "⎰",
        lmoust: "⎰",
        lnap: "⪉",
        lnapprox: "⪉",
        lne: "⪇",
        lnE: "≨",
        lneq: "⪇",
        lneqq: "≨",
        lnsim: "⋦",
        loang: "⟬",
        loarr: "⇽",
        lobrk: "⟦",
        longleftarrow: "⟵",
        LongLeftArrow: "⟵",
        Longleftarrow: "⟸",
        longleftrightarrow: "⟷",
        LongLeftRightArrow: "⟷",
        Longleftrightarrow: "⟺",
        longmapsto: "⟼",
        longrightarrow: "⟶",
        LongRightArrow: "⟶",
        Longrightarrow: "⟹",
        looparrowleft: "↫",
        looparrowright: "↬",
        lopar: "⦅",
        Lopf: "𝕃",
        lopf: "𝕝",
        loplus: "⨭",
        lotimes: "⨴",
        lowast: "∗",
        lowbar: "_",
        LowerLeftArrow: "↙",
        LowerRightArrow: "↘",
        loz: "◊",
        lozenge: "◊",
        lozf: "⧫",
        lpar: "(",
        lparlt: "⦓",
        lrarr: "⇆",
        lrcorner: "⌟",
        lrhar: "⇋",
        lrhard: "⥭",
        lrm: "‎",
        lrtri: "⊿",
        lsaquo: "‹",
        lscr: "𝓁",
        Lscr: "ℒ",
        lsh: "↰",
        Lsh: "↰",
        lsim: "≲",
        lsime: "⪍",
        lsimg: "⪏",
        lsqb: "[",
        lsquo: "‘",
        lsquor: "‚",
        Lstrok: "Ł",
        lstrok: "ł",
        ltcc: "⪦",
        ltcir: "⩹",
        lt: "<",
        LT: "<",
        Lt: "≪",
        ltdot: "⋖",
        lthree: "⋋",
        ltimes: "⋉",
        ltlarr: "⥶",
        ltquest: "⩻",
        ltri: "◃",
        ltrie: "⊴",
        ltrif: "◂",
        ltrPar: "⦖",
        lurdshar: "⥊",
        luruhar: "⥦",
        lvertneqq: "≨︀",
        lvnE: "≨︀",
        macr: "¯",
        male: "♂",
        malt: "✠",
        maltese: "✠",
        Map: "⤅",
        map: "↦",
        mapsto: "↦",
        mapstodown: "↧",
        mapstoleft: "↤",
        mapstoup: "↥",
        marker: "▮",
        mcomma: "⨩",
        Mcy: "М",
        mcy: "м",
        mdash: "—",
        mDDot: "∺",
        measuredangle: "∡",
        MediumSpace: " ",
        Mellintrf: "ℳ",
        Mfr: "𝔐",
        mfr: "𝔪",
        mho: "℧",
        micro: "µ",
        midast: "*",
        midcir: "⫰",
        mid: "∣",
        middot: "·",
        minusb: "⊟",
        minus: "−",
        minusd: "∸",
        minusdu: "⨪",
        MinusPlus: "∓",
        mlcp: "⫛",
        mldr: "…",
        mnplus: "∓",
        models: "⊧",
        Mopf: "𝕄",
        mopf: "𝕞",
        mp: "∓",
        mscr: "𝓂",
        Mscr: "ℳ",
        mstpos: "∾",
        Mu: "Μ",
        mu: "μ",
        multimap: "⊸",
        mumap: "⊸",
        nabla: "∇",
        Nacute: "Ń",
        nacute: "ń",
        nang: "∠⃒",
        nap: "≉",
        napE: "⩰̸",
        napid: "≋̸",
        napos: "ŉ",
        napprox: "≉",
        natural: "♮",
        naturals: "ℕ",
        natur: "♮",
        nbsp: " ",
        nbump: "≎̸",
        nbumpe: "≏̸",
        ncap: "⩃",
        Ncaron: "Ň",
        ncaron: "ň",
        Ncedil: "Ņ",
        ncedil: "ņ",
        ncong: "≇",
        ncongdot: "⩭̸",
        ncup: "⩂",
        Ncy: "Н",
        ncy: "н",
        ndash: "–",
        nearhk: "⤤",
        nearr: "↗",
        neArr: "⇗",
        nearrow: "↗",
        ne: "≠",
        nedot: "≐̸",
        NegativeMediumSpace: "​",
        NegativeThickSpace: "​",
        NegativeThinSpace: "​",
        NegativeVeryThinSpace: "​",
        nequiv: "≢",
        nesear: "⤨",
        nesim: "≂̸",
        NestedGreaterGreater: "≫",
        NestedLessLess: "≪",
        NewLine: "\n",
        nexist: "∄",
        nexists: "∄",
        Nfr: "𝔑",
        nfr: "𝔫",
        ngE: "≧̸",
        nge: "≱",
        ngeq: "≱",
        ngeqq: "≧̸",
        ngeqslant: "⩾̸",
        nges: "⩾̸",
        nGg: "⋙̸",
        ngsim: "≵",
        nGt: "≫⃒",
        ngt: "≯",
        ngtr: "≯",
        nGtv: "≫̸",
        nharr: "↮",
        nhArr: "⇎",
        nhpar: "⫲",
        ni: "∋",
        nis: "⋼",
        nisd: "⋺",
        niv: "∋",
        NJcy: "Њ",
        njcy: "њ",
        nlarr: "↚",
        nlArr: "⇍",
        nldr: "‥",
        nlE: "≦̸",
        nle: "≰",
        nleftarrow: "↚",
        nLeftarrow: "⇍",
        nleftrightarrow: "↮",
        nLeftrightarrow: "⇎",
        nleq: "≰",
        nleqq: "≦̸",
        nleqslant: "⩽̸",
        nles: "⩽̸",
        nless: "≮",
        nLl: "⋘̸",
        nlsim: "≴",
        nLt: "≪⃒",
        nlt: "≮",
        nltri: "⋪",
        nltrie: "⋬",
        nLtv: "≪̸",
        nmid: "∤",
        NoBreak: "⁠",
        NonBreakingSpace: " ",
        nopf: "𝕟",
        Nopf: "ℕ",
        Not: "⫬",
        not: "¬",
        NotCongruent: "≢",
        NotCupCap: "≭",
        NotDoubleVerticalBar: "∦",
        NotElement: "∉",
        NotEqual: "≠",
        NotEqualTilde: "≂̸",
        NotExists: "∄",
        NotGreater: "≯",
        NotGreaterEqual: "≱",
        NotGreaterFullEqual: "≧̸",
        NotGreaterGreater: "≫̸",
        NotGreaterLess: "≹",
        NotGreaterSlantEqual: "⩾̸",
        NotGreaterTilde: "≵",
        NotHumpDownHump: "≎̸",
        NotHumpEqual: "≏̸",
        notin: "∉",
        notindot: "⋵̸",
        notinE: "⋹̸",
        notinva: "∉",
        notinvb: "⋷",
        notinvc: "⋶",
        NotLeftTriangleBar: "⧏̸",
        NotLeftTriangle: "⋪",
        NotLeftTriangleEqual: "⋬",
        NotLess: "≮",
        NotLessEqual: "≰",
        NotLessGreater: "≸",
        NotLessLess: "≪̸",
        NotLessSlantEqual: "⩽̸",
        NotLessTilde: "≴",
        NotNestedGreaterGreater: "⪢̸",
        NotNestedLessLess: "⪡̸",
        notni: "∌",
        notniva: "∌",
        notnivb: "⋾",
        notnivc: "⋽",
        NotPrecedes: "⊀",
        NotPrecedesEqual: "⪯̸",
        NotPrecedesSlantEqual: "⋠",
        NotReverseElement: "∌",
        NotRightTriangleBar: "⧐̸",
        NotRightTriangle: "⋫",
        NotRightTriangleEqual: "⋭",
        NotSquareSubset: "⊏̸",
        NotSquareSubsetEqual: "⋢",
        NotSquareSuperset: "⊐̸",
        NotSquareSupersetEqual: "⋣",
        NotSubset: "⊂⃒",
        NotSubsetEqual: "⊈",
        NotSucceeds: "⊁",
        NotSucceedsEqual: "⪰̸",
        NotSucceedsSlantEqual: "⋡",
        NotSucceedsTilde: "≿̸",
        NotSuperset: "⊃⃒",
        NotSupersetEqual: "⊉",
        NotTilde: "≁",
        NotTildeEqual: "≄",
        NotTildeFullEqual: "≇",
        NotTildeTilde: "≉",
        NotVerticalBar: "∤",
        nparallel: "∦",
        npar: "∦",
        nparsl: "⫽⃥",
        npart: "∂̸",
        npolint: "⨔",
        npr: "⊀",
        nprcue: "⋠",
        nprec: "⊀",
        npreceq: "⪯̸",
        npre: "⪯̸",
        nrarrc: "⤳̸",
        nrarr: "↛",
        nrArr: "⇏",
        nrarrw: "↝̸",
        nrightarrow: "↛",
        nRightarrow: "⇏",
        nrtri: "⋫",
        nrtrie: "⋭",
        nsc: "⊁",
        nsccue: "⋡",
        nsce: "⪰̸",
        Nscr: "𝒩",
        nscr: "𝓃",
        nshortmid: "∤",
        nshortparallel: "∦",
        nsim: "≁",
        nsime: "≄",
        nsimeq: "≄",
        nsmid: "∤",
        nspar: "∦",
        nsqsube: "⋢",
        nsqsupe: "⋣",
        nsub: "⊄",
        nsubE: "⫅̸",
        nsube: "⊈",
        nsubset: "⊂⃒",
        nsubseteq: "⊈",
        nsubseteqq: "⫅̸",
        nsucc: "⊁",
        nsucceq: "⪰̸",
        nsup: "⊅",
        nsupE: "⫆̸",
        nsupe: "⊉",
        nsupset: "⊃⃒",
        nsupseteq: "⊉",
        nsupseteqq: "⫆̸",
        ntgl: "≹",
        Ntilde: "Ñ",
        ntilde: "ñ",
        ntlg: "≸",
        ntriangleleft: "⋪",
        ntrianglelefteq: "⋬",
        ntriangleright: "⋫",
        ntrianglerighteq: "⋭",
        Nu: "Ν",
        nu: "ν",
        num: "#",
        numero: "№",
        numsp: " ",
        nvap: "≍⃒",
        nvdash: "⊬",
        nvDash: "⊭",
        nVdash: "⊮",
        nVDash: "⊯",
        nvge: "≥⃒",
        nvgt: ">⃒",
        nvHarr: "⤄",
        nvinfin: "⧞",
        nvlArr: "⤂",
        nvle: "≤⃒",
        nvlt: "<⃒",
        nvltrie: "⊴⃒",
        nvrArr: "⤃",
        nvrtrie: "⊵⃒",
        nvsim: "∼⃒",
        nwarhk: "⤣",
        nwarr: "↖",
        nwArr: "⇖",
        nwarrow: "↖",
        nwnear: "⤧",
        Oacute: "Ó",
        oacute: "ó",
        oast: "⊛",
        Ocirc: "Ô",
        ocirc: "ô",
        ocir: "⊚",
        Ocy: "О",
        ocy: "о",
        odash: "⊝",
        Odblac: "Ő",
        odblac: "ő",
        odiv: "⨸",
        odot: "⊙",
        odsold: "⦼",
        OElig: "Œ",
        oelig: "œ",
        ofcir: "⦿",
        Ofr: "𝔒",
        ofr: "𝔬",
        ogon: "˛",
        Ograve: "Ò",
        ograve: "ò",
        ogt: "⧁",
        ohbar: "⦵",
        ohm: "Ω",
        oint: "∮",
        olarr: "↺",
        olcir: "⦾",
        olcross: "⦻",
        oline: "‾",
        olt: "⧀",
        Omacr: "Ō",
        omacr: "ō",
        Omega: "Ω",
        omega: "ω",
        Omicron: "Ο",
        omicron: "ο",
        omid: "⦶",
        ominus: "⊖",
        Oopf: "𝕆",
        oopf: "𝕠",
        opar: "⦷",
        OpenCurlyDoubleQuote: "“",
        OpenCurlyQuote: "‘",
        operp: "⦹",
        oplus: "⊕",
        orarr: "↻",
        Or: "⩔",
        or: "∨",
        ord: "⩝",
        order: "ℴ",
        orderof: "ℴ",
        ordf: "ª",
        ordm: "º",
        origof: "⊶",
        oror: "⩖",
        orslope: "⩗",
        orv: "⩛",
        oS: "Ⓢ",
        Oscr: "𝒪",
        oscr: "ℴ",
        Oslash: "Ø",
        oslash: "ø",
        osol: "⊘",
        Otilde: "Õ",
        otilde: "õ",
        otimesas: "⨶",
        Otimes: "⨷",
        otimes: "⊗",
        Ouml: "Ö",
        ouml: "ö",
        ovbar: "⌽",
        OverBar: "‾",
        OverBrace: "⏞",
        OverBracket: "⎴",
        OverParenthesis: "⏜",
        para: "¶",
        parallel: "∥",
        par: "∥",
        parsim: "⫳",
        parsl: "⫽",
        part: "∂",
        PartialD: "∂",
        Pcy: "П",
        pcy: "п",
        percnt: "%",
        period: ".",
        permil: "‰",
        perp: "⊥",
        pertenk: "‱",
        Pfr: "𝔓",
        pfr: "𝔭",
        Phi: "Φ",
        phi: "φ",
        phiv: "ϕ",
        phmmat: "ℳ",
        phone: "☎",
        Pi: "Π",
        pi: "π",
        pitchfork: "⋔",
        piv: "ϖ",
        planck: "ℏ",
        planckh: "ℎ",
        plankv: "ℏ",
        plusacir: "⨣",
        plusb: "⊞",
        pluscir: "⨢",
        plus: "+",
        plusdo: "∔",
        plusdu: "⨥",
        pluse: "⩲",
        PlusMinus: "±",
        plusmn: "±",
        plussim: "⨦",
        plustwo: "⨧",
        pm: "±",
        Poincareplane: "ℌ",
        pointint: "⨕",
        popf: "𝕡",
        Popf: "ℙ",
        pound: "£",
        prap: "⪷",
        Pr: "⪻",
        pr: "≺",
        prcue: "≼",
        precapprox: "⪷",
        prec: "≺",
        preccurlyeq: "≼",
        Precedes: "≺",
        PrecedesEqual: "⪯",
        PrecedesSlantEqual: "≼",
        PrecedesTilde: "≾",
        preceq: "⪯",
        precnapprox: "⪹",
        precneqq: "⪵",
        precnsim: "⋨",
        pre: "⪯",
        prE: "⪳",
        precsim: "≾",
        prime: "′",
        Prime: "″",
        primes: "ℙ",
        prnap: "⪹",
        prnE: "⪵",
        prnsim: "⋨",
        prod: "∏",
        Product: "∏",
        profalar: "⌮",
        profline: "⌒",
        profsurf: "⌓",
        prop: "∝",
        Proportional: "∝",
        Proportion: "∷",
        propto: "∝",
        prsim: "≾",
        prurel: "⊰",
        Pscr: "𝒫",
        pscr: "𝓅",
        Psi: "Ψ",
        psi: "ψ",
        puncsp: " ",
        Qfr: "𝔔",
        qfr: "𝔮",
        qint: "⨌",
        qopf: "𝕢",
        Qopf: "ℚ",
        qprime: "⁗",
        Qscr: "𝒬",
        qscr: "𝓆",
        quaternions: "ℍ",
        quatint: "⨖",
        quest: "?",
        questeq: "≟",
        quot: '"',
        QUOT: '"',
        rAarr: "⇛",
        race: "∽̱",
        Racute: "Ŕ",
        racute: "ŕ",
        radic: "√",
        raemptyv: "⦳",
        rang: "⟩",
        Rang: "⟫",
        rangd: "⦒",
        range: "⦥",
        rangle: "⟩",
        raquo: "»",
        rarrap: "⥵",
        rarrb: "⇥",
        rarrbfs: "⤠",
        rarrc: "⤳",
        rarr: "→",
        Rarr: "↠",
        rArr: "⇒",
        rarrfs: "⤞",
        rarrhk: "↪",
        rarrlp: "↬",
        rarrpl: "⥅",
        rarrsim: "⥴",
        Rarrtl: "⤖",
        rarrtl: "↣",
        rarrw: "↝",
        ratail: "⤚",
        rAtail: "⤜",
        ratio: "∶",
        rationals: "ℚ",
        rbarr: "⤍",
        rBarr: "⤏",
        RBarr: "⤐",
        rbbrk: "❳",
        rbrace: "}",
        rbrack: "]",
        rbrke: "⦌",
        rbrksld: "⦎",
        rbrkslu: "⦐",
        Rcaron: "Ř",
        rcaron: "ř",
        Rcedil: "Ŗ",
        rcedil: "ŗ",
        rceil: "⌉",
        rcub: "}",
        Rcy: "Р",
        rcy: "р",
        rdca: "⤷",
        rdldhar: "⥩",
        rdquo: "”",
        rdquor: "”",
        rdsh: "↳",
        real: "ℜ",
        realine: "ℛ",
        realpart: "ℜ",
        reals: "ℝ",
        Re: "ℜ",
        rect: "▭",
        reg: "®",
        REG: "®",
        ReverseElement: "∋",
        ReverseEquilibrium: "⇋",
        ReverseUpEquilibrium: "⥯",
        rfisht: "⥽",
        rfloor: "⌋",
        rfr: "𝔯",
        Rfr: "ℜ",
        rHar: "⥤",
        rhard: "⇁",
        rharu: "⇀",
        rharul: "⥬",
        Rho: "Ρ",
        rho: "ρ",
        rhov: "ϱ",
        RightAngleBracket: "⟩",
        RightArrowBar: "⇥",
        rightarrow: "→",
        RightArrow: "→",
        Rightarrow: "⇒",
        RightArrowLeftArrow: "⇄",
        rightarrowtail: "↣",
        RightCeiling: "⌉",
        RightDoubleBracket: "⟧",
        RightDownTeeVector: "⥝",
        RightDownVectorBar: "⥕",
        RightDownVector: "⇂",
        RightFloor: "⌋",
        rightharpoondown: "⇁",
        rightharpoonup: "⇀",
        rightleftarrows: "⇄",
        rightleftharpoons: "⇌",
        rightrightarrows: "⇉",
        rightsquigarrow: "↝",
        RightTeeArrow: "↦",
        RightTee: "⊢",
        RightTeeVector: "⥛",
        rightthreetimes: "⋌",
        RightTriangleBar: "⧐",
        RightTriangle: "⊳",
        RightTriangleEqual: "⊵",
        RightUpDownVector: "⥏",
        RightUpTeeVector: "⥜",
        RightUpVectorBar: "⥔",
        RightUpVector: "↾",
        RightVectorBar: "⥓",
        RightVector: "⇀",
        ring: "˚",
        risingdotseq: "≓",
        rlarr: "⇄",
        rlhar: "⇌",
        rlm: "‏",
        rmoustache: "⎱",
        rmoust: "⎱",
        rnmid: "⫮",
        roang: "⟭",
        roarr: "⇾",
        robrk: "⟧",
        ropar: "⦆",
        ropf: "𝕣",
        Ropf: "ℝ",
        roplus: "⨮",
        rotimes: "⨵",
        RoundImplies: "⥰",
        rpar: ")",
        rpargt: "⦔",
        rppolint: "⨒",
        rrarr: "⇉",
        Rrightarrow: "⇛",
        rsaquo: "›",
        rscr: "𝓇",
        Rscr: "ℛ",
        rsh: "↱",
        Rsh: "↱",
        rsqb: "]",
        rsquo: "’",
        rsquor: "’",
        rthree: "⋌",
        rtimes: "⋊",
        rtri: "▹",
        rtrie: "⊵",
        rtrif: "▸",
        rtriltri: "⧎",
        RuleDelayed: "⧴",
        ruluhar: "⥨",
        rx: "℞",
        Sacute: "Ś",
        sacute: "ś",
        sbquo: "‚",
        scap: "⪸",
        Scaron: "Š",
        scaron: "š",
        Sc: "⪼",
        sc: "≻",
        sccue: "≽",
        sce: "⪰",
        scE: "⪴",
        Scedil: "Ş",
        scedil: "ş",
        Scirc: "Ŝ",
        scirc: "ŝ",
        scnap: "⪺",
        scnE: "⪶",
        scnsim: "⋩",
        scpolint: "⨓",
        scsim: "≿",
        Scy: "С",
        scy: "с",
        sdotb: "⊡",
        sdot: "⋅",
        sdote: "⩦",
        searhk: "⤥",
        searr: "↘",
        seArr: "⇘",
        searrow: "↘",
        sect: "§",
        semi: ";",
        seswar: "⤩",
        setminus: "∖",
        setmn: "∖",
        sext: "✶",
        Sfr: "𝔖",
        sfr: "𝔰",
        sfrown: "⌢",
        sharp: "♯",
        SHCHcy: "Щ",
        shchcy: "щ",
        SHcy: "Ш",
        shcy: "ш",
        ShortDownArrow: "↓",
        ShortLeftArrow: "←",
        shortmid: "∣",
        shortparallel: "∥",
        ShortRightArrow: "→",
        ShortUpArrow: "↑",
        shy: "­",
        Sigma: "Σ",
        sigma: "σ",
        sigmaf: "ς",
        sigmav: "ς",
        sim: "∼",
        simdot: "⩪",
        sime: "≃",
        simeq: "≃",
        simg: "⪞",
        simgE: "⪠",
        siml: "⪝",
        simlE: "⪟",
        simne: "≆",
        simplus: "⨤",
        simrarr: "⥲",
        slarr: "←",
        SmallCircle: "∘",
        smallsetminus: "∖",
        smashp: "⨳",
        smeparsl: "⧤",
        smid: "∣",
        smile: "⌣",
        smt: "⪪",
        smte: "⪬",
        smtes: "⪬︀",
        SOFTcy: "Ь",
        softcy: "ь",
        solbar: "⌿",
        solb: "⧄",
        sol: "/",
        Sopf: "𝕊",
        sopf: "𝕤",
        spades: "♠",
        spadesuit: "♠",
        spar: "∥",
        sqcap: "⊓",
        sqcaps: "⊓︀",
        sqcup: "⊔",
        sqcups: "⊔︀",
        Sqrt: "√",
        sqsub: "⊏",
        sqsube: "⊑",
        sqsubset: "⊏",
        sqsubseteq: "⊑",
        sqsup: "⊐",
        sqsupe: "⊒",
        sqsupset: "⊐",
        sqsupseteq: "⊒",
        square: "□",
        Square: "□",
        SquareIntersection: "⊓",
        SquareSubset: "⊏",
        SquareSubsetEqual: "⊑",
        SquareSuperset: "⊐",
        SquareSupersetEqual: "⊒",
        SquareUnion: "⊔",
        squarf: "▪",
        squ: "□",
        squf: "▪",
        srarr: "→",
        Sscr: "𝒮",
        sscr: "𝓈",
        ssetmn: "∖",
        ssmile: "⌣",
        sstarf: "⋆",
        Star: "⋆",
        star: "☆",
        starf: "★",
        straightepsilon: "ϵ",
        straightphi: "ϕ",
        strns: "¯",
        sub: "⊂",
        Sub: "⋐",
        subdot: "⪽",
        subE: "⫅",
        sube: "⊆",
        subedot: "⫃",
        submult: "⫁",
        subnE: "⫋",
        subne: "⊊",
        subplus: "⪿",
        subrarr: "⥹",
        subset: "⊂",
        Subset: "⋐",
        subseteq: "⊆",
        subseteqq: "⫅",
        SubsetEqual: "⊆",
        subsetneq: "⊊",
        subsetneqq: "⫋",
        subsim: "⫇",
        subsub: "⫕",
        subsup: "⫓",
        succapprox: "⪸",
        succ: "≻",
        succcurlyeq: "≽",
        Succeeds: "≻",
        SucceedsEqual: "⪰",
        SucceedsSlantEqual: "≽",
        SucceedsTilde: "≿",
        succeq: "⪰",
        succnapprox: "⪺",
        succneqq: "⪶",
        succnsim: "⋩",
        succsim: "≿",
        SuchThat: "∋",
        sum: "∑",
        Sum: "∑",
        sung: "♪",
        sup1: "¹",
        sup2: "²",
        sup3: "³",
        sup: "⊃",
        Sup: "⋑",
        supdot: "⪾",
        supdsub: "⫘",
        supE: "⫆",
        supe: "⊇",
        supedot: "⫄",
        Superset: "⊃",
        SupersetEqual: "⊇",
        suphsol: "⟉",
        suphsub: "⫗",
        suplarr: "⥻",
        supmult: "⫂",
        supnE: "⫌",
        supne: "⊋",
        supplus: "⫀",
        supset: "⊃",
        Supset: "⋑",
        supseteq: "⊇",
        supseteqq: "⫆",
        supsetneq: "⊋",
        supsetneqq: "⫌",
        supsim: "⫈",
        supsub: "⫔",
        supsup: "⫖",
        swarhk: "⤦",
        swarr: "↙",
        swArr: "⇙",
        swarrow: "↙",
        swnwar: "⤪",
        szlig: "ß",
        Tab: "\t",
        target: "⌖",
        Tau: "Τ",
        tau: "τ",
        tbrk: "⎴",
        Tcaron: "Ť",
        tcaron: "ť",
        Tcedil: "Ţ",
        tcedil: "ţ",
        Tcy: "Т",
        tcy: "т",
        tdot: "⃛",
        telrec: "⌕",
        Tfr: "𝔗",
        tfr: "𝔱",
        there4: "∴",
        therefore: "∴",
        Therefore: "∴",
        Theta: "Θ",
        theta: "θ",
        thetasym: "ϑ",
        thetav: "ϑ",
        thickapprox: "≈",
        thicksim: "∼",
        ThickSpace: "  ",
        ThinSpace: " ",
        thinsp: " ",
        thkap: "≈",
        thksim: "∼",
        THORN: "Þ",
        thorn: "þ",
        tilde: "˜",
        Tilde: "∼",
        TildeEqual: "≃",
        TildeFullEqual: "≅",
        TildeTilde: "≈",
        timesbar: "⨱",
        timesb: "⊠",
        times: "×",
        timesd: "⨰",
        tint: "∭",
        toea: "⤨",
        topbot: "⌶",
        topcir: "⫱",
        top: "⊤",
        Topf: "𝕋",
        topf: "𝕥",
        topfork: "⫚",
        tosa: "⤩",
        tprime: "‴",
        trade: "™",
        TRADE: "™",
        triangle: "▵",
        triangledown: "▿",
        triangleleft: "◃",
        trianglelefteq: "⊴",
        triangleq: "≜",
        triangleright: "▹",
        trianglerighteq: "⊵",
        tridot: "◬",
        trie: "≜",
        triminus: "⨺",
        TripleDot: "⃛",
        triplus: "⨹",
        trisb: "⧍",
        tritime: "⨻",
        trpezium: "⏢",
        Tscr: "𝒯",
        tscr: "𝓉",
        TScy: "Ц",
        tscy: "ц",
        TSHcy: "Ћ",
        tshcy: "ћ",
        Tstrok: "Ŧ",
        tstrok: "ŧ",
        twixt: "≬",
        twoheadleftarrow: "↞",
        twoheadrightarrow: "↠",
        Uacute: "Ú",
        uacute: "ú",
        uarr: "↑",
        Uarr: "↟",
        uArr: "⇑",
        Uarrocir: "⥉",
        Ubrcy: "Ў",
        ubrcy: "ў",
        Ubreve: "Ŭ",
        ubreve: "ŭ",
        Ucirc: "Û",
        ucirc: "û",
        Ucy: "У",
        ucy: "у",
        udarr: "⇅",
        Udblac: "Ű",
        udblac: "ű",
        udhar: "⥮",
        ufisht: "⥾",
        Ufr: "𝔘",
        ufr: "𝔲",
        Ugrave: "Ù",
        ugrave: "ù",
        uHar: "⥣",
        uharl: "↿",
        uharr: "↾",
        uhblk: "▀",
        ulcorn: "⌜",
        ulcorner: "⌜",
        ulcrop: "⌏",
        ultri: "◸",
        Umacr: "Ū",
        umacr: "ū",
        uml: "¨",
        UnderBar: "_",
        UnderBrace: "⏟",
        UnderBracket: "⎵",
        UnderParenthesis: "⏝",
        Union: "⋃",
        UnionPlus: "⊎",
        Uogon: "Ų",
        uogon: "ų",
        Uopf: "𝕌",
        uopf: "𝕦",
        UpArrowBar: "⤒",
        uparrow: "↑",
        UpArrow: "↑",
        Uparrow: "⇑",
        UpArrowDownArrow: "⇅",
        updownarrow: "↕",
        UpDownArrow: "↕",
        Updownarrow: "⇕",
        UpEquilibrium: "⥮",
        upharpoonleft: "↿",
        upharpoonright: "↾",
        uplus: "⊎",
        UpperLeftArrow: "↖",
        UpperRightArrow: "↗",
        upsi: "υ",
        Upsi: "ϒ",
        upsih: "ϒ",
        Upsilon: "Υ",
        upsilon: "υ",
        UpTeeArrow: "↥",
        UpTee: "⊥",
        upuparrows: "⇈",
        urcorn: "⌝",
        urcorner: "⌝",
        urcrop: "⌎",
        Uring: "Ů",
        uring: "ů",
        urtri: "◹",
        Uscr: "𝒰",
        uscr: "𝓊",
        utdot: "⋰",
        Utilde: "Ũ",
        utilde: "ũ",
        utri: "▵",
        utrif: "▴",
        uuarr: "⇈",
        Uuml: "Ü",
        uuml: "ü",
        uwangle: "⦧",
        vangrt: "⦜",
        varepsilon: "ϵ",
        varkappa: "ϰ",
        varnothing: "∅",
        varphi: "ϕ",
        varpi: "ϖ",
        varpropto: "∝",
        varr: "↕",
        vArr: "⇕",
        varrho: "ϱ",
        varsigma: "ς",
        varsubsetneq: "⊊︀",
        varsubsetneqq: "⫋︀",
        varsupsetneq: "⊋︀",
        varsupsetneqq: "⫌︀",
        vartheta: "ϑ",
        vartriangleleft: "⊲",
        vartriangleright: "⊳",
        vBar: "⫨",
        Vbar: "⫫",
        vBarv: "⫩",
        Vcy: "В",
        vcy: "в",
        vdash: "⊢",
        vDash: "⊨",
        Vdash: "⊩",
        VDash: "⊫",
        Vdashl: "⫦",
        veebar: "⊻",
        vee: "∨",
        Vee: "⋁",
        veeeq: "≚",
        vellip: "⋮",
        verbar: "|",
        Verbar: "‖",
        vert: "|",
        Vert: "‖",
        VerticalBar: "∣",
        VerticalLine: "|",
        VerticalSeparator: "❘",
        VerticalTilde: "≀",
        VeryThinSpace: " ",
        Vfr: "𝔙",
        vfr: "𝔳",
        vltri: "⊲",
        vnsub: "⊂⃒",
        vnsup: "⊃⃒",
        Vopf: "𝕍",
        vopf: "𝕧",
        vprop: "∝",
        vrtri: "⊳",
        Vscr: "𝒱",
        vscr: "𝓋",
        vsubnE: "⫋︀",
        vsubne: "⊊︀",
        vsupnE: "⫌︀",
        vsupne: "⊋︀",
        Vvdash: "⊪",
        vzigzag: "⦚",
        Wcirc: "Ŵ",
        wcirc: "ŵ",
        wedbar: "⩟",
        wedge: "∧",
        Wedge: "⋀",
        wedgeq: "≙",
        weierp: "℘",
        Wfr: "𝔚",
        wfr: "𝔴",
        Wopf: "𝕎",
        wopf: "𝕨",
        wp: "℘",
        wr: "≀",
        wreath: "≀",
        Wscr: "𝒲",
        wscr: "𝓌",
        xcap: "⋂",
        xcirc: "◯",
        xcup: "⋃",
        xdtri: "▽",
        Xfr: "𝔛",
        xfr: "𝔵",
        xharr: "⟷",
        xhArr: "⟺",
        Xi: "Ξ",
        xi: "ξ",
        xlarr: "⟵",
        xlArr: "⟸",
        xmap: "⟼",
        xnis: "⋻",
        xodot: "⨀",
        Xopf: "𝕏",
        xopf: "𝕩",
        xoplus: "⨁",
        xotime: "⨂",
        xrarr: "⟶",
        xrArr: "⟹",
        Xscr: "𝒳",
        xscr: "𝓍",
        xsqcup: "⨆",
        xuplus: "⨄",
        xutri: "△",
        xvee: "⋁",
        xwedge: "⋀",
        Yacute: "Ý",
        yacute: "ý",
        YAcy: "Я",
        yacy: "я",
        Ycirc: "Ŷ",
        ycirc: "ŷ",
        Ycy: "Ы",
        ycy: "ы",
        yen: "¥",
        Yfr: "𝔜",
        yfr: "𝔶",
        YIcy: "Ї",
        yicy: "ї",
        Yopf: "𝕐",
        yopf: "𝕪",
        Yscr: "𝒴",
        yscr: "𝓎",
        YUcy: "Ю",
        yucy: "ю",
        yuml: "ÿ",
        Yuml: "Ÿ",
        Zacute: "Ź",
        zacute: "ź",
        Zcaron: "Ž",
        zcaron: "ž",
        Zcy: "З",
        zcy: "з",
        Zdot: "Ż",
        zdot: "ż",
        zeetrf: "ℨ",
        ZeroWidthSpace: "​",
        Zeta: "Ζ",
        zeta: "ζ",
        zfr: "𝔷",
        Zfr: "ℨ",
        ZHcy: "Ж",
        zhcy: "ж",
        zigrarr: "⇝",
        zopf: "𝕫",
        Zopf: "ℤ",
        Zscr: "𝒵",
        zscr: "𝓏",
        zwj: "‍",
        zwnj: "‌",
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return function () {
          return e;
        };
      }
      var i = function () {};
      (i.thatReturns = r),
        (i.thatReturnsFalse = r(!1)),
        (i.thatReturnsTrue = r(!0)),
        (i.thatReturnsNull = r(null)),
        (i.thatReturnsThis = function () {
          return this;
        }),
        (i.thatReturnsArgument = function (e) {
          return e;
        }),
        (e.exports = i);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n, r, o, s, a, l) {
        if ((i(t), !e)) {
          var c;
          if (void 0 === t)
            c = new Error(
              "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.",
            );
          else {
            var u = [n, r, o, s, a, l],
              p = 0;
            (c = new Error(
              t.replace(/%s/g, function () {
                return u[p++];
              }),
            )),
              (c.name = "Invariant Violation");
          }
          throw ((c.framesToPop = 1), c);
        }
      }
      var i = function (e) {};
      e.exports = r;
    },
    function (e, t, n) {
      "use strict";
      var r = {
          childContextTypes: !0,
          contextTypes: !0,
          defaultProps: !0,
          displayName: !0,
          getDefaultProps: !0,
          mixins: !0,
          propTypes: !0,
          type: !0,
        },
        i = {
          name: !0,
          length: !0,
          prototype: !0,
          caller: !0,
          arguments: !0,
          arity: !0,
        },
        o = "function" == typeof Object.getOwnPropertySymbols;
      e.exports = function (e, t, n) {
        if ("string" != typeof t) {
          var s = Object.getOwnPropertyNames(t);
          o && (s = s.concat(Object.getOwnPropertySymbols(t)));
          for (var a = 0; a < s.length; ++a)
            if (!(r[s[a]] || i[s[a]] || (n && n[s[a]])))
              try {
                e[s[a]] = t[s[a]];
              } catch (e) {}
        }
        return e;
      };
    },
    function (e, t, n) {
      "use strict";
      var r = function (e, t, n, r, i, o, s, a) {
        if (!e) {
          var l;
          if (void 0 === t)
            l = new Error(
              "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.",
            );
          else {
            var c = [n, r, i, o, s, a],
              u = 0;
            (l = new Error(
              t.replace(/%s/g, function () {
                return c[u++];
              }),
            )),
              (l.name = "Invariant Violation");
          }
          throw ((l.framesToPop = 1), l);
        }
      };
      e.exports = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var i =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        };
      t.default = function (e, t) {
        return Object.keys(t).reduce(function (n, o) {
          return i(
            {},
            n,
            r({}, o, function (n, r, s) {
              e(n, r, i({}, t[o], { options: s }));
            }),
          );
        }, {});
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      Object.defineProperty(t, "__esModule", { value: !0 }), (t.types = void 0);
      var i =
          Object.assign ||
          function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          },
        o = n(116),
        s = r(o),
        a = n(119),
        l = r(a),
        c = n(44),
        u = (function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var n in e)
              Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
          return (t.default = e), t;
        })(c),
        p = { version: "V1.0", lang: "en", encoding: "utf-8" };
      t.types = u;
      t.default = function (e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (!e) throw new TypeError("expects name.");
        var n = i({}, p, t),
          r = [],
          o = function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "<NULL>",
              n = arguments[2];
            return r.push([e, t, n]);
          },
          a = function (e, t, n) {
            return o(e, t, i({}, n, { public: !0 }));
          },
          c = {
            rule: { type: u.RULE },
            word: { type: u.WORD },
            alt: { type: u.ALTERNATIVE },
          },
          d = (0, s.default)(o, c),
          h = (0, s.default)(a, c);
        return i({}, d, {
          public: i({}, h),
          rules: function () {
            return r.concat();
          },
          stringify: function () {
            return (0, l.default)(n, e, r);
          },
        });
      };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      t.default = function (e) {
        return ["#JSGF", e.version, e.encoding, e.lang]
          .filter(Boolean)
          .join(" ");
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function i(e) {
        if (Array.isArray(e)) {
          for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
          return n;
        }
        return Array.from(e);
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var o = n(118),
        s = r(o),
        a = n(120),
        l = r(a),
        c = n(121),
        u = r(c);
      t.default = function (e, t, n) {
        var r = [];
        return (
          r.push((0, s.default)(e)),
          r.push((0, l.default)(t)),
          r.push("\n"),
          r.push.apply(r, i((0, u.default)(n))),
          r.reduce(function (e, t) {
            return /^\s+$/.test(t) ? "" + e + t : e + (e ? "\n" : "") + t + ";";
          }, "")
        );
      };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = function (e) {
          return "grammar " + e;
        });
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = (function () {
          function e(e, t) {
            var n = [],
              r = !0,
              i = !1,
              o = void 0;
            try {
              for (
                var s, a = e[Symbol.iterator]();
                !(r = (s = a.next()).done) &&
                (n.push(s.value), !t || n.length !== t);
                r = !0
              );
            } catch (e) {
              (i = !0), (o = e);
            } finally {
              try {
                !r && a.return && a.return();
              } finally {
                if (i) throw o;
              }
            }
            return n;
          }
          return function (t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance",
            );
          };
        })(),
        i = n(123),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e };
        })(i);
      t.default = function (e) {
        return e.map(function (e) {
          var t = r(e, 3),
            n = t[0],
            i = t[1],
            s = t[2],
            a = o.default[s.type](n, i, s.options);
          return s.public ? "public " + a : a;
        });
      };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(26),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e };
        })(r);
      t.default = function (e, t) {
        var n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          r = n.group,
          o = n.optional,
          s = [];
        if (!Array.isArray(t))
          throw new TypeError("expects Array for group rules.");
        return (
          r && s.push(o ? "[" : "("),
          (t = t.map(function (e) {
            return Array.isArray(e) ? "/" + e[1] + "/ " + e[0] : e;
          })),
          s.push(t.join(" | ")),
          r && s.push(o ? "]" : ")"),
          (0, i.default)(e, s.join(" "))
        );
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function i(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      Object.defineProperty(t, "__esModule", { value: !0 });
      var o,
        s = n(44),
        a = (function (e) {
          if (e && e.__esModule) return e;
          var t = {};
          if (null != e)
            for (var n in e)
              Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
          return (t.default = e), t;
        })(s),
        l = n(26),
        c = r(l),
        u = n(124),
        p = r(u),
        d = n(122),
        h = r(d);
      t.default =
        ((o = {}),
        i(o, a.RULE, c.default),
        i(o, a.WORD, p.default),
        i(o, a.ALTERNATIVE, h.default),
        o);
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(26),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e };
        })(r);
      t.default = function (e, t) {
        return /\s+/.test(t) && (t = '"' + t + '"'), (0, i.default)(e, t);
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return (
          Array.prototype.slice.call(arguments, 1).forEach(function (t) {
            t &&
              Object.keys(t).forEach(function (n) {
                e[n] = t[n];
              });
          }),
          e
        );
      }
      function i(e) {
        return Object.prototype.toString.call(e);
      }
      function o(e) {
        return "[object String]" === i(e);
      }
      function s(e) {
        return "[object Object]" === i(e);
      }
      function a(e) {
        return "[object RegExp]" === i(e);
      }
      function l(e) {
        return "[object Function]" === i(e);
      }
      function c(e) {
        return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
      }
      function u(e) {
        return Object.keys(e || {}).reduce(function (e, t) {
          return e || v.hasOwnProperty(t);
        }, !1);
      }
      function p(e) {
        (e.__index__ = -1), (e.__text_cache__ = "");
      }
      function d(e) {
        return function (t, n) {
          var r = t.slice(n);
          return e.test(r) ? r.match(e)[0].length : 0;
        };
      }
      function h() {
        return function (e, t) {
          t.normalize(e);
        };
      }
      function f(e) {
        function t(e) {
          return e.replace("%TLDS%", i.src_tlds);
        }
        function r(e, t) {
          throw new Error('(LinkifyIt) Invalid schema "' + e + '": ' + t);
        }
        var i = (e.re = n(126)(e.__opts__)),
          u = e.__tlds__.slice();
        e.onCompile(),
          e.__tlds_replaced__ || u.push(_),
          u.push(i.src_xn),
          (i.src_tlds = u.join("|")),
          (i.email_fuzzy = RegExp(t(i.tpl_email_fuzzy), "i")),
          (i.link_fuzzy = RegExp(t(i.tpl_link_fuzzy), "i")),
          (i.link_no_ip_fuzzy = RegExp(t(i.tpl_link_no_ip_fuzzy), "i")),
          (i.host_fuzzy_test = RegExp(t(i.tpl_host_fuzzy_test), "i"));
        var f = [];
        (e.__compiled__ = {}),
          Object.keys(e.__schemas__).forEach(function (t) {
            var n = e.__schemas__[t];
            if (null !== n) {
              var i = { validate: null, link: null };
              return (
                (e.__compiled__[t] = i),
                s(n)
                  ? (a(n.validate)
                      ? (i.validate = d(n.validate))
                      : l(n.validate)
                      ? (i.validate = n.validate)
                      : r(t, n),
                    void (l(n.normalize)
                      ? (i.normalize = n.normalize)
                      : n.normalize
                      ? r(t, n)
                      : (i.normalize = h())))
                  : o(n)
                  ? void f.push(t)
                  : void r(t, n)
              );
            }
          }),
          f.forEach(function (t) {
            e.__compiled__[e.__schemas__[t]] &&
              ((e.__compiled__[t].validate =
                e.__compiled__[e.__schemas__[t]].validate),
              (e.__compiled__[t].normalize =
                e.__compiled__[e.__schemas__[t]].normalize));
          }),
          (e.__compiled__[""] = { validate: null, normalize: h() });
        var m = Object.keys(e.__compiled__)
          .filter(function (t) {
            return t.length > 0 && e.__compiled__[t];
          })
          .map(c)
          .join("|");
        (e.re.schema_test = RegExp(
          "(^|(?!_)(?:[><｜]|" + i.src_ZPCc + "))(" + m + ")",
          "i",
        )),
          (e.re.schema_search = RegExp(
            "(^|(?!_)(?:[><｜]|" + i.src_ZPCc + "))(" + m + ")",
            "ig",
          )),
          (e.re.pretest = RegExp(
            "(" +
              e.re.schema_test.source +
              ")|(" +
              e.re.host_fuzzy_test.source +
              ")|@",
            "i",
          )),
          p(e);
      }
      function m(e, t) {
        var n = e.__index__,
          r = e.__last_index__,
          i = e.__text_cache__.slice(n, r);
        (this.schema = e.__schema__.toLowerCase()),
          (this.index = n + t),
          (this.lastIndex = r + t),
          (this.raw = i),
          (this.text = i),
          (this.url = i);
      }
      function g(e, t) {
        var n = new m(e, t);
        return e.__compiled__[n.schema].normalize(n, e), n;
      }
      function y(e, t) {
        if (!(this instanceof y)) return new y(e, t);
        t || (u(e) && ((t = e), (e = {}))),
          (this.__opts__ = r({}, v, t)),
          (this.__index__ = -1),
          (this.__last_index__ = -1),
          (this.__schema__ = ""),
          (this.__text_cache__ = ""),
          (this.__schemas__ = r({}, b, e)),
          (this.__compiled__ = {}),
          (this.__tlds__ = w),
          (this.__tlds_replaced__ = !1),
          (this.re = {}),
          f(this);
      }
      var v = { fuzzyLink: !0, fuzzyEmail: !0, fuzzyIP: !1 },
        b = {
          "http:": {
            validate: function (e, t, n) {
              var r = e.slice(t);
              return (
                n.re.http ||
                  (n.re.http = new RegExp(
                    "^\\/\\/" +
                      n.re.src_auth +
                      n.re.src_host_port_strict +
                      n.re.src_path,
                    "i",
                  )),
                n.re.http.test(r) ? r.match(n.re.http)[0].length : 0
              );
            },
          },
          "https:": "http:",
          "ftp:": "http:",
          "//": {
            validate: function (e, t, n) {
              var r = e.slice(t);
              return (
                n.re.no_http ||
                  (n.re.no_http = new RegExp(
                    "^" +
                      n.re.src_auth +
                      "(?:localhost|(?:(?:" +
                      n.re.src_domain +
                      ")\\.)+" +
                      n.re.src_domain_root +
                      ")" +
                      n.re.src_port +
                      n.re.src_host_terminator +
                      n.re.src_path,
                    "i",
                  )),
                n.re.no_http.test(r)
                  ? t >= 3 && ":" === e[t - 3]
                    ? 0
                    : t >= 3 && "/" === e[t - 3]
                    ? 0
                    : r.match(n.re.no_http)[0].length
                  : 0
              );
            },
          },
          "mailto:": {
            validate: function (e, t, n) {
              var r = e.slice(t);
              return (
                n.re.mailto ||
                  (n.re.mailto = new RegExp(
                    "^" + n.re.src_email_name + "@" + n.re.src_host_strict,
                    "i",
                  )),
                n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0
              );
            },
          },
        },
        _ =
          "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]",
        w =
          "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split(
            "|",
          );
      (y.prototype.add = function (e, t) {
        return (this.__schemas__[e] = t), f(this), this;
      }),
        (y.prototype.set = function (e) {
          return (this.__opts__ = r(this.__opts__, e)), this;
        }),
        (y.prototype.test = function (e) {
          if (((this.__text_cache__ = e), (this.__index__ = -1), !e.length))
            return !1;
          var t, n, r, i, o, s, a, l;
          if (this.re.schema_test.test(e))
            for (
              a = this.re.schema_search, a.lastIndex = 0;
              null !== (t = a.exec(e));

            )
              if ((i = this.testSchemaAt(e, t[2], a.lastIndex))) {
                (this.__schema__ = t[2]),
                  (this.__index__ = t.index + t[1].length),
                  (this.__last_index__ = t.index + t[0].length + i);
                break;
              }
          return (
            this.__opts__.fuzzyLink &&
              this.__compiled__["http:"] &&
              (l = e.search(this.re.host_fuzzy_test)) >= 0 &&
              (this.__index__ < 0 || l < this.__index__) &&
              null !==
                (n = e.match(
                  this.__opts__.fuzzyIP
                    ? this.re.link_fuzzy
                    : this.re.link_no_ip_fuzzy,
                )) &&
              ((o = n.index + n[1].length),
              (this.__index__ < 0 || o < this.__index__) &&
                ((this.__schema__ = ""),
                (this.__index__ = o),
                (this.__last_index__ = n.index + n[0].length))),
            this.__opts__.fuzzyEmail &&
              this.__compiled__["mailto:"] &&
              e.indexOf("@") >= 0 &&
              null !== (r = e.match(this.re.email_fuzzy)) &&
              ((o = r.index + r[1].length),
              (s = r.index + r[0].length),
              (this.__index__ < 0 ||
                o < this.__index__ ||
                (o === this.__index__ && s > this.__last_index__)) &&
                ((this.__schema__ = "mailto:"),
                (this.__index__ = o),
                (this.__last_index__ = s))),
            this.__index__ >= 0
          );
        }),
        (y.prototype.pretest = function (e) {
          return this.re.pretest.test(e);
        }),
        (y.prototype.testSchemaAt = function (e, t, n) {
          return this.__compiled__[t.toLowerCase()]
            ? this.__compiled__[t.toLowerCase()].validate(e, n, this)
            : 0;
        }),
        (y.prototype.match = function (e) {
          var t = 0,
            n = [];
          this.__index__ >= 0 &&
            this.__text_cache__ === e &&
            (n.push(g(this, t)), (t = this.__last_index__));
          for (var r = t ? e.slice(t) : e; this.test(r); )
            n.push(g(this, t)),
              (r = r.slice(this.__last_index__)),
              (t += this.__last_index__);
          return n.length ? n : null;
        }),
        (y.prototype.tlds = function (e, t) {
          return (
            (e = Array.isArray(e) ? e : [e]),
            t
              ? ((this.__tlds__ = this.__tlds__
                  .concat(e)
                  .sort()
                  .filter(function (e, t, n) {
                    return e !== n[t - 1];
                  })
                  .reverse()),
                f(this),
                this)
              : ((this.__tlds__ = e.slice()),
                (this.__tlds_replaced__ = !0),
                f(this),
                this)
          );
        }),
        (y.prototype.normalize = function (e) {
          e.schema || (e.url = "http://" + e.url),
            "mailto:" !== e.schema ||
              /^mailto:/i.test(e.url) ||
              (e.url = "mailto:" + e.url);
        }),
        (y.prototype.onCompile = function () {}),
        (e.exports = y);
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e) {
        var t = {};
        (t.src_Any = n(86).source),
          (t.src_Cc = n(84).source),
          (t.src_Z = n(85).source),
          (t.src_P = n(39).source),
          (t.src_ZPCc = [t.src_Z, t.src_P, t.src_Cc].join("|")),
          (t.src_ZCc = [t.src_Z, t.src_Cc].join("|"));
        return (
          (t.src_pseudo_letter =
            "(?:(?![><｜]|" + t.src_ZPCc + ")" + t.src_Any + ")"),
          (t.src_ip4 =
            "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"),
          (t.src_auth = "(?:(?:(?!" + t.src_ZCc + "|[@/\\[\\]()]).)+@)?"),
          (t.src_port =
            "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?"),
          (t.src_host_terminator =
            "(?=$|[><｜]|" +
            t.src_ZPCc +
            ")(?!-|_|:\\d|\\.-|\\.(?!$|" +
            t.src_ZPCc +
            "))"),
          (t.src_path =
            "(?:[/?#](?:(?!" +
            t.src_ZCc +
            "|[><｜]|[()[\\]{}.,\"'?!\\-]).|\\[(?:(?!" +
            t.src_ZCc +
            "|\\]).)*\\]|\\((?:(?!" +
            t.src_ZCc +
            "|[)]).)*\\)|\\{(?:(?!" +
            t.src_ZCc +
            '|[}]).)*\\}|\\"(?:(?!' +
            t.src_ZCc +
            '|["]).)+\\"|\\\'(?:(?!' +
            t.src_ZCc +
            "|[']).)+\\'|\\'(?=" +
            t.src_pseudo_letter +
            "|[-]).|\\.{2,3}[a-zA-Z0-9%/]|\\.(?!" +
            t.src_ZCc +
            "|[.]).|" +
            (e && e["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") +
            "\\,(?!" +
            t.src_ZCc +
            ").|\\!(?!" +
            t.src_ZCc +
            "|[!]).|\\?(?!" +
            t.src_ZCc +
            "|[?]).)+|\\/)?"),
          (t.src_email_name = '[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+'),
          (t.src_xn = "xn--[a-z0-9\\-]{1,59}"),
          (t.src_domain_root =
            "(?:" + t.src_xn + "|" + t.src_pseudo_letter + "{1,63})"),
          (t.src_domain =
            "(?:" +
            t.src_xn +
            "|(?:" +
            t.src_pseudo_letter +
            ")|(?:" +
            t.src_pseudo_letter +
            "(?:-(?!-)|" +
            t.src_pseudo_letter +
            "){0,61}" +
            t.src_pseudo_letter +
            "))"),
          (t.src_host =
            "(?:(?:(?:(?:" + t.src_domain + ")\\.)*" + t.src_domain + "))"),
          (t.tpl_host_fuzzy =
            "(?:" +
            t.src_ip4 +
            "|(?:(?:(?:" +
            t.src_domain +
            ")\\.)+(?:%TLDS%)))"),
          (t.tpl_host_no_ip_fuzzy =
            "(?:(?:(?:" + t.src_domain + ")\\.)+(?:%TLDS%))"),
          (t.src_host_strict = t.src_host + t.src_host_terminator),
          (t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator),
          (t.src_host_port_strict =
            t.src_host + t.src_port + t.src_host_terminator),
          (t.tpl_host_port_fuzzy_strict =
            t.tpl_host_fuzzy + t.src_port + t.src_host_terminator),
          (t.tpl_host_port_no_ip_fuzzy_strict =
            t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator),
          (t.tpl_host_fuzzy_test =
            "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" +
            t.src_ZPCc +
            "|>|$))"),
          (t.tpl_email_fuzzy =
            "(^|[><｜]|\\(|" +
            t.src_ZCc +
            ")(" +
            t.src_email_name +
            "@" +
            t.tpl_host_fuzzy_strict +
            ")"),
          (t.tpl_link_fuzzy =
            "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" +
            t.src_ZPCc +
            "))((?![$+<=>^`|｜])" +
            t.tpl_host_port_fuzzy_strict +
            t.src_path +
            ")"),
          (t.tpl_link_no_ip_fuzzy =
            "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" +
            t.src_ZPCc +
            "))((?![$+<=>^`|｜])" +
            t.tpl_host_port_no_ip_fuzzy_strict +
            t.src_path +
            ")"),
          t
        );
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return null == e
          ? void 0 === e
            ? l
            : a
          : c && c in Object(e)
          ? n.i(o.a)(e)
          : n.i(s.a)(e);
      }
      var i = n(45),
        o = n(130),
        s = n(131),
        a = "[object Null]",
        l = "[object Undefined]",
        c = i.a ? i.a.toStringTag : void 0;
      t.a = r;
    },
    function (e, t, n) {
      "use strict";
      (function (e) {
        var n = "object" == typeof e && e && e.Object === Object && e;
        t.a = n;
      }).call(t, n(15));
    },
    function (e, t, n) {
      "use strict";
      var r = n(132),
        i = n.i(r.a)(Object.getPrototypeOf, Object);
      t.a = i;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = s.call(e, l),
          n = e[l];
        try {
          e[l] = void 0;
          var r = !0;
        } catch (e) {}
        var i = a.call(e);
        return r && (t ? (e[l] = n) : delete e[l]), i;
      }
      var i = n(45),
        o = Object.prototype,
        s = o.hasOwnProperty,
        a = o.toString,
        l = i.a ? i.a.toStringTag : void 0;
      t.a = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return o.call(e);
      }
      var i = Object.prototype,
        o = i.toString;
      t.a = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return function (n) {
          return e(t(n));
        };
      }
      t.a = r;
    },
    function (e, t, n) {
      "use strict";
      var r = n(128),
        i = "object" == typeof self && self && self.Object === Object && self,
        o = r.a || i || Function("return this")();
      t.a = o;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return null != e && "object" == typeof e;
      }
      t.a = r;
    },
    function (e, t, n) {
      "use strict";
      e.exports = [
        "address",
        "article",
        "aside",
        "base",
        "basefont",
        "blockquote",
        "body",
        "caption",
        "center",
        "col",
        "colgroup",
        "dd",
        "details",
        "dialog",
        "dir",
        "div",
        "dl",
        "dt",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "frame",
        "frameset",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hr",
        "html",
        "iframe",
        "legend",
        "li",
        "link",
        "main",
        "menu",
        "menuitem",
        "meta",
        "nav",
        "noframes",
        "ol",
        "optgroup",
        "option",
        "p",
        "param",
        "pre",
        "section",
        "source",
        "title",
        "summary",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "title",
        "tr",
        "track",
        "ul",
      ];
    },
    function (e, t, n) {
      "use strict";
      (t.parseLinkLabel = n(138)),
        (t.parseLinkDestination = n(137)),
        (t.parseLinkTitle = n(139));
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).isSpace,
        i = n(1).unescapeAll;
      e.exports = function (e, t, n) {
        var o,
          s,
          a = t,
          l = { ok: !1, pos: 0, lines: 0, str: "" };
        if (60 === e.charCodeAt(t)) {
          for (t++; t < n; ) {
            if (10 === (o = e.charCodeAt(t)) || r(o)) return l;
            if (62 === o)
              return (
                (l.pos = t + 1), (l.str = i(e.slice(a + 1, t))), (l.ok = !0), l
              );
            92 === o && t + 1 < n ? (t += 2) : t++;
          }
          return l;
        }
        for (
          s = 0;
          t < n && 32 !== (o = e.charCodeAt(t)) && !(o < 32 || 127 === o);

        )
          if (92 === o && t + 1 < n) t += 2;
          else {
            if (40 === o && ++s > 1) break;
            if (41 === o && --s < 0) break;
            t++;
          }
        return a === t
          ? l
          : ((l.str = i(e.slice(a, t))),
            (l.lines = 0),
            (l.pos = t),
            (l.ok = !0),
            l);
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e, t, n) {
        var r,
          i,
          o,
          s,
          a = -1,
          l = e.posMax,
          c = e.pos;
        for (e.pos = t + 1, r = 1; e.pos < l; ) {
          if (93 === (o = e.src.charCodeAt(e.pos)) && 0 === --r) {
            i = !0;
            break;
          }
          if (((s = e.pos), e.md.inline.skipToken(e), 91 === o))
            if (s === e.pos - 1) r++;
            else if (n) return (e.pos = c), -1;
        }
        return i && (a = e.pos), (e.pos = c), a;
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).unescapeAll;
      e.exports = function (e, t, n) {
        var i,
          o,
          s = 0,
          a = t,
          l = { ok: !1, pos: 0, lines: 0, str: "" };
        if (t >= n) return l;
        if (34 !== (o = e.charCodeAt(t)) && 39 !== o && 40 !== o) return l;
        for (t++, 40 === o && (o = 41); t < n; ) {
          if ((i = e.charCodeAt(t)) === o)
            return (
              (l.pos = t + 1),
              (l.lines = s),
              (l.str = r(e.slice(a + 1, t))),
              (l.ok = !0),
              l
            );
          10 === i
            ? s++
            : 92 === i && t + 1 < n && (t++, 10 === e.charCodeAt(t) && s++),
            t++;
        }
        return l;
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = e.trim().toLowerCase();
        return !y.test(t) || !!v.test(t);
      }
      function i(e) {
        var t = f.parse(e, !0);
        if (t.hostname && (!t.protocol || b.indexOf(t.protocol) >= 0))
          try {
            t.hostname = m.toASCII(t.hostname);
          } catch (e) {}
        return f.encode(f.format(t));
      }
      function o(e) {
        var t = f.parse(e, !0);
        if (t.hostname && (!t.protocol || b.indexOf(t.protocol) >= 0))
          try {
            t.hostname = m.toUnicode(t.hostname);
          } catch (e) {}
        return f.decode(f.format(t));
      }
      function s(e, t) {
        if (!(this instanceof s)) return new s(e, t);
        t || a.isString(e) || ((t = e || {}), (e = "default")),
          (this.inline = new d()),
          (this.block = new p()),
          (this.core = new u()),
          (this.renderer = new c()),
          (this.linkify = new h()),
          (this.validateLink = r),
          (this.normalizeLink = i),
          (this.normalizeLinkText = o),
          (this.utils = a),
          (this.helpers = a.assign({}, l)),
          (this.options = {}),
          this.configure(e),
          t && this.set(t);
      }
      var a = n(1),
        l = n(136),
        c = n(147),
        u = n(142),
        p = n(141),
        d = n(143),
        h = n(125),
        f = n(51),
        m = n(185),
        g = { default: n(145), zero: n(146), commonmark: n(144) },
        y = /^(vbscript|javascript|file|data):/,
        v = /^data:image\/(gif|png|jpeg|webp);/,
        b = ["http:", "https:", "mailto:"];
      (s.prototype.set = function (e) {
        return a.assign(this.options, e), this;
      }),
        (s.prototype.configure = function (e) {
          var t,
            n = this;
          if (a.isString(e) && ((t = e), !(e = g[t])))
            throw new Error(
              'Wrong `markdown-it` preset "' + t + '", check name',
            );
          if (!e) throw new Error("Wrong `markdown-it` preset, can't be empty");
          return (
            e.options && n.set(e.options),
            e.components &&
              Object.keys(e.components).forEach(function (t) {
                e.components[t].rules &&
                  n[t].ruler.enableOnly(e.components[t].rules),
                  e.components[t].rules2 &&
                    n[t].ruler2.enableOnly(e.components[t].rules2);
              }),
            this
          );
        }),
        (s.prototype.enable = function (e, t) {
          var n = [];
          Array.isArray(e) || (e = [e]),
            ["core", "block", "inline"].forEach(function (t) {
              n = n.concat(this[t].ruler.enable(e, !0));
            }, this),
            (n = n.concat(this.inline.ruler2.enable(e, !0)));
          var r = e.filter(function (e) {
            return n.indexOf(e) < 0;
          });
          if (r.length && !t)
            throw new Error(
              "MarkdownIt. Failed to enable unknown rule(s): " + r,
            );
          return this;
        }),
        (s.prototype.disable = function (e, t) {
          var n = [];
          Array.isArray(e) || (e = [e]),
            ["core", "block", "inline"].forEach(function (t) {
              n = n.concat(this[t].ruler.disable(e, !0));
            }, this),
            (n = n.concat(this.inline.ruler2.disable(e, !0)));
          var r = e.filter(function (e) {
            return n.indexOf(e) < 0;
          });
          if (r.length && !t)
            throw new Error(
              "MarkdownIt. Failed to disable unknown rule(s): " + r,
            );
          return this;
        }),
        (s.prototype.use = function (e) {
          var t = [this].concat(Array.prototype.slice.call(arguments, 1));
          return e.apply(e, t), this;
        }),
        (s.prototype.parse = function (e, t) {
          if ("string" != typeof e)
            throw new Error("Input data should be a String");
          var n = new this.core.State(e, this, t);
          return this.core.process(n), n.tokens;
        }),
        (s.prototype.render = function (e, t) {
          return (
            (t = t || {}),
            this.renderer.render(this.parse(e, t), this.options, t)
          );
        }),
        (s.prototype.parseInline = function (e, t) {
          var n = new this.core.State(e, this, t);
          return (n.inlineMode = !0), this.core.process(n), n.tokens;
        }),
        (s.prototype.renderInline = function (e, t) {
          return (
            (t = t || {}),
            this.renderer.render(this.parseInline(e, t), this.options, t)
          );
        }),
        (e.exports = s);
    },
    function (e, t, n) {
      "use strict";
      function r() {
        this.ruler = new i();
        for (var e = 0; e < o.length; e++)
          this.ruler.push(o[e][0], o[e][1], { alt: (o[e][2] || []).slice() });
      }
      var i = n(28),
        o = [
          ["table", n(159), ["paragraph", "reference"]],
          ["code", n(149)],
          ["fence", n(150), ["paragraph", "reference", "blockquote", "list"]],
          ["blockquote", n(148), ["paragraph", "reference", "list"]],
          ["hr", n(152), ["paragraph", "reference", "blockquote", "list"]],
          ["list", n(155), ["paragraph", "reference", "blockquote"]],
          ["reference", n(157)],
          ["heading", n(151), ["paragraph", "reference", "blockquote"]],
          ["lheading", n(154)],
          ["html_block", n(153), ["paragraph", "reference", "blockquote"]],
          ["paragraph", n(156)],
        ];
      (r.prototype.tokenize = function (e, t, n) {
        for (
          var r,
            i = this.ruler.getRules(""),
            o = i.length,
            s = t,
            a = !1,
            l = e.md.options.maxNesting;
          s < n &&
          ((e.line = s = e.skipEmptyLines(s)), !(s >= n)) &&
          !(e.sCount[s] < e.blkIndent);

        ) {
          if (e.level >= l) {
            e.line = n;
            break;
          }
          for (r = 0; r < o && !i[r](e, s, n, !1); r++);
          (e.tight = !a),
            e.isEmpty(e.line - 1) && (a = !0),
            (s = e.line) < n && e.isEmpty(s) && ((a = !0), s++, (e.line = s));
        }
      }),
        (r.prototype.parse = function (e, t, n, r) {
          var i;
          e &&
            ((i = new this.State(e, t, n, r)),
            this.tokenize(i, i.line, i.lineMax));
        }),
        (r.prototype.State = n(158)),
        (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      function r() {
        this.ruler = new i();
        for (var e = 0; e < o.length; e++) this.ruler.push(o[e][0], o[e][1]);
      }
      var i = n(28),
        o = [
          ["normalize", n(163)],
          ["block", n(160)],
          ["inline", n(161)],
          ["linkify", n(162)],
          ["replacements", n(164)],
          ["smartquotes", n(165)],
        ];
      (r.prototype.process = function (e) {
        var t, n, r;
        for (r = this.ruler.getRules(""), t = 0, n = r.length; t < n; t++)
          r[t](e);
      }),
        (r.prototype.State = n(166)),
        (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      function r() {
        var e;
        for (this.ruler = new i(), e = 0; e < o.length; e++)
          this.ruler.push(o[e][0], o[e][1]);
        for (this.ruler2 = new i(), e = 0; e < s.length; e++)
          this.ruler2.push(s[e][0], s[e][1]);
      }
      var i = n(28),
        o = [
          ["text", n(177)],
          ["newline", n(175)],
          ["escape", n(171)],
          ["backticks", n(168)],
          ["strikethrough", n(50).tokenize],
          ["emphasis", n(49).tokenize],
          ["link", n(174)],
          ["image", n(173)],
          ["autolink", n(167)],
          ["html_inline", n(172)],
          ["entity", n(170)],
        ],
        s = [
          ["balance_pairs", n(169)],
          ["strikethrough", n(50).postProcess],
          ["emphasis", n(49).postProcess],
          ["text_collapse", n(178)],
        ];
      (r.prototype.skipToken = function (e) {
        var t,
          n,
          r = e.pos,
          i = this.ruler.getRules(""),
          o = i.length,
          s = e.md.options.maxNesting,
          a = e.cache;
        if (void 0 !== a[r]) return void (e.pos = a[r]);
        if (e.level < s)
          for (
            n = 0;
            n < o && (e.level++, (t = i[n](e, !0)), e.level--, !t);
            n++
          );
        else e.pos = e.posMax;
        t || e.pos++, (a[r] = e.pos);
      }),
        (r.prototype.tokenize = function (e) {
          for (
            var t,
              n,
              r = this.ruler.getRules(""),
              i = r.length,
              o = e.posMax,
              s = e.md.options.maxNesting;
            e.pos < o;

          ) {
            if (e.level < s) for (n = 0; n < i && !(t = r[n](e, !1)); n++);
            if (t) {
              if (e.pos >= o) break;
            } else e.pending += e.src[e.pos++];
          }
          e.pending && e.pushPending();
        }),
        (r.prototype.parse = function (e, t, n, r) {
          var i,
            o,
            s,
            a = new this.State(e, t, n, r);
          for (
            this.tokenize(a), o = this.ruler2.getRules(""), s = o.length, i = 0;
            i < s;
            i++
          )
            o[i](a);
        }),
        (r.prototype.State = n(176)),
        (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      e.exports = {
        options: {
          html: !0,
          xhtmlOut: !0,
          breaks: !1,
          langPrefix: "language-",
          linkify: !1,
          typographer: !1,
          quotes: "“”‘’",
          highlight: null,
          maxNesting: 20,
        },
        components: {
          core: { rules: ["normalize", "block", "inline"] },
          block: {
            rules: [
              "blockquote",
              "code",
              "fence",
              "heading",
              "hr",
              "html_block",
              "lheading",
              "list",
              "reference",
              "paragraph",
            ],
          },
          inline: {
            rules: [
              "autolink",
              "backticks",
              "emphasis",
              "entity",
              "escape",
              "html_inline",
              "image",
              "link",
              "newline",
              "text",
            ],
            rules2: ["balance_pairs", "emphasis", "text_collapse"],
          },
        },
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = {
        options: {
          html: !1,
          xhtmlOut: !1,
          breaks: !1,
          langPrefix: "language-",
          linkify: !1,
          typographer: !1,
          quotes: "“”‘’",
          highlight: null,
          maxNesting: 100,
        },
        components: { core: {}, block: {}, inline: {} },
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = {
        options: {
          html: !1,
          xhtmlOut: !1,
          breaks: !1,
          langPrefix: "language-",
          linkify: !1,
          typographer: !1,
          quotes: "“”‘’",
          highlight: null,
          maxNesting: 20,
        },
        components: {
          core: { rules: ["normalize", "block", "inline"] },
          block: { rules: ["paragraph"] },
          inline: {
            rules: ["text"],
            rules2: ["balance_pairs", "text_collapse"],
          },
        },
      };
    },
    function (e, t, n) {
      "use strict";
      function r() {
        this.rules = i({}, a);
      }
      var i = n(1).assign,
        o = n(1).unescapeAll,
        s = n(1).escapeHtml,
        a = {};
      (a.code_inline = function (e, t, n, r, i) {
        var o = e[t];
        return "<code" + i.renderAttrs(o) + ">" + s(e[t].content) + "</code>";
      }),
        (a.code_block = function (e, t, n, r, i) {
          var o = e[t];
          return (
            "<pre" +
            i.renderAttrs(o) +
            "><code>" +
            s(e[t].content) +
            "</code></pre>\n"
          );
        }),
        (a.fence = function (e, t, n, r, i) {
          var a,
            l,
            c,
            u,
            p = e[t],
            d = p.info ? o(p.info).trim() : "",
            h = "";
          return (
            d && (h = d.split(/\s+/g)[0]),
            (a = n.highlight
              ? n.highlight(p.content, h) || s(p.content)
              : s(p.content)),
            0 === a.indexOf("<pre")
              ? a + "\n"
              : d
              ? ((l = p.attrIndex("class")),
                (c = p.attrs ? p.attrs.slice() : []),
                l < 0
                  ? c.push(["class", n.langPrefix + h])
                  : (c[l][1] += " " + n.langPrefix + h),
                (u = { attrs: c }),
                "<pre><code" + i.renderAttrs(u) + ">" + a + "</code></pre>\n")
              : "<pre><code" + i.renderAttrs(p) + ">" + a + "</code></pre>\n"
          );
        }),
        (a.image = function (e, t, n, r, i) {
          var o = e[t];
          return (
            (o.attrs[o.attrIndex("alt")][1] = i.renderInlineAsText(
              o.children,
              n,
              r,
            )),
            i.renderToken(e, t, n)
          );
        }),
        (a.hardbreak = function (e, t, n) {
          return n.xhtmlOut ? "<br />\n" : "<br>\n";
        }),
        (a.softbreak = function (e, t, n) {
          return n.breaks ? (n.xhtmlOut ? "<br />\n" : "<br>\n") : "\n";
        }),
        (a.text = function (e, t) {
          return s(e[t].content);
        }),
        (a.html_block = function (e, t) {
          return e[t].content;
        }),
        (a.html_inline = function (e, t) {
          return e[t].content;
        }),
        (r.prototype.renderAttrs = function (e) {
          var t, n, r;
          if (!e.attrs) return "";
          for (r = "", t = 0, n = e.attrs.length; t < n; t++)
            r += " " + s(e.attrs[t][0]) + '="' + s(e.attrs[t][1]) + '"';
          return r;
        }),
        (r.prototype.renderToken = function (e, t, n) {
          var r,
            i = "",
            o = !1,
            s = e[t];
          return s.hidden
            ? ""
            : (s.block &&
                -1 !== s.nesting &&
                t &&
                e[t - 1].hidden &&
                (i += "\n"),
              (i += (-1 === s.nesting ? "</" : "<") + s.tag),
              (i += this.renderAttrs(s)),
              0 === s.nesting && n.xhtmlOut && (i += " /"),
              s.block &&
                ((o = !0),
                1 === s.nesting &&
                  t + 1 < e.length &&
                  ((r = e[t + 1]),
                  "inline" === r.type || r.hidden
                    ? (o = !1)
                    : -1 === r.nesting && r.tag === s.tag && (o = !1))),
              (i += o ? ">\n" : ">"));
        }),
        (r.prototype.renderInline = function (e, t, n) {
          for (var r, i = "", o = this.rules, s = 0, a = e.length; s < a; s++)
            (r = e[s].type),
              void 0 !== o[r]
                ? (i += o[r](e, s, t, n, this))
                : (i += this.renderToken(e, s, t));
          return i;
        }),
        (r.prototype.renderInlineAsText = function (e, t, n) {
          for (var r = "", i = 0, o = e.length; i < o; i++)
            "text" === e[i].type
              ? (r += e[i].content)
              : "image" === e[i].type &&
                (r += this.renderInlineAsText(e[i].children, t, n));
          return r;
        }),
        (r.prototype.render = function (e, t, n) {
          var r,
            i,
            o,
            s = "",
            a = this.rules;
          for (r = 0, i = e.length; r < i; r++)
            (o = e[r].type),
              "inline" === o
                ? (s += this.renderInline(e[r].children, t, n))
                : void 0 !== a[o]
                ? (s += a[e[r].type](e, r, t, n, this))
                : (s += this.renderToken(e, r, t, n));
          return s;
        }),
        (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).isSpace;
      e.exports = function (e, t, n, i) {
        var o,
          s,
          a,
          l,
          c,
          u,
          p,
          d,
          h,
          f,
          m,
          g,
          y,
          v,
          b,
          _,
          w,
          C,
          S,
          k,
          x = e.lineMax,
          E = e.bMarks[t] + e.tShift[t],
          T = e.eMarks[t];
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        if (62 !== e.src.charCodeAt(E++)) return !1;
        if (i) return !0;
        for (
          l = f = e.sCount[t] + E - (e.bMarks[t] + e.tShift[t]),
            32 === e.src.charCodeAt(E)
              ? (E++, l++, f++, (o = !1), (w = !0))
              : 9 === e.src.charCodeAt(E)
              ? ((w = !0),
                (e.bsCount[t] + f) % 4 == 3
                  ? (E++, l++, f++, (o = !1))
                  : (o = !0))
              : (w = !1),
            m = [e.bMarks[t]],
            e.bMarks[t] = E;
          E < T && ((s = e.src.charCodeAt(E)), r(s));

        )
          9 === s ? (f += 4 - ((f + e.bsCount[t] + (o ? 1 : 0)) % 4)) : f++,
            E++;
        for (
          g = [e.bsCount[t]],
            e.bsCount[t] = e.sCount[t] + 1 + (w ? 1 : 0),
            p = E >= T,
            b = [e.sCount[t]],
            e.sCount[t] = f - l,
            _ = [e.tShift[t]],
            e.tShift[t] = E - e.bMarks[t],
            S = e.md.block.ruler.getRules("blockquote"),
            v = e.parentType,
            e.parentType = "blockquote",
            h = t + 1;
          h < n &&
          ((c = e.sCount[h] < e.blkIndent),
          (E = e.bMarks[h] + e.tShift[h]),
          (T = e.eMarks[h]),
          !(E >= T));
          h++
        )
          if (62 !== e.src.charCodeAt(E++) || c) {
            if (p) break;
            for (C = !1, a = 0, u = S.length; a < u; a++)
              if (S[a](e, h, n, !0)) {
                C = !0;
                break;
              }
            if (C) {
              (e.lineMax = h),
                0 !== e.blkIndent &&
                  (m.push(e.bMarks[h]),
                  g.push(e.bsCount[h]),
                  _.push(e.tShift[h]),
                  b.push(e.sCount[h]),
                  (e.sCount[h] -= e.blkIndent));
              break;
            }
            if (c) break;
            m.push(e.bMarks[h]),
              g.push(e.bsCount[h]),
              _.push(e.tShift[h]),
              b.push(e.sCount[h]),
              (e.sCount[h] = -1);
          } else {
            for (
              l = f = e.sCount[h] + E - (e.bMarks[h] + e.tShift[h]),
                32 === e.src.charCodeAt(E)
                  ? (E++, l++, f++, (o = !1), (w = !0))
                  : 9 === e.src.charCodeAt(E)
                  ? ((w = !0),
                    (e.bsCount[h] + f) % 4 == 3
                      ? (E++, l++, f++, (o = !1))
                      : (o = !0))
                  : (w = !1),
                m.push(e.bMarks[h]),
                e.bMarks[h] = E;
              E < T && ((s = e.src.charCodeAt(E)), r(s));

            )
              9 === s ? (f += 4 - ((f + e.bsCount[h] + (o ? 1 : 0)) % 4)) : f++,
                E++;
            (p = E >= T),
              g.push(e.bsCount[h]),
              (e.bsCount[h] = e.sCount[h] + 1 + (w ? 1 : 0)),
              b.push(e.sCount[h]),
              (e.sCount[h] = f - l),
              _.push(e.tShift[h]),
              (e.tShift[h] = E - e.bMarks[h]);
          }
        for (
          y = e.blkIndent,
            e.blkIndent = 0,
            k = e.push("blockquote_open", "blockquote", 1),
            k.markup = ">",
            k.map = d = [t, 0],
            e.md.block.tokenize(e, t, h),
            k = e.push("blockquote_close", "blockquote", -1),
            k.markup = ">",
            e.lineMax = x,
            e.parentType = v,
            d[1] = e.line,
            a = 0;
          a < _.length;
          a++
        )
          (e.bMarks[a + t] = m[a]),
            (e.tShift[a + t] = _[a]),
            (e.sCount[a + t] = b[a]),
            (e.bsCount[a + t] = g[a]);
        return (e.blkIndent = y), !0;
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e, t, n) {
        var r, i, o;
        if (e.sCount[t] - e.blkIndent < 4) return !1;
        for (i = r = t + 1; r < n; )
          if (e.isEmpty(r)) r++;
          else {
            if (!(e.sCount[r] - e.blkIndent >= 4)) break;
            r++, (i = r);
          }
        return (
          (e.line = i),
          (o = e.push("code_block", "code", 0)),
          (o.content = e.getLines(t, i, 4 + e.blkIndent, !0)),
          (o.map = [t, e.line]),
          !0
        );
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e, t, n, r) {
        var i,
          o,
          s,
          a,
          l,
          c,
          u,
          p = !1,
          d = e.bMarks[t] + e.tShift[t],
          h = e.eMarks[t];
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        if (d + 3 > h) return !1;
        if (126 !== (i = e.src.charCodeAt(d)) && 96 !== i) return !1;
        if (((l = d), (d = e.skipChars(d, i)), (o = d - l) < 3)) return !1;
        if (
          ((u = e.src.slice(l, d)),
          (s = e.src.slice(d, h)),
          s.indexOf(String.fromCharCode(i)) >= 0)
        )
          return !1;
        if (r) return !0;
        for (
          a = t;
          !(++a >= n) &&
          ((d = l = e.bMarks[a] + e.tShift[a]),
          (h = e.eMarks[a]),
          !(d < h && e.sCount[a] < e.blkIndent));

        )
          if (
            e.src.charCodeAt(d) === i &&
            !(
              e.sCount[a] - e.blkIndent >= 4 ||
              (d = e.skipChars(d, i)) - l < o ||
              (d = e.skipSpaces(d)) < h
            )
          ) {
            p = !0;
            break;
          }
        return (
          (o = e.sCount[t]),
          (e.line = a + (p ? 1 : 0)),
          (c = e.push("fence", "code", 0)),
          (c.info = s),
          (c.content = e.getLines(t + 1, a, o, !0)),
          (c.markup = u),
          (c.map = [t, e.line]),
          !0
        );
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).isSpace;
      e.exports = function (e, t, n, i) {
        var o,
          s,
          a,
          l,
          c = e.bMarks[t] + e.tShift[t],
          u = e.eMarks[t];
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        if (35 !== (o = e.src.charCodeAt(c)) || c >= u) return !1;
        for (s = 1, o = e.src.charCodeAt(++c); 35 === o && c < u && s <= 6; )
          s++, (o = e.src.charCodeAt(++c));
        return (
          !(s > 6 || (c < u && !r(o))) &&
          (!!i ||
            ((u = e.skipSpacesBack(u, c)),
            (a = e.skipCharsBack(u, 35, c)),
            a > c && r(e.src.charCodeAt(a - 1)) && (u = a),
            (e.line = t + 1),
            (l = e.push("heading_open", "h" + String(s), 1)),
            (l.markup = "########".slice(0, s)),
            (l.map = [t, e.line]),
            (l = e.push("inline", "", 0)),
            (l.content = e.src.slice(c, u).trim()),
            (l.map = [t, e.line]),
            (l.children = []),
            (l = e.push("heading_close", "h" + String(s), -1)),
            (l.markup = "########".slice(0, s)),
            !0))
        );
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).isSpace;
      e.exports = function (e, t, n, i) {
        var o,
          s,
          a,
          l,
          c = e.bMarks[t] + e.tShift[t],
          u = e.eMarks[t];
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        if (42 !== (o = e.src.charCodeAt(c++)) && 45 !== o && 95 !== o)
          return !1;
        for (s = 1; c < u; ) {
          if ((a = e.src.charCodeAt(c++)) !== o && !r(a)) return !1;
          a === o && s++;
        }
        return (
          !(s < 3) &&
          (!!i ||
            ((e.line = t + 1),
            (l = e.push("hr", "hr", 0)),
            (l.map = [t, e.line]),
            (l.markup = Array(s + 1).join(String.fromCharCode(o))),
            !0))
        );
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(135),
        i = n(48).HTML_OPEN_CLOSE_TAG_RE,
        o = [
          [/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, !0],
          [/^<!--/, /-->/, !0],
          [/^<\?/, /\?>/, !0],
          [/^<![A-Z]/, />/, !0],
          [/^<!\[CDATA\[/, /\]\]>/, !0],
          [
            new RegExp("^</?(" + r.join("|") + ")(?=(\\s|/?>|$))", "i"),
            /^$/,
            !0,
          ],
          [new RegExp(i.source + "\\s*$"), /^$/, !1],
        ];
      e.exports = function (e, t, n, r) {
        var i,
          s,
          a,
          l,
          c = e.bMarks[t] + e.tShift[t],
          u = e.eMarks[t];
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        if (!e.md.options.html) return !1;
        if (60 !== e.src.charCodeAt(c)) return !1;
        for (
          l = e.src.slice(c, u), i = 0;
          i < o.length && !o[i][0].test(l);
          i++
        );
        if (i === o.length) return !1;
        if (r) return o[i][2];
        if (((s = t + 1), !o[i][1].test(l)))
          for (; s < n && !(e.sCount[s] < e.blkIndent); s++)
            if (
              ((c = e.bMarks[s] + e.tShift[s]),
              (u = e.eMarks[s]),
              (l = e.src.slice(c, u)),
              o[i][1].test(l))
            ) {
              0 !== l.length && s++;
              break;
            }
        return (
          (e.line = s),
          (a = e.push("html_block", "", 0)),
          (a.map = [t, s]),
          (a.content = e.getLines(t, s, e.blkIndent, !0)),
          !0
        );
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e, t, n) {
        var r,
          i,
          o,
          s,
          a,
          l,
          c,
          u,
          p,
          d,
          h = t + 1,
          f = e.md.block.ruler.getRules("paragraph");
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        for (
          d = e.parentType, e.parentType = "paragraph";
          h < n && !e.isEmpty(h);
          h++
        )
          if (!(e.sCount[h] - e.blkIndent > 3)) {
            if (
              e.sCount[h] >= e.blkIndent &&
              ((l = e.bMarks[h] + e.tShift[h]),
              (c = e.eMarks[h]),
              l < c &&
                (45 === (p = e.src.charCodeAt(l)) || 61 === p) &&
                ((l = e.skipChars(l, p)), (l = e.skipSpaces(l)) >= c))
            ) {
              u = 61 === p ? 1 : 2;
              break;
            }
            if (!(e.sCount[h] < 0)) {
              for (i = !1, o = 0, s = f.length; o < s; o++)
                if (f[o](e, h, n, !0)) {
                  i = !0;
                  break;
                }
              if (i) break;
            }
          }
        return (
          !!u &&
          ((r = e.getLines(t, h, e.blkIndent, !1).trim()),
          (e.line = h + 1),
          (a = e.push("heading_open", "h" + String(u), 1)),
          (a.markup = String.fromCharCode(p)),
          (a.map = [t, e.line]),
          (a = e.push("inline", "", 0)),
          (a.content = r),
          (a.map = [t, e.line - 1]),
          (a.children = []),
          (a = e.push("heading_close", "h" + String(u), -1)),
          (a.markup = String.fromCharCode(p)),
          (e.parentType = d),
          !0)
        );
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        var n, r, i, o;
        return (
          (r = e.bMarks[t] + e.tShift[t]),
          (i = e.eMarks[t]),
          (n = e.src.charCodeAt(r++)),
          42 !== n && 45 !== n && 43 !== n
            ? -1
            : r < i && ((o = e.src.charCodeAt(r)), !s(o))
            ? -1
            : r
        );
      }
      function i(e, t) {
        var n,
          r = e.bMarks[t] + e.tShift[t],
          i = r,
          o = e.eMarks[t];
        if (i + 1 >= o) return -1;
        if ((n = e.src.charCodeAt(i++)) < 48 || n > 57) return -1;
        for (;;) {
          if (i >= o) return -1;
          n = e.src.charCodeAt(i++);
          {
            if (!(n >= 48 && n <= 57)) {
              if (41 === n || 46 === n) break;
              return -1;
            }
            if (i - r >= 10) return -1;
          }
        }
        return i < o && ((n = e.src.charCodeAt(i)), !s(n)) ? -1 : i;
      }
      function o(e, t) {
        var n,
          r,
          i = e.level + 2;
        for (n = t + 2, r = e.tokens.length - 2; n < r; n++)
          e.tokens[n].level === i &&
            "paragraph_open" === e.tokens[n].type &&
            ((e.tokens[n + 2].hidden = !0),
            (e.tokens[n].hidden = !0),
            (n += 2));
      }
      var s = n(1).isSpace;
      e.exports = function (e, t, n, a) {
        var l,
          c,
          u,
          p,
          d,
          h,
          f,
          m,
          g,
          y,
          v,
          b,
          _,
          w,
          C,
          S,
          k,
          x,
          E,
          T,
          A,
          O,
          P,
          I,
          D,
          L,
          N,
          M,
          j = !1,
          z = !0;
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        if (
          (a &&
            "paragraph" === e.parentType &&
            e.tShift[t] >= e.blkIndent &&
            (j = !0),
          (P = i(e, t)) >= 0)
        ) {
          if (
            ((f = !0),
            (D = e.bMarks[t] + e.tShift[t]),
            (_ = Number(e.src.substr(D, P - D - 1))),
            j && 1 !== _)
          )
            return !1;
        } else {
          if (!((P = r(e, t)) >= 0)) return !1;
          f = !1;
        }
        if (j && e.skipSpaces(P) >= e.eMarks[t]) return !1;
        if (((b = e.src.charCodeAt(P - 1)), a)) return !0;
        for (
          v = e.tokens.length,
            f
              ? ((M = e.push("ordered_list_open", "ol", 1)),
                1 !== _ && (M.attrs = [["start", _]]))
              : (M = e.push("bullet_list_open", "ul", 1)),
            M.map = y = [t, 0],
            M.markup = String.fromCharCode(b),
            C = t,
            I = !1,
            N = e.md.block.ruler.getRules("list"),
            E = e.parentType,
            e.parentType = "list";
          C < n;

        ) {
          for (
            O = P,
              w = e.eMarks[C],
              h = S = e.sCount[C] + P - (e.bMarks[t] + e.tShift[t]);
            O < w && ((l = e.src.charCodeAt(O)), s(l));

          )
            9 === l ? (S += 4 - ((S + e.bsCount[C]) % 4)) : S++, O++;
          if (
            ((c = O),
            (d = c >= w ? 1 : S - h),
            d > 4 && (d = 1),
            (p = h + d),
            (M = e.push("list_item_open", "li", 1)),
            (M.markup = String.fromCharCode(b)),
            (M.map = m = [t, 0]),
            (k = e.blkIndent),
            (A = e.tight),
            (T = e.tShift[t]),
            (x = e.sCount[t]),
            (e.blkIndent = p),
            (e.tight = !0),
            (e.tShift[t] = c - e.bMarks[t]),
            (e.sCount[t] = S),
            c >= w && e.isEmpty(t + 1)
              ? (e.line = Math.min(e.line + 2, n))
              : e.md.block.tokenize(e, t, n, !0),
            (e.tight && !I) || (z = !1),
            (I = e.line - t > 1 && e.isEmpty(e.line - 1)),
            (e.blkIndent = k),
            (e.tShift[t] = T),
            (e.sCount[t] = x),
            (e.tight = A),
            (M = e.push("list_item_close", "li", -1)),
            (M.markup = String.fromCharCode(b)),
            (C = t = e.line),
            (m[1] = C),
            (c = e.bMarks[t]),
            C >= n)
          )
            break;
          if (e.sCount[C] < e.blkIndent) break;
          for (L = !1, u = 0, g = N.length; u < g; u++)
            if (N[u](e, C, n, !0)) {
              L = !0;
              break;
            }
          if (L) break;
          if (f) {
            if ((P = i(e, C)) < 0) break;
          } else if ((P = r(e, C)) < 0) break;
          if (b !== e.src.charCodeAt(P - 1)) break;
        }
        return (
          (M = f
            ? e.push("ordered_list_close", "ol", -1)
            : e.push("bullet_list_close", "ul", -1)),
          (M.markup = String.fromCharCode(b)),
          (y[1] = C),
          (e.line = C),
          (e.parentType = E),
          z && o(e, v),
          !0
        );
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e, t) {
        var n,
          r,
          i,
          o,
          s,
          a,
          l = t + 1,
          c = e.md.block.ruler.getRules("paragraph"),
          u = e.lineMax;
        for (
          a = e.parentType, e.parentType = "paragraph";
          l < u && !e.isEmpty(l);
          l++
        )
          if (!(e.sCount[l] - e.blkIndent > 3 || e.sCount[l] < 0)) {
            for (r = !1, i = 0, o = c.length; i < o; i++)
              if (c[i](e, l, u, !0)) {
                r = !0;
                break;
              }
            if (r) break;
          }
        return (
          (n = e.getLines(t, l, e.blkIndent, !1).trim()),
          (e.line = l),
          (s = e.push("paragraph_open", "p", 1)),
          (s.map = [t, e.line]),
          (s = e.push("inline", "", 0)),
          (s.content = n),
          (s.map = [t, e.line]),
          (s.children = []),
          (s = e.push("paragraph_close", "p", -1)),
          (e.parentType = a),
          !0
        );
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).normalizeReference,
        i = n(1).isSpace;
      e.exports = function (e, t, n, o) {
        var s,
          a,
          l,
          c,
          u,
          p,
          d,
          h,
          f,
          m,
          g,
          y,
          v,
          b,
          _,
          w,
          C = 0,
          S = e.bMarks[t] + e.tShift[t],
          k = e.eMarks[t],
          x = t + 1;
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        if (91 !== e.src.charCodeAt(S)) return !1;
        for (; ++S < k; )
          if (93 === e.src.charCodeAt(S) && 92 !== e.src.charCodeAt(S - 1)) {
            if (S + 1 === k) return !1;
            if (58 !== e.src.charCodeAt(S + 1)) return !1;
            break;
          }
        for (
          c = e.lineMax,
            _ = e.md.block.ruler.getRules("reference"),
            m = e.parentType,
            e.parentType = "reference";
          x < c && !e.isEmpty(x);
          x++
        )
          if (!(e.sCount[x] - e.blkIndent > 3 || e.sCount[x] < 0)) {
            for (b = !1, p = 0, d = _.length; p < d; p++)
              if (_[p](e, x, c, !0)) {
                b = !0;
                break;
              }
            if (b) break;
          }
        for (
          v = e.getLines(t, x, e.blkIndent, !1).trim(), k = v.length, S = 1;
          S < k;
          S++
        ) {
          if (91 === (s = v.charCodeAt(S))) return !1;
          if (93 === s) {
            f = S;
            break;
          }
          10 === s ? C++ : 92 === s && ++S < k && 10 === v.charCodeAt(S) && C++;
        }
        if (f < 0 || 58 !== v.charCodeAt(f + 1)) return !1;
        for (S = f + 2; S < k; S++)
          if (10 === (s = v.charCodeAt(S))) C++;
          else if (!i(s)) break;
        if (((g = e.md.helpers.parseLinkDestination(v, S, k)), !g.ok))
          return !1;
        if (((u = e.md.normalizeLink(g.str)), !e.md.validateLink(u))) return !1;
        for (S = g.pos, C += g.lines, a = S, l = C, y = S; S < k; S++)
          if (10 === (s = v.charCodeAt(S))) C++;
          else if (!i(s)) break;
        for (
          g = e.md.helpers.parseLinkTitle(v, S, k),
            S < k && y !== S && g.ok
              ? ((w = g.str), (S = g.pos), (C += g.lines))
              : ((w = ""), (S = a), (C = l));
          S < k && ((s = v.charCodeAt(S)), i(s));

        )
          S++;
        if (S < k && 10 !== v.charCodeAt(S) && w)
          for (w = "", S = a, C = l; S < k && ((s = v.charCodeAt(S)), i(s)); )
            S++;
        return (
          !(S < k && 10 !== v.charCodeAt(S)) &&
          !!(h = r(v.slice(1, f))) &&
          (!!o ||
            (void 0 === e.env.references && (e.env.references = {}),
            void 0 === e.env.references[h] &&
              (e.env.references[h] = { title: w, href: u }),
            (e.parentType = m),
            (e.line = t + C + 1),
            !0))
        );
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n, r) {
        var i, s, a, l, c, u, p, d;
        for (
          this.src = e,
            this.md = t,
            this.env = n,
            this.tokens = r,
            this.bMarks = [],
            this.eMarks = [],
            this.tShift = [],
            this.sCount = [],
            this.bsCount = [],
            this.blkIndent = 0,
            this.line = 0,
            this.lineMax = 0,
            this.tight = !1,
            this.ddIndent = -1,
            this.parentType = "root",
            this.level = 0,
            this.result = "",
            s = this.src,
            d = !1,
            a = l = u = p = 0,
            c = s.length;
          l < c;
          l++
        ) {
          if (((i = s.charCodeAt(l)), !d)) {
            if (o(i)) {
              u++, 9 === i ? (p += 4 - (p % 4)) : p++;
              continue;
            }
            d = !0;
          }
          (10 !== i && l !== c - 1) ||
            (10 !== i && l++,
            this.bMarks.push(a),
            this.eMarks.push(l),
            this.tShift.push(u),
            this.sCount.push(p),
            this.bsCount.push(0),
            (d = !1),
            (u = 0),
            (p = 0),
            (a = l + 1));
        }
        this.bMarks.push(s.length),
          this.eMarks.push(s.length),
          this.tShift.push(0),
          this.sCount.push(0),
          this.bsCount.push(0),
          (this.lineMax = this.bMarks.length - 1);
      }
      var i = n(29),
        o = n(1).isSpace;
      (r.prototype.push = function (e, t, n) {
        var r = new i(e, t, n);
        return (
          (r.block = !0),
          n < 0 && this.level--,
          (r.level = this.level),
          n > 0 && this.level++,
          this.tokens.push(r),
          r
        );
      }),
        (r.prototype.isEmpty = function (e) {
          return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
        }),
        (r.prototype.skipEmptyLines = function (e) {
          for (
            var t = this.lineMax;
            e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]);
            e++
          );
          return e;
        }),
        (r.prototype.skipSpaces = function (e) {
          for (
            var t, n = this.src.length;
            e < n && ((t = this.src.charCodeAt(e)), o(t));
            e++
          );
          return e;
        }),
        (r.prototype.skipSpacesBack = function (e, t) {
          if (e <= t) return e;
          for (; e > t; ) if (!o(this.src.charCodeAt(--e))) return e + 1;
          return e;
        }),
        (r.prototype.skipChars = function (e, t) {
          for (
            var n = this.src.length;
            e < n && this.src.charCodeAt(e) === t;
            e++
          );
          return e;
        }),
        (r.prototype.skipCharsBack = function (e, t, n) {
          if (e <= n) return e;
          for (; e > n; ) if (t !== this.src.charCodeAt(--e)) return e + 1;
          return e;
        }),
        (r.prototype.getLines = function (e, t, n, r) {
          var i,
            s,
            a,
            l,
            c,
            u,
            p,
            d = e;
          if (e >= t) return "";
          for (u = new Array(t - e), i = 0; d < t; d++, i++) {
            for (
              s = 0,
                p = l = this.bMarks[d],
                c = d + 1 < t || r ? this.eMarks[d] + 1 : this.eMarks[d];
              l < c && s < n;

            ) {
              if (((a = this.src.charCodeAt(l)), o(a)))
                9 === a ? (s += 4 - ((s + this.bsCount[d]) % 4)) : s++;
              else {
                if (!(l - p < this.tShift[d])) break;
                s++;
              }
              l++;
            }
            u[i] =
              s > n
                ? new Array(s - n + 1).join(" ") + this.src.slice(l, c)
                : this.src.slice(l, c);
          }
          return u.join("");
        }),
        (r.prototype.Token = i),
        (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        var n = e.bMarks[t] + e.blkIndent,
          r = e.eMarks[t];
        return e.src.substr(n, r - n);
      }
      function i(e) {
        var t,
          n = [],
          r = 0,
          i = e.length,
          o = 0,
          s = 0,
          a = !1,
          l = 0;
        for (t = e.charCodeAt(r); r < i; )
          96 === t
            ? a
              ? ((a = !1), (l = r))
              : o % 2 == 0 && ((a = !0), (l = r))
            : 124 !== t ||
              o % 2 != 0 ||
              a ||
              (n.push(e.substring(s, r)), (s = r + 1)),
            92 === t ? o++ : (o = 0),
            r++,
            r === i && a && ((a = !1), (r = l + 1)),
            (t = e.charCodeAt(r));
        return n.push(e.substring(s)), n;
      }
      var o = n(1).isSpace;
      e.exports = function (e, t, n, s) {
        var a, l, c, u, p, d, h, f, m, g, y, v;
        if (t + 2 > n) return !1;
        if (((p = t + 1), e.sCount[p] < e.blkIndent)) return !1;
        if (e.sCount[p] - e.blkIndent >= 4) return !1;
        if ((c = e.bMarks[p] + e.tShift[p]) >= e.eMarks[p]) return !1;
        if (124 !== (a = e.src.charCodeAt(c++)) && 45 !== a && 58 !== a)
          return !1;
        for (; c < e.eMarks[p]; ) {
          if (
            124 !== (a = e.src.charCodeAt(c)) &&
            45 !== a &&
            58 !== a &&
            !o(a)
          )
            return !1;
          c++;
        }
        for (
          l = r(e, t + 1), d = l.split("|"), m = [], u = 0;
          u < d.length;
          u++
        ) {
          if (!(g = d[u].trim())) {
            if (0 === u || u === d.length - 1) continue;
            return !1;
          }
          if (!/^:?-+:?$/.test(g)) return !1;
          58 === g.charCodeAt(g.length - 1)
            ? m.push(58 === g.charCodeAt(0) ? "center" : "right")
            : 58 === g.charCodeAt(0)
            ? m.push("left")
            : m.push("");
        }
        if (((l = r(e, t).trim()), -1 === l.indexOf("|"))) return !1;
        if (e.sCount[t] - e.blkIndent >= 4) return !1;
        if (((d = i(l.replace(/^\||\|$/g, ""))), (h = d.length) > m.length))
          return !1;
        if (s) return !0;
        for (
          f = e.push("table_open", "table", 1),
            f.map = y = [t, 0],
            f = e.push("thead_open", "thead", 1),
            f.map = [t, t + 1],
            f = e.push("tr_open", "tr", 1),
            f.map = [t, t + 1],
            u = 0;
          u < d.length;
          u++
        )
          (f = e.push("th_open", "th", 1)),
            (f.map = [t, t + 1]),
            m[u] && (f.attrs = [["style", "text-align:" + m[u]]]),
            (f = e.push("inline", "", 0)),
            (f.content = d[u].trim()),
            (f.map = [t, t + 1]),
            (f.children = []),
            (f = e.push("th_close", "th", -1));
        for (
          f = e.push("tr_close", "tr", -1),
            f = e.push("thead_close", "thead", -1),
            f = e.push("tbody_open", "tbody", 1),
            f.map = v = [t + 2, 0],
            p = t + 2;
          p < n &&
          !(e.sCount[p] < e.blkIndent) &&
          ((l = r(e, p).trim()), -1 !== l.indexOf("|")) &&
          !(e.sCount[p] - e.blkIndent >= 4);
          p++
        ) {
          for (
            d = i(l.replace(/^\||\|$/g, "")),
              f = e.push("tr_open", "tr", 1),
              u = 0;
            u < h;
            u++
          )
            (f = e.push("td_open", "td", 1)),
              m[u] && (f.attrs = [["style", "text-align:" + m[u]]]),
              (f = e.push("inline", "", 0)),
              (f.content = d[u] ? d[u].trim() : ""),
              (f.children = []),
              (f = e.push("td_close", "td", -1));
          f = e.push("tr_close", "tr", -1);
        }
        return (
          (f = e.push("tbody_close", "tbody", -1)),
          (f = e.push("table_close", "table", -1)),
          (y[1] = v[1] = p),
          (e.line = p),
          !0
        );
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e) {
        var t;
        e.inlineMode
          ? ((t = new e.Token("inline", "", 0)),
            (t.content = e.src),
            (t.map = [0, 1]),
            (t.children = []),
            e.tokens.push(t))
          : e.md.block.parse(e.src, e.md, e.env, e.tokens);
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e) {
        var t,
          n,
          r,
          i = e.tokens;
        for (n = 0, r = i.length; n < r; n++)
          (t = i[n]),
            "inline" === t.type &&
              e.md.inline.parse(t.content, e.md, e.env, t.children);
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return /^<a[>\s]/i.test(e);
      }
      function i(e) {
        return /^<\/a\s*>/i.test(e);
      }
      var o = n(1).arrayReplaceAt;
      e.exports = function (e) {
        var t,
          n,
          s,
          a,
          l,
          c,
          u,
          p,
          d,
          h,
          f,
          m,
          g,
          y,
          v,
          b,
          _,
          w = e.tokens;
        if (e.md.options.linkify)
          for (n = 0, s = w.length; n < s; n++)
            if ("inline" === w[n].type && e.md.linkify.pretest(w[n].content))
              for (a = w[n].children, g = 0, t = a.length - 1; t >= 0; t--)
                if (((c = a[t]), "link_close" !== c.type)) {
                  if (
                    ("html_inline" === c.type &&
                      (r(c.content) && g > 0 && g--, i(c.content) && g++),
                    !(g > 0) &&
                      "text" === c.type &&
                      e.md.linkify.test(c.content))
                  ) {
                    for (
                      d = c.content,
                        _ = e.md.linkify.match(d),
                        u = [],
                        m = c.level,
                        f = 0,
                        p = 0;
                      p < _.length;
                      p++
                    )
                      (y = _[p].url),
                        (v = e.md.normalizeLink(y)),
                        e.md.validateLink(v) &&
                          ((b = _[p].text),
                          (b = _[p].schema
                            ? "mailto:" !== _[p].schema || /^mailto:/i.test(b)
                              ? e.md.normalizeLinkText(b)
                              : e.md
                                  .normalizeLinkText("mailto:" + b)
                                  .replace(/^mailto:/, "")
                            : e.md
                                .normalizeLinkText("http://" + b)
                                .replace(/^http:\/\//, "")),
                          (h = _[p].index),
                          h > f &&
                            ((l = new e.Token("text", "", 0)),
                            (l.content = d.slice(f, h)),
                            (l.level = m),
                            u.push(l)),
                          (l = new e.Token("link_open", "a", 1)),
                          (l.attrs = [["href", v]]),
                          (l.level = m++),
                          (l.markup = "linkify"),
                          (l.info = "auto"),
                          u.push(l),
                          (l = new e.Token("text", "", 0)),
                          (l.content = b),
                          (l.level = m),
                          u.push(l),
                          (l = new e.Token("link_close", "a", -1)),
                          (l.level = --m),
                          (l.markup = "linkify"),
                          (l.info = "auto"),
                          u.push(l),
                          (f = _[p].lastIndex));
                    f < d.length &&
                      ((l = new e.Token("text", "", 0)),
                      (l.content = d.slice(f)),
                      (l.level = m),
                      u.push(l)),
                      (w[n].children = a = o(a, t, u));
                  }
                } else
                  for (
                    t--;
                    a[t].level !== c.level && "link_open" !== a[t].type;

                  )
                    t--;
      };
    },
    function (e, t, n) {
      "use strict";
      var r = /\r[\n\u0085]?|[\u2424\u2028\u0085]/g,
        i = /\u0000/g;
      e.exports = function (e) {
        var t;
        (t = e.src.replace(r, "\n")), (t = t.replace(i, "�")), (e.src = t);
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return c[t.toLowerCase()];
      }
      function i(e) {
        var t,
          n,
          i = 0;
        for (t = e.length - 1; t >= 0; t--)
          (n = e[t]),
            "text" !== n.type || i || (n.content = n.content.replace(l, r)),
            "link_open" === n.type && "auto" === n.info && i--,
            "link_close" === n.type && "auto" === n.info && i++;
      }
      function o(e) {
        var t,
          n,
          r = 0;
        for (t = e.length - 1; t >= 0; t--)
          (n = e[t]),
            "text" !== n.type ||
              r ||
              (s.test(n.content) &&
                (n.content = n.content
                  .replace(/\+-/g, "±")
                  .replace(/\.{2,}/g, "…")
                  .replace(/([?!])…/g, "$1..")
                  .replace(/([?!]){4,}/g, "$1$1$1")
                  .replace(/,{2,}/g, ",")
                  .replace(/(^|[^-])---([^-]|$)/gm, "$1—$2")
                  .replace(/(^|\s)--(\s|$)/gm, "$1–$2")
                  .replace(/(^|[^-\s])--([^-\s]|$)/gm, "$1–$2"))),
            "link_open" === n.type && "auto" === n.info && r--,
            "link_close" === n.type && "auto" === n.info && r++;
      }
      var s = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/,
        a = /\((c|tm|r|p)\)/i,
        l = /\((c|tm|r|p)\)/gi,
        c = { c: "©", r: "®", p: "§", tm: "™" };
      e.exports = function (e) {
        var t;
        if (e.md.options.typographer)
          for (t = e.tokens.length - 1; t >= 0; t--)
            "inline" === e.tokens[t].type &&
              (a.test(e.tokens[t].content) && i(e.tokens[t].children),
              s.test(e.tokens[t].content) && o(e.tokens[t].children));
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        return e.substr(0, t) + n + e.substr(t + 1);
      }
      function i(e, t) {
        var n, i, l, p, d, h, f, m, g, y, v, b, _, w, C, S, k, x, E, T, A;
        for (E = [], n = 0; n < e.length; n++) {
          for (
            i = e[n], f = e[n].level, k = E.length - 1;
            k >= 0 && !(E[k].level <= f);
            k--
          );
          if (((E.length = k + 1), "text" === i.type)) {
            (l = i.content), (d = 0), (h = l.length);
            e: for (; d < h && ((c.lastIndex = d), (p = c.exec(l))); ) {
              if (
                ((C = S = !0),
                (d = p.index + 1),
                (x = "'" === p[0]),
                (g = 32),
                p.index - 1 >= 0)
              )
                g = l.charCodeAt(p.index - 1);
              else
                for (k = n - 1; k >= 0; k--)
                  if ("text" === e[k].type) {
                    g = e[k].content.charCodeAt(e[k].content.length - 1);
                    break;
                  }
              if (((y = 32), d < h)) y = l.charCodeAt(d);
              else
                for (k = n + 1; k < e.length; k++)
                  if ("text" === e[k].type) {
                    y = e[k].content.charCodeAt(0);
                    break;
                  }
              if (
                ((v = a(g) || s(String.fromCharCode(g))),
                (b = a(y) || s(String.fromCharCode(y))),
                (_ = o(g)),
                (w = o(y)),
                w ? (C = !1) : b && (_ || v || (C = !1)),
                _ ? (S = !1) : v && (w || b || (S = !1)),
                34 === y && '"' === p[0] && g >= 48 && g <= 57 && (S = C = !1),
                C && S && ((C = !1), (S = b)),
                C || S)
              ) {
                if (S)
                  for (
                    k = E.length - 1;
                    k >= 0 && ((m = E[k]), !(E[k].level < f));
                    k--
                  )
                    if (m.single === x && E[k].level === f) {
                      (m = E[k]),
                        x
                          ? ((T = t.md.options.quotes[2]),
                            (A = t.md.options.quotes[3]))
                          : ((T = t.md.options.quotes[0]),
                            (A = t.md.options.quotes[1])),
                        (i.content = r(i.content, p.index, A)),
                        (e[m.token].content = r(e[m.token].content, m.pos, T)),
                        (d += A.length - 1),
                        m.token === n && (d += T.length - 1),
                        (l = i.content),
                        (h = l.length),
                        (E.length = k);
                      continue e;
                    }
                C
                  ? E.push({ token: n, pos: p.index, single: x, level: f })
                  : S && x && (i.content = r(i.content, p.index, u));
              } else x && (i.content = r(i.content, p.index, u));
            }
          }
        }
      }
      var o = n(1).isWhiteSpace,
        s = n(1).isPunctChar,
        a = n(1).isMdAsciiPunct,
        l = /['"]/,
        c = /['"]/g,
        u = "’";
      e.exports = function (e) {
        var t;
        if (e.md.options.typographer)
          for (t = e.tokens.length - 1; t >= 0; t--)
            "inline" === e.tokens[t].type &&
              l.test(e.tokens[t].content) &&
              i(e.tokens[t].children, e);
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        (this.src = e),
          (this.env = n),
          (this.tokens = []),
          (this.inlineMode = !1),
          (this.md = t);
      }
      var i = n(29);
      (r.prototype.Token = i), (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      var r =
          /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/,
        i = /^<([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)>/;
      e.exports = function (e, t) {
        var n,
          o,
          s,
          a,
          l,
          c,
          u = e.pos;
        return (
          60 === e.src.charCodeAt(u) &&
          ((n = e.src.slice(u)),
          !(n.indexOf(">") < 0) &&
            (i.test(n)
              ? ((o = n.match(i)),
                (a = o[0].slice(1, -1)),
                (l = e.md.normalizeLink(a)),
                !!e.md.validateLink(l) &&
                  (t ||
                    ((c = e.push("link_open", "a", 1)),
                    (c.attrs = [["href", l]]),
                    (c.markup = "autolink"),
                    (c.info = "auto"),
                    (c = e.push("text", "", 0)),
                    (c.content = e.md.normalizeLinkText(a)),
                    (c = e.push("link_close", "a", -1)),
                    (c.markup = "autolink"),
                    (c.info = "auto")),
                  (e.pos += o[0].length),
                  !0))
              : !!r.test(n) &&
                ((s = n.match(r)),
                (a = s[0].slice(1, -1)),
                (l = e.md.normalizeLink("mailto:" + a)),
                !!e.md.validateLink(l) &&
                  (t ||
                    ((c = e.push("link_open", "a", 1)),
                    (c.attrs = [["href", l]]),
                    (c.markup = "autolink"),
                    (c.info = "auto"),
                    (c = e.push("text", "", 0)),
                    (c.content = e.md.normalizeLinkText(a)),
                    (c = e.push("link_close", "a", -1)),
                    (c.markup = "autolink"),
                    (c.info = "auto")),
                  (e.pos += s[0].length),
                  !0))))
        );
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e, t) {
        var n,
          r,
          i,
          o,
          s,
          a,
          l = e.pos;
        if (96 !== e.src.charCodeAt(l)) return !1;
        for (n = l, l++, r = e.posMax; l < r && 96 === e.src.charCodeAt(l); )
          l++;
        for (
          i = e.src.slice(n, l), o = s = l;
          -1 !== (o = e.src.indexOf("`", s));

        ) {
          for (s = o + 1; s < r && 96 === e.src.charCodeAt(s); ) s++;
          if (s - o === i.length)
            return (
              t ||
                ((a = e.push("code_inline", "code", 0)),
                (a.markup = i),
                (a.content = e.src
                  .slice(l, o)
                  .replace(/[ \n]+/g, " ")
                  .trim())),
              (e.pos = s),
              !0
            );
        }
        return t || (e.pending += i), (e.pos += i.length), !0;
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e) {
        var t,
          n,
          r,
          i,
          o = e.delimiters,
          s = e.delimiters.length;
        for (t = 0; t < s; t++)
          if (((r = o[t]), r.close))
            for (n = t - r.jump - 1; n >= 0; ) {
              if (
                ((i = o[n]),
                i.open &&
                  i.marker === r.marker &&
                  i.end < 0 &&
                  i.level === r.level)
              ) {
                var a =
                  (i.close || r.open) &&
                  void 0 !== i.length &&
                  void 0 !== r.length &&
                  (i.length + r.length) % 3 == 0;
                if (!a) {
                  (r.jump = t - n), (r.open = !1), (i.end = t), (i.jump = 0);
                  break;
                }
              }
              n -= i.jump + 1;
            }
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(47),
        i = n(1).has,
        o = n(1).isValidEntityCode,
        s = n(1).fromCodePoint,
        a = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i,
        l = /^&([a-z][a-z0-9]{1,31});/i;
      e.exports = function (e, t) {
        var n,
          c,
          u = e.pos,
          p = e.posMax;
        if (38 !== e.src.charCodeAt(u)) return !1;
        if (u + 1 < p)
          if (35 === e.src.charCodeAt(u + 1)) {
            if ((c = e.src.slice(u).match(a)))
              return (
                t ||
                  ((n =
                    "x" === c[1][0].toLowerCase()
                      ? parseInt(c[1].slice(1), 16)
                      : parseInt(c[1], 10)),
                  (e.pending += s(o(n) ? n : 65533))),
                (e.pos += c[0].length),
                !0
              );
          } else if ((c = e.src.slice(u).match(l)) && i(r, c[1]))
            return t || (e.pending += r[c[1]]), (e.pos += c[0].length), !0;
        return t || (e.pending += "&"), e.pos++, !0;
      };
    },
    function (e, t, n) {
      "use strict";
      for (var r = n(1).isSpace, i = [], o = 0; o < 256; o++) i.push(0);
      "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function (e) {
        i[e.charCodeAt(0)] = 1;
      }),
        (e.exports = function (e, t) {
          var n,
            o = e.pos,
            s = e.posMax;
          if (92 !== e.src.charCodeAt(o)) return !1;
          if (++o < s) {
            if ((n = e.src.charCodeAt(o)) < 256 && 0 !== i[n])
              return t || (e.pending += e.src[o]), (e.pos += 2), !0;
            if (10 === n) {
              for (
                t || e.push("hardbreak", "br", 0), o++;
                o < s && ((n = e.src.charCodeAt(o)), r(n));

              )
                o++;
              return (e.pos = o), !0;
            }
          }
          return t || (e.pending += "\\"), e.pos++, !0;
        });
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = 32 | e;
        return t >= 97 && t <= 122;
      }
      var i = n(48).HTML_TAG_RE;
      e.exports = function (e, t) {
        var n,
          o,
          s,
          a,
          l = e.pos;
        return (
          !!e.md.options.html &&
          ((s = e.posMax),
          !(60 !== e.src.charCodeAt(l) || l + 2 >= s) &&
            !(
              33 !== (n = e.src.charCodeAt(l + 1)) &&
              63 !== n &&
              47 !== n &&
              !r(n)
            ) &&
            !!(o = e.src.slice(l).match(i)) &&
            (t ||
              ((a = e.push("html_inline", "", 0)),
              (a.content = e.src.slice(l, l + o[0].length))),
            (e.pos += o[0].length),
            !0))
        );
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).normalizeReference,
        i = n(1).isSpace;
      e.exports = function (e, t) {
        var n,
          o,
          s,
          a,
          l,
          c,
          u,
          p,
          d,
          h,
          f,
          m,
          g,
          y = "",
          v = e.pos,
          b = e.posMax;
        if (33 !== e.src.charCodeAt(e.pos)) return !1;
        if (91 !== e.src.charCodeAt(e.pos + 1)) return !1;
        if (
          ((c = e.pos + 2),
          (l = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1)) < 0)
        )
          return !1;
        if ((u = l + 1) < b && 40 === e.src.charCodeAt(u)) {
          for (
            u++;
            u < b && ((o = e.src.charCodeAt(u)), i(o) || 10 === o);
            u++
          );
          if (u >= b) return !1;
          for (
            g = u,
              d = e.md.helpers.parseLinkDestination(e.src, u, e.posMax),
              d.ok &&
                ((y = e.md.normalizeLink(d.str)),
                e.md.validateLink(y) ? (u = d.pos) : (y = "")),
              g = u;
            u < b && ((o = e.src.charCodeAt(u)), i(o) || 10 === o);
            u++
          );
          if (
            ((d = e.md.helpers.parseLinkTitle(e.src, u, e.posMax)),
            u < b && g !== u && d.ok)
          )
            for (
              h = d.str, u = d.pos;
              u < b && ((o = e.src.charCodeAt(u)), i(o) || 10 === o);
              u++
            );
          else h = "";
          if (u >= b || 41 !== e.src.charCodeAt(u)) return (e.pos = v), !1;
          u++;
        } else {
          if (void 0 === e.env.references) return !1;
          if (
            (u < b && 91 === e.src.charCodeAt(u)
              ? ((g = u + 1),
                (u = e.md.helpers.parseLinkLabel(e, u)),
                u >= 0 ? (a = e.src.slice(g, u++)) : (u = l + 1))
              : (u = l + 1),
            a || (a = e.src.slice(c, l)),
            !(p = e.env.references[r(a)]))
          )
            return (e.pos = v), !1;
          (y = p.href), (h = p.title);
        }
        return (
          t ||
            ((s = e.src.slice(c, l)),
            e.md.inline.parse(s, e.md, e.env, (m = [])),
            (f = e.push("image", "img", 0)),
            (f.attrs = n =
              [
                ["src", y],
                ["alt", ""],
              ]),
            (f.children = m),
            (f.content = s),
            h && n.push(["title", h])),
          (e.pos = u),
          (e.posMax = b),
          !0
        );
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).normalizeReference,
        i = n(1).isSpace;
      e.exports = function (e, t) {
        var n,
          o,
          s,
          a,
          l,
          c,
          u,
          p,
          d,
          h,
          f = "",
          m = e.pos,
          g = e.posMax,
          y = e.pos,
          v = !0;
        if (91 !== e.src.charCodeAt(e.pos)) return !1;
        if (
          ((l = e.pos + 1), (a = e.md.helpers.parseLinkLabel(e, e.pos, !0)) < 0)
        )
          return !1;
        if ((c = a + 1) < g && 40 === e.src.charCodeAt(c)) {
          for (
            v = !1, c++;
            c < g && ((o = e.src.charCodeAt(c)), i(o) || 10 === o);
            c++
          );
          if (c >= g) return !1;
          for (
            y = c,
              u = e.md.helpers.parseLinkDestination(e.src, c, e.posMax),
              u.ok &&
                ((f = e.md.normalizeLink(u.str)),
                e.md.validateLink(f) ? (c = u.pos) : (f = "")),
              y = c;
            c < g && ((o = e.src.charCodeAt(c)), i(o) || 10 === o);
            c++
          );
          if (
            ((u = e.md.helpers.parseLinkTitle(e.src, c, e.posMax)),
            c < g && y !== c && u.ok)
          )
            for (
              d = u.str, c = u.pos;
              c < g && ((o = e.src.charCodeAt(c)), i(o) || 10 === o);
              c++
            );
          else d = "";
          (c >= g || 41 !== e.src.charCodeAt(c)) && (v = !0), c++;
        }
        if (v) {
          if (void 0 === e.env.references) return !1;
          if (
            (c < g && 91 === e.src.charCodeAt(c)
              ? ((y = c + 1),
                (c = e.md.helpers.parseLinkLabel(e, c)),
                c >= 0 ? (s = e.src.slice(y, c++)) : (c = a + 1))
              : (c = a + 1),
            s || (s = e.src.slice(l, a)),
            !(p = e.env.references[r(s)]))
          )
            return (e.pos = m), !1;
          (f = p.href), (d = p.title);
        }
        return (
          t ||
            ((e.pos = l),
            (e.posMax = a),
            (h = e.push("link_open", "a", 1)),
            (h.attrs = n = [["href", f]]),
            d && n.push(["title", d]),
            e.md.inline.tokenize(e),
            (h = e.push("link_close", "a", -1))),
          (e.pos = c),
          (e.posMax = g),
          !0
        );
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(1).isSpace;
      e.exports = function (e, t) {
        var n,
          i,
          o = e.pos;
        if (10 !== e.src.charCodeAt(o)) return !1;
        for (
          n = e.pending.length - 1,
            i = e.posMax,
            t ||
              (n >= 0 && 32 === e.pending.charCodeAt(n)
                ? n >= 1 && 32 === e.pending.charCodeAt(n - 1)
                  ? ((e.pending = e.pending.replace(/ +$/, "")),
                    e.push("hardbreak", "br", 0))
                  : ((e.pending = e.pending.slice(0, -1)),
                    e.push("softbreak", "br", 0))
                : e.push("softbreak", "br", 0)),
            o++;
          o < i && r(e.src.charCodeAt(o));

        )
          o++;
        return (e.pos = o), !0;
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n, r) {
        (this.src = e),
          (this.env = n),
          (this.md = t),
          (this.tokens = r),
          (this.pos = 0),
          (this.posMax = this.src.length),
          (this.level = 0),
          (this.pending = ""),
          (this.pendingLevel = 0),
          (this.cache = {}),
          (this.delimiters = []);
      }
      var i = n(29),
        o = n(1).isWhiteSpace,
        s = n(1).isPunctChar,
        a = n(1).isMdAsciiPunct;
      (r.prototype.pushPending = function () {
        var e = new i("text", "", 0);
        return (
          (e.content = this.pending),
          (e.level = this.pendingLevel),
          this.tokens.push(e),
          (this.pending = ""),
          e
        );
      }),
        (r.prototype.push = function (e, t, n) {
          this.pending && this.pushPending();
          var r = new i(e, t, n);
          return (
            n < 0 && this.level--,
            (r.level = this.level),
            n > 0 && this.level++,
            (this.pendingLevel = this.level),
            this.tokens.push(r),
            r
          );
        }),
        (r.prototype.scanDelims = function (e, t) {
          var n,
            r,
            i,
            l,
            c,
            u,
            p,
            d,
            h,
            f = e,
            m = !0,
            g = !0,
            y = this.posMax,
            v = this.src.charCodeAt(e);
          for (
            n = e > 0 ? this.src.charCodeAt(e - 1) : 32;
            f < y && this.src.charCodeAt(f) === v;

          )
            f++;
          return (
            (i = f - e),
            (r = f < y ? this.src.charCodeAt(f) : 32),
            (p = a(n) || s(String.fromCharCode(n))),
            (h = a(r) || s(String.fromCharCode(r))),
            (u = o(n)),
            (d = o(r)),
            d ? (m = !1) : h && (u || p || (m = !1)),
            u ? (g = !1) : p && (d || h || (g = !1)),
            t
              ? ((l = m), (c = g))
              : ((l = m && (!g || p)), (c = g && (!m || h))),
            { can_open: l, can_close: c, length: i }
          );
        }),
        (r.prototype.Token = i),
        (e.exports = r);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        switch (e) {
          case 10:
          case 33:
          case 35:
          case 36:
          case 37:
          case 38:
          case 42:
          case 43:
          case 45:
          case 58:
          case 60:
          case 61:
          case 62:
          case 64:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 123:
          case 125:
          case 126:
            return !0;
          default:
            return !1;
        }
      }
      e.exports = function (e, t) {
        for (var n = e.pos; n < e.posMax && !r(e.src.charCodeAt(n)); ) n++;
        return (
          n !== e.pos &&
          (t || (e.pending += e.src.slice(e.pos, n)), (e.pos = n), !0)
        );
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e) {
        var t,
          n,
          r = 0,
          i = e.tokens,
          o = e.tokens.length;
        for (t = n = 0; t < o; t++)
          (r += i[t].nesting),
            (i[t].level = r),
            "text" === i[t].type && t + 1 < o && "text" === i[t + 1].type
              ? (i[t + 1].content = i[t].content + i[t + 1].content)
              : (t !== n && (i[n] = i[t]), n++);
        t !== n && (i.length = n);
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t,
          n,
          r = o[e];
        if (r) return r;
        for (r = o[e] = [], t = 0; t < 128; t++)
          (n = String.fromCharCode(t)), r.push(n);
        for (t = 0; t < e.length; t++)
          (n = e.charCodeAt(t)),
            (r[n] = "%" + ("0" + n.toString(16).toUpperCase()).slice(-2));
        return r;
      }
      function i(e, t) {
        var n;
        return (
          "string" != typeof t && (t = i.defaultChars),
          (n = r(t)),
          e.replace(/(%[a-f0-9]{2})+/gi, function (e) {
            var t,
              r,
              i,
              o,
              s,
              a,
              l,
              c = "";
            for (t = 0, r = e.length; t < r; t += 3)
              (i = parseInt(e.slice(t + 1, t + 3), 16)),
                i < 128
                  ? (c += n[i])
                  : 192 == (224 & i) &&
                    t + 3 < r &&
                    128 == (192 & (o = parseInt(e.slice(t + 4, t + 6), 16)))
                  ? ((l = ((i << 6) & 1984) | (63 & o)),
                    (c += l < 128 ? "��" : String.fromCharCode(l)),
                    (t += 3))
                  : 224 == (240 & i) &&
                    t + 6 < r &&
                    ((o = parseInt(e.slice(t + 4, t + 6), 16)),
                    (s = parseInt(e.slice(t + 7, t + 9), 16)),
                    128 == (192 & o) && 128 == (192 & s))
                  ? ((l = ((i << 12) & 61440) | ((o << 6) & 4032) | (63 & s)),
                    (c +=
                      l < 2048 || (l >= 55296 && l <= 57343)
                        ? "���"
                        : String.fromCharCode(l)),
                    (t += 6))
                  : 240 == (248 & i) &&
                    t + 9 < r &&
                    ((o = parseInt(e.slice(t + 4, t + 6), 16)),
                    (s = parseInt(e.slice(t + 7, t + 9), 16)),
                    (a = parseInt(e.slice(t + 10, t + 12), 16)),
                    128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a))
                  ? ((l =
                      ((i << 18) & 1835008) |
                      ((o << 12) & 258048) |
                      ((s << 6) & 4032) |
                      (63 & a)),
                    l < 65536 || l > 1114111
                      ? (c += "����")
                      : ((l -= 65536),
                        (c += String.fromCharCode(
                          55296 + (l >> 10),
                          56320 + (1023 & l),
                        ))),
                    (t += 9))
                  : (c += "�");
            return c;
          })
        );
      }
      var o = {};
      (i.defaultChars = ";/?:@&=+$,#"),
        (i.componentChars = ""),
        (e.exports = i);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t,
          n,
          r = o[e];
        if (r) return r;
        for (r = o[e] = [], t = 0; t < 128; t++)
          (n = String.fromCharCode(t)),
            /^[0-9a-z]$/i.test(n)
              ? r.push(n)
              : r.push("%" + ("0" + t.toString(16).toUpperCase()).slice(-2));
        for (t = 0; t < e.length; t++) r[e.charCodeAt(t)] = e[t];
        return r;
      }
      function i(e, t, n) {
        var o,
          s,
          a,
          l,
          c,
          u = "";
        for (
          "string" != typeof t && ((n = t), (t = i.defaultChars)),
            void 0 === n && (n = !0),
            c = r(t),
            o = 0,
            s = e.length;
          o < s;
          o++
        )
          if (
            ((a = e.charCodeAt(o)),
            n &&
              37 === a &&
              o + 2 < s &&
              /^[0-9a-f]{2}$/i.test(e.slice(o + 1, o + 3)))
          )
            (u += e.slice(o, o + 3)), (o += 2);
          else if (a < 128) u += c[a];
          else if (a >= 55296 && a <= 57343) {
            if (
              a >= 55296 &&
              a <= 56319 &&
              o + 1 < s &&
              (l = e.charCodeAt(o + 1)) >= 56320 &&
              l <= 57343
            ) {
              (u += encodeURIComponent(e[o] + e[o + 1])), o++;
              continue;
            }
            u += "%EF%BF%BD";
          } else u += encodeURIComponent(e[o]);
        return u;
      }
      var o = {};
      (i.defaultChars = ";/?:@&=+$,-_.!~*'()#"),
        (i.componentChars = "-_.!~*'()"),
        (e.exports = i);
    },
    function (e, t, n) {
      "use strict";
      e.exports = function (e) {
        var t = "";
        return (
          (t += e.protocol || ""),
          (t += e.slashes ? "//" : ""),
          (t += e.auth ? e.auth + "@" : ""),
          e.hostname && -1 !== e.hostname.indexOf(":")
            ? (t += "[" + e.hostname + "]")
            : (t += e.hostname || ""),
          (t += e.port ? ":" + e.port : ""),
          (t += e.pathname || ""),
          (t += e.search || ""),
          (t += e.hash || "")
        );
      };
    },
    function (e, t, n) {
      "use strict";
      function r() {
        (this.protocol = null),
          (this.slashes = null),
          (this.auth = null),
          (this.port = null),
          (this.hostname = null),
          (this.hash = null),
          (this.search = null),
          (this.pathname = null);
      }
      function i(e, t) {
        if (e && e instanceof r) return e;
        var n = new r();
        return n.parse(e, t), n;
      }
      var o = /^([a-z0-9.+-]+:)/i,
        s = /:[0-9]*$/,
        a = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
        l = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],
        c = ["{", "}", "|", "\\", "^", "`"].concat(l),
        u = ["'"].concat(c),
        p = ["%", "/", "?", ";", "#"].concat(u),
        d = ["/", "?", "#"],
        h = /^[+a-z0-9A-Z_-]{0,63}$/,
        f = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
        m = { javascript: !0, "javascript:": !0 },
        g = {
          http: !0,
          https: !0,
          ftp: !0,
          gopher: !0,
          file: !0,
          "http:": !0,
          "https:": !0,
          "ftp:": !0,
          "gopher:": !0,
          "file:": !0,
        };
      (r.prototype.parse = function (e, t) {
        var n,
          r,
          i,
          s,
          l,
          c = e;
        if (((c = c.trim()), !t && 1 === e.split("#").length)) {
          var u = a.exec(c);
          if (u)
            return (this.pathname = u[1]), u[2] && (this.search = u[2]), this;
        }
        var y = o.exec(c);
        if (
          (y &&
            ((y = y[0]),
            (i = y.toLowerCase()),
            (this.protocol = y),
            (c = c.substr(y.length))),
          (t || y || c.match(/^\/\/[^@\/]+@[^@\/]+/)) &&
            (!(l = "//" === c.substr(0, 2)) ||
              (y && m[y]) ||
              ((c = c.substr(2)), (this.slashes = !0))),
          !m[y] && (l || (y && !g[y])))
        ) {
          var v = -1;
          for (n = 0; n < d.length; n++)
            -1 !== (s = c.indexOf(d[n])) && (-1 === v || s < v) && (v = s);
          var b, _;
          for (
            _ = -1 === v ? c.lastIndexOf("@") : c.lastIndexOf("@", v),
              -1 !== _ &&
                ((b = c.slice(0, _)), (c = c.slice(_ + 1)), (this.auth = b)),
              v = -1,
              n = 0;
            n < p.length;
            n++
          )
            -1 !== (s = c.indexOf(p[n])) && (-1 === v || s < v) && (v = s);
          -1 === v && (v = c.length), ":" === c[v - 1] && v--;
          var w = c.slice(0, v);
          (c = c.slice(v)),
            this.parseHost(w),
            (this.hostname = this.hostname || "");
          var C =
            "[" === this.hostname[0] &&
            "]" === this.hostname[this.hostname.length - 1];
          if (!C) {
            var S = this.hostname.split(/\./);
            for (n = 0, r = S.length; n < r; n++) {
              var k = S[n];
              if (k && !k.match(h)) {
                for (var x = "", E = 0, T = k.length; E < T; E++)
                  k.charCodeAt(E) > 127 ? (x += "x") : (x += k[E]);
                if (!x.match(h)) {
                  var A = S.slice(0, n),
                    O = S.slice(n + 1),
                    P = k.match(f);
                  P && (A.push(P[1]), O.unshift(P[2])),
                    O.length && (c = O.join(".") + c),
                    (this.hostname = A.join("."));
                  break;
                }
              }
            }
          }
          this.hostname.length > 255 && (this.hostname = ""),
            C &&
              (this.hostname = this.hostname.substr(
                1,
                this.hostname.length - 2,
              ));
        }
        var I = c.indexOf("#");
        -1 !== I && ((this.hash = c.substr(I)), (c = c.slice(0, I)));
        var D = c.indexOf("?");
        return (
          -1 !== D && ((this.search = c.substr(D)), (c = c.slice(0, D))),
          c && (this.pathname = c),
          g[i] && this.hostname && !this.pathname && (this.pathname = ""),
          this
        );
      }),
        (r.prototype.parseHost = function (e) {
          var t = s.exec(e);
          t &&
            ((t = t[0]),
            ":" !== t && (this.port = t.substr(1)),
            (e = e.substr(0, e.length - t.length))),
            e && (this.hostname = e);
        }),
        (e.exports = i);
    },
    function (e, t, n) {
      "use strict";
      var r = n(112),
        i = n(113),
        o = n(184);
      e.exports = function () {
        function e(e, t, n, r, s, a) {
          a !== o &&
            i(
              !1,
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
            );
        }
        function t() {
          return e;
        }
        e.isRequired = e;
        var n = {
          array: e,
          bool: e,
          func: e,
          number: e,
          object: e,
          string: e,
          symbol: e,
          any: e,
          arrayOf: t,
          element: e,
          instanceOf: t,
          node: e,
          objectOf: t,
          oneOf: t,
          oneOfType: t,
          shape: t,
        };
        return (n.checkPropTypes = r), (n.PropTypes = n), n;
      };
    },
    function (e, t, n) {
      "use strict";
      e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    },
    function (e, t, n) {
      (function (e, r) {
        var i;
        !(function (o) {
          function s(e) {
            throw new RangeError(D[e]);
          }
          function a(e, t) {
            for (var n = e.length, r = []; n--; ) r[n] = t(e[n]);
            return r;
          }
          function l(e, t) {
            var n = e.split("@"),
              r = "";
            return (
              n.length > 1 && ((r = n[0] + "@"), (e = n[1])),
              (e = e.replace(I, ".")),
              r + a(e.split("."), t).join(".")
            );
          }
          function c(e) {
            for (var t, n, r = [], i = 0, o = e.length; i < o; )
              (t = e.charCodeAt(i++)),
                t >= 55296 && t <= 56319 && i < o
                  ? ((n = e.charCodeAt(i++)),
                    56320 == (64512 & n)
                      ? r.push(((1023 & t) << 10) + (1023 & n) + 65536)
                      : (r.push(t), i--))
                  : r.push(t);
            return r;
          }
          function u(e) {
            return a(e, function (e) {
              var t = "";
              return (
                e > 65535 &&
                  ((e -= 65536),
                  (t += M(((e >>> 10) & 1023) | 55296)),
                  (e = 56320 | (1023 & e))),
                (t += M(e))
              );
            }).join("");
          }
          function p(e) {
            return e - 48 < 10
              ? e - 22
              : e - 65 < 26
              ? e - 65
              : e - 97 < 26
              ? e - 97
              : w;
          }
          function d(e, t) {
            return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
          }
          function h(e, t, n) {
            var r = 0;
            for (
              e = n ? N(e / x) : e >> 1, e += N(e / t);
              e > (L * S) >> 1;
              r += w
            )
              e = N(e / L);
            return N(r + ((L + 1) * e) / (e + k));
          }
          function f(e) {
            var t,
              n,
              r,
              i,
              o,
              a,
              l,
              c,
              d,
              f,
              m = [],
              g = e.length,
              y = 0,
              v = T,
              b = E;
            for (n = e.lastIndexOf(A), n < 0 && (n = 0), r = 0; r < n; ++r)
              e.charCodeAt(r) >= 128 && s("not-basic"), m.push(e.charCodeAt(r));
            for (i = n > 0 ? n + 1 : 0; i < g; ) {
              for (
                o = y, a = 1, l = w;
                i >= g && s("invalid-input"),
                  (c = p(e.charCodeAt(i++))),
                  (c >= w || c > N((_ - y) / a)) && s("overflow"),
                  (y += c * a),
                  (d = l <= b ? C : l >= b + S ? S : l - b),
                  !(c < d);
                l += w
              )
                (f = w - d), a > N(_ / f) && s("overflow"), (a *= f);
              (t = m.length + 1),
                (b = h(y - o, t, 0 == o)),
                N(y / t) > _ - v && s("overflow"),
                (v += N(y / t)),
                (y %= t),
                m.splice(y++, 0, v);
            }
            return u(m);
          }
          function m(e) {
            var t,
              n,
              r,
              i,
              o,
              a,
              l,
              u,
              p,
              f,
              m,
              g,
              y,
              v,
              b,
              k = [];
            for (e = c(e), g = e.length, t = T, n = 0, o = E, a = 0; a < g; ++a)
              (m = e[a]) < 128 && k.push(M(m));
            for (r = i = k.length, i && k.push(A); r < g; ) {
              for (l = _, a = 0; a < g; ++a)
                (m = e[a]) >= t && m < l && (l = m);
              for (
                y = r + 1,
                  l - t > N((_ - n) / y) && s("overflow"),
                  n += (l - t) * y,
                  t = l,
                  a = 0;
                a < g;
                ++a
              )
                if (((m = e[a]), m < t && ++n > _ && s("overflow"), m == t)) {
                  for (
                    u = n, p = w;
                    (f = p <= o ? C : p >= o + S ? S : p - o), !(u < f);
                    p += w
                  )
                    (b = u - f),
                      (v = w - f),
                      k.push(M(d(f + (b % v), 0))),
                      (u = N(b / v));
                  k.push(M(d(u, 0))), (o = h(n, y, r == i)), (n = 0), ++r;
                }
              ++n, ++t;
            }
            return k.join("");
          }
          function g(e) {
            return l(e, function (e) {
              return O.test(e) ? f(e.slice(4).toLowerCase()) : e;
            });
          }
          function y(e) {
            return l(e, function (e) {
              return P.test(e) ? "xn--" + m(e) : e;
            });
          }
          var v =
            ("object" == typeof t && t && t.nodeType,
            "object" == typeof e && e && e.nodeType,
            "object" == typeof r && r);
          var b,
            _ = 2147483647,
            w = 36,
            C = 1,
            S = 26,
            k = 38,
            x = 700,
            E = 72,
            T = 128,
            A = "-",
            O = /^xn--/,
            P = /[^\x20-\x7E]/,
            I = /[\x2E\u3002\uFF0E\uFF61]/g,
            D = {
              overflow: "Overflow: input needs wider integers to process",
              "not-basic": "Illegal input >= 0x80 (not a basic code point)",
              "invalid-input": "Invalid input",
            },
            L = w - C,
            N = Math.floor,
            M = String.fromCharCode;
          (b = {
            version: "1.4.1",
            ucs2: { decode: c, encode: u },
            decode: f,
            encode: m,
            toASCII: y,
            toUnicode: g,
          }),
            void 0 !==
              (i = function () {
                return b;
              }.call(t, n, t, e)) && (e.exports = i);
        })();
      }).call(t, n(87)(e), n(15));
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n, r, i, o, s, a) {
        if (!e) {
          if (((e = void 0), void 0 === t))
            e = Error(
              "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.",
            );
          else {
            var l = [n, r, i, o, s, a],
              c = 0;
            (e = Error(
              t.replace(/%s/g, function () {
                return l[c++];
              }),
            )),
              (e.name = "Invariant Violation");
          }
          throw ((e.framesToPop = 1), e);
        }
      }
      function i(e) {
        for (
          var t = arguments.length - 1,
            n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e,
            i = 0;
          i < t;
          i++
        )
          n += "&args[]=" + encodeURIComponent(arguments[i + 1]);
        r(
          !1,
          "Minified React error #" +
            e +
            "; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",
          n,
        );
      }
      function o(e, t, n, r, i, o, s, a, l) {
        var c = Array.prototype.slice.call(arguments, 3);
        try {
          t.apply(n, c);
        } catch (e) {
          this.onError(e);
        }
      }
      function s(e, t, n, r, i, s, a, l, c) {
        (Cr = !1), (Sr = null), o.apply(Er, arguments);
      }
      function a(e, t, n, r, o, a, l, c, u) {
        if ((s.apply(this, arguments), Cr)) {
          if (Cr) {
            var p = Sr;
            (Cr = !1), (Sr = null);
          } else i("198"), (p = void 0);
          kr || ((kr = !0), (xr = p));
        }
      }
      function l() {
        if (Tr)
          for (var e in Ar) {
            var t = Ar[e],
              n = Tr.indexOf(e);
            if ((-1 < n || i("96", e), !Or[n])) {
              t.extractEvents || i("97", e), (Or[n] = t), (n = t.eventTypes);
              for (var r in n) {
                var o = void 0,
                  s = n[r],
                  a = t,
                  l = r;
                Pr.hasOwnProperty(l) && i("99", l), (Pr[l] = s);
                var u = s.phasedRegistrationNames;
                if (u) {
                  for (o in u) u.hasOwnProperty(o) && c(u[o], a, l);
                  o = !0;
                } else
                  s.registrationName
                    ? (c(s.registrationName, a, l), (o = !0))
                    : (o = !1);
                o || i("98", r, e);
              }
            }
          }
      }
      function c(e, t, n) {
        Ir[e] && i("100", e),
          (Ir[e] = t),
          (Dr[e] = t.eventTypes[n].dependencies);
      }
      function u(e, t, n, r) {
        (t = e.type || "unknown-event"),
          (e.currentTarget = Mr(r)),
          a(t, n, void 0, e),
          (e.currentTarget = null);
      }
      function p(e, t) {
        return (
          null == t && i("30"),
          null == e
            ? t
            : Array.isArray(e)
            ? Array.isArray(t)
              ? (e.push.apply(e, t), e)
              : (e.push(t), e)
            : Array.isArray(t)
            ? [e].concat(t)
            : [e, t]
        );
      }
      function d(e, t, n) {
        Array.isArray(e) ? e.forEach(t, n) : e && t.call(n, e);
      }
      function h(e, t) {
        if (e) {
          var n = e._dispatchListeners,
            r = e._dispatchInstances;
          if (Array.isArray(n))
            for (var i = 0; i < n.length && !e.isPropagationStopped(); i++)
              u(e, t, n[i], r[i]);
          else n && u(e, t, n, r);
          (e._dispatchListeners = null),
            (e._dispatchInstances = null),
            e.isPersistent() || e.constructor.release(e);
        }
      }
      function f(e) {
        return h(e, !0);
      }
      function m(e) {
        return h(e, !1);
      }
      function g(e, t) {
        var n = e.stateNode;
        if (!n) return null;
        var r = Lr(n);
        if (!r) return null;
        n = r[t];
        e: switch (t) {
          case "onClick":
          case "onClickCapture":
          case "onDoubleClick":
          case "onDoubleClickCapture":
          case "onMouseDown":
          case "onMouseDownCapture":
          case "onMouseMove":
          case "onMouseMoveCapture":
          case "onMouseUp":
          case "onMouseUpCapture":
            (r = !r.disabled) ||
              ((e = e.type),
              (r = !(
                "button" === e ||
                "input" === e ||
                "select" === e ||
                "textarea" === e
              ))),
              (e = !r);
            break e;
          default:
            e = !1;
        }
        return e
          ? null
          : (n && "function" != typeof n && i("231", t, typeof n), n);
      }
      function y(e, t) {
        if (
          (null !== e && (jr = p(jr, e)),
          (e = jr),
          (jr = null),
          e && (t ? d(e, f) : d(e, m), jr && i("95"), kr))
        )
          throw ((t = xr), (kr = !1), (xr = null), t);
      }
      function v(e) {
        if (e[Rr]) return e[Rr];
        for (; !e[Rr]; ) {
          if (!e.parentNode) return null;
          e = e.parentNode;
        }
        return (e = e[Rr]), 7 === e.tag || 8 === e.tag ? e : null;
      }
      function b(e) {
        return (e = e[Rr]), !e || (7 !== e.tag && 8 !== e.tag) ? null : e;
      }
      function _(e) {
        if (7 === e.tag || 8 === e.tag) return e.stateNode;
        i("33");
      }
      function w(e) {
        return e[Br] || null;
      }
      function C(e) {
        do {
          e = e.return;
        } while (e && 7 !== e.tag);
        return e || null;
      }
      function S(e, t, n) {
        (t = g(e, n.dispatchConfig.phasedRegistrationNames[t])) &&
          ((n._dispatchListeners = p(n._dispatchListeners, t)),
          (n._dispatchInstances = p(n._dispatchInstances, e)));
      }
      function k(e) {
        if (e && e.dispatchConfig.phasedRegistrationNames) {
          for (var t = e._targetInst, n = []; t; ) n.push(t), (t = C(t));
          for (t = n.length; 0 < t--; ) S(n[t], "captured", e);
          for (t = 0; t < n.length; t++) S(n[t], "bubbled", e);
        }
      }
      function x(e, t, n) {
        e &&
          n &&
          n.dispatchConfig.registrationName &&
          (t = g(e, n.dispatchConfig.registrationName)) &&
          ((n._dispatchListeners = p(n._dispatchListeners, t)),
          (n._dispatchInstances = p(n._dispatchInstances, e)));
      }
      function E(e) {
        e && e.dispatchConfig.registrationName && x(e._targetInst, null, e);
      }
      function T(e) {
        d(e, k);
      }
      function A(e, t) {
        var n = {};
        return (
          (n[e.toLowerCase()] = t.toLowerCase()),
          (n["Webkit" + e] = "webkit" + t),
          (n["Moz" + e] = "moz" + t),
          n
        );
      }
      function O(e) {
        if (qr[e]) return qr[e];
        if (!Ur[e]) return e;
        var t,
          n = Ur[e];
        for (t in n) if (n.hasOwnProperty(t) && t in Hr) return (qr[e] = n[t]);
        return e;
      }
      function P() {
        if (Xr) return Xr;
        var e,
          t,
          n = Yr,
          r = n.length,
          i = "value" in Jr ? Jr.value : Jr.textContent,
          o = i.length;
        for (e = 0; e < r && n[e] === i[e]; e++);
        var s = r - e;
        for (t = 1; t <= s && n[r - t] === i[o - t]; t++);
        return (Xr = i.slice(e, 1 < t ? 1 - t : void 0));
      }
      function I() {
        return !0;
      }
      function D() {
        return !1;
      }
      function L(e, t, n, r) {
        (this.dispatchConfig = e),
          (this._targetInst = t),
          (this.nativeEvent = n),
          (e = this.constructor.Interface);
        for (var i in e)
          e.hasOwnProperty(i) &&
            ((t = e[i])
              ? (this[i] = t(n))
              : "target" === i
              ? (this.target = r)
              : (this[i] = n[i]));
        return (
          (this.isDefaultPrevented = (
            null != n.defaultPrevented
              ? n.defaultPrevented
              : !1 === n.returnValue
          )
            ? I
            : D),
          (this.isPropagationStopped = D),
          this
        );
      }
      function N(e, t, n, r) {
        if (this.eventPool.length) {
          var i = this.eventPool.pop();
          return this.call(i, e, t, n, r), i;
        }
        return new this(e, t, n, r);
      }
      function M(e) {
        e instanceof this || i("279"),
          e.destructor(),
          10 > this.eventPool.length && this.eventPool.push(e);
      }
      function j(e) {
        (e.eventPool = []), (e.getPooled = N), (e.release = M);
      }
      function z(e, t) {
        switch (e) {
          case "keyup":
            return -1 !== ti.indexOf(t.keyCode);
          case "keydown":
            return 229 !== t.keyCode;
          case "keypress":
          case "mousedown":
          case "blur":
            return !0;
          default:
            return !1;
        }
      }
      function F(e) {
        return (
          (e = e.detail), "object" == typeof e && "data" in e ? e.data : null
        );
      }
      function R(e, t) {
        switch (e) {
          case "compositionend":
            return F(t);
          case "keypress":
            return 32 !== t.which ? null : ((li = !0), si);
          case "textInput":
            return (e = t.data), e === si && li ? null : e;
          default:
            return null;
        }
      }
      function B(e, t) {
        if (ci)
          return "compositionend" === e || (!ni && z(e, t))
            ? ((e = P()), (Xr = Yr = Jr = null), (ci = !1), e)
            : null;
        switch (e) {
          case "paste":
            return null;
          case "keypress":
            if (
              !(t.ctrlKey || t.altKey || t.metaKey) ||
              (t.ctrlKey && t.altKey)
            ) {
              if (t.char && 1 < t.char.length) return t.char;
              if (t.which) return String.fromCharCode(t.which);
            }
            return null;
          case "compositionend":
            return oi && "ko" !== t.locale ? null : t.data;
          default:
            return null;
        }
      }
      function V(e) {
        if ((e = Nr(e))) {
          "function" != typeof pi && i("280");
          var t = Lr(e.stateNode);
          pi(e.stateNode, e.type, t);
        }
      }
      function U(e) {
        di ? (hi ? hi.push(e) : (hi = [e])) : (di = e);
      }
      function q() {
        if (di) {
          var e = di,
            t = hi;
          if (((hi = di = null), V(e), t))
            for (e = 0; e < t.length; e++) V(t[e]);
        }
      }
      function H(e, t) {
        return e(t);
      }
      function W(e, t, n) {
        return e(t, n);
      }
      function $() {}
      function G(e, t) {
        if (fi) return e(t);
        fi = !0;
        try {
          return H(e, t);
        } finally {
          (fi = !1), (null !== di || null !== hi) && ($(), q());
        }
      }
      function Z(e) {
        var t = e && e.nodeName && e.nodeName.toLowerCase();
        return "input" === t ? !!mi[e.type] : "textarea" === t;
      }
      function K(e) {
        return (
          (e = e.target || e.srcElement || window),
          e.correspondingUseElement && (e = e.correspondingUseElement),
          3 === e.nodeType ? e.parentNode : e
        );
      }
      function J(e) {
        if (!Vr) return !1;
        e = "on" + e;
        var t = e in document;
        return (
          t ||
            ((t = document.createElement("div")),
            t.setAttribute(e, "return;"),
            (t = "function" == typeof t[e])),
          t
        );
      }
      function Y(e) {
        var t = e.type;
        return (
          (e = e.nodeName) &&
          "input" === e.toLowerCase() &&
          ("checkbox" === t || "radio" === t)
        );
      }
      function X(e) {
        var t = Y(e) ? "checked" : "value",
          n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
          r = "" + e[t];
        if (
          !e.hasOwnProperty(t) &&
          void 0 !== n &&
          "function" == typeof n.get &&
          "function" == typeof n.set
        ) {
          var i = n.get,
            o = n.set;
          return (
            Object.defineProperty(e, t, {
              configurable: !0,
              get: function () {
                return i.call(this);
              },
              set: function (e) {
                (r = "" + e), o.call(this, e);
              },
            }),
            Object.defineProperty(e, t, { enumerable: n.enumerable }),
            {
              getValue: function () {
                return r;
              },
              setValue: function (e) {
                r = "" + e;
              },
              stopTracking: function () {
                (e._valueTracker = null), delete e[t];
              },
            }
          );
        }
      }
      function Q(e) {
        e._valueTracker || (e._valueTracker = X(e));
      }
      function ee(e) {
        if (!e) return !1;
        var t = e._valueTracker;
        if (!t) return !0;
        var n = t.getValue(),
          r = "";
        return (
          e && (r = Y(e) ? (e.checked ? "true" : "false") : e.value),
          (e = r) !== n && (t.setValue(e), !0)
        );
      }
      function te(e) {
        return null === e || "object" != typeof e
          ? null
          : ((e = (Oi && e[Oi]) || e["@@iterator"]),
            "function" == typeof e ? e : null);
      }
      function ne(e) {
        if (null == e) return null;
        if ("function" == typeof e) return e.displayName || e.name || null;
        if ("string" == typeof e) return e;
        switch (e) {
          case Ei:
            return "AsyncMode";
          case wi:
            return "Fragment";
          case _i:
            return "Portal";
          case Si:
            return "Profiler";
          case Ci:
            return "StrictMode";
          case Ai:
            return "Placeholder";
        }
        if ("object" == typeof e) {
          switch (e.$$typeof) {
            case xi:
              return "Context.Consumer";
            case ki:
              return "Context.Provider";
            case Ti:
              var t = e.render;
              return (
                (t = t.displayName || t.name || ""),
                e.displayName ||
                  ("" !== t ? "ForwardRef(" + t + ")" : "ForwardRef")
              );
          }
          if (
            "function" == typeof e.then &&
            (e = 1 === e._reactStatus ? e._reactResult : null)
          )
            return ne(e);
        }
        return null;
      }
      function re(e) {
        var t = "";
        do {
          e: switch (e.tag) {
            case 4:
            case 0:
            case 1:
            case 2:
            case 3:
            case 7:
            case 10:
              var n = e._debugOwner,
                r = e._debugSource,
                i = ne(e.type),
                o = null;
              n && (o = ne(n.type)),
                (n = i),
                (i = ""),
                r
                  ? (i =
                      " (at " +
                      r.fileName.replace(yi, "") +
                      ":" +
                      r.lineNumber +
                      ")")
                  : o && (i = " (created by " + o + ")"),
                (o = "\n    in " + (n || "Unknown") + i);
              break e;
            default:
              o = "";
          }
          (t += o), (e = e.return);
        } while (e);
        return t;
      }
      function ie(e) {
        return (
          !!Ii.call(Li, e) ||
          (!Ii.call(Di, e) && (Pi.test(e) ? (Li[e] = !0) : ((Di[e] = !0), !1)))
        );
      }
      function oe(e, t, n, r) {
        if (null !== n && 0 === n.type) return !1;
        switch (typeof t) {
          case "function":
          case "symbol":
            return !0;
          case "boolean":
            return (
              !r &&
              (null !== n
                ? !n.acceptsBooleans
                : "data-" !== (e = e.toLowerCase().slice(0, 5)) &&
                  "aria-" !== e)
            );
          default:
            return !1;
        }
      }
      function se(e, t, n, r) {
        if (null === t || void 0 === t || oe(e, t, n, r)) return !0;
        if (r) return !1;
        if (null !== n)
          switch (n.type) {
            case 3:
              return !t;
            case 4:
              return !1 === t;
            case 5:
              return isNaN(t);
            case 6:
              return isNaN(t) || 1 > t;
          }
        return !1;
      }
      function ae(e, t, n, r, i) {
        (this.acceptsBooleans = 2 === t || 3 === t || 4 === t),
          (this.attributeName = r),
          (this.attributeNamespace = i),
          (this.mustUseProperty = n),
          (this.propertyName = e),
          (this.type = t);
      }
      function le(e) {
        return e[1].toUpperCase();
      }
      function ce(e, t, n, r) {
        var i = Ni.hasOwnProperty(t) ? Ni[t] : null;
        (null !== i
          ? 0 === i.type
          : !r &&
            2 < t.length &&
            ("o" === t[0] || "O" === t[0]) &&
            ("n" === t[1] || "N" === t[1])) ||
          (se(t, n, i, r) && (n = null),
          r || null === i
            ? ie(t) &&
              (null === n ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
            : i.mustUseProperty
            ? (e[i.propertyName] = null === n ? 3 !== i.type && "" : n)
            : ((t = i.attributeName),
              (r = i.attributeNamespace),
              null === n
                ? e.removeAttribute(t)
                : ((i = i.type),
                  (n = 3 === i || (4 === i && !0 === n) ? "" : "" + n),
                  r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
      }
      function ue(e) {
        switch (typeof e) {
          case "boolean":
          case "number":
          case "object":
          case "string":
          case "undefined":
            return e;
          default:
            return "";
        }
      }
      function pe(e, t) {
        var n = t.checked;
        return _r({}, t, {
          defaultChecked: void 0,
          defaultValue: void 0,
          value: void 0,
          checked: null != n ? n : e._wrapperState.initialChecked,
        });
      }
      function de(e, t) {
        var n = null == t.defaultValue ? "" : t.defaultValue,
          r = null != t.checked ? t.checked : t.defaultChecked;
        (n = ue(null != t.value ? t.value : n)),
          (e._wrapperState = {
            initialChecked: r,
            initialValue: n,
            controlled:
              "checkbox" === t.type || "radio" === t.type
                ? null != t.checked
                : null != t.value,
          });
      }
      function he(e, t) {
        null != (t = t.checked) && ce(e, "checked", t, !1);
      }
      function fe(e, t) {
        he(e, t);
        var n = ue(t.value),
          r = t.type;
        if (null != n)
          "number" === r
            ? ((0 === n && "" === e.value) || e.value != n) &&
              (e.value = "" + n)
            : e.value !== "" + n && (e.value = "" + n);
        else if ("submit" === r || "reset" === r)
          return void e.removeAttribute("value");
        t.hasOwnProperty("value")
          ? ge(e, t.type, n)
          : t.hasOwnProperty("defaultValue") &&
            ge(e, t.type, ue(t.defaultValue)),
          null == t.checked &&
            null != t.defaultChecked &&
            (e.defaultChecked = !!t.defaultChecked);
      }
      function me(e, t, n) {
        if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
          var r = t.type;
          if (
            !(
              ("submit" !== r && "reset" !== r) ||
              (void 0 !== t.value && null !== t.value)
            )
          )
            return;
          (t = "" + e._wrapperState.initialValue),
            n || t === e.value || (e.value = t),
            (e.defaultValue = t);
        }
        (n = e.name),
          "" !== n && (e.name = ""),
          (e.defaultChecked = !e.defaultChecked),
          (e.defaultChecked = !!e._wrapperState.initialChecked),
          "" !== n && (e.name = n);
      }
      function ge(e, t, n) {
        ("number" === t && e.ownerDocument.activeElement === e) ||
          (null == n
            ? (e.defaultValue = "" + e._wrapperState.initialValue)
            : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
      }
      function ye(e, t, n) {
        return (
          (e = L.getPooled(ji.change, e, t, n)),
          (e.type = "change"),
          U(n),
          T(e),
          e
        );
      }
      function ve(e) {
        y(e, !1);
      }
      function be(e) {
        if (ee(_(e))) return e;
      }
      function _e(e, t) {
        if ("change" === e) return t;
      }
      function we() {
        zi && (zi.detachEvent("onpropertychange", Ce), (Fi = zi = null));
      }
      function Ce(e) {
        "value" === e.propertyName &&
          be(Fi) &&
          ((e = ye(Fi, e, K(e))), G(ve, e));
      }
      function Se(e, t, n) {
        "focus" === e
          ? (we(), (zi = t), (Fi = n), zi.attachEvent("onpropertychange", Ce))
          : "blur" === e && we();
      }
      function ke(e) {
        if ("selectionchange" === e || "keyup" === e || "keydown" === e)
          return be(Fi);
      }
      function xe(e, t) {
        if ("click" === e) return be(t);
      }
      function Ee(e, t) {
        if ("input" === e || "change" === e) return be(t);
      }
      function Te(e) {
        var t = this.nativeEvent;
        return t.getModifierState
          ? t.getModifierState(e)
          : !!(e = Ui[e]) && !!t[e];
      }
      function Ae() {
        return Te;
      }
      function Oe(e, t) {
        return e === t
          ? 0 !== e || 0 !== t || 1 / e == 1 / t
          : e !== e && t !== t;
      }
      function Pe(e, t) {
        if (Oe(e, t)) return !0;
        if (
          "object" != typeof e ||
          null === e ||
          "object" != typeof t ||
          null === t
        )
          return !1;
        var n = Object.keys(e),
          r = Object.keys(t);
        if (n.length !== r.length) return !1;
        for (r = 0; r < n.length; r++)
          if (!Yi.call(t, n[r]) || !Oe(e[n[r]], t[n[r]])) return !1;
        return !0;
      }
      function Ie(e) {
        var t = e;
        if (e.alternate) for (; t.return; ) t = t.return;
        else {
          if (0 != (2 & t.effectTag)) return 1;
          for (; t.return; )
            if (((t = t.return), 0 != (2 & t.effectTag))) return 1;
        }
        return 5 === t.tag ? 2 : 3;
      }
      function De(e) {
        2 !== Ie(e) && i("188");
      }
      function Le(e) {
        var t = e.alternate;
        if (!t) return (t = Ie(e)), 3 === t && i("188"), 1 === t ? null : e;
        for (var n = e, r = t; ; ) {
          var o = n.return,
            s = o ? o.alternate : null;
          if (!o || !s) break;
          if (o.child === s.child) {
            for (var a = o.child; a; ) {
              if (a === n) return De(o), e;
              if (a === r) return De(o), t;
              a = a.sibling;
            }
            i("188");
          }
          if (n.return !== r.return) (n = o), (r = s);
          else {
            a = !1;
            for (var l = o.child; l; ) {
              if (l === n) {
                (a = !0), (n = o), (r = s);
                break;
              }
              if (l === r) {
                (a = !0), (r = o), (n = s);
                break;
              }
              l = l.sibling;
            }
            if (!a) {
              for (l = s.child; l; ) {
                if (l === n) {
                  (a = !0), (n = s), (r = o);
                  break;
                }
                if (l === r) {
                  (a = !0), (r = s), (n = o);
                  break;
                }
                l = l.sibling;
              }
              a || i("189");
            }
          }
          n.alternate !== r && i("190");
        }
        return 5 !== n.tag && i("188"), n.stateNode.current === n ? e : t;
      }
      function Ne(e) {
        if (!(e = Le(e))) return null;
        for (var t = e; ; ) {
          if (7 === t.tag || 8 === t.tag) return t;
          if (t.child) (t.child.return = t), (t = t.child);
          else {
            if (t === e) break;
            for (; !t.sibling; ) {
              if (!t.return || t.return === e) return null;
              t = t.return;
            }
            (t.sibling.return = t.return), (t = t.sibling);
          }
        }
        return null;
      }
      function Me(e) {
        var t = e.keyCode;
        return (
          "charCode" in e
            ? 0 === (e = e.charCode) && 13 === t && (e = 13)
            : (e = t),
          10 === e && (e = 13),
          32 <= e || 13 === e ? e : 0
        );
      }
      function je(e, t) {
        var n = e[0];
        e = e[1];
        var r = "on" + (e[0].toUpperCase() + e.slice(1));
        (t = {
          phasedRegistrationNames: { bubbled: r, captured: r + "Capture" },
          dependencies: [n],
          isInteractive: t,
        }),
          (co[e] = t),
          (uo[n] = t);
      }
      function ze(e) {
        var t = e.targetInst,
          n = t;
        do {
          if (!n) {
            e.ancestors.push(n);
            break;
          }
          var r;
          for (r = n; r.return; ) r = r.return;
          if (!(r = 5 !== r.tag ? null : r.stateNode.containerInfo)) break;
          e.ancestors.push(n), (n = v(r));
        } while (n);
        for (n = 0; n < e.ancestors.length; n++) {
          t = e.ancestors[n];
          var i = K(e.nativeEvent);
          r = e.topLevelType;
          for (var o = e.nativeEvent, s = null, a = 0; a < Or.length; a++) {
            var l = Or[a];
            l && (l = l.extractEvents(r, t, o, i)) && (s = p(s, l));
          }
          y(s, !1);
        }
      }
      function Fe(e, t) {
        if (!t) return null;
        var n = (ho(e) ? Be : Ve).bind(null, e);
        t.addEventListener(e, n, !1);
      }
      function Re(e, t) {
        if (!t) return null;
        var n = (ho(e) ? Be : Ve).bind(null, e);
        t.addEventListener(e, n, !0);
      }
      function Be(e, t) {
        W(Ve, e, t);
      }
      function Ve(e, t) {
        if (mo) {
          var n = K(t);
          if (
            ((n = v(n)),
            null === n || "number" != typeof n.tag || 2 === Ie(n) || (n = null),
            fo.length)
          ) {
            var r = fo.pop();
            (r.topLevelType = e),
              (r.nativeEvent = t),
              (r.targetInst = n),
              (e = r);
          } else
            e = {
              topLevelType: e,
              nativeEvent: t,
              targetInst: n,
              ancestors: [],
            };
          try {
            G(ze, e);
          } finally {
            (e.topLevelType = null),
              (e.nativeEvent = null),
              (e.targetInst = null),
              (e.ancestors.length = 0),
              10 > fo.length && fo.push(e);
          }
        }
      }
      function Ue(e) {
        return (
          Object.prototype.hasOwnProperty.call(e, vo) ||
            ((e[vo] = yo++), (go[e[vo]] = {})),
          go[e[vo]]
        );
      }
      function qe(e) {
        if (
          void 0 ===
          (e = e || ("undefined" != typeof document ? document : void 0))
        )
          return null;
        try {
          return e.activeElement || e.body;
        } catch (t) {
          return e.body;
        }
      }
      function He(e) {
        for (; e && e.firstChild; ) e = e.firstChild;
        return e;
      }
      function We(e, t) {
        var n = He(e);
        e = 0;
        for (var r; n; ) {
          if (3 === n.nodeType) {
            if (((r = e + n.textContent.length), e <= t && r >= t))
              return { node: n, offset: t - e };
            e = r;
          }
          e: {
            for (; n; ) {
              if (n.nextSibling) {
                n = n.nextSibling;
                break e;
              }
              n = n.parentNode;
            }
            n = void 0;
          }
          n = He(n);
        }
      }
      function $e(e, t) {
        return (
          !(!e || !t) &&
          (e === t ||
            ((!e || 3 !== e.nodeType) &&
              (t && 3 === t.nodeType
                ? $e(e, t.parentNode)
                : "contains" in e
                ? e.contains(t)
                : !!e.compareDocumentPosition &&
                  !!(16 & e.compareDocumentPosition(t)))))
        );
      }
      function Ge() {
        for (var e = window, t = qe(); t instanceof e.HTMLIFrameElement; ) {
          try {
            e = t.contentDocument.defaultView;
          } catch (e) {
            break;
          }
          t = qe(e.document);
        }
        return t;
      }
      function Ze(e) {
        var t = e && e.nodeName && e.nodeName.toLowerCase();
        return (
          t &&
          (("input" === t &&
            ("text" === e.type ||
              "search" === e.type ||
              "tel" === e.type ||
              "url" === e.type ||
              "password" === e.type)) ||
            "textarea" === t ||
            "true" === e.contentEditable)
        );
      }
      function Ke(e, t) {
        var n =
          t.window === t ? t.document : 9 === t.nodeType ? t : t.ownerDocument;
        return ko || null == wo || wo !== qe(n)
          ? null
          : ((n = wo),
            "selectionStart" in n && Ze(n)
              ? (n = { start: n.selectionStart, end: n.selectionEnd })
              : ((n = (
                  (n.ownerDocument && n.ownerDocument.defaultView) ||
                  window
                ).getSelection()),
                (n = {
                  anchorNode: n.anchorNode,
                  anchorOffset: n.anchorOffset,
                  focusNode: n.focusNode,
                  focusOffset: n.focusOffset,
                })),
            So && Pe(So, n)
              ? null
              : ((So = n),
                (e = L.getPooled(_o.select, Co, e, t)),
                (e.type = "select"),
                (e.target = wo),
                T(e),
                e));
      }
      function Je(e) {
        var t = "";
        return (
          br.Children.forEach(e, function (e) {
            null != e && (t += e);
          }),
          t
        );
      }
      function Ye(e, t) {
        return (
          (e = _r({ children: void 0 }, t)),
          (t = Je(t.children)) && (e.children = t),
          e
        );
      }
      function Xe(e, t, n, r) {
        if (((e = e.options), t)) {
          t = {};
          for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
          for (n = 0; n < e.length; n++)
            (i = t.hasOwnProperty("$" + e[n].value)),
              e[n].selected !== i && (e[n].selected = i),
              i && r && (e[n].defaultSelected = !0);
        } else {
          for (n = "" + ue(n), t = null, i = 0; i < e.length; i++) {
            if (e[i].value === n)
              return (
                (e[i].selected = !0), void (r && (e[i].defaultSelected = !0))
              );
            null !== t || e[i].disabled || (t = e[i]);
          }
          null !== t && (t.selected = !0);
        }
      }
      function Qe(e, t) {
        return (
          null != t.dangerouslySetInnerHTML && i("91"),
          _r({}, t, {
            value: void 0,
            defaultValue: void 0,
            children: "" + e._wrapperState.initialValue,
          })
        );
      }
      function et(e, t) {
        var n = t.value;
        null == n &&
          ((n = t.defaultValue),
          (t = t.children),
          null != t &&
            (null != n && i("92"),
            Array.isArray(t) && (1 >= t.length || i("93"), (t = t[0])),
            (n = t)),
          null == n && (n = "")),
          (e._wrapperState = { initialValue: ue(n) });
      }
      function tt(e, t) {
        var n = ue(t.value),
          r = ue(t.defaultValue);
        null != n &&
          ((n = "" + n),
          n !== e.value && (e.value = n),
          null == t.defaultValue &&
            e.defaultValue !== n &&
            (e.defaultValue = n)),
          null != r && (e.defaultValue = "" + r);
      }
      function nt(e) {
        var t = e.textContent;
        t === e._wrapperState.initialValue && (e.value = t);
      }
      function rt(e) {
        switch (e) {
          case "svg":
            return "http://www.w3.org/2000/svg";
          case "math":
            return "http://www.w3.org/1998/Math/MathML";
          default:
            return "http://www.w3.org/1999/xhtml";
        }
      }
      function it(e, t) {
        return null == e || "http://www.w3.org/1999/xhtml" === e
          ? rt(t)
          : "http://www.w3.org/2000/svg" === e && "foreignObject" === t
          ? "http://www.w3.org/1999/xhtml"
          : e;
      }
      function ot(e, t) {
        if (t) {
          var n = e.firstChild;
          if (n && n === e.lastChild && 3 === n.nodeType)
            return void (n.nodeValue = t);
        }
        e.textContent = t;
      }
      function st(e, t) {
        e = e.style;
        for (var n in t)
          if (t.hasOwnProperty(n)) {
            var r = 0 === n.indexOf("--"),
              i = n,
              o = t[n];
            (i =
              null == o || "boolean" == typeof o || "" === o
                ? ""
                : r ||
                  "number" != typeof o ||
                  0 === o ||
                  (Oo.hasOwnProperty(i) && Oo[i])
                ? ("" + o).trim()
                : o + "px"),
              "float" === n && (n = "cssFloat"),
              r ? e.setProperty(n, i) : (e[n] = i);
          }
      }
      function at(e, t) {
        t &&
          (Io[e] &&
            (null != t.children || null != t.dangerouslySetInnerHTML) &&
            i("137", e, ""),
          null != t.dangerouslySetInnerHTML &&
            (null != t.children && i("60"),
            ("object" == typeof t.dangerouslySetInnerHTML &&
              "__html" in t.dangerouslySetInnerHTML) ||
              i("61")),
          null != t.style && "object" != typeof t.style && i("62", ""));
      }
      function lt(e, t) {
        if (-1 === e.indexOf("-")) return "string" == typeof t.is;
        switch (e) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return !1;
          default:
            return !0;
        }
      }
      function ct(e, t) {
        e = 9 === e.nodeType || 11 === e.nodeType ? e : e.ownerDocument;
        var n = Ue(e);
        t = Dr[t];
        for (var r = 0; r < t.length; r++) {
          var i = t[r];
          if (!n.hasOwnProperty(i) || !n[i]) {
            switch (i) {
              case "scroll":
                Re("scroll", e);
                break;
              case "focus":
              case "blur":
                Re("focus", e), Re("blur", e), (n.blur = !0), (n.focus = !0);
                break;
              case "cancel":
              case "close":
                J(i) && Re(i, e);
                break;
              case "invalid":
              case "submit":
              case "reset":
                break;
              default:
                -1 === Kr.indexOf(i) && Fe(i, e);
            }
            n[i] = !0;
          }
        }
      }
      function ut() {}
      function pt(e, t) {
        switch (e) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            return !!t.autoFocus;
        }
        return !1;
      }
      function dt(e, t) {
        return (
          "textarea" === e ||
          "option" === e ||
          "noscript" === e ||
          "string" == typeof t.children ||
          "number" == typeof t.children ||
          ("object" == typeof t.dangerouslySetInnerHTML &&
            null !== t.dangerouslySetInnerHTML &&
            null != t.dangerouslySetInnerHTML.__html)
        );
      }
      function ht(e) {
        for (e = e.nextSibling; e && 1 !== e.nodeType && 3 !== e.nodeType; )
          e = e.nextSibling;
        return e;
      }
      function ft(e) {
        for (e = e.firstChild; e && 1 !== e.nodeType && 3 !== e.nodeType; )
          e = e.nextSibling;
        return e;
      }
      function mt(e) {
        0 > Mo || ((e.current = No[Mo]), (No[Mo] = null), Mo--);
      }
      function gt(e, t) {
        Mo++, (No[Mo] = e.current), (e.current = t);
      }
      function yt(e, t) {
        var n = e.type.contextTypes;
        if (!n) return jo;
        var r = e.stateNode;
        if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
          return r.__reactInternalMemoizedMaskedChildContext;
        var i,
          o = {};
        for (i in n) o[i] = t[i];
        return (
          r &&
            ((e = e.stateNode),
            (e.__reactInternalMemoizedUnmaskedChildContext = t),
            (e.__reactInternalMemoizedMaskedChildContext = o)),
          o
        );
      }
      function vt(e) {
        return null !== (e = e.childContextTypes) && void 0 !== e;
      }
      function bt(e) {
        mt(Fo, e), mt(zo, e);
      }
      function _t(e) {
        mt(Fo, e), mt(zo, e);
      }
      function wt(e, t, n) {
        zo.current !== jo && i("168"), gt(zo, t, e), gt(Fo, n, e);
      }
      function Ct(e, t, n) {
        var r = e.stateNode;
        if (((e = t.childContextTypes), "function" != typeof r.getChildContext))
          return n;
        r = r.getChildContext();
        for (var o in r) o in e || i("108", ne(t) || "Unknown", o);
        return _r({}, n, r);
      }
      function St(e) {
        var t = e.stateNode;
        return (
          (t = (t && t.__reactInternalMemoizedMergedChildContext) || jo),
          (Ro = zo.current),
          gt(zo, t, e),
          gt(Fo, Fo.current, e),
          !0
        );
      }
      function kt(e, t, n) {
        var r = e.stateNode;
        r || i("169"),
          n
            ? ((t = Ct(e, t, Ro)),
              (r.__reactInternalMemoizedMergedChildContext = t),
              mt(Fo, e),
              mt(zo, e),
              gt(zo, t, e))
            : mt(Fo, e),
          gt(Fo, n, e);
      }
      function xt(e) {
        return function (t) {
          try {
            return e(t);
          } catch (e) {}
        };
      }
      function Et(e) {
        if ("undefined" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) return !1;
        var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (t.isDisabled || !t.supportsFiber) return !0;
        try {
          var n = t.inject(e);
          (Bo = xt(function (e) {
            return t.onCommitFiberRoot(n, e);
          })),
            (Vo = xt(function (e) {
              return t.onCommitFiberUnmount(n, e);
            }));
        } catch (e) {}
        return !0;
      }
      function Tt(e, t, n, r) {
        (this.tag = e),
          (this.key = n),
          (this.sibling =
            this.child =
            this.return =
            this.stateNode =
            this.type =
              null),
          (this.index = 0),
          (this.ref = null),
          (this.pendingProps = t),
          (this.firstContextDependency =
            this.memoizedState =
            this.updateQueue =
            this.memoizedProps =
              null),
          (this.mode = r),
          (this.effectTag = 0),
          (this.lastEffect = this.firstEffect = this.nextEffect = null),
          (this.childExpirationTime = this.expirationTime = 0),
          (this.alternate = null);
      }
      function At(e) {
        return !(!(e = e.prototype) || !e.isReactComponent);
      }
      function Ot(e, t, n) {
        var r = e.alternate;
        return (
          null === r
            ? ((r = new Tt(e.tag, t, e.key, e.mode)),
              (r.type = e.type),
              (r.stateNode = e.stateNode),
              (r.alternate = e),
              (e.alternate = r))
            : ((r.pendingProps = t),
              (r.effectTag = 0),
              (r.nextEffect = null),
              (r.firstEffect = null),
              (r.lastEffect = null)),
          (r.childExpirationTime = e.childExpirationTime),
          (r.expirationTime = t !== e.pendingProps ? n : e.expirationTime),
          (r.child = e.child),
          (r.memoizedProps = e.memoizedProps),
          (r.memoizedState = e.memoizedState),
          (r.updateQueue = e.updateQueue),
          (r.firstContextDependency = e.firstContextDependency),
          (r.sibling = e.sibling),
          (r.index = e.index),
          (r.ref = e.ref),
          r
        );
      }
      function Pt(e, t, n) {
        var r = e.type,
          o = e.key;
        e = e.props;
        var s = void 0;
        if ("function" == typeof r) s = At(r) ? 2 : 4;
        else if ("string" == typeof r) s = 7;
        else
          e: switch (r) {
            case wi:
              return It(e.children, t, n, o);
            case Ei:
              (s = 10), (t |= 3);
              break;
            case Ci:
              (s = 10), (t |= 2);
              break;
            case Si:
              return (
                (r = new Tt(15, e, o, 4 | t)),
                (r.type = Si),
                (r.expirationTime = n),
                r
              );
            case Ai:
              s = 16;
              break;
            default:
              if ("object" == typeof r && null !== r)
                switch (r.$$typeof) {
                  case ki:
                    s = 12;
                    break e;
                  case xi:
                    s = 11;
                    break e;
                  case Ti:
                    s = 13;
                    break e;
                  default:
                    if ("function" == typeof r.then) {
                      s = 4;
                      break e;
                    }
                }
              i("130", null == r ? r : typeof r, "");
          }
        return (
          (t = new Tt(s, e, o, t)), (t.type = r), (t.expirationTime = n), t
        );
      }
      function It(e, t, n, r) {
        return (e = new Tt(9, e, r, t)), (e.expirationTime = n), e;
      }
      function Dt(e, t, n) {
        return (e = new Tt(8, e, null, t)), (e.expirationTime = n), e;
      }
      function Lt(e, t, n) {
        return (
          (t = new Tt(6, null !== e.children ? e.children : [], e.key, t)),
          (t.expirationTime = n),
          (t.stateNode = {
            containerInfo: e.containerInfo,
            pendingChildren: null,
            implementation: e.implementation,
          }),
          t
        );
      }
      function Nt(e, t) {
        e.didError = !1;
        var n = e.earliestPendingTime;
        0 === n
          ? (e.earliestPendingTime = e.latestPendingTime = t)
          : n > t
          ? (e.earliestPendingTime = t)
          : e.latestPendingTime < t && (e.latestPendingTime = t),
          Mt(t, e);
      }
      function Mt(e, t) {
        var n = t.earliestSuspendedTime,
          r = t.latestSuspendedTime,
          i = t.earliestPendingTime,
          o = t.latestPingedTime;
        (i = 0 !== i ? i : o),
          0 === i && (0 === e || r > e) && (i = r),
          (e = i),
          0 !== e && 0 !== n && n < e && (e = n),
          (t.nextExpirationTimeToWorkOn = i),
          (t.expirationTime = e);
      }
      function jt(e) {
        return {
          baseState: e,
          firstUpdate: null,
          lastUpdate: null,
          firstCapturedUpdate: null,
          lastCapturedUpdate: null,
          firstEffect: null,
          lastEffect: null,
          firstCapturedEffect: null,
          lastCapturedEffect: null,
        };
      }
      function zt(e) {
        return {
          baseState: e.baseState,
          firstUpdate: e.firstUpdate,
          lastUpdate: e.lastUpdate,
          firstCapturedUpdate: null,
          lastCapturedUpdate: null,
          firstEffect: null,
          lastEffect: null,
          firstCapturedEffect: null,
          lastCapturedEffect: null,
        };
      }
      function Ft(e) {
        return {
          expirationTime: e,
          tag: 0,
          payload: null,
          callback: null,
          next: null,
          nextEffect: null,
        };
      }
      function Rt(e, t) {
        null === e.lastUpdate
          ? (e.firstUpdate = e.lastUpdate = t)
          : ((e.lastUpdate.next = t), (e.lastUpdate = t));
      }
      function Bt(e, t) {
        var n = e.alternate;
        if (null === n) {
          var r = e.updateQueue,
            i = null;
          null === r && (r = e.updateQueue = jt(e.memoizedState));
        } else
          (r = e.updateQueue),
            (i = n.updateQueue),
            null === r
              ? null === i
                ? ((r = e.updateQueue = jt(e.memoizedState)),
                  (i = n.updateQueue = jt(n.memoizedState)))
                : (r = e.updateQueue = zt(i))
              : null === i && (i = n.updateQueue = zt(r));
        null === i || r === i
          ? Rt(r, t)
          : null === r.lastUpdate || null === i.lastUpdate
          ? (Rt(r, t), Rt(i, t))
          : (Rt(r, t), (i.lastUpdate = t));
      }
      function Vt(e, t) {
        var n = e.updateQueue;
        (n = null === n ? (e.updateQueue = jt(e.memoizedState)) : Ut(e, n)),
          null === n.lastCapturedUpdate
            ? (n.firstCapturedUpdate = n.lastCapturedUpdate = t)
            : ((n.lastCapturedUpdate.next = t), (n.lastCapturedUpdate = t));
      }
      function Ut(e, t) {
        var n = e.alternate;
        return (
          null !== n && t === n.updateQueue && (t = e.updateQueue = zt(t)), t
        );
      }
      function qt(e, t, n, r, i, o) {
        switch (n.tag) {
          case 1:
            return (
              (e = n.payload), "function" == typeof e ? e.call(o, r, i) : e
            );
          case 3:
            e.effectTag = (-1025 & e.effectTag) | 64;
          case 0:
            if (
              ((e = n.payload),
              null === (i = "function" == typeof e ? e.call(o, r, i) : e) ||
                void 0 === i)
            )
              break;
            return _r({}, r, i);
          case 2:
            Uo = !0;
        }
        return r;
      }
      function Ht(e, t, n, r, i) {
        (Uo = !1), (t = Ut(e, t));
        for (
          var o = t.baseState, s = null, a = 0, l = t.firstUpdate, c = o;
          null !== l;

        ) {
          var u = l.expirationTime;
          u > i
            ? (null === s && ((s = l), (o = c)), (0 === a || a > u) && (a = u))
            : ((c = qt(e, t, l, c, n, r)),
              null !== l.callback &&
                ((e.effectTag |= 32),
                (l.nextEffect = null),
                null === t.lastEffect
                  ? (t.firstEffect = t.lastEffect = l)
                  : ((t.lastEffect.nextEffect = l), (t.lastEffect = l)))),
            (l = l.next);
        }
        for (u = null, l = t.firstCapturedUpdate; null !== l; ) {
          var p = l.expirationTime;
          p > i
            ? (null === u && ((u = l), null === s && (o = c)),
              (0 === a || a > p) && (a = p))
            : ((c = qt(e, t, l, c, n, r)),
              null !== l.callback &&
                ((e.effectTag |= 32),
                (l.nextEffect = null),
                null === t.lastCapturedEffect
                  ? (t.firstCapturedEffect = t.lastCapturedEffect = l)
                  : ((t.lastCapturedEffect.nextEffect = l),
                    (t.lastCapturedEffect = l)))),
            (l = l.next);
        }
        null === s && (t.lastUpdate = null),
          null === u ? (t.lastCapturedUpdate = null) : (e.effectTag |= 32),
          null === s && null === u && (o = c),
          (t.baseState = o),
          (t.firstUpdate = s),
          (t.firstCapturedUpdate = u),
          (e.expirationTime = a),
          (e.memoizedState = c);
      }
      function Wt(e, t, n) {
        null !== t.firstCapturedUpdate &&
          (null !== t.lastUpdate &&
            ((t.lastUpdate.next = t.firstCapturedUpdate),
            (t.lastUpdate = t.lastCapturedUpdate)),
          (t.firstCapturedUpdate = t.lastCapturedUpdate = null)),
          $t(t.firstEffect, n),
          (t.firstEffect = t.lastEffect = null),
          $t(t.firstCapturedEffect, n),
          (t.firstCapturedEffect = t.lastCapturedEffect = null);
      }
      function $t(e, t) {
        for (; null !== e; ) {
          var n = e.callback;
          if (null !== n) {
            e.callback = null;
            var r = t;
            "function" != typeof n && i("191", n), n.call(r);
          }
          e = e.nextEffect;
        }
      }
      function Gt(e, t) {
        return { value: e, source: t, stack: re(t) };
      }
      function Zt(e, t) {
        var n = e.type._context;
        gt(qo, n._currentValue, e), (n._currentValue = t);
      }
      function Kt(e) {
        var t = qo.current;
        mt(qo, e), (e.type._context._currentValue = t);
      }
      function Jt(e) {
        (Ho = e), ($o = Wo = null), (e.firstContextDependency = null);
      }
      function Yt(e, t) {
        return (
          $o !== e &&
            !1 !== t &&
            0 !== t &&
            (("number" == typeof t && 1073741823 !== t) ||
              (($o = e), (t = 1073741823)),
            (t = { context: e, observedBits: t, next: null }),
            null === Wo
              ? (null === Ho && i("277"), (Ho.firstContextDependency = Wo = t))
              : (Wo = Wo.next = t)),
          e._currentValue
        );
      }
      function Xt(e) {
        return e === Go && i("174"), e;
      }
      function Qt(e, t) {
        gt(Jo, t, e), gt(Ko, e, e), gt(Zo, Go, e);
        var n = t.nodeType;
        switch (n) {
          case 9:
          case 11:
            t = (t = t.documentElement) ? t.namespaceURI : it(null, "");
            break;
          default:
            (n = 8 === n ? t.parentNode : t),
              (t = n.namespaceURI || null),
              (n = n.tagName),
              (t = it(t, n));
        }
        mt(Zo, e), gt(Zo, t, e);
      }
      function en(e) {
        mt(Zo, e), mt(Ko, e), mt(Jo, e);
      }
      function tn(e) {
        Xt(Jo.current);
        var t = Xt(Zo.current),
          n = it(t, e.type);
        t !== n && (gt(Ko, e, e), gt(Zo, n, e));
      }
      function nn(e) {
        Ko.current === e && (mt(Zo, e), mt(Ko, e));
      }
      function rn(e, t, n, r) {
        (t = e.memoizedState),
          (n = n(r, t)),
          (n = null === n || void 0 === n ? t : _r({}, t, n)),
          (e.memoizedState = n),
          null !== (r = e.updateQueue) &&
            0 === e.expirationTime &&
            (r.baseState = n);
      }
      function on(e, t, n, r, i, o, s) {
        return (
          (e = e.stateNode),
          "function" == typeof e.shouldComponentUpdate
            ? e.shouldComponentUpdate(r, o, s)
            : !t.prototype ||
              !t.prototype.isPureReactComponent ||
              !Pe(n, r) ||
              !Pe(i, o)
        );
      }
      function sn(e, t, n, r) {
        (e = t.state),
          "function" == typeof t.componentWillReceiveProps &&
            t.componentWillReceiveProps(n, r),
          "function" == typeof t.UNSAFE_componentWillReceiveProps &&
            t.UNSAFE_componentWillReceiveProps(n, r),
          t.state !== e && Xo.enqueueReplaceState(t, t.state, null);
      }
      function an(e, t, n, r) {
        var i = e.stateNode,
          o = vt(t) ? Ro : zo.current;
        (i.props = n),
          (i.state = e.memoizedState),
          (i.refs = Yo),
          (i.context = yt(e, o)),
          (o = e.updateQueue),
          null !== o && (Ht(e, o, n, i, r), (i.state = e.memoizedState)),
          (o = t.getDerivedStateFromProps),
          "function" == typeof o &&
            (rn(e, t, o, n), (i.state = e.memoizedState)),
          "function" == typeof t.getDerivedStateFromProps ||
            "function" == typeof i.getSnapshotBeforeUpdate ||
            ("function" != typeof i.UNSAFE_componentWillMount &&
              "function" != typeof i.componentWillMount) ||
            ((t = i.state),
            "function" == typeof i.componentWillMount && i.componentWillMount(),
            "function" == typeof i.UNSAFE_componentWillMount &&
              i.UNSAFE_componentWillMount(),
            t !== i.state && Xo.enqueueReplaceState(i, i.state, null),
            null !== (o = e.updateQueue) &&
              (Ht(e, o, n, i, r), (i.state = e.memoizedState))),
          "function" == typeof i.componentDidMount && (e.effectTag |= 4);
      }
      function ln(e, t, n) {
        if (
          null !== (e = n.ref) &&
          "function" != typeof e &&
          "object" != typeof e
        ) {
          if (n._owner) {
            n = n._owner;
            var r = void 0;
            n && (2 !== n.tag && 3 !== n.tag && i("110"), (r = n.stateNode)),
              r || i("147", e);
            var o = "" + e;
            return null !== t &&
              null !== t.ref &&
              "function" == typeof t.ref &&
              t.ref._stringRef === o
              ? t.ref
              : ((t = function (e) {
                  var t = r.refs;
                  t === Yo && (t = r.refs = {}),
                    null === e ? delete t[o] : (t[o] = e);
                }),
                (t._stringRef = o),
                t);
          }
          "string" != typeof e && i("284"), n._owner || i("254", e);
        }
        return e;
      }
      function cn(e, t) {
        "textarea" !== e.type &&
          i(
            "31",
            "[object Object]" === Object.prototype.toString.call(t)
              ? "object with keys {" + Object.keys(t).join(", ") + "}"
              : t,
            "",
          );
      }
      function un(e) {
        function t(t, n) {
          if (e) {
            var r = t.lastEffect;
            null !== r
              ? ((r.nextEffect = n), (t.lastEffect = n))
              : (t.firstEffect = t.lastEffect = n),
              (n.nextEffect = null),
              (n.effectTag = 8);
          }
        }
        function n(n, r) {
          if (!e) return null;
          for (; null !== r; ) t(n, r), (r = r.sibling);
          return null;
        }
        function r(e, t) {
          for (e = new Map(); null !== t; )
            null !== t.key ? e.set(t.key, t) : e.set(t.index, t),
              (t = t.sibling);
          return e;
        }
        function o(e, t, n) {
          return (e = Ot(e, t, n)), (e.index = 0), (e.sibling = null), e;
        }
        function s(t, n, r) {
          return (
            (t.index = r),
            e
              ? null !== (r = t.alternate)
                ? ((r = r.index), r < n ? ((t.effectTag = 2), n) : r)
                : ((t.effectTag = 2), n)
              : n
          );
        }
        function a(t) {
          return e && null === t.alternate && (t.effectTag = 2), t;
        }
        function l(e, t, n, r) {
          return null === t || 8 !== t.tag
            ? ((t = Dt(n, e.mode, r)), (t.return = e), t)
            : ((t = o(t, n, r)), (t.return = e), t);
        }
        function c(e, t, n, r) {
          return null !== t && t.type === n.type
            ? ((r = o(t, n.props, r)), (r.ref = ln(e, t, n)), (r.return = e), r)
            : ((r = Pt(n, e.mode, r)),
              (r.ref = ln(e, t, n)),
              (r.return = e),
              r);
        }
        function u(e, t, n, r) {
          return null === t ||
            6 !== t.tag ||
            t.stateNode.containerInfo !== n.containerInfo ||
            t.stateNode.implementation !== n.implementation
            ? ((t = Lt(n, e.mode, r)), (t.return = e), t)
            : ((t = o(t, n.children || [], r)), (t.return = e), t);
        }
        function p(e, t, n, r, i) {
          return null === t || 9 !== t.tag
            ? ((t = It(n, e.mode, r, i)), (t.return = e), t)
            : ((t = o(t, n, r)), (t.return = e), t);
        }
        function d(e, t, n) {
          if ("string" == typeof t || "number" == typeof t)
            return (t = Dt("" + t, e.mode, n)), (t.return = e), t;
          if ("object" == typeof t && null !== t) {
            switch (t.$$typeof) {
              case bi:
                return (
                  (n = Pt(t, e.mode, n)),
                  (n.ref = ln(e, null, t)),
                  (n.return = e),
                  n
                );
              case _i:
                return (t = Lt(t, e.mode, n)), (t.return = e), t;
            }
            if (Qo(t) || te(t))
              return (t = It(t, e.mode, n, null)), (t.return = e), t;
            cn(e, t);
          }
          return null;
        }
        function h(e, t, n, r) {
          var i = null !== t ? t.key : null;
          if ("string" == typeof n || "number" == typeof n)
            return null !== i ? null : l(e, t, "" + n, r);
          if ("object" == typeof n && null !== n) {
            switch (n.$$typeof) {
              case bi:
                return n.key === i
                  ? n.type === wi
                    ? p(e, t, n.props.children, r, i)
                    : c(e, t, n, r)
                  : null;
              case _i:
                return n.key === i ? u(e, t, n, r) : null;
            }
            if (Qo(n) || te(n)) return null !== i ? null : p(e, t, n, r, null);
            cn(e, n);
          }
          return null;
        }
        function f(e, t, n, r, i) {
          if ("string" == typeof r || "number" == typeof r)
            return (e = e.get(n) || null), l(t, e, "" + r, i);
          if ("object" == typeof r && null !== r) {
            switch (r.$$typeof) {
              case bi:
                return (
                  (e = e.get(null === r.key ? n : r.key) || null),
                  r.type === wi
                    ? p(t, e, r.props.children, i, r.key)
                    : c(t, e, r, i)
                );
              case _i:
                return (
                  (e = e.get(null === r.key ? n : r.key) || null), u(t, e, r, i)
                );
            }
            if (Qo(r) || te(r))
              return (e = e.get(n) || null), p(t, e, r, i, null);
            cn(t, r);
          }
          return null;
        }
        function m(i, o, a, l) {
          for (
            var c = null, u = null, p = o, m = (o = 0), g = null;
            null !== p && m < a.length;
            m++
          ) {
            p.index > m ? ((g = p), (p = null)) : (g = p.sibling);
            var y = h(i, p, a[m], l);
            if (null === y) {
              null === p && (p = g);
              break;
            }
            e && p && null === y.alternate && t(i, p),
              (o = s(y, o, m)),
              null === u ? (c = y) : (u.sibling = y),
              (u = y),
              (p = g);
          }
          if (m === a.length) return n(i, p), c;
          if (null === p) {
            for (; m < a.length; m++)
              (p = d(i, a[m], l)) &&
                ((o = s(p, o, m)),
                null === u ? (c = p) : (u.sibling = p),
                (u = p));
            return c;
          }
          for (p = r(i, p); m < a.length; m++)
            (g = f(p, i, m, a[m], l)) &&
              (e &&
                null !== g.alternate &&
                p.delete(null === g.key ? m : g.key),
              (o = s(g, o, m)),
              null === u ? (c = g) : (u.sibling = g),
              (u = g));
          return (
            e &&
              p.forEach(function (e) {
                return t(i, e);
              }),
            c
          );
        }
        function g(o, a, l, c) {
          var u = te(l);
          "function" != typeof u && i("150"),
            null == (l = u.call(l)) && i("151");
          for (
            var p = (u = null), m = a, g = (a = 0), y = null, v = l.next();
            null !== m && !v.done;
            g++, v = l.next()
          ) {
            m.index > g ? ((y = m), (m = null)) : (y = m.sibling);
            var b = h(o, m, v.value, c);
            if (null === b) {
              m || (m = y);
              break;
            }
            e && m && null === b.alternate && t(o, m),
              (a = s(b, a, g)),
              null === p ? (u = b) : (p.sibling = b),
              (p = b),
              (m = y);
          }
          if (v.done) return n(o, m), u;
          if (null === m) {
            for (; !v.done; g++, v = l.next())
              null !== (v = d(o, v.value, c)) &&
                ((a = s(v, a, g)),
                null === p ? (u = v) : (p.sibling = v),
                (p = v));
            return u;
          }
          for (m = r(o, m); !v.done; g++, v = l.next())
            null !== (v = f(m, o, g, v.value, c)) &&
              (e &&
                null !== v.alternate &&
                m.delete(null === v.key ? g : v.key),
              (a = s(v, a, g)),
              null === p ? (u = v) : (p.sibling = v),
              (p = v));
          return (
            e &&
              m.forEach(function (e) {
                return t(o, e);
              }),
            u
          );
        }
        return function (e, r, s, l) {
          var c =
            "object" == typeof s &&
            null !== s &&
            s.type === wi &&
            null === s.key;
          c && (s = s.props.children);
          var u = "object" == typeof s && null !== s;
          if (u)
            switch (s.$$typeof) {
              case bi:
                e: {
                  for (u = s.key, c = r; null !== c; ) {
                    if (c.key === u) {
                      if (9 === c.tag ? s.type === wi : c.type === s.type) {
                        n(e, c.sibling),
                          (r = o(
                            c,
                            s.type === wi ? s.props.children : s.props,
                            l,
                          )),
                          (r.ref = ln(e, c, s)),
                          (r.return = e),
                          (e = r);
                        break e;
                      }
                      n(e, c);
                      break;
                    }
                    t(e, c), (c = c.sibling);
                  }
                  s.type === wi
                    ? ((r = It(s.props.children, e.mode, l, s.key)),
                      (r.return = e),
                      (e = r))
                    : ((l = Pt(s, e.mode, l)),
                      (l.ref = ln(e, r, s)),
                      (l.return = e),
                      (e = l));
                }
                return a(e);
              case _i:
                e: {
                  for (c = s.key; null !== r; ) {
                    if (r.key === c) {
                      if (
                        6 === r.tag &&
                        r.stateNode.containerInfo === s.containerInfo &&
                        r.stateNode.implementation === s.implementation
                      ) {
                        n(e, r.sibling),
                          (r = o(r, s.children || [], l)),
                          (r.return = e),
                          (e = r);
                        break e;
                      }
                      n(e, r);
                      break;
                    }
                    t(e, r), (r = r.sibling);
                  }
                  (r = Lt(s, e.mode, l)), (r.return = e), (e = r);
                }
                return a(e);
            }
          if ("string" == typeof s || "number" == typeof s)
            return (
              (s = "" + s),
              null !== r && 8 === r.tag
                ? (n(e, r.sibling), (r = o(r, s, l)), (r.return = e), (e = r))
                : (n(e, r), (r = Dt(s, e.mode, l)), (r.return = e), (e = r)),
              a(e)
            );
          if (Qo(s)) return m(e, r, s, l);
          if (te(s)) return g(e, r, s, l);
          if ((u && cn(e, s), void 0 === s && !c))
            switch (e.tag) {
              case 2:
              case 3:
              case 0:
                (l = e.type), i("152", l.displayName || l.name || "Component");
            }
          return n(e, r);
        };
      }
      function pn(e, t) {
        var n = new Tt(7, null, null, 0);
        (n.type = "DELETED"),
          (n.stateNode = t),
          (n.return = e),
          (n.effectTag = 8),
          null !== e.lastEffect
            ? ((e.lastEffect.nextEffect = n), (e.lastEffect = n))
            : (e.firstEffect = e.lastEffect = n);
      }
      function dn(e, t) {
        switch (e.tag) {
          case 7:
            var n = e.type;
            return (
              null !==
                (t =
                  1 !== t.nodeType ||
                  n.toLowerCase() !== t.nodeName.toLowerCase()
                    ? null
                    : t) && ((e.stateNode = t), !0)
            );
          case 8:
            return (
              null !==
                (t = "" === e.pendingProps || 3 !== t.nodeType ? null : t) &&
              ((e.stateNode = t), !0)
            );
          default:
            return !1;
        }
      }
      function hn(e) {
        if (is) {
          var t = rs;
          if (t) {
            var n = t;
            if (!dn(e, t)) {
              if (!(t = ht(n)) || !dn(e, t))
                return (e.effectTag |= 2), (is = !1), void (ns = e);
              pn(ns, n);
            }
            (ns = e), (rs = ft(t));
          } else (e.effectTag |= 2), (is = !1), (ns = e);
        }
      }
      function fn(e) {
        for (e = e.return; null !== e && 7 !== e.tag && 5 !== e.tag; )
          e = e.return;
        ns = e;
      }
      function mn(e) {
        if (e !== ns) return !1;
        if (!is) return fn(e), (is = !0), !1;
        var t = e.type;
        if (
          7 !== e.tag ||
          ("head" !== t && "body" !== t && !dt(t, e.memoizedProps))
        )
          for (t = rs; t; ) pn(e, t), (t = ht(t));
        return fn(e), (rs = ns ? ht(e.stateNode) : null), !0;
      }
      function gn() {
        (rs = ns = null), (is = !1);
      }
      function yn(e) {
        switch (e._reactStatus) {
          case 1:
            return e._reactResult;
          case 2:
            throw e._reactResult;
          case 0:
            throw e;
          default:
            throw (
              ((e._reactStatus = 0),
              e.then(
                function (t) {
                  if (0 === e._reactStatus) {
                    if (
                      ((e._reactStatus = 1), "object" == typeof t && null !== t)
                    ) {
                      var n = t.default;
                      t = void 0 !== n && null !== n ? n : t;
                    }
                    e._reactResult = t;
                  }
                },
                function (t) {
                  0 === e._reactStatus &&
                    ((e._reactStatus = 2), (e._reactResult = t));
                },
              ),
              e)
            );
        }
      }
      function vn(e, t, n, r) {
        t.child = null === e ? ts(t, null, n, r) : es(t, e.child, n, r);
      }
      function bn(e, t, n, r, i) {
        n = n.render;
        var o = t.ref;
        return Fo.current ||
          t.memoizedProps !== r ||
          o !== (null !== e ? e.ref : null)
          ? ((n = n(r, o)), vn(e, t, n, i), (t.memoizedProps = r), t.child)
          : Tn(e, t, i);
      }
      function _n(e, t) {
        var n = t.ref;
        ((null === e && null !== n) || (null !== e && e.ref !== n)) &&
          (t.effectTag |= 128);
      }
      function wn(e, t, n, r, i) {
        var o = vt(n) ? Ro : zo.current;
        return (
          (o = yt(t, o)),
          Jt(t, i),
          (n = n(r, o)),
          (t.effectTag |= 1),
          vn(e, t, n, i),
          (t.memoizedProps = r),
          t.child
        );
      }
      function Cn(e, t, n, r, i) {
        if (vt(n)) {
          var o = !0;
          St(t);
        } else o = !1;
        if ((Jt(t, i), null === e))
          if (null === t.stateNode) {
            var s = vt(n) ? Ro : zo.current,
              a = n.contextTypes,
              l = null !== a && void 0 !== a;
            a = l ? yt(t, s) : jo;
            var c = new n(r, a);
            (t.memoizedState =
              null !== c.state && void 0 !== c.state ? c.state : null),
              (c.updater = Xo),
              (t.stateNode = c),
              (c._reactInternalFiber = t),
              l &&
                ((l = t.stateNode),
                (l.__reactInternalMemoizedUnmaskedChildContext = s),
                (l.__reactInternalMemoizedMaskedChildContext = a)),
              an(t, n, r, i),
              (r = !0);
          } else {
            (s = t.stateNode), (a = t.memoizedProps), (s.props = a);
            var u = s.context;
            (l = vt(n) ? Ro : zo.current), (l = yt(t, l));
            var p = n.getDerivedStateFromProps;
            (c =
              "function" == typeof p ||
              "function" == typeof s.getSnapshotBeforeUpdate) ||
              ("function" != typeof s.UNSAFE_componentWillReceiveProps &&
                "function" != typeof s.componentWillReceiveProps) ||
              ((a !== r || u !== l) && sn(t, s, r, l)),
              (Uo = !1);
            var d = t.memoizedState;
            u = s.state = d;
            var h = t.updateQueue;
            null !== h && (Ht(t, h, r, s, i), (u = t.memoizedState)),
              a !== r || d !== u || Fo.current || Uo
                ? ("function" == typeof p &&
                    (rn(t, n, p, r), (u = t.memoizedState)),
                  (a = Uo || on(t, n, a, r, d, u, l))
                    ? (c ||
                        ("function" != typeof s.UNSAFE_componentWillMount &&
                          "function" != typeof s.componentWillMount) ||
                        ("function" == typeof s.componentWillMount &&
                          s.componentWillMount(),
                        "function" == typeof s.UNSAFE_componentWillMount &&
                          s.UNSAFE_componentWillMount()),
                      "function" == typeof s.componentDidMount &&
                        (t.effectTag |= 4))
                    : ("function" == typeof s.componentDidMount &&
                        (t.effectTag |= 4),
                      (t.memoizedProps = r),
                      (t.memoizedState = u)),
                  (s.props = r),
                  (s.state = u),
                  (s.context = l),
                  (r = a))
                : ("function" == typeof s.componentDidMount &&
                    (t.effectTag |= 4),
                  (r = !1));
          }
        else
          (s = t.stateNode),
            (a = t.memoizedProps),
            (s.props = a),
            (u = s.context),
            (l = vt(n) ? Ro : zo.current),
            (l = yt(t, l)),
            (p = n.getDerivedStateFromProps),
            (c =
              "function" == typeof p ||
              "function" == typeof s.getSnapshotBeforeUpdate) ||
              ("function" != typeof s.UNSAFE_componentWillReceiveProps &&
                "function" != typeof s.componentWillReceiveProps) ||
              ((a !== r || u !== l) && sn(t, s, r, l)),
            (Uo = !1),
            (u = t.memoizedState),
            (d = s.state = u),
            (h = t.updateQueue),
            null !== h && (Ht(t, h, r, s, i), (d = t.memoizedState)),
            a !== r || u !== d || Fo.current || Uo
              ? ("function" == typeof p &&
                  (rn(t, n, p, r), (d = t.memoizedState)),
                (p = Uo || on(t, n, a, r, u, d, l))
                  ? (c ||
                      ("function" != typeof s.UNSAFE_componentWillUpdate &&
                        "function" != typeof s.componentWillUpdate) ||
                      ("function" == typeof s.componentWillUpdate &&
                        s.componentWillUpdate(r, d, l),
                      "function" == typeof s.UNSAFE_componentWillUpdate &&
                        s.UNSAFE_componentWillUpdate(r, d, l)),
                    "function" == typeof s.componentDidUpdate &&
                      (t.effectTag |= 4),
                    "function" == typeof s.getSnapshotBeforeUpdate &&
                      (t.effectTag |= 256))
                  : ("function" != typeof s.componentDidUpdate ||
                      (a === e.memoizedProps && u === e.memoizedState) ||
                      (t.effectTag |= 4),
                    "function" != typeof s.getSnapshotBeforeUpdate ||
                      (a === e.memoizedProps && u === e.memoizedState) ||
                      (t.effectTag |= 256),
                    (t.memoizedProps = r),
                    (t.memoizedState = d)),
                (s.props = r),
                (s.state = d),
                (s.context = l),
                (r = p))
              : ("function" != typeof s.componentDidUpdate ||
                  (a === e.memoizedProps && u === e.memoizedState) ||
                  (t.effectTag |= 4),
                "function" != typeof s.getSnapshotBeforeUpdate ||
                  (a === e.memoizedProps && u === e.memoizedState) ||
                  (t.effectTag |= 256),
                (r = !1));
        return Sn(e, t, n, r, o, i);
      }
      function Sn(e, t, n, r, i, o) {
        _n(e, t);
        var s = 0 != (64 & t.effectTag);
        if (!r && !s) return i && kt(t, n, !1), Tn(e, t, o);
        (r = t.stateNode), (os.current = t);
        var a = s ? null : r.render();
        return (
          (t.effectTag |= 1),
          null !== e && s && (vn(e, t, null, o), (t.child = null)),
          vn(e, t, a, o),
          (t.memoizedState = r.state),
          (t.memoizedProps = r.props),
          i && kt(t, n, !0),
          t.child
        );
      }
      function kn(e) {
        var t = e.stateNode;
        t.pendingContext
          ? wt(e, t.pendingContext, t.pendingContext !== t.context)
          : t.context && wt(e, t.context, !1),
          Qt(e, t.containerInfo);
      }
      function xn(e, t) {
        if (e && e.defaultProps) {
          (t = _r({}, t)), (e = e.defaultProps);
          for (var n in e) void 0 === t[n] && (t[n] = e[n]);
        }
        return t;
      }
      function En(e, t, n, r) {
        null !== e && i("155");
        var o = t.pendingProps;
        if ("object" == typeof n && null !== n && "function" == typeof n.then) {
          n = yn(n);
          var s = n;
          (s =
            "function" == typeof s
              ? At(s)
                ? 3
                : 1
              : void 0 !== s && null !== s && s.$$typeof
              ? 14
              : 4),
            (s = t.tag = s);
          var a = xn(n, o);
          switch (s) {
            case 1:
              return wn(e, t, n, a, r);
            case 3:
              return Cn(e, t, n, a, r);
            case 14:
              return bn(e, t, n, a, r);
            default:
              i("283", n);
          }
        }
        if (
          ((s = yt(t, zo.current)),
          Jt(t, r),
          (s = n(o, s)),
          (t.effectTag |= 1),
          "object" == typeof s &&
            null !== s &&
            "function" == typeof s.render &&
            void 0 === s.$$typeof)
        ) {
          (t.tag = 2),
            vt(n) ? ((a = !0), St(t)) : (a = !1),
            (t.memoizedState =
              null !== s.state && void 0 !== s.state ? s.state : null);
          var l = n.getDerivedStateFromProps;
          return (
            "function" == typeof l && rn(t, n, l, o),
            (s.updater = Xo),
            (t.stateNode = s),
            (s._reactInternalFiber = t),
            an(t, n, o, r),
            Sn(e, t, n, !0, a, r)
          );
        }
        return (t.tag = 0), vn(e, t, s, r), (t.memoizedProps = o), t.child;
      }
      function Tn(e, t, n) {
        null !== e && (t.firstContextDependency = e.firstContextDependency);
        var r = t.childExpirationTime;
        if (0 === r || r > n) return null;
        if ((null !== e && t.child !== e.child && i("153"), null !== t.child)) {
          for (
            e = t.child,
              n = Ot(e, e.pendingProps, e.expirationTime),
              t.child = n,
              n.return = t;
            null !== e.sibling;

          )
            (e = e.sibling),
              (n = n.sibling = Ot(e, e.pendingProps, e.expirationTime)),
              (n.return = t);
          n.sibling = null;
        }
        return t.child;
      }
      function An(e, t, n) {
        var r = t.expirationTime;
        if (!Fo.current && (0 === r || r > n)) {
          switch (t.tag) {
            case 5:
              kn(t), gn();
              break;
            case 7:
              tn(t);
              break;
            case 2:
              vt(t.type) && St(t);
              break;
            case 3:
              vt(t.type._reactResult) && St(t);
              break;
            case 6:
              Qt(t, t.stateNode.containerInfo);
              break;
            case 12:
              Zt(t, t.memoizedProps.value);
          }
          return Tn(e, t, n);
        }
        switch (((t.expirationTime = 0), t.tag)) {
          case 4:
            return En(e, t, t.type, n);
          case 0:
            return wn(e, t, t.type, t.pendingProps, n);
          case 1:
            var o = t.type._reactResult;
            return (
              (r = t.pendingProps),
              (e = wn(e, t, o, xn(o, r), n)),
              (t.memoizedProps = r),
              e
            );
          case 2:
            return Cn(e, t, t.type, t.pendingProps, n);
          case 3:
            return (
              (o = t.type._reactResult),
              (r = t.pendingProps),
              (e = Cn(e, t, o, xn(o, r), n)),
              (t.memoizedProps = r),
              e
            );
          case 5:
            return (
              kn(t),
              (r = t.updateQueue),
              null === r && i("282"),
              (o = t.memoizedState),
              (o = null !== o ? o.element : null),
              Ht(t, r, t.pendingProps, null, n),
              (r = t.memoizedState.element),
              r === o
                ? (gn(), (t = Tn(e, t, n)))
                : ((o = t.stateNode),
                  (o = (null === e || null === e.child) && o.hydrate) &&
                    ((rs = ft(t.stateNode.containerInfo)),
                    (ns = t),
                    (o = is = !0)),
                  o
                    ? ((t.effectTag |= 2), (t.child = ts(t, null, r, n)))
                    : (vn(e, t, r, n), gn()),
                  (t = t.child)),
              t
            );
          case 7:
            tn(t), null === e && hn(t), (r = t.type), (o = t.pendingProps);
            var s = null !== e ? e.memoizedProps : null,
              a = o.children;
            return (
              dt(r, o)
                ? (a = null)
                : null !== s && dt(r, s) && (t.effectTag |= 16),
              _n(e, t),
              1073741823 !== n && 1 & t.mode && o.hidden
                ? ((t.expirationTime = 1073741823),
                  (t.memoizedProps = o),
                  (t = null))
                : (vn(e, t, a, n), (t.memoizedProps = o), (t = t.child)),
              t
            );
          case 8:
            return (
              null === e && hn(t), (t.memoizedProps = t.pendingProps), null
            );
          case 16:
            return null;
          case 6:
            return (
              Qt(t, t.stateNode.containerInfo),
              (r = t.pendingProps),
              null === e ? (t.child = es(t, null, r, n)) : vn(e, t, r, n),
              (t.memoizedProps = r),
              t.child
            );
          case 13:
            return bn(e, t, t.type, t.pendingProps, n);
          case 14:
            return (
              (o = t.type._reactResult),
              (r = t.pendingProps),
              (e = bn(e, t, o, xn(o, r), n)),
              (t.memoizedProps = r),
              e
            );
          case 9:
            return (
              (r = t.pendingProps),
              vn(e, t, r, n),
              (t.memoizedProps = r),
              t.child
            );
          case 10:
            return (
              (r = t.pendingProps.children),
              vn(e, t, r, n),
              (t.memoizedProps = r),
              t.child
            );
          case 15:
            return (
              (r = t.pendingProps),
              vn(e, t, r.children, n),
              (t.memoizedProps = r),
              t.child
            );
          case 12:
            e: {
              if (
                ((r = t.type._context),
                (o = t.pendingProps),
                (a = t.memoizedProps),
                (s = o.value),
                (t.memoizedProps = o),
                Zt(t, s),
                null !== a)
              ) {
                var l = a.value;
                if (
                  0 ===
                  (s =
                    (l === s && (0 !== l || 1 / l == 1 / s)) ||
                    (l !== l && s !== s)
                      ? 0
                      : 0 |
                        ("function" == typeof r._calculateChangedBits
                          ? r._calculateChangedBits(l, s)
                          : 1073741823))
                ) {
                  if (a.children === o.children && !Fo.current) {
                    t = Tn(e, t, n);
                    break e;
                  }
                } else
                  for (null !== (a = t.child) && (a.return = t); null !== a; ) {
                    if (null !== (l = a.firstContextDependency))
                      do {
                        if (l.context === r && 0 != (l.observedBits & s)) {
                          if (2 === a.tag || 3 === a.tag) {
                            var c = Ft(n);
                            (c.tag = 2), Bt(a, c);
                          }
                          (0 === a.expirationTime || a.expirationTime > n) &&
                            (a.expirationTime = n),
                            (c = a.alternate),
                            null !== c &&
                              (0 === c.expirationTime ||
                                c.expirationTime > n) &&
                              (c.expirationTime = n);
                          for (var u = a.return; null !== u; ) {
                            if (
                              ((c = u.alternate),
                              0 === u.childExpirationTime ||
                                u.childExpirationTime > n)
                            )
                              (u.childExpirationTime = n),
                                null !== c &&
                                  (0 === c.childExpirationTime ||
                                    c.childExpirationTime > n) &&
                                  (c.childExpirationTime = n);
                            else {
                              if (
                                null === c ||
                                !(
                                  0 === c.childExpirationTime ||
                                  c.childExpirationTime > n
                                )
                              )
                                break;
                              c.childExpirationTime = n;
                            }
                            u = u.return;
                          }
                        }
                        (c = a.child), (l = l.next);
                      } while (null !== l);
                    else c = 12 === a.tag && a.type === t.type ? null : a.child;
                    if (null !== c) c.return = a;
                    else
                      for (c = a; null !== c; ) {
                        if (c === t) {
                          c = null;
                          break;
                        }
                        if (null !== (a = c.sibling)) {
                          (a.return = c.return), (c = a);
                          break;
                        }
                        c = c.return;
                      }
                    a = c;
                  }
              }
              vn(e, t, o.children, n), (t = t.child);
            }
            return t;
          case 11:
            return (
              (s = t.type),
              (r = t.pendingProps),
              (o = r.children),
              Jt(t, n),
              (s = Yt(s, r.unstable_observedBits)),
              (o = o(s)),
              (t.effectTag |= 1),
              vn(e, t, o, n),
              (t.memoizedProps = r),
              t.child
            );
          default:
            i("156");
        }
      }
      function On(e) {
        e.effectTag |= 4;
      }
      function Pn(e, t) {
        var n = t.source,
          r = t.stack;
        null === r && null !== n && (r = re(n)),
          null !== n && ne(n.type),
          (t = t.value),
          null !== e && 2 === e.tag && ne(e.type);
        try {
          console.error(t);
        } catch (e) {
          setTimeout(function () {
            throw e;
          });
        }
      }
      function In(e) {
        var t = e.ref;
        if (null !== t)
          if ("function" == typeof t)
            try {
              t(null);
            } catch (t) {
              Hn(e, t);
            }
          else t.current = null;
      }
      function Dn(e) {
        switch (("function" == typeof Vo && Vo(e), e.tag)) {
          case 2:
          case 3:
            In(e);
            var t = e.stateNode;
            if ("function" == typeof t.componentWillUnmount)
              try {
                (t.props = e.memoizedProps),
                  (t.state = e.memoizedState),
                  t.componentWillUnmount();
              } catch (t) {
                Hn(e, t);
              }
            break;
          case 7:
            In(e);
            break;
          case 6:
            Mn(e);
        }
      }
      function Ln(e) {
        return 7 === e.tag || 5 === e.tag || 6 === e.tag;
      }
      function Nn(e) {
        e: {
          for (var t = e.return; null !== t; ) {
            if (Ln(t)) {
              var n = t;
              break e;
            }
            t = t.return;
          }
          i("160"), (n = void 0);
        }
        var r = (t = void 0);
        switch (n.tag) {
          case 7:
            (t = n.stateNode), (r = !1);
            break;
          case 5:
          case 6:
            (t = n.stateNode.containerInfo), (r = !0);
            break;
          default:
            i("161");
        }
        16 & n.effectTag && (ot(t, ""), (n.effectTag &= -17));
        e: t: for (n = e; ; ) {
          for (; null === n.sibling; ) {
            if (null === n.return || Ln(n.return)) {
              n = null;
              break e;
            }
            n = n.return;
          }
          for (
            n.sibling.return = n.return, n = n.sibling;
            7 !== n.tag && 8 !== n.tag;

          ) {
            if (2 & n.effectTag) continue t;
            if (null === n.child || 6 === n.tag) continue t;
            (n.child.return = n), (n = n.child);
          }
          if (!(2 & n.effectTag)) {
            n = n.stateNode;
            break e;
          }
        }
        for (var o = e; ; ) {
          if (7 === o.tag || 8 === o.tag)
            if (n)
              if (r) {
                var s = t,
                  a = o.stateNode,
                  l = n;
                8 === s.nodeType
                  ? s.parentNode.insertBefore(a, l)
                  : s.insertBefore(a, l);
              } else t.insertBefore(o.stateNode, n);
            else
              r
                ? ((s = t),
                  (a = o.stateNode),
                  8 === s.nodeType
                    ? ((l = s.parentNode), l.insertBefore(a, s))
                    : ((l = s), l.appendChild(a)),
                  null === l.onclick && (l.onclick = ut))
                : t.appendChild(o.stateNode);
          else if (6 !== o.tag && null !== o.child) {
            (o.child.return = o), (o = o.child);
            continue;
          }
          if (o === e) break;
          for (; null === o.sibling; ) {
            if (null === o.return || o.return === e) return;
            o = o.return;
          }
          (o.sibling.return = o.return), (o = o.sibling);
        }
      }
      function Mn(e) {
        for (var t = e, n = !1, r = void 0, o = void 0; ; ) {
          if (!n) {
            n = t.return;
            e: for (;;) {
              switch ((null === n && i("160"), n.tag)) {
                case 7:
                  (r = n.stateNode), (o = !1);
                  break e;
                case 5:
                case 6:
                  (r = n.stateNode.containerInfo), (o = !0);
                  break e;
              }
              n = n.return;
            }
            n = !0;
          }
          if (7 === t.tag || 8 === t.tag) {
            e: for (var s = t, a = s; ; )
              if ((Dn(a), null !== a.child && 6 !== a.tag))
                (a.child.return = a), (a = a.child);
              else {
                if (a === s) break;
                for (; null === a.sibling; ) {
                  if (null === a.return || a.return === s) break e;
                  a = a.return;
                }
                (a.sibling.return = a.return), (a = a.sibling);
              }
            o
              ? ((s = r),
                (a = t.stateNode),
                8 === s.nodeType
                  ? s.parentNode.removeChild(a)
                  : s.removeChild(a))
              : r.removeChild(t.stateNode);
          } else if (
            (6 === t.tag ? ((r = t.stateNode.containerInfo), (o = !0)) : Dn(t),
            null !== t.child)
          ) {
            (t.child.return = t), (t = t.child);
            continue;
          }
          if (t === e) break;
          for (; null === t.sibling; ) {
            if (null === t.return || t.return === e) return;
            (t = t.return), 6 === t.tag && (n = !1);
          }
          (t.sibling.return = t.return), (t = t.sibling);
        }
      }
      function jn(e, t) {
        switch (t.tag) {
          case 2:
          case 3:
            break;
          case 7:
            var n = t.stateNode;
            if (null != n) {
              var r = t.memoizedProps,
                o = null !== e ? e.memoizedProps : r;
              e = t.type;
              var s = t.updateQueue;
              if (((t.updateQueue = null), null !== s)) {
                for (
                  n[Br] = r,
                    "input" === e &&
                      "radio" === r.type &&
                      null != r.name &&
                      he(n, r),
                    lt(e, o),
                    t = lt(e, r),
                    o = 0;
                  o < s.length;
                  o += 2
                ) {
                  var a = s[o],
                    l = s[o + 1];
                  "style" === a
                    ? st(n, l)
                    : "dangerouslySetInnerHTML" === a
                    ? Ao(n, l)
                    : "children" === a
                    ? ot(n, l)
                    : ce(n, a, l, t);
                }
                switch (e) {
                  case "input":
                    fe(n, r);
                    break;
                  case "textarea":
                    tt(n, r);
                    break;
                  case "select":
                    (e = n._wrapperState.wasMultiple),
                      (n._wrapperState.wasMultiple = !!r.multiple),
                      (s = r.value),
                      null != s
                        ? Xe(n, !!r.multiple, s, !1)
                        : e !== !!r.multiple &&
                          (null != r.defaultValue
                            ? Xe(n, !!r.multiple, r.defaultValue, !0)
                            : Xe(n, !!r.multiple, r.multiple ? [] : "", !1));
                }
              }
            }
            break;
          case 8:
            null === t.stateNode && i("162"),
              (t.stateNode.nodeValue = t.memoizedProps);
            break;
          case 5:
          case 15:
          case 16:
            break;
          default:
            i("163");
        }
      }
      function zn(e, t, n) {
        (n = Ft(n)), (n.tag = 3), (n.payload = { element: null });
        var r = t.value;
        return (
          (n.callback = function () {
            rr(r), Pn(e, t);
          }),
          n
        );
      }
      function Fn(e, t, n) {
        (n = Ft(n)), (n.tag = 3);
        var r = e.stateNode;
        return (
          null !== r &&
            "function" == typeof r.componentDidCatch &&
            (n.callback = function () {
              null === _s ? (_s = new Set([this])) : _s.add(this);
              var n = t.value,
                r = t.stack;
              Pn(e, t),
                this.componentDidCatch(n, {
                  componentStack: null !== r ? r : "",
                });
            }),
          n
        );
      }
      function Rn(e) {
        switch (e.tag) {
          case 2:
            vt(e.type) && bt(e);
            var t = e.effectTag;
            return 1024 & t ? ((e.effectTag = (-1025 & t) | 64), e) : null;
          case 3:
            return (
              vt(e.type._reactResult) && bt(e),
              (t = e.effectTag),
              1024 & t ? ((e.effectTag = (-1025 & t) | 64), e) : null
            );
          case 5:
            return (
              en(e),
              _t(e),
              (t = e.effectTag),
              0 != (64 & t) && i("285"),
              (e.effectTag = (-1025 & t) | 64),
              e
            );
          case 7:
            return nn(e), null;
          case 16:
            return (
              (t = e.effectTag),
              1024 & t ? ((e.effectTag = (-1025 & t) | 64), e) : null
            );
          case 6:
            return en(e), null;
          case 12:
            return Kt(e), null;
          default:
            return null;
        }
      }
      function Bn() {
        if (null !== fs)
          for (var e = fs.return; null !== e; ) {
            var t = e;
            switch (t.tag) {
              case 2:
                var n = t.type.childContextTypes;
                null !== n && void 0 !== n && bt(t);
                break;
              case 3:
                (n = t.type._reactResult.childContextTypes),
                  null !== n && void 0 !== n && bt(t);
                break;
              case 5:
                en(t), _t(t);
                break;
              case 7:
                nn(t);
                break;
              case 6:
                en(t);
                break;
              case 12:
                Kt(t);
            }
            e = e.return;
          }
        (ms = null), (gs = 0), (ys = !1), (fs = null);
      }
      function Vn(e) {
        for (;;) {
          var t = e.alternate,
            n = e.return,
            r = e.sibling;
          if (0 == (512 & e.effectTag)) {
            var o = t;
            t = e;
            var s = t.pendingProps;
            switch (t.tag) {
              case 0:
              case 1:
                break;
              case 2:
                vt(t.type) && bt(t);
                break;
              case 3:
                vt(t.type._reactResult) && bt(t);
                break;
              case 5:
                en(t),
                  _t(t),
                  (s = t.stateNode),
                  s.pendingContext &&
                    ((s.context = s.pendingContext), (s.pendingContext = null)),
                  (null !== o && null !== o.child) ||
                    (mn(t), (t.effectTag &= -3)),
                  ss(t);
                break;
              case 7:
                nn(t);
                var a = Xt(Jo.current),
                  l = t.type;
                if (null !== o && null != t.stateNode)
                  as(o, t, l, s, a), o.ref !== t.ref && (t.effectTag |= 128);
                else if (s) {
                  var c = Xt(Zo.current);
                  if (mn(t)) {
                    (s = t), (o = s.stateNode);
                    var u = s.type,
                      p = s.memoizedProps,
                      d = a;
                    switch (((o[Rr] = s), (o[Br] = p), (l = void 0), (a = u))) {
                      case "iframe":
                      case "object":
                        Fe("load", o);
                        break;
                      case "video":
                      case "audio":
                        for (u = 0; u < Kr.length; u++) Fe(Kr[u], o);
                        break;
                      case "source":
                        Fe("error", o);
                        break;
                      case "img":
                      case "image":
                      case "link":
                        Fe("error", o), Fe("load", o);
                        break;
                      case "form":
                        Fe("reset", o), Fe("submit", o);
                        break;
                      case "details":
                        Fe("toggle", o);
                        break;
                      case "input":
                        de(o, p), Fe("invalid", o), ct(d, "onChange");
                        break;
                      case "select":
                        (o._wrapperState = { wasMultiple: !!p.multiple }),
                          Fe("invalid", o),
                          ct(d, "onChange");
                        break;
                      case "textarea":
                        et(o, p), Fe("invalid", o), ct(d, "onChange");
                    }
                    at(a, p), (u = null);
                    for (l in p)
                      p.hasOwnProperty(l) &&
                        ((c = p[l]),
                        "children" === l
                          ? "string" == typeof c
                            ? o.textContent !== c && (u = ["children", c])
                            : "number" == typeof c &&
                              o.textContent !== "" + c &&
                              (u = ["children", "" + c])
                          : Ir.hasOwnProperty(l) && null != c && ct(d, l));
                    switch (a) {
                      case "input":
                        Q(o), me(o, p, !0);
                        break;
                      case "textarea":
                        Q(o), nt(o, p);
                        break;
                      case "select":
                      case "option":
                        break;
                      default:
                        "function" == typeof p.onClick && (o.onclick = ut);
                    }
                    (l = u), (s.updateQueue = l), (s = null !== l), s && On(t);
                  } else {
                    (p = t),
                      (o = l),
                      (d = s),
                      (u = 9 === a.nodeType ? a : a.ownerDocument),
                      c === Eo.html && (c = rt(o)),
                      c === Eo.html
                        ? "script" === o
                          ? ((o = u.createElement("div")),
                            (o.innerHTML = "<script></script>"),
                            (u = o.removeChild(o.firstChild)))
                          : "string" == typeof d.is
                          ? (u = u.createElement(o, { is: d.is }))
                          : ((u = u.createElement(o)),
                            "select" === o && d.multiple && (u.multiple = !0))
                        : (u = u.createElementNS(c, o)),
                      (o = u),
                      (o[Rr] = p),
                      (o[Br] = s);
                    e: for (p = o, d = t, u = d.child; null !== u; ) {
                      if (7 === u.tag || 8 === u.tag)
                        p.appendChild(u.stateNode);
                      else if (6 !== u.tag && null !== u.child) {
                        (u.child.return = u), (u = u.child);
                        continue;
                      }
                      if (u === d) break;
                      for (; null === u.sibling; ) {
                        if (null === u.return || u.return === d) break e;
                        u = u.return;
                      }
                      (u.sibling.return = u.return), (u = u.sibling);
                    }
                    (d = o), (u = l), (p = s);
                    var h = a,
                      f = lt(u, p);
                    switch (u) {
                      case "iframe":
                      case "object":
                        Fe("load", d), (a = p);
                        break;
                      case "video":
                      case "audio":
                        for (a = 0; a < Kr.length; a++) Fe(Kr[a], d);
                        a = p;
                        break;
                      case "source":
                        Fe("error", d), (a = p);
                        break;
                      case "img":
                      case "image":
                      case "link":
                        Fe("error", d), Fe("load", d), (a = p);
                        break;
                      case "form":
                        Fe("reset", d), Fe("submit", d), (a = p);
                        break;
                      case "details":
                        Fe("toggle", d), (a = p);
                        break;
                      case "input":
                        de(d, p),
                          (a = pe(d, p)),
                          Fe("invalid", d),
                          ct(h, "onChange");
                        break;
                      case "option":
                        a = Ye(d, p);
                        break;
                      case "select":
                        (d._wrapperState = { wasMultiple: !!p.multiple }),
                          (a = _r({}, p, { value: void 0 })),
                          Fe("invalid", d),
                          ct(h, "onChange");
                        break;
                      case "textarea":
                        et(d, p),
                          (a = Qe(d, p)),
                          Fe("invalid", d),
                          ct(h, "onChange");
                        break;
                      default:
                        a = p;
                    }
                    at(u, a), (c = void 0);
                    var m = u,
                      g = d,
                      y = a;
                    for (c in y)
                      if (y.hasOwnProperty(c)) {
                        var v = y[c];
                        "style" === c
                          ? st(g, v)
                          : "dangerouslySetInnerHTML" === c
                          ? null != (v = v ? v.__html : void 0) && Ao(g, v)
                          : "children" === c
                          ? "string" == typeof v
                            ? ("textarea" !== m || "" !== v) && ot(g, v)
                            : "number" == typeof v && ot(g, "" + v)
                          : "suppressContentEditableWarning" !== c &&
                            "suppressHydrationWarning" !== c &&
                            "autoFocus" !== c &&
                            (Ir.hasOwnProperty(c)
                              ? null != v && ct(h, c)
                              : null != v && ce(g, c, v, f));
                      }
                    switch (u) {
                      case "input":
                        Q(d), me(d, p, !1);
                        break;
                      case "textarea":
                        Q(d), nt(d, p);
                        break;
                      case "option":
                        null != p.value &&
                          d.setAttribute("value", "" + ue(p.value));
                        break;
                      case "select":
                        (a = d),
                          (a.multiple = !!p.multiple),
                          (d = p.value),
                          null != d
                            ? Xe(a, !!p.multiple, d, !1)
                            : null != p.defaultValue &&
                              Xe(a, !!p.multiple, p.defaultValue, !0);
                        break;
                      default:
                        "function" == typeof a.onClick && (d.onclick = ut);
                    }
                    (s = pt(l, s)) && On(t), (t.stateNode = o);
                  }
                  null !== t.ref && (t.effectTag |= 128);
                } else null === t.stateNode && i("166");
                break;
              case 8:
                o && null != t.stateNode
                  ? ls(o, t, o.memoizedProps, s)
                  : ("string" != typeof s && null === t.stateNode && i("166"),
                    (o = Xt(Jo.current)),
                    Xt(Zo.current),
                    mn(t)
                      ? ((s = t),
                        (l = s.stateNode),
                        (o = s.memoizedProps),
                        (l[Rr] = s),
                        (s = l.nodeValue !== o) && On(t))
                      : ((l = t),
                        (s = (
                          9 === o.nodeType ? o : o.ownerDocument
                        ).createTextNode(s)),
                        (s[Rr] = l),
                        (t.stateNode = s)));
                break;
              case 13:
              case 14:
              case 16:
              case 9:
              case 10:
              case 15:
                break;
              case 6:
                en(t), ss(t);
                break;
              case 12:
                Kt(t);
                break;
              case 11:
                break;
              case 4:
                i("167");
              default:
                i("156");
            }
            if (
              ((t = fs = null),
              (s = e),
              1073741823 === gs || 1073741823 !== s.childExpirationTime)
            ) {
              for (l = 0, o = s.child; null !== o; )
                (a = o.expirationTime),
                  (p = o.childExpirationTime),
                  (0 === l || (0 !== a && a < l)) && (l = a),
                  (0 === l || (0 !== p && p < l)) && (l = p),
                  (o = o.sibling);
              s.childExpirationTime = l;
            }
            if (null !== t) return t;
            null !== n &&
              0 == (512 & n.effectTag) &&
              (null === n.firstEffect && (n.firstEffect = e.firstEffect),
              null !== e.lastEffect &&
                (null !== n.lastEffect &&
                  (n.lastEffect.nextEffect = e.firstEffect),
                (n.lastEffect = e.lastEffect)),
              1 < e.effectTag &&
                (null !== n.lastEffect
                  ? (n.lastEffect.nextEffect = e)
                  : (n.firstEffect = e),
                (n.lastEffect = e)));
          } else {
            if (null !== (e = Rn(e, gs))) return (e.effectTag &= 511), e;
            null !== n &&
              ((n.firstEffect = n.lastEffect = null), (n.effectTag |= 512));
          }
          if (null !== r) return r;
          if (null === n) break;
          e = n;
        }
        return null;
      }
      function Un(e) {
        var t = An(e.alternate, e, gs);
        return null === t && (t = Vn(e)), (us.current = null), t;
      }
      function qn(e, t, n) {
        hs && i("243"), (hs = !0), (us.currentDispatcher = cs);
        var r = e.nextExpirationTimeToWorkOn;
        (r === gs && e === ms && null !== fs) ||
          (Bn(),
          (ms = e),
          (gs = r),
          (fs = Ot(ms.current, null, gs)),
          (e.pendingCommitExpirationTime = 0));
        for (var o = !1; ; ) {
          try {
            if (t) for (; null !== fs && !nr(); ) fs = Un(fs);
            else for (; null !== fs; ) fs = Un(fs);
          } catch (e) {
            if (null === fs) (o = !0), rr(e);
            else {
              null === fs && i("271");
              var s = fs,
                a = s.return;
              if (null !== a) {
                e: {
                  var l = a,
                    c = s,
                    u = e;
                  (a = gs),
                    (c.effectTag |= 512),
                    (c.firstEffect = c.lastEffect = null),
                    (ys = !0),
                    (u = Gt(u, c));
                  do {
                    switch (l.tag) {
                      case 5:
                        (l.effectTag |= 1024),
                          (l.expirationTime = a),
                          (a = zn(l, u, a)),
                          Vt(l, a);
                        break e;
                      case 2:
                      case 3:
                        c = u;
                        var p = l.stateNode;
                        if (
                          0 == (64 & l.effectTag) &&
                          null !== p &&
                          "function" == typeof p.componentDidCatch &&
                          (null === _s || !_s.has(p))
                        ) {
                          (l.effectTag |= 1024),
                            (l.expirationTime = a),
                            (a = Fn(l, c, a)),
                            Vt(l, a);
                          break e;
                        }
                    }
                    l = l.return;
                  } while (null !== l);
                }
                fs = Vn(s);
                continue;
              }
              (o = !0), rr(e);
            }
          }
          break;
        }
        if (((hs = !1), ($o = Wo = Ho = us.currentDispatcher = null), o))
          (ms = null), (e.finishedWork = null);
        else if (null !== fs) e.finishedWork = null;
        else {
          if (
            ((t = e.current.alternate), null === t && i("281"), (ms = null), ys)
          ) {
            if (
              ((o = e.latestPendingTime),
              (s = e.latestSuspendedTime),
              (a = e.latestPingedTime),
              (0 !== o && o > r) || (0 !== s && s > r) || (0 !== a && a > r))
            )
              return (
                (e.didError = !1),
                (n = e.latestPingedTime),
                0 !== n && n <= r && (e.latestPingedTime = 0),
                (n = e.earliestPendingTime),
                (t = e.latestPendingTime),
                n === r
                  ? (e.earliestPendingTime =
                      t === r ? (e.latestPendingTime = 0) : t)
                  : t === r && (e.latestPendingTime = n),
                (n = e.earliestSuspendedTime),
                (t = e.latestSuspendedTime),
                0 === n
                  ? (e.earliestSuspendedTime = e.latestSuspendedTime = r)
                  : n > r
                  ? (e.earliestSuspendedTime = r)
                  : t < r && (e.latestSuspendedTime = r),
                Mt(r, e),
                void (e.expirationTime = e.expirationTime)
              );
            if (!e.didError && !n)
              return (
                (e.didError = !0),
                (e.nextExpirationTimeToWorkOn = r),
                (r = e.expirationTime = 1),
                void (e.expirationTime = r)
              );
          }
          (e.pendingCommitExpirationTime = r), (e.finishedWork = t);
        }
      }
      function Hn(e, t) {
        var n;
        e: {
          for (hs && !bs && i("263"), n = e.return; null !== n; ) {
            switch (n.tag) {
              case 2:
              case 3:
                var r = n.stateNode;
                if (
                  "function" == typeof n.type.getDerivedStateFromCatch ||
                  ("function" == typeof r.componentDidCatch &&
                    (null === _s || !_s.has(r)))
                ) {
                  (e = Gt(t, e)),
                    (e = Fn(n, e, 1)),
                    Bt(n, e),
                    $n(n, 1),
                    (n = void 0);
                  break e;
                }
                break;
              case 5:
                (e = Gt(t, e)),
                  (e = zn(n, e, 1)),
                  Bt(n, e),
                  $n(n, 1),
                  (n = void 0);
                break e;
            }
            n = n.return;
          }
          5 === e.tag &&
            ((n = Gt(t, e)), (n = zn(e, n, 1)), Bt(e, n), $n(e, 1)),
            (n = void 0);
        }
        return n;
      }
      function Wn(e, t) {
        return (
          0 !== ds
            ? (e = ds)
            : hs
            ? (e = bs ? 1 : gs)
            : 1 & t.mode
            ? ((e = Ms
                ? 2 + 10 * (1 + (((e - 2 + 15) / 10) | 0))
                : 2 + 25 * (1 + (((e - 2 + 500) / 25) | 0))),
              null !== ms && e === gs && (e += 1))
            : (e = 1),
          Ms && (0 === As || e > As) && (As = e),
          e
        );
      }
      function $n(e, t) {
        e: {
          (0 === e.expirationTime || e.expirationTime > t) &&
            (e.expirationTime = t);
          var n = e.alternate;
          null !== n &&
            (0 === n.expirationTime || n.expirationTime > t) &&
            (n.expirationTime = t);
          var r = e.return;
          if (null === r && 5 === e.tag) e = e.stateNode;
          else {
            for (; null !== r; ) {
              if (
                ((n = r.alternate),
                (0 === r.childExpirationTime || r.childExpirationTime > t) &&
                  (r.childExpirationTime = t),
                null !== n &&
                  (0 === n.childExpirationTime || n.childExpirationTime > t) &&
                  (n.childExpirationTime = t),
                null === r.return && 5 === r.tag)
              ) {
                e = r.stateNode;
                break e;
              }
              r = r.return;
            }
            e = null;
          }
        }
        null !== e &&
          (!hs && 0 !== gs && t < gs && Bn(),
          Nt(e, t),
          (hs && !bs && ms === e) ||
            ((t = e),
            (e = e.expirationTime),
            null === t.nextScheduledRoot
              ? ((t.expirationTime = e),
                null === Cs
                  ? ((ws = Cs = t), (t.nextScheduledRoot = t))
                  : ((Cs = Cs.nextScheduledRoot = t),
                    (Cs.nextScheduledRoot = ws)))
              : (0 === (n = t.expirationTime) || e < n) &&
                (t.expirationTime = e),
            xs ||
              (Ls
                ? Ns && ((Es = t), (Ts = 1), er(t, 1, !0))
                : 1 === e
                ? Qn(1, null)
                : Kn(t, e))),
          Vs > Bs && ((Vs = 0), i("185")));
      }
      function Gn(e, t, n, r, i) {
        var o = ds;
        ds = 1;
        try {
          return e(t, n, r, i);
        } finally {
          ds = o;
        }
      }
      function Zn() {
        Fs = 2 + (((wr.unstable_now() - zs) / 10) | 0);
      }
      function Kn(e, t) {
        if (0 !== Ss) {
          if (t > Ss) return;
          null !== ks && wr.unstable_cancelScheduledWork(ks);
        }
        (Ss = t),
          (e = wr.unstable_now() - zs),
          (ks = wr.unstable_scheduleWork(Xn, { timeout: 10 * (t - 2) - e }));
      }
      function Jn() {
        return xs
          ? Rs
          : (Yn(), (0 !== Ts && 1073741823 !== Ts) || (Zn(), (Rs = Fs)), Rs);
      }
      function Yn() {
        var e = 0,
          t = null;
        if (null !== Cs)
          for (var n = Cs, r = ws; null !== r; ) {
            var o = r.expirationTime;
            if (0 === o) {
              if (
                ((null === n || null === Cs) && i("244"),
                r === r.nextScheduledRoot)
              ) {
                ws = Cs = r.nextScheduledRoot = null;
                break;
              }
              if (r === ws)
                (ws = o = r.nextScheduledRoot),
                  (Cs.nextScheduledRoot = o),
                  (r.nextScheduledRoot = null);
              else {
                if (r === Cs) {
                  (Cs = n),
                    (Cs.nextScheduledRoot = ws),
                    (r.nextScheduledRoot = null);
                  break;
                }
                (n.nextScheduledRoot = r.nextScheduledRoot),
                  (r.nextScheduledRoot = null);
              }
              r = n.nextScheduledRoot;
            } else {
              if (((0 === e || o < e) && ((e = o), (t = r)), r === Cs)) break;
              if (1 === e) break;
              (n = r), (r = r.nextScheduledRoot);
            }
          }
        (Es = t), (Ts = e);
      }
      function Xn(e) {
        if (e.didTimeout && null !== ws) {
          Zn();
          var t = ws;
          do {
            var n = t.expirationTime;
            0 !== n && Fs >= n && (t.nextExpirationTimeToWorkOn = Fs),
              (t = t.nextScheduledRoot);
          } while (t !== ws);
        }
        Qn(0, e);
      }
      function Qn(e, t) {
        if (((Ds = t), Yn(), null !== Ds))
          for (
            Zn(), Rs = Fs;
            null !== Es &&
            0 !== Ts &&
            (0 === e || e >= Ts) &&
            (!Os || Fs >= Ts);

          )
            er(Es, Ts, Fs >= Ts), Yn(), Zn(), (Rs = Fs);
        else
          for (; null !== Es && 0 !== Ts && (0 === e || e >= Ts); )
            er(Es, Ts, !0), Yn();
        if (
          (null !== Ds && ((Ss = 0), (ks = null)),
          0 !== Ts && Kn(Es, Ts),
          (Ds = null),
          (Os = !1),
          (Vs = 0),
          (Us = null),
          null !== js)
        )
          for (e = js, js = null, t = 0; t < e.length; t++) {
            var n = e[t];
            try {
              n._onComplete();
            } catch (e) {
              Ps || ((Ps = !0), (Is = e));
            }
          }
        if (Ps) throw ((e = Is), (Is = null), (Ps = !1), e);
      }
      function er(e, t, n) {
        if ((xs && i("245"), (xs = !0), null === Ds || n)) {
          var r = e.finishedWork;
          null !== r
            ? tr(e, r, t)
            : ((e.finishedWork = null),
              qn(e, !1, n),
              null !== (r = e.finishedWork) && tr(e, r, t));
        } else
          (r = e.finishedWork),
            null !== r
              ? tr(e, r, t)
              : ((e.finishedWork = null),
                qn(e, !0, n),
                null !== (r = e.finishedWork) &&
                  (nr() ? (e.finishedWork = r) : tr(e, r, t)));
        xs = !1;
      }
      function tr(e, t, n) {
        var r = e.firstBatch;
        if (
          null !== r &&
          r._expirationTime <= n &&
          (null === js ? (js = [r]) : js.push(r), r._defer)
        )
          return (e.finishedWork = t), void (e.expirationTime = 0);
        (e.finishedWork = null),
          e === Us ? Vs++ : ((Us = e), (Vs = 0)),
          (bs = hs = !0),
          e.current === t && i("177"),
          (n = e.pendingCommitExpirationTime),
          0 === n && i("261"),
          (e.pendingCommitExpirationTime = 0),
          (r = t.expirationTime);
        var o = t.childExpirationTime;
        if (
          ((r = 0 === r || (0 !== o && o < r) ? o : r),
          (e.didError = !1),
          0 === r
            ? ((e.earliestPendingTime = 0),
              (e.latestPendingTime = 0),
              (e.earliestSuspendedTime = 0),
              (e.latestSuspendedTime = 0),
              (e.latestPingedTime = 0))
            : ((o = e.latestPendingTime),
              0 !== o &&
                (o < r
                  ? (e.earliestPendingTime = e.latestPendingTime = 0)
                  : e.earliestPendingTime < r &&
                    (e.earliestPendingTime = e.latestPendingTime)),
              (o = e.earliestSuspendedTime),
              0 === o
                ? Nt(e, r)
                : r > e.latestSuspendedTime
                ? ((e.earliestSuspendedTime = 0),
                  (e.latestSuspendedTime = 0),
                  (e.latestPingedTime = 0),
                  Nt(e, r))
                : r < o && Nt(e, r)),
          Mt(0, e),
          (us.current = null),
          1 < t.effectTag
            ? null !== t.lastEffect
              ? ((t.lastEffect.nextEffect = t), (r = t.firstEffect))
              : (r = t)
            : (r = t.firstEffect),
          (Do = mo),
          (o = Ge()),
          Ze(o))
        ) {
          if ("selectionStart" in o)
            var s = { start: o.selectionStart, end: o.selectionEnd };
          else
            e: {
              s = ((s = o.ownerDocument) && s.defaultView) || window;
              var a = s.getSelection && s.getSelection();
              if (a && 0 !== a.rangeCount) {
                s = a.anchorNode;
                var l = a.anchorOffset,
                  c = a.focusNode;
                a = a.focusOffset;
                try {
                  s.nodeType, c.nodeType;
                } catch (e) {
                  s = null;
                  break e;
                }
                var u = 0,
                  p = -1,
                  d = -1,
                  h = 0,
                  f = 0,
                  m = o,
                  g = null;
                t: for (;;) {
                  for (
                    var y;
                    m !== s || (0 !== l && 3 !== m.nodeType) || (p = u + l),
                      m !== c || (0 !== a && 3 !== m.nodeType) || (d = u + a),
                      3 === m.nodeType && (u += m.nodeValue.length),
                      null !== (y = m.firstChild);

                  )
                    (g = m), (m = y);
                  for (;;) {
                    if (m === o) break t;
                    if (
                      (g === s && ++h === l && (p = u),
                      g === c && ++f === a && (d = u),
                      null !== (y = m.nextSibling))
                    )
                      break;
                    (m = g), (g = m.parentNode);
                  }
                  m = y;
                }
                s = -1 === p || -1 === d ? null : { start: p, end: d };
              } else s = null;
            }
          s = s || { start: 0, end: 0 };
        } else s = null;
        for (
          Lo = { focusedElem: o, selectionRange: s }, mo = !1, vs = r;
          null !== vs;

        ) {
          (o = !1), (s = void 0);
          try {
            for (; null !== vs; ) {
              if (256 & vs.effectTag) {
                var v = vs.alternate;
                e: switch (((l = vs), l.tag)) {
                  case 2:
                  case 3:
                    if (256 & l.effectTag && null !== v) {
                      var b = v.memoizedProps,
                        _ = v.memoizedState,
                        w = l.stateNode;
                      (w.props = l.memoizedProps), (w.state = l.memoizedState);
                      var C = w.getSnapshotBeforeUpdate(b, _);
                      w.__reactInternalSnapshotBeforeUpdate = C;
                    }
                    break e;
                  case 5:
                  case 7:
                  case 8:
                  case 6:
                    break e;
                  default:
                    i("163");
                }
              }
              vs = vs.nextEffect;
            }
          } catch (e) {
            (o = !0), (s = e);
          }
          o &&
            (null === vs && i("178"),
            Hn(vs, s),
            null !== vs && (vs = vs.nextEffect));
        }
        for (vs = r; null !== vs; ) {
          (v = !1), (b = void 0);
          try {
            for (; null !== vs; ) {
              var S = vs.effectTag;
              if ((16 & S && ot(vs.stateNode, ""), 128 & S)) {
                var k = vs.alternate;
                if (null !== k) {
                  var x = k.ref;
                  null !== x &&
                    ("function" == typeof x ? x(null) : (x.current = null));
                }
              }
              switch (14 & S) {
                case 2:
                  Nn(vs), (vs.effectTag &= -3);
                  break;
                case 6:
                  Nn(vs), (vs.effectTag &= -3), jn(vs.alternate, vs);
                  break;
                case 4:
                  jn(vs.alternate, vs);
                  break;
                case 8:
                  (_ = vs),
                    Mn(_),
                    (_.return = null),
                    (_.child = null),
                    _.alternate &&
                      ((_.alternate.child = null), (_.alternate.return = null));
              }
              vs = vs.nextEffect;
            }
          } catch (e) {
            (v = !0), (b = e);
          }
          v &&
            (null === vs && i("178"),
            Hn(vs, b),
            null !== vs && (vs = vs.nextEffect));
        }
        if (
          ((x = Lo),
          (k = Ge()),
          (S = x.focusedElem),
          (b = x.selectionRange),
          k !== S &&
            S &&
            S.ownerDocument &&
            $e(S.ownerDocument.documentElement, S))
        ) {
          null !== b &&
            Ze(S) &&
            ((k = b.start),
            (x = b.end),
            void 0 === x && (x = k),
            "selectionStart" in S
              ? ((S.selectionStart = k),
                (S.selectionEnd = Math.min(x, S.value.length)))
              : ((v = S.ownerDocument || document),
                (k = ((v && v.defaultView) || window).getSelection()),
                (_ = S.textContent.length),
                (x = Math.min(b.start, _)),
                (b = void 0 === b.end ? x : Math.min(b.end, _)),
                !k.extend && x > b && ((_ = b), (b = x), (x = _)),
                (_ = We(S, x)),
                (w = We(S, b)),
                _ &&
                  w &&
                  (1 !== k.rangeCount ||
                    k.anchorNode !== _.node ||
                    k.anchorOffset !== _.offset ||
                    k.focusNode !== w.node ||
                    k.focusOffset !== w.offset) &&
                  ((v = v.createRange()),
                  v.setStart(_.node, _.offset),
                  k.removeAllRanges(),
                  x > b
                    ? (k.addRange(v), k.extend(w.node, w.offset))
                    : (v.setEnd(w.node, w.offset), k.addRange(v))))),
            (k = []);
          for (x = S; (x = x.parentNode); )
            1 === x.nodeType &&
              k.push({ element: x, left: x.scrollLeft, top: x.scrollTop });
          for (
            "function" == typeof S.focus && S.focus(), S = 0;
            S < k.length;
            S++
          )
            (x = k[S]),
              (x.element.scrollLeft = x.left),
              (x.element.scrollTop = x.top);
        }
        for (
          Lo = null, mo = !!Do, Do = null, e.current = t, vs = r;
          null !== vs;

        ) {
          (r = !1), (S = void 0);
          try {
            for (k = n; null !== vs; ) {
              var E = vs.effectTag;
              if (36 & E) {
                var T = vs.alternate;
                switch (((x = vs), (v = k), x.tag)) {
                  case 2:
                  case 3:
                    var A = x.stateNode;
                    if (4 & x.effectTag)
                      if (null === T)
                        (A.props = x.memoizedProps),
                          (A.state = x.memoizedState),
                          A.componentDidMount();
                      else {
                        var O = T.memoizedProps,
                          P = T.memoizedState;
                        (A.props = x.memoizedProps),
                          (A.state = x.memoizedState),
                          A.componentDidUpdate(
                            O,
                            P,
                            A.__reactInternalSnapshotBeforeUpdate,
                          );
                      }
                    var I = x.updateQueue;
                    null !== I &&
                      ((A.props = x.memoizedProps),
                      (A.state = x.memoizedState),
                      Wt(x, I, A, v));
                    break;
                  case 5:
                    var D = x.updateQueue;
                    if (null !== D) {
                      if (((b = null), null !== x.child))
                        switch (x.child.tag) {
                          case 7:
                            b = x.child.stateNode;
                            break;
                          case 2:
                          case 3:
                            b = x.child.stateNode;
                        }
                      Wt(x, D, b, v);
                    }
                    break;
                  case 7:
                    var L = x.stateNode;
                    null === T &&
                      4 & x.effectTag &&
                      pt(x.type, x.memoizedProps) &&
                      L.focus();
                    break;
                  case 8:
                  case 6:
                  case 15:
                  case 16:
                    break;
                  default:
                    i("163");
                }
              }
              if (128 & E) {
                var N = vs.ref;
                if (null !== N) {
                  var M = vs.stateNode;
                  switch (vs.tag) {
                    case 7:
                      var j = M;
                      break;
                    default:
                      j = M;
                  }
                  "function" == typeof N ? N(j) : (N.current = j);
                }
              }
              var z = vs.nextEffect;
              (vs.nextEffect = null), (vs = z);
            }
          } catch (e) {
            (r = !0), (S = e);
          }
          r &&
            (null === vs && i("178"),
            Hn(vs, S),
            null !== vs && (vs = vs.nextEffect));
        }
        (hs = bs = !1),
          "function" == typeof Bo && Bo(t.stateNode),
          (E = t.expirationTime),
          (t = t.childExpirationTime),
          (t = 0 === E || (0 !== t && t < E) ? t : E),
          0 === t && (_s = null),
          (e.expirationTime = t),
          (e.finishedWork = null);
      }
      function nr() {
        return !!Os || (!(null === Ds || Ds.timeRemaining() > qs) && (Os = !0));
      }
      function rr(e) {
        null === Es && i("246"),
          (Es.expirationTime = 0),
          Ps || ((Ps = !0), (Is = e));
      }
      function ir(e, t) {
        var n = Ls;
        Ls = !0;
        try {
          return e(t);
        } finally {
          (Ls = n) || xs || Qn(1, null);
        }
      }
      function or(e, t) {
        if (Ls && !Ns) {
          Ns = !0;
          try {
            return e(t);
          } finally {
            Ns = !1;
          }
        }
        return e(t);
      }
      function sr(e, t, n) {
        if (Ms) return e(t, n);
        Ls || xs || 0 === As || (Qn(As, null), (As = 0));
        var r = Ms,
          i = Ls;
        Ls = Ms = !0;
        try {
          return e(t, n);
        } finally {
          (Ms = r), (Ls = i) || xs || Qn(1, null);
        }
      }
      function ar(e) {
        if (!e) return jo;
        e = e._reactInternalFiber;
        e: {
          (2 !== Ie(e) || (2 !== e.tag && 3 !== e.tag)) && i("170");
          var t = e;
          do {
            switch (t.tag) {
              case 5:
                t = t.stateNode.context;
                break e;
              case 2:
                if (vt(t.type)) {
                  t = t.stateNode.__reactInternalMemoizedMergedChildContext;
                  break e;
                }
                break;
              case 3:
                if (vt(t.type._reactResult)) {
                  t = t.stateNode.__reactInternalMemoizedMergedChildContext;
                  break e;
                }
            }
            t = t.return;
          } while (null !== t);
          i("171"), (t = void 0);
        }
        if (2 === e.tag) {
          var n = e.type;
          if (vt(n)) return Ct(e, n, t);
        } else if (3 === e.tag && ((n = e.type._reactResult), vt(n)))
          return Ct(e, n, t);
        return t;
      }
      function lr(e, t, n, r, i) {
        var o = t.current;
        return (
          (n = ar(n)),
          null === t.context ? (t.context = n) : (t.pendingContext = n),
          (t = i),
          (i = Ft(r)),
          (i.payload = { element: e }),
          (t = void 0 === t ? null : t),
          null !== t && (i.callback = t),
          Bt(o, i),
          $n(o, r),
          r
        );
      }
      function cr(e, t, n, r) {
        var i = t.current;
        return (i = Wn(Jn(), i)), lr(e, t, n, i, r);
      }
      function ur(e) {
        if (((e = e.current), !e.child)) return null;
        switch (e.child.tag) {
          case 7:
          default:
            return e.child.stateNode;
        }
      }
      function pr(e, t, n) {
        var r =
          3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return {
          $$typeof: _i,
          key: null == r ? null : "" + r,
          children: e,
          containerInfo: t,
          implementation: n,
        };
      }
      function dr(e) {
        var t = 2 + 25 * (1 + (((Jn() - 2 + 500) / 25) | 0));
        t <= ps && (t = ps + 1),
          (this._expirationTime = ps = t),
          (this._root = e),
          (this._callbacks = this._next = null),
          (this._hasChildren = this._didComplete = !1),
          (this._children = null),
          (this._defer = !0);
      }
      function hr() {
        (this._callbacks = null),
          (this._didCommit = !1),
          (this._onCommit = this._onCommit.bind(this));
      }
      function fr(e, t, n) {
        (t = new Tt(5, null, null, t ? 3 : 0)),
          (e = {
            current: t,
            containerInfo: e,
            pendingChildren: null,
            earliestPendingTime: 0,
            latestPendingTime: 0,
            earliestSuspendedTime: 0,
            latestSuspendedTime: 0,
            latestPingedTime: 0,
            didError: !1,
            pendingCommitExpirationTime: 0,
            finishedWork: null,
            timeoutHandle: -1,
            context: null,
            pendingContext: null,
            hydrate: n,
            nextExpirationTimeToWorkOn: 0,
            expirationTime: 0,
            firstBatch: null,
            nextScheduledRoot: null,
          }),
          (this._internalRoot = t.stateNode = e);
      }
      function mr(e) {
        return !(
          !e ||
          (1 !== e.nodeType &&
            9 !== e.nodeType &&
            11 !== e.nodeType &&
            (8 !== e.nodeType ||
              " react-mount-point-unstable " !== e.nodeValue))
        );
      }
      function gr(e, t) {
        if (
          (t ||
            ((t = e
              ? 9 === e.nodeType
                ? e.documentElement
                : e.firstChild
              : null),
            (t = !(
              !t ||
              1 !== t.nodeType ||
              !t.hasAttribute("data-reactroot")
            ))),
          !t)
        )
          for (var n; (n = e.lastChild); ) e.removeChild(n);
        return new fr(e, !1, t);
      }
      function yr(e, t, n, r, o) {
        mr(n) || i("200");
        var s = n._reactRootContainer;
        if (s) {
          if ("function" == typeof o) {
            var a = o;
            o = function () {
              var e = ur(s._internalRoot);
              a.call(e);
            };
          }
          null != e
            ? s.legacy_renderSubtreeIntoContainer(e, t, o)
            : s.render(t, o);
        } else {
          if (
            ((s = n._reactRootContainer = gr(n, r)), "function" == typeof o)
          ) {
            var l = o;
            o = function () {
              var e = ur(s._internalRoot);
              l.call(e);
            };
          }
          or(function () {
            null != e
              ? s.legacy_renderSubtreeIntoContainer(e, t, o)
              : s.render(t, o);
          });
        }
        return ur(s._internalRoot);
      }
      function vr(e, t) {
        var n =
          2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        return mr(t) || i("200"), pr(e, t, null, n);
      } /** @license React v16.5.2
       * react-dom.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      var br = n(2),
        _r = n(52),
        wr = n(264);
      br || i("227");
      var Cr = !1,
        Sr = null,
        kr = !1,
        xr = null,
        Er = {
          onError: function (e) {
            (Cr = !0), (Sr = e);
          },
        },
        Tr = null,
        Ar = {},
        Or = [],
        Pr = {},
        Ir = {},
        Dr = {},
        Lr = null,
        Nr = null,
        Mr = null,
        jr = null,
        zr = {
          injectEventPluginOrder: function (e) {
            Tr && i("101"), (Tr = Array.prototype.slice.call(e)), l();
          },
          injectEventPluginsByName: function (e) {
            var t,
              n = !1;
            for (t in e)
              if (e.hasOwnProperty(t)) {
                var r = e[t];
                (Ar.hasOwnProperty(t) && Ar[t] === r) ||
                  (Ar[t] && i("102", t), (Ar[t] = r), (n = !0));
              }
            n && l();
          },
        },
        Fr = Math.random().toString(36).slice(2),
        Rr = "__reactInternalInstance$" + Fr,
        Br = "__reactEventHandlers$" + Fr,
        Vr = !(
          "undefined" == typeof window ||
          !window.document ||
          !window.document.createElement
        ),
        Ur = {
          animationend: A("Animation", "AnimationEnd"),
          animationiteration: A("Animation", "AnimationIteration"),
          animationstart: A("Animation", "AnimationStart"),
          transitionend: A("Transition", "TransitionEnd"),
        },
        qr = {},
        Hr = {};
      Vr &&
        ((Hr = document.createElement("div").style),
        "AnimationEvent" in window ||
          (delete Ur.animationend.animation,
          delete Ur.animationiteration.animation,
          delete Ur.animationstart.animation),
        "TransitionEvent" in window || delete Ur.transitionend.transition);
      var Wr = O("animationend"),
        $r = O("animationiteration"),
        Gr = O("animationstart"),
        Zr = O("transitionend"),
        Kr =
          "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(
            " ",
          ),
        Jr = null,
        Yr = null,
        Xr = null;
      _r(L.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var e = this.nativeEvent;
          e &&
            (e.preventDefault
              ? e.preventDefault()
              : "unknown" != typeof e.returnValue && (e.returnValue = !1),
            (this.isDefaultPrevented = I));
        },
        stopPropagation: function () {
          var e = this.nativeEvent;
          e &&
            (e.stopPropagation
              ? e.stopPropagation()
              : "unknown" != typeof e.cancelBubble && (e.cancelBubble = !0),
            (this.isPropagationStopped = I));
        },
        persist: function () {
          this.isPersistent = I;
        },
        isPersistent: D,
        destructor: function () {
          var e,
            t = this.constructor.Interface;
          for (e in t) this[e] = null;
          (this.nativeEvent = this._targetInst = this.dispatchConfig = null),
            (this.isPropagationStopped = this.isDefaultPrevented = D),
            (this._dispatchInstances = this._dispatchListeners = null);
        },
      }),
        (L.Interface = {
          type: null,
          target: null,
          currentTarget: function () {
            return null;
          },
          eventPhase: null,
          bubbles: null,
          cancelable: null,
          timeStamp: function (e) {
            return e.timeStamp || Date.now();
          },
          defaultPrevented: null,
          isTrusted: null,
        }),
        (L.extend = function (e) {
          function t() {}
          function n() {
            return r.apply(this, arguments);
          }
          var r = this;
          t.prototype = r.prototype;
          var i = new t();
          return (
            _r(i, n.prototype),
            (n.prototype = i),
            (n.prototype.constructor = n),
            (n.Interface = _r({}, r.Interface, e)),
            (n.extend = r.extend),
            j(n),
            n
          );
        }),
        j(L);
      var Qr = L.extend({ data: null }),
        ei = L.extend({ data: null }),
        ti = [9, 13, 27, 32],
        ni = Vr && "CompositionEvent" in window,
        ri = null;
      Vr && "documentMode" in document && (ri = document.documentMode);
      var ii = Vr && "TextEvent" in window && !ri,
        oi = Vr && (!ni || (ri && 8 < ri && 11 >= ri)),
        si = String.fromCharCode(32),
        ai = {
          beforeInput: {
            phasedRegistrationNames: {
              bubbled: "onBeforeInput",
              captured: "onBeforeInputCapture",
            },
            dependencies: ["compositionend", "keypress", "textInput", "paste"],
          },
          compositionEnd: {
            phasedRegistrationNames: {
              bubbled: "onCompositionEnd",
              captured: "onCompositionEndCapture",
            },
            dependencies:
              "blur compositionend keydown keypress keyup mousedown".split(" "),
          },
          compositionStart: {
            phasedRegistrationNames: {
              bubbled: "onCompositionStart",
              captured: "onCompositionStartCapture",
            },
            dependencies:
              "blur compositionstart keydown keypress keyup mousedown".split(
                " ",
              ),
          },
          compositionUpdate: {
            phasedRegistrationNames: {
              bubbled: "onCompositionUpdate",
              captured: "onCompositionUpdateCapture",
            },
            dependencies:
              "blur compositionupdate keydown keypress keyup mousedown".split(
                " ",
              ),
          },
        },
        li = !1,
        ci = !1,
        ui = {
          eventTypes: ai,
          extractEvents: function (e, t, n, r) {
            var i = void 0,
              o = void 0;
            if (ni)
              e: {
                switch (e) {
                  case "compositionstart":
                    i = ai.compositionStart;
                    break e;
                  case "compositionend":
                    i = ai.compositionEnd;
                    break e;
                  case "compositionupdate":
                    i = ai.compositionUpdate;
                    break e;
                }
                i = void 0;
              }
            else
              ci
                ? z(e, n) && (i = ai.compositionEnd)
                : "keydown" === e &&
                  229 === n.keyCode &&
                  (i = ai.compositionStart);
            return (
              i
                ? (oi &&
                    "ko" !== n.locale &&
                    (ci || i !== ai.compositionStart
                      ? i === ai.compositionEnd && ci && (o = P())
                      : ((Jr = r),
                        (Yr = "value" in Jr ? Jr.value : Jr.textContent),
                        (ci = !0))),
                  (i = Qr.getPooled(i, t, n, r)),
                  o ? (i.data = o) : null !== (o = F(n)) && (i.data = o),
                  T(i),
                  (o = i))
                : (o = null),
              (e = ii ? R(e, n) : B(e, n))
                ? ((t = ei.getPooled(ai.beforeInput, t, n, r)),
                  (t.data = e),
                  T(t))
                : (t = null),
              null === o ? t : null === t ? o : [o, t]
            );
          },
        },
        pi = null,
        di = null,
        hi = null,
        fi = !1,
        mi = {
          color: !0,
          date: !0,
          datetime: !0,
          "datetime-local": !0,
          email: !0,
          month: !0,
          number: !0,
          password: !0,
          range: !0,
          search: !0,
          tel: !0,
          text: !0,
          time: !0,
          url: !0,
          week: !0,
        },
        gi = br.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
        yi = /^(.*)[\\\/]/,
        vi = "function" == typeof Symbol && Symbol.for,
        bi = vi ? Symbol.for("react.element") : 60103,
        _i = vi ? Symbol.for("react.portal") : 60106,
        wi = vi ? Symbol.for("react.fragment") : 60107,
        Ci = vi ? Symbol.for("react.strict_mode") : 60108,
        Si = vi ? Symbol.for("react.profiler") : 60114,
        ki = vi ? Symbol.for("react.provider") : 60109,
        xi = vi ? Symbol.for("react.context") : 60110,
        Ei = vi ? Symbol.for("react.async_mode") : 60111,
        Ti = vi ? Symbol.for("react.forward_ref") : 60112,
        Ai = vi ? Symbol.for("react.placeholder") : 60113,
        Oi = "function" == typeof Symbol && Symbol.iterator,
        Pi =
          /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
        Ii = Object.prototype.hasOwnProperty,
        Di = {},
        Li = {},
        Ni = {};
      "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
        .split(" ")
        .forEach(function (e) {
          Ni[e] = new ae(e, 0, !1, e, null);
        }),
        [
          ["acceptCharset", "accept-charset"],
          ["className", "class"],
          ["htmlFor", "for"],
          ["httpEquiv", "http-equiv"],
        ].forEach(function (e) {
          var t = e[0];
          Ni[t] = new ae(t, 1, !1, e[1], null);
        }),
        ["contentEditable", "draggable", "spellCheck", "value"].forEach(
          function (e) {
            Ni[e] = new ae(e, 2, !1, e.toLowerCase(), null);
          },
        ),
        [
          "autoReverse",
          "externalResourcesRequired",
          "focusable",
          "preserveAlpha",
        ].forEach(function (e) {
          Ni[e] = new ae(e, 2, !1, e, null);
        }),
        "allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
          .split(" ")
          .forEach(function (e) {
            Ni[e] = new ae(e, 3, !1, e.toLowerCase(), null);
          }),
        ["checked", "multiple", "muted", "selected"].forEach(function (e) {
          Ni[e] = new ae(e, 3, !0, e, null);
        }),
        ["capture", "download"].forEach(function (e) {
          Ni[e] = new ae(e, 4, !1, e, null);
        }),
        ["cols", "rows", "size", "span"].forEach(function (e) {
          Ni[e] = new ae(e, 6, !1, e, null);
        }),
        ["rowSpan", "start"].forEach(function (e) {
          Ni[e] = new ae(e, 5, !1, e.toLowerCase(), null);
        });
      var Mi = /[\-:]([a-z])/g;
      "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
        .split(" ")
        .forEach(function (e) {
          var t = e.replace(Mi, le);
          Ni[t] = new ae(t, 1, !1, e, null);
        }),
        "xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type"
          .split(" ")
          .forEach(function (e) {
            var t = e.replace(Mi, le);
            Ni[t] = new ae(t, 1, !1, e, "http://www.w3.org/1999/xlink");
          }),
        ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
          var t = e.replace(Mi, le);
          Ni[t] = new ae(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace");
        }),
        (Ni.tabIndex = new ae("tabIndex", 1, !1, "tabindex", null));
      var ji = {
          change: {
            phasedRegistrationNames: {
              bubbled: "onChange",
              captured: "onChangeCapture",
            },
            dependencies:
              "blur change click focus input keydown keyup selectionchange".split(
                " ",
              ),
          },
        },
        zi = null,
        Fi = null,
        Ri = !1;
      Vr &&
        (Ri =
          J("input") && (!document.documentMode || 9 < document.documentMode));
      var Bi = {
          eventTypes: ji,
          _isInputEventSupported: Ri,
          extractEvents: function (e, t, n, r) {
            var i = t ? _(t) : window,
              o = void 0,
              s = void 0,
              a = i.nodeName && i.nodeName.toLowerCase();
            if (
              ("select" === a || ("input" === a && "file" === i.type)
                ? (o = _e)
                : Z(i)
                ? Ri
                  ? (o = Ee)
                  : ((o = ke), (s = Se))
                : (a = i.nodeName) &&
                  "input" === a.toLowerCase() &&
                  ("checkbox" === i.type || "radio" === i.type) &&
                  (o = xe),
              o && (o = o(e, t)))
            )
              return ye(o, n, r);
            s && s(e, i, t),
              "blur" === e &&
                (e = i._wrapperState) &&
                e.controlled &&
                "number" === i.type &&
                ge(i, "number", i.value);
          },
        },
        Vi = L.extend({ view: null, detail: null }),
        Ui = {
          Alt: "altKey",
          Control: "ctrlKey",
          Meta: "metaKey",
          Shift: "shiftKey",
        },
        qi = 0,
        Hi = 0,
        Wi = !1,
        $i = !1,
        Gi = Vi.extend({
          screenX: null,
          screenY: null,
          clientX: null,
          clientY: null,
          pageX: null,
          pageY: null,
          ctrlKey: null,
          shiftKey: null,
          altKey: null,
          metaKey: null,
          getModifierState: Ae,
          button: null,
          buttons: null,
          relatedTarget: function (e) {
            return (
              e.relatedTarget ||
              (e.fromElement === e.srcElement ? e.toElement : e.fromElement)
            );
          },
          movementX: function (e) {
            if ("movementX" in e) return e.movementX;
            var t = qi;
            return (
              (qi = e.screenX),
              Wi ? ("mousemove" === e.type ? e.screenX - t : 0) : ((Wi = !0), 0)
            );
          },
          movementY: function (e) {
            if ("movementY" in e) return e.movementY;
            var t = Hi;
            return (
              (Hi = e.screenY),
              $i ? ("mousemove" === e.type ? e.screenY - t : 0) : (($i = !0), 0)
            );
          },
        }),
        Zi = Gi.extend({
          pointerId: null,
          width: null,
          height: null,
          pressure: null,
          tangentialPressure: null,
          tiltX: null,
          tiltY: null,
          twist: null,
          pointerType: null,
          isPrimary: null,
        }),
        Ki = {
          mouseEnter: {
            registrationName: "onMouseEnter",
            dependencies: ["mouseout", "mouseover"],
          },
          mouseLeave: {
            registrationName: "onMouseLeave",
            dependencies: ["mouseout", "mouseover"],
          },
          pointerEnter: {
            registrationName: "onPointerEnter",
            dependencies: ["pointerout", "pointerover"],
          },
          pointerLeave: {
            registrationName: "onPointerLeave",
            dependencies: ["pointerout", "pointerover"],
          },
        },
        Ji = {
          eventTypes: Ki,
          extractEvents: function (e, t, n, r) {
            var i = "mouseover" === e || "pointerover" === e,
              o = "mouseout" === e || "pointerout" === e;
            if ((i && (n.relatedTarget || n.fromElement)) || (!o && !i))
              return null;
            if (
              ((i =
                r.window === r
                  ? r
                  : (i = r.ownerDocument)
                  ? i.defaultView || i.parentWindow
                  : window),
              o
                ? ((o = t),
                  (t = (t = n.relatedTarget || n.toElement) ? v(t) : null))
                : (o = null),
              o === t)
            )
              return null;
            var s = void 0,
              a = void 0,
              l = void 0,
              c = void 0;
            "mouseout" === e || "mouseover" === e
              ? ((s = Gi),
                (a = Ki.mouseLeave),
                (l = Ki.mouseEnter),
                (c = "mouse"))
              : ("pointerout" !== e && "pointerover" !== e) ||
                ((s = Zi),
                (a = Ki.pointerLeave),
                (l = Ki.pointerEnter),
                (c = "pointer"));
            var u = null == o ? i : _(o);
            if (
              ((i = null == t ? i : _(t)),
              (e = s.getPooled(a, o, n, r)),
              (e.type = c + "leave"),
              (e.target = u),
              (e.relatedTarget = i),
              (n = s.getPooled(l, t, n, r)),
              (n.type = c + "enter"),
              (n.target = i),
              (n.relatedTarget = u),
              (r = t),
              o && r)
            )
              e: {
                for (t = o, i = r, c = 0, s = t; s; s = C(s)) c++;
                for (s = 0, l = i; l; l = C(l)) s++;
                for (; 0 < c - s; ) (t = C(t)), c--;
                for (; 0 < s - c; ) (i = C(i)), s--;
                for (; c--; ) {
                  if (t === i || t === i.alternate) break e;
                  (t = C(t)), (i = C(i));
                }
                t = null;
              }
            else t = null;
            for (
              i = t, t = [];
              o && o !== i && (null === (c = o.alternate) || c !== i);

            )
              t.push(o), (o = C(o));
            for (
              o = [];
              r && r !== i && (null === (c = r.alternate) || c !== i);

            )
              o.push(r), (r = C(r));
            for (r = 0; r < t.length; r++) x(t[r], "bubbled", e);
            for (r = o.length; 0 < r--; ) x(o[r], "captured", n);
            return [e, n];
          },
        },
        Yi = Object.prototype.hasOwnProperty,
        Xi = L.extend({
          animationName: null,
          elapsedTime: null,
          pseudoElement: null,
        }),
        Qi = L.extend({
          clipboardData: function (e) {
            return "clipboardData" in e
              ? e.clipboardData
              : window.clipboardData;
          },
        }),
        eo = Vi.extend({ relatedTarget: null }),
        to = {
          Esc: "Escape",
          Spacebar: " ",
          Left: "ArrowLeft",
          Up: "ArrowUp",
          Right: "ArrowRight",
          Down: "ArrowDown",
          Del: "Delete",
          Win: "OS",
          Menu: "ContextMenu",
          Apps: "ContextMenu",
          Scroll: "ScrollLock",
          MozPrintableKey: "Unidentified",
        },
        no = {
          8: "Backspace",
          9: "Tab",
          12: "Clear",
          13: "Enter",
          16: "Shift",
          17: "Control",
          18: "Alt",
          19: "Pause",
          20: "CapsLock",
          27: "Escape",
          32: " ",
          33: "PageUp",
          34: "PageDown",
          35: "End",
          36: "Home",
          37: "ArrowLeft",
          38: "ArrowUp",
          39: "ArrowRight",
          40: "ArrowDown",
          45: "Insert",
          46: "Delete",
          112: "F1",
          113: "F2",
          114: "F3",
          115: "F4",
          116: "F5",
          117: "F6",
          118: "F7",
          119: "F8",
          120: "F9",
          121: "F10",
          122: "F11",
          123: "F12",
          144: "NumLock",
          145: "ScrollLock",
          224: "Meta",
        },
        ro = Vi.extend({
          key: function (e) {
            if (e.key) {
              var t = to[e.key] || e.key;
              if ("Unidentified" !== t) return t;
            }
            return "keypress" === e.type
              ? ((e = Me(e)), 13 === e ? "Enter" : String.fromCharCode(e))
              : "keydown" === e.type || "keyup" === e.type
              ? no[e.keyCode] || "Unidentified"
              : "";
          },
          location: null,
          ctrlKey: null,
          shiftKey: null,
          altKey: null,
          metaKey: null,
          repeat: null,
          locale: null,
          getModifierState: Ae,
          charCode: function (e) {
            return "keypress" === e.type ? Me(e) : 0;
          },
          keyCode: function (e) {
            return "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0;
          },
          which: function (e) {
            return "keypress" === e.type
              ? Me(e)
              : "keydown" === e.type || "keyup" === e.type
              ? e.keyCode
              : 0;
          },
        }),
        io = Gi.extend({ dataTransfer: null }),
        oo = Vi.extend({
          touches: null,
          targetTouches: null,
          changedTouches: null,
          altKey: null,
          metaKey: null,
          ctrlKey: null,
          shiftKey: null,
          getModifierState: Ae,
        }),
        so = L.extend({
          propertyName: null,
          elapsedTime: null,
          pseudoElement: null,
        }),
        ao = Gi.extend({
          deltaX: function (e) {
            return "deltaX" in e
              ? e.deltaX
              : "wheelDeltaX" in e
              ? -e.wheelDeltaX
              : 0;
          },
          deltaY: function (e) {
            return "deltaY" in e
              ? e.deltaY
              : "wheelDeltaY" in e
              ? -e.wheelDeltaY
              : "wheelDelta" in e
              ? -e.wheelDelta
              : 0;
          },
          deltaZ: null,
          deltaMode: null,
        }),
        lo = [
          ["abort", "abort"],
          [Wr, "animationEnd"],
          [$r, "animationIteration"],
          [Gr, "animationStart"],
          ["canplay", "canPlay"],
          ["canplaythrough", "canPlayThrough"],
          ["drag", "drag"],
          ["dragenter", "dragEnter"],
          ["dragexit", "dragExit"],
          ["dragleave", "dragLeave"],
          ["dragover", "dragOver"],
          ["durationchange", "durationChange"],
          ["emptied", "emptied"],
          ["encrypted", "encrypted"],
          ["ended", "ended"],
          ["error", "error"],
          ["gotpointercapture", "gotPointerCapture"],
          ["load", "load"],
          ["loadeddata", "loadedData"],
          ["loadedmetadata", "loadedMetadata"],
          ["loadstart", "loadStart"],
          ["lostpointercapture", "lostPointerCapture"],
          ["mousemove", "mouseMove"],
          ["mouseout", "mouseOut"],
          ["mouseover", "mouseOver"],
          ["playing", "playing"],
          ["pointermove", "pointerMove"],
          ["pointerout", "pointerOut"],
          ["pointerover", "pointerOver"],
          ["progress", "progress"],
          ["scroll", "scroll"],
          ["seeking", "seeking"],
          ["stalled", "stalled"],
          ["suspend", "suspend"],
          ["timeupdate", "timeUpdate"],
          ["toggle", "toggle"],
          ["touchmove", "touchMove"],
          [Zr, "transitionEnd"],
          ["waiting", "waiting"],
          ["wheel", "wheel"],
        ],
        co = {},
        uo = {};
      [
        ["blur", "blur"],
        ["cancel", "cancel"],
        ["click", "click"],
        ["close", "close"],
        ["contextmenu", "contextMenu"],
        ["copy", "copy"],
        ["cut", "cut"],
        ["auxclick", "auxClick"],
        ["dblclick", "doubleClick"],
        ["dragend", "dragEnd"],
        ["dragstart", "dragStart"],
        ["drop", "drop"],
        ["focus", "focus"],
        ["input", "input"],
        ["invalid", "invalid"],
        ["keydown", "keyDown"],
        ["keypress", "keyPress"],
        ["keyup", "keyUp"],
        ["mousedown", "mouseDown"],
        ["mouseup", "mouseUp"],
        ["paste", "paste"],
        ["pause", "pause"],
        ["play", "play"],
        ["pointercancel", "pointerCancel"],
        ["pointerdown", "pointerDown"],
        ["pointerup", "pointerUp"],
        ["ratechange", "rateChange"],
        ["reset", "reset"],
        ["seeked", "seeked"],
        ["submit", "submit"],
        ["touchcancel", "touchCancel"],
        ["touchend", "touchEnd"],
        ["touchstart", "touchStart"],
        ["volumechange", "volumeChange"],
      ].forEach(function (e) {
        je(e, !0);
      }),
        lo.forEach(function (e) {
          je(e, !1);
        });
      var po = {
          eventTypes: co,
          isInteractiveTopLevelEventType: function (e) {
            return void 0 !== (e = uo[e]) && !0 === e.isInteractive;
          },
          extractEvents: function (e, t, n, r) {
            var i = uo[e];
            if (!i) return null;
            switch (e) {
              case "keypress":
                if (0 === Me(n)) return null;
              case "keydown":
              case "keyup":
                e = ro;
                break;
              case "blur":
              case "focus":
                e = eo;
                break;
              case "click":
                if (2 === n.button) return null;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                e = Gi;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                e = io;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                e = oo;
                break;
              case Wr:
              case $r:
              case Gr:
                e = Xi;
                break;
              case Zr:
                e = so;
                break;
              case "scroll":
                e = Vi;
                break;
              case "wheel":
                e = ao;
                break;
              case "copy":
              case "cut":
              case "paste":
                e = Qi;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                e = Zi;
                break;
              default:
                e = L;
            }
            return (t = e.getPooled(i, t, n, r)), T(t), t;
          },
        },
        ho = po.isInteractiveTopLevelEventType,
        fo = [],
        mo = !0,
        go = {},
        yo = 0,
        vo = "_reactListenersID" + ("" + Math.random()).slice(2),
        bo = Vr && "documentMode" in document && 11 >= document.documentMode,
        _o = {
          select: {
            phasedRegistrationNames: {
              bubbled: "onSelect",
              captured: "onSelectCapture",
            },
            dependencies:
              "blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(
                " ",
              ),
          },
        },
        wo = null,
        Co = null,
        So = null,
        ko = !1,
        xo = {
          eventTypes: _o,
          extractEvents: function (e, t, n, r) {
            var i,
              o =
                r.window === r
                  ? r.document
                  : 9 === r.nodeType
                  ? r
                  : r.ownerDocument;
            if (!(i = !o)) {
              e: {
                (o = Ue(o)), (i = Dr.onSelect);
                for (var s = 0; s < i.length; s++) {
                  var a = i[s];
                  if (!o.hasOwnProperty(a) || !o[a]) {
                    o = !1;
                    break e;
                  }
                }
                o = !0;
              }
              i = !o;
            }
            if (i) return null;
            switch (((o = t ? _(t) : window), e)) {
              case "focus":
                (Z(o) || "true" === o.contentEditable) &&
                  ((wo = o), (Co = t), (So = null));
                break;
              case "blur":
                So = Co = wo = null;
                break;
              case "mousedown":
                ko = !0;
                break;
              case "contextmenu":
              case "mouseup":
              case "dragend":
                return (ko = !1), Ke(n, r);
              case "selectionchange":
                if (bo) break;
              case "keydown":
              case "keyup":
                return Ke(n, r);
            }
            return null;
          },
        };
      zr.injectEventPluginOrder(
        "ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(
          " ",
        ),
      ),
        (Lr = w),
        (Nr = b),
        (Mr = _),
        zr.injectEventPluginsByName({
          SimpleEventPlugin: po,
          EnterLeaveEventPlugin: Ji,
          ChangeEventPlugin: Bi,
          SelectEventPlugin: xo,
          BeforeInputEventPlugin: ui,
        });
      var Eo = {
          html: "http://www.w3.org/1999/xhtml",
          mathml: "http://www.w3.org/1998/Math/MathML",
          svg: "http://www.w3.org/2000/svg",
        },
        To = void 0,
        Ao = (function (e) {
          return "undefined" != typeof MSApp && MSApp.execUnsafeLocalFunction
            ? function (t, n, r, i) {
                MSApp.execUnsafeLocalFunction(function () {
                  return e(t, n);
                });
              }
            : e;
        })(function (e, t) {
          if (e.namespaceURI !== Eo.svg || "innerHTML" in e) e.innerHTML = t;
          else {
            for (
              To = To || document.createElement("div"),
                To.innerHTML = "<svg>" + t + "</svg>",
                t = To.firstChild;
              e.firstChild;

            )
              e.removeChild(e.firstChild);
            for (; t.firstChild; ) e.appendChild(t.firstChild);
          }
        }),
        Oo = {
          animationIterationCount: !0,
          borderImageOutset: !0,
          borderImageSlice: !0,
          borderImageWidth: !0,
          boxFlex: !0,
          boxFlexGroup: !0,
          boxOrdinalGroup: !0,
          columnCount: !0,
          columns: !0,
          flex: !0,
          flexGrow: !0,
          flexPositive: !0,
          flexShrink: !0,
          flexNegative: !0,
          flexOrder: !0,
          gridArea: !0,
          gridRow: !0,
          gridRowEnd: !0,
          gridRowSpan: !0,
          gridRowStart: !0,
          gridColumn: !0,
          gridColumnEnd: !0,
          gridColumnSpan: !0,
          gridColumnStart: !0,
          fontWeight: !0,
          lineClamp: !0,
          lineHeight: !0,
          opacity: !0,
          order: !0,
          orphans: !0,
          tabSize: !0,
          widows: !0,
          zIndex: !0,
          zoom: !0,
          fillOpacity: !0,
          floodOpacity: !0,
          stopOpacity: !0,
          strokeDasharray: !0,
          strokeDashoffset: !0,
          strokeMiterlimit: !0,
          strokeOpacity: !0,
          strokeWidth: !0,
        },
        Po = ["Webkit", "ms", "Moz", "O"];
      Object.keys(Oo).forEach(function (e) {
        Po.forEach(function (t) {
          (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Oo[t] = Oo[e]);
        });
      });
      var Io = _r(
          { menuitem: !0 },
          {
            area: !0,
            base: !0,
            br: !0,
            col: !0,
            embed: !0,
            hr: !0,
            img: !0,
            input: !0,
            keygen: !0,
            link: !0,
            meta: !0,
            param: !0,
            source: !0,
            track: !0,
            wbr: !0,
          },
        ),
        Do = null,
        Lo = null;
      new Set();
      var No = [],
        Mo = -1,
        jo = {},
        zo = { current: jo },
        Fo = { current: !1 },
        Ro = jo,
        Bo = null,
        Vo = null,
        Uo = !1,
        qo = { current: null },
        Ho = null,
        Wo = null,
        $o = null,
        Go = {},
        Zo = { current: Go },
        Ko = { current: Go },
        Jo = { current: Go },
        Yo = new br.Component().refs,
        Xo = {
          isMounted: function (e) {
            return !!(e = e._reactInternalFiber) && 2 === Ie(e);
          },
          enqueueSetState: function (e, t, n) {
            e = e._reactInternalFiber;
            var r = Jn();
            r = Wn(r, e);
            var i = Ft(r);
            (i.payload = t),
              void 0 !== n && null !== n && (i.callback = n),
              Bt(e, i),
              $n(e, r);
          },
          enqueueReplaceState: function (e, t, n) {
            e = e._reactInternalFiber;
            var r = Jn();
            r = Wn(r, e);
            var i = Ft(r);
            (i.tag = 1),
              (i.payload = t),
              void 0 !== n && null !== n && (i.callback = n),
              Bt(e, i),
              $n(e, r);
          },
          enqueueForceUpdate: function (e, t) {
            e = e._reactInternalFiber;
            var n = Jn();
            n = Wn(n, e);
            var r = Ft(n);
            (r.tag = 2),
              void 0 !== t && null !== t && (r.callback = t),
              Bt(e, r),
              $n(e, n);
          },
        },
        Qo = Array.isArray,
        es = un(!0),
        ts = un(!1),
        ns = null,
        rs = null,
        is = !1,
        os = gi.ReactCurrentOwner,
        ss = void 0,
        as = void 0,
        ls = void 0;
      (ss = function () {}),
        (as = function (e, t, n, r, i) {
          var o = e.memoizedProps;
          if (o !== r) {
            var s = t.stateNode;
            switch ((Xt(Zo.current), (e = null), n)) {
              case "input":
                (o = pe(s, o)), (r = pe(s, r)), (e = []);
                break;
              case "option":
                (o = Ye(s, o)), (r = Ye(s, r)), (e = []);
                break;
              case "select":
                (o = _r({}, o, { value: void 0 })),
                  (r = _r({}, r, { value: void 0 })),
                  (e = []);
                break;
              case "textarea":
                (o = Qe(s, o)), (r = Qe(s, r)), (e = []);
                break;
              default:
                "function" != typeof o.onClick &&
                  "function" == typeof r.onClick &&
                  (s.onclick = ut);
            }
            at(n, r), (s = n = void 0);
            var a = null;
            for (n in o)
              if (!r.hasOwnProperty(n) && o.hasOwnProperty(n) && null != o[n])
                if ("style" === n) {
                  var l = o[n];
                  for (s in l)
                    l.hasOwnProperty(s) && (a || (a = {}), (a[s] = ""));
                } else
                  "dangerouslySetInnerHTML" !== n &&
                    "children" !== n &&
                    "suppressContentEditableWarning" !== n &&
                    "suppressHydrationWarning" !== n &&
                    "autoFocus" !== n &&
                    (Ir.hasOwnProperty(n)
                      ? e || (e = [])
                      : (e = e || []).push(n, null));
            for (n in r) {
              var c = r[n];
              if (
                ((l = null != o ? o[n] : void 0),
                r.hasOwnProperty(n) && c !== l && (null != c || null != l))
              )
                if ("style" === n)
                  if (l) {
                    for (s in l)
                      !l.hasOwnProperty(s) ||
                        (c && c.hasOwnProperty(s)) ||
                        (a || (a = {}), (a[s] = ""));
                    for (s in c)
                      c.hasOwnProperty(s) &&
                        l[s] !== c[s] &&
                        (a || (a = {}), (a[s] = c[s]));
                  } else a || (e || (e = []), e.push(n, a)), (a = c);
                else
                  "dangerouslySetInnerHTML" === n
                    ? ((c = c ? c.__html : void 0),
                      (l = l ? l.__html : void 0),
                      null != c && l !== c && (e = e || []).push(n, "" + c))
                    : "children" === n
                    ? l === c ||
                      ("string" != typeof c && "number" != typeof c) ||
                      (e = e || []).push(n, "" + c)
                    : "suppressContentEditableWarning" !== n &&
                      "suppressHydrationWarning" !== n &&
                      (Ir.hasOwnProperty(n)
                        ? (null != c && ct(i, n), e || l === c || (e = []))
                        : (e = e || []).push(n, c));
            }
            a && (e = e || []).push("style", a),
              (i = e),
              (t.updateQueue = i) && On(t);
          }
        }),
        (ls = function (e, t, n, r) {
          n !== r && On(t);
        });
      var cs = { readContext: Yt },
        us = gi.ReactCurrentOwner,
        ps = 0,
        ds = 0,
        hs = !1,
        fs = null,
        ms = null,
        gs = 0,
        ys = !1,
        vs = null,
        bs = !1,
        _s = null,
        ws = null,
        Cs = null,
        Ss = 0,
        ks = void 0,
        xs = !1,
        Es = null,
        Ts = 0,
        As = 0,
        Os = !1,
        Ps = !1,
        Is = null,
        Ds = null,
        Ls = !1,
        Ns = !1,
        Ms = !1,
        js = null,
        zs = wr.unstable_now(),
        Fs = 2 + ((zs / 10) | 0),
        Rs = Fs,
        Bs = 50,
        Vs = 0,
        Us = null,
        qs = 1;
      (pi = function (e, t, n) {
        switch (t) {
          case "input":
            if ((fe(e, n), (t = n.name), "radio" === n.type && null != t)) {
              for (n = e; n.parentNode; ) n = n.parentNode;
              for (
                n = n.querySelectorAll(
                  "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
                ),
                  t = 0;
                t < n.length;
                t++
              ) {
                var r = n[t];
                if (r !== e && r.form === e.form) {
                  var o = w(r);
                  o || i("90"), ee(r), fe(r, o);
                }
              }
            }
            break;
          case "textarea":
            tt(e, n);
            break;
          case "select":
            null != (t = n.value) && Xe(e, !!n.multiple, t, !1);
        }
      }),
        (dr.prototype.render = function (e) {
          this._defer || i("250"),
            (this._hasChildren = !0),
            (this._children = e);
          var t = this._root._internalRoot,
            n = this._expirationTime,
            r = new hr();
          return lr(e, t, null, n, r._onCommit), r;
        }),
        (dr.prototype.then = function (e) {
          if (this._didComplete) e();
          else {
            var t = this._callbacks;
            null === t && (t = this._callbacks = []), t.push(e);
          }
        }),
        (dr.prototype.commit = function () {
          var e = this._root._internalRoot,
            t = e.firstBatch;
          if (((this._defer && null !== t) || i("251"), this._hasChildren)) {
            var n = this._expirationTime;
            if (t !== this) {
              this._hasChildren &&
                ((n = this._expirationTime = t._expirationTime),
                this.render(this._children));
              for (var r = null, o = t; o !== this; ) (r = o), (o = o._next);
              null === r && i("251"),
                (r._next = o._next),
                (this._next = t),
                (e.firstBatch = this);
            }
            (this._defer = !1),
              (t = n),
              xs && i("253"),
              (Es = e),
              (Ts = t),
              er(e, t, !0),
              Qn(1, null),
              (t = this._next),
              (this._next = null),
              (t = e.firstBatch = t),
              null !== t && t._hasChildren && t.render(t._children);
          } else (this._next = null), (this._defer = !1);
        }),
        (dr.prototype._onComplete = function () {
          if (!this._didComplete) {
            this._didComplete = !0;
            var e = this._callbacks;
            if (null !== e) for (var t = 0; t < e.length; t++) (0, e[t])();
          }
        }),
        (hr.prototype.then = function (e) {
          if (this._didCommit) e();
          else {
            var t = this._callbacks;
            null === t && (t = this._callbacks = []), t.push(e);
          }
        }),
        (hr.prototype._onCommit = function () {
          if (!this._didCommit) {
            this._didCommit = !0;
            var e = this._callbacks;
            if (null !== e)
              for (var t = 0; t < e.length; t++) {
                var n = e[t];
                "function" != typeof n && i("191", n), n();
              }
          }
        }),
        (fr.prototype.render = function (e, t) {
          var n = this._internalRoot,
            r = new hr();
          return (
            (t = void 0 === t ? null : t),
            null !== t && r.then(t),
            cr(e, n, null, r._onCommit),
            r
          );
        }),
        (fr.prototype.unmount = function (e) {
          var t = this._internalRoot,
            n = new hr();
          return (
            (e = void 0 === e ? null : e),
            null !== e && n.then(e),
            cr(null, t, null, n._onCommit),
            n
          );
        }),
        (fr.prototype.legacy_renderSubtreeIntoContainer = function (e, t, n) {
          var r = this._internalRoot,
            i = new hr();
          return (
            (n = void 0 === n ? null : n),
            null !== n && i.then(n),
            cr(t, r, e, i._onCommit),
            i
          );
        }),
        (fr.prototype.createBatch = function () {
          var e = new dr(this),
            t = e._expirationTime,
            n = this._internalRoot,
            r = n.firstBatch;
          if (null === r) (n.firstBatch = e), (e._next = null);
          else {
            for (n = null; null !== r && r._expirationTime <= t; )
              (n = r), (r = r._next);
            (e._next = r), null !== n && (n._next = e);
          }
          return e;
        }),
        (H = ir),
        (W = sr),
        ($ = function () {
          xs || 0 === As || (Qn(As, null), (As = 0));
        });
      var Hs = {
        createPortal: vr,
        findDOMNode: function (e) {
          if (null == e) return null;
          if (1 === e.nodeType) return e;
          var t = e._reactInternalFiber;
          return (
            void 0 === t &&
              ("function" == typeof e.render
                ? i("188")
                : i("268", Object.keys(e))),
            (e = Ne(t)),
            (e = null === e ? null : e.stateNode)
          );
        },
        hydrate: function (e, t, n) {
          return yr(null, e, t, !0, n);
        },
        render: function (e, t, n) {
          return yr(null, e, t, !1, n);
        },
        unstable_renderSubtreeIntoContainer: function (e, t, n, r) {
          return (
            (null == e || void 0 === e._reactInternalFiber) && i("38"),
            yr(e, t, n, !1, r)
          );
        },
        unmountComponentAtNode: function (e) {
          return (
            mr(e) || i("40"),
            !!e._reactRootContainer &&
              (or(function () {
                yr(null, null, e, !1, function () {
                  e._reactRootContainer = null;
                });
              }),
              !0)
          );
        },
        unstable_createPortal: function () {
          return vr.apply(void 0, arguments);
        },
        unstable_batchedUpdates: ir,
        unstable_interactiveUpdates: sr,
        flushSync: function (e, t) {
          xs && i("187");
          var n = Ls;
          Ls = !0;
          try {
            return Gn(e, t);
          } finally {
            (Ls = n), Qn(1, null);
          }
        },
        unstable_flushControlled: function (e) {
          var t = Ls;
          Ls = !0;
          try {
            Gn(e);
          } finally {
            (Ls = t) || xs || Qn(1, null);
          }
        },
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
          Events: [
            b,
            _,
            w,
            zr.injectEventPluginsByName,
            Pr,
            T,
            function (e) {
              d(e, E);
            },
            U,
            q,
            Ve,
            y,
          ],
        },
        unstable_createRoot: function (e, t) {
          return (
            mr(e) || i("278"), new fr(e, !0, null != t && !0 === t.hydrate)
          );
        },
      };
      !(function (e) {
        var t = e.findFiberByHostInstance;
        Et(
          _r({}, e, {
            findHostInstanceByFiber: function (e) {
              return (e = Ne(e)), null === e ? null : e.stateNode;
            },
            findFiberByHostInstance: function (e) {
              return t ? t(e) : null;
            },
          }),
        );
      })({
        findFiberByHostInstance: v,
        bundleType: 0,
        version: "16.5.2",
        rendererPackageName: "react-dom",
      });
      var Ws = { default: Hs },
        $s = (Ws && Hs) || Ws;
      e.exports = $s.default || $s;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      function i(e, t) {
        if (!e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        return !t || ("object" != typeof t && "function" != typeof t) ? e : t;
      }
      function o(e, t) {
        if ("function" != typeof t && null !== t)
          throw new TypeError(
            "Super expression must either be null or a function, not " +
              typeof t,
          );
        (e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
          t &&
            (Object.setPrototypeOf
              ? Object.setPrototypeOf(e, t)
              : (e.__proto__ = t));
      }
      function s() {
        var e,
          t =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : "store",
          n = arguments[1],
          s = n || t + "Subscription",
          l = (function (e) {
            function n(o, s) {
              r(this, n);
              var a = i(this, e.call(this, o, s));
              return (a[t] = o.store), a;
            }
            return (
              o(n, e),
              (n.prototype.getChildContext = function () {
                var e;
                return (e = {}), (e[t] = this[t]), (e[s] = null), e;
              }),
              (n.prototype.render = function () {
                return a.Children.only(this.props.children);
              }),
              n
            );
          })(a.Component);
        return (
          (l.propTypes = {
            store: u.a.isRequired,
            children: c.a.element.isRequired,
          }),
          (l.childContextTypes =
            ((e = {}), (e[t] = u.a.isRequired), (e[s] = u.b), e)),
          (l.displayName = "Provider"),
          l
        );
      }
      var a = n(2),
        l = (n.n(a), n(53)),
        c = n.n(l),
        u = n(56);
      n(31);
      t.b = s;
      t.a = s();
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        var n = {};
        for (var r in e)
          t.indexOf(r) >= 0 ||
            (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]));
        return n;
      }
      function i(e, t, n) {
        for (var r = t.length - 1; r >= 0; r--) {
          var i = t[r](e);
          if (i) return i;
        }
        return function (t, r) {
          throw new Error(
            "Invalid value of type " +
              typeof e +
              " for " +
              n +
              " argument when connecting component " +
              r.wrappedComponentName +
              ".",
          );
        };
      }
      function o(e, t) {
        return e === t;
      }
      var s = n(54),
        a = n(195),
        l = n(189),
        c = n(190),
        u = n(191),
        p = n(192),
        d =
          Object.assign ||
          function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          };
      t.a = (function () {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.connectHOC,
          n = void 0 === t ? s.a : t,
          h = e.mapStateToPropsFactories,
          f = void 0 === h ? c.a : h,
          m = e.mapDispatchToPropsFactories,
          g = void 0 === m ? l.a : m,
          y = e.mergePropsFactories,
          v = void 0 === y ? u.a : y,
          b = e.selectorFactory,
          _ = void 0 === b ? p.a : b;
        return function (e, t, s) {
          var l =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {},
            c = l.pure,
            u = void 0 === c || c,
            p = l.areStatesEqual,
            h = void 0 === p ? o : p,
            m = l.areOwnPropsEqual,
            y = void 0 === m ? a.a : m,
            b = l.areStatePropsEqual,
            w = void 0 === b ? a.a : b,
            C = l.areMergedPropsEqual,
            S = void 0 === C ? a.a : C,
            k = r(l, [
              "pure",
              "areStatesEqual",
              "areOwnPropsEqual",
              "areStatePropsEqual",
              "areMergedPropsEqual",
            ]),
            x = i(e, f, "mapStateToProps"),
            E = i(t, g, "mapDispatchToProps"),
            T = i(s, v, "mergeProps");
          return n(
            _,
            d(
              {
                methodName: "connect",
                getDisplayName: function (e) {
                  return "Connect(" + e + ")";
                },
                shouldHandleStateChanges: Boolean(e),
                initMapStateToProps: x,
                initMapDispatchToProps: E,
                initMergeProps: T,
                pure: u,
                areStatesEqual: h,
                areOwnPropsEqual: y,
                areStatePropsEqual: w,
                areMergedPropsEqual: S,
              },
              k,
            ),
          );
        };
      })();
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return "function" == typeof e
          ? n.i(a.a)(e, "mapDispatchToProps")
          : void 0;
      }
      function i(e) {
        return e
          ? void 0
          : n.i(a.b)(function (e) {
              return { dispatch: e };
            });
      }
      function o(e) {
        return e && "object" == typeof e
          ? n.i(a.b)(function (t) {
              return n.i(s.bindActionCreators)(e, t);
            })
          : void 0;
      }
      var s = n(32),
        a = n(55);
      t.a = [r, i, o];
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return "function" == typeof e ? n.i(o.a)(e, "mapStateToProps") : void 0;
      }
      function i(e) {
        return e
          ? void 0
          : n.i(o.b)(function () {
              return {};
            });
      }
      var o = n(55);
      t.a = [r, i];
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        return a({}, n, e, t);
      }
      function i(e) {
        return function (t, n) {
          var r = (n.displayName, n.pure),
            i = n.areMergedPropsEqual,
            o = !1,
            s = void 0;
          return function (t, n, a) {
            var l = e(t, n, a);
            return o ? (r && i(l, s)) || (s = l) : ((o = !0), (s = l)), s;
          };
        };
      }
      function o(e) {
        return "function" == typeof e ? i(e) : void 0;
      }
      function s(e) {
        return e
          ? void 0
          : function () {
              return r;
            };
      }
      var a =
        (n(57),
        Object.assign ||
          function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          });
      t.a = [o, s];
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        var n = {};
        for (var r in e)
          t.indexOf(r) >= 0 ||
            (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]));
        return n;
      }
      function i(e, t, n, r) {
        return function (i, o) {
          return n(e(i, o), t(r, o), o);
        };
      }
      function o(e, t, n, r, i) {
        function o(i, o) {
          return (
            (f = i),
            (m = o),
            (g = e(f, m)),
            (y = t(r, m)),
            (v = n(g, y, m)),
            (h = !0),
            v
          );
        }
        function s() {
          return (
            (g = e(f, m)),
            t.dependsOnOwnProps && (y = t(r, m)),
            (v = n(g, y, m))
          );
        }
        function a() {
          return (
            e.dependsOnOwnProps && (g = e(f, m)),
            t.dependsOnOwnProps && (y = t(r, m)),
            (v = n(g, y, m))
          );
        }
        function l() {
          var t = e(f, m),
            r = !d(t, g);
          return (g = t), r && (v = n(g, y, m)), v;
        }
        function c(e, t) {
          var n = !p(t, m),
            r = !u(e, f);
          return (f = e), (m = t), n && r ? s() : n ? a() : r ? l() : v;
        }
        var u = i.areStatesEqual,
          p = i.areOwnPropsEqual,
          d = i.areStatePropsEqual,
          h = !1,
          f = void 0,
          m = void 0,
          g = void 0,
          y = void 0,
          v = void 0;
        return function (e, t) {
          return h ? c(e, t) : o(e, t);
        };
      }
      function s(e, t) {
        var n = t.initMapStateToProps,
          s = t.initMapDispatchToProps,
          a = t.initMergeProps,
          l = r(t, [
            "initMapStateToProps",
            "initMapDispatchToProps",
            "initMergeProps",
          ]),
          c = n(e, l),
          u = s(e, l),
          p = a(e, l);
        return (l.pure ? o : i)(c, u, p, e, l);
      }
      n(193);
      t.a = s;
    },
    function (e, t, n) {
      "use strict";
      n(31);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      function i() {
        var e = [],
          t = [];
        return {
          clear: function () {
            (t = o), (e = o);
          },
          notify: function () {
            for (var n = (e = t), r = 0; r < n.length; r++) n[r]();
          },
          subscribe: function (n) {
            var r = !0;
            return (
              t === e && (t = e.slice()),
              t.push(n),
              function () {
                r &&
                  e !== o &&
                  ((r = !1),
                  t === e && (t = e.slice()),
                  t.splice(t.indexOf(n), 1));
              }
            );
          },
        };
      }
      n.d(t, "a", function () {
        return a;
      });
      var o = null,
        s = { notify: function () {} },
        a = (function () {
          function e(t, n, i) {
            r(this, e),
              (this.store = t),
              (this.parentSub = n),
              (this.onStateChange = i),
              (this.unsubscribe = null),
              (this.listeners = s);
          }
          return (
            (e.prototype.addNestedSub = function (e) {
              return this.trySubscribe(), this.listeners.subscribe(e);
            }),
            (e.prototype.notifyNestedSubs = function () {
              this.listeners.notify();
            }),
            (e.prototype.isSubscribed = function () {
              return Boolean(this.unsubscribe);
            }),
            (e.prototype.trySubscribe = function () {
              this.unsubscribe ||
                ((this.unsubscribe = this.parentSub
                  ? this.parentSub.addNestedSub(this.onStateChange)
                  : this.store.subscribe(this.onStateChange)),
                (this.listeners = i()));
            }),
            (e.prototype.tryUnsubscribe = function () {
              this.unsubscribe &&
                (this.unsubscribe(),
                (this.unsubscribe = null),
                this.listeners.clear(),
                (this.listeners = s));
            }),
            e
          );
        })();
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return e === t
          ? 0 !== e || 0 !== t || 1 / e == 1 / t
          : e !== e && t !== t;
      }
      function i(e, t) {
        if (r(e, t)) return !0;
        if (
          "object" != typeof e ||
          null === e ||
          "object" != typeof t ||
          null === t
        )
          return !1;
        var n = Object.keys(e),
          i = Object.keys(t);
        if (n.length !== i.length) return !1;
        for (var s = 0; s < n.length; s++)
          if (!o.call(t, n[s]) || !r(e[n[s]], t[n[s]])) return !1;
        return !0;
      }
      t.a = i;
      var o = Object.prototype.hasOwnProperty;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n, r, i, o, s, a) {
        if (!e) {
          if (((e = void 0), void 0 === t))
            e = Error(
              "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.",
            );
          else {
            var l = [n, r, i, o, s, a],
              c = 0;
            (e = Error(
              t.replace(/%s/g, function () {
                return l[c++];
              }),
            )),
              (e.name = "Invariant Violation");
          }
          throw ((e.framesToPop = 1), e);
        }
      }
      function i(e) {
        for (
          var t = arguments.length - 1,
            n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e,
            i = 0;
          i < t;
          i++
        )
          n += "&args[]=" + encodeURIComponent(arguments[i + 1]);
        r(
          !1,
          "Minified React error #" +
            e +
            "; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",
          n,
        );
      }
      function o(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = N),
          (this.updater = n || L);
      }
      function s() {}
      function a(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = N),
          (this.updater = n || L);
      }
      function l(e, t, n) {
        var r = void 0,
          i = {},
          o = null,
          s = null;
        if (null != t)
          for (r in (void 0 !== t.ref && (s = t.ref),
          void 0 !== t.key && (o = "" + t.key),
          t))
            z.call(t, r) && !F.hasOwnProperty(r) && (i[r] = t[r]);
        var a = arguments.length - 2;
        if (1 === a) i.children = n;
        else if (1 < a) {
          for (var l = Array(a), c = 0; c < a; c++) l[c] = arguments[c + 2];
          i.children = l;
        }
        if (e && e.defaultProps)
          for (r in (a = e.defaultProps)) void 0 === i[r] && (i[r] = a[r]);
        return {
          $$typeof: S,
          type: e,
          key: o,
          ref: s,
          props: i,
          _owner: j.current,
        };
      }
      function c(e, t) {
        return {
          $$typeof: S,
          type: e.type,
          key: t,
          ref: e.ref,
          props: e.props,
          _owner: e._owner,
        };
      }
      function u(e) {
        return "object" == typeof e && null !== e && e.$$typeof === S;
      }
      function p(e) {
        var t = { "=": "=0", ":": "=2" };
        return (
          "$" +
          ("" + e).replace(/[=:]/g, function (e) {
            return t[e];
          })
        );
      }
      function d(e, t, n, r) {
        if (B.length) {
          var i = B.pop();
          return (
            (i.result = e),
            (i.keyPrefix = t),
            (i.func = n),
            (i.context = r),
            (i.count = 0),
            i
          );
        }
        return { result: e, keyPrefix: t, func: n, context: r, count: 0 };
      }
      function h(e) {
        (e.result = null),
          (e.keyPrefix = null),
          (e.func = null),
          (e.context = null),
          (e.count = 0),
          10 > B.length && B.push(e);
      }
      function f(e, t, n, r) {
        var o = typeof e;
        ("undefined" !== o && "boolean" !== o) || (e = null);
        var s = !1;
        if (null === e) s = !0;
        else
          switch (o) {
            case "string":
            case "number":
              s = !0;
              break;
            case "object":
              switch (e.$$typeof) {
                case S:
                case k:
                  s = !0;
              }
          }
        if (s) return n(r, e, "" === t ? "." + g(e, 0) : t), 1;
        if (((s = 0), (t = "" === t ? "." : t + ":"), Array.isArray(e)))
          for (var a = 0; a < e.length; a++) {
            o = e[a];
            var l = t + g(o, a);
            s += f(o, l, n, r);
          }
        else if (
          (null === e || "object" != typeof e
            ? (l = null)
            : ((l = (D && e[D]) || e["@@iterator"]),
              (l = "function" == typeof l ? l : null)),
          "function" == typeof l)
        )
          for (e = l.call(e), a = 0; !(o = e.next()).done; )
            (o = o.value), (l = t + g(o, a++)), (s += f(o, l, n, r));
        else
          "object" === o &&
            ((n = "" + e),
            i(
              "31",
              "[object Object]" === n
                ? "object with keys {" + Object.keys(e).join(", ") + "}"
                : n,
              "",
            ));
        return s;
      }
      function m(e, t, n) {
        return null == e ? 0 : f(e, "", t, n);
      }
      function g(e, t) {
        return "object" == typeof e && null !== e && null != e.key
          ? p(e.key)
          : t.toString(36);
      }
      function y(e, t) {
        e.func.call(e.context, t, e.count++);
      }
      function v(e, t, n) {
        var r = e.result,
          i = e.keyPrefix;
        (e = e.func.call(e.context, t, e.count++)),
          Array.isArray(e)
            ? b(e, r, n, function (e) {
                return e;
              })
            : null != e &&
              (u(e) &&
                (e = c(
                  e,
                  i +
                    (!e.key || (t && t.key === e.key)
                      ? ""
                      : ("" + e.key).replace(R, "$&/") + "/") +
                    n,
                )),
              r.push(e));
      }
      function b(e, t, n, r, i) {
        var o = "";
        null != n && (o = ("" + n).replace(R, "$&/") + "/"),
          (t = d(t, o, r, i)),
          m(e, v, t),
          h(t);
      }
      function _(e, t) {
        var n = j.currentDispatcher;
        return null === n && i("277"), n.readContext(e, t);
      } /** @license React v16.5.2
       * react.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      var w = n(52),
        C = "function" == typeof Symbol && Symbol.for,
        S = C ? Symbol.for("react.element") : 60103,
        k = C ? Symbol.for("react.portal") : 60106,
        x = C ? Symbol.for("react.fragment") : 60107,
        E = C ? Symbol.for("react.strict_mode") : 60108,
        T = C ? Symbol.for("react.profiler") : 60114,
        A = C ? Symbol.for("react.provider") : 60109,
        O = C ? Symbol.for("react.context") : 60110,
        P = C ? Symbol.for("react.async_mode") : 60111,
        I = C ? Symbol.for("react.forward_ref") : 60112;
      C && Symbol.for("react.placeholder");
      var D = "function" == typeof Symbol && Symbol.iterator,
        L = {
          isMounted: function () {
            return !1;
          },
          enqueueForceUpdate: function () {},
          enqueueReplaceState: function () {},
          enqueueSetState: function () {},
        },
        N = {};
      (o.prototype.isReactComponent = {}),
        (o.prototype.setState = function (e, t) {
          "object" != typeof e &&
            "function" != typeof e &&
            null != e &&
            i("85"),
            this.updater.enqueueSetState(this, e, t, "setState");
        }),
        (o.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, "forceUpdate");
        }),
        (s.prototype = o.prototype);
      var M = (a.prototype = new s());
      (M.constructor = a), w(M, o.prototype), (M.isPureReactComponent = !0);
      var j = { current: null, currentDispatcher: null },
        z = Object.prototype.hasOwnProperty,
        F = { key: !0, ref: !0, __self: !0, __source: !0 },
        R = /\/+/g,
        B = [],
        V = {
          Children: {
            map: function (e, t, n) {
              if (null == e) return e;
              var r = [];
              return b(e, r, null, t, n), r;
            },
            forEach: function (e, t, n) {
              if (null == e) return e;
              (t = d(null, null, t, n)), m(e, y, t), h(t);
            },
            count: function (e) {
              return m(
                e,
                function () {
                  return null;
                },
                null,
              );
            },
            toArray: function (e) {
              var t = [];
              return (
                b(e, t, null, function (e) {
                  return e;
                }),
                t
              );
            },
            only: function (e) {
              return u(e) || i("143"), e;
            },
          },
          createRef: function () {
            return { current: null };
          },
          Component: o,
          PureComponent: a,
          createContext: function (e, t) {
            return (
              void 0 === t && (t = null),
              (e = {
                $$typeof: O,
                _calculateChangedBits: t,
                _currentValue: e,
                _currentValue2: e,
                Provider: null,
                Consumer: null,
                unstable_read: null,
              }),
              (e.Provider = { $$typeof: A, _context: e }),
              (e.Consumer = e),
              (e.unstable_read = _.bind(null, e)),
              e
            );
          },
          forwardRef: function (e) {
            return { $$typeof: I, render: e };
          },
          Fragment: x,
          StrictMode: E,
          unstable_AsyncMode: P,
          unstable_Profiler: T,
          createElement: l,
          cloneElement: function (e, t, n) {
            (null === e || void 0 === e) && i("267", e);
            var r = void 0,
              o = w({}, e.props),
              s = e.key,
              a = e.ref,
              l = e._owner;
            if (null != t) {
              void 0 !== t.ref && ((a = t.ref), (l = j.current)),
                void 0 !== t.key && (s = "" + t.key);
              var c = void 0;
              e.type && e.type.defaultProps && (c = e.type.defaultProps);
              for (r in t)
                z.call(t, r) &&
                  !F.hasOwnProperty(r) &&
                  (o[r] = void 0 === t[r] && void 0 !== c ? c[r] : t[r]);
            }
            if (1 === (r = arguments.length - 2)) o.children = n;
            else if (1 < r) {
              c = Array(r);
              for (var u = 0; u < r; u++) c[u] = arguments[u + 2];
              o.children = c;
            }
            return {
              $$typeof: S,
              type: e.type,
              key: s,
              ref: a,
              props: o,
              _owner: l,
            };
          },
          createFactory: function (e) {
            var t = l.bind(null, e);
            return (t.type = e), t;
          },
          isValidElement: u,
          version: "16.5.2",
          __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
            ReactCurrentOwner: j,
            assign: w,
          },
        },
        U = { default: V },
        q = (U && V) || U;
      e.exports = q.default || q;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        if (Array.isArray(e)) {
          for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
          return n;
        }
        return Array.from(e);
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.combineEpics = void 0);
      var i = n(75);
      t.combineEpics = function () {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return function () {
          for (var e = arguments.length, n = Array(e), o = 0; o < e; o++)
            n[o] = arguments[o];
          return i.merge.apply(
            void 0,
            r(
              t.map(function (e) {
                var t = e.apply(void 0, n);
                if (!t)
                  throw new TypeError(
                    'combineEpics: one of the provided Epics "' +
                      (e.name || "<anonymous>") +
                      "\" does not return a stream. Double check you're not missing a return statement!",
                  );
                return t;
              }),
            ),
          );
        };
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : u,
          n = t.adapter,
          r = void 0 === n ? c : n;
        if ("function" != typeof e)
          throw new TypeError(
            "You must provide a root Epic to createEpicMiddleware",
          );
        var p = new i.Subject(),
          d = r.input(new a.ActionsObservable(p)),
          h = new i.Subject(),
          f = void 0,
          m = function (t) {
            return (
              (f = t),
              function (t) {
                var n;
                return (
                  ((n = o.map.call(h, function (e) {
                    var t = e(d, f);
                    if (!t)
                      throw new TypeError(
                        'Your root Epic "' +
                          (e.name || "<anonymous>") +
                          "\" does not return a stream. Double check you're not missing a return statement!",
                      );
                    return t;
                  })),
                  s.switchMap)
                    .call(n, function (e) {
                      return r.output(e);
                    })
                    .subscribe(f.dispatch),
                  h.next(e),
                  function (e) {
                    var n = t(e);
                    return p.next(e), n;
                  }
                );
              }
            );
          };
        return (
          (m.replaceEpic = function (e) {
            f.dispatch({ type: l.EPIC_END }), h.next(e);
          }),
          m
        );
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.createEpicMiddleware = r);
      var i = n(10),
        o = n(33),
        s = n(250),
        a = n(58),
        l = n(59),
        c = {
          input: function (e) {
            return e;
          },
          output: function (e) {
            return e;
          },
        },
        u = { adapter: c };
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n(198);
      Object.defineProperty(t, "createEpicMiddleware", {
        enumerable: !0,
        get: function () {
          return r.createEpicMiddleware;
        },
      });
      var i = n(58);
      Object.defineProperty(t, "ActionsObservable", {
        enumerable: !0,
        get: function () {
          return i.ActionsObservable;
        },
      });
      var o = n(197);
      Object.defineProperty(t, "combineEpics", {
        enumerable: !0,
        get: function () {
          return o.combineEpics;
        },
      });
      var s = n(59);
      Object.defineProperty(t, "EPIC_END", {
        enumerable: !0,
        get: function () {
          return s.EPIC_END;
        },
      });
    },
    function (e, t, n) {
      "use strict";
      function r() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return function (e) {
          return function (n, r, s) {
            var a = e(n, r, s),
              l = a.dispatch,
              c = [],
              u = {
                getState: a.getState,
                dispatch: function (e) {
                  return l(e);
                },
              };
            return (
              (c = t.map(function (e) {
                return e(u);
              })),
              (l = i.a.apply(void 0, c)(a.dispatch)),
              o({}, a, { dispatch: l })
            );
          };
        };
      }
      var i = n(60);
      t.a = r;
      var o =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        };
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return function () {
          return t(e.apply(void 0, arguments));
        };
      }
      function i(e, t) {
        if ("function" == typeof e) return r(e, t);
        if ("object" != typeof e || null === e)
          throw new Error(
            "bindActionCreators expected an object or a function, instead received " +
              (null === e ? "null" : typeof e) +
              '. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?',
          );
        for (var n = Object.keys(e), i = {}, o = 0; o < n.length; o++) {
          var s = n[o],
            a = e[s];
          "function" == typeof a && (i[s] = r(a, t));
        }
        return i;
      }
      t.a = i;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        var n = t && t.type;
        return (
          "Given action " +
          ((n && '"' + n.toString() + '"') || "an action") +
          ', reducer "' +
          e +
          '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'
        );
      }
      function i(e) {
        Object.keys(e).forEach(function (t) {
          var n = e[t];
          if (void 0 === n(void 0, { type: s.a.INIT }))
            throw new Error(
              'Reducer "' +
                t +
                "\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.",
            );
          if (
            void 0 ===
            n(void 0, {
              type:
                "@@redux/PROBE_UNKNOWN_ACTION_" +
                Math.random().toString(36).substring(7).split("").join("."),
            })
          )
            throw new Error(
              'Reducer "' +
                t +
                "\" returned undefined when probed with a random type. Don't try to handle " +
                s.a.INIT +
                ' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.',
            );
        });
      }
      function o(e) {
        for (var t = Object.keys(e), n = {}, o = 0; o < t.length; o++) {
          var s = t[o];
          "function" == typeof e[s] && (n[s] = e[s]);
        }
        var a = Object.keys(n),
          l = void 0;
        try {
          i(n);
        } catch (e) {
          l = e;
        }
        return function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            t = arguments[1];
          if (l) throw l;
          for (var i = !1, o = {}, s = 0; s < a.length; s++) {
            var c = a[s],
              u = n[c],
              p = e[c],
              d = u(p, t);
            if (void 0 === d) {
              var h = r(c, t);
              throw new Error(h);
            }
            (o[c] = d), (i = i || d !== p);
          }
          return i ? o : e;
        };
      }
      var s = n(61);
      n(27), n(62);
      t.a = o;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(10),
        o = n(8),
        s = (function (e) {
          function t() {
            e.apply(this, arguments),
              (this.value = null),
              (this.hasNext = !1),
              (this.hasCompleted = !1);
          }
          return (
            r(t, e),
            (t.prototype._subscribe = function (t) {
              return this.hasError
                ? (t.error(this.thrownError), o.Subscription.EMPTY)
                : this.hasCompleted && this.hasNext
                ? (t.next(this.value), t.complete(), o.Subscription.EMPTY)
                : e.prototype._subscribe.call(this, t);
            }),
            (t.prototype.next = function (e) {
              this.hasCompleted || ((this.value = e), (this.hasNext = !0));
            }),
            (t.prototype.error = function (t) {
              this.hasCompleted || e.prototype.error.call(this, t);
            }),
            (t.prototype.complete = function () {
              (this.hasCompleted = !0),
                this.hasNext && e.prototype.next.call(this, this.value),
                e.prototype.complete.call(this);
            }),
            t
          );
        })(i.Subject);
      t.AsyncSubject = s;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(10),
        o = n(79),
        s = (function (e) {
          function t(t) {
            e.call(this), (this._value = t);
          }
          return (
            r(t, e),
            Object.defineProperty(t.prototype, "value", {
              get: function () {
                return this.getValue();
              },
              enumerable: !0,
              configurable: !0,
            }),
            (t.prototype._subscribe = function (t) {
              var n = e.prototype._subscribe.call(this, t);
              return n && !n.closed && t.next(this._value), n;
            }),
            (t.prototype.getValue = function () {
              if (this.hasError) throw this.thrownError;
              if (this.closed) throw new o.ObjectUnsubscribedError();
              return this._value;
            }),
            (t.prototype.next = function (t) {
              e.prototype.next.call(this, (this._value = t));
            }),
            t
          );
        })(i.Subject);
      t.BehaviorSubject = s;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(3),
        o = (function (e) {
          function t(t, n, r) {
            e.call(this),
              (this.parent = t),
              (this.outerValue = n),
              (this.outerIndex = r),
              (this.index = 0);
          }
          return (
            r(t, e),
            (t.prototype._next = function (e) {
              this.parent.notifyNext(
                this.outerValue,
                e,
                this.outerIndex,
                this.index++,
                this,
              );
            }),
            (t.prototype._error = function (e) {
              this.parent.notifyError(e, this), this.unsubscribe();
            }),
            (t.prototype._complete = function () {
              this.parent.notifyComplete(this), this.unsubscribe();
            }),
            t
          );
        })(i.Subscriber);
      t.InnerSubscriber = o;
    },
    function (e, t, n) {
      "use strict";
      var r = (function () {
        function e(t, n) {
          void 0 === n && (n = e.now),
            (this.SchedulerAction = t),
            (this.now = n);
        }
        return (
          (e.prototype.schedule = function (e, t, n) {
            return (
              void 0 === t && (t = 0),
              new this.SchedulerAction(this, e).schedule(n, t)
            );
          }),
          (e.now = Date.now
            ? Date.now
            : function () {
                return +new Date();
              }),
          e
        );
      })();
      t.Scheduler = r;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(8),
        o = (function (e) {
          function t(t, n) {
            e.call(this),
              (this.subject = t),
              (this.subscriber = n),
              (this.closed = !1);
          }
          return (
            r(t, e),
            (t.prototype.unsubscribe = function () {
              if (!this.closed) {
                this.closed = !0;
                var e = this.subject,
                  t = e.observers;
                if (
                  ((this.subject = null),
                  t && 0 !== t.length && !e.isStopped && !e.closed)
                ) {
                  var n = t.indexOf(this.subscriber);
                  -1 !== n && t.splice(n, 1);
                }
              }
            }),
            t
          );
        })(i.Subscription);
      t.SubjectSubscription = o;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(232);
      r.Observable.bindCallback = i.bindCallback;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(234);
      r.Observable.ajax = i.ajax;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(74);
      r.Observable.from = i.from;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(236);
      r.Observable.fromEvent = i.fromEvent;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(237);
      r.Observable.interval = i.interval;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(75);
      r.Observable.merge = i.merge;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(238);
      r.Observable.throw = i._throw;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(240);
      r.Observable.prototype.combineLatest = i.combineLatest;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(241);
      r.Observable.prototype.count = i.count;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(78);
      r.Observable.prototype.merge = i.merge;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(248);
      r.Observable.prototype.retryWhen = i.retryWhen;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(249);
      r.Observable.prototype.share = i.share;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(251);
      r.Observable.prototype.take = i.take;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(252);
      r.Observable.prototype.takeUntil = i.takeUntil;
    },
    function (e, t, n) {
      "use strict";
      var r = n(0),
        i = n(254);
      r.Observable.prototype.throttleTime = i.throttleTime;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(0),
        o = n(73),
        s = n(21),
        a = (function (e) {
          function t(t, n) {
            e.call(this),
              (this.arrayLike = t),
              (this.scheduler = n),
              n ||
                1 !== t.length ||
                ((this._isScalar = !0), (this.value = t[0]));
          }
          return (
            r(t, e),
            (t.create = function (e, n) {
              var r = e.length;
              return 0 === r
                ? new s.EmptyObservable()
                : 1 === r
                ? new o.ScalarObservable(e[0], n)
                : new t(e, n);
            }),
            (t.dispatch = function (e) {
              var t = e.arrayLike,
                n = e.index,
                r = e.length,
                i = e.subscriber;
              if (!i.closed) {
                if (n >= r) return void i.complete();
                i.next(t[n]), (e.index = n + 1), this.schedule(e);
              }
            }),
            (t.prototype._subscribe = function (e) {
              var n = this,
                r = n.arrayLike,
                i = n.scheduler,
                o = r.length;
              if (i)
                return i.schedule(t.dispatch, 0, {
                  arrayLike: r,
                  index: 0,
                  length: o,
                  subscriber: e,
                });
              for (var s = 0; s < o && !e.closed; s++) e.next(r[s]);
              e.complete();
            }),
            t
          );
        })(i.Observable);
      t.ArrayLikeObservable = a;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = e.value,
          n = e.subject;
        n.next(t), n.complete();
      }
      function i(e) {
        var t = e.err;
        e.subject.error(t);
      }
      var o =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        s = n(0),
        a = n(14),
        l = n(11),
        c = n(203),
        u = (function (e) {
          function t(t, n, r, i, o) {
            e.call(this),
              (this.callbackFunc = t),
              (this.selector = n),
              (this.args = r),
              (this.context = i),
              (this.scheduler = o);
          }
          return (
            o(t, e),
            (t.create = function (e, n, r) {
              return (
                void 0 === n && (n = void 0),
                function () {
                  for (var i = [], o = 0; o < arguments.length; o++)
                    i[o - 0] = arguments[o];
                  return new t(e, n, i, this, r);
                }
              );
            }),
            (t.prototype._subscribe = function (e) {
              var n = this.callbackFunc,
                r = this.args,
                i = this.scheduler,
                o = this.subject;
              if (i)
                return i.schedule(t.dispatch, 0, {
                  source: this,
                  subscriber: e,
                  context: this.context,
                });
              if (!o) {
                o = this.subject = new c.AsyncSubject();
                var s = function e() {
                  for (var t = [], n = 0; n < arguments.length; n++)
                    t[n - 0] = arguments[n];
                  var r = e.source,
                    i = r.selector,
                    o = r.subject;
                  if (i) {
                    var s = a.tryCatch(i).apply(this, t);
                    s === l.errorObject
                      ? o.error(l.errorObject.e)
                      : (o.next(s), o.complete());
                  } else o.next(t.length <= 1 ? t[0] : t), o.complete();
                };
                s.source = this;
                a.tryCatch(n).apply(this.context, r.concat(s)) ===
                  l.errorObject && o.error(l.errorObject.e);
              }
              return o.subscribe(e);
            }),
            (t.dispatch = function (e) {
              var t = this,
                n = e.source,
                o = e.subscriber,
                s = e.context,
                u = n.callbackFunc,
                p = n.args,
                d = n.scheduler,
                h = n.subject;
              if (!h) {
                h = n.subject = new c.AsyncSubject();
                var f = function e() {
                  for (var n = [], o = 0; o < arguments.length; o++)
                    n[o - 0] = arguments[o];
                  var s = e.source,
                    c = s.selector,
                    u = s.subject;
                  if (c) {
                    var p = a.tryCatch(c).apply(this, n);
                    p === l.errorObject
                      ? t.add(
                          d.schedule(i, 0, {
                            err: l.errorObject.e,
                            subject: u,
                          }),
                        )
                      : t.add(d.schedule(r, 0, { value: p, subject: u }));
                  } else {
                    var h = n.length <= 1 ? n[0] : n;
                    t.add(d.schedule(r, 0, { value: h, subject: u }));
                  }
                };
                f.source = n;
                a.tryCatch(u).apply(s, p.concat(f)) === l.errorObject &&
                  h.error(l.errorObject.e);
              }
              t.add(h.subscribe(o));
            }),
            t
          );
        })(s.Observable);
      t.BoundCallbackObservable = u;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(10),
        o = n(0),
        s = n(3),
        a = n(8),
        l = (function (e) {
          function t(t, n) {
            e.call(this),
              (this.source = t),
              (this.subjectFactory = n),
              (this._refCount = 0),
              (this._isComplete = !1);
          }
          return (
            r(t, e),
            (t.prototype._subscribe = function (e) {
              return this.getSubject().subscribe(e);
            }),
            (t.prototype.getSubject = function () {
              var e = this._subject;
              return (
                (e && !e.isStopped) || (this._subject = this.subjectFactory()),
                this._subject
              );
            }),
            (t.prototype.connect = function () {
              var e = this._connection;
              return (
                e ||
                  ((this._isComplete = !1),
                  (e = this._connection = new a.Subscription()),
                  e.add(this.source.subscribe(new u(this.getSubject(), this))),
                  e.closed
                    ? ((this._connection = null), (e = a.Subscription.EMPTY))
                    : (this._connection = e)),
                e
              );
            }),
            (t.prototype.refCount = function () {
              return this.lift(new p(this));
            }),
            t
          );
        })(o.Observable);
      t.ConnectableObservable = l;
      var c = l.prototype;
      t.connectableObservableDescriptor = {
        operator: { value: null },
        _refCount: { value: 0, writable: !0 },
        _subject: { value: null, writable: !0 },
        _connection: { value: null, writable: !0 },
        _subscribe: { value: c._subscribe },
        _isComplete: { value: c._isComplete, writable: !0 },
        getSubject: { value: c.getSubject },
        connect: { value: c.connect },
        refCount: { value: c.refCount },
      };
      var u = (function (e) {
          function t(t, n) {
            e.call(this, t), (this.connectable = n);
          }
          return (
            r(t, e),
            (t.prototype._error = function (t) {
              this._unsubscribe(), e.prototype._error.call(this, t);
            }),
            (t.prototype._complete = function () {
              (this.connectable._isComplete = !0),
                this._unsubscribe(),
                e.prototype._complete.call(this);
            }),
            (t.prototype._unsubscribe = function () {
              var e = this.connectable;
              if (e) {
                this.connectable = null;
                var t = e._connection;
                (e._refCount = 0),
                  (e._subject = null),
                  (e._connection = null),
                  t && t.unsubscribe();
              }
            }),
            t
          );
        })(i.SubjectSubscriber),
        p = (function () {
          function e(e) {
            this.connectable = e;
          }
          return (
            (e.prototype.call = function (e, t) {
              var n = this.connectable;
              n._refCount++;
              var r = new d(e, n),
                i = t.subscribe(r);
              return r.closed || (r.connection = n.connect()), i;
            }),
            e
          );
        })(),
        d = (function (e) {
          function t(t, n) {
            e.call(this, t), (this.connectable = n);
          }
          return (
            r(t, e),
            (t.prototype._unsubscribe = function () {
              var e = this.connectable;
              if (!e) return void (this.connection = null);
              this.connectable = null;
              var t = e._refCount;
              if (t <= 0) return void (this.connection = null);
              if (((e._refCount = t - 1), t > 1))
                return void (this.connection = null);
              var n = this.connection,
                r = e._connection;
              (this.connection = null), !r || (n && r !== n) || r.unsubscribe();
            }),
            t
          );
        })(s.Subscriber);
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(0),
        o = (function (e) {
          function t(t, n) {
            e.call(this), (this.error = t), (this.scheduler = n);
          }
          return (
            r(t, e),
            (t.create = function (e, n) {
              return new t(e, n);
            }),
            (t.dispatch = function (e) {
              var t = e.error;
              e.subscriber.error(t);
            }),
            (t.prototype._subscribe = function (e) {
              var n = this.error,
                r = this.scheduler;
              if (((e.syncErrorThrowable = !0), r))
                return r.schedule(t.dispatch, 0, { error: n, subscriber: e });
              e.error(n);
            }),
            t
          );
        })(i.Observable);
      t.ErrorObservable = o;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return (
          !!e &&
          "function" == typeof e.addListener &&
          "function" == typeof e.removeListener
        );
      }
      function i(e) {
        return !!e && "function" == typeof e.on && "function" == typeof e.off;
      }
      function o(e) {
        return !!e && "[object NodeList]" === f.call(e);
      }
      function s(e) {
        return !!e && "[object HTMLCollection]" === f.call(e);
      }
      function a(e) {
        return (
          !!e &&
          "function" == typeof e.addEventListener &&
          "function" == typeof e.removeEventListener
        );
      }
      var l =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        c = n(0),
        u = n(14),
        p = n(38),
        d = n(11),
        h = n(8),
        f = Object.prototype.toString,
        m = (function (e) {
          function t(t, n, r, i) {
            e.call(this),
              (this.sourceObj = t),
              (this.eventName = n),
              (this.selector = r),
              (this.options = i);
          }
          return (
            l(t, e),
            (t.create = function (e, n, r, i) {
              return (
                p.isFunction(r) && ((i = r), (r = void 0)), new t(e, n, i, r)
              );
            }),
            (t.setupSubscription = function (e, n, l, c, u) {
              var p;
              if (o(e) || s(e))
                for (var d = 0, f = e.length; d < f; d++)
                  t.setupSubscription(e[d], n, l, c, u);
              else if (a(e)) {
                var m = e;
                e.addEventListener(n, l, u),
                  (p = function () {
                    return m.removeEventListener(n, l);
                  });
              } else if (i(e)) {
                var g = e;
                e.on(n, l),
                  (p = function () {
                    return g.off(n, l);
                  });
              } else {
                if (!r(e)) throw new TypeError("Invalid event target");
                var y = e;
                e.addListener(n, l),
                  (p = function () {
                    return y.removeListener(n, l);
                  });
              }
              c.add(new h.Subscription(p));
            }),
            (t.prototype._subscribe = function (e) {
              var n = this.sourceObj,
                r = this.eventName,
                i = this.options,
                o = this.selector,
                s = o
                  ? function () {
                      for (var t = [], n = 0; n < arguments.length; n++)
                        t[n - 0] = arguments[n];
                      var r = u.tryCatch(o).apply(void 0, t);
                      r === d.errorObject
                        ? e.error(d.errorObject.e)
                        : e.next(r);
                    }
                  : function (t) {
                      return e.next(t);
                    };
              t.setupSubscription(n, r, s, e, i);
            }),
            t
          );
        })(c.Observable);
      t.FromEventObservable = m;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(22),
        o = n(80),
        s = n(82),
        a = n(231),
        l = n(230),
        c = n(20),
        u = n(223),
        p = n(35),
        d = n(0),
        h = n(247),
        f = n(36),
        m = (function (e) {
          function t(t, n) {
            e.call(this, null), (this.ish = t), (this.scheduler = n);
          }
          return (
            r(t, e),
            (t.create = function (e, n) {
              if (null != e) {
                if ("function" == typeof e[f.observable])
                  return e instanceof d.Observable && !n ? e : new t(e, n);
                if (i.isArray(e)) return new c.ArrayObservable(e, n);
                if (s.isPromise(e)) return new a.PromiseObservable(e, n);
                if ("function" == typeof e[p.iterator] || "string" == typeof e)
                  return new l.IteratorObservable(e, n);
                if (o.isArrayLike(e)) return new u.ArrayLikeObservable(e, n);
              }
              throw new TypeError(
                ((null !== e && typeof e) || e) + " is not observable",
              );
            }),
            (t.prototype._subscribe = function (e) {
              var t = this.ish,
                n = this.scheduler;
              return null == n
                ? t[f.observable]().subscribe(e)
                : t[f.observable]().subscribe(
                    new h.ObserveOnSubscriber(e, n, 0),
                  );
            }),
            t
          );
        })(d.Observable);
      t.FromObservable = m;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(261),
        o = n(0),
        s = n(34),
        a = (function (e) {
          function t(t, n) {
            void 0 === t && (t = 0),
              void 0 === n && (n = s.async),
              e.call(this),
              (this.period = t),
              (this.scheduler = n),
              (!i.isNumeric(t) || t < 0) && (this.period = 0),
              (n && "function" == typeof n.schedule) ||
                (this.scheduler = s.async);
          }
          return (
            r(t, e),
            (t.create = function (e, n) {
              return (
                void 0 === e && (e = 0),
                void 0 === n && (n = s.async),
                new t(e, n)
              );
            }),
            (t.dispatch = function (e) {
              var t = e.index,
                n = e.subscriber,
                r = e.period;
              n.next(t), n.closed || ((e.index += 1), this.schedule(e, r));
            }),
            (t.prototype._subscribe = function (e) {
              var n = this.period,
                r = this.scheduler;
              e.add(
                r.schedule(t.dispatch, n, {
                  index: 0,
                  subscriber: e,
                  period: n,
                }),
              );
            }),
            t
          );
        })(o.Observable);
      t.IntervalObservable = a;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = e[u.iterator];
        if (!t && "string" == typeof e) return new d(e);
        if (!t && void 0 !== e.length) return new h(e);
        if (!t) throw new TypeError("object is not iterable");
        return e[u.iterator]();
      }
      function i(e) {
        var t = +e.length;
        return isNaN(t)
          ? 0
          : 0 !== t && o(t)
          ? ((t = s(t) * Math.floor(Math.abs(t))), t <= 0 ? 0 : t > f ? f : t)
          : t;
      }
      function o(e) {
        return "number" == typeof e && l.root.isFinite(e);
      }
      function s(e) {
        var t = +e;
        return 0 === t ? t : isNaN(t) ? t : t < 0 ? -1 : 1;
      }
      var a =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        l = n(5),
        c = n(0),
        u = n(35),
        p = (function (e) {
          function t(t, n) {
            if ((e.call(this), (this.scheduler = n), null == t))
              throw new Error("iterator cannot be null.");
            this.iterator = r(t);
          }
          return (
            a(t, e),
            (t.create = function (e, n) {
              return new t(e, n);
            }),
            (t.dispatch = function (e) {
              var t = e.index,
                n = e.hasError,
                r = e.iterator,
                i = e.subscriber;
              if (n) return void i.error(e.error);
              var o = r.next();
              return o.done
                ? void i.complete()
                : (i.next(o.value),
                  (e.index = t + 1),
                  i.closed
                    ? void ("function" == typeof r.return && r.return())
                    : void this.schedule(e));
            }),
            (t.prototype._subscribe = function (e) {
              var n = this,
                r = n.iterator,
                i = n.scheduler;
              if (i)
                return i.schedule(t.dispatch, 0, {
                  index: 0,
                  iterator: r,
                  subscriber: e,
                });
              for (;;) {
                var o = r.next();
                if (o.done) {
                  e.complete();
                  break;
                }
                if ((e.next(o.value), e.closed)) {
                  "function" == typeof r.return && r.return();
                  break;
                }
              }
            }),
            t
          );
        })(c.Observable);
      t.IteratorObservable = p;
      var d = (function () {
          function e(e, t, n) {
            void 0 === t && (t = 0),
              void 0 === n && (n = e.length),
              (this.str = e),
              (this.idx = t),
              (this.len = n);
          }
          return (
            (e.prototype[u.iterator] = function () {
              return this;
            }),
            (e.prototype.next = function () {
              return this.idx < this.len
                ? { done: !1, value: this.str.charAt(this.idx++) }
                : { done: !0, value: void 0 };
            }),
            e
          );
        })(),
        h = (function () {
          function e(e, t, n) {
            void 0 === t && (t = 0),
              void 0 === n && (n = i(e)),
              (this.arr = e),
              (this.idx = t),
              (this.len = n);
          }
          return (
            (e.prototype[u.iterator] = function () {
              return this;
            }),
            (e.prototype.next = function () {
              return this.idx < this.len
                ? { done: !1, value: this.arr[this.idx++] }
                : { done: !0, value: void 0 };
            }),
            e
          );
        })(),
        f = Math.pow(2, 53) - 1;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = e.value,
          n = e.subscriber;
        n.closed || (n.next(t), n.complete());
      }
      function i(e) {
        var t = e.err,
          n = e.subscriber;
        n.closed || n.error(t);
      }
      var o =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        s = n(5),
        a = n(0),
        l = (function (e) {
          function t(t, n) {
            e.call(this), (this.promise = t), (this.scheduler = n);
          }
          return (
            o(t, e),
            (t.create = function (e, n) {
              return new t(e, n);
            }),
            (t.prototype._subscribe = function (e) {
              var t = this,
                n = this.promise,
                o = this.scheduler;
              if (null == o)
                this._isScalar
                  ? e.closed || (e.next(this.value), e.complete())
                  : n
                      .then(
                        function (n) {
                          (t.value = n),
                            (t._isScalar = !0),
                            e.closed || (e.next(n), e.complete());
                        },
                        function (t) {
                          e.closed || e.error(t);
                        },
                      )
                      .then(null, function (e) {
                        s.root.setTimeout(function () {
                          throw e;
                        });
                      });
              else if (this._isScalar) {
                if (!e.closed)
                  return o.schedule(r, 0, { value: this.value, subscriber: e });
              } else
                n.then(
                  function (n) {
                    (t.value = n),
                      (t._isScalar = !0),
                      e.closed ||
                        e.add(o.schedule(r, 0, { value: n, subscriber: e }));
                  },
                  function (t) {
                    e.closed ||
                      e.add(o.schedule(i, 0, { err: t, subscriber: e }));
                  },
                ).then(null, function (e) {
                  s.root.setTimeout(function () {
                    throw e;
                  });
                });
            }),
            t
          );
        })(a.Observable);
      t.PromiseObservable = l;
    },
    function (e, t, n) {
      "use strict";
      var r = n(224);
      t.bindCallback = r.BoundCallbackObservable.create;
    },
    function (e, t, n) {
      "use strict";
      function r() {
        if (d.root.XMLHttpRequest) return new d.root.XMLHttpRequest();
        if (d.root.XDomainRequest) return new d.root.XDomainRequest();
        throw new Error("CORS is not supported by your browser");
      }
      function i() {
        if (d.root.XMLHttpRequest) return new d.root.XMLHttpRequest();
        var e = void 0;
        try {
          for (
            var t = [
                "Msxml2.XMLHTTP",
                "Microsoft.XMLHTTP",
                "Msxml2.XMLHTTP.4.0",
              ],
              n = 0;
            n < 3;
            n++
          )
            try {
              if (((e = t[n]), new d.root.ActiveXObject(e))) break;
            } catch (e) {}
          return new d.root.ActiveXObject(e);
        } catch (e) {
          throw new Error("XMLHttpRequest is not supported by your browser");
        }
      }
      function o(e, t) {
        return (
          void 0 === t && (t = null),
          new v({ method: "GET", url: e, headers: t })
        );
      }
      function s(e, t, n) {
        return new v({ method: "POST", url: e, body: t, headers: n });
      }
      function a(e, t) {
        return new v({ method: "DELETE", url: e, headers: t });
      }
      function l(e, t, n) {
        return new v({ method: "PUT", url: e, body: t, headers: n });
      }
      function c(e, t, n) {
        return new v({ method: "PATCH", url: e, body: t, headers: n });
      }
      function u(e, t) {
        return new v({
          method: "GET",
          url: e,
          responseType: "json",
          headers: t,
        }).lift(
          new y.MapOperator(function (e, t) {
            return e.response;
          }, null),
        );
      }
      var p =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        d = n(5),
        h = n(14),
        f = n(11),
        m = n(0),
        g = n(3),
        y = n(33);
      (t.ajaxGet = o),
        (t.ajaxPost = s),
        (t.ajaxDelete = a),
        (t.ajaxPut = l),
        (t.ajaxPatch = c),
        (t.ajaxGetJSON = u);
      var v = (function (e) {
        function t(t) {
          e.call(this);
          var n = {
            async: !0,
            createXHR: function () {
              return this.crossDomain ? r.call(this) : i();
            },
            crossDomain: !1,
            withCredentials: !1,
            headers: {},
            method: "GET",
            responseType: "json",
            timeout: 0,
          };
          if ("string" == typeof t) n.url = t;
          else for (var o in t) t.hasOwnProperty(o) && (n[o] = t[o]);
          this.request = n;
        }
        return (
          p(t, e),
          (t.prototype._subscribe = function (e) {
            return new b(e, this.request);
          }),
          (t.create = (function () {
            var e = function (e) {
              return new t(e);
            };
            return (
              (e.get = o),
              (e.post = s),
              (e.delete = a),
              (e.put = l),
              (e.patch = c),
              (e.getJSON = u),
              e
            );
          })()),
          t
        );
      })(m.Observable);
      t.AjaxObservable = v;
      var b = (function (e) {
        function t(t, n) {
          e.call(this, t), (this.request = n), (this.done = !1);
          var r = (n.headers = n.headers || {});
          n.crossDomain ||
            r["X-Requested-With"] ||
            (r["X-Requested-With"] = "XMLHttpRequest"),
            "Content-Type" in r ||
              (d.root.FormData && n.body instanceof d.root.FormData) ||
              void 0 === n.body ||
              (r["Content-Type"] =
                "application/x-www-form-urlencoded; charset=UTF-8"),
            (n.body = this.serializeBody(n.body, n.headers["Content-Type"])),
            this.send();
        }
        return (
          p(t, e),
          (t.prototype.next = function (e) {
            this.done = !0;
            var t = this,
              n = t.xhr,
              r = t.request,
              i = t.destination,
              o = new _(e, n, r);
            i.next(o);
          }),
          (t.prototype.send = function () {
            var e = this,
              t = e.request,
              n = e.request,
              r = n.user,
              i = n.method,
              o = n.url,
              s = n.async,
              a = n.password,
              l = n.headers,
              c = n.body,
              u = t.createXHR,
              p = h.tryCatch(u).call(t);
            if (p === f.errorObject) this.error(f.errorObject.e);
            else {
              (this.xhr = p), this.setupEvents(p, t);
              if (
                (r
                  ? h.tryCatch(p.open).call(p, i, o, s, r, a)
                  : h.tryCatch(p.open).call(p, i, o, s)) === f.errorObject
              )
                return this.error(f.errorObject.e), null;
              if (
                (s &&
                  ((p.timeout = t.timeout), (p.responseType = t.responseType)),
                "withCredentials" in p &&
                  (p.withCredentials = !!t.withCredentials),
                this.setHeaders(p, l),
                (c
                  ? h.tryCatch(p.send).call(p, c)
                  : h.tryCatch(p.send).call(p)) === f.errorObject)
              )
                return this.error(f.errorObject.e), null;
            }
            return p;
          }),
          (t.prototype.serializeBody = function (e, t) {
            if (!e || "string" == typeof e) return e;
            if (d.root.FormData && e instanceof d.root.FormData) return e;
            if (t) {
              var n = t.indexOf(";");
              -1 !== n && (t = t.substring(0, n));
            }
            switch (t) {
              case "application/x-www-form-urlencoded":
                return Object.keys(e)
                  .map(function (t) {
                    return encodeURI(t) + "=" + encodeURI(e[t]);
                  })
                  .join("&");
              case "application/json":
                return JSON.stringify(e);
              default:
                return e;
            }
          }),
          (t.prototype.setHeaders = function (e, t) {
            for (var n in t) t.hasOwnProperty(n) && e.setRequestHeader(n, t[n]);
          }),
          (t.prototype.setupEvents = function (e, t) {
            function n(e) {
              var t = n,
                r = t.subscriber,
                i = t.progressSubscriber,
                o = t.request;
              i && i.error(e), r.error(new C(this, o));
            }
            function r(e) {
              var t = r,
                n = t.subscriber,
                i = t.progressSubscriber,
                o = t.request;
              if (4 === this.readyState) {
                var s = 1223 === this.status ? 204 : this.status,
                  a =
                    "text" === this.responseType
                      ? this.response || this.responseText
                      : this.response;
                0 === s && (s = a ? 200 : 0),
                  200 <= s && s < 300
                    ? (i && i.complete(), n.next(e), n.complete())
                    : (i && i.error(e),
                      n.error(new w("ajax error " + s, this, o)));
              }
            }
            var i = t.progressSubscriber;
            if (
              ((e.ontimeout = n),
              (n.request = t),
              (n.subscriber = this),
              (n.progressSubscriber = i),
              e.upload && "withCredentials" in e)
            ) {
              if (i) {
                var o;
                (o = function (e) {
                  o.progressSubscriber.next(e);
                }),
                  d.root.XDomainRequest
                    ? (e.onprogress = o)
                    : (e.upload.onprogress = o),
                  (o.progressSubscriber = i);
              }
              var s;
              (s = function (e) {
                var t = s,
                  n = t.progressSubscriber,
                  r = t.subscriber,
                  i = t.request;
                n && n.error(e), r.error(new w("ajax error", this, i));
              }),
                (e.onerror = s),
                (s.request = t),
                (s.subscriber = this),
                (s.progressSubscriber = i);
            }
            (e.onreadystatechange = r),
              (r.subscriber = this),
              (r.progressSubscriber = i),
              (r.request = t);
          }),
          (t.prototype.unsubscribe = function () {
            var t = this,
              n = t.done,
              r = t.xhr;
            !n &&
              r &&
              4 !== r.readyState &&
              "function" == typeof r.abort &&
              r.abort(),
              e.prototype.unsubscribe.call(this);
          }),
          t
        );
      })(g.Subscriber);
      t.AjaxSubscriber = b;
      var _ = (function () {
        function e(e, t, n) {
          switch (
            ((this.originalEvent = e),
            (this.xhr = t),
            (this.request = n),
            (this.status = t.status),
            (this.responseType = t.responseType || n.responseType),
            this.responseType)
          ) {
            case "json":
              this.response =
                "response" in t
                  ? t.responseType
                    ? t.response
                    : JSON.parse(t.response || t.responseText || "null")
                  : JSON.parse(t.responseText || "null");
              break;
            case "xml":
              this.response = t.responseXML;
              break;
            case "text":
            default:
              this.response = "response" in t ? t.response : t.responseText;
          }
        }
        return e;
      })();
      t.AjaxResponse = _;
      var w = (function (e) {
        function t(t, n, r) {
          e.call(this, t),
            (this.message = t),
            (this.xhr = n),
            (this.request = r),
            (this.status = n.status);
        }
        return p(t, e), t;
      })(Error);
      t.AjaxError = w;
      var C = (function (e) {
        function t(t, n) {
          e.call(this, "ajax timeout", t, n);
        }
        return p(t, e), t;
      })(w);
      t.AjaxTimeoutError = C;
    },
    function (e, t, n) {
      "use strict";
      var r = n(233);
      t.ajax = r.AjaxObservable.create;
    },
    function (e, t, n) {
      "use strict";
      var r = n(21);
      t.empty = r.EmptyObservable.create;
    },
    function (e, t, n) {
      "use strict";
      var r = n(227);
      t.fromEvent = r.FromEventObservable.create;
    },
    function (e, t, n) {
      "use strict";
      var r = n(229);
      t.interval = r.IntervalObservable.create;
    },
    function (e, t, n) {
      "use strict";
      var r = n(226);
      t._throw = r.ErrorObservable.create;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t = new a(e),
          n = this.lift(t);
        return (t.caught = n);
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(6),
        s = n(7);
      t._catch = r;
      var a = (function () {
          function e(e) {
            this.selector = e;
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(new l(e, this.selector, this.caught));
            }),
            e
          );
        })(),
        l = (function (e) {
          function t(t, n, r) {
            e.call(this, t), (this.selector = n), (this.caught = r);
          }
          return (
            i(t, e),
            (t.prototype.error = function (t) {
              if (!this.isStopped) {
                var n = void 0;
                try {
                  n = this.selector(t, this.caught);
                } catch (t) {
                  return void e.prototype.error.call(this, t);
                }
                this._unsubscribeAndRecycle(),
                  this.add(s.subscribeToResult(this, n));
              }
            }),
            t
          );
        })(o.OuterSubscriber);
    },
    function (e, t, n) {
      "use strict";
      function r() {
        for (var e = [], t = 0; t < arguments.length; t++)
          e[t - 0] = arguments[t];
        var n = null;
        return (
          "function" == typeof e[e.length - 1] && (n = e.pop()),
          1 === e.length && s.isArray(e[0]) && (e = e[0].slice()),
          e.unshift(this),
          this.lift.call(new o.ArrayObservable(e), new u(n))
        );
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(20),
        s = n(22),
        a = n(6),
        l = n(7),
        c = {};
      t.combineLatest = r;
      var u = (function () {
        function e(e) {
          this.project = e;
        }
        return (
          (e.prototype.call = function (e, t) {
            return t.subscribe(new p(e, this.project));
          }),
          e
        );
      })();
      t.CombineLatestOperator = u;
      var p = (function (e) {
        function t(t, n) {
          e.call(this, t),
            (this.project = n),
            (this.active = 0),
            (this.values = []),
            (this.observables = []);
        }
        return (
          i(t, e),
          (t.prototype._next = function (e) {
            this.values.push(c), this.observables.push(e);
          }),
          (t.prototype._complete = function () {
            var e = this.observables,
              t = e.length;
            if (0 === t) this.destination.complete();
            else {
              (this.active = t), (this.toRespond = t);
              for (var n = 0; n < t; n++) {
                var r = e[n];
                this.add(l.subscribeToResult(this, r, r, n));
              }
            }
          }),
          (t.prototype.notifyComplete = function (e) {
            0 == (this.active -= 1) && this.destination.complete();
          }),
          (t.prototype.notifyNext = function (e, t, n, r, i) {
            var o = this.values,
              s = o[n],
              a = this.toRespond
                ? s === c
                  ? --this.toRespond
                  : this.toRespond
                : 0;
            (o[n] = t),
              0 === a &&
                (this.project
                  ? this._tryProject(o)
                  : this.destination.next(o.slice()));
          }),
          (t.prototype._tryProject = function (e) {
            var t;
            try {
              t = this.project.apply(this, e);
            } catch (e) {
              return void this.destination.error(e);
            }
            this.destination.next(t);
          }),
          t
        );
      })(a.OuterSubscriber);
      t.CombineLatestSubscriber = p;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return this.lift(new s(e, this));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(3);
      t.count = r;
      var s = (function () {
          function e(e, t) {
            (this.predicate = e), (this.source = t);
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(new a(e, this.predicate, this.source));
            }),
            e
          );
        })(),
        a = (function (e) {
          function t(t, n, r) {
            e.call(this, t),
              (this.predicate = n),
              (this.source = r),
              (this.count = 0),
              (this.index = 0);
          }
          return (
            i(t, e),
            (t.prototype._next = function (e) {
              this.predicate ? this._tryPredicate(e) : this.count++;
            }),
            (t.prototype._tryPredicate = function (e) {
              var t;
              try {
                t = this.predicate(e, this.index++, this.source);
              } catch (e) {
                return void this.destination.error(e);
              }
              t && this.count++;
            }),
            (t.prototype._complete = function () {
              this.destination.next(this.count), this.destination.complete();
            }),
            t
          );
        })(o.Subscriber);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        void 0 === t && (t = o.async);
        var n = s.isDate(e),
          r = n ? +e - t.now() : Math.abs(e);
        return this.lift(new c(r, t));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(34),
        s = n(260),
        a = n(3),
        l = n(63);
      t.delay = r;
      var c = (function () {
          function e(e, t) {
            (this.delay = e), (this.scheduler = t);
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(new u(e, this.delay, this.scheduler));
            }),
            e
          );
        })(),
        u = (function (e) {
          function t(t, n, r) {
            e.call(this, t),
              (this.delay = n),
              (this.scheduler = r),
              (this.queue = []),
              (this.active = !1),
              (this.errored = !1);
          }
          return (
            i(t, e),
            (t.dispatch = function (e) {
              for (
                var t = e.source,
                  n = t.queue,
                  r = e.scheduler,
                  i = e.destination;
                n.length > 0 && n[0].time - r.now() <= 0;

              )
                n.shift().notification.observe(i);
              if (n.length > 0) {
                var o = Math.max(0, n[0].time - r.now());
                this.schedule(e, o);
              } else t.active = !1;
            }),
            (t.prototype._schedule = function (e) {
              (this.active = !0),
                this.add(
                  e.schedule(t.dispatch, this.delay, {
                    source: this,
                    destination: this.destination,
                    scheduler: e,
                  }),
                );
            }),
            (t.prototype.scheduleNotification = function (e) {
              if (!0 !== this.errored) {
                var t = this.scheduler,
                  n = new p(t.now() + this.delay, e);
                this.queue.push(n), !1 === this.active && this._schedule(t);
              }
            }),
            (t.prototype._next = function (e) {
              this.scheduleNotification(l.Notification.createNext(e));
            }),
            (t.prototype._error = function (e) {
              (this.errored = !0), (this.queue = []), this.destination.error(e);
            }),
            (t.prototype._complete = function () {
              this.scheduleNotification(l.Notification.createComplete());
            }),
            t
          );
        })(a.Subscriber),
        p = (function () {
          function e(e, t) {
            (this.time = e), (this.notification = t);
          }
          return e;
        })();
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        return this.lift(new s(e, t, n));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(3);
      t._do = r;
      var s = (function () {
          function e(e, t, n) {
            (this.nextOrObserver = e), (this.error = t), (this.complete = n);
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(
                new a(e, this.nextOrObserver, this.error, this.complete),
              );
            }),
            e
          );
        })(),
        a = (function (e) {
          function t(t, n, r, i) {
            e.call(this, t);
            var s = new o.Subscriber(n, r, i);
            (s.syncErrorThrowable = !0), this.add(s), (this.safeSubscriber = s);
          }
          return (
            i(t, e),
            (t.prototype._next = function (e) {
              var t = this.safeSubscriber;
              t.next(e),
                t.syncErrorThrown
                  ? this.destination.error(t.syncErrorValue)
                  : this.destination.next(e);
            }),
            (t.prototype._error = function (e) {
              var t = this.safeSubscriber;
              t.error(e),
                t.syncErrorThrown
                  ? this.destination.error(t.syncErrorValue)
                  : this.destination.error(e);
            }),
            (t.prototype._complete = function () {
              var e = this.safeSubscriber;
              e.complete(),
                e.syncErrorThrown
                  ? this.destination.error(e.syncErrorValue)
                  : this.destination.complete();
            }),
            t
          );
        })(o.Subscriber);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return (
          void 0 === e && (e = Number.POSITIVE_INFINITY), this.lift(new a(e))
        );
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(6),
        s = n(7);
      t.mergeAll = r;
      var a = (function () {
        function e(e) {
          this.concurrent = e;
        }
        return (
          (e.prototype.call = function (e, t) {
            return t.subscribe(new l(e, this.concurrent));
          }),
          e
        );
      })();
      t.MergeAllOperator = a;
      var l = (function (e) {
        function t(t, n) {
          e.call(this, t),
            (this.concurrent = n),
            (this.hasCompleted = !1),
            (this.buffer = []),
            (this.active = 0);
        }
        return (
          i(t, e),
          (t.prototype._next = function (e) {
            this.active < this.concurrent
              ? (this.active++, this.add(s.subscribeToResult(this, e)))
              : this.buffer.push(e);
          }),
          (t.prototype._complete = function () {
            (this.hasCompleted = !0),
              0 === this.active &&
                0 === this.buffer.length &&
                this.destination.complete();
          }),
          (t.prototype.notifyComplete = function (e) {
            var t = this.buffer;
            this.remove(e),
              this.active--,
              t.length > 0
                ? this._next(t.shift())
                : 0 === this.active &&
                  this.hasCompleted &&
                  this.destination.complete();
          }),
          t
        );
      })(o.OuterSubscriber);
      t.MergeAllSubscriber = l;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        return (
          void 0 === n && (n = Number.POSITIVE_INFINITY),
          "number" == typeof t && ((n = t), (t = null)),
          this.lift(new a(e, t, n))
        );
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(7),
        s = n(6);
      t.mergeMap = r;
      var a = (function () {
        function e(e, t, n) {
          void 0 === n && (n = Number.POSITIVE_INFINITY),
            (this.project = e),
            (this.resultSelector = t),
            (this.concurrent = n);
        }
        return (
          (e.prototype.call = function (e, t) {
            return t.subscribe(
              new l(e, this.project, this.resultSelector, this.concurrent),
            );
          }),
          e
        );
      })();
      t.MergeMapOperator = a;
      var l = (function (e) {
        function t(t, n, r, i) {
          void 0 === i && (i = Number.POSITIVE_INFINITY),
            e.call(this, t),
            (this.project = n),
            (this.resultSelector = r),
            (this.concurrent = i),
            (this.hasCompleted = !1),
            (this.buffer = []),
            (this.active = 0),
            (this.index = 0);
        }
        return (
          i(t, e),
          (t.prototype._next = function (e) {
            this.active < this.concurrent
              ? this._tryNext(e)
              : this.buffer.push(e);
          }),
          (t.prototype._tryNext = function (e) {
            var t,
              n = this.index++;
            try {
              t = this.project(e, n);
            } catch (e) {
              return void this.destination.error(e);
            }
            this.active++, this._innerSub(t, e, n);
          }),
          (t.prototype._innerSub = function (e, t, n) {
            this.add(o.subscribeToResult(this, e, t, n));
          }),
          (t.prototype._complete = function () {
            (this.hasCompleted = !0),
              0 === this.active &&
                0 === this.buffer.length &&
                this.destination.complete();
          }),
          (t.prototype.notifyNext = function (e, t, n, r, i) {
            this.resultSelector
              ? this._notifyResultSelector(e, t, n, r)
              : this.destination.next(t);
          }),
          (t.prototype._notifyResultSelector = function (e, t, n, r) {
            var i;
            try {
              i = this.resultSelector(e, t, n, r);
            } catch (e) {
              return void this.destination.error(e);
            }
            this.destination.next(i);
          }),
          (t.prototype.notifyComplete = function (e) {
            var t = this.buffer;
            this.remove(e),
              this.active--,
              t.length > 0
                ? this._next(t.shift())
                : 0 === this.active &&
                  this.hasCompleted &&
                  this.destination.complete();
          }),
          t
        );
      })(s.OuterSubscriber);
      t.MergeMapSubscriber = l;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        var n;
        if (
          ((n =
            "function" == typeof e
              ? e
              : function () {
                  return e;
                }),
          "function" == typeof t)
        )
          return this.lift(new o(n, t));
        var r = Object.create(this, i.connectableObservableDescriptor);
        return (r.source = this), (r.subjectFactory = n), r;
      }
      var i = n(225);
      t.multicast = r;
      var o = (function () {
        function e(e, t) {
          (this.subjectFactory = e), (this.selector = t);
        }
        return (
          (e.prototype.call = function (e, t) {
            var n = this.selector,
              r = this.subjectFactory(),
              i = n(r).subscribe(e);
            return i.add(t.subscribe(r)), i;
          }),
          e
        );
      })();
      t.MulticastOperator = o;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return void 0 === t && (t = 0), this.lift(new a(e, t));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(3),
        s = n(63);
      t.observeOn = r;
      var a = (function () {
        function e(e, t) {
          void 0 === t && (t = 0), (this.scheduler = e), (this.delay = t);
        }
        return (
          (e.prototype.call = function (e, t) {
            return t.subscribe(new l(e, this.scheduler, this.delay));
          }),
          e
        );
      })();
      t.ObserveOnOperator = a;
      var l = (function (e) {
        function t(t, n, r) {
          void 0 === r && (r = 0),
            e.call(this, t),
            (this.scheduler = n),
            (this.delay = r);
        }
        return (
          i(t, e),
          (t.dispatch = function (e) {
            var t = e.notification,
              n = e.destination;
            t.observe(n), this.unsubscribe();
          }),
          (t.prototype.scheduleMessage = function (e) {
            this.add(
              this.scheduler.schedule(
                t.dispatch,
                this.delay,
                new c(e, this.destination),
              ),
            );
          }),
          (t.prototype._next = function (e) {
            this.scheduleMessage(s.Notification.createNext(e));
          }),
          (t.prototype._error = function (e) {
            this.scheduleMessage(s.Notification.createError(e));
          }),
          (t.prototype._complete = function () {
            this.scheduleMessage(s.Notification.createComplete());
          }),
          t
        );
      })(o.Subscriber);
      t.ObserveOnSubscriber = l;
      var c = (function () {
        function e(e, t) {
          (this.notification = e), (this.destination = t);
        }
        return e;
      })();
      t.ObserveOnMessage = c;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return this.lift(new u(e, this));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(10),
        s = n(14),
        a = n(11),
        l = n(6),
        c = n(7);
      t.retryWhen = r;
      var u = (function () {
          function e(e, t) {
            (this.notifier = e), (this.source = t);
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(new p(e, this.notifier, this.source));
            }),
            e
          );
        })(),
        p = (function (e) {
          function t(t, n, r) {
            e.call(this, t), (this.notifier = n), (this.source = r);
          }
          return (
            i(t, e),
            (t.prototype.error = function (t) {
              if (!this.isStopped) {
                var n = this.errors,
                  r = this.retries,
                  i = this.retriesSubscription;
                if (r) (this.errors = null), (this.retriesSubscription = null);
                else {
                  if (
                    ((n = new o.Subject()),
                    (r = s.tryCatch(this.notifier)(n)) === a.errorObject)
                  )
                    return e.prototype.error.call(this, a.errorObject.e);
                  i = c.subscribeToResult(this, r);
                }
                this._unsubscribeAndRecycle(),
                  (this.errors = n),
                  (this.retries = r),
                  (this.retriesSubscription = i),
                  n.next(t);
              }
            }),
            (t.prototype._unsubscribe = function () {
              var e = this,
                t = e.errors,
                n = e.retriesSubscription;
              t && (t.unsubscribe(), (this.errors = null)),
                n && (n.unsubscribe(), (this.retriesSubscription = null)),
                (this.retries = null);
            }),
            (t.prototype.notifyNext = function (e, t, n, r, i) {
              var o = this,
                s = o.errors,
                a = o.retries,
                l = o.retriesSubscription;
              (this.errors = null),
                (this.retries = null),
                (this.retriesSubscription = null),
                this._unsubscribeAndRecycle(),
                (this.errors = s),
                (this.retries = a),
                (this.retriesSubscription = l),
                this.source.subscribe(this);
            }),
            t
          );
        })(l.OuterSubscriber);
    },
    function (e, t, n) {
      "use strict";
      function r() {
        return new s.Subject();
      }
      function i() {
        return o.multicast.call(this, r).refCount();
      }
      var o = n(246),
        s = n(10);
      t.share = i;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t) {
        return this.lift(new a(e, t));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(6),
        s = n(7);
      t.switchMap = r;
      var a = (function () {
          function e(e, t) {
            (this.project = e), (this.resultSelector = t);
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(new l(e, this.project, this.resultSelector));
            }),
            e
          );
        })(),
        l = (function (e) {
          function t(t, n, r) {
            e.call(this, t),
              (this.project = n),
              (this.resultSelector = r),
              (this.index = 0);
          }
          return (
            i(t, e),
            (t.prototype._next = function (e) {
              var t,
                n = this.index++;
              try {
                t = this.project(e, n);
              } catch (e) {
                return void this.destination.error(e);
              }
              this._innerSub(t, e, n);
            }),
            (t.prototype._innerSub = function (e, t, n) {
              var r = this.innerSubscription;
              r && r.unsubscribe(),
                this.add(
                  (this.innerSubscription = s.subscribeToResult(this, e, t, n)),
                );
            }),
            (t.prototype._complete = function () {
              var t = this.innerSubscription;
              (t && !t.closed) || e.prototype._complete.call(this);
            }),
            (t.prototype._unsubscribe = function () {
              this.innerSubscription = null;
            }),
            (t.prototype.notifyComplete = function (t) {
              this.remove(t),
                (this.innerSubscription = null),
                this.isStopped && e.prototype._complete.call(this);
            }),
            (t.prototype.notifyNext = function (e, t, n, r, i) {
              this.resultSelector
                ? this._tryNotifyNext(e, t, n, r)
                : this.destination.next(t);
            }),
            (t.prototype._tryNotifyNext = function (e, t, n, r) {
              var i;
              try {
                i = this.resultSelector(e, t, n, r);
              } catch (e) {
                return void this.destination.error(e);
              }
              this.destination.next(i);
            }),
            t
          );
        })(o.OuterSubscriber);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return 0 === e ? new a.EmptyObservable() : this.lift(new l(e));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(3),
        s = n(258),
        a = n(21);
      t.take = r;
      var l = (function () {
          function e(e) {
            if (((this.total = e), this.total < 0))
              throw new s.ArgumentOutOfRangeError();
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(new c(e, this.total));
            }),
            e
          );
        })(),
        c = (function (e) {
          function t(t, n) {
            e.call(this, t), (this.total = n), (this.count = 0);
          }
          return (
            i(t, e),
            (t.prototype._next = function (e) {
              var t = this.total,
                n = ++this.count;
              n <= t &&
                (this.destination.next(e),
                n === t && (this.destination.complete(), this.unsubscribe()));
            }),
            t
          );
        })(o.Subscriber);
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return this.lift(new a(e));
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(6),
        s = n(7);
      t.takeUntil = r;
      var a = (function () {
          function e(e) {
            this.notifier = e;
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(new l(e, this.notifier));
            }),
            e
          );
        })(),
        l = (function (e) {
          function t(t, n) {
            e.call(this, t),
              (this.notifier = n),
              this.add(s.subscribeToResult(this, n));
          }
          return (
            i(t, e),
            (t.prototype.notifyNext = function (e, t, n, r, i) {
              this.complete();
            }),
            (t.prototype.notifyComplete = function () {}),
            t
          );
        })(o.OuterSubscriber);
    },
    function (e, t, n) {
      "use strict";
      function r(e, n) {
        return (
          void 0 === n && (n = t.defaultThrottleConfig),
          this.lift(new a(e, n.leading, n.trailing))
        );
      }
      var i =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        o = n(6),
        s = n(7);
      (t.defaultThrottleConfig = { leading: !0, trailing: !1 }),
        (t.throttle = r);
      var a = (function () {
          function e(e, t, n) {
            (this.durationSelector = e),
              (this.leading = t),
              (this.trailing = n);
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(
                new l(e, this.durationSelector, this.leading, this.trailing),
              );
            }),
            e
          );
        })(),
        l = (function (e) {
          function t(t, n, r, i) {
            e.call(this, t),
              (this.destination = t),
              (this.durationSelector = n),
              (this._leading = r),
              (this._trailing = i),
              (this._hasTrailingValue = !1);
          }
          return (
            i(t, e),
            (t.prototype._next = function (e) {
              if (this.throttled)
                this._trailing &&
                  ((this._hasTrailingValue = !0), (this._trailingValue = e));
              else {
                var t = this.tryDurationSelector(e);
                t && this.add((this.throttled = s.subscribeToResult(this, t))),
                  this._leading &&
                    (this.destination.next(e),
                    this._trailing &&
                      ((this._hasTrailingValue = !0),
                      (this._trailingValue = e)));
              }
            }),
            (t.prototype.tryDurationSelector = function (e) {
              try {
                return this.durationSelector(e);
              } catch (e) {
                return this.destination.error(e), null;
              }
            }),
            (t.prototype._unsubscribe = function () {
              var e = this,
                t = e.throttled;
              e._trailingValue, e._hasTrailingValue, e._trailing;
              (this._trailingValue = null),
                (this._hasTrailingValue = !1),
                t && (this.remove(t), (this.throttled = null), t.unsubscribe());
            }),
            (t.prototype._sendTrailing = function () {
              var e = this,
                t = e.destination,
                n = e.throttled,
                r = e._trailing,
                i = e._trailingValue,
                o = e._hasTrailingValue;
              n &&
                r &&
                o &&
                (t.next(i),
                (this._trailingValue = null),
                (this._hasTrailingValue = !1));
            }),
            (t.prototype.notifyNext = function (e, t, n, r, i) {
              this._sendTrailing(), this._unsubscribe();
            }),
            (t.prototype.notifyComplete = function () {
              this._sendTrailing(), this._unsubscribe();
            }),
            t
          );
        })(o.OuterSubscriber);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        return (
          void 0 === t && (t = a.async),
          void 0 === n && (n = l.defaultThrottleConfig),
          this.lift(new c(e, t, n.leading, n.trailing))
        );
      }
      function i(e) {
        e.subscriber.clearThrottle();
      }
      var o =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        s = n(3),
        a = n(34),
        l = n(253);
      t.throttleTime = r;
      var c = (function () {
          function e(e, t, n, r) {
            (this.duration = e),
              (this.scheduler = t),
              (this.leading = n),
              (this.trailing = r);
          }
          return (
            (e.prototype.call = function (e, t) {
              return t.subscribe(
                new u(
                  e,
                  this.duration,
                  this.scheduler,
                  this.leading,
                  this.trailing,
                ),
              );
            }),
            e
          );
        })(),
        u = (function (e) {
          function t(t, n, r, i, o) {
            e.call(this, t),
              (this.duration = n),
              (this.scheduler = r),
              (this.leading = i),
              (this.trailing = o),
              (this._hasTrailingValue = !1),
              (this._trailingValue = null);
          }
          return (
            o(t, e),
            (t.prototype._next = function (e) {
              this.throttled
                ? this.trailing &&
                  ((this._trailingValue = e), (this._hasTrailingValue = !0))
                : (this.add(
                    (this.throttled = this.scheduler.schedule(
                      i,
                      this.duration,
                      { subscriber: this },
                    )),
                  ),
                  this.leading && this.destination.next(e));
            }),
            (t.prototype.clearThrottle = function () {
              var e = this.throttled;
              e &&
                (this.trailing &&
                  this._hasTrailingValue &&
                  (this.destination.next(this._trailingValue),
                  (this._trailingValue = null),
                  (this._hasTrailingValue = !1)),
                e.unsubscribe(),
                this.remove(e),
                (this.throttled = null));
            }),
            t
          );
        })(s.Subscriber);
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(8),
        o = (function (e) {
          function t(t, n) {
            e.call(this);
          }
          return (
            r(t, e),
            (t.prototype.schedule = function (e, t) {
              return void 0 === t && (t = 0), this;
            }),
            t
          );
        })(i.Subscription);
      t.Action = o;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(5),
        o = n(255),
        s = (function (e) {
          function t(t, n) {
            e.call(this, t, n),
              (this.scheduler = t),
              (this.work = n),
              (this.pending = !1);
          }
          return (
            r(t, e),
            (t.prototype.schedule = function (e, t) {
              if ((void 0 === t && (t = 0), this.closed)) return this;
              (this.state = e), (this.pending = !0);
              var n = this.id,
                r = this.scheduler;
              return (
                null != n && (this.id = this.recycleAsyncId(r, n, t)),
                (this.delay = t),
                (this.id = this.id || this.requestAsyncId(r, this.id, t)),
                this
              );
            }),
            (t.prototype.requestAsyncId = function (e, t, n) {
              return (
                void 0 === n && (n = 0),
                i.root.setInterval(e.flush.bind(e, this), n)
              );
            }),
            (t.prototype.recycleAsyncId = function (e, t, n) {
              return (
                void 0 === n && (n = 0),
                null !== n && this.delay === n && !1 === this.pending
                  ? t
                  : (i.root.clearInterval(t) && void 0) || void 0
              );
            }),
            (t.prototype.execute = function (e, t) {
              if (this.closed) return new Error("executing a cancelled action");
              this.pending = !1;
              var n = this._execute(e, t);
              if (n) return n;
              !1 === this.pending &&
                null != this.id &&
                (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
            }),
            (t.prototype._execute = function (e, t) {
              var n = !1,
                r = void 0;
              try {
                this.work(e);
              } catch (e) {
                (n = !0), (r = (!!e && e) || new Error(e));
              }
              if (n) return this.unsubscribe(), r;
            }),
            (t.prototype._unsubscribe = function () {
              var e = this.id,
                t = this.scheduler,
                n = t.actions,
                r = n.indexOf(this);
              (this.work = null),
                (this.state = null),
                (this.pending = !1),
                (this.scheduler = null),
                -1 !== r && n.splice(r, 1),
                null != e && (this.id = this.recycleAsyncId(t, e, null)),
                (this.delay = null);
            }),
            t
          );
        })(o.Action);
      t.AsyncAction = s;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = n(206),
        o = (function (e) {
          function t() {
            e.apply(this, arguments),
              (this.actions = []),
              (this.active = !1),
              (this.scheduled = void 0);
          }
          return (
            r(t, e),
            (t.prototype.flush = function (e) {
              var t = this.actions;
              if (this.active) return void t.push(e);
              var n;
              this.active = !0;
              do {
                if ((n = e.execute(e.state, e.delay))) break;
              } while ((e = t.shift()));
              if (((this.active = !1), n)) {
                for (; (e = t.shift()); ) e.unsubscribe();
                throw n;
              }
            }),
            t
          );
        })(i.Scheduler);
      t.AsyncScheduler = o;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = (function (e) {
          function t() {
            var t = e.call(this, "argument out of range");
            (this.name = t.name = "ArgumentOutOfRangeError"),
              (this.stack = t.stack),
              (this.message = t.message);
          }
          return r(t, e), t;
        })(Error);
      t.ArgumentOutOfRangeError = i;
    },
    function (e, t, n) {
      "use strict";
      var r =
          (this && this.__extends) ||
          function (e, t) {
            function n() {
              this.constructor = e;
            }
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n());
          },
        i = (function (e) {
          function t(t) {
            e.call(this), (this.errors = t);
            var n = Error.call(
              this,
              t
                ? t.length +
                    " errors occurred during unsubscription:\n  " +
                    t
                      .map(function (e, t) {
                        return t + 1 + ") " + e.toString();
                      })
                      .join("\n  ")
                : "",
            );
            (this.name = n.name = "UnsubscriptionError"),
              (this.stack = n.stack),
              (this.message = n.message);
          }
          return r(t, e), t;
        })(Error);
      t.UnsubscriptionError = i;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e instanceof Date && !isNaN(+e);
      }
      t.isDate = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return !i.isArray(e) && e - parseFloat(e) + 1 >= 0;
      }
      var i = n(22);
      t.isNumeric = r;
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        if (e) {
          if (e instanceof i.Subscriber) return e;
          if (e[o.rxSubscriber]) return e[o.rxSubscriber]();
        }
        return e || t || n
          ? new i.Subscriber(e, t, n)
          : new i.Subscriber(s.empty);
      }
      var i = n(3),
        o = n(37),
        s = n(64);
      t.toSubscriber = r;
    },
    function (e, t, n) {
      "use strict";
      function r() {
        if (!u) {
          var e = c.timesOutAt;
          p ? w() : (p = !0), _(o, e);
        }
      }
      function i() {
        var e = c,
          t = c.next;
        if (c === t) c = null;
        else {
          var n = c.previous;
          (c = n.next = t), (t.previous = n);
        }
        (e.next = e.previous = null), (e = e.callback)(h);
      }
      function o(e) {
        (u = !0), (h.didTimeout = e);
        try {
          if (e)
            for (; null !== c; ) {
              var n = t.unstable_now();
              if (!(c.timesOutAt <= n)) break;
              do {
                i();
              } while (null !== c && c.timesOutAt <= n);
            }
          else if (null !== c)
            do {
              i();
            } while (null !== c && 0 < C() - t.unstable_now());
        } finally {
          (u = !1), null !== c ? r(c) : (p = !1);
        }
      }
      function s(e) {
        (a = y(function (t) {
          g(l), e(t);
        })),
          (l = m(function () {
            v(a), e(t.unstable_now());
          }, 100));
      } /** @license React v16.5.2
       * schedule.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      Object.defineProperty(t, "__esModule", { value: !0 });
      var a,
        l,
        c = null,
        u = !1,
        p = !1,
        d =
          "object" == typeof performance &&
          "function" == typeof performance.now,
        h = {
          timeRemaining: d
            ? function () {
                var e = C() - performance.now();
                return 0 < e ? e : 0;
              }
            : function () {
                var e = C() - Date.now();
                return 0 < e ? e : 0;
              },
          didTimeout: !1,
        },
        f = Date,
        m = "function" == typeof setTimeout ? setTimeout : void 0,
        g = "function" == typeof clearTimeout ? clearTimeout : void 0,
        y =
          "function" == typeof requestAnimationFrame
            ? requestAnimationFrame
            : void 0,
        v =
          "function" == typeof cancelAnimationFrame
            ? cancelAnimationFrame
            : void 0;
      if (d) {
        var b = performance;
        t.unstable_now = function () {
          return b.now();
        };
      } else
        t.unstable_now = function () {
          return f.now();
        };
      var _, w, C;
      if ("undefined" == typeof window) {
        var S = -1;
        (_ = function (e) {
          S = setTimeout(e, 0, !0);
        }),
          (w = function () {
            clearTimeout(S);
          }),
          (C = function () {
            return 0;
          });
      } else if (window._schedMock) {
        var k = window._schedMock;
        (_ = k[0]), (w = k[1]), (C = k[2]);
      } else {
        "undefined" != typeof console &&
          ("function" != typeof y &&
            console.error(
              "This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills",
            ),
          "function" != typeof v &&
            console.error(
              "This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills",
            ));
        var x = null,
          E = !1,
          T = -1,
          A = !1,
          O = !1,
          P = 0,
          I = 33,
          D = 33;
        C = function () {
          return P;
        };
        var L = "__reactIdleCallback$" + Math.random().toString(36).slice(2);
        window.addEventListener(
          "message",
          function (e) {
            if (e.source === window && e.data === L) {
              E = !1;
              var n = t.unstable_now();
              if (((e = !1), 0 >= P - n)) {
                if (!(-1 !== T && T <= n)) return void (A || ((A = !0), s(N)));
                e = !0;
              }
              if (((T = -1), (n = x), (x = null), null !== n)) {
                O = !0;
                try {
                  n(e);
                } finally {
                  O = !1;
                }
              }
            }
          },
          !1,
        );
        var N = function (e) {
          A = !1;
          var t = e - P + D;
          t < D && I < D ? (8 > t && (t = 8), (D = t < I ? I : t)) : (I = t),
            (P = e + D),
            E || ((E = !0), window.postMessage(L, "*"));
        };
        (_ = function (e, t) {
          (x = e),
            (T = t),
            O ? window.postMessage(L, "*") : A || ((A = !0), s(N));
        }),
          (w = function () {
            (x = null), (E = !1), (T = -1);
          });
      }
      (t.unstable_scheduleWork = function (e, n) {
        var i = t.unstable_now();
        if (
          ((n =
            void 0 !== n &&
            null !== n &&
            null !== n.timeout &&
            void 0 !== n.timeout
              ? i + n.timeout
              : i + 5e3),
          (e = { callback: e, timesOutAt: n, next: null, previous: null }),
          null === c)
        )
          (c = e.next = e.previous = e), r(c);
        else {
          i = null;
          var o = c;
          do {
            if (o.timesOutAt > n) {
              i = o;
              break;
            }
            o = o.next;
          } while (o !== c);
          null === i ? (i = c) : i === c && ((c = e), r(c)),
            (n = i.previous),
            (n.next = i.previous = e),
            (e.next = i),
            (e.previous = n);
        }
        return e;
      }),
        (t.unstable_cancelScheduledWork = function (e) {
          var t = e.next;
          if (null !== t) {
            if (t === e) c = null;
            else {
              e === c && (c = t);
              var n = e.previous;
              (n.next = t), (t.previous = n);
            }
            e.next = e.previous = null;
          }
        });
    },
    function (e, t, n) {
      "use strict";
      e.exports = n(263);
    },
    function (e, t, n) {
      e.exports = n(266);
    },
    function (e, t, n) {
      "use strict";
      (function (e, r) {
        Object.defineProperty(t, "__esModule", { value: !0 });
        var i,
          o = n(267),
          s = (function (e) {
            return e && e.__esModule ? e : { default: e };
          })(o);
        i =
          "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : void 0 !== e
            ? e
            : r;
        var a = (0, s.default)(i);
        t.default = a;
      }).call(t, n(15), n(87)(e));
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t,
          n = e.Symbol;
        return (
          "function" == typeof n
            ? n.observable
              ? (t = n.observable)
              : ((t = n("observable")), (n.observable = t))
            : (t = "@@observable"),
          t
        );
      }
      Object.defineProperty(t, "__esModule", { value: !0 }), (t.default = r);
    },
    function (e, t) {
      e.exports =
        /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804\uDCBD|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
    },
    function (e, t, n) {
      "use strict";
      (t.Any = n(86)),
        (t.Cc = n(84)),
        (t.Cf = n(268)),
        (t.P = n(39)),
        (t.Z = n(85));
    },
  ]);
});
//# sourceMappingURL=botchat.js.map
