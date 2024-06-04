# Facebook Group Members Scraper

Script to scrape Facebook group members and export them into a CSV file. This Facebook Group members extractor works in the browser, without installing an extension or using a proxy. Just copy-paste the script into your Chrome console.

## How to run the Facebook Group Extractor script

 1. Go to a Facebook group page
 1. Open Chrome Developer Console
 1. Copy Paste the following code into the console. It will add a "Download 0 members" button. **Important: Copy/Paste before moving to the "People/Members" tab**
 1. Click on the "People" tab of the group page
 1. Scroll to load new members that will get scraped by the script. The button counter increases with new members scraped.
    - If you have a lot of members, you can use this script to load them all
    - `setInterval(() => window.scrollTo(0, document.body.scrollHeight), 100);`
 1. Once done, click on the "Download X members" button to download the generated CSV file
 1. The profiles are kept in a cache until you click the "Reset" button. Thanks to this cache, the extracted profiles are still available if your browser "crashes"

 Read our step-by-step [guide to extract Facebook group members and find their LinkedIn profile](https://www.datablist.com/how-to/scrape-facebook-group-members-linkedin)

> [dist/main.min.js](dist/main.min.js)

```javascript
var G=Object.defineProperty,Q=(e,t,n)=>t in e?G(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,M=(e,t,n)=>(Q(e,"symbol"!=typeof t?t+"":t,n),n);function ee(e,t){for(var n="",r=0;r<t.length;r++)n+=function(e){for(var t="",n=0;n<e.length;n++){var r=null===e[n]||"u"<typeof e[n]?"":e[n].toString(),r=(r=e[n]instanceof Date?e[n].toLocaleString():r).replace(/"/g,'""');0<n&&(t+=","),t+=r=0<=r.search(/("|,|\n)/g)?'"'+r+'"':r}return t+`
`}(t[r]);var i=new Blob([n],{type:"text/csv;charset=utf-8;"}),o=document.createElement("a");void 0!==o.download&&(i=URL.createObjectURL(i),o.setAttribute("href",i),o.setAttribute("download",e),document.body.appendChild(o),o.click(),document.body.removeChild(o))}const _=(t,e)=>e.some(e=>t instanceof e);let P,j;function te(){return P=P||[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]}function ne(){return j=j||[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey]}const D=new WeakMap,E=new WeakMap,b=new WeakMap;function re(o){var e=new Promise((e,t)=>{const n=()=>{o.removeEventListener("success",r),o.removeEventListener("error",i)},r=()=>{e(h(o.result)),n()},i=()=>{t(o.error),n()};o.addEventListener("success",r),o.addEventListener("error",i)});return b.set(e,o),e}function ie(o){var e;D.has(o)||(e=new Promise((e,t)=>{const n=()=>{o.removeEventListener("complete",r),o.removeEventListener("error",i),o.removeEventListener("abort",i)},r=()=>{e(),n()},i=()=>{t(o.error||new DOMException("AbortError","AbortError")),n()};o.addEventListener("complete",r),o.addEventListener("error",i),o.addEventListener("abort",i)}),D.set(o,e))}let C={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return D.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return h(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e}};function K(e){C=e(C)}function oe(t){return ne().includes(t)?function(...e){return t.apply(S(this),e),h(this.request)}:function(...e){return h(t.apply(S(this),e))}}function se(e){return"function"==typeof e?oe(e):(e instanceof IDBTransaction&&ie(e),_(e,te())?new Proxy(e,C):e)}function h(e){if(e instanceof IDBRequest)return re(e);if(E.has(e))return E.get(e);var t=se(e);return t!==e&&(E.set(e,t),b.set(t,e)),t}const S=e=>b.get(e);function ae(e,t,{blocked:n,upgrade:r,blocking:i,terminated:o}={}){const s=indexedDB.open(e,t),a=h(s);return r&&s.addEventListener("upgradeneeded",e=>{r(h(s.result),e.oldVersion,e.newVersion,h(s.transaction),e)}),n&&s.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{o&&e.addEventListener("close",()=>o()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}const ce=["get","getKey","getAll","getAllKeys","count"],de=["put","add","delete","clear"],I=new Map;function R(e,t){if(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t){if(I.get(t))return I.get(t);const r=t.replace(/FromIndex$/,""),i=t!==r,o=de.includes(r);return r in(i?IDBIndex:IDBObjectStore).prototype&&(o||ce.includes(r))?(e=async function(e,...t){e=this.transaction(e,o?"readwrite":"readonly");let n=e.store;return i&&(n=n.index(t.shift())),(await Promise.all([n[r](...t),o&&e.done]))[0]},I.set(t,e),e):void 0}}K(r=>({...r,get:(e,t,n)=>R(e,t)||r.get(e,t,n),has:(e,t)=>!!R(e,t)||r.has(e,t)}));const le=["continue","continuePrimaryKey","advance"],V={},B=new WeakMap,U=new WeakMap,ue={get(e,t){if(!le.includes(t))return e[t];let n=V[t];return n=n||(V[t]=function(...e){B.set(this,U.get(this)[t](...e))})}};async function*fe(...e){let t=this;if(t=t instanceof IDBCursor?t:await t.openCursor(...e)){t=t;var n=new Proxy(t,ue);for(U.set(n,t),b.set(n,S(t));t;)yield n,t=await(B.get(n)||t.continue()),B.delete(n)}}function F(e,t){return t===Symbol.asyncIterator&&_(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&_(e,[IDBIndex,IDBObjectStore])}K(r=>({...r,get(e,t,n){return F(e,t)?fe:r.get(e,t,n)},has(e,t){return F(e,t)||r.has(e,t)}}));var H,f=function(e,s,a,d){return new(a=a||Promise)(function(n,t){function r(e){try{o(d.next(e))}catch(e){t(e)}}function i(e){try{o(d.throw(e))}catch(e){t(e)}}function o(e){var t;e.done?n(e.value):((t=e.value)instanceof a?t:new a(function(e){e(t)})).then(r,i)}o((d=d.apply(e,s||[])).next())})},he=function(e,t){var n={};for(i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var r=0,i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(n[i[r]]=e[i[r]]);return n};class pe{constructor(e){this.name="scrape-storage",this.persistent=!0,this.data=new Map,null!=e&&e.name&&(this.name=e.name),null!=e&&e.persistent&&(this.persistent=e.persistent),this.initDB().then(()=>{}).catch(()=>{this.persistent=!1})}get storageKey(){return"storage-"+this.name}initDB(){return f(this,void 0,void 0,function*(){this.db=yield ae(this.storageKey,6,{upgrade(e,t,n,r){let i;if(t<5)try{e.deleteObjectStore("data")}catch{}(i=e.objectStoreNames.contains("data")?r.objectStore("data"):e.createObjectStore("data",{keyPath:"_id",autoIncrement:!0}))&&!i.indexNames.contains("_createdAt")&&i.createIndex("_createdAt","_createdAt"),i&&!i.indexNames.contains("_groupId")&&i.createIndex("_groupId","_groupId"),i&&!i.indexNames.contains("_pk")&&i.createIndex("_pk","_pk",{unique:!0})}})})}_dbGetElem(e,t){return f(this,void 0,void 0,function*(){if(this.persistent&&this.db)return yield(t=t||this.db.transaction("data","readonly")).store.index("_pk").get(e);throw new Error("DB doesnt exist")})}getElem(e){return f(this,void 0,void 0,function*(){if(this.persistent&&this.db)try{return yield this._dbGetElem(e)}catch(e){console.error(e)}else this.data.get(e)})}_dbSetElem(i,o,s=!1,a,d){return f(this,void 0,void 0,function*(){if(this.persistent&&this.db){let e=!1;const t=(d=d||this.db.transaction("data","readwrite")).store,n=yield t.index("_pk").get(i);if(n)s&&(yield t.put(Object.assign(Object.assign({},n),o)),e=!0);else{const r=Object.assign({_pk:i,_createdAt:new Date},o);a&&(r._groupId=a),yield t.put(r),e=!0}return e}throw new Error("DB doesnt exist")})}addElem(e,t,n=!1,r){return f(this,void 0,void 0,function*(){if(this.persistent&&this.db)try{return yield this._dbSetElem(e,t,n,r)}catch(e){console.error(e)}else this.data.set(e,t);return!0})}addElems(t,o=!1,s){return f(this,void 0,void 0,function*(){if(this.persistent&&this.db){const n=[],r=this.db.transaction("data","readwrite"),i=[];if(t.forEach(([e,t])=>{-1===i.indexOf(e)&&(i.push(e),n.push(this._dbSetElem(e,t,o,s,r)))}),0<n.length){n.push(r.done);const e=yield Promise.all(n);let t=0;return e.forEach(e=>{"boolean"==typeof e&&e&&(t+=1)}),t}return 0}return t.forEach(([e,t])=>{this.addElem(e,t)}),t.length})}deleteFromGroupId(n){return f(this,void 0,void 0,function*(){if(this.persistent&&this.db){let e=0,t=yield this.db.transaction("data","readwrite").store.index("_groupId").openCursor(IDBKeyRange.only(n));for(;t;)t.delete(),t=yield t.continue(),e+=1;return e}throw new Error("Not Implemented Error")})}clear(){return f(this,void 0,void 0,function*(){this.persistent&&this.db?yield this.db.clear("data"):this.data.clear()})}getCount(){return f(this,void 0,void 0,function*(){return this.persistent&&this.db?yield this.db.count("data"):this.data.size})}getAll(){return f(this,void 0,void 0,function*(){if(this.persistent&&this.db){const n=new Map,e=yield this.db.getAll("data");return e&&e.forEach(e=>{var t=e["_id"],e=he(e,["_id"]);n.set(t,e)}),n}return this.data})}toCsvData(){return f(this,void 0,void 0,function*(){const t=[];return t.push(this.headers),(yield this.getAll()).forEach(e=>{try{t.push(this.itemToRow(e))}catch(e){console.error(e)}}),t})}}const ye=["display: block;","padding: 0px 4px;","cursor: pointer;","text-align: center;"];function W(e){const t=document.createElement("div"),n=[...ye];return e&&n.push("flex-grow: 1;"),t.setAttribute("style",n.join("")),t}const ge=["margin-left: 4px;","margin-right: 4px;","border-left: 1px solid #2e2e2e;"];function X(){const e=document.createElement("div");return e.innerHTML="&nbsp;",e.setAttribute("style",ge.join("")),e}function g(e,t){var n,t=t||{};let r;const i=document.createElement("span");return(r=t.bold?(n=document.createElement("strong"),i.append(n),n):i).textContent=e,t.idAttribute&&r.setAttribute("id",t.idAttribute),i}const me=["position: fixed;","top: 0;","left: 0;","z-index: 10000;","width: 100%;","height: 100%;","pointer-events: none;"],be=["position: absolute;","bottom: 30px;","right: 30px;","width: auto;","pointer-events: auto;"],we=["align-items: center;","appearance: none;","background-color: #EEE;","border-radius: 4px;","border-width: 0;","box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;","box-sizing: border-box;","color: #36395A;","display: flex;","font-family: monospace;","height: 38px;","justify-content: space-between;","line-height: 1;","list-style: none;","overflow: hidden;","padding-left: 16px;","padding-right: 16px;","position: relative;","text-align: left;","text-decoration: none;","user-select: none;","white-space: nowrap;","font-size: 18px;"];class ve{constructor(){this.ctas=[],this.canva=document.createElement("div"),this.canva.setAttribute("style",me.join("")),this.inner=document.createElement("div"),this.inner.setAttribute("style",be.join("")),this.canva.appendChild(this.inner),this.history=document.createElement("div"),this.inner.appendChild(this.history),this.container=document.createElement("div"),this.container.setAttribute("style",we.join("")),this.inner.appendChild(this.container)}makeItDraggable(){let t=0,n=0,r=0,i=0;const o=e=>{r=e.clientX-t,i=e.clientY-n,this.inner.style.right=window.innerWidth-r-this.inner.offsetWidth+"px",this.inner.style.bottom=window.innerHeight-i-this.inner.offsetHeight+"px"},e=(this.inner.addEventListener("mousedown",e=>{e.preventDefault(),t=e.clientX-this.inner.offsetLeft,n=e.clientY-this.inner.offsetTop,window.addEventListener("mousemove",o,!1)},!1),window.addEventListener("mouseup",()=>{window.removeEventListener("mousemove",o,!1)},!1),document.createElement("div"));e.style.cursor="move",e.innerHTML='<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="18px" width="18px" xmlns="http://www.w3.org/2000/svg"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',this.addCta(X()),this.addCta(e)}render(){document.body.appendChild(this.canva)}addCta(e,t){"u"<typeof t?this.ctas.push(e):this.ctas.splice(t,0,e),this.container.innerHTML="",this.ctas.forEach(e=>{this.container.appendChild(e)})}}!function(e){e.ADD="add",e.LOG="log"}(H=H||{});class xe extends pe{constructor(){super(...arguments),M(this,"name","fb-scrape-storage")}get headers(){return["Profile Id","Full Name","Profile Link","Bio","ImageSrc","GroupId","Group Joining Text","Profile Type"]}itemToRow(e){return[e.profileId,e.fullName,e.profileLink,e.bio,e.imageSrc,e.groupId,e.groupJoiningText,e.profileType]}}const m=new xe,J="fb-group-scraper-number-tracker",Ee="groupMemberExport";async function A(){const e=document.getElementById(J);if(e){const t=await m.getCount();e.textContent=t.toString()}}const y=new ve;function Ie(){const e=W(),t=(e.appendChild(g("Download ")),e.appendChild(g("0",{bold:!0,idAttribute:J})),e.appendChild(g(" users")),e.addEventListener("click",async function(){var e=(new Date).toISOString(),t=await m.toCsvData();try{ee(Ee+`-${e}.csv`,t)}catch(e){console.error("Error while generating export"),console.log(e.stack)}}),y.addCta(e),y.addCta(X()),W());t.appendChild(g("Reset")),t.addEventListener("click",async function(){await m.clear(),await A()}),y.addCta(t),y.makeItDraggable(),y.render(),window.setTimeout(()=>{A()},1e3)}function _e(e){var t;let n;if(null!=(t=null==e?void 0:e.data)&&t.group)n=e.data.group;else{if("Group"!==(null==(t=null==(t=null==e?void 0:e.data)?void 0:t.node)?void 0:t.__typename))return;n=e.data.node}let r;if(null!=(t=null==n?void 0:n.new_members)&&t.edges)r=n.new_members.edges;else if(null!=(e=null==n?void 0:n.new_forum_members)&&e.edges)r=n.new_forum_members.edges;else{if(null==(t=null==n?void 0:n.search_results)||!t.edges)return;r=n.search_results.edges}const i=r.map(e=>{var t="GroupUserInvite"===e.node.__isEntity?e.node.invitee_profile:e.node;if(!t)return null;var{id:n,name:r,bio_text:i,url:o,profile_picture:s,__isProfile:a}=t,d=(null==(d=null==e?void 0:e.join_status_text)?void 0:d.text)||(null==(e=null==(d=null==e?void 0:e.membership)?void 0:d.join_status_text)?void 0:e.text),t=null==(e=t.group_membership)?void 0:e.associated_group.id;return{profileId:n,fullName:r,profileLink:o,bio:(null==i?void 0:i.text)||"",imageSrc:(null==s?void 0:s.uri)||"",groupId:t,groupJoiningText:d||"",profileType:a}}),o=[];i.forEach(e=>{e&&o.push([e.profileId,e])}),m.addElems(o).then(()=>{A()})}function De(e){let n=[];try{n.push(JSON.parse(e))}catch(t){var r=e.split(`
`);if(r.length<=1)return void console.error("Fail to parse API response",t);for(let e=0;e<r.length;e++){var i=r[e];try{n.push(JSON.parse(i))}catch{console.error("Fail to parse API response",t)}}}for(let e=0;e<n.length;e++)_e(n[e])}function Ce(){Ie();let e=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.send=function(){this.addEventListener("readystatechange",function(){this.responseURL.includes("/api/graphql/")&&4===this.readyState&&De(this.responseText)},!1),e.apply(this,arguments)}}Ce();
```


## Scrapped Fields

- **Profile Id**: Unique facebook identifier. Multi-digit number.
- **Full Name**: First name and last name concatenated.
- **Profile Link**: Profile URI in the format https://www.facebook.com/{{username}}. When not available, default to https://www.facebook.com/profile.php?id={{profile_id}}
- **Bio**: Profile bio text.
- **Image Src**: Profile picture URI.
- **Group Id**: Facebook group identifier. Multi-digit number.
- **Group Joining Text**: Relative time since user joined the group. In the format: "Member since XX".
- **Profile Type**: Facebook profile type. "User" or "Page".


## Group Members Extractor tutorial with screenshots

**Open Chrome Developer Console**

To open the Chrome Developer console on Chrome, use the keyboard shortcut `Ctrl + Shift + I` (on Windows) or `Cmd + Option + I` (on Mac).

![Developer Tools](statics/open-developer-tools.png)





**Copy Paste the script**

Select the "Console" tab and copy-paste the script from above. Facebook shows a warning message in the "Console" asking not to  paste a script from a non-trustworthy source. It's true! And if you don't trust this script, stop here. [Read the source code](src/main.ts) to understand what this script does.

![Paste the script](statics/copy-paster-script.png)





**Click on the "People" tab and scroll to load new members**

In the Group Page, go to "People" and scroll to the bottom of the page. If the counter in the button text increases as your scroll, it's working!

![Scroll](statics/facebook-group-members-download-v2.png)



**Export members in CSV format**

Once finished, or to perform "export checkpoints", click the button "Download X members". A Download window will prompt asking where to save your CSV file.

![Download CSV](statics/export-members-to-csv.png)





**Edit and view your CSV file**

[To load and view the CSV file](https://www.datablist.com/csv-editor), use [Datablist.com](https://www.datablist.com/) or any spreadsheet tools.


**Manage your Facebook leads and enrich them with LinkedIn Profile**

Use Facebook members profiles to build a leads database. Filter and segment leads to find the most relevant leads to contact. Then, enrich Facebook members with LinkedIn profile and email address.
Follow this step-by-step tutorial to [scrape Facebook members and find their LinkedIn profiles](https://www.datablist.com/how-to/scrape-facebook-group-members-linkedin).

**Find the email address for Facebook Group members**

To be clear: **there is no direct way to get the email address from Facebook.**
But we can use the name, the company name, or the LinkedIn Profile URL to find an email address! Read our [guide to scrape Facebook Group Members and find their email address](https://www.datablist.com/how-to/scrape-facebook-group-members-linkedin#step-4-find-email-addresses-for-facebook-group-members).


## FAQ

- **How to remove the "Download" button?**
    - Just reload your Facebook page. Any javascript code added in Chrome Developer Console will be removed.
- **How many members can be extracted for one group?**
    - Facebook loads a maximum of 10k profiles in the "People" tab. We recommend extracting new members on a regular basis. And then, [consolidate all your Facebook profiles in a single list using Datablist.com](https://www.datablist.com/how-to/scrape-facebook-group-members-linkedin).
- **Can I extract members from different groups at one time?**
    - Yes. The exported CSV contains a "Group Id" attribute. Load members from one Facebook group, go to another group page (without reloading your page), load members, and click "Download". Members extracted from both groups will be in a single CSV file with different "Group Id" values.
- **What is the "Reset" button?**
    - The profiles are stored in a cache in your browser. The cache is kept if your browser restarts the page (intentionally or after a crash). When you copy/paste the script, it loads the previous profiles from the cache. The "Reset" button clears the cache.
- **Is it free?**
    - The script is free and open-source. You can also clean and parse the data to get only members with a Company name with a free account on [Datablist](https://www.datablist.com). To perform a [LinkedIn Profile lookup](https://www.datablist.com/enrichments/linkedin-finder-from-name) or to [find an email address](https://www.datablist.com/enrichments/email-finder) you have to subscribe to a paid account on [Datablist](https://www.datablist.com). Those enrichments rely on external APIs. 

## How to build it locally

```
yarn install
yarn build
```


The generated script is located in `dist/main.min.js`.

## Other scrapers

- [Scrape Instagram followers, following users, post authors](https://github.com/floriandiud/instagram-users-scraper). And the tutorial to use the [Instagram Scraper](https://www.datablist.com/how-to/scrape-instagram-users-free-followers-followings-authors).
