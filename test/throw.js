
'use strict'

const { test } = require('tap')
const beo = require('..')()

test('Should throw on unsupported method', t => {
  t.plan(1)
  try {
    beo.route({
      method: 'TROLL',
      url: '/',
      schema: {},
      handler: function (req, reply) {}
    })
    t.fail()
  } catch (e) {
    t.pass()
  }
})

test('Should throw on empty schema', t => {
  t.plan(1)
  try {
    beo.route({
      method: 'GET',
      url: '/',
      schema: {},
      handler: function (req, reply) {}
    })
    t.fail()
  } catch (e) {
    t.pass()
  }
})
