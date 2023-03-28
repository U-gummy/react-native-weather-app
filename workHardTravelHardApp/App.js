import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { theme } from "./colors";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState(false);
  const [toDos, setToDos] = useState({});

  const travel = () => {
    setWorking(false);
    saveWorking(false);
  };

  const work = () => {
    setWorking(true);
    saveWorking(true);
  };

  const onChangeText = (payload) => setText(payload);

  const STORAGE_KEY = "@toDos";
  const STORAGE_WORKING_KEY = "@isWorking";

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const saveWorking = async (working) => {
    await AsyncStorage.setItem(STORAGE_WORKING_KEY, JSON.stringify(working));
  };

  const loadToDos = async () => {
    const stringToDos = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(stringToDos));
  };

  const loadWorking = async () => {
    const stringWorking = await AsyncStorage.getItem(STORAGE_WORKING_KEY);
    setWorking(JSON.parse(stringWorking));
  };

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  useState(() => {
    loadToDos();
    loadWorking();
  }, []);

  const addToDo = async () => {
    if (!text) return;
    //save to do
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "#fff" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: !working ? "#fff" : theme.gray }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        style={styles.input}
        returnKeyType="done"
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        value={text}
        onChangeText={onChangeText}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View key={key} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 30,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    // color: theme.gray,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
