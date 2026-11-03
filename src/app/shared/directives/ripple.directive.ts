import { Directive, ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';

/**
 * Material-style ink ripple on mousedown (replacement for PrimeNG's pRipple).
 * Styles: `.ripple-ink` / `.ripple-ink-active` in styles.css.
 */
@Directive({
  standalone: false,
  selector: '[appRipple]',
  host: { class: 'ripple' }
})
export class RippleDirective implements OnInit, OnDestroy {
  private ink: HTMLSpanElement | null = null;
  private unlisteners: Array<() => void> = [];

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2, private zone: NgZone) { }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.unlisteners.push(this.renderer.listen(this.el.nativeElement, 'mousedown', (event: MouseEvent) => this.onMouseDown(event)));
    });
  }

  ngOnDestroy(): void {
    this.unlisteners.forEach(unlisten => unlisten());
    this.ink?.remove();
  }

  private onMouseDown(event: MouseEvent): void {
    const host = this.el.nativeElement;
    const ink = this.getInk();
    ink.classList.remove('ripple-ink-active');

    if (!ink.offsetHeight && !ink.offsetWidth) {
      const size = Math.max(host.offsetWidth, host.offsetHeight);
      ink.style.width = ink.style.height = `${size}px`;
    }

    const rect = host.getBoundingClientRect();
    ink.style.left = `${event.clientX - rect.left - ink.offsetWidth / 2}px`;
    ink.style.top = `${event.clientY - rect.top - ink.offsetHeight / 2}px`;
    ink.classList.add('ripple-ink-active');
  }

  private getInk(): HTMLSpanElement {
    if (!this.ink) {
      this.ink = this.renderer.createElement('span');
      this.renderer.addClass(this.ink, 'ripple-ink');
      this.renderer.setAttribute(this.ink, 'aria-hidden', 'true');
      this.renderer.appendChild(this.el.nativeElement, this.ink);
      this.unlisteners.push(this.renderer.listen(this.ink, 'animationend', () => this.ink?.classList.remove('ripple-ink-active')));
    }
    return this.ink!;
  }
}
