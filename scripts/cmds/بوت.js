module.exports.config = {
                  name: "بوت",
                  version:"3.5.0", 
                  role: 0,
                  countdown: 5,
                  author: "محمد تانجيرو", 
                  description:{ ar : ""},
                  category: "تجارب", 
                  guide: { ar : "{pn}"}
                        };
module.exports.onStart = async function ({ api, event }) {
const first = `
██████╗░
██╔══██╗
██████╦╝
██╔══██╗
██████╦╝
╚═════╝░`;
const second = `
░█████╗░
██╔══██╗
██║░░██║
██║░░██║
╚█████╔╝
░╚════╝░`;
const third = `
████████╗
╚══██╔══╝
░░░██║░░░
░░░██║░░░
░░░██║░░░
░░░╚═╝░░░`;
const fourd = `
░█████╗░
██╔══██╗
███████║
██╔══██║
██║░░██║
╚═╝░░╚═╝`; 
const fifth = `
██╗░░██╗
██║░██╔╝
█████═╝░
██╔═██╗░
██║░╚██╗
╚═╝░░╚═╝`; 
const sixth = `
███╗░░██╗
████╗░██║
██╔██╗██║
██║╚████║
██║░╚███║
╚═╝░░╚══╝`;
const seventh = `
███████╗
██╔════╝
█████╗░░
██╔══╝░░
███████╗
╚══════╝`;
  { const Message1 = await api.sendMessage(first, event.threadID/*, event.messageID*/);
   
                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( second, Message.messageID, event.threadID);

                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( third, Message.messageID, event.threadID);

                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( first, Message.messageID, event.threadID);
   
                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( second, Message.messageID, event.threadID);

                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( first + "\n" + second + "\n" + third, Message.messageID, event.threadID)
  };

  { const Message2 = await api.sendMessage(fourd, event.threadID/*, event.messageID*/);

                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( fifth, Message.messageID, event.threadID);
                      
                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( fourd, Message.messageID, event.threadID);

                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( sixth, Message.messageID, event.threadID);

                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( seventh, Message.messageID, event.threadID);
  
                     await new Promise((resolve) => setTimeout(resolve, 3000));
                     await api.editMessage( fourd + "\n" + fifth + "\n" + fourd + "\n" + sixth + "\n" + seventh, Message.messageID, event.threadID);

  }                                                      }
