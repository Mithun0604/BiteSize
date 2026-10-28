import React, { useEffect, useRef } from 'react';
import { ArrowRight, BarChart3, Camera, Check, Leaf, ShoppingBasket, Sprout } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;

}

const BowlIllustration = () => (
  <div className="home-bowl-art" aria-label="Illustration of a balanced meal" role="img">
    <svg className="home-art-trails" viewBox="0 0 520 480" aria-hidden="true">
      <path className="home-art-trail trail-one" d="M70 235C54 128 145 58 242 74c98 16 129 91 205 66" />
      <path className="home-art-trail trail-two" d="M85 205C97 102 194 55 285 88c64 23 96 69 153 52" />
    </svg>
    <span className="home-art-particle particle-one" aria-hidden="true" />
    <span className="home-art-particle particle-two" aria-hidden="true" />
    <span className="home-art-particle particle-three" aria-hidden="true" />
    <svg viewBox="0 0 520 480" className="h-full w-full" aria-hidden="true">
      <ellipse cx="260" cy="428" rx="170" ry="24" fill="#34594A" opacity=".12" />
      <path d="M74 112 398 31l78 305-326 82z" fill="#F2E5D5" opacity=".75" />
      <path d="M111 276c0 93 66 151 149 151s149-58 149-151H111Z" fill="#E7D8C5" />
      <ellipse cx="260" cy="276" rx="149" ry="53" fill="#FFFDF8" />
      <ellipse cx="260" cy="269" rx="126" ry="40" fill="#DDE9DC" />
      <path d="M160 271c15-43 62-62 86-37 17 18-4 53-37 66-27 10-56-1-49-29Z" fill="#507D64" />
      <path d="M244 240c8-35 51-51 71-28 18 21-7 54-39 61-24 5-38-11-32-33Z" fill="#6D956F" />
      <path d="M326 256c10-32 48-41 63-19 14 21-7 47-34 52-22 4-36-12-29-33Z" fill="#3F6B54" />
      <circle cx="209" cy="291" r="20" fill="#C85F43" /><circle cx="341" cy="292" r="17" fill="#D96E4E" />
      <circle cx="209" cy="291" r="7" fill="#F6C7A7" /><circle cx="341" cy="292" r="6" fill="#F6C7A7" />
      <path d="M263 300c18-27 43-34 52-21 10 15-12 39-37 48-17 6-29-8-15-27Z" fill="#E7A35D" />
      <path d="M148 245c28-23 54-23 66-9l-30 21c-14 10-29 4-36-12Z" fill="#E3B767" />
      <path d="M275 224c25-22 54-19 63-2l-33 19c-15 9-27 1-30-17Z" fill="#F1C56E" />
      <circle cx="174" cy="303" r="6" fill="#E6C780" /><circle cx="287" cy="265" r="5" fill="#E6C780" />
      <circle cx="309" cy="317" r="6" fill="#E6C780" /><circle cx="370" cy="269" r="5" fill="#E6C780" />
      <path d="M175 335c27 19 53 23 81 17M279 340c30 10 55 7 79-8" stroke="#B8CDB9" strokeWidth="5" strokeLinecap="round" />
      <path d="M112 365c36 55 84 73 148 72 63-1 112-25 148-72" fill="none" stroke="#D7C6B0" strokeWidth="10" strokeLinecap="round" />
      <path d="M118 155c-1-40 32-70 67-68-2 34-25 61-67 68ZM386 142c6-40 39-65 73-59-8 33-34 57-73 59Z" fill="#74917C" opacity=".65" />
      <path d="M147 108c7-27 27-43 53-41-6 24-25 40-53 41Z" fill="#C86A4B" opacity=".85" />
    </svg>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animationRef.current) return;
    let active = true;
    let media: { add: (conditions: string, handler: () => void) => void; revert: () => void } | undefined;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (!active || !animationRef.current) return;
      const animation = gsapModule.gsap;
      animation.registerPlugin(scrollModule.ScrollTrigger);
      media = animation.matchMedia(animationRef);
      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const timeline = animation.timeline({
          scrollTrigger: {
            trigger: animationRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        });
        timeline
          .fromTo('.trail-one', { strokeDashoffset: 280, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.72, duration: 1 }, 0)
          .fromTo('.trail-two', { strokeDashoffset: -250, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.42, duration: 1 }, 0)
          .fromTo('.particle-one', { x: -18, y: 18, opacity: 0 }, { x: 30, y: -26, opacity: 1, duration: 1 }, 0)
          .fromTo('.particle-two', { x: 20, y: 24, opacity: 0 }, { x: -28, y: -18, opacity: 0.9, duration: 1 }, 0)
          .fromTo('.particle-three', { x: -12, y: -14, opacity: 0 }, { x: 20, y: 28, opacity: 0.85, duration: 1 }, 0);
      });
    });
    return () => {
      active = false;
      media?.revert();
    };
  }, []);

  return (
  <div className="home-page">
    <section className="home-hero mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-12 lg:py-16">
      <div className="relative z-10 max-w-xl">
        <h1 className="home-title">
          Better food choices.<br />
          <span>Smarter spending.</span>
        </h1>
        <p className="home-intro">
          Know what you eat and where your grocery money goes. BiteSize brings your meals, shopping and goals together in one calm, simple place.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button className="home-primary-button" onClick={() => onNavigate('register')}>
            Get started free <ArrowRight size={17} />
          </button>
          <button className="home-secondary-button" onClick={() => onNavigate('pricing')}>
            View plans
          </button>
        </div>
        <p className="home-small-note"><Check size={15} /> Your food details stay yours. Start with the basics.</p>
      </div>
      <div ref={animationRef}><BowlIllustration /></div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-12 sm:grid-cols-3 sm:px-8 lg:px-12" aria-label="BiteSize benefits">
      <article className="home-benefit">
        <span className="home-benefit-icon sage"><Leaf size={22} /></span>
        <div><h2>Personalised nutrition</h2><p>Ideas that fit your goals and preferences.</p></div>
      </article>
      <article className="home-benefit">
        <span className="home-benefit-icon peach"><ShoppingBasket size={22} /></span>
        <div><h2>Clearer grocery spending</h2><p>See your shopping in one easy view.</p></div>
      </article>
      <article className="home-benefit">
        <span className="home-benefit-icon blue"><BarChart3 size={22} /></span>
        <div><h2>Simple insights</h2><p>Small steps for better everyday choices.</p></div>
      </article>
    </section>

    <section id="how-it-works" className="home-how mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="max-w-2xl">
        <span className="home-kicker">HOW IT WORKS</span>
        <h2 className="home-section-title">A simpler way to feel in control.</h2>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {[
          { number: '01', icon: Camera, title: 'Add a meal or receipt', body: 'Upload a photo when you want help understanding a meal or a shop.' },
          { number: '02', icon: BarChart3, title: 'Review your picture', body: 'See your nutrition and spending together, with clear estimates.' },
          { number: '03', icon: Sprout, title: 'Choose your next step', body: 'Make a small plan that works for your preferences and budget.' },
        ].map(({ number, icon: Icon, title, body }) => (
          <article key={number} className="home-step">
            <div className="flex items-center justify-between"><span className="home-step-number">{number}</span><Icon size={21} /></div>
            <h3>{title}</h3><p>{body}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12">
      <div className="home-cta">
        <div><span className="home-kicker">BITE BY BITE</span><h2>Make everyday choices a little easier.</h2><p>Create an account to start building your own food and grocery picture.</p></div>
        <button className="home-primary-button" onClick={() => onNavigate('register')}>Create your account <ArrowRight size={17} /></button>
      </div>
    </section>

    <p className="mx-auto max-w-6xl px-5 pb-10 text-center text-xs text-[#66756C] sm:px-8 lg:px-12">
      Nutrition insights are estimates for general information and are not medical advice.
    </p>
  </div>
  );
};
