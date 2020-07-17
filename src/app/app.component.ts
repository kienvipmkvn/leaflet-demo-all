import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  map;
  route: any[] = [];
  isDrawing = false;
  drawnItems: L.FeatureGroup = L.featureGroup();
  iconSizeX = 20;
  iconSizeY = 40;
  routeLayer = [];
  oSMtiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  ggtiles = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    detectRetina: true,
    attribution: 'Ảnh bản đồ Google',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  });

  layerControl = {
    baseLayers: {
      OpenStreetMap: this.oSMtiles,
      GoogleMap: this.ggtiles,
    },
  };
  options = {
    layers: this.oSMtiles,
    center: [21, 105.8],
    zoom: 12,
    doubleClickZoom: false,
  };

  drawOptions = {
    draw: {
      marker: {
        icon: L.icon({
          iconSize: [this.iconSizeX, this.iconSizeY],
          iconAnchor: [this.iconSizeX / 2, this.iconSizeY],
          iconUrl: '../assets/gpspoint/diemdi.png',
          popupAnchor: [0, -this.iconSizeY],
        }),
      },
      rectangle: { showArea: false }, // disable showArea
      circlemarker: false,
    },
    edit: {
      featureGroup: this.drawnItems,
    },
  };

  ngOnInit() {
    for (let i = 0; i <= 20; i++) {
      let t = Math.random() - 0.5;
      this.route.push([21 - (2 * i * t * t) / 10, 105.8 + (i * t) / 10]);
    }
  }

  onMapReady(m: L.Map){
    console.log(m);
    this.map = m;
  } 

  onDrawCreated(e: any) {
    let marker;
    let polyline;
    let polygon;
    let circle;
    let rectangle;
    switch (e.layerType) {
      case 'marker':
        e.layer.options.draggable = true;
        marker = e.layer
          .bindTooltip('Tool tip!')
          .bindPopup('Pup op!')
          .on('dblclick', (evt) => {
            console.log(evt);
            marker.remove();
            this.drawnItems.removeLayer(marker);
          })
          .on('move', (evt) => {
            marker.setTooltipContent('Coordinate: ' + evt.target._latlng);
          })
          .on('click', (evt) => {
            marker.setIcon(
              L.icon({
                iconUrl: '../../assets/gpspoint/diemden.png',
                iconSize: [this.iconSizeX, this.iconSizeY],
                iconAnchor: [this.iconSizeX / 2, this.iconSizeY],
                popupAnchor: [0, -this.iconSizeY],
              })
            );
          });
        break;

      case 'polyline':
        console.log(e);
        polyline = e.layer
          .on('mouseover', (evt) => {
            polyline.setStyle({ color: 'red' });
          })
          .on('mouseout', (evt) => {
            polyline.setStyle({ color: '#3388ff' });
          });
        break;

      case 'polygon':
        console.log(e);
        polygon = e.layer
          .on('mouseover', (evt) => {
            polygon.setStyle({ color: 'red' });
          })
          .on('mouseout', (evt) => {
            polygon.setStyle({ color: '#3388ff' });
          });
        break;

      case 'circle':
        console.log(e);
        circle = e.layer
          .on('mouseover', (evt) => {
            circle.setStyle({ color: 'red' });
          })
          .on('mouseout', (evt) => {
            circle.setStyle({ color: '#3388ff' });
          });
        break;

      case 'rectangle':
        console.log(e);
        rectangle = e.layer
          .on('mouseover', (evt) => {
            rectangle.setStyle({ color: 'red' });
          })
          .on('mouseout', (evt) => {
            rectangle.setStyle({ color: '#3388ff' });
          });
        break;

      default:
        break;
    }

    this.drawnItems.addLayer((e as L.DrawEvents.Created).layer);
  }

  onDrawEdited(e) {
    console.log(e);
  }

  onStartRoute() {
    
    //this.drawnItems.clearLayers();

    let firstMarker = null;
    let i = 0;
    let point = this.route[i++];
    firstMarker = L.marker(point, {
      icon: L.icon({
        iconSize: [this.iconSizeX, this.iconSizeY],
        iconAnchor: [this.iconSizeX / 2, this.iconSizeY],
        iconUrl: '../assets/gpspoint/diemdi.png',
        popupAnchor: [0, -this.iconSizeY],
      }),
    })
      .bindTooltip('Tool tip!')
      .bindPopup('Pup op!')
      .on('dblclick', (evt) => {
        console.log(evt);
        firstMarker.remove();
        this.drawnItems.removeLayer(firstMarker);
      });
    this.routeLayer.push(firstMarker);
    this.drawnItems.addLayer(firstMarker);

    //start move
    let interval = setInterval(() => {
      point = this.route[i++];
      let polyline = L.polyline([
        [firstMarker._latlng.lat, firstMarker._latlng.lng],
        [point[0], point[1]],
      ])
        .on('mouseover', (evt) => {
          polyline.setStyle({ color: 'red' });
        })
        .on('mouseout', (evt) => {
          polyline.setStyle({ color: '#3388ff' });
        });
        
      this.map.panTo([point[0], point[1]])
      firstMarker.setTooltipContent('Coordinate: ' + point).openTooltip();
      firstMarker.setLatLng([point[0], point[1]]);

      this.drawnItems.addLayer(polyline);
      this.drawnItems.addLayer(firstMarker);
      if (i == this.route.length - 1) {
        firstMarker.setIcon(
          L.icon({
            iconUrl: '../../assets/gpspoint/diemden.png',
            iconSize: [this.iconSizeX, this.iconSizeY],
            iconAnchor: [this.iconSizeX / 2, this.iconSizeY],
            popupAnchor: [0, -this.iconSizeY],
          })
        );
        this.isDrawing = false;
        clearInterval(interval);
      }
    }, 1000);
  }
}
