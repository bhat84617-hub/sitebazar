// Local development entry point
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SiteBazar backend running locally on http://localhost:${PORT}`));
