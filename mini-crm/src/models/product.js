const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.OrderItem, {
                foreignKey: 'productId',
                as: 'orderItems'
            });
        }
    }

    Product.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sku: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            stockQuantity: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
                field: 'stock_quantity'
            },
            isStockTracked: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
                field: 'is_stock_tracked'
            }
        },
        {
            sequelize,
            modelName: 'Product',
            tableName: 'products',
            underscored: true
        }
    );

    return Product;
};
