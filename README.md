# alertify.js

[![browser support](https://ci.testling.com/GAWMiners/alertify.js.png)](https://ci.testling.com/GAWMiners/alertify.js)

Heavily based on [alertify](https://github.com/fabien-d/alertify.js)

Provides alertify with CommonJS support and strips out the dialogs.

This package only offers the following:

- `alertify.log(msg, type, wait)`
- `alertify.success(msg, wait)`
- `alertify.error(msg, wait)`
- `alertify.extend(type)(msg, wait)`

## Tests

```
$ npm install
$ npm test
```

## License

Alertify is licensed under MIT http://www.opensource.org/licenses/MIT

### Copyright

Copyright (c) 2012, Fabien Doiron  
<fabien.doiron@gmail.com>, [@fabien_doiron](http://twitter.com/fabien_doiron)

Modifications made by Evan Lucas
