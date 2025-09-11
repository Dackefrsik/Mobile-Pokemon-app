import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Pokemon {
    name: string;
    id: string;
    url: string;
}

export interface PokemonApiResponse {
    results: Pokemon[];
}

interface PokemonDetails {
    id: number;
    name: string;
    sprites: {
       front_default: string;
    };
    types: { type: { name: string } }[];
}

export default function Pokemons() {

        const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

        const [detailedData, setDetailedData] = useState<PokemonDetails[]>();

        const [errorMsg, setErrorMsg] = useState("");

        const [loadingText, setLoadingText] = useState("Loading Pokémons"); 
   
        const text = useRef<Text>(null);

    useEffect(() => {
        const loadingInterval = setInterval(() => {
            console.log(loadingText.length);
            if(loadingText.length >= 18) {
               
            }
            else{
                setLoadingText((prev) => prev + ".");
            }
            }, 2000);
        const fetchData = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=300');
            const data: PokemonApiResponse = await response.json();
            setPokemonData(data.results);

            const details = await Promise.all(data.results.map(async (pokemon) => {
                const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon.name);
                return res.json();
            }));
            
            clearInterval(loadingInterval);

            setDetailedData(details);

        } catch (error) {

            setErrorMsg("Failed to fetch Pokémon data.");

            console.log(errorMsg)
        }  
    };

    fetchData();

    }, []);

    
    
    return (
        <View style={Style.Background}>
            <Text style={Style.Titel}>Pokémons</Text>
            <View style={Style.Body}>
            {detailedData ?   <FlatList
                data={detailedData}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                        {item.sprites?.front_default ? (
                        <Image source={{uri : item.sprites.front_default}} style={{width : 100, height: 100}}/>
                        ) : ( <Text style={{ fontSize: 18 }}>No Image</Text>)}
                        <Text style={{ fontSize: 18 }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                        <Text style={{fontSize: 12, color: "#666"}}>ID: {item.id}</Text>
                    </View>
                )}
            /> 
            : 
            
            <Text style={{ fontSize: 28, textAlign: 'center', marginTop: 40 }}>{loadingText}</Text>}
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
        paddingBottom: 80,
        
    }
});