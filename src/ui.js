let nearSlider, farSlider;
let nearLabel, farLabel;

function initFogUI() {
  const panel = document.createElement('div');
  panel.id = 'fog-panel';
  panel.innerHTML =
    '<div class="fog-panel-title">NIEBLA</div>' +
    '<label>fogNear' +
      '<input type="range" id="fog-near" min="' + FOG_NEAR_MIN + '" max="' + FOG_NEAR_MAX +
      '" step="1" value="' + fogNear + '">' +
      '<span class="fog-val" id="fog-near-val">' + Math.round(fogNear) + '</span>' +
    '</label>' +
    '<label>fogFar' +
      '<input type="range" id="fog-far" min="' + FOG_FAR_MIN + '" max="' + FOG_FAR_MAX +
      '" step="1" value="' + fogFar + '">' +
      '<span class="fog-val" id="fog-far-val">' + Math.round(fogFar) + '</span>' +
    '</label>';
  document.body.appendChild(panel);

  nearSlider = document.getElementById('fog-near');
  farSlider = document.getElementById('fog-far');
  nearLabel = document.getElementById('fog-near-val');
  farLabel = document.getElementById('fog-far-val');

  nearSlider.addEventListener('input', function () {
    let n = Number(nearSlider.value);
    if (n > fogFar - FOG_MIN_GAP) n = fogFar - FOG_MIN_GAP;
    n = Math.max(FOG_NEAR_MIN, Math.min(FOG_NEAR_MAX, n));
    nearSlider.value = n;
    fogNear = n;
    nearLabel.textContent = Math.round(n);
  });

  farSlider.addEventListener('input', function () {
    let f = Number(farSlider.value);
    if (f < fogNear + FOG_MIN_GAP) f = fogNear + FOG_MIN_GAP;
    f = Math.max(FOG_FAR_MIN, Math.min(FOG_FAR_MAX, f));
    farSlider.value = f;
    fogFar = f;
    farLabel.textContent = Math.round(f);
  });
}
