var TeleSignSDK = require('telesignsdk');


const customerId = process.env.CUSTOMER_ID || "AD0FA3FD-EBA3-4622-A2B0-F059E12FFE80";
        const apiKey = process.env.API_KEY || "jAGjWCOW+di/VHPxJOA8S90E4tIq0Fn6+4P6NRrXkxcng3dpkg8hptUj6z1Ny01n6VovThbLRE6GV6Qa0ZqOHQ==";
        

        const message = "New Year New Me Grow your Hair Faster And Longer w/ code (healthy hair) 35% off @ ckout Shop Now http://hairspala.com Reply STOP to Stop";
        const messageType = "ARN";
        const sender_id='8000'
        
        const client = new TeleSignSDK(customerId, apiKey);
        
        function smsCallback(error, responseBody) {
            if (error === null) {
                console.log("\nResponse body:\n" + JSON.stringify(responseBody));
            } else {
                console.error("Unable to send SMS. Error:\n\n" + error);
            }
        }
        
exports.messageSender = async (phoneNumber) => {
            await client.sms.message(smsCallback, phoneNumber, message, messageType,sender_id);
        }