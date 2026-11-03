import { Injectable } from "@angular/core";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

@Injectable({
    providedIn: 'root',
})

export class ScrollAnimationService {
  // Scrolls to the top of the section component (e.g. 'gallery' -> <app-gallery>), so it keeps working
  // whatever height the sections have on the current screen.
  navigate(destination: string) {
    const section = destination === 'home' ? null : document.querySelector<HTMLElement>(`app-${destination}`);
    const target = section ? section.getBoundingClientRect().top + window.scrollY : 0;

    gsap.timeline().to(window, {
      delay: 0.2,
      duration: 0.8,
      scrollTo: target
    });
  }

    public RegisterScrollServices(): void {
      // this.homeScrollTrigger();
      this.galleryScrollTrigger();
      this.contactsScrollTrigger();
      this.bookingScrollTrigger();
      this.historyScrollTrigger();
    }

    public ActivateScrollService(): void {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    }

    private homeScrollTrigger(): void {
      const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
        
        gsap.utils.toArray<HTMLElement>(".parallax").forEach(layer => {
          let depth = Number(layer.dataset.depth);
          let movement = -(layer.offsetHeight * depth)
          tl.to(layer, {y: movement, ease: "none"}, 0)
        });
    }

    private galleryScrollTrigger(): void {
      const scrollTitle = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.gallery-header'),
          start: "100% center",
          toggleActions: "play none none reverse",
          markers: false
        }
      });
      scrollTitle.from(document.querySelector('.gallery-header'), { y: -50, opacity: 0 });

      const scrollGalleryMain = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.images'),
          start: "8% center",
          toggleActions: "play none none reverse"
        }
      });
      scrollGalleryMain.from(document.querySelector('.images'), {opacity: 0 });

      const scrollArrovLeft = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.gallery-next-button'),
          start: "80% bottom",
          toggleActions: "play none none reverse",
          markers: false
        }
      });
      scrollArrovLeft.from(document.querySelector('.gallery-next-button'), { y: -50, opacity: 0 });

      const scrollArrovRight = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.gallery-previous-button'),
          start: "80% bottom",
          toggleActions: "play none none reverse",
        }
      });
      scrollArrovRight.from(document.querySelector('.gallery-previous-button'), { y: -50, opacity: 0 });

      const imageDescriptionText = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.gallery-image-descriptor-container'),
          start: "80% bottom",
          toggleActions: "play none none reverse",
          markers: false
        }
      });
      imageDescriptionText.from(document.querySelector('.gallery-image-descriptor-container'), { y: -50, opacity: 0 });
    }

    private contactsScrollTrigger(): void {
      const scrollContactPanel = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.contacts-menu'),
          start: "30% center",
          toggleActions: "play none none reverse"
        }
      });
      scrollContactPanel.from(document.querySelector('.contacts-menu'), { x: -50, opacity: 0 });
    }

    private bookingScrollTrigger(): void {
      const scrollTexts= gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector(".booking-container"),
          start: "30% center",
          toggleActions: "play none none reverse",
        }
      });
      
      scrollTexts.from(document.querySelector(".booking-text-1"), { x: -50, opacity: 0 });
      scrollTexts.from(document.querySelector(".booking-text-2"), { x: -50, opacity: 0 });
      scrollTexts.from(document.querySelector(".booking-text-3"), { x: -50, opacity: 0 });
      scrollTexts.from(document.querySelector(".booking-text-4"), { x: -50, opacity: 0 });

      const scrollPanels= gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector(".booking-container"),
          start: "30% center",
          toggleActions: "play none none reverse",
          }
      });
      
      scrollPanels.from(document.querySelector(".booking-options-background-container"), { opacity: 0, duration: 2 });
    }

    private historyScrollTrigger(): void {
      const scrollTimline= gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector(".topic-1"),
          start: "-10% center",
          toggleActions: "play none none reverse",
        }
      });

      const scrollPageOne= gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector(".topic-1"),
          start: "-10% center",
          toggleActions: "play none none reverse",
        }
      });

      scrollTimline.from(document.querySelector(".timeline-container"), {opacity: 0 });
      scrollPageOne.from(document.querySelector(".topic-1"), {opacity: 0 });

      const scrollPageTwo= gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector(".topic-2"),
          start: "-10% center",
          toggleActions: "play none none reverse",
        }
      });

      scrollPageTwo.from(document.querySelector(".topic-2"), {opacity: 0 });
      
      const scrollPageThree= gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector(".topic-3"),
          start: "-10% center",
          toggleActions: "play none none reverse",
        }
      });

      scrollPageThree.from(document.querySelector(".topic-3"), {opacity: 0 });
    }
}
