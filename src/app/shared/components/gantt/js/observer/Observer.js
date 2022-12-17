export default class Observer {
  constructor(scope) {
    this.scope = scope || null;
  }

  setUpdate(fn) {
    let self = this;
    this.update = function(...args) {
      fn.apply(self.scope ? self.scope : self, args);
    };
  }
}
