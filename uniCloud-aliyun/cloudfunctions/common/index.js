exports.response = {
  error(message) {
    return { code: 1, message, data: null };
  },
  success(data = null) {
    return { code: 0, message: "success", data };
  },
};
