const Message = require("../models/Message");

exports.saveMessage = async (data) => {
  const message = await Message.create(data);
  return message;
};

exports.getChat = async (_id, lastSync) => {
  if (!(lastSync === "null")) {
    let conversation = await Message.find({
      $or: [{ senderId: _id }, { receiverId: _id }],
      createdAt: {
        $gte: lastSync,
      },
    }).lean();

    return conversation;
  } else {
    const data = await Message.findOne(
      {
        $or: [{ senderId: _id }, { receiverId: _id }],
      },
      "createdAt"
    ).sort({
      createdAt: -1,
    });

    if (!data) return [];

    let conversation = await Message.find({
      $or: [{ senderId: _id }, { receiverId: _id }],
      createdAt: {
        $gte: new Date(data.createdAt) - 5 * 24 * 60 * 60 * 1000,
      },
    }).lean();

    return conversation;
  }
};

exports.getChatList = async (_id) => {
  const chatList = await Message.aggregate([
    {
      $match: { $or: [{ senderId: _id }, { receiverId: _id }] },
    },
    {
      $project: {
        chatPartner: {
          $cond: [{ $eq: ["$senderId", _id] }, "$receiverId", "$senderId"],
        },
        content: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$chatPartner",
        lastMessage: { $first: "$content" },
        timestamp: { $first: "$createdAt" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: "$user._id",
        username: "$user.username",
        avatar: "$user.avatar",
        name: "$user.name",
        email: "$user.email",
        lastMessage: "$lastMessage",
        timestamp: "$timestamp",
      },
    },
  ]);
  return chatList;
};
