var express = require('express');
var router = express.Router();

var quizController = require ('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

router.get('/author', function(req,res){
  res.render('author', {errors: []});
});

// Autoload de comandos de :quizId
router.param('quizId', quizController.load);  // Autoload :quizId

// Definición de rutas de /quizes
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/quizes/new',                   quizController.new);
router.post('/quizes/create',               quizController.create);

module.exports = router;
