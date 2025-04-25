module.exports = {
  addConversationBySocket: (req, res, next) => {
    const path = req.path;
    const method = req.method;

    if (path.includes("/conversations") && method === "POST") {
      global.io.emit("conversations", {
        data: req.body,
      });
    }

    res.json(res.body);
  },
  updateConversationBySocket: (req, res, next) => {
    const path = req.path;
    const method = req.method;


    if (path.includes("/conversations") && method === "PATCH") {
      global.io.emit("conversations", {
        data: req.body,
      });
    }

    res.json(req.body);
  },
  addMessagesBySocket: (req, res, next) => {
    const path = req.path;
    const method = req.method;


    if (path.includes("/messages") && method === "POST") {
      global.io.emit("messages", {
        data: req.body,
      });
    }

    res.json(req.body);
  },
};
