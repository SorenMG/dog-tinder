import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Modal, Pressable, StyleSheet } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Layout, Text, Button, TextInput } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraType } from 'expo-camera';
import { decode } from 'base64-arraybuffer'
import uuid from 'react-native-uuid';


export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [startCamera, setStartCamera] = React.useState(false)
  let camera: Camera

  // Fetch data from database
  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('profiles').select().eq("user_id", user.id).single()
    if (error) {
      throw error
    }
    setData(data)
    setLoading(false)
  }

  // Save data to database
  const saveData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        description: data.description,
        image: data.image,
        age: data.age,
        phone_number: data.phone_number,
        race: data.race
      })
      .eq('user_id', user.id)

    if (error) {
      throw error
    }

    // Navigate back
    navigation.pop(1)
  }

  // Make sure we have permissions. Open the camera modal.
  const activateCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync()
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      console.log("Denied")
    }
  }

  // Take picture, upload to Supabase bucket, update URL in local object
  const takePicture = async () => {

    // Take Picture
    if (!camera) return
    const photo = await camera.takePictureAsync({
      base64: true
    })


    // Upload file
    const path = uuid.v4() + '.jpg'
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(path, decode(photo.base64), {
        contentType: 'image/jpg'
      })

    if (error) throw error

    const url = "https://pbzpaphgrnvhckzzqwve.supabase.co/storage/v1/object/public/images/" + path

    // Update object
    setData({
      ...data,
      image: url
    })

    const { data: { user } } = await supabase.auth.getUser()

    await supabase.functions.invoke('race-verif', {
      body: { id: user.id }
    })

    // Close camera
    setStartCamera(!startCamera)
  }

  useEffect(() => {
    fetchData()
      .catch((e) => console.log(e))
  }, [])
  return (
    <Layout
      style={{ margin: 18 }}
    >
      <Modal
        animationType="slide"
        visible={startCamera}
        onRequestClose={() => {
          setStartCamera(!startCamera);
        }}>
        <Camera
          type={CameraType.back}
          style={{ flex: 1, width: "100%" }}
          ref={(r) => {
            camera = r
          }}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              flex: 1,
              width: '100%',
              padding: 20,
              justifyContent: 'space-between'
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                flex: 1,
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                onPress={takePicture}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: '#fff'
                }}
              />
            </View>
          </View>

        </Camera>
      </Modal>
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
            <Text style={{ marginBottom: 10 }}>Phone</Text>
            <TextInput
              placeholder="+45.."
              value={String(data.phone_number)}
              onChangeText={
                (val) => {
                  setData({
                    ...data,
                    phone_number: String(val)
                  })
                }}
            />
          </View>
          <View style={{ marginBottom: 9 }}>
            <Text style={{ marginBottom: 10 }}>Race</Text>
            <TextInput
              placeholder="Golden Retriever..."
              value={String(data.race)}
              onChangeText={
                (val) => {
                  setData({
                    ...data,
                    race: String(val)
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
            text={"Take Picture"}
            onPress={() => {
              activateCamera()
            }}
            style={{
              marginTop: 20,
            }}
            disabled={loading}
          />
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});