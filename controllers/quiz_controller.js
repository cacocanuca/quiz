var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizesId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz =quiz;
        next();
      } else { next(new Error('No existe quizId = ' + quizId));}
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  // Si existe query en la ruta, define una variable search con ella, incluyendo '%' al principio, al final y reemplazando los espacios en blanco
  // var search = (req.query.search)? '%' + req.query.search.replace(/ +/g,'%') + '%' : req.query.search;
  // Busca preguntas que contengan la variable search, ordenadas alfabeticamente
  // Mi primera versión:
  // models.Quiz.findAll({where: {pregunta: {like :search}}, order:['pregunta']}).then(
  // Otro participante en el curso lo hace así:
  // models.Quiz.findAll({where:["pregunta like ?", search], order: 'pregunta ASC'}).then(
  models.Quiz.findAll({ order: 'pregunta' }).then(
    function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes});
  }).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
      resultado ='Correcto';
    }
    res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(  //crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  // guaarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    console.log(quiz);
    res.redirect('/quizes');
  })  // Redirección HTTP (URL relativo) lista de preguntas
};
