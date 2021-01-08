import React, { Component } from "react"
import { Button, Linking, Text, View, TextInput, StyleSheet, FlatList } from "react-native"

import * as Location from 'expo-location'


const Item = ({item}) => (
    <View style={item.mine ? styles.chatMine : styles.chatNotMine}>
        <Text style={{
            fontWeight: 'bold'
        }}>{item.username}</Text>
        {
            item.type == 'message' ?
                <Text>{item.message}</Text>
            : item.type == 'location' ?
                <View  style = {{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignContent: 'center'
                }}>
                    <Text style={{}}>
                        {`Location share:\n${item.message.latitude}, ${item.message.longitude}`}
                    </Text>
                    <Button title='Show directions' onPress={() => {
                        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item.message.latitude},${item.message.longitude}`)
                    }} />
                </View>: ''
                
        }
    </View>
)


export default class ChatPage extends Component{
    constructor(props){
        super(props)

        this.state = {
            loaction_perm: null,
            message: '',
            messages: [],
            ws: null
        }   
    }

    componentDidMount(){
        this.state.ws = new WebSocket('ws://192.168.1.236:8080');
        this.state.ws.onopen = () => {
            this.state.ws.send(JSON.stringify({
                type: 'auth',
                data: this.props.route.params.token
            }))
        }

        let id = 0;

        this.state.ws.onmessage = e => {
            try{
                const {username, type, data} = JSON.parse(e.data)
                
                if(type == 'message'){
                    this.setState({
                        messages: 
                        [
                            ...this.state.messages,
                            {
                                id: `${++id}`,
                                username,
                                type,
                                message: data,
                                mine: username == this.props.route.params.username
                            }
                        ]
                    })
                }
                if(type == 'location'){
                    this.setState({
                        messages: 
                        [
                            ...this.state.messages,
                            {
                                id: `${++id}`,
                                username,
                                type,
                                message: data,
                                mine: username == this.props.route.params.username
                            }
                        ]
                    })
                }

            }catch(e){console.error(e)}
        }
    }

    componentWillUnmount(){
        if(this.state.ws.readyState === WebSocket.OPEN)
            this.state.ws.close()
    }

    _handleSend(){
        if(!this.state.ws)
            return

        if(this.state.ws.readyState !== WebSocket.OPEN)
            return

        if(this.state.message.trim().length == 0)
            return

        this.state.ws.send(JSON.stringify({
            type: 'message',
            data: this.state.message.trim()
        }))

        this.setState({
            message: ''
        })
    }

    async _handleGPS(){
        if(!this.state.ws)
            return

        if(this.state.ws.readyState !== WebSocket.OPEN)
            return

        if(this.state.loaction_perm !== 'granted'){
            let {status} = await Location.requestPermissionsAsync()
            this.state.loaction_perm = status
        }

        if(this.state.loaction_perm !== 'granted')
            return

        try{
            let location = await Location.getCurrentPositionAsync({})
            
            this.state.ws.send(JSON.stringify({
                type: 'location',
                data: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }
            }))
        }catch(e){console.error(e)}
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.chat}>
                    <FlatList
                        style={{paddingHorizontal: 16}}
                        data={this.state.messages}
                        renderItem={Item}
                        keyExtractor={item => item.id}
                        
                    />
                </View>
                <View style={styles.bottom}>
                    <Button title="GPS" style={{flex: 1}}
                        onPress={async () => await this._handleGPS()}
                    />
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 9, marginHorizontal: 8 }}
                        placeholder="Message..."
                        value={this.state.message}
                        onChangeText={message => this.setState({
                            message
                        })}
                    />
                    <Button title="Send" style={{flex: 1}}
                        onPress={() => this._handleSend()}
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    chat:{
        flex: 1,
        paddingVertical: 8,
    },
    bottom:{
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingBottom: 8
    },
    chatMine:{
        backgroundColor: 'mediumseagreen',
        padding: 8,
        marginVertical: 8,
        marginLeft: 16,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        borderTopRightRadius: 16
    },
    chatNotMine:{
        backgroundColor: 'skyblue',
        padding: 8,
        marginVertical: 8,
        marginRight: 16,
        borderTopLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTopRightRadius: 16
    }
});