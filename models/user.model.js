const db = require('../models');
const Application = db.application;
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "user" }  // user or recruiter or admin
  });

 User.associate = (models) => {
    User.hasMany(models.Application, { foreignKey: 'userId' });
   

  };

  
  return User;
};
