let uid = 0;

export default class Subject {
  constructor() {
    this.observers = [];
    this.id = uid++;
  }

  registerObserver(...observer) {
    let observers = this.observers;
    observer.forEach(ob => {
      let index = observers.indexOf(ob);
      if (!~index) this.observers.push(ob);
    });
  }

  removeObserver(observer) {
    let observers = this.observers;
    let index = observers.indexOf(observer);
    if (~index) {
      return observers.splice(index, 1);
    }
  }

  removeAllObserver() {
    let observers = this.observers;
    observers.forEach(ob => {
      this.removeObserver(ob);
    });
  }

  notifyObserver(...args) {
    const observers = this.observers.slice();
    for (let i = 0, l = observers.length; i < l; i++) {
      observers[i]['$ob'].update(...args);
    }
  }
}
