import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/icon.png" alt="NutriScan Logo" className="w-8 h-8" />
                <span className="text-xl font-bold">NutriScan</span>
              </div>
              <p className="text-primary-foreground/80 mb-4 max-w-md">
                {t('footer.brand.description')}
              </p>
              <div className="flex space-x-4">
                <a href="https://www.x.com/syskey_dmg" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {t('footer.brand.social.twitter')}
                </a>
                <a href="https://www.github.com/syskey8" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {t('footer.brand.social.github')}
                </a>
                <a href="https://www.linkedin.com/in/tanmay-deorukhakar-85963a257" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {t('footer.brand.social.linkedin')}
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">{t('footer.quick_links.heading')}</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">{t('footer.quick_links.features')}</a></li>
                <li><a href="#scanner" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">{t('footer.quick_links.scanner')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">{t('footer.quick_links.api')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">{t('footer.quick_links.pricing')}</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">{t('footer.support_links.heading')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">{t('footer.support_links.help_center')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">{t('footer.support_links.contact_us')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">{t('footer.support_links.privacy_policy')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">{t('footer.support_links.terms_of_service')}</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-primary-foreground/20" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 text-sm">
              {t('footer.copyright', { year: 2025 })}
            </p>
            <p className="text-primary-foreground/60 text-sm mt-2 md:mt-0">
              Powered by <a href="https://www.perplexity.ai" target="_blank" rel="noopener noreferrer" className="hover:underline">Perplexity.ai</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
