
/** ************
 * MediaSourceExtensionに対応しているか
 * @return {Boolean} true : OK / false / NG
 */
/* eslint no-void:["off"] */

export default function is_support_mse() {
  const hasWebKit = (window.WebKitMediaSource !== null && window.WebKitMediaSource !== void 0);
  const hasMediaSource = (window.MediaSource !== null && window.MediaSource !== void 0);
  return (hasWebKit || hasMediaSource);
}
