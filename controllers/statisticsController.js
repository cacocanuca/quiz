var models = require('../models/models.js');

exports.show = function(req, res) {
  var stat = {};
  models.Quiz.findAll({
      include: [{ model: models.Comment}]
  }).then(function(quizes) {
    var numPregSin = 0;
    var numCom = 0;
    var i;
    for(i=0; i < quizes.length; i++) {
      if (quizes[i].Comments.length === 0) {
        numPregSin++;
      } else {
        numCom += quizes[i].Comments.length;
      };
    };
    stat.numPreg = quizes.length;
    stat.numCom = numCom;
    stat.numComPreg = (stat.numCom/stat.numPreg).toFixed(2);
    stat.numPregSinCom = numPregSin;
    stat.numPregConCom = stat.numPreg - stat.numPregSinCom;
    res.render('quizes/statistics', {stat: stat, errors: []});
  }).catch(function(error) { next(error);});
};
