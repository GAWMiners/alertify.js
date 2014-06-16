var alertify = exports

var template = '<article class="alertify-log{{class}}">{{message}}</article>'

alertify.transition = undefined

alertify.container = undefined

alertify.extend = function(type) {
  if ('string' !== typeof type)
    throw new Error('type is required and must be a string')
  return function(message, wait) {
    alertify.log(message, type, wait)
  }
}

function init() {
  document.createElement('nav')
  document.createElement('article')
  document.createElement('section')

  if ($('alertify-logs') == null) {
    alertify.container = document.createElement('section')
    alertify.container.setAttribute('id', 'alertify-logs')
    alertify.container.className = 'alertify-logs alertify-logs-hidden'
    document.body.appendChild(alertify.container)
  }

  document.body.setAttribute('tabindex', '0')
  // transition
  alertify.transition = getTransitionEvent()
}

alertify.error = function(message, wait) {
  alertify.log(message, 'error', wait)
}

alertify.success = function(message, wait) {
  alertify.log(message, 'success', wait)
}

alertify.log = function(message, type, wait) {
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
  var log = document.createElement('article')
  log.className = 'alertify-log' + ((type && 'string' === typeof type)
    ? ' alertify-log-'+type
    : '')

  log.innerHTML = message
  alertify.container.appendChild(log)
  setTimeout(function() {
    log.className = log.className + ' alertify-log-show'
  }, 50)

  close(log, wait)
}

function close(ele, wait) {
  var timer = (wait && !isNaN(wait))
    ? +wait
    : 5000

  bind(ele, 'click', function() {
    hide(ele)
  })

  function transitionDone(event) {
    event.stopPropagation()
    unbind(this, alertify.transition.type, transitionDone)
    alertify.container.removeChild(this)
    if (!alertify.container.hasChildNodes())
      alertify.container.className += ' alertify-logs-hidden'
  }

  function hide() {
    if ('undefined' !== typeof ele && ele.parentNode === alertify.container) {
      if (alertify.transition.supported) {
        bind(ele, alertify.transition.type, transitionDone)
        ele.className += ' alertify-log-hide'
      } else {
        alertify.container.removeChild(ele)
        if (!alertify.container.hasChildNodes())
          alertify.container.className += ' alertify-logs-hidden'
      }
    }
  }

  if (wait === 0) return

  setTimeout(function() {
    hide()
  }, timer)
}

// Helpers

function bind(ele, event, fn) {
  if ('function' === typeof ele.addEventListener) {
    ele.addEventListener(event, fn, false)
  } else if (ele.attachEvent) {
    ele.attachEvent('on' + event, fn)
  }
}

function unbind(ele, event, fn) {
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
