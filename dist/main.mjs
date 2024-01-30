var q = Object.defineProperty;
var Y = (t, e, n) => e in t ? q(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var M = (t, e, n) => (Y(t, typeof e != "symbol" ? e + "" : e, n), n);
function Z(t, e) {
  for (var n = function(c) {
    for (var u = "", d = 0; d < c.length; d++) {
      var a = c[d] === null || typeof c[d] > "u" ? "" : c[d].toString();
      c[d] instanceof Date && (a = c[d].toLocaleString());
      var p = a.replace(/"/g, '""');
      p.search(/("|,|\n)/g) >= 0 && (p = '"' + p + '"'), d > 0 && (u += ","), u += p;
    }
    return u + `
`;
  }, r = "", i = 0; i < e.length; i++)
    r += n(e[i]);
  var o = new Blob([r], { type: "text/csv;charset=utf-8;" }), s = document.createElement("a");
  if (s.download !== void 0) {
    var l = URL.createObjectURL(o);
    s.setAttribute("href", l), s.setAttribute("download", t), document.body.appendChild(s), s.click(), document.body.removeChild(s);
  }
}
const I = (t, e) => e.some((n) => t instanceof n);
let L, k;
function N() {
  return L || (L = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function G() {
  return k || (k = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const D = /* @__PURE__ */ new WeakMap(), x = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap();
function Q(t) {
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
function ee(t) {
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
function te(t) {
  return G().includes(t) ? function(...e) {
    return t.apply(_(this), e), h(this.request);
  } : function(...e) {
    return h(t.apply(_(this), e));
  };
}
function ne(t) {
  return typeof t == "function" ? te(t) : (t instanceof IDBTransaction && ee(t), I(t, N()) ? new Proxy(t, C) : t);
}
function h(t) {
  if (t instanceof IDBRequest)
    return Q(t);
  if (x.has(t))
    return x.get(t);
  const e = ne(t);
  return e !== t && (x.set(t, e), b.set(e, t)), e;
}
const _ = (t) => b.get(t);
function re(t, e, { blocked: n, upgrade: r, blocking: i, terminated: o } = {}) {
  const s = indexedDB.open(t, e), l = h(s);
  return r && s.addEventListener("upgradeneeded", (c) => {
    r(h(s.result), c.oldVersion, c.newVersion, h(s.transaction), c);
  }), n && s.addEventListener("blocked", (c) => n(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    c.oldVersion,
    c.newVersion,
    c
  )), l.then((c) => {
    o && c.addEventListener("close", () => o()), i && c.addEventListener("versionchange", (u) => i(u.oldVersion, u.newVersion, u));
  }).catch(() => {
  }), l;
}
const ie = ["get", "getKey", "getAll", "getAllKeys", "count"], se = ["put", "add", "delete", "clear"], E = /* @__PURE__ */ new Map();
function j(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string"))
    return;
  if (E.get(e))
    return E.get(e);
  const n = e.replace(/FromIndex$/, ""), r = e !== n, i = se.includes(n);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || ie.includes(n))
  )
    return;
  const o = async function(s, ...l) {
    const c = this.transaction(s, i ? "readwrite" : "readonly");
    let u = c.store;
    return r && (u = u.index(l.shift())), (await Promise.all([
      u[n](...l),
      i && c.done
    ]))[0];
  };
  return E.set(e, o), o;
}
K((t) => ({
  ...t,
  get: (e, n, r) => j(e, n) || t.get(e, n, r),
  has: (e, n) => !!j(e, n) || t.has(e, n)
}));
const oe = ["continue", "continuePrimaryKey", "advance"], R = {}, B = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), ce = {
  get(t, e) {
    if (!oe.includes(e))
      return t[e];
    let n = R[e];
    return n || (n = R[e] = function(...r) {
      B.set(this, W.get(this)[e](...r));
    }), n;
  }
};
async function* ae(...t) {
  let e = this;
  if (e instanceof IDBCursor || (e = await e.openCursor(...t)), !e)
    return;
  e = e;
  const n = new Proxy(e, ce);
  for (W.set(n, e), b.set(n, _(e)); e; )
    yield n, e = await (B.get(n) || e.continue()), B.delete(n);
}
function F(t, e) {
  return e === Symbol.asyncIterator && I(t, [IDBIndex, IDBObjectStore, IDBCursor]) || e === "iterate" && I(t, [IDBIndex, IDBObjectStore]);
}
K((t) => ({
  ...t,
  get(e, n, r) {
    return F(e, n) ? ae : t.get(e, n, r);
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
        u(r.next(d));
      } catch (a) {
        s(a);
      }
    }
    function c(d) {
      try {
        u(r.throw(d));
      } catch (a) {
        s(a);
      }
    }
    function u(d) {
      d.done ? o(d.value) : i(d.value).then(l, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
}, de = function(t, e) {
  var n = {};
  for (var r in t)
    Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(t); i < r.length; i++)
      e.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[i]) && (n[r[i]] = t[r[i]]);
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
      this.db = yield re(this.storageKey, 3, {
        upgrade(e) {
          e.createObjectStore("data", {
            keyPath: "_id"
          });
        }
      });
    });
  }
  _dbAddElem(e, n) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db)
        yield this.db.put("data", Object.assign({ _id: e }, n));
      else
        throw new Error("DB doesnt exist");
    });
  }
  addElem(e, n) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db)
        try {
          yield this._dbAddElem(e, n);
        } catch (r) {
          console.error(r);
        }
      else
        this.data.set(e, n);
    });
  }
  addElems(e) {
    return f(this, void 0, void 0, function* () {
      if (this.persistent && this.db) {
        const n = [];
        e.forEach(([r, i]) => {
          n.push(this._dbAddElem(r, i));
        }), yield Promise.all(n);
      } else
        e.forEach(([n, r]) => {
          this.addElem(n, r);
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
          const { _id: i } = r, o = de(r, ["_id"]);
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
function y(t, e) {
  const n = document.createElement("span");
  return e && n.setAttribute("id", e), n.textContent = t, n;
}
function V(t) {
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
const g = new he();
async function S() {
  const t = document.getElementById("fb-group-scraper-number-tracker");
  if (t) {
    const e = await g.getCount();
    t.textContent = e.toString();
  }
}
function pe() {
  const t = fe(), e = V();
  e.appendChild(y("Download ")), e.appendChild(y("0", "fb-group-scraper-number-tracker")), e.appendChild(y(" members")), e.addEventListener("click", async function() {
    const r = (/* @__PURE__ */ new Date()).toISOString(), i = await g.toCsvData();
    Z(`groupMemberExport-${r}.csv`, i);
  }), t.appendChild(e);
  const n = V(!0);
  n.appendChild(y("Reset")), n.addEventListener("click", async function() {
    await g.clear(), await S();
  }), t.appendChild(n), window.setTimeout(() => {
    S();
  }, 1e3);
}
function ye(t) {
  var o, s, l, c, u, d;
  let e;
  if ((o = t == null ? void 0 : t.data) != null && o.group)
    e = t.data.group;
  else if (((l = (s = t == null ? void 0 : t.data) == null ? void 0 : s.node) == null ? void 0 : l.__typename) === "Group")
    e = t.data.node;
  else
    return;
  let n;
  if ((c = e == null ? void 0 : e.new_members) != null && c.edges)
    n = e.new_members.edges;
  else if ((u = e == null ? void 0 : e.new_forum_members) != null && u.edges)
    n = e.new_forum_members.edges;
  else if ((d = e == null ? void 0 : e.search_results) != null && d.edges)
    n = e.search_results.edges;
  else
    return;
  const r = n.map((a) => {
    var P, T, A, O;
    const m = a.node.__isEntity === "GroupUserInvite" ? a.node.invitee_profile : a.node;
    if (!m)
      return null;
    const {
      id: J,
      name: U,
      bio_text: v,
      url: z,
      profile_picture: w,
      __isProfile: $
    } = m, H = ((P = a == null ? void 0 : a.join_status_text) == null ? void 0 : P.text) || ((A = (T = a == null ? void 0 : a.membership) == null ? void 0 : T.join_status_text) == null ? void 0 : A.text), X = (O = m.group_membership) == null ? void 0 : O.associated_group.id;
    return {
      profileId: J,
      fullName: U,
      profileLink: z,
      bio: (v == null ? void 0 : v.text) || "",
      imageSrc: (w == null ? void 0 : w.uri) || "",
      groupId: X,
      groupJoiningText: H || "",
      profileType: $
    };
  }), i = [];
  r.forEach((a) => {
    a && i.push([a.profileId, a]);
  }), g.addElems(i).then(() => {
    S();
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
