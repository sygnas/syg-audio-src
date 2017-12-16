import AudioSrc from '../../dist/syg-audio-src.es';

const audio_src = new AudioSrc();

const buttons = document.querySelectorAll('.js-audio');

// 再生ボタン
buttons.forEach((elm) => {
  elm.addEventListener('click', (e) => {
    e.preventDefault();

    const src = elm.getAttribute('data-audio-src');
    audio_src.set_src(src, audio_src.TYPE_FILE);

    // syg-audio-src はストリーミング・非ストリーミングの
    // ソースの設定を行うだけなので
    // 以降の操作は HTML5 Audio をそのまま扱う
    audio_src.audio.load();
    audio_src.audio.play();
  });
});

// 停止ボタン
document.querySelector('.js-audio-stop')
  .addEventListener('click', () => {
    audio_src.audio.pause();
  });
