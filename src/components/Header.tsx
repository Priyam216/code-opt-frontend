
import React from 'react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-border py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">AI</span>
          </div>
          <h1 className="text-xl font-semibold">Code Optimizer</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="secondary" size="sm">Documentation</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
