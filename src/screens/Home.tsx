import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  SectionImage,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [data, setData] = useState(undefined);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase.from('profiles').select()
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
      <View
        style={{
          margin: 36,
          flex: 1,
        }}
      >
        {loading && <Text>Loading...</Text>}
        {data && data.length == count && (
          <Text>No more dogs...</Text>
        )}
        {data && data.length != count && (
          <Section style={{ flex: 1 }}>
            <View style={{
              height: "70%"
            }}>
              <Image
                source={{ uri: data[count].image }}
                style={{
                  height: '100%'
                }}
              />
            </View>
            <SectionContent>
              <Text size="h3">{data[count].name}, {data[count].age} years</Text>
              <Text>{data[count].description}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Button text="Match" status="success"
                  leftContent={
                    <Ionicons name="checkmark-outline" size={20} color="white" />
                  }
                  onPress={() => setCount(count + 1)}
                />

                <Button text="Reject" status="danger"
                  leftContent={
                    <Ionicons name="close-outline" color="white" size={20} />
                  }
                  onPress={() => setCount(count + 1)}
                />

              </View>
            </SectionContent>
          </Section>
        )}

      </View >
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
  },
});