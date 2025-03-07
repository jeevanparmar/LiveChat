const Messages = require("../model/messages");

module.exports.addMessage = async (req, res,) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      receiver: to,
    });

    if (data) return res.json({ msg: "Message added successfully.", message: message });
    else return res.json({ msg: "Failed to add message to the database" });
  }
  catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.status(200).json({
      msg: projectedMessages
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteMsg = async (req, res) => {
  try {
    const { to, from } = req.body;
    const dmsg = await Messages.deleteMany({
      users: {
        $all: [from, to],
      },
    })
    if (dmsg) {
      return res.status(200).json({
        message: "delete msg Done"
      }
      )
    }
    return res.json({
      message: "msg not found"
    })
  } catch (e) {
    return res.status(400).json({
      message: "error to delete msg"
    })
  }
}

// 
module.exports.ChatedUsers = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("Received userId:", userId);
    const chatedusers = await Messages.find(
      {
        users: { $in: [userId] },
      },
      { sender: 1, receiver: 1 }
    );

    const arrayOfUsers = chatedusers.map((user) =>
      user.sender.toString() === userId ? user.receiver.toString() : user.sender.toString()
    );

    const userFriends = [...new Set(arrayOfUsers)];

    return res.status(200).json({
      users: userFriends,
    });
  } catch (e) {
    console.error("Error occurred:", e.message);
    return res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
};
