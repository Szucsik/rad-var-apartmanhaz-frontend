import { Injectable } from "@angular/core";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

@Injectable({
    providedIn: 'root',
})

export class ScrollAnimationService {
  navigate(destination: string) {
    const scrollTo = gsap.timeline();
    switch(destination) {
      case 'home': {
        scrollTo.to(window,
          {
            delay: 0.2,
            duration: 0.0,
            scrollTo: 0,
          }
        );
      break;
      } case 'gallery': {
        scrollTo.to(window,
          {
            delay: 0.2,
            duration: 0.8,
            scrollTo: window.innerHeight * 1
          }
        );
        break;
        } case 'booking': {
          scrollTo.to(window,
            {
              delay: 0.2,
              duration: 0.8,
              scrollTo: window.innerHeight  * 2
            }
          );
          break;
        } case 'contacts': {
          scrollTo.to(window,
            {
              delay: 0.2,
              duration: 0.8,
              scrollTo: window.innerHeight  * 3
            }
          );
          break;
        }
      }
    }

    public RegisterScrollServices(): void {
      this.homeScrollTrigger();
      this.galleryScrollTrigger();
      this.contactsScrollTrigger();
      this.bookingScrollTrigger();
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
}
