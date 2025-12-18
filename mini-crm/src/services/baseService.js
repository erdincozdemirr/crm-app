class BaseService {
    constructor(model) {
        this.model = model;
    }

    async findAll(where = {}) {
        return this.model.findAll({ where });
    }

    async findById(id) {
        return this.model.findByPk(id);
    }

    async create(data, options = {}) {
        return this.model.create(data, options);
    }

    async update(id, data) {
        const item = await this.findById(id);
        if (!item) return null;
        return item.update(data);
    }

    async delete(id) {
        const item = await this.findById(id);
        if (!item) return false;
        await item.destroy();
        return true;
    }
}

module.exports = BaseService;
