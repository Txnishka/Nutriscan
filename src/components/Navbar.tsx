import React from 'react';
import { Button } from '@/components/ui/button'; 
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate(); 
  const { t, i18n } = useTranslation();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-md shadow-lg`}>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/?fromNavbar=true')}>
            <img src="/icon.png" alt="NutriScan Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-foreground dark:text-slate-50">NutriScan</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/?fromNavbar=true')} className="text-foreground hover:text-primary transition-colors duration-200">{t('navbar.links.home')}</button>
            <button 
              onClick={() => {
                navigate('/?fromNavbar=true');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} 
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              {t('navbar.links.features')}
            </button>
            <button onClick={() => navigate('/scanner')} className="text-foreground hover:text-primary transition-colors duration-200">{t('navbar.links.scanner')}</button>
            <a href="#about" className="text-foreground hover:text-primary transition-colors duration-200">{t('navbar.links.about')}</a>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 rounded-lg transition-colors duration-200">
                  {i18n.language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                {Array.isArray(i18n.options.supportedLngs) && i18n.options.supportedLngs
                  .filter(lng => lng !== 'CIMODE')
                  .map((lng) => (
                    <DropdownMenuItem key={lng} onClick={() => i18n.changeLanguage(lng)}>
                      {lng.toUpperCase()}
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
            <Button 
              className="btn-primary hidden sm:inline-flex"
              onClick={() => navigate('/scanner')}
            >
              {t('navbar.get_started')}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
