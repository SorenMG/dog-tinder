import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Layout, Text } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [data, setData] = useState(undefined);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('profiles').select().eq("user_id", user.id).single()
    if (error) {
      throw error
    }
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
      .catch((e) => console.log(e))
  }, [])
  return (
    <Layout>
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
              height: '100%'
            }}
          />
        </View>
      )}

    </Layout>
  );
}