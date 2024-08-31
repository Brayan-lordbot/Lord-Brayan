const { GoatWrapper } = require('fca-liane-utils');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

module.exports = {
  config: {
    name: "replitstalk",
    alias: " repstak", 
    version: "1.0",
    author: "Eugene Aguilar",
    countDown: 5,
    role: 0,
    longDescription: "Get information about a replit user",
    category: "ai",
    guide: {
      en: "{pn} [username]"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const username = args.join(" ");

      if (!username) {
        return api.sendMessage(`𝐩𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐮𝐬𝐞𝐫 𝐧𝐚𝐦𝐞.`, event.threadID, event.messageID);
      }

      api.sendMessage(`𝐩𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭, 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐢𝐬 𝐛𝐞𝐢𝐧𝐠 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐞𝐝...`, event.threadID, event.messageID);

      const response = await axios.get(`https://hoanghao.me/api/replitinfo?username=${username}`);
      const title = response.data.title;
      const follower = response.data.followers;
      const following = response.data.following;
      const t = response.data.activeOnline;
      const l = response.data.lastOnlineHours;
      const avt = response.data.image;

      const imagePath = path.join(__dirname, `cache`, `replit.png`);
      const writer = fs.createWriteStream(imagePath);

      const avatarResponse = await axios.get(avt, { responseType: 'stream' });
      avatarResponse.data.pipe(writer);

      writer.on('finish', () => {
        api.sendMessage({
          body: `Name: ${title}\nFollowers: ${follower}\nFollowing: ${following}\nActive: ${t}\nLast Online: ${l}`,
          attachment: fs.createReadStream(imagePath),
        }, event.threadID, event.messageID);
      });
    } catch (error) {
      console.log(error);
      api.sendMessage(`Error fetching user info.`, event.threadID, event.messageID);
    }
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
