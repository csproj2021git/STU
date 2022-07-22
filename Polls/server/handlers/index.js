module.exports = {
    ...require('./auth'),
    ...require('./poll'),
    ...require('./env'),
}

module.exports.errors = (err, req, res, next) =>{
    res.status(err.status || 400).json({
        err: err.message || 'Somethin went wrong'
    })
}

module.exports.notFound = (req, res, next) => {
    const err = new Error('Not found')
    err.status = 404
    next(err)
}
