import { TextInput, Text, StyleSheet, View, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';


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

    const typeColorsArray = [
        { type: "normal", color: "#A8A77A" },
        { type: "fire", color: "#EE8130" },
        { type: "water", color: "#6390F0" },
        { type: "electric", color: "#F7D02C" },
        { type: "grass", "color": "#7AC74C" },
        { type: "ice", "color": "#96D9D6" },
        { type: "fighting", "color": "#C22E28" },
        { type: "poison", "color": "#A33EA1" },
        { type: "ground", "color": "#E2BF65" },
        { type: "flying", "color": "#A98FF3" },
        { type: "psychic", "color": "#F95587" },
        { type: "bug", "color": "#A6B91A" },
        { type: "rock", "color": "#B6A136" },
        { type: "ghost", "color": "#735797" },
        { type: "dragon", "color": "#6F35FC" },
        { type: "dark", "color": "#705746" },
        { type: "steel", "color": "#B7B7CE" },
        { type: "fairy", "color": "#D685AD" }
    ];
 
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
    <View style={styles.Background}>
        <View style={styles.SearchScreen}>
            <Text style={styles.Titel}>Search</Text>
            <TextInput style={styles.Search} placeholder='Search Pokémon...' placeholderTextColor={"#999"} ref={inputRef} onChangeText={setSearchText}/>
        </View>
        <View style={styles.Body}>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            {searchText !== "" && errorMsg ? 
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ color: 'red', textAlign: 'center', marginTop: 30, fontSize: 20}}>{errorMsg}</Text> 
                    <MaterialIcons name="error" size={50} color="red" />
                </View>
                : 
                null}
                </View>         
            <FlatList
                data={pokemonData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                        <View style={{ alignItems: 'center', borderBottomWidth: 1, marginBottom: 10, borderBottomColor: '#000000w' }}>
                            <TouchableOpacity onPress={() => { setModalImage(item.image); setModalVisible(true); }}>
                                <Image source={{uri: item.image}}  style={{width : 150, height: 150, alignContent : "center"}}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 24, color: "#000000" }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                        <Text style={{ fontSize: 18, color: "#666" }}>ID: {item.id}</Text>
                        <Text style={{ fontSize: 18, color: "#666" }}>Weight: {item.weight} kg</Text>
                        <Text style={{ fontSize: 20, color: "#00000", marginTop: 20 }}>Types:</Text>
                        {item.types.map((type, index) => {
                            const typeColor = typeColorsArray.find(t => t.type === type)?.color || '#000';
                            return (
                                <Text key={index} style={{alignSelf: "flex-start", padding: 4, paddingEnd: 8, borderRadius: 5, margin: 3, fontSize: 16, backgroundColor: typeColor }}> {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                            );
                        })}

                        <Text style={{ fontSize: 20, color: "#00000", marginTop: 20 }}>Moves</Text>

                        {item.attribute1.slice(0,4).map((move, index) => (
                            <Text key={index} style={{ fontSize: 16, color: "#666" }}>Move {index + 1}: {move.charAt(0).toUpperCase() + move.slice(1)}</Text>
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
            <View style={{backgroundColor: "#ADD8E6", opacity: 0.95, flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Image source={{uri: selectedImage ? selectedImage : undefined}} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#ADD8E6', padding: 10, borderRadius: 5 }}>
                    <AntDesign name="close" size={24} color="black" />  
                </TouchableOpacity>
            </View>
        </Modal>        

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
        marginTop: 0,
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: '100%',
    }
} );