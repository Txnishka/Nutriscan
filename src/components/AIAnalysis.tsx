import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import NutrientChart from './NutrientChart';
import FollowUpChat from './FollowUpChat';

interface AIAnalysisProps {
  extractedText: string;
}

interface ParsedAnalysis {
  nutrients: Array<{
    name: string;
    value: number;
    unit: string;
  }>;
  healthImplications: string[];
  allergens: string[];
  overallAssessment: string;
  citations: string[];
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ extractedText }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ParsedAnalysis | null>(null);
  const { toast } = useToast();

  const parseAnalysis = (text: string): ParsedAnalysis => {
    const nutrients: ParsedAnalysis['nutrients'] = [];
    let healthImplications: string[] = [];
    let allergens: string[] = [];
    let overallAssessment = '';

    // Define the headings and their corresponding keys in the parsed object
    const headings = [
      'Key Nutrients:',
      'Health Implications:',
      'Allergens:',
      'Overall Assessment:',
    ];

    // Use a regex to find the content between headings
    const sectionContent: { [key: string]: string } = {};
    let lastIndex = 0;

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const nextHeading = i < headings.length - 1 ? headings[i + 1] : null;

      const startIndex = text.indexOf(heading, lastIndex);
      if (startIndex !== -1) {
        const contentStart = startIndex + heading.length;
        let contentEnd = text.length;

        if (nextHeading) {
          const nextHeadingIndex = text.indexOf(nextHeading, contentStart);
          if (nextHeadingIndex !== -1) {
            contentEnd = nextHeadingIndex;
          }
        }

        let content = text.substring(contentStart, contentEnd).trim();
        // Remove the :\n\n immediately following the heading
        if (content.startsWith(':\n\n')) {
            content = content.substring(':\n\n'.length).trim();
        }
        sectionContent[heading] = content;
        lastIndex = contentEnd;
      }
    }

    // Parse Key Nutrients
    const keyNutrientsText = sectionContent['Key Nutrients:'] || '';
    if (keyNutrientsText) {
        const nutrientLines = keyNutrientsText.split(/\r?\n/).filter(line => line.trim().length > 0);
        // More flexible regex to capture various formats, including optional bolding and bullet points
        // Relaxing the start and end anchors (^ and $) and being more lenient with whitespace around colons.
        const nutrientRegex = /-?\s*\*?\*?(.*?)\*?\*?\s*:\s*(\d+(?:\.\d+)?)\s*([g%]|mg|mcg|µg)(?:\s*\(.*?\))?\s*/i;
        nutrientLines.forEach(line => {
            const match = line.match(nutrientRegex);
            if (match) {
                const [_, name, value, unit] = match;
                const cleanedName = name.trim().replace(/\s+/g, ' ');
                 // Exclude Calories from the pie chart
                if (cleanedName.toLowerCase() !== 'calories') {
                     nutrients.push({
                        name: cleanedName,
                        value: parseFloat(value),
                        unit: unit,
                    });
                }
            } else {
                console.warn('Could not parse nutrient line:', line);
            }
        });
    }

    // Parse Health Implications
    const healthImplicationsText = sectionContent['Health Implications:'] || '';
    if (healthImplicationsText) {
        healthImplications = healthImplicationsText.split(/\r?\n/).map(line => line.trim().replace(/^-?\s*/, '')).filter(line => line.length > 0);
    }

    // Parse Allergens
    const allergensText = sectionContent['Allergens:'] || '';
     if (allergensText) {
         allergens = allergensText.split(/\r?\n/).map(line => line.trim().replace(/^-?\s*/, '')).filter(line => line.length > 0);
     }

    // Set Overall Assessment
    overallAssessment = sectionContent['Overall Assessment:'] || '';

    console.log('Parsed analysis result:', { nutrients, healthImplications, allergens, overallAssessment }); // Log final parsed result

    return {
      nutrients,
      healthImplications,
      allergens,
      overallAssessment,
      citations: [],
    };
  };

  const analyzeNutrition = async () => {
    if (!extractedText) return;
    
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "Perplexity API key is not configured",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const prompt = `Analyze the following nutrition label text and provide a detailed breakdown of the nutritional information. Format your response using the following exact headings, each followed by a colon and two newline characters (:\n\n), and then the information:\n
Key Nutrients:\n\n[List each nutrient with its value and unit on a new line, e.g., "Total Fat: 10g", "Sodium: 200mg", "Vitamin C: 50mg". DO NOT include Calories in this list.]

Health Implications:\n\n[List key health impacts as bullet points, one per line, starting with '- '. Use double asterisks (**) for terms or phrases that should be bold.]

Allergens:\n\n[List any allergens present as bullet points, one per line, starting with '- '. If no allergens are explicitly listed, state "None explicitly listed in the label text."]

Overall Assessment:\n\n[Provide a summary paragraph]\n
Nutrition label text:
${extractedText}

Please ensure each section is clearly labeled with the exact headings provided and is formatted consistently as described.`;

      const response = await fetch('/api/perplexity/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are a nutrition expert analyzing food labels. Provide clear, accurate, and helpful nutritional information.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const responseText = await response.text();
      console.log('Perplexity API raw response:', responseText); // Log raw response

      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse API response:', responseText);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const errorMessage = data.error?.message || 'Analysis failed';
        console.error('API error:', errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.choices?.[0]?.message?.content) {
        console.error('Unexpected API response format:', data);
        throw new Error('No analysis data received');
      }

      const rawAnalysisText = data.choices[0].message.content;
      const parsedAnalysis = parseAnalysis(rawAnalysisText);
      console.log('Parsed analysis result:', { nutrients: parsedAnalysis.nutrients, healthImplications: parsedAnalysis.healthImplications, allergens: parsedAnalysis.allergens, overallAssessment: parsedAnalysis.overallAssessment }); // Log parsed result without citations yet

      // Extract citations from the raw API response data
      const citations = data.citations || [];
      console.log('Extracted citations:', citations);

      setAnalysis({
        ...parsedAnalysis,
        citations: citations, // Include citations in the state
      });
      toast({
        title: "Analysis Complete",
        description: "Nutritional information has been analyzed",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze the nutritional information",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to render markdown bold
  const renderBoldMarkdown = (text: string) => {
    // Replace **text** with <strong>text</strong>
    const htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: htmlText };
  };

  return (
    <>
      {!analysis && !isAnalyzing && (
        <Card className="p-8 card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200 dark:border-slate-700 lg:col-span-2">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
              AI Nutritional Analysis
            </h3>
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
              <Brain className="w-12 h-12 mb-4" />
              <p>Click below to analyze the nutritional information</p>
              <Button
                onClick={analyzeNutrition}
                className="btn-primary mt-4"
                disabled={!extractedText}
              >
                <Brain className="w-4 h-4 mr-2" />
                Analyze Nutrition
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isAnalyzing && (
        <Card className="p-8 card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200 dark:border-slate-700 lg:col-span-2">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
              AI Nutritional Analysis
            </h3>
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-12 h-12 mb-4 animate-spin text-purple-500" />
              <p className="text-slate-600 dark:text-slate-400">Analyzing nutritional information...</p>
            </div>
          </div>
        </Card>
      )}

      {analysis && (
        <>
          {/* Nutrient Chart Card */}
          <Card className="p-6 card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-200 dark:border-slate-700 flex-grow">
            <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Nutrient Breakdown</h4>
            {analysis.nutrients.length > 0 ? (
              <div className="w-full min-h-0 chart-container">
                 <NutrientChart nutrients={analysis.nutrients} />
              </div>
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400">No nutrient data available for chart.</div>
            )}
          </Card>

          {/* Other Analysis Details Card */}
          <Card className="p-6 card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200 dark:border-slate-700 space-y-6">
            {/* Health Implications */}
            {analysis.healthImplications.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Health Implications</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  {analysis.healthImplications.map((implication, index) => (
                    <li key={index} dangerouslySetInnerHTML={renderBoldMarkdown(implication)}></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Allergens */}
            {analysis.allergens.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Allergens</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.allergens.map((allergen, index) => (
                    <span
                      key={index}
                      className={
                        allergen.toLowerCase().includes('none explicitly listed')
                          ? "px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                          : "px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm"
                      }
                    >
                      {allergen.toLowerCase().includes('none explicitly listed') ? <></> : <AlertCircle className="w-4 h-4 inline-block mr-1" />}{allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Assessment */}
            {analysis.overallAssessment && (
              <div>
                <h4 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Overall Assessment</h4>
                <p className="text-slate-700 dark:text-slate-300">{analysis.overallAssessment}</p>
              </div>
            )}

            {/* Citations */}
            {analysis.citations && analysis.citations.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Citations</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  {analysis.citations.map((citation, index) => (
                    <li key={index}>
                      <a href={citation} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {citation}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Reanalyze Button - positioned below the grid, spans two columns */}
           <div className="lg:col-span-2 mt-6">
              <Button
                onClick={analyzeNutrition}
                className="btn-primary w-full"
                disabled={isAnalyzing}
              >
                <Brain className="w-4 h-4 mr-2" />
                Reanalyze
              </Button>
           </div>
        </>
      )}

      {/* Follow-up Chat Section */}
      {analysis && (
        <div className="lg:col-span-2 mt-6">
           <FollowUpChat extractedText={extractedText} analysis={analysis} />
        </div>
      )}
    </>
  );
};

export default AIAnalysis;