const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

module.exports = { config: {
		      name: "تقرير",
		      version: "1.7",
		      author: "NTKhang", // تعريب: محمد تانجيرو \\
		      countDown: 5,
		      role: 0,
		      description: { ar: "إرسال تقرير (حول الأخطاء أو أفكار جديدة أو كيفية استخدام أمر) للمطور"},
		      category: "contacts admin",
		      guide: { ar: "{pn} [محتوى الرسالة]"}
                           },

	langs: { ar: { missingMessage: "🌹 أدخل الࢪسالة التي تࢪيد\nإࢪسالها للمطوࢪ بعد الأمࢪ ✅\n",
		       sendByGroup: "    • اسم وآيدي المجموعة:\n%1\nا[ %2 ]ا\n\n",
		       sendByUser: "• تم إࢪسال التقࢪيࢪ من الخاص\n\n",
		       content: "༺<|[ محتوى الࢪسالة ]| >༻\nا⊱━━━━⊰  🌹  ⊱━━━━⊰ا\n\n%1\n\nا⊱━━━━⊰  🌹  ⊱━━━━⊰ا\n  🌹 ࢪد عـلـى هـذه الـࢪسـالـة\n لإࢪسال ࢪدڪ إلى المࢪسل ✅",
		       success: "✅ تـم إࢪسـال تقـࢪيـࢪڪ إلـى:\n%2",
		       failed: "An error occurred while sending your message to %1 admin\n%2\nCheck console for more details",
		       reply: "📍 Reply from admin %1:\n─────────────────\n%2\n─────────────────\nReply this message to continue send message to admin",
		       replySuccess: "Sent your reply to admin successfully!",
		       feedback: "📝 Feedback from user %1:\n- User ID: %2%3\n\nContent:\n─────────────────\n%4\n─────────────────\nReply this message to send message to user",
		       replyUserSuccess: "Sent your reply to user successfully!",
		       noAdmin: "Bot has no admin at the moment"
	      }      },

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		const { config } = global.GoatBot;
		if (!args[0])
			return message.reply(getLang("missingMessage"));
		const { senderID, threadID, isGroup } = event;
		if (config.adminBot.length == 0)
			return message.reply(getLang("noAdmin"));
		const senderName = await usersData.getName(senderID);
		const msg = "༺<✅|[  تـقࢪيــࢪ  ]| ✅>༻\n"
			+ `      • اسم وآيدي المرسل:\n${senderName}\nا[ ${senderID} ]ا`
			+ (isGroup ? getLang("sendByGroup", (await threadsData.get(threadID)).threadName, threadID) : getLang("sendByUser"));

		const formMessage = {
			body: msg + getLang("content", args.join(" ")),
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		const successIDs = [];
		const failedIDs = [];
		const adminNames = await Promise.all(config.adminBot.map(async item => ({
			id: item,
			name: await usersData.getName(item)
		})));

		for (const uid of config.adminBot) {
			try {
				const messageSend = await api.sendMessage(formMessage, uid);
				successIDs.push(uid);
				global.GoatBot.onReply.set(messageSend.messageID, {
					commandName,
					messageID: messageSend.messageID,
					threadID,
					messageIDSender: event.messageID,
					type: "userCallAdmin"
				});
			}
			catch (err) {
				failedIDs.push({
					adminID: uid,
					error: err
				});
			}
		}

		let msg2 = "";
		if (successIDs.length > 0)
			msg2 += getLang("success", successIDs.length,
				adminNames.filter(item => successIDs.includes(item.id)).map(item => `المطوࢪ: ${item.name}\nآيدي: ${item.id}`).join("\n")
			);
		if (failedIDs.length > 0) {
			msg2 += getLang("failed", failedIDs.length,
				failedIDs.map(item => ` <@${item.adminID}> (${adminNames.find(item2 => item2.id == item.adminID)?.name || item.adminID})`).join("\n")
			);
			log.err("CALL ADMIN", failedIDs);
		}
		return message.reply({
			body: msg2,
			mentions: adminNames.map(item => ({
				id: item.id,
				tag: item.name
			}))
		});
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const { isGroup } = event;

		switch (type) {
			case "userCallAdmin": {
				const formMessage = {
					body: getLang("reply", senderName, args.join(" ")),
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err)
						return message.err(err);
					message.reply(getLang("replyUserSuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}
			case "adminReply": {
				let sendByGroup = "";
				if (isGroup) {
					const { threadName } = await api.getThreadInfo(event.threadID);
					sendByGroup = getLang("sendByGroup", threadName, event.threadID);
				}
				const formMessage = {
					body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err)
						return message.err(err);
					message.reply(getLang("replySuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
			default: {
				break;
			}
		}
	}
};
