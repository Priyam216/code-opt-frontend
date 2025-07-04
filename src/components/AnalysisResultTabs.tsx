import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import FunctionalityAnalysis from './FunctionalityAnalysis';
import { AnalysisResult } from '@/api/service';

interface AnalysisResultTabsProps {
  results: AnalysisResult;
}

const AnalysisResultTabs: React.FC<AnalysisResultTabsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'functionality'>('opportunities');

  // Debug logging
  useEffect(() => {
    console.log('AnalysisResultTabs - Full results:', results);
    console.log('AnalysisResultTabs - Categories:', results.categories);
    console.log('AnalysisResultTabs - Categories with issues:', 
      results.categories?.filter(cat => cat.hasIssues) || []
    );
  }, [results]);

  // Safely get categories with fallback
  const categories = results.categories || [];
  const categoriesWithIssues = categories.filter(cat => cat.hasIssues);
  const totalIssues = categoriesWithIssues.reduce((total, cat) => total + (cat.issues?.length || 0), 0);

  return (
    <div className="border border-gray-800 rounded-2xl p-6">
      {/* Top Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 -mb-px focus:outline-none transition-colors ${
            activeTab === 'opportunities'
              ? 'border-b-2 border-indigo-400 text-white font-medium'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Optimization Opportunities {totalIssues > 0 && `(${totalIssues})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('functionality')}
          className={`px-4 py-2 -mb-px focus:outline-none transition-colors ${
            activeTab === 'functionality'
              ? 'border-b-2 border-indigo-400 text-white font-medium'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Functionality Analysis
        </button>
      </div>

      {/* Content */}
      {activeTab === 'opportunities' && (
        <div>
          {/* Debug Info - Remove this in production */}
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg text-sm">
            <div className="text-blue-300 font-medium mb-2">Debug Information:</div>
            <div className="text-blue-200 space-y-1">
              <div>Total categories: {categories.length}</div>
              <div>Categories with issues: {categoriesWithIssues.length}</div>
              <div>Total issues: {totalIssues}</div>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8">
              <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Analysis Data</h3>
              <p className="text-gray-400">No categories found in the analysis results.</p>
            </div>
          ) : categoriesWithIssues.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Great Code Quality!</h3>
              <p className="text-gray-400">No optimization opportunities found. Your code looks good!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category, idx) => (
                <Card
                  key={idx}
                  className={`bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-2xl hover:shadow-lg transition-shadow ${
                    category.hasIssues ? 'border-amber-700/30 bg-amber-950/10' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                        {category.hasIssues && (
                          <AlertTriangle size={16} className="text-amber-500" />
                        )}
                        {category.name}
                      </CardTitle>
                      {category.hasIssues && (
                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                          {category.issues?.length || 0} {(category.issues?.length || 0) === 1 ? 'issue' : 'issues'}
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-xs text-gray-300">
                      {category.hasIssues
                        ? `${category.issues?.length || 0} optimization ${
                            (category.issues?.length || 0) === 1 ? 'opportunity' : 'opportunities'
                          } found`
                        : 'No optimization opportunities found'}
                    </CardDescription>
                  </CardHeader>

                  {category.hasIssues && category.issues && category.issues.length > 0 && (
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full bg-transparent">
                        {category.issues.map((issue, i) => (
                          <AccordionItem key={i} value={`issue-${i}`}>
                            <AccordionTrigger className="text-sm text-white hover:text-gray-200">
                              {issue.title || `Issue ${i + 1}`}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 text-sm text-gray-200">
                                {issue.location && (
                                  <div>
                                    <div className="font-medium text-xs text-muted-foreground mb-1">CODE LOCATION</div>
                                    <div className="bg-secondary/50 px-3 py-1 rounded-sm text-white">
                                      {issue.location}
                                    </div>
                                  </div>
                                )}
                                {issue.reason && (
                                  <div>
                                    <div className="font-medium text-xs text-muted-foreground mb-1">REASON</div>
                                    <p>{issue.reason}</p>
                                  </div>
                                )}
                                {issue.suggestion && (
                                  <div>
                                    <div className="font-medium text-xs text-muted-foreground mb-1">SUGGESTION</div>
                                    <p className="text-primary">{issue.suggestion}</p>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'functionality' && (
        <div className="border border-gray-700 rounded-2xl p-4">
          {results.functionalityAnalysis ? (
            <FunctionalityAnalysis content={results.functionalityAnalysis} />
          ) : (
            <div className="text-center py-8">
              <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Functionality Analysis</h3>
              <p className="text-gray-400">Functionality analysis data is not available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisResultTabs;