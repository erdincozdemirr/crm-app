'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('etl_imports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            filename: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_content: {
                type: Sequelize.BLOB, // Maps to BYTEA in Postgres
                allowNull: false
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'PENDING'
            },
            processed_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            error_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('etl_imports');
    }
};
