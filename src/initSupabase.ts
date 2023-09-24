import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto'

export const supabase = createClient("https://pbzpaphgrnvhckzzqwve.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBienBhcGhncm52aGNrenpxd3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUyOTE2MzUsImV4cCI6MjAxMDg2NzYzNX0.DEP4SyY-0heU6GgOsp8DaTunJcVDtAY9B0G5KCPVZW8", {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false
});
