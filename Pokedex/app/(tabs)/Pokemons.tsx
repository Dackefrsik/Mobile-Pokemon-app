import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export interface Pokemon {
    name: string;
    id: string;
    url: string;
}

export interface PokemonApiResponse {
    results: Pokemon[];
}

export default function Pokemons() {

        const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

   

    useEffect(() => {

        const fetchData = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
            const data: PokemonApiResponse = await response.json();
            setPokemonData(data.results);
        } catch (error) {
        console.log(error);
        }
    };

    fetchData();

    }, []);

    return (
        <View style={Style.Background}>
            <Text style={Style.Titel}>Pokémons</Text>
            <View style={Style.Body}>
                <FlatList
                data={pokemonData}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                        <Text style={{ fontSize: 18 }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                    </View>
                )}
            /> 
            </View>
        </View>
    );
    }

const Style = StyleSheet.create({

    Background:{
        backgroundColor: '#ff3333',
        flex: 1,
    },

    Titel:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 70,
        marginBottom: 20,
        color: '#FFFFFF',
    },

    Body:{
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});