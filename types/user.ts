export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  daily_calorie_goal: number;
  protein_goal_g: number;
  carbs_goal_g: number;
  fat_goal_g: number;
  created_at: string;
  updated_at: string;
}

