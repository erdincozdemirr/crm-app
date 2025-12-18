const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'orderId',
                as: 'order'
            });
            OrderItem.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product'
            });
        }
    }

    OrderItem.init(
        {
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'order_id'
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'product_id'
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            unitPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                field: 'unit_price'
            }
        },
        {
            sequelize,
            modelName: 'OrderItem',
            tableName: 'order_items',
            underscored: true
        }
    );

    return OrderItem;
};
