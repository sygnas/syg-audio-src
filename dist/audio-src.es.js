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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
//# sourceMappingURL=audio-src.es.js.map
