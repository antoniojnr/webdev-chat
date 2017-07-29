module.exports = function (req, res, next) {
  res.sseSetup = function() {
    console.log("WTF?");
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
    });

    res.write("retry: 10000\n\n");
  }

  res.sseSend = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }

  next();
}
