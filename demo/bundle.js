/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist_syg_audio_src_es__ = __webpack_require__(1);


var audio_src = new __WEBPACK_IMPORTED_MODULE_0__dist_syg_audio_src_es__["a" /* default */]();

var buttons = document.querySelectorAll('.js-audio');

// 再生ボタン
buttons.forEach(function (elm) {
  elm.addEventListener('click', function (e) {
    e.preventDefault();

    var src = elm.getAttribute('data-audio-src');
    audio_src.set_src(src, audio_src.TYPE_FILE);

    // syg-audio-src はストリーミング・非ストリーミングの
    // ソースの設定を行うだけなので
    // 以降の操作は HTML5 Audio をそのまま扱う
    audio_src.audio.load();
    audio_src.audio.play();
  });
});

// 停止ボタン
document.querySelector('.js-audio-stop').addEventListener('click', function () {
  audio_src.audio.pause();
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
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
    this.opt = Object.assign(defaults, config);

    this.audio = new Audio(); // HTML5 Audio
    this.dash_player = null; // dash.js のインスタンス
    this.is_support_hds = false; // HDSを再生できるか
    this.is_support_hls = false; // HLSを再生できるか
    this.is_support_mse = false; // MedisSourceExtensionに対応しているか
    this.now_type = null; // ソースとして設定されたタイプ。TYPE_HDS ... TYPE_FILE などが入る
  }

  /**
   * サポート環境チェック
   * @return {Boolean} true: チェック完了 / false: 対象外環境
   */

  _createClass(_class, [{
    key: 'check_support',
    value: function check_support() {
      try {
        this.is_support_hds = is_can_play_hds(this.audio); // HDSを再生できるか
        this.is_support_hls = is_can_play_hls(this.audio); // HLSを再生できるか
        this.is_support_mse = is_support_mse(this.audio); // MedisSourceExtensionに対応しているか
      } catch (e) {
        return false;
      }
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

/* harmony default export */ __webpack_exports__["a"] = (_class);
//# sourceMappingURL=syg-audio-src.es.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);