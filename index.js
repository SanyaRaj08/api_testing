const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');

const app = express();
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', carRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
