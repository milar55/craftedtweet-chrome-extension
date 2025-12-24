export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  user_id: string;
  image_url: string;
  meal_type: MealType;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence_score: number;
  logged_at: string;
}

export interface CreateMealInput {
  user_id: string;
  image_url: string;
  meal_type: MealType;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence_score: number;
}

