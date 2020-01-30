var mymap = L.map('map').setView([36.204127, -113.7639641], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 12,
    id: 'mapbox/light-v10',
    accessToken: API_KEY,
}).addTo(mymap);

//Store API queries
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//Grab the data with d3
d3.json(baseURL, d => {
    //console.log(d)
    //Enter the array to take the data of magnitude to paint it
    d.features.forEach(z => {
        var color = "";
        if (z.properties.mag > 5) {
            color = "red";
        } else if (z.properties.mag > 4) {
            color = "orange";
        } else if (z.properties.mag > 3) {
            color = "yellow";
        } else if (z.properties.mag > 2) {
            color = "green";
        } else if (z.properties.mag > 1) {
            color = "blue";
        } else {
            color = "grey";
        }
        //Enter the array to get lat and long and draw the circles
        L.circle([z.geometry.coordinates[1], z.geometry.coordinates[0]], {
            fillOpacity: 1,
            color: color,
            fillColor: color,
            radius: z.properties.mag * 10000
                //Add a pop up everytime you click on it
        }).bindPopup("<h2>" + "Place: " + z.properties.place + "</h2> <hr> <h3>" + "Magnitud: " + z.properties.mag + "</h3>").addTo(mymap);
    })
});

function color(d) {
    return d > 5 ? 'red' :
        d > 4 ? 'red' :
        d > 3 ? 'orange' :
        d > 2 ? 'yellow' :
        d > 1 ? 'green' :
        d > 0 ? 'blue' :
        'grey';
};

//Add the position of the box
var legend = L.control({ position: 'topright' });

legend.onAdd = function(mymap) {


    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["0", "1", "2", "3", "4", "5"];

    // loop through our density intervals and generate a label with a colore square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color(grades[i] * 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
//Add the legends to the map
legend.addTo(mymap);