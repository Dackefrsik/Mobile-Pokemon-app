import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import {style} from "../style/style";
import { typeColorsArray } from "../style/typecolor";

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
        <View style={style.Background}>
            <Text style={style.Titel}>Pokémons</Text>
            <View style={Style.Body}>
            {detailedData ?   <FlatList
                data={detailedData}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={style.ListItem}>
                        <TouchableOpacity onPress={() => {setMNodalData([{ name: item.name, image: item.sprites.front_default , id: item.id.toString(), weight: item.weight.toString(), moves: item.moves.map(m => m.move.name), types: item.types.map(t => t.type.name) , url: '' }]);
                            setModalVisible(true); }}>
                            {item.sprites?.front_default ? (
                            <Image source={{uri : item.sprites.front_default}} style={Style.ListImage}/>
                            ) : ( <Text style={{ fontSize: 18 }}>No Image</Text>)}
                            <Text style={style.PokémonName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                            <Text style={style.PokémonAtributes}>ID: {item.id}</Text>
                        </TouchableOpacity>    
                    </View>
                )}
            /> 
            : 
            
            <Text style={Style.LoadingText}>{loadingText}</Text>}
            </View>
            {modalVisible && (
                <Modal 
                    animationType="fade"
                    transparent={true}>
                        <View style={Style.ModalBackground}>
                            <View>
                                <TouchableOpacity style={style.ModalClose} onPress={() => setModalVisible(false)}>
                                    <AntDesign name="close" size={24} color="black" style={style.ModalCloseIcon} />  
                                </TouchableOpacity>
                            </View>
                            <View style={style.ModalBody}>
                                <Image source={{uri: modalData[0].image}} style={Style.ModalImage}/>
                                <Text style={style.PokémonName}>{modalData[0].name.charAt(0).toUpperCase() + modalData[0].name.slice(1)}</Text>
                                <Text style={style.PokémonAtributes}>ID: {modalData[0].id}</Text>
                                <Text style={style.PokémonAtributes}>Weight: {modalData[0].weight} kg</Text>
                                <Text style={style.PokémonTypesMoves}>Types</Text>
                                {modalData[0].types.map((type, index) =>  {
                                    const typecolor = typeColorsArray.find(t => t.type === type )?.color || "#000000";
                                    return(
                                    
                                        <Text key={index} style={[style.PokémonType, {alignSelf: "flex-start", padding: 4, paddingEnd: 8, borderRadius: 5, margin: 3, fontSize: 16, backgroundColor: typecolor}  ]} >{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                                    )
                                })}
                                <Text style={style.PokémonTypesMoves}>Moves</Text>
                                {modalData[0].moves.slice(0,4).map((m, index) => 
                                    
                                    <Text key={m} style={style.PokémonMoves}>{(index + 1) + " " + m.charAt(0).toUpperCase() + m.slice(1)}</Text>
                                
                                )
                                }
                            </View>
                        </View>
                    </Modal>)}
        </View>
    );
    }

const Style = StyleSheet.create({

    Body:{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingBottom: 80,
        
    },
    
    LoadingText:{
        fontSize: 28, 
        textAlign: 'center', 
        marginTop: 40
    },

    ModalBackground:{
        flex: 1, 
        marginTop: 50, 
        backgroundColor: '#ff3333', 
        opacity: 0.95
    }, 

    ListImage:{
        width : 100, 
        height: 100
    },

    ModalImage:{
        width: 200, 
        height: 200
    }
});