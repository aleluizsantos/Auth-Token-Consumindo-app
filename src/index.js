import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
} from 'react-native';

import api from './services/api';

export default class App extends Component {

  state = {
    loggedInUser: null,
    errorMessage: null,
    projects: [],
  }

  //Realizar o Authenticate
  singIn = async () => {
      try {
        //Realizar a requisição, no backend solicitando authenticação, retorna user e token
      const response = await api.post('/auth/authenticate', {
        email: 'aleluizsantos@gmail.com',
        password: '123456',
      })

      // //Capturar o usuário e o token
      const { user, token } = response.data;

      // //Salvar o usuario e token em uma estrutura de dados asyncStorage - chave e valor
      await AsyncStorage.multiSet([
        ['@CodeApi:Token', token],
        ['@CodeApi:user', JSON.stringify(user)],
      ]); 

      // useAsyncStorage.setItem('@CodeApi:Token', token);
      // useAsyncStorage.setItem('@CodeApi:user', JSON.stringify(user));

      this.setState({ loggedInUser: user });

      Alert.alert('Login', 'Login com sucesso!');
       
    } catch (response) {
      this.setState({ errorMessage: response.data.error })  ;
    }
  };

  //Listar os Projetos
  getProjetList = async() => {
     try {
        const response = await api.get('/projects');

        const { projects } = response.data;

        this.setState({ projects: projects })
        
     } catch (error) { 
       this.setState({ errorMessage: response.data.error })
    }
  };

  clearAsyncStorage = () => {
    AsyncStorage.clear();
    this.setState( { errorMessage: null });
    this.setState( { loggedInUser: null });
    this.setState( { projects: [] });
  };

  //Assim que o componente for montado executar a ação
  async componentDidMount(){  
    const token = await AsyncStorage.getItem('@CodeApi:Token');
    const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:user'));

    if(token && user)
      this.setState({ loggedInUser: user });
  }; 

  render() {
    return (
      <View style={ styles.container }>
        { !!this.state.loggedInUser && <Text> {this.state.loggedInUser.name} </Text> }
        { !!this.state.errorMessage && <Text> {this.state.errorMessage} </Text> }
        { this.state.loggedInUser ? <Button onPress={this.getProjetList} title='Carregar'/> : <Button onPress={ this.singIn } title='Entrar' /> }

        { !!this.state.loggedInUser && <Button onPress={this.clearAsyncStorage} title='offline' />}

        { this.state.projects.map(project => (
          <View key={project._id} style={{marginTop: 15}}>
            <Text style={{ fontWeight: 'bold' }}>{ project.title }</Text>
            <Text>{ project.description }</Text>
          </View>
        )) }

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
});
