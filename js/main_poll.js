let info_measurements = {
    UN: "A deficit in pollination can be measured as the amount of crop losses due to insufficiently pollinated crops for pollination.",
    pop: "We consider “local” beneficiaries as populations whose dietary requirements exceed pollinator-independent production within 100 km.",
    NC: "Nature’s contribution to pollination is represented by the proportion of total potential pollination- dependent crop output that is produced.",
    PN: "The potential human need for benefits of nature is manifested by the total agricultural crop output that is dependent to some degree on insect pollination.",
};


let ipbes_cp_wms_url = 'http://viewer.ecoshard.org:8080/geoserver/ipbes/wms';

let tileLayers = {
    cur:{
        UN: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_deficit_10s_cur_compressed_md5_6db2748b01d6541663f0698a8f34a607_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "UN 2015"}),
        pop: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_pop_30s_cur_md5_566d70b81ef5a1746ab5c66cbbe1d658',
            format: 'image/png',styles: [''],transparent:true,attribution: "Pop 2015"}),
        NC: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_NC_10s_cur_compressed_md5_5bea8fbf1d97ef6c2b539c97887e05a0_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "NC 2015"}),
        PN: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_potential_10s_cur_compressed_md5_20e27265b1627b6fbdb10b5fa504e745_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "UN 2015"}),
    },
    ssp1:{
        UN: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_deficit_change_10s_ssp1_compressed_md5_7b743214d92a37712f1fa678427f95ad_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "UN SSP1"}),
        pop: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_pop_change_30s_ssp1_md5_353845ac0bdc57ce67af15ae2bd9c593',
            format: 'image/png',styles: [''],transparent:true,attribution: "Pop SSP1"}),
        NC:L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_NC_change_10s_ssp1_compressed_md5_b731503ebc5f7e484c8935dcce6ba79c_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "NC SSP1"}),
        PN:L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_potential_abschange_10s_ssp1_md5_da5f61b9001adb2c5ba1a795718a9f90',
            format: 'image/png',styles: [''],transparent:true,attribution: "PN SSP1"}),
    },
    ssp3:{
        UN: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_deficit_change_10s_ssp3_compressed_md5_5a0488cac7fd542066c4b36596c67f36_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "UN SSP3"}),
        pop: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_pop_change_30s_ssp3_md5_0e58c680d510edcb20d2118eff3a47bd',
            format: 'image/png',styles: [''],transparent:true,attribution: "Pop SSP3"}),
        NC:L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_NC_change_10s_ssp3_compressed_md5_613532434a7e247e9c09a542bf853e5e_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "NC SSP3"}),
        PN:L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_potential_abschange_10s_ssp3_md5_6309f3eedab1bde1279ce3e1560a935d',
            format: 'image/png',styles: [''],transparent:true,attribution: "PN SSP3"}),
    },
    ssp5:{
        UN: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_deficit_change_10s_ssp5_compressed_md5_19f1e1f027e468ea2217903c605cd0b7_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "UN SSP5"}),
        pop: L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_pop_change_30s_ssp5_md5_670ab322ab9deb6820b5e16749377204',
            format: 'image/png',styles: [''],transparent:true,attribution: "Pop SSP5"}),
        NC:L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_NC_change_10s_ssp5_compressed_md5_099d2aaec6051be39b9cffb91fcb1260_compressed',
            format: 'image/png',styles: [''],transparent:true,attribution: "NC SSP5"}),
        PN:L.tileLayer.wms(ipbes_cp_wms_url,{
            layers: 'ipbes:pollination_potential_abschange_10s_ssp5_md5_99bf4ab9c9e93d7b7da96428062eadbc',
            format: 'image/png',styles: [''],transparent:true,attribution: "PN SSP5"}),
    },
}

let values = {
    UN:{
      0: 0,
      1: 25,
      2: 50,
      3: 75,
      4: 100},
    pop:{
        0: 0,
        1: 25,
        2: 50,
        3: 75,
        4: 100 },
    NC:{
        0: 0,
        1: 25,
        2: 50,
        3: 75,
        4: 100 },
    PN:{
        0: 0,
        1: 25,
        2: 50,
        3: 75,
        4: 100 }
    };



whenDocumentLoaded(() => {
    // Initialize dashboard
    addMenu(3);
    d3.selectAll("#landingpage").attr("class", "hidden");
});

function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", action);
    } else {
      // `DOMContentLoaded` already fired
      action();
    }
}




