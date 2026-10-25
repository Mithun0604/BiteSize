import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="home-footer">
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-9 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
      <div>
        <button className="home-footer-brand" onClick={() => onNavigate('landing')}>BiteSize</button>
        <p className="mt-2 max-w-sm text-sm">Your groceries, understood. Make everyday food choices feel simpler.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <div className="home-footer-links">
          <button onClick={() => onNavigate('scan-meal')}>Meal scanner</button>
          <button onClick={() => onNavigate('meal-planner')}>Meal planner</button>
          <button onClick={() => onNavigate('pricing')}>Plans</button>
        </div>
      </div>
      <div>
        <h2>About BiteSize</h2>
        <div className="home-footer-links">
          <button onClick={() => onNavigate('about')}>About</button>
          <button onClick={() => onNavigate('contact')}>Contact</button>
          <button onClick={() => onNavigate('help')}>Help & FAQ</button>
        </div>
      </div>
    </div>
    <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-[#e8e0d3] px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
      <span>Nutrition information is an estimate, not medical advice.</span>
      <div className="flex gap-4">
        <button onClick={() => onNavigate('privacy')}>Privacy</button>
        <button onClick={() => onNavigate('terms')}>Terms</button>
        <span>© 2026 BiteSize</span>
      </div>
    </div>
  </footer>
);
