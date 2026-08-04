const mongoose = require('mongoose');

const uri = "mongodb+srv://savansarliya81_db_user:S7QzeX2F9ImUaehQ@cluster0.rtaqsae.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS! The connection string works perfectly!");
    process.exit(0);
  })
  .catch(err => {
    console.log("ERROR! Failed to connect:", err.message);
    process.exit(1);
  });
