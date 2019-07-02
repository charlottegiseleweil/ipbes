let info_measurements = {
    UN: "A deficit in coastal protection can be measured as the exposure to coastal hazards, the magnitude of exposure still remaining after the attenuation of storm surge by any coastal habitat.",
    pop:"People living either nearest to the shoreline or between 0 and 10 m above sea level are considered to be the population exposed, since these are the people most susceptible to flooding, especially with sea level rise. ",
    NC: "Nature’s contribution to meeting potential needs for coastal protection  is the proportion of that coastal storm risk that is attenuated by ecosystems.",
    PN: "The potential human need for coastal protection is the physical exposure to coastal storms (based on wind, waves, sea level rise, geomorphology, etc) in the absence of coastal habitat like coral reefs or mangroves.",
};

let ipbes_CV_cp_wms_url = 'http://viewer.ecoshard.org:8080/geoserver/ipbes_cv_styles/wms';



let tileLayers = {
    cur:{
        UN: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_deficit_cur'],transparent:true,attribution: "NatCap &mdash; Deficit 2015"}),
        pop: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_pop_cur'],transparent:true,attribution: "NatCap &mdash; Population 2015"}),
        NC: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_NC_cur'],transparent:true,attribution: "NatCap &mdash; NC 2015"}),
        PN: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_potential_cur'],transparent:true,attribution: "NatCap &mdash; PN 2015"}),
    },
    ssp1:{
        UN: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_deficit_change_ssp1'],transparent:true,attribution: "NatCap &mdash; Deficit SSP1"}),
        pop: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_pop_change_ssp1'],transparent:true,attribution: "NatCap &mdash; Population SSP1"}),
        NC:L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_NC_change_ssp1'],transparent:true,attribution: "NatCap &mdash; NC SSP1"}),
        PN:L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_potential_change_ssp1'],transparent:true,attribution: "NatCap &mdash; PN SSP1"}),
    },
    ssp3:{
        UN: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_deficit_change_ssp3'],transparent:true,attribution: "NatCap &mdash; Deficit SSP3"}),
        pop: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_pop_change_ssp3'],transparent:true,attribution: "NatCap &mdash; Population SSP3"}),
        NC:L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_NC_change_ssp3'],transparent:true,attribution: "NatCap &mdash; NC SSP3"}),
        PN:L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_potential_change_ssp3'],transparent:true,attribution: "NatCap &mdash; PN SSP3"}),
    },
    ssp5:{
        UN: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_deficit_change_ssp5'],transparent:true,attribution: "NatCap &mdash; Deficit SSP5"}),
        pop: L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_pop_change_ssp5'],transparent:true,attribution: "NatCap &mdash; Population SSP5"}),
        NC:L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_NC_change_ssp5'],transparent:true,attribution: "NatCap &mdash; NC SSP5"}),
        PN:L.tileLayer.wms(ipbes_CV_cp_wms_url,{
            layers: 'ipbes_cv_styles:cv_coastal_points_ipbes',
            format: 'image/png',styles: ['coastal_potential_change_ssp5'],transparent:true,attribution: "NatCap &mdash; PN SSP5"}),
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




