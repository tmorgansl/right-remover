import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

// import * as $ from 'jquery';
// import {clearAllProperties, clearProperty, getProperties} from "./storage";
//
// $(function() {
//   const refresh = async (): Promise<void> => {
//     $('#property-table').empty();
//     const propertyStore = await getProperties();
//     Object.keys(propertyStore).forEach(p => {
//       $('#property-table').append('<div id="property-'+p+'"><a href="'+propertyStore[p].url+'"><img height="40" src="'+ propertyStore[p].imgUrl +'" />'+propertyStore[p].address+'</a><button id="restore-'+p+'">restore</button></div>')
//       $('#restore-'+p).click(() => {
//         clearProperty(parseInt(p, 10)).then(() =>{
//           $('#property-'+p).remove();
//         });
//       })
//     });
//   };
//
//   refresh();
//
//   $('#clear').click(()=> {
//     clearAllProperties().then(() =>{
//       $('#property-table').empty();
//     });
//   });
// });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);





