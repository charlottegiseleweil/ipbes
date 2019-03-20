// Control Panel
// Year toggle
var is2050 = false;

var wq_nc = {
  0: '#f7cf5',
  20: '#caeac3',
  40: '#7bc87c',
  60: '#2a924a',
  80: '#00441b'
};

var wq_deficit = {
  1: '#ffffd4',
  100: '#fed98e',
  200: '#fe9929',
  400: '#d95f0e',
  1000: '#993404'
};

function switchYear(toggle) {
  is2050 = toggle;
  let scenarioRow = document.getElementById('scenario');
  if (is2050) {
    scenarioRow.style.opacity = '1';
    scenarioRow.style.transition = 'opacity 0.5s linear';
    scenarioRow.style.visibility = 'visible';
    // document.querySelector("input[name='radio2']:checked").dispatchEvent(new Event('change'));
    document.getElementById('year-button-2015').classList.remove('selected');
    document.getElementById('year-button-2050').classList.add('selected');
  } else {
    scenarioRow.style.visibility = 'collapse';
    scenarioRow.style.opacity = '0';
    scenarioRow.style.transition = 'opacity 0.5s linear';
    scenarioRow.style.transition = 'visibility 0.15s linear';
    document.getElementById('year-button-2015').classList.add('selected');
    document.getElementById('year-button-2050').classList.remove('selected');
  }
  updateMap(pickEcoshard());
};

// Mode toggle
var mode = 'UN';

function switchMode(toggle) {
  mode = toggle;
  let nutrientRow = document.getElementById('nutrient');
  if (mode == 'UN') {
    // document.querySelector("input[name='radio2']:checked").dispatchEvent(new Event('change'));
    document.getElementById('NC-button').classList.remove('selected');
    document.getElementById('UN-button').classList.add('selected');
    is2050 = true;
  } else {
    document.getElementById('NC-button').classList.add('selected');
    document.getElementById('UN-button').classList.remove('selected');
  }
  updateMap(pickEcoshard());
};

//

var ecoshard;
// Link selection to ecoshard UGLIEST FUNCTION
function pickEcoshard() {
  if (mode == 'NC') {
    makeLegend(wq_nc);
    if (is2050) {
      if (document.getElementById("btnSSP1").checked) {
        ecoshard = 'SSP1_aligned_ndr_compressed_md5_3faede55056f8ebceef96d6b18113c91';
      } else if (document.getElementById("btnSSP3").checked) {
        ecoshard = 'SSP3_aligned_ndr_compressed_md5_e2fa5e203d51801f13f5b216723ed849';
      } else if (document.getElementById("btnSSP5").checked) {
        ecoshard = 'SSP5_aligned_ndr_compressed_md5_b7b7e9db1193954bba443e94dafe205d';
      }
    } else {
      ecoshard = '2015_aligned_ndr_compressed_md5_52442a88444f8f7fa648f0014b9d3a63';
    }
  } else {
    makeLegend(wq_deficit);
    if (is2050) {
      if (document.getElementById("btnSSP1").checked) {
        ecoshard = 'worldclim_2050_ssp1_n_export_compressed_md5_47c237fb127bc52cbb3228621cabe143';
      } else if (document.getElementById("btnSSP3").checked) {
        ecoshard = 'worldclim_2050_ssp3_n_export_compressed_md5_057bda11ecb59e998130a90f01375df9';
      } else if (document.getElementById("btnSSP5").checked) {
        ecoshard = 'worldclim_2050_ssp5_n_export_compressed_md5_ca38c7e16d9934b25f6fadcc44649c14';
      }
    } else {
      ecoshard = 'worldclim_2015_n_export_compressed_md5_059c48850f8a2b03ab1e434a9eeeb1a5';
    }
  }
  return ecoshard;
};
