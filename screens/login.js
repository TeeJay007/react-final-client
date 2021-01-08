import React, { Component } from "react";
import { Button, View, TextInput, StyleSheet } from "react-native";

export default class LoginPage extends Component{
    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: ''
        }
    }

    _handleLogin(){
        fetch('http://192.168.1.236:3000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(response => response.json())
        .then(responseJSON => {
            if(!responseJSON.success){
                alert(responseJSON.error)
            }else{
                if(responseJSON.token){
                    this.props.navigation.navigate('Chat', {
                        username: this.state.username,
                        token: responseJSON.token
                    })
                }
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.item}>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        placeholder="Username"
                        onChangeText={text => this.setState({
                            username: text
                        })}
                    />
                </View>
                <View style={styles.item}>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={text => this.setState({
                            password: text
                        })}
                    />
                </View>
                <View style={styles.item}>
                    <Button title="Login" onPress={() => this._handleLogin()} />
                </View>
                <View style={styles.item}>
                    <Button title="Register" color="steelblue" 
                        onPress={() => this.props.navigation.navigate('Register')}
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
    item:{
        paddingVertical: 8,
        paddingHorizontal: 16
    }
});