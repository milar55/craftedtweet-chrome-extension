import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

export interface NutritionAnalysis {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

/**
 * Analyzes a meal photo using Gemini AI via a Supabase Edge Function.
 * This keeps the API key secure on the server.
 */
export async function analyzeMeal(
  imageUri: string,
  mealType: string
): Promise<NutritionAnalysis> {
  try {
    // Convert image to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-meal', {
      body: { imageBase64: base64, mealType },
    });

    if (error) {
      console.error('Error invoking analyze-meal function:', error);
      throw new Error('Failed to analyze meal. Please try again.');
    }

    return data as NutritionAnalysis;
  } catch (error) {
    console.error('analyzeMeal error:', error);
    throw error;
  }
}

