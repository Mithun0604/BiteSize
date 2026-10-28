const { app, ensureDatabaseInitialized } = require('../server/app');

module.exports = async (req, res) => {
  // Vercel rewrites API and upload URLs to this single function. Restore the
  // original Express path from the rewrite query parameter before routing.
  const incomingUrl = new URL(req.url, 'http://localhost');
  const routedPath = incomingUrl.searchParams.get('path');
  if (routedPath) {
    incomingUrl.searchParams.delete('path');
    const query = incomingUrl.searchParams.toString();
    req.url = `/${routedPath}${query ? `?${query}` : ''}`;
  }

  await ensureDatabaseInitialized();
  return app(req, res);
};
