var alertify = exports
  , debug = require('debug')('alertify')

var template = '<article class="alertify-log{{class}}">{{message}}</article>'

alertify.transition = undefined

alertify.container = undefined

alertify.extend = function(type) {
  if ('string' !== typeof type)
    throw new Error('type is required and must be a string')
  debug('extend:%s', type)
  return function(message, wait) {
    alertify.log(message, type, wait)
  }
}

function init() {
  debug('init')
  document.createElement('nav')
  document.createElement('article')
  document.createElement('section')

  if ($('alertify-logs') == null) {
    debug('creating container')
    alertify.container = document.createElement('section')
    alertify.container.setAttribute('id', 'alertify-logs')
    alertify.container.className = 'alertify-logs alertify-logs-hidden'
    document.body.appendChild(alertify.container)
  }

  document.body.setAttribute('tabindex', '0')
  // transition
  debug('getting transition')
  alertify.transition = getTransitionEvent()
}

alertify.error = function(message, wait) {
  alertify.log(message, 'error', wait)
}

alertify.success = function(message, wait) {
  alertify.log(message, 'success', wait)
}

alertify.log = function(message, type, wait) {
  debug('log - message %s type %s wait %s', message, type, wait)
  var check = function() {
    if (alertify.container && alertify.container.scrollTop !== null)
      return
    else check()
  }

  init()
  check()

  alertify.container.className = 'alertify-logs'
  notify(message, type, wait)
}

function notify(message, type, wait) {
  debug('notify - message %s type %s wait %s', message, type, wait)
  var log = document.createElement('article')
  log.className = 'alertify-log' + ((type && 'string' === typeof type)
    ? ' alertify-log-'+type
    : '')

  log.innerHTML = message
  alertify.container.appendChild(log)
  setTimeout(function() {
    debug('showing notification')
    log.className = log.className + ' alertify-log-show'
  }, 50)

  close(log, wait)
}

function close(ele, wait) {
  var timer = (wait && !isNaN(wait))
    ? +wait
    : 5000

  debug('setup close %s', wait)
  bind(ele, 'click', function() {
    debug('bound click')
    hide(ele)
  })

  function transitionDone(event) {
    debug('begin transitionDone')
    event.stopPropagation()
    debug('unbinding event')
    unbind(this, alertify.transition.type, transitionDone)
    alertify.container.removeChild(this)
    if (!alertify.container.hasChildNodes())
      alertify.container.className += ' alertify-logs-hidden'
    debug('end transitionDone')
  }

  function hide() {
    debug('hide')
    if ('undefined' !== typeof ele && ele.parentNode === alertify.container) {
      if (alertify.transition.supported) {
        debug('transition supported, binding to done event')
        bind(ele, alertify.transition.type, transitionDone)
        ele.className += ' alertify-log-hide'
      } else {
        debug('transition not supported, removing log')
        alertify.container.removeChild(ele)
        if (!alertify.container.hasChildNodes())
          alertify.container.className += ' alertify-logs-hidden'
      }
    }
  }

  if (wait === 0) return

  setTimeout(function() {
    debug('timer done')
    hide()
  }, timer)
}

// Helpers

function bind(ele, event, fn) {
  debug('bind %s', event)
  if ('function' === typeof ele.addEventListener) {
    ele.addEventListener(event, fn, false)
  } else if (ele.attachEvent) {
    ele.attachEvent('on' + event, fn)
  }
}

function unbind(ele, event, fn) {
  debug('unbind %s', event)
  if ('function' === typeof ele.removeEventListener) {
    ele.removeEventListener(event, fn, false)
  } else if (ele.detachEvent) {
    ele.detachEvent('on' + event, fn)
  }
}

function getTransitionEvent() {
  var supported = false
    , ele = document.createElement('fakeelement')
    , transitions = { WebkitTransition: 'webkitTransitionEnd'
                    , MozTransition: 'transitionend'
                    , OTransition: 'otransitionend'
                    , transition: 'transitionend'
                    }
    , t
    , type

  for (t in transitions) {
    if (ele.style[t] !== undefined) {
      type = transitions[t]
      supported = true
      break
    }
  }

  return {
    type: type
  , supported: supported
  }
}

function $(id) {
  return document.getElementById(id)
}
