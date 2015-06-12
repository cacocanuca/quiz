var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
//var url =  "postgres://cqvmmtffodjkha:g37kr28KZtOoD1u4ZRu_x8sfjT@ec2-54-83-57-86.compute-1.amazonaws.com:5432/dbru1ep7u7oaji"
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
    { dialect:  protocol,
      protocol: protocol,
      port:     port,
      host:     host,
      storage:  storage,  // solo SQLite (.env)
      omitNull: true      // solo Postgres
    }
);

// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; // exportar definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().success(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function(count) {
    if (count === 0) {  // la tabla se inicializa solo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                  })
      .success(function() {console.log('Base de datos inicializada')});
    };
  });
});
