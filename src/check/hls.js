
/**
 * HLSを再生できるか
 * @param {Audio} audio
 * @return {Boolean} true : OK / false / NG
 */
export default function is_can_play_hls(audio) {
  return audio.canPlayType('application/vnd.apple.mpegURL') === 'maybe';
}
