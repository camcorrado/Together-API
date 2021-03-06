const moment = require("moment");
const xss = require("xss");

const MessagesService = {
  getAllMessages(knex) {
    return knex.select("*").from("messages");
  },
  getById(knex, id) {
    return knex.from("messages").select("*").where("id", id).first();
  },
  getByConversationId(knex, id) {
    return knex.from("messages").select("*").where("conversation_id", id);
  },
  insertMessage(knex, newMessage) {
    return knex
      .insert(newMessage)
      .into("messages")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateMessage(knex, id, newMessageFields) {
    return knex("messages").where({ id }).update(newMessageFields);
  },
  serializeMessage(message) {
    return {
      id: message.id,
      conversation_id: message.conversation_id,
      user_id: message.user_id,
      content: xss(message.content),
      msg_read: message.msg_read,
      date_created: moment(message.date_created).format("ddd MMM DD YYYY LTS"),
    };
  },
};

module.exports = MessagesService;
