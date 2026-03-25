'use strict';

const app = require('./app');

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`social-service listening on port ${PORT}`);
});
