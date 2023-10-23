import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Layout, Text, Button } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { Ionicons } from "@expo/vector-icons";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [data, setData] = useState(undefined);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch profile data from DB
  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('profiles').select().eq("user_id", user.id).single()
    if (error) {
      throw error
    }
    setData(data)
    setLoading(false)
  }

  // Load data after UI
  useEffect(() => {
    fetchData()
      .catch((e) => console.log(e))
  }, [])
  return (
    <Layout
    >
      {data && (
        <View
          style={{
            flex: 1,
            padding: 18
          }}
        >
          <Text size="h3">{data.name}</Text>
          <Image
            source={{ uri: data.image }}
            style={{
              height: 400,
              width: 300
            }}
          />
          <Button
            text={"Edit"}
            onPress={() => {
              navigation.navigate('Edit')
            }}
            style={{
              marginTop: 20,
            }}
            disabled={loading}
          />
        </View>
      )}

    </Layout>
  );
}
