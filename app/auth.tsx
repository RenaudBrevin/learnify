import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { handleAuth } from '../utils/actions';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    handleAuth(email, password, name, isLogin);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FlashCards App</Text>
            <Text style={styles.subtitle}>{isLogin ? 'Connexion' : 'Inscription'}</Text>

            <View style={styles.inputContainer}>
                {!isLogin && (
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAuth(email, password, name, isLogin)}
                >
                    <Text style={styles.buttonText}>
                        {isLogin ? 'Se connecter' : 'S\'inscrire'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.switchButton}
                    onPress={() => setIsLogin(!isLogin)}
                >
                    <Text style={styles.switchText}>
                        {isLogin
                            ? 'Pas encore de compte ? S\'inscrire'
                            : 'Déjà un compte ? Se connecter'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Auth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 30,
        textAlign: 'center',
        color: '#666',
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        paddingLeft: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#4285F4',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchText: {
        color: '#4285F4',
        fontSize: 14,
    },
});