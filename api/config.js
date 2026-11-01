const { getFirebaseConfig } = require('../lib/firebase-config');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const config = getFirebaseConfig();

  if (config.error) {
    return res.status(500).json({ error: config.error });
  }

  return res.status(200).json(config);
};
