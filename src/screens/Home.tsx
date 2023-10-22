import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import {
  Layout,
  Button,
  Text,
  Section,
  SectionContent,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import TinderCard from 'react-tinder-card'

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [data, setData] = useState(undefined);
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

  return (<View style={styles.container}>
    <View style={styles.cardContainer}>
      {loading && <Text>Loading...</Text>}
      {data && data?.map((dog) =>
        <TinderCard key={dog.name}>
          <View style={styles.card}>
            <ImageBackground style={styles.cardImage} source={{ uri: dog.image }}>
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>{dog.name}</Text>
              </View>
            </ImageBackground>
          </View>
        </TinderCard>
      )}
    </View>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },

  cardContainer: {
    width: '90%',
    maxWidth: 300,
    height: 400,
  },
  card: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 300,
    height: 400,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  cardTitle: {
    color: '#000',
    fontSize: '40px',
    fontWeight: 'bold',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    margin: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12
  },
  infoText: {
    height: 28,
    justifyContent: 'center',
    display: 'flex',
    zIndex: -100,
  }
});