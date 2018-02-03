function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1 = _core.version;

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document) && _isObject(document.createElement);
var _domCreate = function (it) {
  return is ? document.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign = _core.Object.assign;

var assign$2 = createCommonjsModule(function (module) {
module.exports = { "default": assign, __esModule: true };
});

var _Object$assign = unwrapExports(assign$2);

var classCallCheck = createCommonjsModule(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$2 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty, __esModule: true };
});

unwrapExports(defineProperty$2);

var createClass = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

/**
 * HDSを再生できるか
 * @param {Audio} audio
 * @return {Boolean} true : OK / false / NG
 */
function is_can_play_hds(audio) {
  return audio.canPlayType('application/f4m+xml') === 'maybe';
}

/**
 * HLSを再生できるか
 * @param {Audio} audio
 * @return {Boolean} true : OK / false / NG
 */
function is_can_play_hls(audio) {
  return audio.canPlayType('application/vnd.apple.mpegURL') === 'maybe';
}

/** ************
 * MediaSourceExtensionに対応しているか
 * @return {Boolean} true : OK / false / NG
 */
/* eslint no-void:["off"] */

function is_support_mse() {
  var hasWebKit = window.WebKitMediaSource !== null && window.WebKitMediaSource !== void 0;
  var hasMediaSource = window.MediaSource !== null && window.MediaSource !== void 0;
  return hasWebKit || hasMediaSource;
}

/**
 * ユーザー環境をチェックして、HDS / HLS / dash.js のソースを HTML5 Audio にセットする
 * MPEG-DASHを使う場合は dash.js が必要。
 *
 *
 * @author   Hiroshi Fukuda <info.sygnas@gmail.com>
 * @license  MIT
 */

/* globals dashjs */

var _class = function () {
  /**
   * コンストラクタ
   * @param {Object} config インスタンス設定。this.defaults 参照
   */
  function _class(config) {
    _classCallCheck(this, _class);

    // オーディオソースのタイプ定数
    this.TYPE_HDS = 'hds';
    this.TYPE_HLS = 'hls';
    this.TYPE_MSE = 'mse';
    this.TYPE_FILE = 'file';

    // デフォルト設定
    var defaults = {
      hds: {
        protcol: 'http://',
        playlist: '/manifest.f4m'
      },
      hls: {
        protcol: 'http://',
        playlist: '/playlist.m3u8'
      },
      mse: {
        protcol: 'http://',
        playlist: '/manifest.mpd',
        autoplay: false
      }
    };
    // 設定反映
    this.opt = _Object$assign(defaults, config);

    this.audio = new Audio(); // HTML5 Audio
    this.dash_player = null; // dash.js のインスタンス
    this.is_support_hds = false; // HDSを再生できるか
    this.is_support_hls = false; // HLSを再生できるか
    this.is_support_mse = false; // MedisSourceExtensionに対応しているか
    this.now_type = null; // ソースとして設定されたタイプ。TYPE_HDS ... TYPE_FILE などが入る

    this.$_check_support_result = null; // check_support() の実行結果
  }

  /**
   * サポート環境チェック
   * @return {Boolean} true: チェック完了 / false: 対象外環境
   */


  _createClass(_class, [{
    key: 'check_support',
    value: function check_support() {
      // すでに実行していたらその結果を返す
      if (this.$_check_support_result !== null) return this.$_check_support_result;

      try {
        this.is_support_hds = is_can_play_hds(this.audio); // HDSを再生できるか
        this.is_support_hls = is_can_play_hls(this.audio); // HLSを再生できるか
        this.is_support_mse = is_support_mse(this.audio); // MedisSourceExtensionに対応しているか
      } catch (e) {
        this.$_check_support_result = false;
        return false;
      }
      this.$_check_support_result = true;
      return true;
    }

    /**
     * オーディオソースを渡してHTML5 Audioにセットする
     * @param {String} url
     * mp3/ogg など非ストリーミングの場合はファイルのURL。
     * ストリーミングの場合は http://{この部分}//manifest.f4m をベースURLとして渡す
     * @param {String} type
     * タイプを指定したい時は TYPE_HDS などを渡す。
     * 非ストリーミングの場合は TYPE_FILE を必ず渡す。
     */

  }, {
    key: 'set_src',
    value: function set_src(url) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (type === this.TYPE_FILE) {
        return this.$_set_src_file(url);
      } else if (type === this.TYPE_HLS) {
        return this.$_set_src_hls(url);
      } else if (type === this.TYPE_HDS) {
        return this.$_set_src_hds(url);
      } else if (type === this.TYPE_MSE) {
        return this.$_set_src_mse(url);
      } else if (this.is_support_hls) {
        return this.$_set_src_hls(url);
      } else if (this.is_support_hds) {
        return this.$_set_src_hds(url);
      } else if (this.is_support_mse) {
        return this.$_set_src_mse(url);
      }
      return false;
    }

    /**
     * private
     */

    /**
     * 非ストリーミングでセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_file',
    value: function $_set_src_file(url) {
      this.audio.src = url;
      this.now_type = this.TYPE_FILE;
      return true;
    }
    /**
     * HLS形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_hls',
    value: function $_set_src_hls(url) {
      if (!this.is_support_hls) return false;

      this.audio.src = this.opt.hls.protcol + url + this.opt.hls.playlist;
      this.now_type = this.TYPE_HLS;
      return true;
    }
    /**
     * HDS形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_hds',
    value: function $_set_src_hds(url) {
      if (!this.is_support_hds) return false;

      this.audio.src = this.opt.hds.protcol + url + this.opt.hds.playlist;
      this.now_type = this.TYPE_HDS;
      return true;
    }
    /**
     * MSE形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_mse',
    value: function $_set_src_mse(url) {
      if (!this.is_support_mse) return false;

      // dash.js を使う
      this.now_type = this.TYPE_MSE;
      var src = this.opt.mse.protcol + url + this.opt.mse.playlist;

      if (this.dash_player === null) {
        this.dash_player = dashjs.MediaPlayer().create();
        this.dash_player.initialize(this.audio, src, this.opt.mse.autoplay);
      } else {
        this.dash_player.attachSource(src);
      }
      return true;
    }
  }]);

  return _class;
}();

export default _class;
