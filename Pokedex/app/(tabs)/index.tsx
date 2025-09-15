import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export interface Pokemon {
    name: string;
    image: string;
    weight: string;
    moves: string[];
    types: string[];
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
    weight: number;
    moves: { move: { name: string, url : string } }[];
    types: { type: { name: string, url : string } }[];
}

export default function Pokemons() {

        const [modalData, setMNodalData] = useState<Pokemon[]>([]);

        const [modalVisible, setModalVisible] = useState(false);

        const [detailedData, setDetailedData] = useState<PokemonDetails[]>();

        const [errorMsg, setErrorMsg] = useState("");

        const [loadingText, setLoadingText] = useState("Loading Pokémons"); 
   
    useEffect(() => {
        /* const loadingInterval = setInterval(() => {
            
            if(loadingText.length >= 19) {
                console.log(loadingText + " >= 18");
            }
            else{
                setLoadingText((prev) => prev + ".");
                console.log(loadingText)
                console.log(loadingText.length);
            }
            }, 2000); */

            const loadingInterval = setInterval(() => {
            if(loadingText.length >= 19) {
                console.log(loadingText + " >= 18");
            }
            else{
                setLoadingText((prev) => {
                const next = prev + ".";
                console.log(next, next.length);
                console.log();
                return next; 
            });
            }
            }, 2000);

            

        const fetchData = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=300');
            const data: PokemonApiResponse = await response.json();
            //setPokemonData(data.results);

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
    //clearInterval(loadingInterval);


    },[]);

    
    
    return (
        <View style={Style.Background}>
            <Text style={Style.Titel}>Pokémons</Text>
            <View style={Style.Body}>
            {detailedData ?   <FlatList
                data={detailedData}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                        <TouchableOpacity onPress={() => {setMNodalData([{ name: item.name, image: item.sprites.front_default , id: item.id.toString(), weight: item.weight.toString(), moves: item.moves.map(m => m.move.name), types: item.types.map(t => t.type.name) , url: '' }]);
                            setModalVisible(true); }}>
                            {item.sprites?.front_default ? (
                            <Image source={{uri : item.sprites.front_default}} style={{width : 100, height: 100}}/>
                            ) : ( <Text style={{ fontSize: 18 }}>No Image</Text>)}
                            <Text style={{ fontSize: 18 }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                            <Text style={{fontSize: 12, color: "#666"}}>ID: {item.id}</Text>
                        </TouchableOpacity>    
                    </View>
                )}
            /> 
            : 
            
            <Text style={{ fontSize: 28, textAlign: 'center', marginTop: 40 }}>{loadingText}</Text>}
            </View>
            {modalVisible && (
                <Modal 
                    animationType="fade"
                    transparent={true}>
                        <View style={{ flex: 1, marginTop: 50, backgroundColor: '#ff3333', opacity: 0.95}}>
                            <View>
                                <TouchableOpacity style={{right: 20, alignItems: "flex-end"}} onPress={() => setModalVisible(false)}>
                                    <AntDesign name="close" size={24} color="black" style={{marginTop:20, marginBottom: 10}} />  
                                </TouchableOpacity>
                            </View>
                            <View style={{backgroundColor: "#ffffff", flex: 1}}>
                                <Image source={{uri: modalData[0].image}} style={{width: 200, height: 200}}/>
                                <Text style={{fontSize: 22, left: 10, marginBottom: 15}}>{modalData[0].name.charAt(0).toUpperCase() + modalData[0].name.slice(1)}</Text>
                                <Text style={{fontSize: 18, left: 10, color: "#666"}}>ID: {modalData[0].id}</Text>
                                <Text style={{fontSize: 18, left: 10, color: "#666"}}>Weight: {modalData[0].weight} kg</Text>
                                <Text style={{fontSize: 20, left: 10, marginTop: 10}}>Types</Text>
                                {modalData[0].types.map(t => 
                                    <Text key={t} style={{fontSize: 18, left: 10, marginTop: 5}}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                                )}
                                <Text style={{fontSize: 20, left: 10, marginTop: 10, marginBottom: 10}}>Moves</Text>
                                {modalData[0].moves.slice(0,4).map((m, index) => 
                                    <Text key={m} style={{fontSize: 16, left: 10}}>{index + " " + m.charAt(0).toUpperCase() + m.slice(1)}</Text>
                                )
                                }
                            </View>
                        </View>
                    </Modal>)}
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