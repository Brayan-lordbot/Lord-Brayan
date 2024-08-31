module.exports = {
		config: {
				name: "generate",
			        alias:"gen",
				version: "1.0.0",
				role: 0,
				author: "deku",
				shortDescription: "Generate image",
				countDown: 0,
				category: "image",
				guide: {
						en: '{p}gen [prompt]'
				}
		},

		onStart: async function ({ api, event, args }) {
				const axios = require('axios');
				const fs = require('fs');
				const { Prodia } = require("prodia.js");

				let t = args.join(" ");
				if (!t) return api.sendMessage('𝐏𝐫𝐨𝐦𝐩𝐭 𝐦𝐢𝐬𝐬𝐢𝐧𝐠, 𝐩𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐨𝐧𝐞!', event.threadID, event.messageID);
				api.sendMessage('𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 𝐟𝐨𝐫 𝐬𝐨𝐦𝐞 𝐭𝐢𝐦𝐞, 𝐲𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐢𝐬 𝐛𝐞𝐢𝐧𝐠 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐞𝐝', event.threadID, event.messageID);

				try {
						const prodia = new Prodia("70b8b086-24d8-4b14-b870-39efe453e5d3");
						const bestModel = ["absolutereality_V16.safetensors [37db0fc3]", "absolutereality_v181.safetensors [3d9d4d2b]", "amIReal_V41.safetensors [0a8a2e61]", "ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]"];
						let url = [];
						let image = [];

						for (let i of bestModel) {
								const generate = await prodia.generateImage({
										prompt: t,
										model: i,
										negative_prompt: "BadDream, (UnrealisticDream:1.3)",
										sampler: "DPM++ SDE Karras",
										cfg_scale: 9,
										steps: 30,
										aspect_ratio: "portrait"
								});

								while (generate.status !== "succeeded" && generate.status !== "failed") {
										await new Promise(resolve => setTimeout(resolve, 250));
										const job = await prodia.getJob(generate.job);

										if (job.status === "succeeded") {
												url.push(job.imageUrl);
												break;
										}
								}
						}

						let c = 0;
						for (let urls of url) {
								c += 1;
								const pathh = __dirname + "/cache/generated-" + c + ".png";
								const response = await axios.get(urls, { responseType: "arraybuffer" });
								fs.writeFileSync(pathh, Buffer.from(response.data, "binary"));
								image.push(fs.createReadStream(pathh));
						}

						console.log('Downloaded');
						return api.sendMessage({ body: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐫𝐞𝐬𝐮𝐥𝐭, 𝐡𝐨𝐩𝐞 𝐲𝐨𝐮𝐫 𝐬𝐚𝐭𝐢𝐬𝐟𝐚𝐜𝐭𝐨𝐫𝐲", attachment: image }, event.threadID, event.messageID);
				} catch (e) {
						console.error("𝐒𝐨𝐫𝐫𝐲 𝐛𝐮𝐭 𝐭𝐡𝐞𝐫𝐞 𝐰𝐚𝐬 𝐚𝐧 𝐞𝐫𝐫𝐨𝐫 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐢𝐦𝐚𝐠𝐞 😥:", e.message);
						return api.sendMessage(e.message, event.threadID, event.messageID);
				}
		}
};
