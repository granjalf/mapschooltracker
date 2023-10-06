const Markers = [];
let currentMarker = 0;

function anim(){
  setTimeout(() => {
    if(currentMarker > 0 && currentMarker <= Markers.length){
      Markers[currentMarker-1].getElement().classList.remove("green-marker");
      Markers[currentMarker-1].getElement().classList.add("red-marker");
    } 

    if(currentMarker > 1){
      Markers[currentMarker-2].getElement().classList.remove("red-marker");
      Markers[currentMarker-2].getElement().classList.add("gray-marker");
    }

    if(currentMarker < Markers.length){
      Markers[currentMarker].getElement().classList.remove("gray-marker");
      Markers[currentMarker].getElement().classList.add("green-marker");
      map.flyTo({
        center: Markers[currentMarker]._lngLat,
        essential: true
      });
    }

    if(currentMarker > Markers.length){
      currentMarker = 0;
      return;
    }
    currentMarker++;
    anim();
  }, 1000);
}

function move(){
  currentMarker = 0;
  anim();
}
// Función para agregar un punto al mapa de forma asincrónica
async function addPointToMap(map, coordinates) {
    return new Promise((resolve) => {

      var markerElement = document.createElement('img');
      markerElement.classList.add("gray-marker");    
      
      let marker = new mapboxgl.Marker({
          element: markerElement
        }).setLngLat([coordinates.X_LONGITUD, coordinates.Y_LATITUD]);
      
      Markers.push(marker);
        
      resolve(marker.addTo(map));
    });
  }
  
  // Función para agregar todos los puntos al mapa de forma asincrónica
  async function addPointsToMapAsync(map) {
    schools.filter((e,i)=>e.DRE_UGEL === 'CUSCO').sort((a,b)=>{
      if (a.X_LONGITUD > b.X_LONGITUD && a.Y_LATITUD > b.Y_LATITUD) return 1;
      if (a.X_LONGITUD === b.X_LONGITUD && a.Y_LATITUD === b.Y_LATITUD) return 0;
      if (a.X_LONGITUD < b.X_LONGITUD && a.Y_LATITUD < b.Y_LATITUD) return -1;
    }).forEach(async (coordinates,i)=>{
      if(i>200)return;
        await addPointToMap(map, coordinates);
    });
    
  }

  
  
  // Inicializa tu mapa de Mapbox (asegúrate de configurar tu accessToken)
  mapboxgl.accessToken = '<your token here>';
  const map = new mapboxgl.Map({
    container: 'map', // ID del contenedor del mapa en tu HTML
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.97847999999993, -13.52180999999996], // Centro del mapa
    zoom: 14, // Zoom inicial
  });

  // Llama a la función para agregar puntos al mapa de forma asincrónica
  addPointsToMapAsync(map, schools)
    .then(() => {
      console.log('Todos los puntos se han agregado al mapa.');
    })
    .catch((error) => {
      console.error('Error:', error);
    });

