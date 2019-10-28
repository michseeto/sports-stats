require('dotenv').config();
const express = require('express');
const cors = require('cors');
const netballRouter = require('./routes/netball');
const app = express();

app.use(cors());
app.use("/stats/netball", netballRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;