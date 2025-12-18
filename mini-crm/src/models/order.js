const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items'
      });
    }
  }

  Order.init(
    {
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id'
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING',
        allowNull: false
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'total_price'
      },
      shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'shipping_address'
      }
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      underscored: true
    }
  );

  return Order;
};
