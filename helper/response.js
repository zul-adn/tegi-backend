
exports.success = {
    message: "Success"
}

exports.err = (payload) => {
    return {
        message: payload.msg,
    }
}
