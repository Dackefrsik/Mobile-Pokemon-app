import { TextInput, Text, StyleSheet, View, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {style} from "../style/style";
import {typeColorsArray} from "../style/typecolor";


type image = {
    front_default: string;
};


export interface Pokemon {
    name: string;
    image: string;
    id: string;
    weight: string;
    attribute1: string[];
    types: string[];
    url: string;
}

export interface PokemonApiResponse {
    name: string;
    sprites: image;
    id: number;
    moves: { move: { name: string; url: string } }[];
    types: { type: { name: string; url: string } }[];
    weight: number;
}


export default function SearchScreen() {

    const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const inputRef = useRef<TextInput>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setModalImage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");
 
    useEffect(() => {

        const fetchData = async () => {
        try {
            setErrorMsg("");
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + searchText.toLowerCase().trim());
            const data: PokemonApiResponse = await response.json();
            const abilityNames = data.moves.map(a => a.move.name);
            const types = data.types.map(t => t.type.name);
            setPokemonData([{ name: data.name, image: data.sprites.front_default , id: data.id.toString(), weight: data.weight.toString(), attribute1: abilityNames, types: types , url: '' }]);
        
        } catch (error) {
            setPokemonData([]);
            setErrorMsg("Failed to fetch Pokémon data!");
            console.log(errorMsg);
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    };

    fetchData();

    }, [searchText]);

  return (
    <View style={style.Background}>
        <View style={styles.SearchScreen}>
            <Text style={style.Titel}>Search</Text>
            <TextInput style={styles.Search} placeholder='Search Pokémon...' placeholderTextColor={"#999"} ref={inputRef} onChangeText={setSearchText}/>
        </View>
        <View style={styles.Body}>
            {searchText !== "" && errorMsg ? 
                <View style={styles.SearchErrorMsg}>
                    <Text style={styles.ErrorText}>{errorMsg}</Text> 
                    <MaterialIcons name="error" size={50} color="red" />
                </View>
                : 
                null}
                     
            <FlatList
                data={pokemonData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={style.ListItem}>
                        <View style={styles.PokémonImageView}>
                            <TouchableOpacity onPress={() => { setModalImage(item.image); setModalVisible(true); }}>
                                <Image source={{uri: item.image}}  style={styles.PokémonImage}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={style.PokémonName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                        <Text style={style.PokémonAtributes}>ID: {item.id}</Text>
                        <Text style={style.PokémonAtributes}>Weight: {item.weight} kg</Text>
                        <Text style={style.PokémonTypesMoves}>Types:</Text>
                        {item.types.map((type, index) => {
                            const typeColor = typeColorsArray.find(t => t.type === type)?.color || '#000';
                            return (
                                <Text key={index} style={[style.PokémonType, {backgroundColor: typeColor }]}> {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                            );
                        })}

                        <Text style={style.PokémonTypesMoves}>Moves</Text>

                        {item.attribute1.slice(0,4).map((move, index) => (
                            <Text key={index} style={style.PokémonMoves}>Move {index + 1}: {move.charAt(0).toUpperCase() + move.slice(1)}</Text>
                        ))}
                   
                    </View>
                )}
            />
        </View>

        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            >
            <View style={styles.ModalBackground}>
                <Image source={{uri: selectedImage ? selectedImage : undefined}} style={styles.ModalImage} resizeMode="contain" />
                <TouchableOpacity onPress={() => setModalVisible(false)} style={style.ModalClose}>
                    <AntDesign name="close" size={24} color="black" style={style.ModalCloseIcon}/>  
                </TouchableOpacity>
            </View>
        </Modal>        

    </View> 
  );
}

const styles = StyleSheet.create({

    SearchScreen:{
        backgroundColor: '#ff3333',
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
        marginTop: 0,
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: '100%',
    }, 

    ModalImage:{ 
        width: '100%', 
        height: '100%' 
    },

    ErrorText:{
        color: 'red', 
        textAlign: 'center', 
        marginTop: 30, 
        fontSize: 20
    },

    PokémonImage:{
        width : 150, 
        height: 150, 
        alignContent : "center"
    },

    PokémonImageView:{ 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        marginBottom: 10, 
        borderBottomColor: '#000000w' 
    }, 

    SearchErrorMsg:{
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 20
    },

    ModalBackground:{
        backgroundColor: "#ADD8E6", 
        opacity: 0.95, 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    }
    
} );