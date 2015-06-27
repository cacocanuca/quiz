var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizesId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
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
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
  }).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
      resultado ='Correcto';
    }
    res.render('quizes/answer',
    { quiz: req.quiz,
      respuesta: resultado,
      errors: []
    }
  );
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(  //crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta", tema:""}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  console.log('Creando nuevo registro: '+ req.body.quiz.pregunta + ' ' + req.body.quiz.respuesta + ' ' + req.body.quiz.tema);
  var quiz = models.Quiz.build( req.body.quiz );
  quiz
  .validate()
  .then(
    function(err) {
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz    // save: guarda en DB los campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then(function(){ res.redirect('/quizes');})
      } // res.redirect: Redirección HTTP (URL relativo) lista de preguntas
    }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; // autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
  req.quiz
  .validate()
  .then(
    function(err) {
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz    // save: guarda en DB los campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then(function(){ res.redirect('/quizes');})
      }   // res.redirect: Redirección HTTP (URL relativo) lista de preguntas
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
