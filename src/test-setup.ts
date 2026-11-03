// jsdom (used by Vitest) does not implement IntersectionObserver, which the history pages rely on.
if (!('IntersectionObserver' in globalThis)) {
  class IntersectionObserverStub {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe(): void { }
    unobserve(): void { }
    disconnect(): void { }
    takeRecords(): IntersectionObserverEntry[] { return []; }
  }
  (globalThis as any).IntersectionObserver = IntersectionObserverStub;
}

// jsdom does not implement matchMedia either; components use it to pick the mobile/desktop layout.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { },
    removeListener: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => false,
  });
}
