import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToScanner = () => {
    navigate('/scanner');
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden hero-gradient">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-300/10 to-blue-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-emerald-500 mr-3 animate-pulse" />
              <span className="text-emerald-600 font-semibold text-lg">{t('hero.subtitle_small')}</span>
              <Sparkles className="w-8 h-8 text-emerald-500 ml-3 animate-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">{t('hero.title_decode')}</span> {t('hero.title_your_labels')}
              <br />
              {t('hero.title_with')} <span className="text-emerald-600">{t('hero.title_smart_ai')}</span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-scale-in flex justify-center items-center mb-12" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={goToScanner}
              className="btn-primary text-lg px-8 py-4"
            >
              {t('hero.cta_button')}
            </Button>
          </div>

          {/* Features Grid */}
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" style={{ animationDelay: '0.6s' }}>
            <div className="p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-200 dark:border-slate-700 card-hover">
              <div className="text-4xl mb-4"><img src="/scan.png" alt="Scan icon" className="w-10 h-10 mx-auto" /></div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">{t('hero.feature_smart_ocr_title')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('hero.feature_smart_ocr_description')}</p>
            </div>
            <div className="p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200 dark:border-slate-700 card-hover">
              <div className="text-4xl mb-4"><img src="/brain.png" alt="AI Insights icon" className="w-10 h-10 mx-auto" /></div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">{t('hero.feature_ai_insights_title')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('hero.feature_ai_insights_description')}</p>
            </div>
            <div className="p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200 dark:border-slate-700 card-hover">
              <div className="text-4xl mb-4"><img src="/world.png" alt="Multi-Language icon" className="w-10 h-10 mx-auto" /></div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">{t('hero.feature_multi_language_title')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('hero.feature_multi_language_description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
