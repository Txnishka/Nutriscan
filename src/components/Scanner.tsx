import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera, FileText, Zap } from 'lucide-react';
import Tesseract from 'tesseract.js';
import AIAnalysis from './AIAnalysis';
import { useTranslation } from 'react-i18next';

const Scanner = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast({
          title: "Image uploaded successfully!",
          description: "Click 'Scan Label' to extract nutritional information"
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Handle the case where file selection was cancelled
      setUploadedImage(null);
      setExtractedText('');
    }
    // Clear the input value to allow re-uploading the same file
    if (event.target) {
        event.target.value = '';
    }
  }, [toast]);

  const runOCR = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setExtractedText('');
    try {
      const { data: { text } } = await Tesseract.recognize(
        uploadedImage,
        'eng',
        {
          logger: m => {
            // Optionally, you can update progress here
          }
        }
      );
      setExtractedText(text);
    toast({
      title: "Label scanned successfully!",
      description: "Nutritional information has been extracted"
    });
    } catch (error) {
      toast({
        title: "OCR Failed",
        description: "Could not extract text from the image.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="scanner" className="py-20 hero-gradient min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('scanner.section_title_scan')}</span> {t('scanner.section_title_your_label')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t('scanner.section_description')}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="p-8 card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-200 dark:border-slate-700">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">{t('scanner.upload_card_title')}</h3>
                
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-emerald-300 dark:border-slate-600 rounded-xl p-12 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors duration-300">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">{t('scanner.upload_area.drop_image')}</p>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{t('scanner.upload_area.or_click')}</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          ref={inputRef}
                        />
                        <Button
                          className="btn-primary cursor-pointer"
                          type="button"
                          onClick={() => inputRef.current?.click()}
                        >
                            <Camera className="w-4 h-4 mr-2" />
                            {t('scanner.upload_area.choose_image_button')}
                          </Button>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('scanner.upload_area.supported_formats')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt={t('scanner.uploaded_image_alt')}
                        className="w-full max-h-64 object-contain rounded-lg border border-slate-200 dark:border-slate-600"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={runOCR}
                        disabled={isProcessing}
                        className="btn-primary flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                            {t('scanner.scan_button.scanning')}
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            {t('scanner.scan_button.scan_label')}
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={() => {
                          setUploadedImage(null);
                          setExtractedText('');
                        }}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        {t('scanner.clear_button')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Results Section */}
            <Card className="p-8 card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200 dark:border-slate-700">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">{t('scanner.extracted_info_card_title')}</h3>
                
                {!extractedText && !isProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                    <FileText className="w-12 h-12 mb-4" />
                    <p>{t('scanner.extracted_info_placeholder')}</p>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">{t('scanner.processing_message')}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4">
                      <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}

                {extractedText && (
                  <div className="text-left">
                    <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        {extractedText}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* AI Analysis Section - moved inside the grid */}
            {extractedText && <AIAnalysis extractedText={extractedText} />}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-200 dark:border-slate-700 card-hover">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-2xl animate-bounce-subtle">
                   <img src="/scan.png" alt="Scan icon" className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">{t('features.lightning_fast.title')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{t('features.lightning_fast.description')}</p>
              </div>
            </Card>
            <Card className="p-6 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200 dark:border-slate-700 card-hover">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl animate-bounce-subtle">
                   <img src="/target.png" alt="Target icon" className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">{t('scanner.feature_highly_accurate_title')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{t('scanner.feature_highly_accurate_description')}</p>
              </div>
            </Card>
            <Card className="p-6 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200 dark:border-slate-700 card-hover">
              <div className="text-center">
                 <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
                    <img src="/lock.png" alt="Secure icon" className="w-10 h-10 mx-auto" />
                 </div>
                 <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">{t('features.privacy_security.title')}</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-sm">{t('features.privacy_security.description')}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scanner;
