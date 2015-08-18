/**
 * browser-polyfill - an ES6 polyfill for babel.js
 * Copyright (c) 2014-2015 Sebastian McKenzie <sebmck@gmail.com>
 * @preserve
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var process=module.exports={};var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){draining=false;if(currentQueue.length){queue=currentQueue.concat(queue)}else{queueIndex=-1}if(queue.length){drainQueue()}}function drainQueue(){if(draining){return}var timeout=setTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){currentQueue[queueIndex].run()}queueIndex=-1;len=queue.length}currentQueue=null;draining=false;clearTimeout(timeout)}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i]}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){setTimeout(drainQueue,0)}};function Item(fun,array){this.fun=fun;this.array=array}Item.prototype.run=function(){this.fun.apply(null,this.array)};process.title="browser";process.browser=true;process.env={};process.argv=[];process.version="";process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return"/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")};process.umask=function(){return 0}},{}],2:[function(require,module,exports){(function(global){"use strict";require("core-js/shim");require("regenerator/runtime");if(global._babelPolyfill){throw new Error("only one instance of babel/polyfill is allowed")}global._babelPolyfill=true}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"core-js/shim":91,"regenerator/runtime":92}],3:[function(require,module,exports){var $=require("./$");module.exports=function(IS_INCLUDES){return function($this,el,fromIndex){var O=$.toObject($this),length=$.toLength(O.length),index=$.toIndex(fromIndex,length),value;if(IS_INCLUDES&&el!=el)while(length>index){value=O[index++];if(value!=value)return true}else for(;length>index;index++)if(IS_INCLUDES||index in O){if(O[index]===el)return IS_INCLUDES||index}return!IS_INCLUDES&&-1}}},{"./$":24}],4:[function(require,module,exports){var $=require("./$"),ctx=require("./$.ctx");module.exports=function(TYPE){var IS_MAP=TYPE==1,IS_FILTER=TYPE==2,IS_SOME=TYPE==3,IS_EVERY=TYPE==4,IS_FIND_INDEX=TYPE==6,NO_HOLES=TYPE==5||IS_FIND_INDEX;return function($this,callbackfn,that){var O=Object($.assertDefined($this)),self=$.ES5Object(O),f=ctx(callbackfn,that,3),length=$.toLength(self.length),index=0,result=IS_MAP?Array(length):IS_FILTER?[]:undefined,val,res;for(;length>index;index++)if(NO_HOLES||index in self){val=self[index];res=f(val,index,O);if(TYPE){if(IS_MAP)result[index]=res;else if(res)switch(TYPE){case 3:return true;case 5:return val;case 6:return index;case 2:result.push(val)}else if(IS_EVERY)return false}}return IS_FIND_INDEX?-1:IS_SOME||IS_EVERY?IS_EVERY:result}}},{"./$":24,"./$.ctx":12}],5:[function(require,module,exports){var $=require("./$");function assert(condition,msg1,msg2){if(!condition)throw TypeError(msg2?msg1+msg2:msg1)}assert.def=$.assertDefined;assert.fn=function(it){if(!$.isFunction(it))throw TypeError(it+" is not a function!");return it};assert.obj=function(it){if(!$.isObject(it))throw TypeError(it+" is not an object!");return it};assert.inst=function(it,Constructor,name){if(!(it instanceof Constructor))throw TypeError(name+": use the 'new' operator!");return it};module.exports=assert},{"./$":24}],6:[function(require,module,exports){var $=require("./$"),enumKeys=require("./$.enum-keys");module.exports=Object.assign||function assign(target,source){var T=Object($.assertDefined(target)),l=arguments.length,i=1;while(l>i){var S=$.ES5Object(arguments[i++]),keys=enumKeys(S),length=keys.length,j=0,key;while(length>j)T[key=keys[j++]]=S[key]}return T}},{"./$":24,"./$.enum-keys":15}],7:[function(require,module,exports){var $=require("./$"),TAG=require("./$.wks")("toStringTag"),toString={}.toString;function cof(it){return toString.call(it).slice(8,-1)}cof.classof=function(it){var O,T;return it==undefined?it===undefined?"Undefined":"Null":typeof(T=(O=Object(it))[TAG])=="string"?T:cof(O)};cof.set=function(it,tag,stat){if(it&&!$.has(it=stat?it:it.prototype,TAG))$.hide(it,TAG,tag)};module.exports=cof},{"./$":24,"./$.wks":42}],8:[function(require,module,exports){"use strict";var $=require("./$"),ctx=require("./$.ctx"),safe=require("./$.uid").safe,assert=require("./$.assert"),forOf=require("./$.for-of"),step=require("./$.iter").step,$has=$.has,set=$.set,isObject=$.isObject,hide=$.hide,isExtensible=Object.isExtensible||isObject,ID=safe("id"),O1=safe("O1"),LAST=safe("last"),FIRST=safe("first"),ITER=safe("iter"),SIZE=$.DESC?safe("size"):"size",id=0;function fastKey(it,create){if(!isObject(it))return typeof it=="symbol"?it:(typeof it=="string"?"S":"P")+it;if(!$has(it,ID)){if(!isExtensible(it))return"F";if(!create)return"E";hide(it,ID,++id)}return"O"+it[ID]}function getEntry(that,key){var index=fastKey(key),entry;if(index!=="F")return that[O1][index];for(entry=that[FIRST];entry;entry=entry.n){if(entry.k==key)return entry}}module.exports={getConstructor:function(wrapper,NAME,IS_MAP,ADDER){var C=wrapper(function(that,iterable){assert.inst(that,C,NAME);set(that,O1,$.create(null));set(that,SIZE,0);set(that,LAST,undefined);set(that,FIRST,undefined);if(iterable!=undefined)forOf(iterable,IS_MAP,that[ADDER],that)});require("./$.mix")(C.prototype,{clear:function clear(){for(var that=this,data=that[O1],entry=that[FIRST];entry;entry=entry.n){entry.r=true;if(entry.p)entry.p=entry.p.n=undefined;delete data[entry.i]}that[FIRST]=that[LAST]=undefined;that[SIZE]=0},"delete":function(key){var that=this,entry=getEntry(that,key);if(entry){var next=entry.n,prev=entry.p;delete that[O1][entry.i];entry.r=true;if(prev)prev.n=next;if(next)next.p=prev;if(that[FIRST]==entry)that[FIRST]=next;if(that[LAST]==entry)that[LAST]=prev;that[SIZE]--}return!!entry},forEach:function forEach(callbackfn){var f=ctx(callbackfn,arguments[1],3),entry;while(entry=entry?entry.n:this[FIRST]){f(entry.v,entry.k,this);while(entry&&entry.r)entry=entry.p}},has:function has(key){return!!getEntry(this,key)}});if($.DESC)$.setDesc(C.prototype,"size",{get:function(){return assert.def(this[SIZE])}});return C},def:function(that,key,value){var entry=getEntry(that,key),prev,index;if(entry){entry.v=value}else{that[LAST]=entry={i:index=fastKey(key,true),k:key,v:value,p:prev=that[LAST],n:undefined,r:false};if(!that[FIRST])that[FIRST]=entry;if(prev)prev.n=entry;that[SIZE]++;if(index!=="F")that[O1][index]=entry}return that},getEntry:getEntry,setIter:function(C,NAME,IS_MAP){require("./$.iter-define")(C,NAME,function(iterated,kind){set(this,ITER,{o:iterated,k:kind})},function(){var iter=this[ITER],kind=iter.k,entry=iter.l;while(entry&&entry.r)entry=entry.p;if(!iter.o||!(iter.l=entry=entry?entry.n:iter.o[FIRST])){iter.o=undefined;return step(1)}if(kind=="keys")return step(0,entry.k);if(kind=="values")return step(0,entry.v);return step(0,[entry.k,entry.v])},IS_MAP?"entries":"values",!IS_MAP,true)}}},{"./$":24,"./$.assert":5,"./$.ctx":12,"./$.for-of":16,"./$.iter":23,"./$.iter-define":21,"./$.mix":26,"./$.uid":40}],9:[function(require,module,exports){var $def=require("./$.def"),forOf=require("./$.for-of");module.exports=function(NAME){$def($def.P,NAME,{toJSON:function toJSON(){var arr=[];forOf(this,false,arr.push,arr);return arr}})}},{"./$.def":13,"./$.for-of":16}],10:[function(require,module,exports){"use strict";var $=require("./$"),safe=require("./$.uid").safe,assert=require("./$.assert"),forOf=require("./$.for-of"),$has=$.has,isObject=$.isObject,hide=$.hide,isExtensible=Object.isExtensible||isObject,id=0,ID=safe("id"),WEAK=safe("weak"),LEAK=safe("leak"),method=require("./$.array-methods"),find=method(5),findIndex=method(6);function findFrozen(store,key){return find(store.array,function(it){return it[0]===key})}function leakStore(that){return that[LEAK]||hide(that,LEAK,{array:[],get:function(key){var entry=findFrozen(this,key);if(entry)return entry[1]},has:function(key){return!!findFrozen(this,key)},set:function(key,value){var entry=findFrozen(this,key);if(entry)entry[1]=value;else this.array.push([key,value])},"delete":function(key){var index=findIndex(this.array,function(it){return it[0]===key});if(~index)this.array.splice(index,1);return!!~index}})[LEAK]}module.exports={getConstructor:function(wrapper,NAME,IS_MAP,ADDER){var C=wrapper(function(that,iterable){$.set(assert.inst(that,C,NAME),ID,id++);if(iterable!=undefined)forOf(iterable,IS_MAP,that[ADDER],that)});require("./$.mix")(C.prototype,{"delete":function(key){if(!isObject(key))return false;if(!isExtensible(key))return leakStore(this)["delete"](key);return $has(key,WEAK)&&$has(key[WEAK],this[ID])&&delete key[WEAK][this[ID]]},has:function has(key){if(!isObject(key))return false;if(!isExtensible(key))return leakStore(this).has(key);return $has(key,WEAK)&&$has(key[WEAK],this[ID])}});return C},def:function(that,key,value){if(!isExtensible(assert.obj(key))){leakStore(that).set(key,value)}else{$has(key,WEAK)||hide(key,WEAK,{});key[WEAK][that[ID]]=value}return that},leakStore:leakStore,WEAK:WEAK,ID:ID}},{"./$":24,"./$.array-methods":4,"./$.assert":5,"./$.for-of":16,"./$.mix":26,"./$.uid":40}],11:[function(require,module,exports){"use strict";var $=require("./$"),$def=require("./$.def"),BUGGY=require("./$.iter").BUGGY,forOf=require("./$.for-of"),species=require("./$.species"),assertInstance=require("./$.assert").inst;module.exports=function(NAME,wrapper,methods,common,IS_MAP,IS_WEAK){var Base=$.g[NAME],C=Base,ADDER=IS_MAP?"set":"add",proto=C&&C.prototype,O={};function fixMethod(KEY){var fn=proto[KEY];require("./$.redef")(proto,KEY,KEY=="delete"?function(a){return fn.call(this,a===0?0:a)}:KEY=="has"?function has(a){return fn.call(this,a===0?0:a)}:KEY=="get"?function get(a){return fn.call(this,a===0?0:a)}:KEY=="add"?function add(a){fn.call(this,a===0?0:a);return this}:function set(a,b){fn.call(this,a===0?0:a,b);return this})}if(!$.isFunction(C)||!(IS_WEAK||!BUGGY&&proto.forEach&&proto.entries)){C=common.getConstructor(wrapper,NAME,IS_MAP,ADDER);require("./$.mix")(C.prototype,methods)}else{var inst=new C,chain=inst[ADDER](IS_WEAK?{}:-0,1),buggyZero;if(!require("./$.iter-detect")(function(iter){new C(iter)})){C=wrapper(function(target,iterable){assertInstance(target,C,NAME);var that=new Base;if(iterable!=undefined)forOf(iterable,IS_MAP,that[ADDER],that);return that});C.prototype=proto;proto.constructor=C}IS_WEAK||inst.forEach(function(val,key){buggyZero=1/key===-Infinity});if(buggyZero){fixMethod("delete");fixMethod("has");IS_MAP&&fixMethod("get")}if(buggyZero||chain!==inst)fixMethod(ADDER)}require("./$.cof").set(C,NAME);O[NAME]=C;$def($def.G+$def.W+$def.F*(C!=Base),O);species(C);species($.core[NAME]);if(!IS_WEAK)common.setIter(C,NAME,IS_MAP);return C}},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.for-of":16,"./$.iter":23,"./$.iter-detect":22,"./$.mix":26,"./$.redef":29,"./$.species":34}],12:[function(require,module,exports){var assertFunction=require("./$.assert").fn;module.exports=function(fn,that,length){assertFunction(fn);if(~length&&that===undefined)return fn;switch(length){case 1:return function(a){return fn.call(that,a)};case 2:return function(a,b){return fn.call(that,a,b)};case 3:return function(a,b,c){return fn.call(that,a,b,c)}}return function(){return fn.apply(that,arguments)}}},{"./$.assert":5}],13:[function(require,module,exports){var $=require("./$"),global=$.g,core=$.core,isFunction=$.isFunction,$redef=require("./$.redef");function ctx(fn,that){return function(){return fn.apply(that,arguments)}}global.core=core;$def.F=1;$def.G=2;$def.S=4;$def.P=8;$def.B=16;$def.W=32;function $def(type,name,source){var key,own,out,exp,isGlobal=type&$def.G,isProto=type&$def.P,target=isGlobal?global:type&$def.S?global[name]:(global[name]||{}).prototype,exports=isGlobal?core:core[name]||(core[name]={});if(isGlobal)source=name;for(key in source){own=!(type&$def.F)&&target&&key in target;out=(own?target:source)[key];if(type&$def.B&&own)exp=ctx(out,global);else exp=isProto&&isFunction(out)?ctx(Function.call,out):out;if(target&&!own)$redef(target,key,out);if(exports[key]!=out)$.hide(exports,key,exp);if(isProto)(exports.prototype||(exports.prototype={}))[key]=out}}module.exports=$def},{"./$":24,"./$.redef":29}],14:[function(require,module,exports){var $=require("./$"),document=$.g.document,isObject=$.isObject,is=isObject(document)&&isObject(document.createElement);module.exports=function(it){return is?document.createElement(it):{}}},{"./$":24}],15:[function(require,module,exports){var $=require("./$");module.exports=function(it){var keys=$.getKeys(it),getDesc=$.getDesc,getSymbols=$.getSymbols;if(getSymbols)$.each.call(getSymbols(it),function(key){if(getDesc(it,key).enumerable)keys.push(key)});return keys}},{"./$":24}],16:[function(require,module,exports){var ctx=require("./$.ctx"),get=require("./$.iter").get,call=require("./$.iter-call");module.exports=function(iterable,entries,fn,that){var iterator=get(iterable),f=ctx(fn,that,entries?2:1),step;while(!(step=iterator.next()).done){if(call(iterator,f,step.value,entries)===false){return call.close(iterator)}}}},{"./$.ctx":12,"./$.iter":23,"./$.iter-call":20}],17:[function(require,module,exports){module.exports=function($){$.FW=true;$.path=$.g;return $}},{}],18:[function(require,module,exports){var $=require("./$"),toString={}.toString,getNames=$.getNames;var windowNames=typeof window=="object"&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];function getWindowNames(it){try{return getNames(it)}catch(e){return windowNames.slice()}}module.exports.get=function getOwnPropertyNames(it){if(windowNames&&toString.call(it)=="[object Window]")return getWindowNames(it);return getNames($.toObject(it))}},{"./$":24}],19:[function(require,module,exports){module.exports=function(fn,args,that){var un=that===undefined;switch(args.length){case 0:return un?fn():fn.call(that);case 1:return un?fn(args[0]):fn.call(that,args[0]);case 2:return un?fn(args[0],args[1]):fn.call(that,args[0],args[1]);case 3:return un?fn(args[0],args[1],args[2]):fn.call(that,args[0],args[1],args[2]);case 4:return un?fn(args[0],args[1],args[2],args[3]):fn.call(that,args[0],args[1],args[2],args[3]);case 5:return un?fn(args[0],args[1],args[2],args[3],args[4]):fn.call(that,args[0],args[1],args[2],args[3],args[4])}return fn.apply(that,args)}},{}],20:[function(require,module,exports){var assertObject=require("./$.assert").obj;function close(iterator){var ret=iterator["return"];if(ret!==undefined)assertObject(ret.call(iterator))}function call(iterator,fn,value,entries){try{return entries?fn(assertObject(value)[0],value[1]):fn(value)}catch(e){close(iterator);throw e}}call.close=close;module.exports=call},{"./$.assert":5}],21:[function(require,module,exports){var $def=require("./$.def"),$redef=require("./$.redef"),$=require("./$"),cof=require("./$.cof"),$iter=require("./$.iter"),SYMBOL_ITERATOR=require("./$.wks")("iterator"),FF_ITERATOR="@@iterator",KEYS="keys",VALUES="values",Iterators=$iter.Iterators;module.exports=function(Base,NAME,Constructor,next,DEFAULT,IS_SET,FORCE){$iter.create(Constructor,NAME,next);function createMethod(kind){function $$(that){return new Constructor(that,kind)}switch(kind){case KEYS:return function keys(){return $$(this)};case VALUES:return function values(){return $$(this)}}return function entries(){return $$(this)}}var TAG=NAME+" Iterator",proto=Base.prototype,_native=proto[SYMBOL_ITERATOR]||proto[FF_ITERATOR]||DEFAULT&&proto[DEFAULT],_default=_native||createMethod(DEFAULT),methods,key;if(_native){var IteratorPrototype=$.getProto(_default.call(new Base));cof.set(IteratorPrototype,TAG,true);if($.FW&&$.has(proto,FF_ITERATOR))$iter.set(IteratorPrototype,$.that)}if($.FW||FORCE)$iter.set(proto,_default);Iterators[NAME]=_default;Iterators[TAG]=$.that;if(DEFAULT){methods={keys:IS_SET?_default:createMethod(KEYS),values:DEFAULT==VALUES?_default:createMethod(VALUES),entries:DEFAULT!=VALUES?_default:createMethod("entries")};if(FORCE)for(key in methods){if(!(key in proto))$redef(proto,key,methods[key])}else $def($def.P+$def.F*$iter.BUGGY,NAME,methods)}}},{"./$":24,"./$.cof":7,"./$.def":13,"./$.iter":23,"./$.redef":29,"./$.wks":42}],22:[function(require,module,exports){var SYMBOL_ITERATOR=require("./$.wks")("iterator"),SAFE_CLOSING=false;try{var riter=[7][SYMBOL_ITERATOR]();riter["return"]=function(){SAFE_CLOSING=true};Array.from(riter,function(){throw 2})}catch(e){}module.exports=function(exec){if(!SAFE_CLOSING)return false;var safe=false;try{var arr=[7],iter=arr[SYMBOL_ITERATOR]();iter.next=function(){safe=true};arr[SYMBOL_ITERATOR]=function(){return iter};exec(arr)}catch(e){}return safe}},{"./$.wks":42}],23:[function(require,module,exports){"use strict";var $=require("./$"),cof=require("./$.cof"),classof=cof.classof,assert=require("./$.assert"),assertObject=assert.obj,SYMBOL_ITERATOR=require("./$.wks")("iterator"),FF_ITERATOR="@@iterator",Iterators=require("./$.shared")("iterators"),IteratorPrototype={};setIterator(IteratorPrototype,$.that);function setIterator(O,value){$.hide(O,SYMBOL_ITERATOR,value);if(FF_ITERATOR in[])$.hide(O,FF_ITERATOR,value)}module.exports={BUGGY:"keys"in[]&&!("next"in[].keys()),Iterators:Iterators,step:function(done,value){return{value:value,done:!!done}},is:function(it){var O=Object(it),Symbol=$.g.Symbol;return(Symbol&&Symbol.iterator||FF_ITERATOR)in O||SYMBOL_ITERATOR in O||$.has(Iterators,classof(O))},get:function(it){var Symbol=$.g.Symbol,getIter;if(it!=undefined){getIter=it[Symbol&&Symbol.iterator||FF_ITERATOR]||it[SYMBOL_ITERATOR]||Iterators[classof(it)]}assert($.isFunction(getIter),it," is not iterable!");return assertObject(getIter.call(it))},set:setIterator,create:function(Constructor,NAME,next,proto){Constructor.prototype=$.create(proto||IteratorPrototype,{next:$.desc(1,next)});cof.set(Constructor,NAME+" Iterator")}}},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.shared":33,"./$.wks":42}],24:[function(require,module,exports){"use strict";var global=typeof self!="undefined"?self:Function("return this")(),core={},defineProperty=Object.defineProperty,hasOwnProperty={}.hasOwnProperty,ceil=Math.ceil,floor=Math.floor,max=Math.max,min=Math.min;var DESC=!!function(){try{return defineProperty({},"a",{get:function(){return 2}}).a==2}catch(e){}}();var hide=createDefiner(1);function toInteger(it){return isNaN(it=+it)?0:(it>0?floor:ceil)(it)}function desc(bitmap,value){return{enumerable:!(bitmap&1),configurable:!(bitmap&2),writable:!(bitmap&4),value:value}}function simpleSet(object,key,value){object[key]=value;return object}function createDefiner(bitmap){return DESC?function(object,key,value){return $.setDesc(object,key,desc(bitmap,value))}:simpleSet}function isObject(it){return it!==null&&(typeof it=="object"||typeof it=="function")}function isFunction(it){return typeof it=="function"}function assertDefined(it){if(it==undefined)throw TypeError("Can't call method on  "+it);return it}var $=module.exports=require("./$.fw")({g:global,core:core,html:global.document&&document.documentElement,isObject:isObject,isFunction:isFunction,that:function(){return this},toInteger:toInteger,toLength:function(it){return it>0?min(toInteger(it),9007199254740991):0},toIndex:function(index,length){index=toInteger(index);return index<0?max(index+length,0):min(index,length)},has:function(it,key){return hasOwnProperty.call(it,key)},create:Object.create,getProto:Object.getPrototypeOf,DESC:DESC,desc:desc,getDesc:Object.getOwnPropertyDescriptor,setDesc:defineProperty,setDescs:Object.defineProperties,getKeys:Object.keys,getNames:Object.getOwnPropertyNames,getSymbols:Object.getOwnPropertySymbols,assertDefined:assertDefined,ES5Object:Object,toObject:function(it){return $.ES5Object(assertDefined(it))},hide:hide,def:createDefiner(0),set:global.Symbol?simpleSet:hide,each:[].forEach});if(typeof __e!="undefined")__e=core;if(typeof __g!="undefined")__g=global},{"./$.fw":17}],25:[function(require,module,exports){var $=require("./$");module.exports=function(object,el){var O=$.toObject(object),keys=$.getKeys(O),length=keys.length,index=0,key;while(length>index)if(O[key=keys[index++]]===el)return key}},{"./$":24}],26:[function(require,module,exports){var $redef=require("./$.redef");module.exports=function(target,src){for(var key in src)$redef(target,key,src[key]);return target}},{"./$.redef":29}],27:[function(require,module,exports){var $=require("./$"),assertObject=require("./$.assert").obj;module.exports=function ownKeys(it){assertObject(it);var keys=$.getNames(it),getSymbols=$.getSymbols;return getSymbols?keys.concat(getSymbols(it)):keys}},{"./$":24,"./$.assert":5}],28:[function(require,module,exports){"use strict";var $=require("./$"),invoke=require("./$.invoke"),assertFunction=require("./$.assert").fn;module.exports=function(){var fn=assertFunction(this),length=arguments.length,pargs=Array(length),i=0,_=$.path._,holder=false;while(length>i)if((pargs[i]=arguments[i++])===_)holder=true;return function(){var that=this,_length=arguments.length,j=0,k=0,args;if(!holder&&!_length)return invoke(fn,pargs,that);args=pargs.slice();if(holder)for(;length>j;j++)if(args[j]===_)args[j]=arguments[k++];while(_length>k)args.push(arguments[k++]);return invoke(fn,args,that)}}},{"./$":24,"./$.assert":5,"./$.invoke":19}],29:[function(require,module,exports){var $=require("./$"),tpl=String({}.hasOwnProperty),SRC=require("./$.uid").safe("src"),_toString=Function.toString;function $redef(O,key,val,safe){if($.isFunction(val)){var base=O[key];$.hide(val,SRC,base?String(base):tpl.replace(/hasOwnProperty/,String(key)));if(!("name"in val))val.name=key}if(O===$.g){O[key]=val}else{if(!safe)delete O[key];$.hide(O,key,val)}}$redef(Function.prototype,"toString",function toString(){return $.has(this,SRC)?this[SRC]:_toString.call(this)});$.core.inspectSource=function(it){return _toString.call(it)};module.exports=$redef},{"./$":24,"./$.uid":40}],30:[function(require,module,exports){"use strict";module.exports=function(regExp,replace,isStatic){var replacer=replace===Object(replace)?function(part){return replace[part]}:replace;return function(it){return String(isStatic?it:this).replace(regExp,replacer)}}},{}],31:[function(require,module,exports){module.exports=Object.is||function is(x,y){return x===y?x!==0||1/x===1/y:x!=x&&y!=y}},{}],32:[function(require,module,exports){var $=require("./$"),assert=require("./$.assert");function check(O,proto){assert.obj(O);assert(proto===null||$.isObject(proto),proto,": can't set as prototype!")}module.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(buggy,set){try{set=require("./$.ctx")(Function.call,$.getDesc(Object.prototype,"__proto__").set,2);set({},[])}catch(e){buggy=true}return function setPrototypeOf(O,proto){check(O,proto);if(buggy)O.__proto__=proto;else set(O,proto);return O}}():undefined),check:check}},{"./$":24,"./$.assert":5,"./$.ctx":12}],33:[function(require,module,exports){var $=require("./$"),SHARED="__core-js_shared__",store=$.g[SHARED]||($.g[SHARED]={});module.exports=function(key){return store[key]||(store[key]={})}},{"./$":24}],34:[function(require,module,exports){var $=require("./$"),SPECIES=require("./$.wks")("species");module.exports=function(C){if($.DESC&&!(SPECIES in C))$.setDesc(C,SPECIES,{configurable:true,get:$.that})}},{"./$":24,"./$.wks":42}],35:[function(require,module,exports){var $=require("./$");module.exports=function(TO_STRING){return function(that,pos){var s=String($.assertDefined(that)),i=$.toInteger(pos),l=s.length,a,b;if(i<0||i>=l)return TO_STRING?"":undefined;a=s.charCodeAt(i);return a<55296||a>56319||i+1===l||(b=s.charCodeAt(i+1))<56320||b>57343?TO_STRING?s.charAt(i):a:TO_STRING?s.slice(i,i+2):(a-55296<<10)+(b-56320)+65536}}},{"./$":24}],36:[function(require,module,exports){var $=require("./$"),repeat=require("./$.string-repeat");module.exports=function(that,minLength,fillChar,left){var S=String($.assertDefined(that));if(minLength===undefined)return S;var intMinLength=$.toInteger(minLength);var fillLen=intMinLength-S.length;if(fillLen<0||fillLen===Infinity){throw new RangeError("Cannot satisfy string length "+minLength+" for string: "+S)}var sFillStr=fillChar===undefined?" ":String(fillChar);var sFillVal=repeat.call(sFillStr,Math.ceil(fillLen/sFillStr.length));if(sFillVal.length>fillLen)sFillVal=left?sFillVal.slice(sFillVal.length-fillLen):sFillVal.slice(0,fillLen);return left?sFillVal.concat(S):S.concat(sFillVal)}},{"./$":24,"./$.string-repeat":37}],37:[function(require,module,exports){"use strict";var $=require("./$");module.exports=function repeat(count){var str=String($.assertDefined(this)),res="",n=$.toInteger(count);if(n<0||n==Infinity)throw RangeError("Count can't be negative");for(;n>0;(n>>>=1)&&(str+=str))if(n&1)res+=str;return res}},{"./$":24}],38:[function(require,module,exports){"use strict";var $=require("./$"),ctx=require("./$.ctx"),cof=require("./$.cof"),invoke=require("./$.invoke"),cel=require("./$.dom-create"),global=$.g,isFunction=$.isFunction,html=$.html,process=global.process,setTask=global.setImmediate,clearTask=global.clearImmediate,MessageChannel=global.MessageChannel,counter=0,queue={},ONREADYSTATECHANGE="onreadystatechange",defer,channel,port;function run(){var id=+this;if($.has(queue,id)){var fn=queue[id];delete queue[id];fn()}}function listner(event){run.call(event.data)}if(!isFunction(setTask)||!isFunction(clearTask)){setTask=function(fn){var args=[],i=1;while(arguments.length>i)args.push(arguments[i++]);queue[++counter]=function(){invoke(isFunction(fn)?fn:Function(fn),args)};defer(counter);return counter};clearTask=function(id){delete queue[id]};if(cof(process)=="process"){defer=function(id){process.nextTick(ctx(run,id,1))}}else if(global.addEventListener&&isFunction(global.postMessage)&&!global.importScripts){defer=function(id){global.postMessage(id,"*")};global.addEventListener("message",listner,false)}else if(isFunction(MessageChannel)){channel=new MessageChannel;port=channel.port2;channel.port1.onmessage=listner;defer=ctx(port.postMessage,port,1)}else if(ONREADYSTATECHANGE in cel("script")){defer=function(id){html.appendChild(cel("script"))[ONREADYSTATECHANGE]=function(){html.removeChild(this);run.call(id)}}}else{defer=function(id){setTimeout(ctx(run,id,1),0)}}}module.exports={set:setTask,clear:clearTask}},{"./$":24,"./$.cof":7,"./$.ctx":12,"./$.dom-create":14,"./$.invoke":19}],39:[function(require,module,exports){module.exports=function(exec){try{exec();return false}catch(e){return true}}},{}],40:[function(require,module,exports){var sid=0;function uid(key){return"Symbol(".concat(key===undefined?"":key,")_",(++sid+Math.random()).toString(36))}uid.safe=require("./$").g.Symbol||uid;module.exports=uid},{"./$":24}],41:[function(require,module,exports){var UNSCOPABLES=require("./$.wks")("unscopables");if(!(UNSCOPABLES in[]))require("./$").hide(Array.prototype,UNSCOPABLES,{});module.exports=function(key){[][UNSCOPABLES][key]=true}},{"./$":24,"./$.wks":42}],42:[function(require,module,exports){var global=require("./$").g,store=require("./$.shared")("wks");module.exports=function(name){return store[name]||(store[name]=global.Symbol&&global.Symbol[name]||require("./$.uid").safe("Symbol."+name))}},{"./$":24,"./$.shared":33,"./$.uid":40}],43:[function(require,module,exports){var $=require("./$"),cel=require("./$.dom-create"),cof=require("./$.cof"),$def=require("./$.def"),invoke=require("./$.invoke"),arrayMethod=require("./$.array-methods"),IE_PROTO=require("./$.uid").safe("__proto__"),assert=require("./$.assert"),assertObject=assert.obj,ObjectProto=Object.prototype,html=$.html,A=[],_slice=A.slice,_join=A.join,classof=cof.classof,has=$.has,defineProperty=$.setDesc,getOwnDescriptor=$.getDesc,defineProperties=$.setDescs,isFunction=$.isFunction,isObject=$.isObject,toObject=$.toObject,toLength=$.toLength,toIndex=$.toIndex,IE8_DOM_DEFINE=false,$indexOf=require("./$.array-includes")(false),$forEach=arrayMethod(0),$map=arrayMethod(1),$filter=arrayMethod(2),$some=arrayMethod(3),$every=arrayMethod(4);if(!$.DESC){try{IE8_DOM_DEFINE=defineProperty(cel("div"),"x",{get:function(){return 8}}).x==8}catch(e){}$.setDesc=function(O,P,Attributes){if(IE8_DOM_DEFINE)try{return defineProperty(O,P,Attributes)}catch(e){}if("get"in Attributes||"set"in Attributes)throw TypeError("Accessors not supported!");if("value"in Attributes)assertObject(O)[P]=Attributes.value;return O};$.getDesc=function(O,P){if(IE8_DOM_DEFINE)try{return getOwnDescriptor(O,P)}catch(e){}if(has(O,P))return $.desc(!ObjectProto.propertyIsEnumerable.call(O,P),O[P])};$.setDescs=defineProperties=function(O,Properties){assertObject(O);var keys=$.getKeys(Properties),length=keys.length,i=0,P;while(length>i)$.setDesc(O,P=keys[i++],Properties[P]);return O}}$def($def.S+$def.F*!$.DESC,"Object",{getOwnPropertyDescriptor:$.getDesc,defineProperty:$.setDesc,defineProperties:defineProperties});var keys1=("constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,"+"toLocaleString,toString,valueOf").split(","),keys2=keys1.concat("length","prototype"),keysLen1=keys1.length;var createDict=function(){var iframe=cel("iframe"),i=keysLen1,gt=">",iframeDocument;iframe.style.display="none";html.appendChild(iframe);iframe.src="javascript:";iframeDocument=iframe.contentWindow.document;iframeDocument.open();iframeDocument.write("<script>document.F=Object</script"+gt);iframeDocument.close();createDict=iframeDocument.F;while(i--)delete createDict.prototype[keys1[i]];return createDict()};function createGetKeys(names,length){return function(object){var O=toObject(object),i=0,result=[],key;for(key in O)if(key!=IE_PROTO)has(O,key)&&result.push(key);while(length>i)if(has(O,key=names[i++])){~$indexOf(result,key)||result.push(key)}return result}}function Empty(){}$def($def.S,"Object",{getPrototypeOf:$.getProto=$.getProto||function(O){O=Object(assert.def(O));if(has(O,IE_PROTO))return O[IE_PROTO];if(isFunction(O.constructor)&&O instanceof O.constructor){return O.constructor.prototype}return O instanceof Object?ObjectProto:null},getOwnPropertyNames:$.getNames=$.getNames||createGetKeys(keys2,keys2.length,true),create:$.create=$.create||function(O,Properties){var result;if(O!==null){Empty.prototype=assertObject(O);result=new Empty;Empty.prototype=null;result[IE_PROTO]=O}else result=createDict();return Properties===undefined?result:defineProperties(result,Properties)},keys:$.getKeys=$.getKeys||createGetKeys(keys1,keysLen1,false),seal:function seal(it){return it},freeze:function freeze(it){return it},preventExtensions:function preventExtensions(it){return it},isSealed:function isSealed(it){return!isObject(it)},isFrozen:function isFrozen(it){return!isObject(it)},isExtensible:function isExtensible(it){return isObject(it)}});$def($def.P,"Function",{bind:function(that){var fn=assert.fn(this),partArgs=_slice.call(arguments,1);function bound(){var args=partArgs.concat(_slice.call(arguments)),constr=this instanceof bound,ctx=constr?$.create(fn.prototype):that,result=invoke(fn,args,ctx);return constr?ctx:result}if(fn.prototype)bound.prototype=fn.prototype;return bound}});if(!(0 in Object("z")&&"z"[0]=="z")){$.ES5Object=function(it){return cof(it)=="String"?it.split(""):Object(it)}}var buggySlice=true;try{if(html)_slice.call(html);buggySlice=false}catch(e){}$def($def.P+$def.F*buggySlice,"Array",{slice:function slice(begin,end){var len=toLength(this.length),klass=cof(this);end=end===undefined?len:end;if(klass=="Array")return _slice.call(this,begin,end);
var start=toIndex(begin,len),upTo=toIndex(end,len),size=toLength(upTo-start),cloned=Array(size),i=0;for(;i<size;i++)cloned[i]=klass=="String"?this.charAt(start+i):this[start+i];return cloned}});$def($def.P+$def.F*($.ES5Object!=Object),"Array",{join:function join(){return _join.apply($.ES5Object(this),arguments)}});$def($def.S,"Array",{isArray:function(arg){return cof(arg)=="Array"}});function createArrayReduce(isRight){return function(callbackfn,memo){assert.fn(callbackfn);var O=toObject(this),length=toLength(O.length),index=isRight?length-1:0,i=isRight?-1:1;if(arguments.length<2)for(;;){if(index in O){memo=O[index];index+=i;break}index+=i;assert(isRight?index>=0:length>index,"Reduce of empty array with no initial value")}for(;isRight?index>=0:length>index;index+=i)if(index in O){memo=callbackfn(memo,O[index],index,this)}return memo}}$def($def.P,"Array",{forEach:$.each=$.each||function forEach(callbackfn){return $forEach(this,callbackfn,arguments[1])},map:function map(callbackfn){return $map(this,callbackfn,arguments[1])},filter:function filter(callbackfn){return $filter(this,callbackfn,arguments[1])},some:function some(callbackfn){return $some(this,callbackfn,arguments[1])},every:function every(callbackfn){return $every(this,callbackfn,arguments[1])},reduce:createArrayReduce(false),reduceRight:createArrayReduce(true),indexOf:function indexOf(el){return $indexOf(this,el,arguments[1])},lastIndexOf:function(el,fromIndex){var O=toObject(this),length=toLength(O.length),index=length-1;if(arguments.length>1)index=Math.min(index,$.toInteger(fromIndex));if(index<0)index=toLength(length+index);for(;index>=0;index--)if(index in O)if(O[index]===el)return index;return-1}});$def($def.P,"String",{trim:require("./$.replacer")(/^\s*([\s\S]*\S)?\s*$/,"$1")});$def($def.S,"Date",{now:function(){return+new Date}});function lz(num){return num>9?num:"0"+num}var date=new Date(-5e13-1),brokenDate=!(date.toISOString&&date.toISOString()=="0385-07-25T07:06:39.999Z"&&require("./$.throws")(function(){new Date(NaN).toISOString()}));$def($def.P+$def.F*brokenDate,"Date",{toISOString:function(){if(!isFinite(this))throw RangeError("Invalid time value");var d=this,y=d.getUTCFullYear(),m=d.getUTCMilliseconds(),s=y<0?"-":y>9999?"+":"";return s+("00000"+Math.abs(y)).slice(s?-6:-4)+"-"+lz(d.getUTCMonth()+1)+"-"+lz(d.getUTCDate())+"T"+lz(d.getUTCHours())+":"+lz(d.getUTCMinutes())+":"+lz(d.getUTCSeconds())+"."+(m>99?m:"0"+lz(m))+"Z"}});if(classof(function(){return arguments}())=="Object")cof.classof=function(it){var tag=classof(it);return tag=="Object"&&isFunction(it.callee)?"Arguments":tag}},{"./$":24,"./$.array-includes":3,"./$.array-methods":4,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.dom-create":14,"./$.invoke":19,"./$.replacer":30,"./$.throws":39,"./$.uid":40}],44:[function(require,module,exports){"use strict";var $=require("./$"),$def=require("./$.def"),toIndex=$.toIndex;$def($def.P,"Array",{copyWithin:function copyWithin(target,start){var O=Object($.assertDefined(this)),len=$.toLength(O.length),to=toIndex(target,len),from=toIndex(start,len),end=arguments[2],fin=end===undefined?len:toIndex(end,len),count=Math.min(fin-from,len-to),inc=1;if(from<to&&to<from+count){inc=-1;from=from+count-1;to=to+count-1}while(count-->0){if(from in O)O[to]=O[from];else delete O[to];to+=inc;from+=inc}return O}});require("./$.unscope")("copyWithin")},{"./$":24,"./$.def":13,"./$.unscope":41}],45:[function(require,module,exports){"use strict";var $=require("./$"),$def=require("./$.def"),toIndex=$.toIndex;$def($def.P,"Array",{fill:function fill(value){var O=Object($.assertDefined(this)),length=$.toLength(O.length),index=toIndex(arguments[1],length),end=arguments[2],endPos=end===undefined?length:toIndex(end,length);while(endPos>index)O[index++]=value;return O}});require("./$.unscope")("fill")},{"./$":24,"./$.def":13,"./$.unscope":41}],46:[function(require,module,exports){"use strict";var KEY="findIndex",$def=require("./$.def"),forced=true,$find=require("./$.array-methods")(6);if(KEY in[])Array(1)[KEY](function(){forced=false});$def($def.P+$def.F*forced,"Array",{findIndex:function findIndex(callbackfn){return $find(this,callbackfn,arguments[1])}});require("./$.unscope")(KEY)},{"./$.array-methods":4,"./$.def":13,"./$.unscope":41}],47:[function(require,module,exports){"use strict";var KEY="find",$def=require("./$.def"),forced=true,$find=require("./$.array-methods")(5);if(KEY in[])Array(1)[KEY](function(){forced=false});$def($def.P+$def.F*forced,"Array",{find:function find(callbackfn){return $find(this,callbackfn,arguments[1])}});require("./$.unscope")(KEY)},{"./$.array-methods":4,"./$.def":13,"./$.unscope":41}],48:[function(require,module,exports){var $=require("./$"),ctx=require("./$.ctx"),$def=require("./$.def"),$iter=require("./$.iter"),call=require("./$.iter-call");$def($def.S+$def.F*!require("./$.iter-detect")(function(iter){Array.from(iter)}),"Array",{from:function from(arrayLike){var O=Object($.assertDefined(arrayLike)),mapfn=arguments[1],mapping=mapfn!==undefined,f=mapping?ctx(mapfn,arguments[2],2):undefined,index=0,length,result,step,iterator;if($iter.is(O)){iterator=$iter.get(O);result=new(typeof this=="function"?this:Array);for(;!(step=iterator.next()).done;index++){result[index]=mapping?call(iterator,f,[step.value,index],true):step.value}}else{result=new(typeof this=="function"?this:Array)(length=$.toLength(O.length));for(;length>index;index++){result[index]=mapping?f(O[index],index):O[index]}}result.length=index;return result}})},{"./$":24,"./$.ctx":12,"./$.def":13,"./$.iter":23,"./$.iter-call":20,"./$.iter-detect":22}],49:[function(require,module,exports){var $=require("./$"),setUnscope=require("./$.unscope"),ITER=require("./$.uid").safe("iter"),$iter=require("./$.iter"),step=$iter.step,Iterators=$iter.Iterators;require("./$.iter-define")(Array,"Array",function(iterated,kind){$.set(this,ITER,{o:$.toObject(iterated),i:0,k:kind})},function(){var iter=this[ITER],O=iter.o,kind=iter.k,index=iter.i++;if(!O||index>=O.length){iter.o=undefined;return step(1)}if(kind=="keys")return step(0,index);if(kind=="values")return step(0,O[index]);return step(0,[index,O[index]])},"values");Iterators.Arguments=Iterators.Array;setUnscope("keys");setUnscope("values");setUnscope("entries")},{"./$":24,"./$.iter":23,"./$.iter-define":21,"./$.uid":40,"./$.unscope":41}],50:[function(require,module,exports){var $def=require("./$.def");$def($def.S,"Array",{of:function of(){var index=0,length=arguments.length,result=new(typeof this=="function"?this:Array)(length);while(length>index)result[index]=arguments[index++];result.length=length;return result}})},{"./$.def":13}],51:[function(require,module,exports){require("./$.species")(Array)},{"./$.species":34}],52:[function(require,module,exports){var $=require("./$"),HAS_INSTANCE=require("./$.wks")("hasInstance"),FunctionProto=Function.prototype;if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto,HAS_INSTANCE,{value:function(O){if(!$.isFunction(this)||!$.isObject(O))return false;if(!$.isObject(this.prototype))return O instanceof this;while(O=$.getProto(O))if(this.prototype===O)return true;return false}})},{"./$":24,"./$.wks":42}],53:[function(require,module,exports){"use strict";var $=require("./$"),NAME="name",setDesc=$.setDesc,FunctionProto=Function.prototype;NAME in FunctionProto||$.FW&&$.DESC&&setDesc(FunctionProto,NAME,{configurable:true,get:function(){var match=String(this).match(/^\s*function ([^ (]*)/),name=match?match[1]:"";$.has(this,NAME)||setDesc(this,NAME,$.desc(5,name));return name},set:function(value){$.has(this,NAME)||setDesc(this,NAME,$.desc(0,value))}})},{"./$":24}],54:[function(require,module,exports){"use strict";var strong=require("./$.collection-strong");require("./$.collection")("Map",function(get){return function Map(){return get(this,arguments[0])}},{get:function get(key){var entry=strong.getEntry(this,key);return entry&&entry.v},set:function set(key,value){return strong.def(this,key===0?0:key,value)}},strong,true)},{"./$.collection":11,"./$.collection-strong":8}],55:[function(require,module,exports){var Infinity=1/0,$def=require("./$.def"),E=Math.E,pow=Math.pow,abs=Math.abs,exp=Math.exp,log=Math.log,sqrt=Math.sqrt,ceil=Math.ceil,floor=Math.floor,EPSILON=pow(2,-52),EPSILON32=pow(2,-23),MAX32=pow(2,127)*(2-EPSILON32),MIN32=pow(2,-126);function roundTiesToEven(n){return n+1/EPSILON-1/EPSILON}function sign(x){return(x=+x)==0||x!=x?x:x<0?-1:1}function asinh(x){return!isFinite(x=+x)||x==0?x:x<0?-asinh(-x):log(x+sqrt(x*x+1))}function expm1(x){return(x=+x)==0?x:x>-1e-6&&x<1e-6?x+x*x/2:exp(x)-1}$def($def.S,"Math",{acosh:function acosh(x){return(x=+x)<1?NaN:isFinite(x)?log(x/E+sqrt(x+1)*sqrt(x-1)/E)+1:x},asinh:asinh,atanh:function atanh(x){return(x=+x)==0?x:log((1+x)/(1-x))/2},cbrt:function cbrt(x){return sign(x=+x)*pow(abs(x),1/3)},clz32:function clz32(x){return(x>>>=0)?31-floor(log(x+.5)*Math.LOG2E):32},cosh:function cosh(x){return(exp(x=+x)+exp(-x))/2},expm1:expm1,fround:function fround(x){var $abs=abs(x),$sign=sign(x),a,result;if($abs<MIN32)return $sign*roundTiesToEven($abs/MIN32/EPSILON32)*MIN32*EPSILON32;a=(1+EPSILON32/EPSILON)*$abs;result=a-(a-$abs);if(result>MAX32||result!=result)return $sign*Infinity;return $sign*result},hypot:function hypot(value1,value2){var sum=0,i=0,len=arguments.length,larg=0,arg,div;while(i<len){arg=abs(arguments[i++]);if(larg<arg){div=larg/arg;sum=sum*div*div+1;larg=arg}else if(arg>0){div=arg/larg;sum+=div*div}else sum+=arg}return larg===Infinity?Infinity:larg*sqrt(sum)},imul:function imul(x,y){var UInt16=65535,xn=+x,yn=+y,xl=UInt16&xn,yl=UInt16&yn;return 0|xl*yl+((UInt16&xn>>>16)*yl+xl*(UInt16&yn>>>16)<<16>>>0)},log1p:function log1p(x){return(x=+x)>-1e-8&&x<1e-8?x-x*x/2:log(1+x)},log10:function log10(x){return log(x)/Math.LN10},log2:function log2(x){return log(x)/Math.LN2},sign:sign,sinh:function sinh(x){return abs(x=+x)<1?(expm1(x)-expm1(-x))/2:(exp(x-1)-exp(-x-1))*(E/2)},tanh:function tanh(x){var a=expm1(x=+x),b=expm1(-x);return a==Infinity?1:b==Infinity?-1:(a-b)/(exp(x)+exp(-x))},trunc:function trunc(it){return(it>0?floor:ceil)(it)}})},{"./$.def":13}],56:[function(require,module,exports){"use strict";var $=require("./$"),isObject=$.isObject,isFunction=$.isFunction,NUMBER="Number",$Number=$.g[NUMBER],Base=$Number,proto=$Number.prototype;function toPrimitive(it){var fn,val;if(isFunction(fn=it.valueOf)&&!isObject(val=fn.call(it)))return val;if(isFunction(fn=it.toString)&&!isObject(val=fn.call(it)))return val;throw TypeError("Can't convert object to number")}function toNumber(it){if(isObject(it))it=toPrimitive(it);if(typeof it=="string"&&it.length>2&&it.charCodeAt(0)==48){var binary=false;switch(it.charCodeAt(1)){case 66:case 98:binary=true;case 79:case 111:return parseInt(it.slice(2),binary?2:8)}}return+it}if($.FW&&!($Number("0o1")&&$Number("0b1"))){$Number=function Number(it){return this instanceof $Number?new Base(toNumber(it)):toNumber(it)};$.each.call($.DESC?$.getNames(Base):("MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,"+"EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,"+"MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger").split(","),function(key){if($.has(Base,key)&&!$.has($Number,key)){$.setDesc($Number,key,$.getDesc(Base,key))}});$Number.prototype=proto;proto.constructor=$Number;require("./$.redef")($.g,NUMBER,$Number)}},{"./$":24,"./$.redef":29}],57:[function(require,module,exports){var $=require("./$"),$def=require("./$.def"),abs=Math.abs,floor=Math.floor,_isFinite=$.g.isFinite,MAX_SAFE_INTEGER=9007199254740991;function isInteger(it){return!$.isObject(it)&&_isFinite(it)&&floor(it)===it}$def($def.S,"Number",{EPSILON:Math.pow(2,-52),isFinite:function isFinite(it){return typeof it=="number"&&_isFinite(it)},isInteger:isInteger,isNaN:function isNaN(number){return number!=number},isSafeInteger:function isSafeInteger(number){return isInteger(number)&&abs(number)<=MAX_SAFE_INTEGER},MAX_SAFE_INTEGER:MAX_SAFE_INTEGER,MIN_SAFE_INTEGER:-MAX_SAFE_INTEGER,parseFloat:parseFloat,parseInt:parseInt})},{"./$":24,"./$.def":13}],58:[function(require,module,exports){var $def=require("./$.def");$def($def.S,"Object",{assign:require("./$.assign")})},{"./$.assign":6,"./$.def":13}],59:[function(require,module,exports){var $def=require("./$.def");$def($def.S,"Object",{is:require("./$.same")})},{"./$.def":13,"./$.same":31}],60:[function(require,module,exports){var $def=require("./$.def");$def($def.S,"Object",{setPrototypeOf:require("./$.set-proto").set})},{"./$.def":13,"./$.set-proto":32}],61:[function(require,module,exports){var $=require("./$"),$def=require("./$.def"),isObject=$.isObject,toObject=$.toObject;$.each.call(("freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,"+"getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames").split(","),function(KEY,ID){var fn=($.core.Object||{})[KEY]||Object[KEY],forced=0,method={};method[KEY]=ID==0?function freeze(it){return isObject(it)?fn(it):it}:ID==1?function seal(it){return isObject(it)?fn(it):it}:ID==2?function preventExtensions(it){return isObject(it)?fn(it):it}:ID==3?function isFrozen(it){return isObject(it)?fn(it):true}:ID==4?function isSealed(it){return isObject(it)?fn(it):true}:ID==5?function isExtensible(it){return isObject(it)?fn(it):false}:ID==6?function getOwnPropertyDescriptor(it,key){return fn(toObject(it),key)}:ID==7?function getPrototypeOf(it){return fn(Object($.assertDefined(it)))}:ID==8?function keys(it){return fn(toObject(it))}:require("./$.get-names").get;try{fn("z")}catch(e){forced=1}$def($def.S+$def.F*forced,"Object",method)})},{"./$":24,"./$.def":13,"./$.get-names":18}],62:[function(require,module,exports){"use strict";var cof=require("./$.cof"),tmp={};tmp[require("./$.wks")("toStringTag")]="z";if(require("./$").FW&&cof(tmp)!="z"){require("./$.redef")(Object.prototype,"toString",function toString(){return"[object "+cof.classof(this)+"]"},true)}},{"./$":24,"./$.cof":7,"./$.redef":29,"./$.wks":42}],63:[function(require,module,exports){"use strict";var $=require("./$"),ctx=require("./$.ctx"),cof=require("./$.cof"),$def=require("./$.def"),assert=require("./$.assert"),forOf=require("./$.for-of"),setProto=require("./$.set-proto").set,same=require("./$.same"),species=require("./$.species"),SPECIES=require("./$.wks")("species"),RECORD=require("./$.uid").safe("record"),PROMISE="Promise",global=$.g,process=global.process,isNode=cof(process)=="process",asap=process&&process.nextTick||require("./$.task").set,P=global[PROMISE],isFunction=$.isFunction,isObject=$.isObject,assertFunction=assert.fn,assertObject=assert.obj,Wrapper;function testResolve(sub){var test=new P(function(){});if(sub)test.constructor=Object;return P.resolve(test)===test}var useNative=function(){var works=false;function P2(x){var self=new P(x);setProto(self,P2.prototype);return self}try{works=isFunction(P)&&isFunction(P.resolve)&&testResolve();setProto(P2,P);P2.prototype=$.create(P.prototype,{constructor:{value:P2}});if(!(P2.resolve(5).then(function(){})instanceof P2)){works=false}if(works&&$.DESC){var thenableThenGotten=false;P.resolve($.setDesc({},"then",{get:function(){thenableThenGotten=true}}));works=thenableThenGotten}}catch(e){works=false}return works}();function isPromise(it){return isObject(it)&&(useNative?cof.classof(it)=="Promise":RECORD in it)}function sameConstructor(a,b){if(!$.FW&&a===P&&b===Wrapper)return true;return same(a,b)}function getConstructor(C){var S=assertObject(C)[SPECIES];return S!=undefined?S:C}function isThenable(it){var then;if(isObject(it))then=it.then;return isFunction(then)?then:false}function notify(record){var chain=record.c;if(chain.length)asap.call(global,function(){var value=record.v,ok=record.s==1,i=0;function run(react){var cb=ok?react.ok:react.fail,ret,then;try{if(cb){if(!ok)record.h=true;ret=cb===true?value:cb(value);if(ret===react.P){react.rej(TypeError("Promise-chain cycle"))}else if(then=isThenable(ret)){then.call(ret,react.res,react.rej)}else react.res(ret)}else react.rej(value)}catch(err){react.rej(err)}}while(chain.length>i)run(chain[i++]);chain.length=0})}function isUnhandled(promise){var record=promise[RECORD],chain=record.a||record.c,i=0,react;if(record.h)return false;while(chain.length>i){react=chain[i++];if(react.fail||!isUnhandled(react.P))return false}return true}function $reject(value){var record=this,promise;if(record.d)return;record.d=true;record=record.r||record;record.v=value;record.s=2;record.a=record.c.slice();setTimeout(function(){asap.call(global,function(){if(isUnhandled(promise=record.p)){if(isNode){process.emit("unhandledRejection",value,promise)}else if(global.console&&console.error){console.error("Unhandled promise rejection",value)}}record.a=undefined})},1);notify(record)}function $resolve(value){var record=this,then;if(record.d)return;record.d=true;record=record.r||record;try{if(then=isThenable(value)){asap.call(global,function(){var wrapper={r:record,d:false};try{then.call(value,ctx($resolve,wrapper,1),ctx($reject,wrapper,1))}catch(e){$reject.call(wrapper,e)}})}else{record.v=value;record.s=1;notify(record)}}catch(e){$reject.call({r:record,d:false},e)}}if(!useNative){P=function Promise(executor){assertFunction(executor);var record={p:assert.inst(this,P,PROMISE),c:[],a:undefined,s:0,d:false,v:undefined,h:false};$.hide(this,RECORD,record);try{executor(ctx($resolve,record,1),ctx($reject,record,1))}catch(err){$reject.call(record,err)}};require("./$.mix")(P.prototype,{then:function then(onFulfilled,onRejected){var S=assertObject(assertObject(this).constructor)[SPECIES];var react={ok:isFunction(onFulfilled)?onFulfilled:true,fail:isFunction(onRejected)?onRejected:false};var promise=react.P=new(S!=undefined?S:P)(function(res,rej){react.res=assertFunction(res);react.rej=assertFunction(rej)});var record=this[RECORD];record.c.push(react);if(record.a)record.a.push(react);if(record.s)notify(record);return promise},"catch":function(onRejected){return this.then(undefined,onRejected)}})}$def($def.G+$def.W+$def.F*!useNative,{Promise:P});cof.set(P,PROMISE);species(P);species(Wrapper=$.core[PROMISE]);$def($def.S+$def.F*!useNative,PROMISE,{reject:function reject(r){return new(getConstructor(this))(function(res,rej){rej(r)})}});$def($def.S+$def.F*(!useNative||testResolve(true)),PROMISE,{resolve:function resolve(x){return isPromise(x)&&sameConstructor(x.constructor,this)?x:new this(function(res){res(x)})}});$def($def.S+$def.F*!(useNative&&require("./$.iter-detect")(function(iter){P.all(iter)["catch"](function(){})})),PROMISE,{all:function all(iterable){var C=getConstructor(this),values=[];return new C(function(res,rej){forOf(iterable,false,values.push,values);var remaining=values.length,results=Array(remaining);if(remaining)$.each.call(values,function(promise,index){C.resolve(promise).then(function(value){results[index]=value;--remaining||res(results)},rej)});else res(results)})},race:function race(iterable){var C=getConstructor(this);return new C(function(res,rej){forOf(iterable,false,function(promise){C.resolve(promise).then(res,rej)})})}})},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.ctx":12,"./$.def":13,"./$.for-of":16,"./$.iter-detect":22,"./$.mix":26,"./$.same":31,"./$.set-proto":32,"./$.species":34,"./$.task":38,"./$.uid":40,"./$.wks":42}],64:[function(require,module,exports){var $=require("./$"),$def=require("./$.def"),setProto=require("./$.set-proto"),$iter=require("./$.iter"),ITERATOR=require("./$.wks")("iterator"),ITER=require("./$.uid").safe("iter"),step=$iter.step,assert=require("./$.assert"),isObject=$.isObject,getProto=$.getProto,$Reflect=$.g.Reflect,_apply=Function.apply,assertObject=assert.obj,_isExtensible=Object.isExtensible||isObject,_preventExtensions=Object.preventExtensions,buggyEnumerate=!($Reflect&&$Reflect.enumerate&&ITERATOR in $Reflect.enumerate({}));function Enumerate(iterated){$.set(this,ITER,{o:iterated,k:undefined,i:0})}$iter.create(Enumerate,"Object",function(){var iter=this[ITER],keys=iter.k,key;if(keys==undefined){iter.k=keys=[];for(key in iter.o)keys.push(key)}do{if(iter.i>=keys.length)return step(1)}while(!((key=keys[iter.i++])in iter.o));return step(0,key)});var reflect={apply:function apply(target,thisArgument,argumentsList){return _apply.call(target,thisArgument,argumentsList)},construct:function construct(target,argumentsList){var proto=assert.fn(arguments.length<3?target:arguments[2]).prototype,instance=$.create(isObject(proto)?proto:Object.prototype),result=_apply.call(target,instance,argumentsList);return isObject(result)?result:instance},defineProperty:function defineProperty(target,propertyKey,attributes){assertObject(target);try{$.setDesc(target,propertyKey,attributes);return true}catch(e){return false}},deleteProperty:function deleteProperty(target,propertyKey){var desc=$.getDesc(assertObject(target),propertyKey);return desc&&!desc.configurable?false:delete target[propertyKey]},get:function get(target,propertyKey){var receiver=arguments.length<3?target:arguments[2],desc=$.getDesc(assertObject(target),propertyKey),proto;if(desc)return $.has(desc,"value")?desc.value:desc.get===undefined?undefined:desc.get.call(receiver);return isObject(proto=getProto(target))?get(proto,propertyKey,receiver):undefined},getOwnPropertyDescriptor:function getOwnPropertyDescriptor(target,propertyKey){return $.getDesc(assertObject(target),propertyKey)},getPrototypeOf:function getPrototypeOf(target){return getProto(assertObject(target))},has:function has(target,propertyKey){return propertyKey in target},isExtensible:function isExtensible(target){return _isExtensible(assertObject(target))},ownKeys:require("./$.own-keys"),preventExtensions:function preventExtensions(target){assertObject(target);try{if(_preventExtensions)_preventExtensions(target);return true}catch(e){return false}},set:function set(target,propertyKey,V){var receiver=arguments.length<4?target:arguments[3],ownDesc=$.getDesc(assertObject(target),propertyKey),existingDescriptor,proto;if(!ownDesc){if(isObject(proto=getProto(target))){return set(proto,propertyKey,V,receiver)}ownDesc=$.desc(0)}if($.has(ownDesc,"value")){if(ownDesc.writable===false||!isObject(receiver))return false;existingDescriptor=$.getDesc(receiver,propertyKey)||$.desc(0);existingDescriptor.value=V;$.setDesc(receiver,propertyKey,existingDescriptor);return true}return ownDesc.set===undefined?false:(ownDesc.set.call(receiver,V),true)}};if(setProto)reflect.setPrototypeOf=function setPrototypeOf(target,proto){setProto.check(target,proto);try{setProto.set(target,proto);return true}catch(e){return false}};$def($def.G,{Reflect:{}});$def($def.S+$def.F*buggyEnumerate,"Reflect",{enumerate:function enumerate(target){return new Enumerate(assertObject(target))}});$def($def.S,"Reflect",reflect)},{"./$":24,"./$.assert":5,"./$.def":13,"./$.iter":23,"./$.own-keys":27,"./$.set-proto":32,"./$.uid":40,"./$.wks":42}],65:[function(require,module,exports){var $=require("./$"),cof=require("./$.cof"),$RegExp=$.g.RegExp,Base=$RegExp,proto=$RegExp.prototype,re=/a/g,CORRECT_NEW=new $RegExp(re)!==re,ALLOWS_RE_WITH_FLAGS=function(){try{return $RegExp(re,"i")=="/a/i"}catch(e){}}();if($.FW&&$.DESC){if(!CORRECT_NEW||!ALLOWS_RE_WITH_FLAGS){$RegExp=function RegExp(pattern,flags){var patternIsRegExp=cof(pattern)=="RegExp",flagsIsUndefined=flags===undefined;if(!(this instanceof $RegExp)&&patternIsRegExp&&flagsIsUndefined)return pattern;return CORRECT_NEW?new Base(patternIsRegExp&&!flagsIsUndefined?pattern.source:pattern,flags):new Base(patternIsRegExp?pattern.source:pattern,patternIsRegExp&&flagsIsUndefined?pattern.flags:flags)};$.each.call($.getNames(Base),function(key){key in $RegExp||$.setDesc($RegExp,key,{configurable:true,get:function(){return Base[key]},set:function(it){Base[key]=it}})});proto.constructor=$RegExp;$RegExp.prototype=proto;require("./$.redef")($.g,"RegExp",$RegExp)}if(/./g.flags!="g")$.setDesc(proto,"flags",{configurable:true,get:require("./$.replacer")(/^.*\/(\w*)$/,"$1")})}require("./$.species")($RegExp)},{"./$":24,"./$.cof":7,"./$.redef":29,"./$.replacer":30,"./$.species":34}],66:[function(require,module,exports){"use strict";var strong=require("./$.collection-strong");require("./$.collection")("Set",function(get){return function Set(){return get(this,arguments[0])}},{add:function add(value){return strong.def(this,value=value===0?0:value,value)}},strong)},{"./$.collection":11,"./$.collection-strong":8}],67:[function(require,module,exports){"use strict";var $def=require("./$.def"),$at=require("./$.string-at")(false);$def($def.P,"String",{codePointAt:function codePointAt(pos){return $at(this,pos)}})},{"./$.def":13,"./$.string-at":35}],68:[function(require,module,exports){"use strict";var $=require("./$"),cof=require("./$.cof"),$def=require("./$.def"),toLength=$.toLength;$def($def.P+$def.F*!require("./$.throws")(function(){"q".endsWith(/./)}),"String",{endsWith:function endsWith(searchString){if(cof(searchString)=="RegExp")throw TypeError();var that=String($.assertDefined(this)),endPosition=arguments[1],len=toLength(that.length),end=endPosition===undefined?len:Math.min(toLength(endPosition),len);searchString+="";return that.slice(end-searchString.length,end)===searchString}})},{"./$":24,"./$.cof":7,"./$.def":13,"./$.throws":39}],69:[function(require,module,exports){var $def=require("./$.def"),toIndex=require("./$").toIndex,fromCharCode=String.fromCharCode,$fromCodePoint=String.fromCodePoint;$def($def.S+$def.F*(!!$fromCodePoint&&$fromCodePoint.length!=1),"String",{fromCodePoint:function fromCodePoint(x){var res=[],len=arguments.length,i=0,code;while(len>i){code=+arguments[i++];if(toIndex(code,1114111)!==code)throw RangeError(code+" is not a valid code point");res.push(code<65536?fromCharCode(code):fromCharCode(((code-=65536)>>10)+55296,code%1024+56320))}return res.join("")}})},{"./$":24,"./$.def":13}],70:[function(require,module,exports){"use strict";var $=require("./$"),cof=require("./$.cof"),$def=require("./$.def");$def($def.P,"String",{includes:function includes(searchString){if(cof(searchString)=="RegExp")throw TypeError();return!!~String($.assertDefined(this)).indexOf(searchString,arguments[1])}})},{"./$":24,"./$.cof":7,"./$.def":13}],71:[function(require,module,exports){var set=require("./$").set,$at=require("./$.string-at")(true),ITER=require("./$.uid").safe("iter"),$iter=require("./$.iter"),step=$iter.step;require("./$.iter-define")(String,"String",function(iterated){set(this,ITER,{o:String(iterated),i:0})},function(){var iter=this[ITER],O=iter.o,index=iter.i,point;if(index>=O.length)return step(1);point=$at(O,index);iter.i+=point.length;return step(0,point)})},{"./$":24,"./$.iter":23,"./$.iter-define":21,"./$.string-at":35,"./$.uid":40}],72:[function(require,module,exports){var $=require("./$"),$def=require("./$.def");$def($def.S,"String",{raw:function raw(callSite){var tpl=$.toObject(callSite.raw),len=$.toLength(tpl.length),sln=arguments.length,res=[],i=0;while(len>i){res.push(String(tpl[i++]));if(i<sln)res.push(String(arguments[i]))}return res.join("")}})},{"./$":24,"./$.def":13}],73:[function(require,module,exports){var $def=require("./$.def");$def($def.P,"String",{repeat:require("./$.string-repeat")})},{"./$.def":13,"./$.string-repeat":37}],74:[function(require,module,exports){"use strict";var $=require("./$"),cof=require("./$.cof"),$def=require("./$.def");$def($def.P+$def.F*!require("./$.throws")(function(){"q".startsWith(/./)}),"String",{startsWith:function startsWith(searchString){if(cof(searchString)=="RegExp")throw TypeError();var that=String($.assertDefined(this)),index=$.toLength(Math.min(arguments[1],that.length));searchString+="";return that.slice(index,index+searchString.length)===searchString}})},{"./$":24,"./$.cof":7,"./$.def":13,"./$.throws":39}],75:[function(require,module,exports){"use strict";var $=require("./$"),setTag=require("./$.cof").set,uid=require("./$.uid"),shared=require("./$.shared"),$def=require("./$.def"),$redef=require("./$.redef"),keyOf=require("./$.keyof"),enumKeys=require("./$.enum-keys"),assertObject=require("./$.assert").obj,ObjectProto=Object.prototype,DESC=$.DESC,has=$.has,$create=$.create,getDesc=$.getDesc,setDesc=$.setDesc,desc=$.desc,$names=require("./$.get-names"),getNames=$names.get,toObject=$.toObject,$Symbol=$.g.Symbol,setter=false,TAG=uid("tag"),HIDDEN=uid("hidden"),_propertyIsEnumerable={}.propertyIsEnumerable,SymbolRegistry=shared("symbol-registry"),AllSymbols=shared("symbols"),useNative=$.isFunction($Symbol);var setSymbolDesc=DESC?function(){try{return $create(setDesc({},HIDDEN,{get:function(){return setDesc(this,HIDDEN,{value:false})[HIDDEN]}}))[HIDDEN]||setDesc}catch(e){return function(it,key,D){var protoDesc=getDesc(ObjectProto,key);if(protoDesc)delete ObjectProto[key];setDesc(it,key,D);if(protoDesc&&it!==ObjectProto)setDesc(ObjectProto,key,protoDesc)}}}():setDesc;function wrap(tag){var sym=AllSymbols[tag]=$.set($create($Symbol.prototype),TAG,tag);DESC&&setter&&setSymbolDesc(ObjectProto,tag,{configurable:true,set:function(value){if(has(this,HIDDEN)&&has(this[HIDDEN],tag))this[HIDDEN][tag]=false;setSymbolDesc(this,tag,desc(1,value))}});return sym}function defineProperty(it,key,D){if(D&&has(AllSymbols,key)){if(!D.enumerable){if(!has(it,HIDDEN))setDesc(it,HIDDEN,desc(1,{}));it[HIDDEN][key]=true}else{if(has(it,HIDDEN)&&it[HIDDEN][key])it[HIDDEN][key]=false;D=$create(D,{enumerable:desc(0,false)})}return setSymbolDesc(it,key,D)}return setDesc(it,key,D)}function defineProperties(it,P){assertObject(it);var keys=enumKeys(P=toObject(P)),i=0,l=keys.length,key;while(l>i)defineProperty(it,key=keys[i++],P[key]);return it}function create(it,P){return P===undefined?$create(it):defineProperties($create(it),P)}function propertyIsEnumerable(key){var E=_propertyIsEnumerable.call(this,key);return E||!has(this,key)||!has(AllSymbols,key)||has(this,HIDDEN)&&this[HIDDEN][key]?E:true}function getOwnPropertyDescriptor(it,key){var D=getDesc(it=toObject(it),key);if(D&&has(AllSymbols,key)&&!(has(it,HIDDEN)&&it[HIDDEN][key]))D.enumerable=true;return D}function getOwnPropertyNames(it){var names=getNames(toObject(it)),result=[],i=0,key;while(names.length>i)if(!has(AllSymbols,key=names[i++])&&key!=HIDDEN)result.push(key);return result}function getOwnPropertySymbols(it){var names=getNames(toObject(it)),result=[],i=0,key;while(names.length>i)if(has(AllSymbols,key=names[i++]))result.push(AllSymbols[key]);return result}if(!useNative){$Symbol=function Symbol(){if(this instanceof $Symbol)throw TypeError("Symbol is not a constructor");return wrap(uid(arguments[0]))};$redef($Symbol.prototype,"toString",function(){return this[TAG]});$.create=create;$.setDesc=defineProperty;$.getDesc=getOwnPropertyDescriptor;$.setDescs=defineProperties;$.getNames=$names.get=getOwnPropertyNames;$.getSymbols=getOwnPropertySymbols;if($.DESC&&$.FW)$redef(ObjectProto,"propertyIsEnumerable",propertyIsEnumerable,true)}var symbolStatics={"for":function(key){return has(SymbolRegistry,key+="")?SymbolRegistry[key]:SymbolRegistry[key]=$Symbol(key)},keyFor:function keyFor(key){return keyOf(SymbolRegistry,key)},useSetter:function(){setter=true},useSimple:function(){setter=false}};$.each.call(("hasInstance,isConcatSpreadable,iterator,match,replace,search,"+"species,split,toPrimitive,toStringTag,unscopables").split(","),function(it){var sym=require("./$.wks")(it);symbolStatics[it]=useNative?sym:wrap(sym)});setter=true;$def($def.G+$def.W,{Symbol:$Symbol});$def($def.S,"Symbol",symbolStatics);$def($def.S+$def.F*!useNative,"Object",{create:create,defineProperty:defineProperty,defineProperties:defineProperties,getOwnPropertyDescriptor:getOwnPropertyDescriptor,getOwnPropertyNames:getOwnPropertyNames,getOwnPropertySymbols:getOwnPropertySymbols});setTag($Symbol,"Symbol");setTag(Math,"Math",true);setTag($.g.JSON,"JSON",true)},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.enum-keys":15,"./$.get-names":18,"./$.keyof":25,"./$.redef":29,"./$.shared":33,"./$.uid":40,"./$.wks":42}],76:[function(require,module,exports){"use strict";var $=require("./$"),weak=require("./$.collection-weak"),leakStore=weak.leakStore,ID=weak.ID,WEAK=weak.WEAK,has=$.has,isObject=$.isObject,isExtensible=Object.isExtensible||isObject,tmp={};var $WeakMap=require("./$.collection")("WeakMap",function(get){
return function WeakMap(){return get(this,arguments[0])}},{get:function get(key){if(isObject(key)){if(!isExtensible(key))return leakStore(this).get(key);if(has(key,WEAK))return key[WEAK][this[ID]]}},set:function set(key,value){return weak.def(this,key,value)}},weak,true,true);if((new $WeakMap).set((Object.freeze||Object)(tmp),7).get(tmp)!=7){$.each.call(["delete","has","get","set"],function(key){var proto=$WeakMap.prototype,method=proto[key];require("./$.redef")(proto,key,function(a,b){if(isObject(a)&&!isExtensible(a)){var result=leakStore(this)[key](a,b);return key=="set"?this:result}return method.call(this,a,b)})})}},{"./$":24,"./$.collection":11,"./$.collection-weak":10,"./$.redef":29}],77:[function(require,module,exports){"use strict";var weak=require("./$.collection-weak");require("./$.collection")("WeakSet",function(get){return function WeakSet(){return get(this,arguments[0])}},{add:function add(value){return weak.def(this,value,true)}},weak,false,true)},{"./$.collection":11,"./$.collection-weak":10}],78:[function(require,module,exports){"use strict";var $def=require("./$.def"),$includes=require("./$.array-includes")(true);$def($def.P,"Array",{includes:function includes(el){return $includes(this,el,arguments[1])}});require("./$.unscope")("includes")},{"./$.array-includes":3,"./$.def":13,"./$.unscope":41}],79:[function(require,module,exports){require("./$.collection-to-json")("Map")},{"./$.collection-to-json":9}],80:[function(require,module,exports){var $=require("./$"),$def=require("./$.def"),ownKeys=require("./$.own-keys");$def($def.S,"Object",{getOwnPropertyDescriptors:function getOwnPropertyDescriptors(object){var O=$.toObject(object),result={};$.each.call(ownKeys(O),function(key){$.setDesc(result,key,$.desc(0,$.getDesc(O,key)))});return result}})},{"./$":24,"./$.def":13,"./$.own-keys":27}],81:[function(require,module,exports){var $=require("./$"),$def=require("./$.def");function createObjectToArray(isEntries){return function(object){var O=$.toObject(object),keys=$.getKeys(O),length=keys.length,i=0,result=Array(length),key;if(isEntries)while(length>i)result[i]=[key=keys[i++],O[key]];else while(length>i)result[i]=O[keys[i++]];return result}}$def($def.S,"Object",{values:createObjectToArray(false),entries:createObjectToArray(true)})},{"./$":24,"./$.def":13}],82:[function(require,module,exports){var $def=require("./$.def");$def($def.S,"RegExp",{escape:require("./$.replacer")(/[\\^$*+?.()|[\]{}]/g,"\\$&",true)})},{"./$.def":13,"./$.replacer":30}],83:[function(require,module,exports){require("./$.collection-to-json")("Set")},{"./$.collection-to-json":9}],84:[function(require,module,exports){"use strict";var $def=require("./$.def"),$at=require("./$.string-at")(true);$def($def.P,"String",{at:function at(pos){return $at(this,pos)}})},{"./$.def":13,"./$.string-at":35}],85:[function(require,module,exports){"use strict";var $def=require("./$.def"),$pad=require("./$.string-pad");$def($def.P,"String",{lpad:function lpad(n){return $pad(this,n,arguments[1],true)}})},{"./$.def":13,"./$.string-pad":36}],86:[function(require,module,exports){"use strict";var $def=require("./$.def"),$pad=require("./$.string-pad");$def($def.P,"String",{rpad:function rpad(n){return $pad(this,n,arguments[1],false)}})},{"./$.def":13,"./$.string-pad":36}],87:[function(require,module,exports){var $=require("./$"),$def=require("./$.def"),$Array=$.core.Array||Array,statics={};function setStatics(keys,length){$.each.call(keys.split(","),function(key){if(length==undefined&&key in $Array)statics[key]=$Array[key];else if(key in[])statics[key]=require("./$.ctx")(Function.call,[][key],length)})}setStatics("pop,reverse,shift,keys,values,entries",1);setStatics("indexOf,every,some,forEach,map,filter,find,findIndex,includes",3);setStatics("join,slice,concat,push,splice,unshift,sort,lastIndexOf,"+"reduce,reduceRight,copyWithin,fill,turn");$def($def.S,"Array",statics)},{"./$":24,"./$.ctx":12,"./$.def":13}],88:[function(require,module,exports){require("./es6.array.iterator");var $=require("./$"),Iterators=require("./$.iter").Iterators,ITERATOR=require("./$.wks")("iterator"),ArrayValues=Iterators.Array,NL=$.g.NodeList,HTC=$.g.HTMLCollection,NLProto=NL&&NL.prototype,HTCProto=HTC&&HTC.prototype;if($.FW){if(NL&&!(ITERATOR in NLProto))$.hide(NLProto,ITERATOR,ArrayValues);if(HTC&&!(ITERATOR in HTCProto))$.hide(HTCProto,ITERATOR,ArrayValues)}Iterators.NodeList=Iterators.HTMLCollection=ArrayValues},{"./$":24,"./$.iter":23,"./$.wks":42,"./es6.array.iterator":49}],89:[function(require,module,exports){var $def=require("./$.def"),$task=require("./$.task");$def($def.G+$def.B,{setImmediate:$task.set,clearImmediate:$task.clear})},{"./$.def":13,"./$.task":38}],90:[function(require,module,exports){var $=require("./$"),$def=require("./$.def"),invoke=require("./$.invoke"),partial=require("./$.partial"),navigator=$.g.navigator,MSIE=!!navigator&&/MSIE .\./.test(navigator.userAgent);function wrap(set){return MSIE?function(fn,time){return set(invoke(partial,[].slice.call(arguments,2),$.isFunction(fn)?fn:Function(fn)),time)}:set}$def($def.G+$def.B+$def.F*MSIE,{setTimeout:wrap($.g.setTimeout),setInterval:wrap($.g.setInterval)})},{"./$":24,"./$.def":13,"./$.invoke":19,"./$.partial":28}],91:[function(require,module,exports){require("./modules/es5");require("./modules/es6.symbol");require("./modules/es6.object.assign");require("./modules/es6.object.is");require("./modules/es6.object.set-prototype-of");require("./modules/es6.object.to-string");require("./modules/es6.object.statics-accept-primitives");require("./modules/es6.function.name");require("./modules/es6.function.has-instance");require("./modules/es6.number.constructor");require("./modules/es6.number.statics");require("./modules/es6.math");require("./modules/es6.string.from-code-point");require("./modules/es6.string.raw");require("./modules/es6.string.iterator");require("./modules/es6.string.code-point-at");require("./modules/es6.string.ends-with");require("./modules/es6.string.includes");require("./modules/es6.string.repeat");require("./modules/es6.string.starts-with");require("./modules/es6.array.from");require("./modules/es6.array.of");require("./modules/es6.array.iterator");require("./modules/es6.array.species");require("./modules/es6.array.copy-within");require("./modules/es6.array.fill");require("./modules/es6.array.find");require("./modules/es6.array.find-index");require("./modules/es6.regexp");require("./modules/es6.promise");require("./modules/es6.map");require("./modules/es6.set");require("./modules/es6.weak-map");require("./modules/es6.weak-set");require("./modules/es6.reflect");require("./modules/es7.array.includes");require("./modules/es7.string.at");require("./modules/es7.string.lpad");require("./modules/es7.string.rpad");require("./modules/es7.regexp.escape");require("./modules/es7.object.get-own-property-descriptors");require("./modules/es7.object.to-array");require("./modules/es7.map.to-json");require("./modules/es7.set.to-json");require("./modules/js.array.statics");require("./modules/web.timers");require("./modules/web.immediate");require("./modules/web.dom.iterable");module.exports=require("./modules/$").core},{"./modules/$":24,"./modules/es5":43,"./modules/es6.array.copy-within":44,"./modules/es6.array.fill":45,"./modules/es6.array.find":47,"./modules/es6.array.find-index":46,"./modules/es6.array.from":48,"./modules/es6.array.iterator":49,"./modules/es6.array.of":50,"./modules/es6.array.species":51,"./modules/es6.function.has-instance":52,"./modules/es6.function.name":53,"./modules/es6.map":54,"./modules/es6.math":55,"./modules/es6.number.constructor":56,"./modules/es6.number.statics":57,"./modules/es6.object.assign":58,"./modules/es6.object.is":59,"./modules/es6.object.set-prototype-of":60,"./modules/es6.object.statics-accept-primitives":61,"./modules/es6.object.to-string":62,"./modules/es6.promise":63,"./modules/es6.reflect":64,"./modules/es6.regexp":65,"./modules/es6.set":66,"./modules/es6.string.code-point-at":67,"./modules/es6.string.ends-with":68,"./modules/es6.string.from-code-point":69,"./modules/es6.string.includes":70,"./modules/es6.string.iterator":71,"./modules/es6.string.raw":72,"./modules/es6.string.repeat":73,"./modules/es6.string.starts-with":74,"./modules/es6.symbol":75,"./modules/es6.weak-map":76,"./modules/es6.weak-set":77,"./modules/es7.array.includes":78,"./modules/es7.map.to-json":79,"./modules/es7.object.get-own-property-descriptors":80,"./modules/es7.object.to-array":81,"./modules/es7.regexp.escape":82,"./modules/es7.set.to-json":83,"./modules/es7.string.at":84,"./modules/es7.string.lpad":85,"./modules/es7.string.rpad":86,"./modules/js.array.statics":87,"./modules/web.dom.iterable":88,"./modules/web.immediate":89,"./modules/web.timers":90}],92:[function(require,module,exports){(function(process,global){!function(global){"use strict";var hasOwn=Object.prototype.hasOwnProperty;var undefined;var iteratorSymbol=typeof Symbol==="function"&&Symbol.iterator||"@@iterator";var inModule=typeof module==="object";var runtime=global.regeneratorRuntime;if(runtime){if(inModule){module.exports=runtime}return}runtime=global.regeneratorRuntime=inModule?module.exports:{};function wrap(innerFn,outerFn,self,tryLocsList){var generator=Object.create((outerFn||Generator).prototype);generator._invoke=makeInvokeMethod(innerFn,self||null,new Context(tryLocsList||[]));return generator}runtime.wrap=wrap;function tryCatch(fn,obj,arg){try{return{type:"normal",arg:fn.call(obj,arg)}}catch(err){return{type:"throw",arg:err}}}var GenStateSuspendedStart="suspendedStart";var GenStateSuspendedYield="suspendedYield";var GenStateExecuting="executing";var GenStateCompleted="completed";var ContinueSentinel={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var Gp=GeneratorFunctionPrototype.prototype=Generator.prototype;GeneratorFunction.prototype=Gp.constructor=GeneratorFunctionPrototype;GeneratorFunctionPrototype.constructor=GeneratorFunction;GeneratorFunction.displayName="GeneratorFunction";function defineIteratorMethods(prototype){["next","throw","return"].forEach(function(method){prototype[method]=function(arg){return this._invoke(method,arg)}})}runtime.isGeneratorFunction=function(genFun){var ctor=typeof genFun==="function"&&genFun.constructor;return ctor?ctor===GeneratorFunction||(ctor.displayName||ctor.name)==="GeneratorFunction":false};runtime.mark=function(genFun){genFun.__proto__=GeneratorFunctionPrototype;genFun.prototype=Object.create(Gp);return genFun};runtime.awrap=function(arg){return new AwaitArgument(arg)};function AwaitArgument(arg){this.arg=arg}function AsyncIterator(generator){function invoke(method,arg){var result=generator[method](arg);var value=result.value;return value instanceof AwaitArgument?Promise.resolve(value.arg).then(invokeNext,invokeThrow):Promise.resolve(value).then(function(unwrapped){result.value=unwrapped;return result})}if(typeof process==="object"&&process.domain){invoke=process.domain.bind(invoke)}var invokeNext=invoke.bind(generator,"next");var invokeThrow=invoke.bind(generator,"throw");var invokeReturn=invoke.bind(generator,"return");var previousPromise;function enqueue(method,arg){var enqueueResult=previousPromise?previousPromise.then(function(){return invoke(method,arg)}):new Promise(function(resolve){resolve(invoke(method,arg))});previousPromise=enqueueResult["catch"](function(ignored){});return enqueueResult}this._invoke=enqueue}defineIteratorMethods(AsyncIterator.prototype);runtime.async=function(innerFn,outerFn,self,tryLocsList){var iter=new AsyncIterator(wrap(innerFn,outerFn,self,tryLocsList));return runtime.isGeneratorFunction(outerFn)?iter:iter.next().then(function(result){return result.done?result.value:iter.next()})};function makeInvokeMethod(innerFn,self,context){var state=GenStateSuspendedStart;return function invoke(method,arg){if(state===GenStateExecuting){throw new Error("Generator is already running")}if(state===GenStateCompleted){if(method==="throw"){throw arg}return doneResult()}while(true){var delegate=context.delegate;if(delegate){if(method==="return"||method==="throw"&&delegate.iterator[method]===undefined){context.delegate=null;var returnMethod=delegate.iterator["return"];if(returnMethod){var record=tryCatch(returnMethod,delegate.iterator,arg);if(record.type==="throw"){method="throw";arg=record.arg;continue}}if(method==="return"){continue}}var record=tryCatch(delegate.iterator[method],delegate.iterator,arg);if(record.type==="throw"){context.delegate=null;method="throw";arg=record.arg;continue}method="next";arg=undefined;var info=record.arg;if(info.done){context[delegate.resultName]=info.value;context.next=delegate.nextLoc}else{state=GenStateSuspendedYield;return info}context.delegate=null}if(method==="next"){if(state===GenStateSuspendedYield){context.sent=arg}else{context.sent=undefined}}else if(method==="throw"){if(state===GenStateSuspendedStart){state=GenStateCompleted;throw arg}if(context.dispatchException(arg)){method="next";arg=undefined}}else if(method==="return"){context.abrupt("return",arg)}state=GenStateExecuting;var record=tryCatch(innerFn,self,context);if(record.type==="normal"){state=context.done?GenStateCompleted:GenStateSuspendedYield;var info={value:record.arg,done:context.done};if(record.arg===ContinueSentinel){if(context.delegate&&method==="next"){arg=undefined}}else{return info}}else if(record.type==="throw"){state=GenStateCompleted;method="throw";arg=record.arg}}}}defineIteratorMethods(Gp);Gp[iteratorSymbol]=function(){return this};Gp.toString=function(){return"[object Generator]"};function pushTryEntry(locs){var entry={tryLoc:locs[0]};if(1 in locs){entry.catchLoc=locs[1]}if(2 in locs){entry.finallyLoc=locs[2];entry.afterLoc=locs[3]}this.tryEntries.push(entry)}function resetTryEntry(entry){var record=entry.completion||{};record.type="normal";delete record.arg;entry.completion=record}function Context(tryLocsList){this.tryEntries=[{tryLoc:"root"}];tryLocsList.forEach(pushTryEntry,this);this.reset(true)}runtime.keys=function(object){var keys=[];for(var key in object){keys.push(key)}keys.reverse();return function next(){while(keys.length){var key=keys.pop();if(key in object){next.value=key;next.done=false;return next}}next.done=true;return next}};function values(iterable){if(iterable){var iteratorMethod=iterable[iteratorSymbol];if(iteratorMethod){return iteratorMethod.call(iterable)}if(typeof iterable.next==="function"){return iterable}if(!isNaN(iterable.length)){var i=-1,next=function next(){while(++i<iterable.length){if(hasOwn.call(iterable,i)){next.value=iterable[i];next.done=false;return next}}next.value=undefined;next.done=true;return next};return next.next=next}}return{next:doneResult}}runtime.values=values;function doneResult(){return{value:undefined,done:true}}Context.prototype={constructor:Context,reset:function(skipTempReset){this.prev=0;this.next=0;this.sent=undefined;this.done=false;this.delegate=null;this.tryEntries.forEach(resetTryEntry);if(!skipTempReset){for(var name in this){if(name.charAt(0)==="t"&&hasOwn.call(this,name)&&!isNaN(+name.slice(1))){this[name]=undefined}}}},stop:function(){this.done=true;var rootEntry=this.tryEntries[0];var rootRecord=rootEntry.completion;if(rootRecord.type==="throw"){throw rootRecord.arg}return this.rval},dispatchException:function(exception){if(this.done){throw exception}var context=this;function handle(loc,caught){record.type="throw";record.arg=exception;context.next=loc;return!!caught}for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];var record=entry.completion;if(entry.tryLoc==="root"){return handle("end")}if(entry.tryLoc<=this.prev){var hasCatch=hasOwn.call(entry,"catchLoc");var hasFinally=hasOwn.call(entry,"finallyLoc");if(hasCatch&&hasFinally){if(this.prev<entry.catchLoc){return handle(entry.catchLoc,true)}else if(this.prev<entry.finallyLoc){return handle(entry.finallyLoc)}}else if(hasCatch){if(this.prev<entry.catchLoc){return handle(entry.catchLoc,true)}}else if(hasFinally){if(this.prev<entry.finallyLoc){return handle(entry.finallyLoc)}}else{throw new Error("try statement without catch or finally")}}}},abrupt:function(type,arg){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc<=this.prev&&hasOwn.call(entry,"finallyLoc")&&this.prev<entry.finallyLoc){var finallyEntry=entry;break}}if(finallyEntry&&(type==="break"||type==="continue")&&finallyEntry.tryLoc<=arg&&arg<=finallyEntry.finallyLoc){finallyEntry=null}var record=finallyEntry?finallyEntry.completion:{};record.type=type;record.arg=arg;if(finallyEntry){this.next=finallyEntry.finallyLoc}else{this.complete(record)}return ContinueSentinel},complete:function(record,afterLoc){if(record.type==="throw"){throw record.arg}if(record.type==="break"||record.type==="continue"){this.next=record.arg}else if(record.type==="return"){this.rval=record.arg;this.next="end"}else if(record.type==="normal"&&afterLoc){this.next=afterLoc}},finish:function(finallyLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.finallyLoc===finallyLoc){this.complete(entry.completion,entry.afterLoc);resetTryEntry(entry);return ContinueSentinel}}},"catch":function(tryLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc===tryLoc){var record=entry.completion;if(record.type==="throw"){var thrown=record.arg;resetTryEntry(entry)}return thrown}}throw new Error("illegal catch attempt")},delegateYield:function(iterable,resultName,nextLoc){this.delegate={iterator:values(iterable),resultName:resultName,nextLoc:nextLoc};return ContinueSentinel}}}(typeof global==="object"?global:typeof window==="object"?window:typeof self==="object"?self:this)}).call(this,require("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{_process:1}]},{},[2]);

/**
 * request-frame - requestAnimationFrame & cancelAnimationFrame polyfill for optimal cross-browser development.
 * @version v1.0.1
 * @license MIT
 * @preserve
 * Copyright Julien Etienne 2015 All Rights Reserved.
 */
!function(e){function n(n){function t(){function n(e,n,t){return e||n?(console.warn(t),!0):!1}function t(){return m?n(r,o,c):!1}var r=e.webkitRequestAnimationFrame,o=e.requestAnimationFrame,i=screen.width<=768?!0:!1,a=!(r&&o),u=e.performance?!1:!0,c="setTimeout is being used as a substitiue forrequestAnimationFrame due to a bug within iOS 6 builds",m=a&&i&&u;return t()}function r(){return clearTimeout}function o(e){var n=Date.now(),t=Math.max(b+16,n);return setTimeout(function(){e(b=t)},t-n)}function i(){return Array.prototype.filter?(f=e["request"+d]||e[l.filter(function(n){return void 0!==e[n+w]?n:void 0})+w]||o,t()?o:f):o}function a(){function n(n,t){for(var r;t<n.length;t++)if(e[n[t]]){r=e[n[t]];break}return r}var o=[];return Array.prototype.map?(l.map(function(e){return["Cancel","CancelRequest"].map(function(n){o.push(e+n+d)})}),s=e["cancel"+d]||n(o,0)||r,t()?r:s):r}function u(){return F?o:i()}function c(){return a()}function m(){F?(e.requestAnimationFrame=o,e.cancelAnimationFrame=r):(e.requestAnimationFrame=i(),e.cancelAnimationFrame=a())}var f,s,p,l=["moz","webkit"],d="AnimationFrame",w="Request"+d,b=0,q=e.mozRequestAnimationFrame,A=e.mozCancelAnimationFrame,F=q&&!A;switch(Date.now||(Date.now=function(){return(new Date).getTime()}),n){case"request":case"":p=u();break;case"cancel":p=c();break;case"native":m();break;default:throw new Error("RequestFrame parameter is not a type.")}return p}"object"==typeof module&&"object"==typeof module.exports?module.exports=exports=n:"function"==typeof define&&define.amd?define(function(){return n}):"object"==typeof e&&(e.requestFrame=n)}(window);

/**
 * flyte - Object model for the HTML5 canvas - a lightweight, faster alternative to fabric.js
 * @version v0.0.1
 * @license MIT
 * @date 2015-08-18
 * @preserve
 * Copyright (c) Alex Alksne <alex.alksne@gmail.com> 2015 All Rights Reserved.
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FCanvas = function FCanvas(canvasID) {
  _classCallCheck(this, FCanvas);

  // Dummy object for testing.
  if (typeof process === 'object' && process + '' === '[object process]') {
    return {
      width: undefined,
      height: undefined,
      style: { width: '', height: '' },
      getContext: function getContext(type) {
        return {
          save: function save() {},
          restore: function restore() {},
          clearRect: function clearRect() {},
          fillStyle: '',
          drawImage: function drawImage() {},
          fillRect: function fillRect() {}
        };
      },
      onmousedown: function onmousedown(e) {},
      onmouseup: function onmouseup(e) {},
      onclick: function onclick(e) {},
      ondblclick: function ondblclick(e) {},
      onmousemove: function onmousemove(e) {},
      onmouseout: function onmouseout(e) {}
    };
  }

  if (canvasID) {
    return document.querySelector(canvasID);
  }

  return document.createElement('canvas');
};

exports.FCanvas = FCanvas;

}).call(this,require('_process'))
},{"_process":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _FRect2 = require("./FRect");

var FImage = (function (_FRect) {
  _inherits(FImage, _FRect);

  function FImage() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$top = _ref.top;
    var top = _ref$top === undefined ? 0 : _ref$top;
    var _ref$left = _ref.left;
    var left = _ref$left === undefined ? 0 : _ref$left;
    var _ref$width = _ref.width;
    var width = _ref$width === undefined ? 30 : _ref$width;
    var _ref$height = _ref.height;
    var height = _ref$height === undefined ? 30 : _ref$height;
    var _ref$zIndex = _ref.zIndex;
    var zIndex = _ref$zIndex === undefined ? 0 : _ref$zIndex;
    var _ref$fillStyle = _ref.fillStyle;
    var fillStyle = _ref$fillStyle === undefined ? "#000000" : _ref$fillStyle;
    var mouseDownCB = _ref.mouseDownCB;
    var mouseUpCB = _ref.mouseUpCB;
    var mouseMoveCB = _ref.mouseMoveCB;
    var clickCB = _ref.clickCB;
    var doubleClickCB = _ref.doubleClickCB;
    var _ref$image = _ref.image;
    var image = _ref$image === undefined ? new Image() : _ref$image;

    _classCallCheck(this, FImage);

    _get(Object.getPrototypeOf(FImage.prototype), "constructor", this).call(this, { top: top, left: left, width: width, height: height, zIndex: zIndex, fillStyle: fillStyle, mouseDownCB: mouseDownCB, mouseUpCB: mouseUpCB, mouseMoveCB: mouseMoveCB, clickCB: clickCB, doubleClickCB: doubleClickCB });

    this.image = image;

    this._preserveAspectRatio = true;
  }

  _createClass(FImage, [{
    key: "_render",
    value: function _render() {
      this._ctx.save();

      this._ctx.clearRect(0, 0, this._c.width, this._c.height);
      this._ctx.fillStyle = this._fillStyle;
      this._ctx.fillRect(0, 0, this._width, this._height);

      this._ctx.drawImage(this._img, 0, 0, this._width, this._height);

      this._ctx.restore();
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var jsonObj = _get(Object.getPrototypeOf(FImage.prototype), "toJSON", this).call(this);

      jsonObj.image = this._c.toDataURL();

      return jsonObj;
    }
  }, {
    key: "image",
    set: function set(img) {
      this._img = img;
      this.width = this._img.width;
      this.height = this._img.height;
      this._aspectRatio = this._height / this._width;

      this._dirty = true;
    }
  }]);

  return FImage;
})(_FRect2.FRect);

exports.FImage = FImage;

},{"./FRect":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _FCanvas = require("./FCanvas");

var FRect = (function () {
  function FRect() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$top = _ref.top;
    var top = _ref$top === undefined ? 0 : _ref$top;
    var _ref$left = _ref.left;
    var left = _ref$left === undefined ? 0 : _ref$left;
    var _ref$width = _ref.width;
    var width = _ref$width === undefined ? 30 : _ref$width;
    var _ref$height = _ref.height;
    var height = _ref$height === undefined ? 30 : _ref$height;
    var _ref$zIndex = _ref.zIndex;
    var zIndex = _ref$zIndex === undefined ? 0 : _ref$zIndex;
    var _ref$fillStyle = _ref.fillStyle;
    var fillStyle = _ref$fillStyle === undefined ? "#000000" : _ref$fillStyle;
    var mouseDownCB = _ref.mouseDownCB;
    var mouseUpCB = _ref.mouseUpCB;
    var mouseMoveCB = _ref.mouseMoveCB;
    var clickCB = _ref.clickCB;
    var doubleClickCB = _ref.doubleClickCB;

    _classCallCheck(this, FRect);

    this._top = top;
    this._left = left;
    this._width = width;
    this._height = height;
    this._zIndex = zIndex;
    this._fillStyle = fillStyle;

    this._id = undefined;
    this._scene = undefined;

    this._selected = false;
    this._dragged = false;
    this._hasMouseOver = false;
    this._hasMouseOverScaleCtrl = false;
    this._hasMouseOverDeleteCtrl = false;
    this._selectedScaleCtrl = -1;
    this._dirty = true;
    this._controlsDirty = true;

    this._aspectRatio = this._height / this._width;
    this._preserveAspectRatio = false;

    this._MIN_SIZE = 50;
    this._SCALE_CTRL_RADIUS = 8;
    this._SCALE_CTRL_RR = this._SCALE_CTRL_RADIUS * this._SCALE_CTRL_RADIUS;
    this._DELETE_CTRL_SIZE = this._SCALE_CTRL_RADIUS * 2;
    this._PI2 = Math.PI * 2;

    this.mouseDownCB = mouseDownCB || this.mouseDownCB;
    this.mouseUpCB = mouseUpCB || this.mouseUpCB;
    this.mouseMoveCB = mouseMoveCB || this.mouseMoveCB;
    this.clickCB = clickCB || this.clickCB;
    this.doubleClickCB = doubleClickCB || this.doubleClickCB;

    var canvas = new _FCanvas.FCanvas();

    this._c = new _FCanvas.FCanvas();
    this._c.width = this._width;
    this._c.height = this._height;
    this._ctx = this._c.getContext('2d');
  }

  _createClass(FRect, [{
    key: "mouseDownCB",
    value: function mouseDownCB() {}
  }, {
    key: "mouseUpCB",
    value: function mouseUpCB() {}
  }, {
    key: "mouseMoveCB",
    value: function mouseMoveCB() {}
  }, {
    key: "clickCB",
    value: function clickCB() {}
  }, {
    key: "doubleClickCB",
    value: function doubleClickCB() {}
  }, {
    key: "_drawBorder",
    value: function _drawBorder(ctx) {
      ctx.save();

      ctx.strokeStyle = "grey";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(this._left, this._top);
      ctx.lineTo(this._left + this._width, this._top);
      ctx.lineTo(this._left + this._width, this._top + this._height);
      ctx.lineTo(this._left, this._top + this._height);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }
  }, {
    key: "_drawDeleteControl",
    value: function _drawDeleteControl(ctx) {
      var deleteCtrlTop = this._top - this._DELETE_CTRL_SIZE / 2;
      var deleteCtrlLeft = this._left + this._width - this._SCALE_CTRL_RADIUS - (this._MIN_SIZE - this._SCALE_CTRL_RADIUS * 2) / 2 - this._DELETE_CTRL_SIZE / 2;

      ctx.save();

      if (this._hasMouseOverDeleteCtrl) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
      }

      ctx.beginPath();
      ctx.moveTo(deleteCtrlLeft, deleteCtrlTop);
      ctx.lineTo(deleteCtrlLeft + this._DELETE_CTRL_SIZE, deleteCtrlTop);
      ctx.lineTo(deleteCtrlLeft + this._DELETE_CTRL_SIZE, deleteCtrlTop + this._DELETE_CTRL_SIZE);
      ctx.lineTo(deleteCtrlLeft, deleteCtrlTop + this._DELETE_CTRL_SIZE);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }
  }, {
    key: "_drawScaleCtrls",
    value: function _drawScaleCtrls(ctx) {
      this._drawScaleCtrl(ctx, 0);
      this._drawScaleCtrl(ctx, 1);
      this._drawScaleCtrl(ctx, 2);
      this._drawScaleCtrl(ctx, 3);
    }
  }, {
    key: "_drawScaleCtrl",
    value: function _drawScaleCtrl(ctx, scaleCtrlNumber) {
      var x = undefined;
      var y = undefined;

      switch (scaleCtrlNumber) {
        case 0:
          x = this._left;
          y = this._top;
          break;
        case 1:
          x = this._left + this._width;
          y = this._top;
          break;
        case 2:
          x = this._left + this._width;
          y = this._top + this._height;
          break;
        case 3:
          x = this._left;
          y = this._top + this._height;
          break;
      }

      ctx.save();

      if (this._hasMouseOverScaleCtrl) {
        ctx.strokeStyle = "#ffffff";
      } else {
        ctx.strokeStyle = "#ffffff";
      }

      ctx.beginPath();
      ctx.arc(x, y, this._SCALE_CTRL_RADIUS, 0, this._PI2, false);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }
  }, {
    key: "_render",
    value: function _render() {
      this._ctx.save();

      this._ctx.clearRect(0, 0, this._c.width, this._c.height);
      this._ctx.fillStyle = this._fillStyle;
      this._ctx.fillRect(0, 0, this._width, this._height);

      this._ctx.restore();
    }
  }, {
    key: "_postRender",
    value: function _postRender(ctx, drawBordersAndControls) {
      if (drawBordersAndControls && this._controlsDirty) {
        this._scene.postRenderCt = this._scene.postRenderCt || 0;
        this._scene.postRenderCt++;
        if (this._hasMouseOver || this._selected) {
          this._drawBorder(ctx);
        }

        if (this._selected) {
          this._drawScaleCtrls(ctx);

          this._drawDeleteControl(ctx);
        }

        this._controlsDirty = false;
      }
    }
  }, {
    key: "hitTest",
    value: function hitTest(top, left) {
      if (top >= this._top && top <= this._top + this._height && left >= this._left && left <= this._left + this._width) {
        return true;
      }

      return false;
    }
  }, {
    key: "deleteCtrlHitTest",
    value: function deleteCtrlHitTest(x, y) {
      var deleteCtrlTop = this._top - this._DELETE_CTRL_SIZE / 2;
      var deleteCtrlLeft = this._left + this._width - this._SCALE_CTRL_RADIUS - (this._MIN_SIZE - this._SCALE_CTRL_RADIUS * 2) / 2 - this._DELETE_CTRL_SIZE / 2;

      if (x >= deleteCtrlLeft && x <= deleteCtrlLeft + this._DELETE_CTRL_SIZE && y >= deleteCtrlTop && y <= deleteCtrlTop + this._DELETE_CTRL_SIZE) {
        return true;
      }

      return false;
    }
  }, {
    key: "scaleCtrlHitTest",
    value: function scaleCtrlHitTest(x, y) {
      var dx, dy;

      // top-left
      dx = x - this._left;
      dy = y - this._top;
      if (dx * dx + dy * dy <= this._SCALE_CTRL_RR) {
        return 0;
      }
      // top-right
      dx = x - (this._left + this._width);
      dy = y - this._top;
      if (dx * dx + dy * dy <= this._SCALE_CTRL_RR) {
        return 1;
      }
      // bottom-right
      dx = x - (this._left + this._width);
      dy = y - (this._top + this._height);
      if (dx * dx + dy * dy <= this._SCALE_CTRL_RR) {
        return 2;
      }
      // bottom-left
      dx = x - this._left;
      dy = y - (this._top + this._height);
      if (dx * dx + dy * dy <= this._SCALE_CTRL_RR) {
        return 3;
      }

      return -1;
    }
  }, {
    key: "above",
    value: function above(obj) {
      return this.zIndex > obj.zIndex;
    }
  }, {
    key: "below",
    value: function below(obj) {
      return this.zIndex < obj.zIndex;
    }
  }, {
    key: "onSameLayerAs",
    value: function onSameLayerAs(obj) {
      return this.zIndex === obj.zIndex;
    }
  }, {
    key: "isSelected",
    value: function isSelected() {
      return this._selected;
    }
  }, {
    key: "isSameObjectAs",
    value: function isSameObjectAs(obj) {
      if (!obj) return undefined;

      return this.id === obj.id;
    }
  }, {
    key: "translate",
    value: function translate(dx, dy) {
      this.left += dx;
      this.top += dy;

      this._controlsDirty = true;
    }
  }, {
    key: "scale",
    value: function scale(dx, dy, relativeToScaleCtrl) {
      switch (relativeToScaleCtrl) {
        case 0:
          if (this._width - dx >= this._MIN_SIZE && this._scene._prevX <= this._left + this._SCALE_CTRL_RADIUS) {
            this.left += dx;
            this.width -= dx;

            if (this._preserveAspectRatio) {
              this.top += this._aspectRatio * dx;
              this.height -= this._aspectRatio * dx;
            }
          }

          if (this._height - dy >= this._MIN_SIZE && this._scene._prevY <= this._top + this._SCALE_CTRL_RADIUS && !this._preserveAspectRatio) {
            this.top += dy;
            this.height -= dy;
          }
          break;
        case 1:
          if (this._width + dx >= this._MIN_SIZE && this._scene._prevX >= this._left + this._width - this._SCALE_CTRL_RADIUS) {
            this.width += dx;

            if (this._preserveAspectRatio) {
              this.top -= this._aspectRatio * dx;
              this.height += this._aspectRatio * dx;
            }
          }

          if (this._height - dy >= this._MIN_SIZE && this._scene._prevY <= this._top + this._SCALE_CTRL_RADIUS && !this._preserveAspectRatio) {
            this.top += dy;
            this.height -= dy;
          }

          break;
        case 2:
          if (this._width + dx >= this._MIN_SIZE && this._scene._prevX >= this._left + this._width - this._SCALE_CTRL_RADIUS) {
            this.width += dx;

            if (this._preserveAspectRatio) {
              this.height += this._aspectRatio * dx;
            }
          }

          if (this._height + dy >= this._MIN_SIZE && this._scene._prevY >= this._top + this._height - this._SCALE_CTRL_RADIUS && !this._preserveAspectRatio) {
            this.height += dy;
          }

          break;
        case 3:
          if (this._width - dx >= this._MIN_SIZE && this._scene._prevX <= this._left + this._SCALE_CTRL_RADIUS) {
            this.left += dx;
            this.width -= dx;

            if (this._preserveAspectRatio) {
              this.height -= this._aspectRatio * dx;
            }
          }

          if (this._height + dy >= this._MIN_SIZE && this._scene._prevY >= this._top + this._height - this._SCALE_CTRL_RADIUS && !this._preserveAspectRatio) {
            this.height += dy;
          }

          break;
      }

      this._controlsDirty = true;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var jsonObj = {
        id: this._id,
        left: this._left,
        top: this._top,
        width: this._width,
        height: this._height,
        zIndex: this._zIndex,
        fillStyle: this._fillStyle
      };

      return jsonObj;
    }
  }, {
    key: "draw",
    value: function draw(ctx, drawSelf, drawBordersAndControls) {
      if (this._dirty) {
        this._render();
        this._dirty = false;
      }

      if (drawSelf) {
        ctx.drawImage(this._c, this._left, this._top);
      }

      this._postRender(ctx, drawBordersAndControls);
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
  }, {
    key: "dirty",
    get: function get() {
      return this._dirty;
    }
  }, {
    key: "top",
    get: function get() {
      return this._top;
    },
    set: function set(top) {
      if (top !== this._top) {
        this._top = top;
        this._dirty = true;
      }
    }
  }, {
    key: "left",
    get: function get() {
      return this._left;
    },
    set: function set(left) {
      if (left !== this._left) {
        this._left = left;
        this._dirty = true;
      }
    }
  }, {
    key: "width",
    get: function get() {
      return this._width;
    },
    set: function set(width) {
      if (width !== this._width) {
        this._width = width;
        this._c.width = width;
        this._dirty = true;
      }
    }
  }, {
    key: "height",
    get: function get() {
      return this._height;
    },
    set: function set(height) {
      if (height !== this._height) {
        this._height = height;
        this._c.height = height;
        this._dirty = true;
      }
    }
  }, {
    key: "zIndex",
    get: function get() {
      return this._zIndex;
    },
    set: function set(zIndex) {
      if (zIndex !== this._zIndex) {
        this._zIndex = zIndex;
        this._scene._dirtyZIndexes = true;
      }
    }
  }, {
    key: "fillStyle",
    get: function get() {
      return this._fillStyle;
    },
    set: function set(fillStyle) {
      if (fillStyle !== this._fillStyle) {
        this._fillStyle = fillStyle;
        this._dirty = true;
      }
    }
  }, {
    key: "scaleCtrlRadius",
    get: function get() {
      return this._SCALE_CTRL_RADIUS;
    }
  }, {
    key: "hasMouseOver",
    get: function get() {
      return this._hasMouseOver;
    },
    set: function set(hasMouseOver) {
      if (hasMouseOver !== this._hasMouseOver) {
        this._hasMouseOver = hasMouseOver;
        this._controlsDirty = true;
      }
    }
  }, {
    key: "hasMouseOverScaleCtrl",
    get: function get() {
      return this._hasMouseOverScaleCtrl;
    },
    set: function set(hasMouseOverScaleCtrl) {
      if (hasMouseOverScaleCtrl !== this._hasMouseOverScaleCtrl) {
        this._hasMouseOverScaleCtrl = hasMouseOverScaleCtrl;
      }
    }
  }, {
    key: "hasMouseOverDeleteCtrl",
    get: function get() {
      return this._hasMouseOverDeleteCtrl;
    },
    set: function set(hasMouseOverDeleteCtrl) {
      if (hasMouseOverDeleteCtrl !== this._hasMouseOverDeleteCtrl) {
        this._hasMouseOverDeleteCtrl = hasMouseOverDeleteCtrl;
      }
    }
  }, {
    key: "selected",
    get: function get() {
      return this._selected;
    },
    set: function set(selected) {
      if (selected !== this._selected) {
        this._selected = selected;
        this._controlsDirty = true;
      }
    }
  }, {
    key: "dragged",
    get: function get() {
      return this._dragged;
    },
    set: function set(dragged) {
      this._dragged = dragged;
    }
  }, {
    key: "selectedScaleCtrl",
    get: function get() {
      return this._selectedScaleCtrl;
    },
    set: function set(selectedScaleCtrl) {
      this._selectedScaleCtrl = selectedScaleCtrl;
    }
  }, {
    key: "controlsDirty",
    get: function get() {
      return this._controlsDirty;
    }
  }]);

  return FRect;
})();

exports.FRect = FRect;

},{"./FCanvas":2}],5:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FRequestFrame = function FRequestFrame(requestType) {
  _classCallCheck(this, FRequestFrame);

  // Dummy object for testing.
  if (typeof process === 'object' && process + '' === '[object process]') {
    return function () {};
  }

  return requestFrame(requestType).bind(window);
};

exports.FRequestFrame = FRequestFrame;

}).call(this,require('_process'))
},{"_process":1}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _FCanvas = require("./FCanvas");

var _FRequestFrame = require("./FRequestFrame");

var FScene = (function () {
  function FScene() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var canvasID = _ref.canvasID;
    var width = _ref.width;
    var height = _ref.height;

    _classCallCheck(this, FScene);

    if (!canvasID) {
      var e = new Error('Flyte: Must supply an id for the target canvas.');
      e.code = "E_NO_CANVAS_ID";
      throw e;
    }

    if (!/^[0-9]+$/.test(width) || !/^[0-9]+$/.test(height)) {
      var e = new Error('Flyte: Canvas dimensions must be positive integers.');
      e.code = "E_INVALID_CANVAS_DIMENSIONS";
      throw e;
    }

    this._objects = [];
    this._selection = undefined;

    this._prevX = 0;
    this._prevY = 0;

    this._dirtyZIndexes = true;

    var c = new _FCanvas.FCanvas(canvasID);
    c.style.width = width + 'px';
    c.style.height = height + 'px';
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;

    this._c = c;
    this._ctx = this._c.getContext("2d");

    this._nextID = (function () {
      var index = 0;

      return function () {
        return index++;
      };
    })();

    var __onMouseDown = this._onMouseDown.bind(this);
    this._c.onmousedown = __onMouseDown;

    var __onMouseUp = this._onMouseUp.bind(this);
    this._c.onmouseup = __onMouseUp;

    var __onClick = this._onClick.bind(this);
    this._c.onclick = __onClick;

    var __onDoubleClick = this._onDoubleClick.bind(this);
    this._c.ondblclick = __onDoubleClick;

    var __onMouseMove = this._onMouseMove.bind(this);
    this._c.onmousemove = __onMouseMove;

    var __onMouseOut = this._onMouseOut.bind(this);
    this._c.onmouseout = __onMouseOut;

    this._request = new _FRequestFrame.FRequestFrame('request');
    this._cancel = new _FRequestFrame.FRequestFrame('cancel');

    this.__tick = this._tick.bind(this);
    this._requestID = this._request(this.__tick);
  }

  _createClass(FScene, [{
    key: "_onMouseDown",
    value: function _onMouseDown(e) {
      var _getMouseCoords2 = this._getMouseCoords(e);

      var x = _getMouseCoords2.x;
      var y = _getMouseCoords2.y;

      var collisions = this._getMouseCollisions(x, y, { withObjects: true, withDeleteCtrls: true, withScaleCtrls: true });
      var topObj = collisions.objects ? collisions.objects[0] : undefined;
      var topScaleCtrl = collisions.scaleCtrls ? collisions.scaleCtrls[0] : undefined;
      var topDeleteCtrl = collisions.deleteCtrls ? collisions.deleteCtrls[0] : undefined;

      if (topScaleCtrl && topScaleCtrl.isSelected()) {
        topScaleCtrl.selectedScaleCtrl = topScaleCtrl.scaleCtrlHitTest(x, y);
      } else if ((!topDeleteCtrl || !topDeleteCtrl.isSelected()) && topObj) {
        this.select(topObj);
        topObj.dragged = true;
      } else if (!topDeleteCtrl || !topDeleteCtrl.isSelected()) {
        this.unselect(this._selection);
      }

      if (topObj) {
        topObj.mouseDownCB(e);
      }

      this._prevX = x;
      this._prevY = y;

      return false;
    }
  }, {
    key: "_onMouseUp",
    value: function _onMouseUp(e) {
      var _getMouseCoords3 = this._getMouseCoords(e);

      var x = _getMouseCoords3.x;
      var y = _getMouseCoords3.y;

      var collisions = this._getMouseCollisions(x, y, { withObjects: true, withDeleteCtrls: false, withScaleCtrls: false });
      var topObj = collisions.objects ? collisions.objects[0] : undefined;

      this._c.style.cursor = 'default';

      if (topObj) {
        topObj.mouseUpCB(e);
      }

      this._prevX = x;
      this._prevY = y;
    }
  }, {
    key: "_onClick",
    value: function _onClick(e) {
      var _getMouseCoords4 = this._getMouseCoords(e);

      var x = _getMouseCoords4.x;
      var y = _getMouseCoords4.y;

      var collisions = this._getMouseCollisions(x, y, { withObjects: true, withDeleteCtrls: true, withScaleCtrls: false });
      var topDeleteCtrl = collisions.deleteCtrls ? collisions.deleteCtrls[0] : undefined;
      var topObj = collisions.objects ? collisions.objects[0] : undefined;

      if (topDeleteCtrl && topDeleteCtrl.isSelected() && !topDeleteCtrl.dragged) {
        this.remove(topDeleteCtrl);
      }

      if (this._selection) {
        this._selection.dragged = false;
        this._selection.selectedScaleCtrl = -1;
      }

      if (topObj) {
        topObj.clickCB(e);
      }

      this._prevX = x;
      this._prevY = y;
    }
  }, {
    key: "_onDoubleClick",
    value: function _onDoubleClick(e) {
      var _getMouseCoords5 = this._getMouseCoords(e);

      var x = _getMouseCoords5.x;
      var y = _getMouseCoords5.y;

      var collisions = this._getMouseCollisions(x, y, { withObjects: true, withScaleCtrls: false, withDeleteCtrls: false });
      var topObj = collisions.objects ? collisions.objects[0] : undefined;

      if (this._selection && this._selection.hitTest(y, x)) {
        if (this._selection._onDoubleClick) {
          this._selection._onDoubleClick(e, x, y);
        }
      }

      if (topObj) {
        topObj.doubleClickCB(e);
      }

      this._prevX = x;
      this._prevY = y;
    }
  }, {
    key: "_onMouseMove",
    value: function _onMouseMove(e) {
      var _getMouseCoords6 = this._getMouseCoords(e);

      var x = _getMouseCoords6.x;
      var y = _getMouseCoords6.y;

      var collisions = this._getMouseCollisions(x, y, { withObjects: true, withScaleCtrls: true, withDeleteCtrls: true });
      var topObj = collisions.objects ? collisions.objects[0] : undefined;
      var topScaleCtrl = collisions.scaleCtrls ? collisions.scaleCtrls[0] : undefined;
      var topDeleteCtrl = collisions.deleteCtrls ? collisions.deleteCtrls[0] : undefined;

      var canvasStyle = this._c.style;
      canvasStyle.cursor = 'default';

      var dx = x - this._prevX;
      var dy = y - this._prevY;

      var obj = this._selection;

      if (obj && obj.selectedScaleCtrl > -1) {
        obj.hasMouseOverScaleCtrl = true;

        if (obj.selectedScaleCtrl > -1) {
          obj.scale(dx, dy, obj.selectedScaleCtrl);
        }
      } else if (obj && obj.dragged) {
        obj.hasMouseOver = true;
        obj.translate(dx, dy);
      } else {
        for (var i in this._objects) {
          var _obj = this._objects[i];

          if (!_obj.isSelected()) {
            _obj.hasMouseOver = false;
            _obj.hasMouseOverDeleteCtrl = false;
            _obj.hasMouseOverScaleCtrl = false;
          }
        }

        if (topObj) {
          topObj.hasMouseOver = true;

          if (topObj.isSelected()) {
            canvasStyle.cursor = 'move';
          } else {
            canvasStyle.cursor = 'pointer';
          }
        }

        if (topScaleCtrl && topScaleCtrl.isSelected()) {
          topScaleCtrl.hasMouseOverScaleCtrl = true;

          var whichScaleCtrl = topScaleCtrl.scaleCtrlHitTest(x, y);
          if (whichScaleCtrl === 0 || whichScaleCtrl === 2) {
            canvasStyle.cursor = 'nwse-resize';
          } else if (whichScaleCtrl === 1 || whichScaleCtrl === 3) {
            canvasStyle.cursor = 'nesw-resize';
          }
        }

        if (topDeleteCtrl && topDeleteCtrl.isSelected()) {
          topDeleteCtrl.hasMouseOverDeleteCtrl = true;
          canvasStyle.cursor = 'pointer';
        }

        if (this._selection) {
          this._selection._controlsDirty = true;
        }
      }

      if (topObj) {
        topObj.mouseMoveCB(e);
      }

      this._prevX = x;
      this._prevY = y;
    }
  }, {
    key: "_onMouseOut",
    value: function _onMouseOut(e) {
      if (this._selection) {
        this._selection.dragged = false;
        this._selection.selectedScaleCtrl = -1;
      }

      this._c.onmouseup(e);
    }
  }, {
    key: "_getMouseCoords",
    value: function _getMouseCoords(e) {
      var rect = this._c.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      return { x: x, y: y };
    }
  }, {
    key: "_getMouseCollisions",
    value: function _getMouseCollisions(x, y) {
      var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var _ref2$withObjects = _ref2.withObjects;
      var withObjects = _ref2$withObjects === undefined ? false : _ref2$withObjects;
      var _ref2$withScaleCtrls = _ref2.withScaleCtrls;
      var withScaleCtrls = _ref2$withScaleCtrls === undefined ? false : _ref2$withScaleCtrls;
      var _ref2$withDeleteCtrls = _ref2.withDeleteCtrls;
      var withDeleteCtrls = _ref2$withDeleteCtrls === undefined ? false : _ref2$withDeleteCtrls;

      var collisions = { objects: undefined, scaleCtrls: undefined, deleteCtrls: undefined };

      if (withObjects) {
        var hitObjs = [];
        for (var i in this._objects) {
          var obj = this._objects[i];
          if (obj.hitTest(y, x)) {
            hitObjs.push(obj);
          }
        }

        if (hitObjs.length > 0) {
          hitObjs.sort(function (a, b) {
            return b.zIndex - a.zIndex;
          });

          collisions.objects = hitObjs;
        }
      }

      if (withScaleCtrls) {
        var hitScaleCtrls = [];
        for (var i in this._objects) {
          var obj = this._objects[i];
          if (obj.scaleCtrlHitTest(x, y) !== -1) {
            hitScaleCtrls.push(obj);
          }
        }

        if (hitScaleCtrls.length > 0) {
          hitScaleCtrls.sort(function (a, b) {
            return b.zIndex - a.zIndex;
          });

          collisions.scaleCtrls = hitScaleCtrls;
        }
      }

      if (withDeleteCtrls) {
        var hitDeleteCtrls = [];
        for (var i in this._objects) {
          var obj = this._objects[i];
          if (obj.deleteCtrlHitTest(x, y)) {
            hitDeleteCtrls.push(obj);
          }
        }

        if (hitDeleteCtrls.length > 0) {
          hitDeleteCtrls.sort(function (a, b) {
            return b.zIndex - a.zIndex;
          });

          collisions.deleteCtrls = hitDeleteCtrls;
        }
      }

      return collisions;
    }
  }, {
    key: "_sortZIndexes",
    value: function _sortZIndexes() {
      this._objects.sort(function (a, b) {
        return a.zIndex - b.zIndex;
      });
    }
  }, {
    key: "_tick",
    value: function _tick() {
      var anyDirtyObjects = false;
      var anyDirtyControls = false;
      for (var i in this._objects) {
        var obj = this._objects[i];

        if (obj.dirty || obj.controlsDirty) {
          anyDirtyObjects = obj.dirty;
          anyDirtyControls = obj.controlsDirty;
          break;
        }
      }

      if (anyDirtyObjects || anyDirtyControls || this._dirtyZIndexes) {
        this._ctx.clearRect(0, 0, this._c.width, this._c.height);

        this._ctx.fillStyle = "#999999";
        this._ctx.fillRect(0, 0, this._c.width, this._c.height);

        if (this._dirtyZIndexes) {
          this._sortZIndexes();
          this._dirtyZIndexes = false;
        }

        for (var i in this._objects) {
          var obj = this._objects[i];

          obj.draw(this._ctx, true, false);
        }

        for (var i in this._objects) {
          var obj = this._objects[i];

          obj.draw(this._ctx, false, true);
        }
      }

      this._request(this.__tick);
    }
  }, {
    key: "add",
    value: function add(obj) {
      obj._id = this._nextID();
      obj._scene = this;

      this._objects.push(obj);

      this._dirtyZIndexes = true;
    }
  }, {
    key: "remove",
    value: function remove(obj) {
      if (this.contains(obj)) {
        this.unselect(obj);

        var removedObj = this._objects.splice(this._objects.indexOf(obj), 1)[0];

        this._dirtyZIndexes = true;

        return removedObj;
      }
    }
  }, {
    key: "select",
    value: function select(obj) {
      if (this._selection) {
        if (obj.isSameObjectAs(this._selection)) {
          return;
        }

        this._selection.selected = false;
        this._selection.dragged = false;
        this._selection.selectedScaleCtrl = -1;

        this._selection = undefined;
      }

      obj.selected = true;
      obj.dragged = false;
      obj.selectedScaleCtrl = -1;

      this._selection = obj;
    }
  }, {
    key: "unselect",
    value: function unselect(obj) {
      if (this._selection && this._selection.isSameObjectAs(obj)) {
        this._selection.selected = false;
        this._selection.dragged = false;
        this._selection.selectedScaleCtrl = -1;

        this._selection = undefined;
      }
    }
  }, {
    key: "contains",
    value: function contains(obj) {
      return this._objects.indexOf(obj) !== -1 ? true : false;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var jsonObj = [];

      this._sortZIndexes();

      for (var i in this._objects) {
        var obj = this._objects[i];

        jsonObj.push(obj.toJSON());
      }

      return jsonObj;
    }
  }]);

  return FScene;
})();

exports.FScene = FScene;

},{"./FCanvas":2,"./FRequestFrame":5}],7:[function(require,module,exports){
'use strict';

var _FCanvas = require('./FCanvas');

var _FRequestFrame = require('./FRequestFrame');

var _FScene = require('./FScene');

var _FRect = require('./FRect');

var _FImage = require('./FImage');

window.FCanvas = _FCanvas.FCanvas;
window.FRequestFrame = _FRequestFrame.FRequestFrame;
window.FScene = _FScene.FScene;
window.FRect = _FRect.FRect;
window.FImage = _FImage.FImage;

},{"./FCanvas":2,"./FImage":3,"./FRect":4,"./FRequestFrame":5,"./FScene":6}]},{},[7]);
