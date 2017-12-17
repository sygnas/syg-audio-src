# syg-audio-src

Check user environment and set HTML5 Audio from HDS / HLS / MSE<br>
ユーザー環境をチェックして、HDS / HLS / MSE のソースを HTML5 Audio にセットする。

## Description

HTML5 の `new Audio()` にオーディオソースをセットするだけのモジュールです。
再生コントロールはしません。

MSE形式（MPEG-DASH）を使う場合は dash.js が必要。

## Install
```sh
npm install syg-audio-src
```

## Javascript

### 共通部分
```JavaScript
import AudioSrc from 'syg-audio-src';
const audio_src = new AudioSrc();
```

### mp3/ogg 形式で非ストリーミング
```JavaScript
audio_src.set_src("hoge.mp3", ardio_src.TYPE_FILE);
```

### HDS形式ストリーミング
`http://stm.foo.bar/abcd1234.mp4/manifest.f4m` というプレイリストにアクセスしてストリーミングする場合。

```JavaScript
if(audio_src.check_support()) {
    audio_src.set_src(
        "stm.foo.bar/abcd1234.mp4",
        ardio_src.TYPE_HDS
    );
}
```

### ストリーミング形式を自動選択
下記3種類が用意されていて、環境に合わせたタイプを自動的に選択する場合。

HDS形式：`http://stm.foo.bar/abcd1234.mp4/manifest.f4m`<br>
HLS形式：`http://stm.foo.bar/abcd1234.mp4/playlist.m3u8`<br>
MSE形式：`http://stm.foo.bar/abcd1234.mp4/manifest.mpd` <br>

```JavaScript
if(audio_src.check_support()) {
    audio_src.set_src("stm.foo.bar/abcd1234.mp4");
}
```

### オーディオを再生
Audio の再生制御はしないので、他のライブラリなどで個々に実装する必要がある。

```JavaScript
audio_arc.audio.load();
audio_arc.audio.play();
```


## Options

```JavaScript
new SetAudio({
    hds: {
        protcol: 'http://',
        playlist: '/hoge.f4m',
    }
});
```

| パラメータ | デフォルト | 備考 |
| ---- | ---- | ---- |
| hds | {protcol: 'http://', playlist: '/manifest.f4m'} | HDS形式で使用するプロトコルと、プレイリスト |
| hls | {protcol: 'http://', playlist: '/playlist.m3u8'} | HLS形式で使用するプロトコルと、プレイリスト |
| mse | {protcol: 'http://', playlist: '/manifest.mpd', autoplay: false} | MSE形式で使用するプロトコルと、プレイリスト、自動再生するか |


## Property

### audio {Audio}
HTML5 Audio。

### dash_player {dashjs}
dash.js のインスタンス。

### is_support_hds {Boolean}
HDSを再生できるか。

### is_support_hls {Boolean}
HLSを再生できるか。

### is_support_mse {Boolean}
MedisSourceExtensionに対応しているか。

### now_type {String}
ソースとして設定されたタイプ。TYPE_HDS ... TYPE_FILE などが入る。


## Methods

### check_support()
サポートする環境をチェック。非ストリーミングの場合は関係ない。

戻り値：{Boolean} true: チェック完了 / false: 対象外環境

### set_src(url, type = null)
オーディオソースを渡してHTML5 Audioにセットする

| 引数 | 型 | 備考 |
| ---- | ---- | --- |
| url | String | mp3/ogg など非ストリーミングの場合はファイルのURL |
| type | String | ストリーミング、非ストリーミングのタイプを指定する |

#### url
ストリーミングの場合は http://{この部分}//manifest.f4m をベースURLとして渡す。

#### type
非ストリーミングの場合は `TYPE_FILE` を必ず指定。
無指定の場合は環境に合わせたタイプが使用される。

| 引数 | 備考 |
| ---- | --- |
| {instance}.TYPE_FILE | 非ストリーミング |
| {instance}.TYPE_HLS | HLS形式 |
| {instance}.TYPE_HDS | HDS形式 |
| {instance}.TYPE_MSE | MSE形式 |

```JavaScript
if(audio_src.check_support()) {
    audio_src.set_src(
        "stm.foo.bar/abcd1234.mp4",
        ardio_src.TYPE_HDS
    );
}
```


## License
MIT