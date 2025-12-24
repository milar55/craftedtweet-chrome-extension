import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Auth state change will handle navigation in _layout.tsx (Phase 2.2)
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-12 h-12 rounded-full bg-cardamomCream items-center justify-center mb-8"
          >
            <Text className="text-xl">←</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <Text className="text-deepTeal text-4xl font-poppins-bold">Welcome Back</Text>
            <Text className="text-deepTeal/60 text-lg font-poppins mt-2">
              Sign in to continue your health journey.
            </Text>
          </Animated.View>

          <View className="mt-12 gap-y-6">
            <View>
              <Text className="text-deepTeal/80 text-sm font-poppins-semibold ml-2 mb-2 uppercase tracking-widest">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-cardamomCream px-6 py-4 rounded-2xl text-deepTeal font-poppins text-lg border border-transparent focus:border-saffron"
              />
            </View>

            <View>
              <Text className="text-deepTeal/80 text-sm font-poppins-semibold ml-2 mb-2 uppercase tracking-widest">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                className="bg-cardamomCream px-6 py-4 rounded-2xl text-deepTeal font-poppins text-lg border border-transparent focus:border-saffron"
              />
            </View>

            {error && (
              <Text className="text-chilliRed font-poppins text-center px-4">
                {error}
              </Text>
            )}

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              className="mt-4"
            />
            
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')} className="mt-4">
              <Text className="text-deepTeal/60 text-center font-poppins">
                Don't have an account? <Text className="text-saffron font-poppins-bold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

