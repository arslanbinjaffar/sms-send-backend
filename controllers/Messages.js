const csv = require('csv-parser');
const fs = require('fs');
const { Messages } = require('../models/Message');
const sdk = require('api')('@telesign-enterprise/v1.0#2ktvwloivj98o');

const { v4: uuidv4 } = require('uuid');
const {messageSender} =require("../messageSender")
const processCSVData = async (results) => {

    const newResults = results.map(result => ({
        ...result,
        id: uuidv4(),
    }));

    const groups = [];
    const groupSize = 1000;

    for (let i = 0; i < newResults.length; i += groupSize) {
        const groupArr = newResults.slice(i, i + groupSize);
        groups.push({ users: groupArr });
    }
    const userMessage = await Messages.insertMany(groups);
    return userMessage;
};

exports.uploadFile = async (req, res) => {
    try {
        const results = [];
        const fileData = fs.createReadStream(req.file.path);
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        if (req.file.mimetype !== "text/csv") {
            return res.status(400).send('File format must be CSV.');
        }
        fileData.pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async () => {
                if (results.length === 0) {
                    return res.status(404).json({ message: "Empty file" });
                }
                await Messages.init().then(() => {
                    console.log('Indexes created successfully');
                }).catch(err => {
                    console.error('Error creating indexes:', err);
                });
                const userMessage = await processCSVData(results);
                res.status(200).json({ success: true, results: userMessage, message: 'Groups added successfully' });
            });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGroups = async (req, res) => {
    try {
      const existingData = await Messages.find();
  
      if (!existingData || existingData.length === 0) {
        return res.status(404).json({ message: "No existing data" });
      }
  
      res.status(200).json({ results: existingData });
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 18) {
        res.status(500).json({ message: "MongoDB connection error" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
  
  

// exports.sendMessage = async (req,res) => {
//     try {
//         // let recipients = "";
//         // const { data, message } = req.body
//         // data.users.forEach(({ Phone, id }) => {
//         //     const cleanedPhone = Phone.replace(/[()-]/g, '');
//         //     recipients += `${cleanedPhone}:${id},`;
//         // });
//         // function () {
            
//         // }
//         sdk.auth('AD0FA3FD-EBA3-4622-A2B0-F059E12FFE80', 'jAGjWCOW+di/VHPxJOA8S90E4tIq0Fn6+4P6NRrXkxcng3dpkg8hptUj6z1Ny01n6VovThbLRE6GV6Qa0ZqOHQ==');
//         // 3236062770
//         // 3236042424
//         // 3239260429
//         // const numbers = ["3236062770", "3236042424","3239260429"];
//         const numbers=["923419789822","923166289254","92419789822"]
//         const results = [];
        
//         const smsPromises = numbers.map((num) => {
//           return sdk
//             .sendSMS({
//               is_primary: 'true',
//               sender_id: '8000',
//               phone_number: num,
//               message_type: 'ARN',
//               external_id: 'AD0FA3FD-EBA3-4622-A2B0-F059E12FFE80',
//               message: 'New Year New Me Grow your Hair Faster And Longer w/ code (healthy hair) 35% off @ ckout Shop Now http://hairspala.com Reply STOP to Stop',
//             })
//             .then(({ data }) => {
//               console.log(data);
//               results.push(data);
//             })
//             .catch((err) => {
//               console.error(err);
//               results.push({ error: err.message || err });
//             });
//         });
        
//         Promise.all(smsPromises)
//           .then(() => {
//             console.log(results, "before");
//             res.status(200).json({ results });
//             console.log(results, "after");
//           })
//           .catch((error) => {
//             console.error(error);
//             res.status(500).json({ error });
//           });
        
          
       
//     }
//     catch (err){
//         console.log(err)
//     }
// }

// exports.sendMessage = async(req,res) => {
//     try {
//         const numbers = ["13236062770", "13236042424", "13239260429"];
//         await Promise.all(numbers.map((num) =>messageSender(num)))
//         console.log(numbers);       
//         res.status(200).json({ success: true, message: 'Messages sent successfully' });
//     } catch (error) {
        
//     }
// }

exports.bulkMessage = async (req,res) => {
    try {
        let recipients = ""
        const data = await Messages.findOne({ _id: "6596a9bb8b3b76e8631b8b68" })
        data.users.forEach(({ Phone, id }) => {
            const cleanedPhone = Phone.replace(/[()-]/g,'');
            recipients += `+1${cleanedPhone}:${id},`;
        });
        console.log(recipients);
        // recipients:"+13236062770:255E3E34382C0E049046BF14FF7F3435,+13236042424:255DEBF29DA410049042F97AF48F3D04,+13239260429:255DEBF22121212asas9DA410049042F97AF48F3D04,+13106067603:255DEBF29DA410049042F97AF48F3D04767776767yugug,13196967603:255DEBF29DA410049042F97AF48F3D04khjhkjhkhh",
        // const numbers = ["13236062770", "13236042424", "13239260429"];

        sdk.auth('AD0FA3FD-EBA3-4622-A2B0-F059E12FFE80', 'jAGjWCOW+di/VHPxJOA8S90E4tIq0Fn6+4P6NRrXkxcng3dpkg8hptUj6z1Ny01n6VovThbLRE6GV6Qa0ZqOHQ==');
                sdk.sendBulkSMS({
            recipients:recipients,
        template:'New Year New Me Grow your Hair Faster And Longer w/ code (healthy hair) 35% off @ ckout Shop Now http://hairspala.com Reply STOP to Stop'
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