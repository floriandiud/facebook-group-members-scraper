var X = Object.defineProperty;
var Y = (t, e, n) => e in t ? X(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var A = (t, e, n) => (Y(t, typeof e != "symbol" ? e + "" : e, n), n);
function Z(t, e) {
  for (var n = function(a) {
    for (var u = "", d = 0; d < a.length; d++) {
      var c = a[d] === null || typeof a[d] > "u" ? "" : a[d].toString();
      a[d] instanceof Date && (c = a[d].toLocaleString());
      var p = c.replace(/"/g, '""');
      p.search(/("|,|\n)/g) >= 0 && (p = '"' + p + '"'), d > 0 && (u += ","), u += p;
    }
    return u + `
`;
  }, r = "", s = 0; s < e.length; s++)
    r += n(e[s]);
  var i = new Blob([r], { type: "text/csv;charset=utf-8;" }), o = document.createElement("a");
  if (o.download !== void 0) {
    var l = URL.createObjectURL(i);
    o.setAttribute("href", l), o.setAttribute("download", t), document.body.appendChild(o), o.click(), document.body.removeChild(o);
  }
}
const I = (t, e) => e.some((n) => t instanceof n);
let M, j;
function N() {
  return M || (M = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function G() {
  return j || (j = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const _ = /* @__PURE__ */ new WeakMap(), x = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap();
function Q(t) {
  const e = new Promise((n, r) => {
    const s = () => {
      t.removeEventListener("success", i), t.removeEventListener("error", o);
    }, i = () => {
      n(h(t.result)), s();
    }, o = () => {
      r(t.error), s();
    };
    t.addEventListener("success", i), t.addEventListener("error", o);
  });
  return b.set(e, t), e;
}
function ee(t) {
  if (_.has(t))
    return;
  const e = new Promise((n, r) => {
    const s = () => {
      t.removeEventListener("complete", i), t.removeEventListener("error", o), t.removeEventListener("abort", o);
    }, i = () => {
      n(), s();
    }, o = () => {
      r(t.error || new DOMException("AbortError", "AbortError")), s();
    };
    t.addEventListener("complete", i), t.addEventListener("error", o), t.addEventListener("abort", o);
  });
  _.set(t, e);
}
let D = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === "done")
        return _.get(t);
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
  D = t(D);
}
function te(t) {
  return G().includes(t) ? function(...e) {
    return t.apply(S(this), e), h(this.request);
  } : function(...e) {
    return h(t.apply(S(this), e));
  };
}
function ne(t) {
  return typeof t == "function" ? te(t) : (t instanceof IDBTransaction && ee(t), I(t, N()) ? new Proxy(t, D) : t);
}
function h(t) {
  if (t instanceof IDBRequest)
    return Q(t);
  if (x.has(t))
    return x.get(t);
  const e = ne(t);
  return e !== t && (x.set(t, e), b.set(e, t)), e;
}
const S = (t) => b.get(t);
function re(t, e, { blocked: n, upgrade: r, blocking: s, terminated: i } = {}) {
  const o = indexedDB.open(t, e), l = h(o);
  return r && o.addEventListener("upgradeneeded", (a) => {
    r(h(o.result), a.oldVersion, a.newVersion, h(o.transaction), a);
  }), n && o.addEventListener("blocked", (a) => n(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    a.oldVersion,
    a.newVersion,
    a
  )), l.then((a) => {
    i && a.addEventListener("close", () => i()), s && a.addEventListener("versionchange", (u) => s(u.oldVersion, u.newVersion, u));
  }).catch(() => {
  }), l;
}
const se = ["get", "getKey", "getAll", "getAllKeys", "count"], ie = ["put", "add", "delete", "clear"], E = /* @__PURE__ */ new Map();
function L(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string"))
    return;
  if (E.get(e))
    return E.get(e);
  const n = e.replace(/FromIndex$/, ""), r = e !== n, s = ie.includes(n);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(s || se.includes(n))
  )
    return;
  const i = async function(o, ...l) {
    const a = this.transaction(o, s ? "readwrite" : "readonly");
    let u = a.store;
    return r && (u = u.index(l.shift())), (await Promise.all([
      u[n](...l),
      s && a.done
    ]))[0];
  };
  return E.set(e, i), i;
}
K((t) => ({
  ...t,
  get: (e, n, r) => L(e, n) || t.get(e, n, r),
  has: (e, n) => !!L(e, n) || t.has(e, n)
}));
const oe = ["continue", "continuePrimaryKey", "advance"], R = {}, C = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), ae = {
  get(t, e) {
    if (!oe.includes(e))
      return t[e];
    let n = R[e];
    return n || (n = R[e] = function(...r) {
      C.set(this, W.get(this)[e](...r));
    }), n;
  }
};
async function* ce(...t) {
  let e = this;
  if (e instanceof IDBCursor || (e = await e.openCursor(...t)), !e)
    return;
  e = e;
  const n = new Proxy(e, ae);
  for (W.set(n, e), b.set(n, S(e)); e; )
    yield n, e = await (C.get(n) || e.continue()), C.delete(n);
}
function V(t, e) {
  return e === Symbol.asyncIterator && I(t, [IDBIndex, IDBObjectStore, IDBCursor]) || e === "iterate" && I(t, [IDBIndex, IDBObjectStore]);
}
K((t) => ({
  ...t,
  get(e, n, r) {
    return V(e, n) ? ce : t.get(e, n, r);
  },
  has(e, n) {
    return V(e, n) || t.has(e, n);
  }
}));
var f = function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function l(d) {
      try {
        u(r.next(d));
      } catch (c) {
        o(c);
      }
    }
    function a(d) {
      try {
        u(r.throw(d));
      } catch (c) {
        o(c);
      }
    }
    function u(d) {
      d.done ? i(d.value) : s(d.value).then(l, a);
    }
    u((r = r.apply(t, e || [])).next());
  });
}, de = function(t, e) {
  var n = {};
  for (var r in t)
    Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, r = Object.getOwnPropertySymbols(t); s < r.length; s++)
      e.indexOf(r[s]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[s]) && (n[r[s]] = t[r[s]]);
  return n;
};
class ue {
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
      this.db = yield re(this.storageKey, 5, {
        upgrade(e, n, r, s) {
          let i;
          if (n < 5)
            try {
              e.deleteObjectStore("data");
            } catch {
            }
          e.objectStoreNames.contains("data") ? i = s.objectStore("data") : i = e.createObjectStore("data", {
            keyPath: "_id",
            autoIncrement: !0
          }), i && !i.indexNames.contains("_createdAt") && i.createIndex("_createdAt", "_createdAt"), i && !i.indexNames.contains("_pk") && i.createIndex("_pk", "_pk", {
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
  _dbSetElem(e, n, r = !1, s) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db) {
        s || (s = this.db.transaction("data", "readwrite"));
        const i = s.store, o = yield i.index("_pk").get(e);
        o ? r && (yield i.put(Object.assign(Object.assign({}, o), n))) : yield i.put(Object.assign({ _pk: e, _createdAt: /* @__PURE__ */ new Date() }, n));
      } else
        throw new Error("DB doesnt exist");
    });
  }
  addElem(e, n, r = !1) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db)
        try {
          yield this._dbSetElem(e, n, r);
        } catch (s) {
          console.error(s);
        }
      else
        this.data.set(e, n);
    });
  }
  addElems(e, n = !1) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db) {
        const r = [], s = this.db.transaction("data", "readwrite");
        e.forEach(([i, o]) => {
          r.push(this._dbSetElem(i, o, n, s));
        }), r.push(s.done), yield Promise.all(r);
      } else
        e.forEach(([r, s]) => {
          this.addElem(r, s);
        });
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
          const { _id: s } = r, i = de(r, ["_id"]);
          e.set(s, i);
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
        } catch (s) {
          console.error(s);
        }
      }), e;
    });
  }
}
function y(t, e) {
  const n = document.createElement("span");
  return e && n.setAttribute("id", e), n.textContent = t, n;
}
function F(t) {
  const e = document.createElement("div"), n = [
    "display: block;",
    "padding: 0px 4px;"
  ];
  return t && n.push("border-left: 1px solid #2e2e2e;", "margin-left: 4px;"), e.setAttribute("style", n.join("")), e;
}
function le() {
  const t = document.createElement("div"), e = [
    "position: absolute;",
    "bottom: 30px;",
    "right: 130px;",
    "color: #2e2e2e;",
    "background: #EEE;",
    "border-radius: 12px;",
    "padding: 0px 12px;",
    "cursor: pointer;",
    "font-weight:600;",
    "font-size:15px;",
    "display: flex;",
    "pointer-events: auto;",
    "border: 1px solid #000;",
    "height: 36px;",
    "align-items: center;",
    "justify-content: center;"
  ];
  return t.setAttribute("style", e.join("")), t;
}
function fe() {
  const t = document.createElement("div"), e = [
    "position: fixed;",
    "top: 0;",
    "left: 0;",
    "z-index: 10;",
    "width: 100%;",
    "height: 100%;",
    "pointer-events: none;"
  ];
  t.setAttribute("style", e.join(""));
  const n = le();
  return t.appendChild(n), document.body.appendChild(t), n;
}
class he extends ue {
  constructor() {
    super(...arguments);
    A(this, "name", "fb-scrape-storage");
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
const g = new he();
async function B() {
  const t = document.getElementById("fb-group-scraper-number-tracker");
  if (t) {
    const e = await g.getCount();
    t.textContent = e.toString();
  }
}
function pe() {
  const t = fe(), e = F();
  e.appendChild(y("Download ")), e.appendChild(y("0", "fb-group-scraper-number-tracker")), e.appendChild(y(" members")), e.addEventListener("click", async function() {
    const r = (/* @__PURE__ */ new Date()).toISOString(), s = await g.toCsvData();
    Z(`groupMemberExport-${r}.csv`, s);
  }), t.appendChild(e);
  const n = F(!0);
  n.appendChild(y("Reset")), n.addEventListener("click", async function() {
    await g.clear(), await B();
  }), t.appendChild(n), window.setTimeout(() => {
    B();
  }, 1e3);
}
function ye(t) {
  var i, o, l, a, u, d;
  let e;
  if ((i = t == null ? void 0 : t.data) != null && i.group)
    e = t.data.group;
  else if (((l = (o = t == null ? void 0 : t.data) == null ? void 0 : o.node) == null ? void 0 : l.__typename) === "Group")
    e = t.data.node;
  else
    return;
  let n;
  if ((a = e == null ? void 0 : e.new_members) != null && a.edges)
    n = e.new_members.edges;
  else if ((u = e == null ? void 0 : e.new_forum_members) != null && u.edges)
    n = e.new_forum_members.edges;
  else if ((d = e == null ? void 0 : e.search_results) != null && d.edges)
    n = e.search_results.edges;
  else
    return;
  const r = n.map((c) => {
    var P, O, T, k;
    const m = c.node.__isEntity === "GroupUserInvite" ? c.node.invitee_profile : c.node;
    if (!m)
      return null;
    const {
      id: J,
      name: U,
      bio_text: v,
      url: z,
      profile_picture: w,
      __isProfile: $
    } = m, q = ((P = c == null ? void 0 : c.join_status_text) == null ? void 0 : P.text) || ((T = (O = c == null ? void 0 : c.membership) == null ? void 0 : O.join_status_text) == null ? void 0 : T.text), H = (k = m.group_membership) == null ? void 0 : k.associated_group.id;
    return {
      profileId: J,
      fullName: U,
      profileLink: z,
      bio: (v == null ? void 0 : v.text) || "",
      imageSrc: (w == null ? void 0 : w.uri) || "",
      groupId: H,
      groupJoiningText: q || "",
      profileType: $
    };
  }), s = [];
  r.forEach((c) => {
    c && s.push([c.profileId, c]);
  }), g.addElems(s).then(() => {
    B();
  });
}
function ge(t) {
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
    for (let s = 0; s < r.length; s++) {
      const i = r[s];
      try {
        e.push(JSON.parse(i));
      } catch {
        console.error("Fail to parse API response", n);
      }
    }
  }
  for (let n = 0; n < e.length; n++)
    ye(e[n]);
}
function be() {
  pe();
  const t = "/api/graphql/";
  let e = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    this.addEventListener("readystatechange", function() {
      this.responseURL.includes(t) && this.readyState === 4 && ge(this.responseText);
    }, !1), e.apply(this, arguments);
  };
}
be();
