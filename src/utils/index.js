const validateEmail = (email) => {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return String(email).search(regex) != -1;
};
module.exports = { validateEmail };
