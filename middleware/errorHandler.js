const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name} : ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).json({
    sucess: false,
    message: "Something went wrong",
    error: err.message,
  });

  // const defaultErrors = {
  //   statusCode: 500,
  //   message: err,
  // };

  // // missing field error
  // if (err.name === "ValidationError") {
  //   defaultErrors.statusCode = 400;
  //   defaultErrors.message = Object.values(err.errors)
  //     .map((item) => item.message)
  //     .join(",");
  // }

  // //  dupplicate error
  // if (err.code && err.code === 11000) {
  //   defaultErrors.statusCode = 400;
  //   defaultErrors.message = `${Object.keys(
  //     err.keyValue
  //   )} field has to be unique`;
  // }
  // res.status(defaultErrors.statusCode.json({ message: defaultErrors.message }));
};

module.exports = errorHandler;
