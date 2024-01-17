import axios from "axios";
import { Messages } from "../models/Message.js";
async function processGroups(groups,message) {
  let results;
  for (const [index, item] of groups.entries()) {
    const users = await item.users;
    if (index === 0) {
      // For the first user, just add it to the array
      // singleGroups.push(...users);
      console.log("first group")
      results=await sendBulkMessage(users, message);

    } else if (index > 0) {
      // For subsequent users, wait for 60 seconds and then add them to the array
      await new Promise(resolve => {
        console.log("next group")
        setTimeout(resolve, 70000)
      });
      // singleGroups.push(...users);
      results=await sendBulkMessage(users, message);
    }

  }
  return results;
}

  async function sendMessagesOnebyOne(req,res) {
  try {
    // const message = " Year New Me Grow your Hair Faster And Longer w/ code (healthy hair)New 35% off @ ckout Shop Now http://hairspala.com Reply STOP to Stop";
    const { message } = req.body
    const startGroup = req.query.startGroup;
    const endGroup = req.query.endGroup;
    // Calculate the limit based on the range
    const limit = endGroup - startGroup;
    const groups = await Messages.find({}).skip(startGroup).limit(limit);
    const singleGroup = await processGroups(groups, message);
    res.status(200).json({message:"successfull sended"})
  } catch (error) {
    console.error("Error in sendMessagesOnebyOne:", error);
    res.status(500).json({error:error})
  }
}

export default sendMessagesOnebyOne;

async function sendBulkMessage(group, message) {
  let recipients = "";
  try{
  for (const item of group){
    if (item['2'] !== "Phone") {
      let cleanedPhone = item['2'].replace(/[()-\s]/g, '');
      if (cleanedPhone.startsWith("+1")) {
        cleanedPhone = cleanedPhone.slice(2);
      }
      recipients += `+1${cleanedPhone}:${item.id},`;
    } else if (item['2'].startsWith("+1")) {
      console.log(item['2']);
    }
    }
     const filePath = 'recipents.txt';
          const content = recipients;
          fs.writeFile(filePath, content, (err) => {
            if (err) {
              console.error('Error writing to file:', err);
            } else {
              console.log('File has been written successfully!');
            }
          });
    const encodedParams = new URLSearchParams();
    encodedParams.set('recipients',recipients);
    encodedParams.set('template', message);
    encodedParams.set('sender_id', '800');
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
      console.log(responseData)
       return responseData
    })
    .catch(function (error) {
      const errorData = {
        status: error.response ? error.response.status : undefined,
        data: error.response ? error.response.data : undefined,
      };
      return errorData
    });
}
  catch (err) {
    return err
}
}

