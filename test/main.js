var test = require('tape')
  , alertify = require('../')

test('setup', function(t) {
  var style = document.createElement('link')
  style.setAttribute('rel', 'stylesheet')
  style.setAttribute('href', 'themes/alertify.core.css')
  document.body.appendChild(style)
  t.end()
})

test('should have a log function', function(t) {
  t.plan(3)
  alertify.log('This is a log message', 'error', 700)
  alertify.transition.supported = false
  setTimeout(function() {
    var logs = document.querySelectorAll('.alertify-log')
    t.equal(logs.length, 1, 'should have a length of 1')
    var log = logs[0]
    t.ok(log, 'log should exist')
    setTimeout(function() {
      var log2 = $('.alertify-log.alertify-log-error')
      t.notOk(log2, 'log should no longer exist')
    }, 1000)
  }, 600)
})

test('should have a success function', function(t) {
  t.plan(3)
  alertify.success('This is a log message', 700)
  alertify.transition.supported = false
  setTimeout(function() {
    var logs = document.querySelectorAll('.alertify-log')
    t.equal(logs.length, 1, 'should have a length of 1')
    var log = logs[0]
    t.ok(log, 'log should exist')
    setTimeout(function() {
      var log2 = $('.alertify-log.alertify-log-success')
      t.notOk(log2, 'log should no longer exist')
    }, 1000)
  }, 600)
})

test('should have an error function', function(t) {
  t.plan(3)
  alertify.error('This is a log message', 700)
  alertify.transition.supported = false
  setTimeout(function() {
    var logs = document.querySelectorAll('.alertify-log')
    t.equal(logs.length, 1, 'should have a length of 1')
    var log = logs[0]
    t.ok(log, 'log should exist')
    setTimeout(function() {
      var log2 = $('.alertify-log.alertify-log-error')
      t.notOk(log2, 'log should no longer exist')
    }, 1000)
  }, 600)
})

test('should have an extend function', function(t) {
  t.plan(3)
  var type = 'biscuits'
  alertify.extend(type)('This is a log message', 700)
  alertify.transition.supported = false
  setTimeout(function() {
    var logs = document.querySelectorAll('.alertify-log')
    t.equal(logs.length, 1, 'should have a length of 1')
    var log = logs[0]
    t.ok(log, 'log should exist')
    setTimeout(function() {
      var log2 = $('.alertify-log.alertify-log-biscuits')
      t.notOk(log2, 'log should no longer exist')
    }, 1000)
  }, 600)
})

function $(id) {
  return document.querySelector(id)
}
