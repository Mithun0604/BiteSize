const { app, ensureDatabaseInitialized } = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ensureDatabaseInitialized();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` BiteSize Backend API running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
