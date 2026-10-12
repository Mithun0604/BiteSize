const { app, ensureDatabaseInitialized } = require('../server/app');

module.exports = async (req, res) => {
  await ensureDatabaseInitialized();
  return app(req, res);
};
