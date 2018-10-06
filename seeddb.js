var mongoose = require("mongoose");
var Toursite = require("./models/toursite");
var Comment   = require("./models/comment");

var data = [
    {
      name:"Roraima",
      image:"http://miriadna.com/desctopwalls/images/max/Mount-Roraima.jpg",
      description: "En el sector Oriental del parque nacional Canaima, en medio de la región conocida como la \"Gran Sabana\", se encuentra el tepuy más alto de todos: El Roraima. El monte Roraima se encuentra en el Escudo guayanés, en la esquina sureste del venezolano Parque nacional Canaima (de 30 000 km²), siendo el pico más alto de la cordillera de las Tierras Altas de Guyana. Las cimas de las mesetas del parque se consideran algunas de las formaciones geológicas más antiguas de la Tierra, que se remontan a unos dos mil millones de años, en el Precámbrico. En el Tepuy se encuentra el punto más alto del estado brasileño de Roraima. El punto más alto de la montaña es \"El Maverick\", de 2810 m, en el extremo sur de la meseta y totalmente dentro de Venezuela. "
    },
    {
        name: "Salto Ángel",
        image: "https://es.best-wallpaper.net/wallpaper/m/1402/South-America-Venezuela-Canaima-National-Park-waterfall-Angel-Falls_m.jpg",
        description: "El Salto del Ángel está situado en las tierras altas de Guayana, una de las cinco regiones de Venezuela. El agua viene una caída libre desde unos 979 metros del río Churum rondando el borde de la \"Auyantepuy\", considerado el Tepuy más grande de estas históricas formaciones rocosas,esta altura la convierte en la catarata más alta del mundo."
    },
    {
        name: "Gran Sabana",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Quebrada_del_Jaspe-La_Gran_Sabana-Venezuela07.JPG",
        description: "La Gran Sabana está dentro del parque Nacional Canaima, al Sur de Venezuela, en el Estado Bolívar. Es uno de los mayores atractivos turísticos del país, con vistas solo no consiguen en este lugar del mundo."
    }
]

function seedDB(){
   //Remove all campgrounds
   Toursite.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed toursites!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Toursite.create(seed, function(err, toursite){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("toursite created!");
                        //create a comment
                        Comment.create(
                            {
                                text: "Este sitio es estupendo, pero me encantaría que hubiese Internet.",
                                author: "Homero"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    toursite.comments.push(comment);
                                    toursite.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
    //add a few comments
}
// Toursite.create({
//   name:"Roraima",
//   image:"http://miriadna.com/desctopwalls/images/max/Mount-Roraima.jpg",
//   description: "En el sector Oriental del parque nacional Canaima, en medio de la región conocida como la \"Gran Sabana\", se encuentra el tepuy más alto de todos: El Roraima."
// }, function(err, toursite) {
//   if(err){
//     console.log(err);
//   } else {
//     console.log("New Toursite!");
//     console.log(toursite);
//   }
// });

module.exports = seedDB;
