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

// sequelize.sync() Inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then (..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count) {
    if (count === 0) {  // la tabla se inicializa solo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma',
                    tema: 'Humanidades'
                  });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa',
                    tema: 'Humanidades'
                  });
      Quiz.create({ pregunta: 'Capital de Argentina',
                    respuesta: 'Buenos Aires',
                    tema: 'Humanidades'
                  });

      Quiz.create({ pregunta: 'Fórmula química del agua',
                    respuesta: 'H2O',
                    tema: 'Ciencia'
                  });
      Quiz.create({ pregunta: 'Número de lados de un pentágono (en letra)',
                    respuesta: 'cinco',
                    tema: 'Ciencia'
                  });
      Quiz.create({ pregunta: 'Planeta más próximo al Sol',
                    respuesta: 'Mercurio',
                    tema: 'Ciencia'
                  })

      .then(function() {console.log('Base de datos inicializada')});
    };
  });
});
