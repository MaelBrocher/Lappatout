import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Separator } from './components/Separator';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerstyle}>
        Enorme sauce</Text>
        <Separator color='red'/>
      <Image
       style={{width:500, height:200}}
       source={{
        uri:"https://i.redd.it/bkoht5hdcvc81.png"
      }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerstyle : {
    fontSize:20,
    fontWeight: "bold",
  }
});
