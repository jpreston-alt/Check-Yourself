module.exports = function (sequelize, DataTypes) {
    const Income = sequelize.define("Income", {

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },
    });

    Income.associate = function (models) {
        Income.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Income;
};