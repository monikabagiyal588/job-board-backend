const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);


db.job = require('./job.model')(sequelize, Sequelize);
db.application = require('./application.model')(sequelize, Sequelize);

// Associations
db.user.hasMany(db.job, { as: 'jobs', foreignKey: 'userId' });
db.job.belongsTo(db.user, { as: 'poster', foreignKey: 'userId' });

db.user.belongsToMany(db.job, {
  through: db.application,
  as: 'appliedJobs',
  foreignKey: 'userId'
});

db.job.belongsToMany(db.user, {
  through: db.application,
  as: 'applicants',
  foreignKey: 'jobId'
});

// 🔁 Associations
db.user.hasMany(db.application, { foreignKey: 'userId' });
db.application.belongsTo(db.user, { foreignKey: 'userId' });

db.job.hasMany(db.application, { foreignKey: 'jobId' });
db.application.belongsTo(db.job, { foreignKey: 'jobId' });
module.exports = db;