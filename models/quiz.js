// Definición del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz', {
      pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Pregunta"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta respuesta"}}
      },
      tema: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {msg: "-> Falta seleccionar un tema"},
          isIn: {
            args: [['Otro', 'Humanidades', 'Ocio', 'Ciencia', 'Tecnologia' ]],
            msg: "-> Falta seleccionar un tema"
          }
        }
      }
  });
}
