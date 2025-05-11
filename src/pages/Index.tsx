
import React from 'react';
import Header from '@/components/Header';
import CodeOptimizer from '@/components/CodeOptimizer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto py-8 px-4 md:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">AI Code Optimizer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Optimize your code instantly using artificial intelligence. Improve performance, 
            reduce memory usage, and enhance readability with a single click.
          </p>
        </div>
        
        <CodeOptimizer />
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 text-center text-sm text-muted-foreground">
          <p>© 2025 AI Code Optimizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
