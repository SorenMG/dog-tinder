import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ImageBackground, FlatList, TouchableOpacity, Linking } from "react-native";
import {
  Layout,
  Button,
  Text,
  Section,
  SectionContent,
} from "react-native-rapi-ui";
import { supabase } from "../initSupabase";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [data, setData] = useState(undefined);

  // Fetch profiles from DB
  const fetchData = async () => {
    const { data, error } = await supabase.from('matches').select()
    if (error) {
      throw error
    }
    setData(data)
    console.log(data)
  }

  // Load data after UI is loaded
  useEffect(() => {
    fetchData()
      .catch((e) => console.log(e))
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) =>
          <TouchableOpacity style={styles.rowContainer} onPress={() => Linking.openURL(`tel:${item.phone_number}`)}>
            <Text>{item.matching_name}</Text>
            <Text>, {item.phone_number}</Text>
          </TouchableOpacity>

        }
      />
    </View>)
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  rowContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    flex: 1,
    flexDirection: 'row'
  }
});