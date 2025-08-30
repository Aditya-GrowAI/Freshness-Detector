import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Scan } from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { FoodResults, type FreshessStatus } from './FoodResults';
import { useToast } from '@/hooks/use-toast';
import { analyzeFood } from '@/lib/aiModel';

export const FoodScanner: React.FC = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleCameraCapture = useCallback((imageData: string) => {
    setShowCamera(false);
    analyzeImage(imageData);
  }, []);

  const analyzeImage = async (imageData: string) => {
    setSelectedImage(imageData);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeFood(imageData);
      setResult(analysisResult);
      
      toast({
        title: "Analysis Complete",
        description: `${analysisResult.foodType} detected - ${analysisResult.status}`,
      });
    } catch (error) {
      console.error('Food analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again with a clearer image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  if (result && selectedImage) {
    return (
      <FoodResults 
        result={result} 
        imageUrl={selectedImage} 
        onNewScan={resetScanner}
      />
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          {isAnalyzing ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Scan className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Analyzing Food...</h3>
                <p className="text-sm text-muted-foreground">
                  AI model is processing your image
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          ) : selectedImage ? (
            <div className="space-y-4">
              <img 
                src={selectedImage} 
                alt="Selected food" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button 
                variant="fresh" 
                size="lg" 
                onClick={() => analyzeImage(selectedImage)}
                className="w-full"
              >
                <Scan className="mr-2 h-5 w-5" />
                Analyze Food
              </Button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Scan Your Food</h3>
                <p className="text-sm text-muted-foreground">
                  Upload an image or take a photo to check freshness
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="scan" 
                  size="lg" 
                  onClick={() => setShowCamera(true)}
                  className="w-full"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo
                </Button>

                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Image
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WebP (max 10MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showCamera && (
        <CameraCapture 
          onImageCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
};