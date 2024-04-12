class apiResponse {
  constructor(statusCode, message, data, error = null) {
    (this.statusCode = statusCode),
      (this.message = message),
      (this.data = data),
      (this.error = error),
      (this.status = statusCode < 400);
  }
}

module.exports = apiResponse;
