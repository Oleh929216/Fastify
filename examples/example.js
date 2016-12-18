'use strict'

const fastify = require('../fastify')()
const Promise = require('bluebird')

const schema = {
  out: {
    type: 'object',
    properties: {
      hello: {
        type: 'string'
      }
    }
  }
}

fastify
  .get('/', schema, function (req, reply) {
    reply.header('Content-Type', 'application/json').code(200)
    reply.send({ hello: 'world' })
  })
  .get('/promise', schema, function (req, reply) {
    const promise = new Promise(function (resolve, reject) {
      resolve({ hello: 'world' })
    })
    reply.header('content-type', 'application/json').code(200).send(promise)
  })
  .get('/stream', function (req, reply) {
    const fs = require('fs')
    const stream = fs.createReadStream(process.cwd() + '/examples/plugin.js', 'utf8')
    reply.code(200).send(stream)
  })
  .post('/', schema, function (req, reply) {
    reply.send(null, { hello: 'world' })
  })
  .head('/', {}, function (req, reply) {
    reply.send(null)
  })
  .delete('/', schema, function (req, reply) {
    reply.send(null, { hello: 'world' })
  })
  .patch('/', schema, function (req, reply) {
    reply.send(null, { hello: 'world' })
  })

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
