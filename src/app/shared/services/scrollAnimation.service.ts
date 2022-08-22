import { Injectable } from "@angular/core";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Injectable({
    providedIn: 'root',
})

export class ScrollAnimationService {

    homeScrollTrigger(): void {
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

    galleryScrollTrigger(): void {
      const scrollTitle = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.gallery-header'),
          start: "100% center",
          toggleActions: "play none none reverse",
          markers: false
        }
      });
      scrollTitle.from(document.querySelector('.gallery-header'), { y: -50, opacity: 0 });

      const scrollGallery = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.gallery'),
          start: "-10% center",
          toggleActions: "play none none reverse"
        }
      });
      scrollGallery.from(document.querySelector('.gallery'), { y: 50, opacity: 0 });

      const scrollArrovLeft = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.arrow-left'),
          start: "-150% center",
          toggleActions: "play none none reverse",
          markers: false
        }
      });
      scrollArrovLeft.from(document.querySelector('.arrow-left'), { x: 0, opacity: 0 });

      const scrollArrovRight = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.arrow-right'),
          start: "-150% center",
          toggleActions: "play none none reverse"
        }
      });
      scrollArrovRight.from(document.querySelector('.arrow-right'), { x: 0, opacity: 0 });
    }

    contactsScrollTrigger(): void {
      const scrollContactPanel = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.contacts-menu'),
          start: "30% center",
          toggleActions: "play none none reverse"
        }
      });
      scrollContactPanel.from(document.querySelector('.contacts-menu'), { x: -50, opacity: 0 });
    }

    navigate(destination: string) {
      const scrollTo = gsap.timeline();
      if(destination == 'home') {
        scrollTo.to(window,
          {
            delay: 0.2,
            duration: 0.0,
            scrollTo: 0,
          }
        );
      } else if (destination == 'gallery') {
        scrollTo.to(window,
          {
            delay: 0.2,
            duration: 0.8,
            scrollTo: 1043
          }
        );
      } else if (destination == 'contacts') {
        scrollTo.to(window,
          {
            delay: 0.2,
            duration: 0.8,
            scrollTo: 1943
          }
        );
      } else if (destination == 'nearby') {
        scrollTo.to(window,
          {
            delay: 0.2,
            duration: 0.8,
            scrollTo: 2950
          }
        );
      }
    }
}
