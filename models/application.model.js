module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resumeUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    appliedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
    
  });

   // 👇 Define associations
  Application.associate = (models) => {
    Application.belongsTo(models.User, { foreignKey: 'userId' });
    Application.belongsTo(models.Job, { foreignKey: 'jobId' });

  };
  return Application;
};
