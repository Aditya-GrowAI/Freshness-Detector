import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

export type FreshessStatus = 'fresh' | 'expiring' | 'rotten';

interface FoodResult {
  status: FreshessStatus;
  confidence: number;
  foodType: string;
  daysRemaining?: number;
  tips: string[];
}

interface FoodResultsProps {
  result: FoodResult;
  imageUrl: string;
  onNewScan: () => void;
}

const statusConfig = {
  fresh: {
    icon: CheckCircle,
    color: 'bg-fresh text-fresh-foreground',
    text: 'Fresh',
    description: 'This food is fresh and safe to consume'
  },
  expiring: {
    icon: AlertTriangle,
    color: 'bg-warning text-warning-foreground',
    text: 'Expiring Soon',
    description: 'This food should be consumed soon'
  },
  rotten: {
    icon: XCircle,
    color: 'bg-destructive text-destructive-foreground',
    text: 'Not Fresh',
    description: 'This food is past its prime and should not be consumed'
  }
};

export const FoodResults: React.FC<FoodResultsProps> = ({ result, imageUrl, onNewScan }) => {
  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Image and Status */}
      <Card className="overflow-hidden">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Scanned food" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className={config.color}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {config.text}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{result.foodType}</h3>
              <p className="text-muted-foreground">{config.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence Score</span>
                <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
              </div>
              <Progress value={result.confidence * 100} className="h-2" />
            </div>

            {result.daysRemaining && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Estimated Days Remaining</span>
                <span className="text-lg font-bold text-primary">{result.daysRemaining}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Storage Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Button 
        variant="scan" 
        size="lg" 
        onClick={onNewScan}
        className="w-full"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Scan Another Item
      </Button>
    </div>
  );
};