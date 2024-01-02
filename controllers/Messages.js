const csv = require('csv-parser');
const fs = require('fs');
const { Messages } = require('../models/Message');
const { v4: uuidv4 } = require('uuid');
const sdk = require('api')('@telesign-enterprise/v1.0#2ktvwloivj98o');

const processCSVData = async (results) => {
    console.log("Extracted data");

    const newResults = results.map(result => ({
        ...result,
        id: uuidv4(),
    }));

    const groups = [];
    const groupSize = 50000;

    for (let i = 0; i < newResults.length; i += groupSize) {
        const groupArr = newResults.slice(i, i + groupSize);
        groups.push({ users: groupArr });
    }

    const deleteMessage = await Messages.deleteMany();
    const userMessage = await Messages.insertMany(groups);

    return userMessage;
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        if (req.file.mimetype !== "text/csv") {
            return res.status(400).send('File format must be CSV.');
        }
        const results = [];
        const fileData = fs.createReadStream(req.file.path);

        fileData.pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async () => {
                if (results.length === 0) {
                    return res.status(404).json({ message: "Empty file" });
                }

                const userMessage = await processCSVData(results);

                res.status(200).json({ success: true, results: userMessage, message: 'Groups added successfully' });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.sendMessage = async (req,res) => {
    try {
        let recipients=""
        const { data, message } = req.body
        console.log(message)
        data.users.forEach(({ Phone, id }) => {
            const cleanedPhone = Phone.replace(/[()-]/g,'');
            recipients += `${cleanedPhone}:${id}`;
        });
        sdk.auth('AD0FA3FD-EBA3-4622-A2B0-F059E12FFE80', 'jAGjWCOW+di/VHPxJOA8S90E4tIq0Fn6+4P6NRrXkxcng3dpkg8hptUj6z1Ny01n6VovThbLRE6GV6Qa0ZqOHQ==');
        sdk.sendBulkSMS({
        recipients:recipients,
        template:message
})
            .then(({ data }) => {
      res.status(200).json({message:data})
  })
            .catch(err =>
            {    
                res.status(404).json({ message: err })
            }        
    );
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}



