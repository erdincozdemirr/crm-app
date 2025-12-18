const { Customer, Sequelize } = require('../models');
const BaseService = require('./baseService');

class CustomerService extends BaseService {
  constructor() {
    super(Customer);
  }

  async findByPhoneOrEmail(phone, email) {
    const { Op } = Sequelize;
    const where = {};
    const conditions = [];

    if (phone) conditions.push({ phone });
    if (email) conditions.push({ email });

    if (conditions.length === 0) return null;

    where[Op.or] = conditions;
    return this.model.findOne({ where });
  }

  async findAll(query) {
    const { Op } = Sequelize;
    const { search } = query;
    const where = {};

    if (search) {
      where[Op.or] = [
        // Case-insensitive search for firstName and lastName
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        // Exact or partial match for phone
        { phone: { [Op.iLike]: `%${search}%` } },
        // Exact or partial match for email
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    return this.model.findAll({ where });
  }

  async createOrUpdate(data) {
    const existing = await this.findByPhoneOrEmail(data.phone, data.email);

    if (existing) {
      return existing.update(data);
    }

    return this.create(data);
  }
}

module.exports = new CustomerService();
