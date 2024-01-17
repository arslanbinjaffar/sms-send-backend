import csv from 'csv-parser';
import fs from 'fs';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { Messages } from './../models/Message.js';
import axios from 'axios';
import { URLSearchParams } from 'url';
/**
 * @param Request {req}
 * @param Response {res}
 */

const processCSVData = async (results) => {
  const newResults = results.map(result => ({
    ...result,
    id: uuidv4(),
  }));
  const groups = [];
  const groupSize = 900;

  for (let i = 0; i < newResults.length; i += groupSize) {
    const groupArr = newResults.slice(i, i + groupSize);
    groups.push({ users: groupArr });
  }
  const userMessage = await Messages.insertMany(groups);
  return userMessage;
};

export const fetchDataAndProcess = async (req, res) => {
  try {
    const { url } = req.body;
    const response = await axios.get(url);
    const results = [];

    if (!response.data) {
      throw new Error("Empty response data");
    }

    const dataString = response.data.toString('utf-8');

    const parser = csv({ headers: false, skip_empty_lines: true });

    parser
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          if (results.length === 0) {
            throw new Error("Empty file");
          }

          await Messages.init();
          console.log('Indexes created successfully');

          const userMessage = await processCSVData(results);
          res.status(200).json({ message: "successfully", results: userMessage });
        } catch (err) {
          console.error('Error in processing:', err);
          res.status(500).json({ message: `Error fetching and processing data: ${err.message}` });
        }
      })
      .on('error', (error) => {
        console.error(error);
        res.status(500).json({ message: `Error fetching and processing data: ${error.message}` });
      });

    parser.write(dataString);
    parser.end();
  } catch (error) {
    res.status(500).json({ message: `Error fetching and processing data: ${error.message}` });
  }
};





export const getGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    // Calculate the skip value based on the page number and limit
    const skip = (page - 1) * limit;

    // Fetch the total count of documents in the collection
    const totalDocuments = await Messages.countDocuments({});

    const existingData = await Messages.find({})
      .skip(skip)
      .limit(limit);
  console.log(existingData)
    if (!existingData || existingData.length === 0) {
      return res.status(404).json({ message: "There is no existing data" });
    }

    return res.status(200).json({
      message: "Successfully get Groups",
      results: existingData,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const sendBulkMessage = async (req,res) => {
    try {
      let recipients = "";
      const { data, message } = req.body
      data.users.forEach((item) => {
        if (item['2'] !== "Phone") {
          let cleanedPhone = item['2'].replace(/[()-\s]/g, '');
      
          if (cleanedPhone.startsWith("+1")) {
            cleanedPhone = cleanedPhone.slice(2);
          }
      
          recipients += `+1${cleanedPhone}:${item.id},`;
        } else if (item['2'].startsWith("+1")) {
          console.log(item.phone);
        }
      });
      // console.log(data)
      // console.log(recipients,"recip")
      // const recipients = `+923178114799:${},+923158641909:${uuidv4()},+923166289254:${uuidv4()}`
      // console.log(recipients)
        const encodedParams = new URLSearchParams();
        encodedParams.set('recipients',recipients);
        encodedParams.set('template', message);
        encodedParams.set('sender_id', '800');
        // const filePath = 'recipents.txt';
        //   const content = recipients;

          // fs.writeFile(filePath, content, (err) => {
          //   if (err) {
          //     console.error('Error writing to file:', err);
          //   } else {
          //     console.log('File has been written successfully!');
          //   }
          // });
        const options = {  
          method: 'POST',
          url: 'https://rest-ww.telesign.com/v1/verify/bulk_sms',
          headers: {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
            authorization: 'Basic QUQwRkEzRkQtRUJBMy00NjIyLUEyQjAtRjA1OUUxMkZGRTgwOmpBR2pXQ09XK2RpL1ZIUHhKT0E4UzkwRTR0SXEwRm42KzRQNk5SclhreGNuZzNkcGtnOGhwdFVqNnoxTnkwMW42Vm92VGhiTFJFNkdWNlFhMFpxT0hRPT0='
          },
          data: encodedParams,
        };
        
        axios
          .request(options)
          .then(function (response) {
            const responseData = {
              status: response.status,
              data: response.data,
            };
            res.status(200).json({ results: responseData });

        console.log(response.data);
          })
          .catch(function (error) {
            const errorData = {
              status: error.response ? error.response.status : undefined,
              data: error.response ? error.response.data : undefined,
            };
            res.status(404).json({ results: errorData });
          });
    }
    catch (err){
      console.log(err)
      return res.status(500).json({error:err.message})
    }
}

// export const uploadFile = async (req,res) => {
//   if (!req.file) {
//     return res.status(404).json(({message:"file not uploaded"}))
//   }
//   try {
//       const fileBuffer = req.file.buffer;
  
//       if (!fileBuffer || fileBuffer.length === 0) {
//         throw new Error("Empty file");
//       }
  
//       const fileContent = fileBuffer.toString('utf-8');
  
//       const processedData = await processCSVChunk(fileContent);
  
//       await Messages.insertMany(processedData);
  
//       res.status(200).json({ message: 'successfully', results: processedData });
  
    
//   } catch (error) {
//     console.error('Error processing uploaded file:', error);
//     res.status(500).json({ message: `Error processing uploaded file: ${error.message}` });
//   }
// }
// async function processCSVChunk (chunk){
//   return new Promise((resolve, reject) => {
//     Papa.parse(chunk, {
//       header: false,
//       skipEmptyLines: true,
//       complete: (results) => {
//         const processedData = results.data.map((result) => ({
//           id: uuidv4(),
//           // Map other fields from your CSV file
//           // Example: field1: result[0], field2: result[1], ...
//         }));
//         resolve(processedData);
//       },
//       error: (error) => {
//         reject(error);
//       },
//     });
//   });
// };

// exports.sendMessage = async(req,res) => {
//     try {
//         const numbers = ["13236062770", "13236042424", "13239260429"];
//         await Promise.all(numbers.map((num) =>messageSender(num)))
//         console.log(numbers);
//         res.status(200).json({ success: true, message: 'Messages sent successfully' });
//     } catch (error) {
        
//     }
// }

// exports.bulkMessage = async (req,res) => {
//     try {
//         let recipients = ""
//         const data = await Messages.findOne({ _id: "6596a9bb8b3b76e8631b8b68" })
//         data.users.forEach(({ Phone, id }) => {
//             const cleanedPhone = Phone.replace(/[()-]/g,'');
//             recipients += `+1${cleanedPhone}:${id},`;
//         });
//         console.log(recipients);
//         // recipients:"+13236062770:255E3E34382C0E049046BF14FF7F3435,+13236042424:255DEBF29DA410049042F97AF48F3D04,+13239260429:255DEBF22121212asas9DA410049042F97AF48F3D04,+13106067603:255DEBF29DA410049042F97AF48F3D04767776767yugug,13196967603:255DEBF29DA410049042F97AF48F3D04khjhkjhkhh",
//         // const numbers = ["13236062770", "13236042424", "13239260429"];

//         sdk.auth('AD0FA3FD-EBA3-4622-A2B0-F059E12FFE80', 'jAGjWCOW+di/VHPxJOA8S90E4tIq0Fn6+4P6NRrXkxcng3dpkg8hptUj6z1Ny01n6VovThbLRE6GV6Qa0ZqOHQ==');
//                 sdk.sendBulkSMS({
//             recipients:recipients,
//         template:'New Year New Me Grow your Hair Faster And Longer w/ code (healthy hair) 35% off @ ckout Shop Now http://hairspala.com Reply STOP to Stop'
// })
//             .then(({ data }) => {
//       res.status(200).json({message:data})
//   })
//             .catch(err =>
//             {
//                 res.status(404).json({ message: err })
//             }
//     );
//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
// }




// const processCSVDataByBoy = async (results) => {
//     const newResults = results.map(result => ({
//         ...result,
//         id: uuidv4(),
//     }));

//     const groups = [];
//     const groupSize = 1000;

//     for (let i = 0; i < newResults.length; i += groupSize) {
//         const groupArr = newResults.slice(i, i + groupSize);
//         groups.push({ users: groupArr });
//     }

//     const userMessage = await Messages.insertMany(groups);
//     return userMessage;
// };

// const express = require('express');


// const processPapaCSVData = async (results) => {
//     const newResults = results.map(result => ({
//         ...result,
//         id: uuidv4(),
//     }));

//     const groups = [];
//     const groupSize = 1000;

//     for (let i = 0; i < newResults.length; i += groupSize) {
//         const groupArr = newResults.slice(i, i + groupSize);
//         groups.push({ users: groupArr });
//     }
//     const userMessage = await Messages.insertMany(groups);
//     return userMessage;
// };

// exports.uploadGroups=(req, res) => {
//     try {
//         if (!req.files || Object.keys(req.files).length === 0) {
//             return res.status(400).send('No file uploaded.');
//         }

//         const file = req.files.file;

//         if (file.mimetype !== 'text/csv') {
//             return res.status(400).send('File format must be CSV.');
//         }

//         const fileBuffer = file.data;

//         Papa.parse(fileBuffer.toString(), {
//             complete: async (parsedResult) => {
//                 const results = parsedResult.data;

//                 if (results.length === 0) {
//                     return res.status(404).json({ message: 'Empty file' });
//                 }

//                 // Your MongoDB or processing logic here
//                 await Messages.init().then(() => {
//                     console.log('Indexes created successfully');
//                 }).catch(err => {
//                     console.error('Error creating indexes:', err);
//                 });

//                 const userMessage = await processPapaCSVData(results);
//                 res.status(200).json({ success: true, results: userMessage, message: 'Groups added successfully' });
//             },
//             header: true
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }



// const options = {
//   method: 'POST',
//   url: 'https://rest-ww.telesign.com/v1/verify/bulk_sms',
//   headers: {
//     accept: 'application/json',
//     'content-type': 'application/x-www-form-urlencoded',
//     authorization: 'Basic QUQwRkEzRkQtRUJBMy00NjIyLUEyQjAtRjA1OUUxMkZGRTgwOmpBR2pXQ09XK2RpL1ZIUHhKT0E4UzkwRTR0SXEwRm42KzRQNk5SclhreGNuZzNkcGtnOGhwdFVqNnoxTnkwMW42Vm92VGhiTFJFNkdWNlFhMFpxT0hRPT0='
//   }
// };

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });
//         sdk.auth('AD0FA3FD-EBA3-4622-A2B0-F059E12FFE80', 'jAGjWCOW+di/VHPxJOA8S90E4tIq0Fn6+4P6NRrXkxcng3dpkg8hptUj6z1Ny01n6VovThbLRE6GV6Qa0ZqOHQ==');
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
        







const processCSVParserData = async (results) => {
  const newResults = results.map(result => ({
    ...result,
    id: uuidv4(),
  }));

  const groups = [];
  const groupSize =900;

  for (let i = 0; i < newResults.length; i += groupSize) {
    const groupArr = newResults.slice(i, i + groupSize);
    groups.push({ users: groupArr });
  }

  const userMessage = await Messages.insertMany(groups);
  return userMessage;
};


export const uploadGroups = async(req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    await Messages.deleteMany()

    const file = req.file;

    if (file.mimetype !== 'text/csv') {
      return res.status(400).send('File format must be CSV.');
    }

    const filePath = file.path;

    const results = [];
    const parser = csv({ headers: false });

    const readStream = fs.createReadStream(filePath);

    readStream
      .pipe(parser)
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        if (results.length === 0) {
          return res.status(404).json({ message: 'Empty file' });
        }

        try {
          await Messages.init().then(() => {
            console.log('Indexes created successfully');
          }).catch(err => {
            console.error('Error creating indexes:', err);
          });

          const userMessage = await processCSVParserData(results);
          res.status(200).json({ success: true, results: userMessage, message: 'Groups added successfully' });
        } catch (error) {
          console.error('Error processing CSV data:', error);
          res.status(500).json({ error: error.message });
        }
      })
      .on('error', (error) => {
        console.error('Error parsing CSV file:', error);
        res.status(500).json({ error: error.message });
      });

  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: error.message });
  }
};

