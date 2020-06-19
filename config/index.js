module.exports = {
    secret_key : process.env.NODE_ENV === 'production' ? process.env.SECRET_KEY : 'secret_key'
}