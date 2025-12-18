'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SystemLog extends Model {
        static associate(models) {
            // No direct associations needed yet
        }
    }
    SystemLog.init({
        level: DataTypes.STRING,
        message: DataTypes.TEXT,
        meta: DataTypes.JSONB,
        traceId: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'SystemLog',
    });
    return SystemLog;
};
