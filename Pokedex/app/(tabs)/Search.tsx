import { TextInput, Text, StyleSheet, View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

export interface Pokemon {
    name: string;
    id: string;
    url: string;
}

export interface PokemonApiResponse {
    name: string;
    id: number;
}

export default function SearchScreen() {

    const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

   

    useEffect(() => {

        const fetchData = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
            const data: PokemonApiResponse = await response.json();
            setPokemonData([{ name: data.name, id: data.id.toString(), url: '' }]);
        } catch (error) {
        console.log(error);
        }
    };

    fetchData();

    }, []);

  return (
    <View style={styles.Background}>
        <View style={styles.SearchScreen}>
            <Text style={styles.Titel}>Search</Text>
            <TextInput style={styles.Search} placeholder='Search Pokémon...' placeholderTextColor={"#999"}/>
        </View>
        <View style={styles.Body}>
            <FlatList
                data={pokemonData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                        <Text style={{ fontSize: 24, color: "#000000" }}>{item.id + " " + item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                    </View>
                )}
            /> 
        </View>
    </View> 
  );
}

const styles = StyleSheet.create({
    Background:{
        backgroundColor: '#ff3333',
        flex: 1,
    },

    SearchScreen:{
        backgroundColor: '#ff3333',
    },

    Titel:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 70,
        marginBottom: 20,
        color: '#FFFFFF',
    },

    Search: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        fontSize: 18,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 20,
    },

    Body:{
        marginTop: 100,
        flex: 1,
        backgroundColor: '#FFFFFF',
    }

} );