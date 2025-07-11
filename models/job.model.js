const db = require('../models');
const Application = db.application;
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('job', {
    title: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    salary: { type: DataTypes.FLOAT }
  });
// Job.hasMany(Application, { foreignKey: 'jobId' });
 Job.associate = (models) => {
    Job.hasMany(models.Application, { foreignKey: 'jobId' });
   

  };
  return Job;
};
