'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('..')
const {
  FST_ERR_CTP_ALREADY_PRESENT
} = require('../lib/errors')

test('should lowercase contentTypeParser names', async t => {
  t.plan(1)
  const fastify = Fastify()
  fastify.addContentTypeParser('text/html', function (req, done) {
    done()
  })
  try {
    fastify.addContentTypeParser('TEXT/html', function (req, done) {
      done()
    })
  } catch (err) {
    t.same(err.message, FST_ERR_CTP_ALREADY_PRESENT('text/html').message)
  }
})

test('should trim contentTypeParser names', async t => {
  t.plan(1)
  const fastify = Fastify()
  fastify.addContentTypeParser('text/html', function (req, done) {
    done()
  })
  try {
    fastify.addContentTypeParser('    text/html', function (req, done) {
      done()
    })
  } catch (err) {
    t.same(err.message, FST_ERR_CTP_ALREADY_PRESENT('text/html').message)
  }
})

test('should remove content-type for setErrorHandler', async t => {
  t.plan(8)
  let count = 0

  const fastify = Fastify()
  fastify.setErrorHandler(function (error, request, reply) {
    t.same(error.message, 'kaboom')
    t.same(reply.hasHeader('content-type'), false)
    reply.code(400).send({ foo: 'bar' })
  })
  fastify.addHook('onSend', async function (request, reply, payload) {
    count++
    t.same(typeof payload, 'string')
    switch (count) {
      case 1: {
        // should guess the correct content-type based on payload
        t.same(reply.getHeader('content-type'), 'text/plain; charset=utf-8')
        throw Error('kaboom')
      }
      case 2: {
        // should guess the correct content-type based on payload
        t.same(reply.getHeader('content-type'), 'application/json; charset=utf-8')
        return payload
      }
      default: {
        t.fail('should not reach')
      }
    }
  })
  fastify.get('/', function (request, reply) {
    reply.send('plain-text')
  })

  const { statusCode, body } = await fastify.inject({ method: 'GET', path: '/' })
  t.same(statusCode, 400)
  t.same(body, JSON.stringify({ foo: 'bar' }))
})
