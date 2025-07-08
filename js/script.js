// ---
// Library: imagesLoaded v5.0.0
// Source: https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js
// Purpose: Detect when images have been loaded.
// License: MIT (Refer to https://github.com/desandro/imagesloaded/blob/master/LICENSE.md)
// ---
!function(t,e){"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,(function(){function t(){}let e=t.prototype;return e.on=function(t,e){if(!t||!e)return this;let i=this._events=this._events||{},s=i[t]=i[t]||[];return s.includes(e)||s.push(e),this},e.once=function(t,e){if(!t||!e)return this;this.on(t,e);let i=this._onceEvents=this._onceEvents||{};return(i[t]=i[t]||{})[e]=!0,this},e.off=function(t,e){let i=this._events&&this._events[t];if(!i||!i.length)return this;let s=i.indexOf(e);return-1!=s&&i.splice(s,1),this},e.emitEvent=function(t,e){let i=this._events&&this._events[t];if(!i||!i.length)return this;i=i.slice(0),e=e||[];let s=this._onceEvents&&this._onceEvents[t];for(let n of i){s&&s[n]&&(this.off(t,n),delete s[n]),n.apply(this,e)}return this},e.allOff=function(){return delete this._events,delete this._onceEvents,this},t})),
function(t,e){"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}("undefined"!=typeof window?window:this,(function(t,e){let i=t.jQuery,s=t.console;function n(t,e,o){if(!(this instanceof n))return new n(t,e,o);let r=t;var h;("string"==typeof t&&(r=document.querySelectorAll(t)),r)?(this.elements=(h=r,Array.isArray(h)?h:"object"==typeof h&&"number"==typeof h.length?[...h]:[h]),this.options={},"function"==typeof e?o=e:Object.assign(this.options,e),o&&this.on("always",o),this.getImages(),i&&(this.jqDeferred=new i.Deferred),setTimeout(this.check.bind(this))):s.error(`Bad element for imagesLoaded ${r||t}`)}n.prototype=Object.create(e.prototype),n.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)};const o=[1,9,11];n.prototype.addElementImages=function(t){"IMG"===t.nodeName&&this.addImage(t),!0===this.options.background&&this.addElementBackgroundImages(t);let{nodeType:e}=t;if(!e||!o.includes(e))return;let i=t.querySelectorAll("img");for(let t of i)this.addImage(t);if("string"==typeof this.options.background){let e=t.querySelectorAll(this.options.background);for(let t of e)this.addElementBackgroundImages(t)}};const r=/url\((['"])?(.*?)\1\)/gi;function h(t){this.img=t}function d(t,e){this.url=t,this.element=e,this.img=new Image}return n.prototype.addElementBackgroundImages=function(t){let e=getComputedStyle(t);if(!e)return;let i=r.exec(e.backgroundImage);for(;null!==i;){let s=i&&i[2];s&&this.addBackground(s,t),i=r.exec(e.backgroundImage)}},n.prototype.addImage=function(t){let e=new h(t);this.images.push(e)},n.prototype.addBackground=function(t,e){let i=new d(t,e);this.images.push(i)},n.prototype.check=function(){if(this.progressedCount=0,this.hasAnyBroken=!1,!this.images.length)return void this.complete();let t=(t,e,i)=>{setTimeout((()=>{this.progress(t,e,i)}))};this.images.forEach((function(e){e.once("progress",t),e.check()}))},n.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount===this.images.length&&this.complete(),this.options.debug&&s&&s.log(`progress: ${i}`,t,e)},n.prototype.complete=function(){let t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){let t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},h.prototype=Object.create(e.prototype),h.prototype.check=function(){this.getIsImageComplete()?this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.img.crossOrigin&&(this.proxyImage.crossOrigin=this.img.crossOrigin),this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.proxyImage.src=this.img.currentSrc||this.img.src)},h.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},h.prototype.confirm=function(t,e){this.isLoaded=t;let{parentNode:i}=this.img,s="PICTURE"===i.nodeName?i:this.img;this.emitEvent("progress",[this,s,e])},h.prototype.handleEvent=function(t){let e="on"+t.type;this[e]&&this[e](t)},h.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},h.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},h.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},d.prototype=Object.create(h.prototype),d.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},d.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},d.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},n.makeJQueryPlugin=function(e){(e=e||t.jQuery)&&(i=e,i.fn.imagesLoaded=function(t,e){return new n(this,t,e).jqDeferred.promise(i(this))})},n.makeJQueryPlugin(),n}));


// ---
// Library: Masonry v4.2.2
// Source: https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js
// Purpose: Cascading grid layout library.
// License: MIT (Refer to https://github.com/desandro/masonry/blob/master/LICENSE.md)
// ---
!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,r,a){function h(t,e,n){var o,r="$()."+i+'("'+e+'")';return t.each(function(t,h){var u=a.data(h,i);if(!u)return void s(i+" not initialized. Cannot call methods, i.e. "+r);var d=u[e];if(!d||"_"==e.charAt(0))return void s(r+" is not a valid method");var l=d.apply(u,n);o=void 0===o?l:o}),void 0!==o?o:t}function u(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new r(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(r.prototype.option||(r.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return h(this,t,e)}return u(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,r=t.console,s="undefined"==typeof r?function(){}:function(t){r.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var n=this._onceEvents&&this._onceEvents[t],o=0;o<i.length;o++){var r=i[o],s=n&&n[r];s&&(this.off(t,r),delete n[r]),r.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;u>e;e++){var i=h[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);s=200==Math.round(t(o.width)),r.isBoxSizeOuter=s,i.removeChild(e)}}function r(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var r=n(e);if("none"==r.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==r.boxSizing,l=0;u>l;l++){var c=h[l],f=r[c],m=parseFloat(f);a[c]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,y=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,z=a.borderTopWidth+a.borderBottomWidth,E=d&&s,b=t(r.width);b!==!1&&(a.width=b+(E?0:p+_));var x=t(r.height);return x!==!1&&(a.height=x+(E?0:g+z)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(g+z),a.outerWidth=a.width+y,a.outerHeight=a.height+v,a}}var s,a="undefined"==typeof console?e:function(t){console.error(t)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=h.length,d=!1;return r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e};var n=Array.prototype.slice;i.makeArray=function(t){if(Array.isArray(t))return t;if(null===t||void 0===t)return[];var e="object"==typeof t&&"number"==typeof t.length;return e?n.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),r=0;r<i.length;r++)o.push(i[r])}}),o},i.debounceMethod=function(t,e,i){i=i||100;var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var o=t.console;return i.htmlInit=function(e,n){i.docReady(function(){var r=i.toDashed(n),s="data-"+r,a=document.querySelectorAll("["+s+"]"),h=document.querySelectorAll(".js-"+r),u=i.makeArray(a).concat(i.makeArray(h)),d=s+"-options",l=t.jQuery;u.forEach(function(t){var i,r=t.getAttribute(s)||t.getAttribute(d);try{i=r&&JSON.parse(r)}catch(a){return void(o&&o.error("Error parsing "+s+" on "+t.className+": "+a))}var h=new e(t,i);l&&l.data(t,n,h)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function n(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var r=document.documentElement.style,s="string"==typeof r.transition?"transition":"WebkitTransition",a="string"==typeof r.transform?"transform":"WebkitTransform",h={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[s],u={transform:a,transition:s,transitionDuration:s+"Duration",transitionProperty:s+"Property",transitionDelay:s+"Delay"},d=n.prototype=Object.create(t.prototype);d.constructor=n,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var n=u[i]||i;e[n]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],r=parseFloat(n),s=parseFloat(o),a=this.layout.size;-1!=n.indexOf("%")&&(r=r/100*a.width),-1!=o.indexOf("%")&&(s=s/100*a.height),r=isNaN(r)?0:r,s=isNaN(s)?0:s,r-=e?a.paddingLeft:a.paddingRight,s-=i?a.paddingTop:a.paddingBottom,this.position.x=r,this.position.y=s},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",r=i?"left":"right",s=i?"right":"left",a=this.position.x+t[o];e[r]=this.getXValue(a),e[s]="";var h=n?"paddingTop":"paddingBottom",u=n?"top":"bottom",d=n?"bottom":"top",l=this.position.y+t[h];e[u]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),o&&!this.isTransitioning)return void this.layoutPosition();var r=t-i,s=e-n,a={};a.transform=this.getTranslate(r,s),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+o(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(h,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var c={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,n=c[t.propertyName]||t.propertyName;if(delete e.ingProperties[n],i(e.ingProperties)&&this.disableTransition(),n in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[n]),n in e.onEnd){var o=e.onEnd[n];o.call(this),delete e.onEnd[n]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(h,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var f={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(f)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return s&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function r(t,e){var i=n.getQueryElement(t);if(!i)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,u&&(this.$element=u(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++l;this.element.outlayerGUID=o,c[o]=this,this._create();var r=this._getOption("initLayout");r&&this.layout()}function s(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],n=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var o=m[n]||1;return i*o}var h=t.console,u=t.jQuery,d=function(){},l=0,c={};r.namespace="outlayer",r.Item=o,r.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var f=r.prototype;n.extend(f,e.prototype),f.option=function(t){n.extend(this.options,t)},f._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},r.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},f._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},f.reloadItems=function(){this.items=this._itemize(this.element.children)},f._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var r=e[o],s=new i(r,this);n.push(s)}return n},f._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},f.getItemElements=function(){return this.items.map(function(t){return t.element})},f.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},f._init=f.layout,f._resetLayout=function(){this.getSize()},f.getSize=function(){this.size=i(this.element)},f._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},f.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},f._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},f._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},f._getItemLayoutPosition=function(){return{x:0,y:0}},f._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},f.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},f._positionItem=function(t,e,i,n,o){n?t.goTo(e,i):(t.stagger(o*this.stagger),t.moveTo(e,i))},f._postLayout=function(){this.resizeContainer()},f.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},f._getContainerSize=d,f._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},f._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){s++,s==r&&i()}var o=this,r=e.length;if(!e||!r)return void i();var s=0;e.forEach(function(e){e.once(t,n)})},f.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),u)if(this.$element=this.$element||u(this.element),e){var o=u.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},f.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},f.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},f.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},f.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},f._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},f._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},f._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},f._manageStamp=d,f._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),r={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return r},f.handleEvent=n.handleEvent,f.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},f.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},f.onresize=function(){this.resize()},n.debounceMethod(r,"onresize",100),f.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},f.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},f.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},f.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},f.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},f.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},f.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},f.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},f.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},f.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},f.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},f.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},f.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete c[e],delete this.element.outlayerGUID,u&&u.removeData(this.element,this.constructor.namespace)},r.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},r.create=function(t,e){var i=s(r);return i.defaults=n.extend({},r.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},r.compatOptions),i.namespace=t,i.data=r.data,i.Item=s(o),n.htmlInit(i,t),u&&u.bridget&&u.bridget(t,i),i};var m={ms:1,s:1e3};return r.Item=o,r}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");i.compatOptions.fitWidth="isFitWidth";var n=i.prototype;return n._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},n.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,r=o/n,s=n-o%n,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},n.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},n._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",r=this[o](n,t),s={x:this.columnWidth*r.col,y:r.y},a=r.y+t.size.outerHeight,h=n+r.col,u=r.col;h>u;u++)this.colYs[u]=a;return s},n._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},n._getTopColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++)e[n]=this._getColGroupY(n,t);return e},n._getColGroupY=function(t,e){if(2>e)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},n._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols,n=t>1&&i+t>this.cols;i=n?0:i;var o=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=o?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},n._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),r=o?n.left:n.right,s=r+i.outerWidth,a=Math.floor(r/this.columnWidth);a=Math.max(0,a);var h=Math.floor(s/this.columnWidth);h-=s%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var u=this._getOption("originTop"),d=(u?n.top:n.bottom)+i.outerHeight,l=a;h>=l;l++)this.colYs[l]=Math.max(d,this.colYs[l])},n._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},n._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},n.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i});


// ---
// Website/js/script.js
// Handles dynamic functionality for Jacob Levers' photography portfolio.
// Includes: landing page slideshow, home page carousel, contact form validation,
// work page gallery effects (B&W to color, Masonry layout, filtering), and image lightbox.
// ---

document.addEventListener('DOMContentLoaded', function() {

    // --- SECTION: Landing Page Slideshow (splash.html) ---
    const landingSlideshow = document.getElementById('background-slideshow');
    if (landingSlideshow) {
        const slides = landingSlideshow.querySelectorAll('.slide');
        let currentSlide = 0;
        const slideInterval = 7000; // Time in ms for each slide

        function nextLandingSlide() {
            if (slides.length === 0) return;
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        if (slides.length > 0) {
            slides[0].classList.add('active'); // Start with the first slide
            setInterval(nextLandingSlide, slideInterval);
        }
    }

    // --- SECTION: Home Page Featured Work Carousel (index.html) ---
    // AI-assisted debugging was utilized for refining the complex carousel logic below.
    const jlCarouselSection = document.getElementById('featured-photos-home');
    if (jlCarouselSection) {
        const viewport = jlCarouselSection.querySelector('.jl-carousel-viewport');
        const slidesContainer = jlCarouselSection.querySelector('.jl-carousel-slides');
        const prevButton = jlCarouselSection.querySelector('.jl-carousel-prev');
        const nextButton = jlCarouselSection.querySelector('.jl-carousel-next');
        const dotsContainer = jlCarouselSection.querySelector('.jl-carousel-dots');

        if (viewport && slidesContainer && prevButton && nextButton && dotsContainer) {
            let slidesData = [];
            let allSlideElements = [];
            let logicalIndex = 0;
            let currentShiftedIndex = 0;
            let slideWidthWithPadding = 0;
            let isTransitioning = false;
            const transitionSpeed = 500;
            let itemsVisible = 3;
            let clonesCount = itemsVisible;

            function calculateItemsVisible() {
                // AI-assisted debugging helped ensure this responsiveness was smooth.
                if (window.innerWidth <= 768) { itemsVisible = 1; }
                else { itemsVisible = 3; }
                clonesCount = itemsVisible;
            }

            function fetchJlCarouselData() {
                fetch('carousel-images.json')
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status} loading carousel-images.json`);
                        return response.json();
                    })
                    .then(data => {
                        slidesData = data;
                        if (slidesData && slidesData.length > 0) {
                            calculateItemsVisible();
                            setupJlCarousel();
                        } else {
                            handleJlNoSlides("No images found in carousel data.");
                        }
                    })
                    .catch(error => {
                        console.error("JL Carousel Fetch Error:", error);
                        handleJlNoSlides(`Error loading featured images: ${error.message}`);
                    });
            }

            function handleJlNoSlides(message = "No featured images to display.") {
                if (slidesContainer) slidesContainer.innerHTML = `<p style="color: #E0E1E2; text-align: center; padding: 20px;">${message}</p>`;
                if (prevButton) prevButton.style.display = 'none';
                if (nextButton) nextButton.style.display = 'none';
                if (dotsContainer) dotsContainer.style.display = 'none';
            }

            function createJlSlideElement(slideDataItem) {
                const slide = document.createElement('div');
                slide.classList.add('jl-carousel-slide');
                const img = document.createElement('img');
                img.src = slideDataItem.src;
                img.alt = slideDataItem.alt || 'Featured work';
                slide.appendChild(img);
                if (slideDataItem.title || slideDataItem.caption) {
                    const captionDiv = document.createElement('div');
                    captionDiv.classList.add('jl-carousel-slide-caption');
                    if (slideDataItem.title) {
                        const titleH4 = document.createElement('h4');
                        titleH4.textContent = slideDataItem.title;
                        captionDiv.appendChild(titleH4);
                    }
                    if (slideDataItem.caption) {
                        const captionP = document.createElement('p');
                        captionP.textContent = slideDataItem.caption;
                        captionDiv.appendChild(captionP);
                    }
                    slide.appendChild(captionDiv);
                }
                return slide;
            }

            function calculateAndSetSlideWidth() {
                if (viewport.offsetWidth > 0 && allSlideElements.length > 0 && allSlideElements[0]) {
                    slideWidthWithPadding = allSlideElements[0].offsetWidth;
                    if (!slideWidthWithPadding || slideWidthWithPadding === 0) {
                         slideWidthWithPadding = viewport.offsetWidth / itemsVisible;
                    }
                } else if (viewport.offsetWidth > 0) {
                     slideWidthWithPadding = viewport.offsetWidth / itemsVisible;
                }
            }

            function setupJlCarousel() {
                // AI-assisted debugging for cloning and initial setup logic.
                slidesContainer.innerHTML = '';
                dotsContainer.innerHTML = '';
                allSlideElements = [];

                if (slidesData.length === 0) { handleJlNoSlides(); return; }

                let tempDOMElements = [];
                const shouldClone = slidesData.length > 1 && (slidesData.length > itemsVisible || itemsVisible === 1);

                if (shouldClone) {
                    for (let i = 0; i < clonesCount; i++) {
                        const index = (slidesData.length - clonesCount + i + slidesData.length) % slidesData.length;
                        tempDOMElements.push(createJlSlideElement(slidesData[index]));
                    }
                }
                slidesData.forEach(item => { tempDOMElements.push(createJlSlideElement(item)); });
                if (shouldClone) {
                    for (let i = 0; i < clonesCount; i++) {
                        const index = i % slidesData.length;
                        tempDOMElements.push(createJlSlideElement(slidesData[index]));
                    }
                }
                allSlideElements = tempDOMElements;
                allSlideElements.forEach(slideEl => slidesContainer.appendChild(slideEl));
                calculateAndSetSlideWidth();
                logicalIndex = 0;

                if (shouldClone) {
                    currentShiftedIndex = clonesCount + logicalIndex - Math.floor(itemsVisible / 2);
                    if (itemsVisible === 1) currentShiftedIndex = clonesCount + logicalIndex;
                } else {
                    currentShiftedIndex = logicalIndex - Math.floor(itemsVisible / 2);
                    if (itemsVisible === 1 || currentShiftedIndex < 0) currentShiftedIndex = logicalIndex;
                }
                if (slidesData.length <=1 && itemsVisible === 1) currentShiftedIndex = 0;

                applyJlTransform(false);
                updateJlSlideStates();
                createJlDots();
                const navShouldBeVisible = slidesData.length > itemsVisible || (slidesData.length > 1 && itemsVisible === 1);
                if (prevButton) prevButton.style.display = navShouldBeVisible ? 'flex' : 'none';
                if (nextButton) nextButton.style.display = navShouldBeVisible ? 'flex' : 'none';
            }

            function applyJlTransform(animate = true) {
                // AI-assisted debugging helped fine-tune transform calculations.
                if (slideWidthWithPadding === 0 && allSlideElements.length > 0) {
                    calculateAndSetSlideWidth();
                    if (slideWidthWithPadding === 0) { console.error("JL Carousel: Slide width is 0, cannot apply transform."); return; }
                } else if (slideWidthWithPadding === 0 && allSlideElements.length === 0) return;

                const targetTranslateX = currentShiftedIndex * slideWidthWithPadding;
                slidesContainer.style.transition = animate ? `transform ${transitionSpeed / 1000}s cubic-bezier(0.645, 0.045, 0.355, 1)` : 'none';
                slidesContainer.style.transform = `translateX(-${targetTranslateX}px)`;

                if (animate) {
                    isTransitioning = true;
                    slidesContainer.addEventListener('transitionend', handleJlTransitionEnd, { once: true });
                } else {
                    slidesContainer.offsetHeight; 
                }
            }

            let lastDirection = 0;
            function shiftJlSlides(direction) {
                // AI-assisted debugging for ensuring correct slide shifting and state updates.
                if (isTransitioning || slidesData.length <= 1) return;
                lastDirection = direction;
                isTransitioning = true;
                logicalIndex = (logicalIndex + direction + slidesData.length) % slidesData.length;
                currentShiftedIndex += direction;
                applyJlTransform(true);
                updateJlSlideStates();
            }

            function handleJlTransitionEnd() {
                // This function's logic for infinite looping was a focus of AI-assisted debugging.
                isTransitioning = false;
                const N = slidesData.length;
                let snapNeeded = false;
                const canLoop = slidesData.length > 1 && (slidesData.length > itemsVisible || itemsVisible === 1);

                if (canLoop) {
                    const firstOriginalDOMIndexActual = clonesCount;
                    const lastOriginalDOMIndexActual = clonesCount + N - 1;
                    let activeDOMIndexForCheck = currentShiftedIndex;
                    if (itemsVisible > 1) activeDOMIndexForCheck = currentShiftedIndex + Math.floor(itemsVisible / 2);

                    if (lastDirection === 1 && activeDOMIndexForCheck > lastOriginalDOMIndexActual) {
                        currentShiftedIndex -= N;
                        snapNeeded = true;
                    } else if (lastDirection === -1 && activeDOMIndexForCheck < firstOriginalDOMIndexActual) {
                        currentShiftedIndex += N;
                        snapNeeded = true;
                    }
                }

                if (snapNeeded) {
                    allSlideElements.forEach(slide => slide.classList.add('jl-no-transition-temporarily'));
                    slidesContainer.offsetHeight; 
                    applyJlTransform(false);
                    updateJlSlideStates();
                    slidesContainer.offsetHeight; 
                    requestAnimationFrame(() => {
                        allSlideElements.forEach(slide => slide.classList.remove('jl-no-transition-temporarily'));
                    });
                } else {
                    updateJlSlideStates();
                }
            }

            function goToJlSlide(targetLogicalIndex) {
                if (isTransitioning || targetLogicalIndex === logicalIndex || slidesData.length <= 1) return;
                let diff = targetLogicalIndex - logicalIndex;
                lastDirection = diff > 0 ? 1 : (diff < 0 ? -1 : 0);
                isTransitioning = true;
                currentShiftedIndex += diff;
                logicalIndex = targetLogicalIndex;
                applyJlTransform(true);
                updateJlSlideStates();
            }

            function updateJlSlideStates() {
                // AI-assisted debugging to ensure visual states (active, prev, next) are correctly applied.
                if (allSlideElements.length === 0 || !viewport) return;
                let visuallyCenterDOMIndex = currentShiftedIndex + Math.floor(itemsVisible / 2);
                if (itemsVisible === 1) visuallyCenterDOMIndex = currentShiftedIndex;

                allSlideElements.forEach((slide, domIndex) => {
                    slide.classList.remove('jl-active-slide', 'jl-prev-visible', 'jl-next-visible');
                    if (itemsVisible === 1) {
                        if (domIndex === currentShiftedIndex) slide.classList.add('jl-active-slide');
                    } else {
                        if (domIndex === visuallyCenterDOMIndex) slide.classList.add('jl-active-slide');
                        else if (domIndex === visuallyCenterDOMIndex - 1) slide.classList.add('jl-prev-visible');
                        else if (domIndex === visuallyCenterDOMIndex + 1) slide.classList.add('jl-next-visible');
                    }
                });
                updateJlDots();
            }

            function createJlDots() {
                if (!dotsContainer) return;
                dotsContainer.innerHTML = '';
                if (slidesData.length > 1) {
                    slidesData.forEach((_, index) => {
                        const dot = document.createElement('button');
                        dot.classList.add('jl-carousel-dot');
                        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                        dot.addEventListener('click', () => goToJlSlide(index));
                        dotsContainer.appendChild(dot);
                    });
                    updateJlDots();
                } else {
                    dotsContainer.style.display = 'none';
                }
            }

            function updateJlDots() {
                if (!dotsContainer) return;
                const dots = dotsContainer.querySelectorAll('.jl-carousel-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('jl-active-dot', index === logicalIndex);
                });
            }

            if (prevButton && nextButton) {
                prevButton.addEventListener('click', () => shiftJlSlides(-1));
                nextButton.addEventListener('click', () => shiftJlSlides(1));
            }
            fetchJlCarouselData();
            window.addEventListener('resize', debounce(() => {
                // AI-assisted debugging for resize handling of the carousel.
                if (slidesData.length > 0 && allSlideElements.length > 0 && viewport) {
                    const oldItemsVisible = itemsVisible;
                    calculateItemsVisible();
                    if (oldItemsVisible !== itemsVisible) {
                        setupJlCarousel(); // Re-setup if number of visible items changes
                    } else {
                        // Only recalculate widths and reposition if number of visible items is the same
                        calculateAndSetSlideWidth();
                        const shouldClone = slidesData.length > 1 && (slidesData.length > itemsVisible || itemsVisible === 1);
                        if (shouldClone) {
                            currentShiftedIndex = clonesCount + logicalIndex - Math.floor(itemsVisible / 2);
                            if (itemsVisible === 1) currentShiftedIndex = clonesCount + logicalIndex;
                        } else {
                            currentShiftedIndex = logicalIndex - Math.floor(itemsVisible / 2);
                             if (itemsVisible === 1 || currentShiftedIndex < 0) currentShiftedIndex = logicalIndex;
                        }
                        if (slidesData.length <=1 && itemsVisible === 1) currentShiftedIndex = 0;
                        applyJlTransform(false); // Re-apply transform without animation
                        updateJlSlideStates();
                    }
                }
            }, 250));
        } else {
            if(jlCarouselSection) jlCarouselSection.style.display = 'none'; // Hide section if elements missing
            console.warn("JL Carousel: Essential elements not found. Carousel disabled."); // Will help the user identify problem. (Nielsen's Heuristics)
        }
    }

    // --- SECTION: Contact Form Validation (for all .contact-form elements) ---
    function initializeFormValidation(formElement) {
        if (!formElement) return;

        const nameField = formElement.querySelector('input[name="name"]');
        const emailField = formElement.querySelector('input[name="email"]');
        const messageField = formElement.querySelector('textarea[name="message"]');

        // Helper to process validation for a field: clears existing error, then shows new one if condition not met.
        const processFieldValidation = (field, conditionFn, errorMessage) => {
            if (!field) return true; // Should not happen if selectors are correct
            clearError(field); // Always clear current error for this field before re-validating
            if (!conditionFn(field.value.trim())) {
                showError(field, errorMessage);
                return false; // Validation failed
            }
            return true; // Validation passed
        };
        
        // Listener for Name
        if (nameField) nameField.addEventListener('blur', function() {
            processFieldValidation(this, value => value !== '', 'Name is required.');
        });

        // Listener for Email
        if (emailField) emailField.addEventListener('blur', function() {
            // On blur, first check if it's empty
            if (this.value.trim() === '') {
                showError(this, 'Email is required.'); // Show "required" on blur if empty
            } else if (!isValidEmail(this.value.trim())) {
                // If not empty, then check format
                showError(this, 'Please enter a valid email address.');
            } else {
                // Not empty and valid format, so clear any errors
                clearError(this);
            }
        });

        // Listener for Message
        if (messageField) messageField.addEventListener('blur', function() {
            processFieldValidation(this, value => value !== '', 'Message is required.');
        });

        // Submit listener
        formElement.addEventListener('submit', function(event) {
            let isFormValid = true;

            // Validate Name on submit
            if (nameField) {
                if (!processFieldValidation(nameField, value => value !== '', 'Name is required.')) {
                    isFormValid = false;
                }
            }

            // Validate Email on submit
            if (emailField) {
                clearError(emailField); 
                if (emailField.value.trim() === '') {
                    showError(emailField, 'Email is required.');
                    isFormValid = false;
                } else if (!isValidEmail(emailField.value.trim())) {
                    showError(emailField, 'Please enter a valid email address.');
                    isFormValid = false;
                }
            }

            // Validate Message on submit
            if (messageField) {
                if (!processFieldValidation(messageField, value => value !== '', 'Message is required.')) {
                    isFormValid = false;
                }
            }

            if (!isFormValid) {
                // If the form is NOT valid, prevent it from submitting
                event.preventDefault();
            } else {
                // If the form IS valid, let it submit. 
                // Can still change the button text for better user experience.
                const submitButton = formElement.querySelector('button[type="submit"]');
                if(submitButton) {
                    submitButton.textContent = 'Sending...';
                    submitButton.disabled = true;
                }
            }
        });
    }

    function showError(field, message) {
        if (!field) return;
        field.classList.add('error-input');
        const parent = field.parentElement;
        if (!parent) return;
        let existingError = parent.querySelector('.error-message');
        if (existingError) existingError.remove();
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        if (field.nextSibling) parent.insertBefore(errorElement, field.nextSibling);
        else parent.appendChild(errorElement);
    }

    function clearError(field) {
        if (!field) return;
        field.classList.remove('error-input');
        const parent = field.parentElement;
        if (!parent) return;
        const errorElement = parent.querySelector('.error-message');
        if (errorElement) errorElement.remove();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        initializeFormValidation(form);
    });

    const workPageGalleryImages = document.querySelectorAll('.work-page .gallery-grid .gallery-item img.bw-image');
    const workPageLoadingIndicator = document.querySelector('.work-page #loading-indicator');

    if (workPageGalleryImages.length > 0) {
        if (workPageLoadingIndicator) workPageLoadingIndicator.style.display = 'none';
        const workImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('has-come-into-view');
                    observer.unobserve(img);
                }
            });
        }, { threshold: 0.15 });
        workPageGalleryImages.forEach(img => workImageObserver.observe(img));
    } else if (document.querySelector('.work-page .gallery-grid')) {
        if (workPageLoadingIndicator) workPageLoadingIndicator.style.display = 'none';
    }

    const galleryGrid = document.querySelector('.work-page .gallery-grid');
    let msnry;

    // Masonry and imagesLoaded are defined from the code pasted at the top of this file. I gave up trying to do the CSS route. I JUST COULDN'T GET IT TO WORK :'(
    if (galleryGrid && typeof Masonry !== 'undefined' && typeof imagesLoaded !== 'undefined') {
        imagesLoaded(galleryGrid, function() {
            msnry = new Masonry(galleryGrid, {
                itemSelector: '.gallery-item',
                columnWidth: 300, 
                gutter: 10,
                isFitWidth: true
            });
        });
    } else if (galleryGrid) {
        if (typeof Masonry === 'undefined') console.error("Masonry library not found. Work gallery layout may be broken."); // Help users recognize, diagnose, and recover from errors.
        if (typeof imagesLoaded === 'undefined') console.error("imagesLoaded library not found. Work gallery layout may be broken."); // Help users recognize, diagnose, and recover from errors. Any other bozo would let the user fend for themself.
    }

    function initWorkGalleryFilters() {
        const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
        const galleryItems = document.querySelectorAll('.work-page .gallery-grid .gallery-item');

        if (!filterButtons.length) {
            const filtersContainer = document.querySelector('.gallery-filters');
            if (filtersContainer && galleryItems.length === 0) {
                filtersContainer.style.display = 'none';
            }
            return;
        }
        if (!galleryItems.length && document.querySelector('.gallery-filters')) {
             document.querySelector('.gallery-filters').style.display = 'none';
            return;
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.dataset.filter;

                galleryItems.forEach(item => {
                    const itemCategory = item.dataset.category;
                    if (filterValue === 'all' || (itemCategory && itemCategory === filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });

                if (msnry) {
                    requestAnimationFrame(function() {
                        msnry.layout();
                    });
                }
            });
        });
    }

    if (document.body.classList.contains('work-page')) {
        initWorkGalleryFilters();
    }

    // Theatre View (Lightbox) 

    let theatreViewElement = null, theatreImageElement = null, theatreCloseButton = null;
    function createTheatreView() {
        if (document.getElementById('jl-theatre-view')) return;
        theatreViewElement = document.createElement('div');
        theatreViewElement.id = 'jl-theatre-view'; theatreViewElement.className = 'theatre-view';
        const contentView = document.createElement('div'); contentView.className = 'theatre-view-content';
        theatreImageElement = document.createElement('img'); theatreImageElement.alt = 'Enlarged view';
        theatreCloseButton = document.createElement('button');
        theatreCloseButton.className = 'theatre-view-close'; theatreCloseButton.innerHTML = '&times;';
        theatreCloseButton.setAttribute('aria-label', 'Close theatre view');
        contentView.appendChild(theatreImageElement); contentView.appendChild(theatreCloseButton);
        theatreViewElement.appendChild(contentView); document.body.appendChild(theatreViewElement);
        theatreViewElement.addEventListener('click', (e) => { if (e.target === theatreViewElement) closeTheatreView(); });
        theatreCloseButton.addEventListener('click', closeTheatreView);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && theatreViewElement && theatreViewElement.classList.contains('active')) closeTheatreView(); });
    }
    function openTheatreView(imageSrc) {
        if (!theatreViewElement || !theatreImageElement) { console.error("Theatre view elements not initialized. Cannot open image."); return; } // Again help users recognize, diagnose, and recover from errors. Spanish or English? ;)
        theatreImageElement.src = imageSrc;
        theatreViewElement.classList.add('active'); document.body.classList.add('theatre-view-active');
    }
    function closeTheatreView() {
        if (!theatreViewElement) return;
        theatreViewElement.classList.remove('active'); document.body.classList.remove('theatre-view-active');
        if (theatreImageElement) theatreImageElement.src = '';
    }
    createTheatreView();
    const workPageGallery = document.querySelector('.work-page .gallery-grid');
    if (workPageGallery) workPageGallery.addEventListener('click', (e) => {
        const clickedImage = e.target.closest('.gallery-item img');
        if (clickedImage && !e.target.closest('.theatre-view-close')) {
             e.preventDefault(); openTheatreView(clickedImage.src);
        }
    });
    const jlCarouselSlidesContainer = document.querySelector('#featured-photos-home .jl-carousel-slides');
    if (jlCarouselSlidesContainer) jlCarouselSlidesContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.jl-carousel-slide')) {
             const clickedImage = e.target;
             if (!e.target.closest('.jl-carousel-button')) openTheatreView(clickedImage.src);
        }
    });

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { func.apply(this, args); }, delay);
        };
    }

    window.addEventListener('resize', debounce(function() {
        if (msnry) {
            msnry.layout();
        }
    }, 150));

}); // End of DOMContentLoaded THANK GOD :))))