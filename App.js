import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  ActivityIndicator
} from "react-native";
import { getWeek, format, getDay, addWeeks, addDays } from "date-fns";

async function f() {
  try {
    const res = await fetch(
      "https://running-reader.netlify.com/.netlify/functions/get-weeks"
    );
    if (!res.ok) {
      return f();
    }
    return res.json();
  } catch (error) {
    return f();
  }
}
const App = () => {
  const [date, setDate] = React.useState(new Date());
  const [weeks, setWeeks] = React.useState();
  const getData = () => {
    setWeeks(undefined);
    f()
      .then(setWeeks)
      .catch(console.error);
  };
  const reset = () => setDate(new Date());
  React.useEffect(() => {
    getData();
  }, []);
  const week = weeks?.[getWeek(date) - 1];
  return (
    <View style={styles.container}>
      {weeks ? (
        <>
          <Button onPress={reset} title="Reset" />
          <Text style={styles.date}>{format(date, "EEEE MM/dd")}</Text>
          <View style={styles.middle}>
            <Button title="-1" onPress={() => setDate(addDays(date, -1))} />
            <View style={{ alignItems: "center" }}>
              <Text style={styles.week}>Week: {week?.weekly}</Text>
              <Text style={styles.mileage}>
                {week?.[getDay(date)] ?? "Couldn't find anything:("}
              </Text>
            </View>
            <Button title="+1" onPress={() => setDate(addDays(date, 1))} />
          </View>
          <Button onPress={getData} title="Refresh" />
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  middle: {
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  mileage: {
    fontSize: 60
  },
  date: {
    fontSize: 30
  },
  week: {
    fontSize: 25
  }
});

export default App;
