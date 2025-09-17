import { StyleSheet } from "react-native";

export const style = StyleSheet.create({

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

    ListItem:{
        padding: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
    },

    PokémonName:{
        fontSize: 22, 
        left: 10, 
        marginBottom: 15
    },

    PokémonAtributes:{
        fontSize: 18, 
        color: "#666",
        left: 10
    },

    PokémonTypesMoves:{
        fontSize: 20, 
        left: 10, 
        marginTop: 10,
        marginBottom: 5
    },

    PokémonType:{
        fontSize: 16, 
        left: 10, 
        alignSelf: "flex-start", 
        padding: 4, 
        paddingEnd: 8, 
        borderRadius: 5, 
        margin: 3, 
    },

    PokémonMoves:{
        fontSize: 16, 
        left: 10, 
    },

    ModalClose:{
        right: 20, 
        alignItems: "flex-end"
    },

    ModalCloseIcon:{
        marginTop:20, 
        marginBottom: 10
    },

    ModalBody:{
        backgroundColor: "#ffffff", 
        flex: 1
    }
});