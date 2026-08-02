import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostTags from '../components/PostTags';

export default function Tags() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 10}}>
        <PostTags />
      </View>
    </SafeAreaView>
  );
}
