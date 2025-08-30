import React from 'react';
import { FoodScanner } from '@/components/FoodScanner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Zap, Shield, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-fresh-food.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Leaf className="w-4 h-4 mr-2" />
              AI-Powered Food Analysis
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Fresh Food
              <span className="text-primary block">Detector</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reduce food waste and stay healthy with our AI-powered freshness detection. 
              Simply scan your food to get instant freshness analysis and storage tips.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-accent" />
                <span>Instant Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-fresh" />
                <span>90%+ Accuracy</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Reduce Food Waste</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Start Scanning</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a photo or upload an image of your food, and our AI will analyze its freshness
            in seconds, providing you with actionable insights.
          </p>
        </div>
        
        <FoodScanner />
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-fresh/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-fresh" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced computer vision analyzes your food's visual indicators of freshness
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Get freshness status and recommendations within seconds of scanning
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Reduce Waste</h3>
                <p className="text-sm text-muted-foreground">
                  Make informed decisions about food consumption and storage to minimize waste
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
