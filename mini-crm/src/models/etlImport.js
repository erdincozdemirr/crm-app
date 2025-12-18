const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EtlImport extends Model {
        static associate(models) {
            // No direct associations needed yet
        }
    }

    EtlImport.init(
        {
            filename: {
                type: DataTypes.STRING,
                allowNull: false
            },
            fileContent: {
                type: DataTypes.BLOB,
                allowNull: false,
                field: 'file_content'
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'PENDING' // PENDING, COMPLETED, FAILED
            },
            processedCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                field: 'processed_count'
            },
            errorCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                field: 'error_count'
            }
        },
        {
            sequelize,
            modelName: 'EtlImport',
            tableName: 'etl_imports',
            underscored: true
        }
    );

    return EtlImport;
};
