import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface FoodAnalysisResult {
  status: 'fresh' | 'expiring' | 'rotten';
  confidence: number;
  foodType: string;
  daysRemaining?: number;
  tips: string[];
}

// Singleton pattern for model pipeline
let classificationPipeline: any = null;
let isModelLoading = false;

const initializeModel = async () => {
  if (classificationPipeline || isModelLoading) {
    return classificationPipeline;
  }
  
  isModelLoading = true;
  try {
    console.log('Loading AI model for food classification...');
    classificationPipeline = await pipeline(
      'image-classification',
      'microsoft/resnet-50',
      { device: 'webgpu' }
    );
    console.log('AI model loaded successfully');
    return classificationPipeline;
  } catch (error) {
    console.warn('WebGPU not available, falling back to CPU');
    classificationPipeline = await pipeline(
      'image-classification',
      'microsoft/resnet-50'
    );
    return classificationPipeline;
  } finally {
    isModelLoading = false;
  }
};

const foodKeywords = {
  fresh: ['fresh', 'ripe', 'green', 'crisp', 'bright', 'firm'],
  expiring: ['soft', 'yellow', 'brown', 'spotted', 'aging'],
  rotten: ['rotten', 'moldy', 'dark', 'spoiled', 'decay', 'bad']
};

const foodTips = {
  apple: {
    fresh: [
      'Store in refrigerator to extend freshness',
      'Keep away from other fruits to prevent premature ripening',
      'Check for soft spots daily',
      'Best consumed within a week for optimal taste'
    ],
    expiring: [
      'Consume within 1-2 days',
      'Perfect for baking or cooking',
      'Store in cool, dry place',
      'Small brown spots are normal but check regularly'
    ],
    rotten: [
      'Do not consume - shows signs of spoilage',
      'Dispose of safely to prevent contamination',
      'Check other produce for similar signs'
    ]
  },
  banana: {
    fresh: [
      'Store at room temperature until ripe',
      'Separate from bunch to slow ripening',
      'Avoid refrigeration when green',
      'Perfect for eating fresh or smoothies'
    ],
    expiring: [
      'Consume within 1-2 days',
      'Perfect for smoothies or banana bread',
      'Brown spots indicate ripeness, still safe to eat',
      'Great for baking recipes'
    ],
    rotten: [
      'Do not consume if completely black or mushy',
      'Dispose of properly',
      'Check other bananas in bunch'
    ]
  },
  default: {
    fresh: [
      'Store in optimal conditions as per food type',
      'Check regularly for signs of spoilage',
      'Consume while at peak freshness',
      'Follow proper storage guidelines'
    ],
    expiring: [
      'Consume within 1-2 days',
      'Consider cooking or processing',
      'Check for any signs of spoilage',
      'Store in cooler conditions if possible'
    ],
    rotten: [
      'Do not consume - shows signs of spoilage',
      'Dispose of safely',
      'Clean storage area to prevent contamination'
    ]
  }
};

const determineFreshnessStatus = (predictions: any[], foodType: string): { status: 'fresh' | 'expiring' | 'rotten', confidence: number } => {
  // Analyze predictions to determine freshness
  const topPrediction = predictions[0];
  const label = topPrediction.label.toLowerCase();
  
  // Simple heuristic based on common indicators
  if (label.includes('fresh') || label.includes('ripe') || topPrediction.score > 0.8) {
    return { status: 'fresh', confidence: topPrediction.score };
  } else if (label.includes('brown') || label.includes('spot') || topPrediction.score > 0.6) {
    return { status: 'expiring', confidence: topPrediction.score };
  } else {
    return { status: 'rotten', confidence: Math.max(0.5, topPrediction.score) };
  }
};

const extractFoodType = (predictions: any[]): string => {
  // Extract food type from predictions
  const topPrediction = predictions[0];
  const label = topPrediction.label.toLowerCase();
  
  // Common food mappings
  if (label.includes('apple')) return 'Apple';
  if (label.includes('banana')) return 'Banana';
  if (label.includes('orange')) return 'Orange';
  if (label.includes('tomato')) return 'Tomato';
  if (label.includes('potato')) return 'Potato';
  if (label.includes('carrot')) return 'Carrot';
  if (label.includes('cucumber')) return 'Cucumber';
  if (label.includes('pepper')) return 'Bell Pepper';
  if (label.includes('lettuce') || label.includes('cabbage')) return 'Leafy Greens';
  
  // Fallback to first word of prediction
  return topPrediction.label.split(',')[0].trim() || 'Unknown Food';
};

export const analyzeFood = async (imageData: string): Promise<FoodAnalysisResult> => {
  try {
    const model = await initializeModel();
    
    console.log('Analyzing food image...');
    const predictions = await model(imageData);
    console.log('Classification results:', predictions);
    
    if (!predictions || predictions.length === 0) {
      throw new Error('No predictions returned from model');
    }
    
    const foodType = extractFoodType(predictions);
    const { status, confidence } = determineFreshnessStatus(predictions, foodType);
    
    // Get appropriate tips
    const foodKey = foodType.toLowerCase();
    const tips = (foodTips as any)[foodKey]?.[status] || foodTips.default[status];
    
    // Calculate days remaining based on status
    let daysRemaining: number | undefined;
    if (status === 'fresh') {
      daysRemaining = Math.floor(Math.random() * 7) + 3; // 3-10 days
    } else if (status === 'expiring') {
      daysRemaining = Math.floor(Math.random() * 3) + 1; // 1-3 days
    }
    
    return {
      status,
      confidence,
      foodType,
      daysRemaining,
      tips
    };
  } catch (error) {
    console.error('Error in food analysis:', error);
    throw new Error('Failed to analyze food image. Please try again with a clearer image.');
  }
};