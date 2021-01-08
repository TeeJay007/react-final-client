import React, { Component } from "react";
import { Button, View, TextInput, StyleSheet } from "react-native";

export default class RegisterPage extends Component{
    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            password_confirm: ''
        }
    }

    _handleRegister(){
        if(this.state.password !== this.state.password_confirm){
            alert('Passwords do not match.')
            return
        }

        fetch('http://192.168.1.236:3000/register', {
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
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        placeholder="Confirm password"
                        secureTextEntry={true}
                        onChangeText={text => this.setState({
                            password_confirm: text
                        })}
                    />
                </View>
                <View style={styles.item}>
                    <Button title="Register" 
                        onPress={() => this._handleRegister()}
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