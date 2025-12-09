import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';


interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}


interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
  };
}

export default function App() {
  const [city, setCity] = useState<string>('');
  const [temperature, setTemperature] = useState<number | null>(null);

  const fetchWeather = async () => {
    try {
       const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json`
      );
      const geoData: NominatimResult[] = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        Alert.alert('Kaupunkia ei löytynyt!');
        return;
      }

      const { lat, lon } = geoData[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const weatherData: OpenMeteoResponse = await weatherResponse.json();

      setTemperature(weatherData.current_weather.temperature);
    } catch (error: any) {
      Alert.alert('Virhe haettaessa säätä', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>lämpötila</Text>
      <TextInput
        style={styles.input}
        placeholder="Kaupunki"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Hae lämpötila" onPress={fetchWeather} />
      {temperature !== null && (
        <Text style={styles.temp}>
          lämpötila: {temperature}°C 
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', width: '100%', padding: 10, marginBottom: 10 },
  temp: { fontSize: 24, marginTop: 20 },
});
