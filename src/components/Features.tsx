import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface Feature {
  title: string;
  description: string;
  icon: string; // This will now be the image path or string icon
  details?: string[]; // Make details optional as it's not in all features
  gradient: string; // Keep gradient property
}

const Features = () => {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      title: t('features.lightning_fast.title'),
      description: t('features.lightning_fast.description'),
      icon: '/scan.png', // Replaced with image path
      gradient: 'from-emerald-500 to-teal-500', // Add gradient back
    },
    {
      icon: '/brain.png', // Replaced with image path
      title: t('features.ai_powered_analysis.title'),
      description: t('features.ai_powered_analysis.description'),
      details: [t('features.ai_powered_analysis.details.nutrient_breakdown'), t('features.ai_powered_analysis.details.health_impact'), t('features.ai_powered_analysis.details.dietary_recommendations')],
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: '/graph.png', // Replaced with image path
      title: t('features.interactive_visualizations.title'),
      description: t('features.interactive_visualizations.description'),
      details: [t('features.interactive_visualizations.details.macro_micronutrient'), t('features.interactive_visualizations.details.daily_intake'), t('features.interactive_visualizations.details.progress_tracking')],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '/world.png', // Replaced with image path
      title: t('features.multi_language_support.title'),
      description: t('features.multi_language_support.description'),
      details: [t('features.multi_language_support.details.hindi'), t('features.multi_language_support.details.regional'), t('features.multi_language_support.details.localized')],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '/phone.png', // Replaced with image path
      title: t('features.mobile_first_design.title'),
      description: t('features.mobile_first_design.description'),
      details: [t('features.mobile_first_design.details.touch_friendly'), t('features.mobile_first_design.details.optimized_camera'), t('features.mobile_first_design.details.cross_platform')],
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: '/lock.png', // Replaced with image path
      title: t('features.privacy_security.title'),
      description: t('features.privacy_security.description'),
      details: [t('features.privacy_security.details.secure_processing'), t('features.privacy_security.details.no_data_storage'), t('features.privacy_security.details.privacy_first')],
      gradient: 'from-slate-600 to-slate-800'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {t('features.section_title_powerful')} <span className="gradient-text">{t('features.section_title_features')}</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {t('features.section_description')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-8 card-hover animate-scale-in bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl animate-bounce-subtle`} style={{ animationDelay: `${index * 0.2}s` }}>
                    {feature.icon.startsWith('/') ? (
                        <img src={feature.icon} alt={`${feature.title} icon`} className="w-10 h-10 mx-auto" />
                    ) : (
                        feature.icon
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.details && feature.details.length > 0 && (
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-8 rounded-2xl text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">{t('features.cta_heading')}</h3>
              <p className="text-lg mb-6 opacity-90">
                {t('features.cta_description')}
              </p>
              <button className="bg-white text-emerald-600 hover:bg-slate-50 px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                {t('features.cta_button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
