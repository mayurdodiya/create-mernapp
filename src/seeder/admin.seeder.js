const { ROLE } = require('../utils/enums');
const { User } = require('../models');
const config = require('../config/config');

// admin seeder. 
module.exports = adminSeeder = async () => {
  try {
    const adminExist = await User.findOne({ email: config.ADMIN.EMAIL });

    if (!adminExist) {
      await User.create({
        name: config.ADMIN.NAME,
        email: config.ADMIN.EMAIL,
        password: config.ADMIN.PASSWORD,
        role: ROLE.ADMIN,
      });
    }

    console.log('✅ Admin seeder run successfully...');
  } catch (error) {
    console.log('❌ Error from admin seeder :', error);
  }
};
