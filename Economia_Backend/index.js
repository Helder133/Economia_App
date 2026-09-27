const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

const portfolioRoutes = require('./src/routes/portfolio.routes');

app.use(cors());

app.use(express.json());

app.use('/api/v1/portafolio', portfolioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor de Economía corriendo en http://localhost:${PORT}`);
});