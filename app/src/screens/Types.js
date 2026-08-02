import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Chip } from 'react-native-paper';
import AppLoading from '../components/InnerLoading';
import { getProductTypes } from '../config/DataApp';

export default function Types({ navigation }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getProductTypes().then((response) => {
      setItems(Array.isArray(response) ? response : []);
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) return <AppLoading />;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {items.map((item) => (
          <Chip
            key={item.id}
            icon="tag"
            mode="outlined"
            onPress={() => navigation.navigate('singletype', { id: item.id, title: item.title })}
          >
            {item.title}
          </Chip>
        ))}
      </View>
    </ScrollView>
  );
}
