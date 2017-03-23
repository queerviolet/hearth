class Valuable extends Rx.Observable {
  constructor(snapshot$) {
    super()
    this.snapshot$ = Rx.Observable.isObservable(snapshot$)
      ? snapshot$
      : Rx.Observable.of(snapshot$)
  }

  get values() {  
    return this.map(val)
  }

  _subscribe(obs) {
    return this.snapshot$.subscribe(obs)
  }
}

class Flame extends Valuable {
  constructor(ref) {
    const ref$ = Rx.Observable.isObservable(ref)
      ? ref
      : Rx.Observable.of(ref)
    super(ref$.flatMapLatest(watch('value')))
  }

  get childAdded() { return new Valuable(this.ref$.flatMapLatest(childAdded)) }
  get childMoved() { return new Valuable(this.ref$.flatMapLatest(childMoved)) }
  get childRemoved() { return new Valuable(this.ref$.flatMapLatest(childRemoved)) }
  
  child(...path) {
    return new Flame(this.ref$.map(ref => ref.child(...path)))
  }

  set(...args) {
    this.ref$.then(ref => ref.set(...args))
  }

  update(...args) {
    this.ref$.then(ref => ref.update(...args))
  }
}