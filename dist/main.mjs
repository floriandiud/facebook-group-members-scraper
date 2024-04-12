var G = Object.defineProperty;
var Q = (t, e, n) => e in t ? G(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var M = (t, e, n) => (Q(t, typeof e != "symbol" ? e + "" : e, n), n);
function ee(t, e) {
  for (var n = function(a) {
    for (var c = "", d = 0; d < a.length; d++) {
      var u = a[d] === null || typeof a[d] > "u" ? "" : a[d].toString();
      a[d] instanceof Date && (u = a[d].toLocaleString());
      var p = u.replace(/"/g, '""');
      p.search(/("|,|\n)/g) >= 0 && (p = '"' + p + '"'), d > 0 && (c += ","), c += p;
    }
    return c + `
`;
  }, r = "", i = 0; i < e.length; i++)
    r += n(e[i]);
  var o = new Blob([r], { type: "text/csv;charset=utf-8;" }), s = document.createElement("a");
  if (s.download !== void 0) {
    var l = URL.createObjectURL(o);
    s.setAttribute("href", l), s.setAttribute("download", t), document.body.appendChild(s), s.click(), document.body.removeChild(s);
  }
}
const _ = (t, e) => e.some((n) => t instanceof n);
let P, j;
function te() {
  return P || (P = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function ne() {
  return j || (j = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const D = /* @__PURE__ */ new WeakMap(), E = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap();
function re(t) {
  const e = new Promise((n, r) => {
    const i = () => {
      t.removeEventListener("success", o), t.removeEventListener("error", s);
    }, o = () => {
      n(h(t.result)), i();
    }, s = () => {
      r(t.error), i();
    };
    t.addEventListener("success", o), t.addEventListener("error", s);
  });
  return b.set(e, t), e;
}
function ie(t) {
  if (D.has(t))
    return;
  const e = new Promise((n, r) => {
    const i = () => {
      t.removeEventListener("complete", o), t.removeEventListener("error", s), t.removeEventListener("abort", s);
    }, o = () => {
      n(), i();
    }, s = () => {
      r(t.error || new DOMException("AbortError", "AbortError")), i();
    };
    t.addEventListener("complete", o), t.addEventListener("error", s), t.addEventListener("abort", s);
  });
  D.set(t, e);
}
let C = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === "done")
        return D.get(t);
      if (e === "store")
        return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
    }
    return h(t[e]);
  },
  set(t, e, n) {
    return t[e] = n, !0;
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in t;
  }
};
function K(t) {
  C = t(C);
}
function oe(t) {
  return ne().includes(t) ? function(...e) {
    return t.apply(S(this), e), h(this.request);
  } : function(...e) {
    return h(t.apply(S(this), e));
  };
}
function se(t) {
  return typeof t == "function" ? oe(t) : (t instanceof IDBTransaction && ie(t), _(t, te()) ? new Proxy(t, C) : t);
}
function h(t) {
  if (t instanceof IDBRequest)
    return re(t);
  if (E.has(t))
    return E.get(t);
  const e = se(t);
  return e !== t && (E.set(t, e), b.set(e, t)), e;
}
const S = (t) => b.get(t);
function ae(t, e, { blocked: n, upgrade: r, blocking: i, terminated: o } = {}) {
  const s = indexedDB.open(t, e), l = h(s);
  return r && s.addEventListener("upgradeneeded", (a) => {
    r(h(s.result), a.oldVersion, a.newVersion, h(s.transaction), a);
  }), n && s.addEventListener("blocked", (a) => n(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    a.oldVersion,
    a.newVersion,
    a
  )), l.then((a) => {
    o && a.addEventListener("close", () => o()), i && a.addEventListener("versionchange", (c) => i(c.oldVersion, c.newVersion, c));
  }).catch(() => {
  }), l;
}
const ce = ["get", "getKey", "getAll", "getAllKeys", "count"], de = ["put", "add", "delete", "clear"], I = /* @__PURE__ */ new Map();
function R(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string"))
    return;
  if (I.get(e))
    return I.get(e);
  const n = e.replace(/FromIndex$/, ""), r = e !== n, i = de.includes(n);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || ce.includes(n))
  )
    return;
  const o = async function(s, ...l) {
    const a = this.transaction(s, i ? "readwrite" : "readonly");
    let c = a.store;
    return r && (c = c.index(l.shift())), (await Promise.all([
      c[n](...l),
      i && a.done
    ]))[0];
  };
  return I.set(e, o), o;
}
K((t) => ({
  ...t,
  get: (e, n, r) => R(e, n) || t.get(e, n, r),
  has: (e, n) => !!R(e, n) || t.has(e, n)
}));
const le = ["continue", "continuePrimaryKey", "advance"], V = {}, B = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), ue = {
  get(t, e) {
    if (!le.includes(e))
      return t[e];
    let n = V[e];
    return n || (n = V[e] = function(...r) {
      B.set(this, U.get(this)[e](...r));
    }), n;
  }
};
async function* fe(...t) {
  let e = this;
  if (e instanceof IDBCursor || (e = await e.openCursor(...t)), !e)
    return;
  e = e;
  const n = new Proxy(e, ue);
  for (U.set(n, e), b.set(n, S(e)); e; )
    yield n, e = await (B.get(n) || e.continue()), B.delete(n);
}
function F(t, e) {
  return e === Symbol.asyncIterator && _(t, [IDBIndex, IDBObjectStore, IDBCursor]) || e === "iterate" && _(t, [IDBIndex, IDBObjectStore]);
}
K((t) => ({
  ...t,
  get(e, n, r) {
    return F(e, n) ? fe : t.get(e, n, r);
  },
  has(e, n) {
    return F(e, n) || t.has(e, n);
  }
}));
var f = function(t, e, n, r) {
  function i(o) {
    return o instanceof n ? o : new n(function(s) {
      s(o);
    });
  }
  return new (n || (n = Promise))(function(o, s) {
    function l(d) {
      try {
        c(r.next(d));
      } catch (u) {
        s(u);
      }
    }
    function a(d) {
      try {
        c(r.throw(d));
      } catch (u) {
        s(u);
      }
    }
    function c(d) {
      d.done ? o(d.value) : i(d.value).then(l, a);
    }
    c((r = r.apply(t, e || [])).next());
  });
}, he = function(t, e) {
  var n = {};
  for (var r in t)
    Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(t); i < r.length; i++)
      e.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[i]) && (n[r[i]] = t[r[i]]);
  return n;
};
class pe {
  constructor(e) {
    this.name = "scrape-storage", this.persistent = !0, this.data = /* @__PURE__ */ new Map(), e != null && e.name && (this.name = e.name), e != null && e.persistent && (this.persistent = e.persistent), this.initDB().then(() => {
    }).catch(() => {
      this.persistent = !1;
    });
  }
  get storageKey() {
    return `storage-${this.name}`;
  }
  initDB() {
    return f(this, void 0, void 0, function* () {
      this.db = yield ae(this.storageKey, 6, {
        upgrade(e, n, r, i) {
          let o;
          if (n < 5)
            try {
              e.deleteObjectStore("data");
            } catch {
            }
          e.objectStoreNames.contains("data") ? o = i.objectStore("data") : o = e.createObjectStore("data", {
            keyPath: "_id",
            autoIncrement: !0
          }), o && !o.indexNames.contains("_createdAt") && o.createIndex("_createdAt", "_createdAt"), o && !o.indexNames.contains("_groupId") && o.createIndex("_groupId", "_groupId"), o && !o.indexNames.contains("_pk") && o.createIndex("_pk", "_pk", {
            unique: !0
          });
        }
      });
    });
  }
  _dbGetElem(e, n) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db)
        return n || (n = this.db.transaction("data", "readonly")), yield n.store.index("_pk").get(e);
      throw new Error("DB doesnt exist");
    });
  }
  getElem(e) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db)
        try {
          return yield this._dbGetElem(e);
        } catch (n) {
          console.error(n);
        }
      else
        this.data.get(e);
    });
  }
  _dbSetElem(e, n, r = !1, i, o) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db) {
        let s = !1;
        o || (o = this.db.transaction("data", "readwrite"));
        const l = o.store, a = yield l.index("_pk").get(e);
        if (a)
          r && (yield l.put(Object.assign(Object.assign({}, a), n)), s = !0);
        else {
          const c = Object.assign({ _pk: e, _createdAt: /* @__PURE__ */ new Date() }, n);
          i && (c._groupId = i), yield l.put(c), s = !0;
        }
        return s;
      } else
        throw new Error("DB doesnt exist");
    });
  }
  addElem(e, n, r = !1, i) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db)
        try {
          return yield this._dbSetElem(e, n, r, i);
        } catch (o) {
          console.error(o);
        }
      else
        this.data.set(e, n);
      return !0;
    });
  }
  addElems(e, n = !1, r) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db) {
        const i = [], o = this.db.transaction("data", "readwrite"), s = [];
        if (e.forEach(([l, a]) => {
          s.indexOf(l) === -1 && (s.push(l), i.push(this._dbSetElem(l, a, n, r, o)));
        }), i.length > 0) {
          i.push(o.done);
          const l = yield Promise.all(i);
          let a = 0;
          return l.forEach((c) => {
            typeof c == "boolean" && c && (a += 1);
          }), a;
        }
        return 0;
      } else
        return e.forEach(([i, o]) => {
          this.addElem(i, o);
        }), e.length;
    });
  }
  deleteFromGroupId(e) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db) {
        let n = 0, i = yield this.db.transaction("data", "readwrite").store.index("_groupId").openCursor(IDBKeyRange.only(e));
        for (; i; )
          i.delete(), i = yield i.continue(), n += 1;
        return n;
      } else
        throw new Error("Not Implemented Error");
    });
  }
  clear() {
    return f(this, void 0, void 0, function* () {
      this.persistent && this.db ? yield this.db.clear("data") : this.data.clear();
    });
  }
  getCount() {
    return f(this, void 0, void 0, function* () {
      return this.persistent && this.db ? yield this.db.count("data") : this.data.size;
    });
  }
  getAll() {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db) {
        const e = /* @__PURE__ */ new Map(), n = yield this.db.getAll("data");
        return n && n.forEach((r) => {
          const { _id: i } = r, o = he(r, ["_id"]);
          e.set(i, o);
        }), e;
      } else
        return this.data;
    });
  }
  toCsvData() {
    return f(this, void 0, void 0, function* () {
      const e = [];
      return e.push(this.headers), (yield this.getAll()).forEach((r) => {
        try {
          e.push(this.itemToRow(r));
        } catch (i) {
          console.error(i);
        }
      }), e;
    });
  }
}
const ye = [
  "display: block;",
  "padding: 0px 4px;",
  "cursor: pointer;",
  "text-align: center;"
];
function W(t) {
  const e = document.createElement("div"), n = [...ye];
  return t && n.push("flex-grow: 1;"), e.setAttribute("style", n.join("")), e;
}
const ge = [
  "margin-left: 4px;",
  "margin-right: 4px;",
  "border-left: 1px solid #2e2e2e;"
];
function X() {
  const t = document.createElement("div");
  return t.innerHTML = "&nbsp;", t.setAttribute("style", ge.join("")), t;
}
function g(t, e) {
  const n = e || {};
  let r;
  const i = document.createElement("span");
  if (n.bold) {
    const o = document.createElement("strong");
    i.append(o), r = o;
  } else
    r = i;
  return r.textContent = t, n.idAttribute && r.setAttribute("id", n.idAttribute), i;
}
const me = [
  "position: fixed;",
  "top: 0;",
  "left: 0;",
  "z-index: 10000;",
  "width: 100%;",
  "height: 100%;",
  "pointer-events: none;"
], be = [
  "position: absolute;",
  "bottom: 30px;",
  "right: 30px;",
  "width: auto;",
  "pointer-events: auto;"
], we = [
  "align-items: center;",
  "appearance: none;",
  "background-color: #EEE;",
  "border-radius: 4px;",
  "border-width: 0;",
  "box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;",
  "box-sizing: border-box;",
  "color: #36395A;",
  "display: flex;",
  "font-family: monospace;",
  "height: 38px;",
  "justify-content: space-between;",
  "line-height: 1;",
  "list-style: none;",
  "overflow: hidden;",
  "padding-left: 16px;",
  "padding-right: 16px;",
  "position: relative;",
  "text-align: left;",
  "text-decoration: none;",
  "user-select: none;",
  "white-space: nowrap;",
  "font-size: 18px;"
];
class ve {
  constructor() {
    this.ctas = [], this.canva = document.createElement("div"), this.canva.setAttribute("style", me.join("")), this.inner = document.createElement("div"), this.inner.setAttribute("style", be.join("")), this.canva.appendChild(this.inner), this.history = document.createElement("div"), this.inner.appendChild(this.history), this.container = document.createElement("div"), this.container.setAttribute("style", we.join("")), this.inner.appendChild(this.container);
  }
  makeItDraggable() {
    let e = 0, n = 0, r = 0, i = 0;
    const o = (d) => {
      r = d.clientX - e, i = d.clientY - n, this.inner.style.right = window.innerWidth - r - this.inner.offsetWidth + "px", this.inner.style.bottom = window.innerHeight - i - this.inner.offsetHeight + "px";
    }, s = (d) => {
      d.preventDefault(), e = d.clientX - this.inner.offsetLeft, n = d.clientY - this.inner.offsetTop, window.addEventListener("mousemove", o, !1);
    }, l = () => {
      window.removeEventListener("mousemove", o, !1);
    };
    this.inner.addEventListener("mousedown", s, !1), window.addEventListener("mouseup", l, !1);
    const a = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="18px" width="18px" xmlns="http://www.w3.org/2000/svg"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>', c = document.createElement("div");
    c.style.cursor = "move", c.innerHTML = a, this.addCta(X()), this.addCta(c);
  }
  render() {
    document.body.appendChild(this.canva);
  }
  // CTA
  addCta(e, n) {
    typeof n > "u" ? this.ctas.push(e) : this.ctas.splice(n, 0, e), this.container.innerHTML = "", this.ctas.forEach((r) => {
      this.container.appendChild(r);
    });
  }
}
var H;
(function(t) {
  t.ADD = "add", t.LOG = "log";
})(H || (H = {}));
class xe extends pe {
  constructor() {
    super(...arguments);
    M(this, "name", "fb-scrape-storage");
  }
  get headers() {
    return [
      "Profile Id",
      "Full Name",
      "Profile Link",
      "Bio",
      "ImageSrc",
      "GroupId",
      "Group Joining Text",
      "Profile Type"
    ];
  }
  itemToRow(n) {
    return [
      n.profileId,
      n.fullName,
      n.profileLink,
      n.bio,
      n.imageSrc,
      n.groupId,
      n.groupJoiningText,
      n.profileType
    ];
  }
}
const m = new xe(), J = "fb-group-scraper-number-tracker", Ee = "groupMemberExport";
async function A() {
  const t = document.getElementById(J);
  if (t) {
    const e = await m.getCount();
    t.textContent = e.toString();
  }
}
const y = new ve();
function Ie() {
  const t = W();
  t.appendChild(g("Download ")), t.appendChild(g("0", {
    bold: !0,
    idAttribute: J
  })), t.appendChild(g(" users")), t.addEventListener("click", async function() {
    const n = (/* @__PURE__ */ new Date()).toISOString(), r = await m.toCsvData();
    try {
      ee(`${Ee}-${n}.csv`, r);
    } catch (i) {
      console.error("Error while generating export"), console.log(i.stack);
    }
  }), y.addCta(t), y.addCta(X());
  const e = W();
  e.appendChild(g("Reset")), e.addEventListener("click", async function() {
    await m.clear(), await A();
  }), y.addCta(e), y.makeItDraggable(), y.render(), window.setTimeout(() => {
    A();
  }, 1e3);
}
function _e(t) {
  var o, s, l, a, c, d;
  let e;
  if ((o = t == null ? void 0 : t.data) != null && o.group)
    e = t.data.group;
  else if (((l = (s = t == null ? void 0 : t.data) == null ? void 0 : s.node) == null ? void 0 : l.__typename) === "Group")
    e = t.data.node;
  else
    return;
  let n;
  if ((a = e == null ? void 0 : e.new_members) != null && a.edges)
    n = e.new_members.edges;
  else if ((c = e == null ? void 0 : e.new_forum_members) != null && c.edges)
    n = e.new_forum_members.edges;
  else if ((d = e == null ? void 0 : e.search_results) != null && d.edges)
    n = e.search_results.edges;
  else
    return;
  const r = n.map((u) => {
    var k, T, L, O;
    const w = u.node.__isEntity === "GroupUserInvite" ? u.node.invitee_profile : u.node;
    if (!w)
      return null;
    const {
      id: z,
      name: Y,
      bio_text: v,
      url: $,
      profile_picture: x,
      __isProfile: q
    } = w, N = ((k = u == null ? void 0 : u.join_status_text) == null ? void 0 : k.text) || ((L = (T = u == null ? void 0 : u.membership) == null ? void 0 : T.join_status_text) == null ? void 0 : L.text), Z = (O = w.group_membership) == null ? void 0 : O.associated_group.id;
    return {
      profileId: z,
      fullName: Y,
      profileLink: $,
      bio: (v == null ? void 0 : v.text) || "",
      imageSrc: (x == null ? void 0 : x.uri) || "",
      groupId: Z,
      groupJoiningText: N || "",
      profileType: q
    };
  }), i = [];
  r.forEach((u) => {
    u && i.push([u.profileId, u]);
  }), m.addElems(i).then(() => {
    A();
  });
}
function De(t) {
  let e = [];
  try {
    e.push(JSON.parse(t));
  } catch (n) {
    const r = t.split(`
`);
    if (r.length <= 1) {
      console.error("Fail to parse API response", n);
      return;
    }
    for (let i = 0; i < r.length; i++) {
      const o = r[i];
      try {
        e.push(JSON.parse(o));
      } catch {
        console.error("Fail to parse API response", n);
      }
    }
  }
  for (let n = 0; n < e.length; n++)
    _e(e[n]);
}
function Ce() {
  Ie();
  const t = "/api/graphql/";
  let e = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    this.addEventListener("readystatechange", function() {
      this.responseURL.includes(t) && this.readyState === 4 && De(this.responseText);
    }, !1), e.apply(this, arguments);
  };
}
Ce();
