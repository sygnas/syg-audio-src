/**
 * HDSを再生できるか
 * @param {Audio} audio
 * @return {Boolean} true : OK / false / NG
 */
export default function is_can_play_hds(audio) {
  return audio.canPlayType('application/f4m+xml') === 'maybe';
}
