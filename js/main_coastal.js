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

let legend_title_2015 = {
    UN: "Hazards Exposure <br> (risk index)",
    pop: "Coastal Population <br> (Population Density)",
    NC: "Risk Reduced <br> (%)",
    PN: "Coastal Hazard <br> Exposure <br> (risk index)",
};

let legend_colors_values_2015 = {
        UN:{
          1: '#fffff6',
          10: '#ffffd4',
          100: '#fed98e',
          200: '#fe9929',
          400: '#d95f0e',
          1000: '#993404'},
        pop:{
          0: "#ffffff",
          1: '#bfd6e8',
          10: '#9cacd2',
          20: '#8a7cba',
          40: '#45114d',
          50: '#000000'
        },
        NC:{
          0: '#ffffff',
          1: '#fafff7',
          25: '#caeac3',
          50: '#7bc87c',
          75: '#2a924a',
          90: '#00441b'
        },
        PN:{
            1: '#fffff6',
            10: '#ffffd4',
            100: '#fed98e',
            200: '#fe9929',
            400: '#d95f0e',
            1000: '#993404'},
    };

let legend_title_2050 = {
    UN: "Proportional Change <br> (%)",
    pop: "Proportional Change <br> (%)",
    NC: "Proportional Change <br> (%)",
    PN: "Proportional Change <br> (%)",
};

let legend_colors_2050 = {
        UN:{
          0: '#2c7bb6',
          1: '#5b93b6',
          2: '#abd9e9',
          3: '#ffffff',
          4: '#fdae61',
          5: '#d7191c' ,
          6: '#96191c',
          7: '#441115',
    },
        pop:{
            0: '#2c7bb6',
            1: '#5b93b6',
            2: '#abd9e9',
            3: '#ffffff',
            4: '#fdae61',
            5: '#d7191c' ,
            6: '#96191c',
            7: '#441115',
        },
        NC:{
            0: '#2c7bb6',
            1: '#5b93b6',
            2: '#abd9e9',
            3: '#ffffff',
            4: '#fdae61',
            5: '#d7191c' ,
            6: '#96191c',
        },
        PN:{
            0: '#2c7bb6',
            1: '#5b93b6',
            2: '#abd9e9',
            3: '#ffffff',
            4: '#fdae61',
            5: '#d7191c' ,
            6: '#96191c',
            7: '#441115',
        }
    };
      
let legend_values_2050 = {
    UN:{
        0: '-100',
        1: '-50',
        2: '-10',
        3: '0',
        4: '10',
        5: '50' ,
        6: '100',
        7: '1000',
    },
    pop:{
        0: '-100',
        1: '-50',
        2: '-10',
        3: '0',
        4: '10',
        5: '50' ,
        6: '100',
        7: '1000',
        },
    NC:{
        0: '-100',
        1: '-50',
        2: '-10',
        3: '0',
        4: '10',
        5: '50' ,
        6: '100',
        },
    PN:{
        0: '-1000',
        1: '-50',
        2: '-10',
        3: '0',
        4: '10',
        5: '50',
        6: '1000',
        7: '1000',
    }
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




