module.exports = function(sequelize, DataTypes) {
  const Expense = sequelize.define("Expense", {
    item: {
      type: DataTypes.STRING,
      allowNull: false
    },

    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["wants", "needs", "savings"]]
      }
    }
  });

  Expense.associate = function(models) {
    Expense.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Expense;
};
