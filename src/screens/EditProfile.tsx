import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Layout, Text, Button, TextInput } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { Ionicons } from "@expo/vector-icons";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [data, setData] = useState(undefined);
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

  const saveData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        description: data.description,
        image: data.image,
        age: data.age
      })
      .eq('user_id', user.id)

    if (error) {
      throw error
    }

    navigation.pop(1)
  }

  useEffect(() => {
    fetchData()
      .catch((e) => console.log(e))
  }, [])
  return (
    <Layout
      style={{ margin: 18 }}
    >
      {loading && <Text>Loading...</Text>}
      {data && (
        <>
          <View style={{ marginBottom: 9 }}>

            <Text style={{ marginBottom: 10 }}>Dogs name</Text>
            <TextInput
              placeholder="Your dogs name"
              value={data.name}
              onChangeText={
                (val) => {
                  setData({
                    ...data,
                    name: val
                  })
                }}
              leftContent={
                <Ionicons name="happy-outline" size={20} />
              }
            />
          </View>
          <View style={{ marginBottom: 9 }}>
            <Text style={{ marginBottom: 10 }}>Description</Text>
            <TextInput
              onChangeText={
                (val) => {
                  setData({
                    ...data,
                    description: val
                  })
                }}
              placeholder="My dog is a..."
              value={data.description}
            />
          </View>
          <View style={{ marginBottom: 9 }}>
            <Text style={{ marginBottom: 10 }}>Age</Text>
            <TextInput
              placeholder="8"
              value={String(data.age)}
              onChangeText={
                (val) => {
                  setData({
                    ...data,
                    age: Number(val)
                  })
                }}
            />
          </View>
          <View style={{ marginBottom: 9 }}>
            <Text style={{ marginBottom: 10 }}>Url to dog picture</Text>
            <TextInput
              placeholder="https://..."
              value={data.image}
              onChangeText={
                (val) => {
                  setData({
                    ...data,
                    image: val
                  })
                }}
            />
          </View>
          <Button
            text={"Save"}
            onPress={() => {
              saveData()
            }}
            style={{
              marginTop: 20,
            }}
            disabled={loading}
          />
        </>
      )}
    </Layout>
  );
}
