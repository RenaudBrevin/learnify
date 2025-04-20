# Learnify 📚

**Groupe : Quentin PACHEU et Brévin RENAUD**

**Learnify** est une application mobile de révision par flashcards, développée avec **React Native**, **Expo** et **Supabase**. Elle permet de créer des decks de cartes personnalisées, de s’entraîner via un mode apprentissage ou test, et de suivre ses statistiques de progression. L'application propose aussi des rappels quotidiens pour ne jamais oublier de réviser !

## 🚀 Fonctionnalités principales

- 📖 Création, édition et suppression de decks de flashcards
- 🧠 Mode apprentissage avec flip animé et marquage “connu / à revoir”
- 📝 Mode test avec QCM et score final
- 📊 Statistiques par deck
- ⏰ Notifications quotidiennes pour réviser
- 🔁 Stockage avec Supabase


## 📦 Installation

1. **Cloner le projet**  
   ```bash
   git clone https://github.com/ton-user/learnify.git
   cd learnify
   ```

2. **Installer les dépendances**  

   ```bash
   npm install
   Configurer les variables d’environnement Supabase
   Crée un fichier .env à la racine avec les clés suivantes :
   ```

3. **Lancer l'application**  

   ```bash
   npx expo start
   ```

## 📖 Login d'exemple

Vous pouvez créer et vous connecter à votre propre compte, mais nous avons également créé un compte d'exemple avec des decks et des questions préremplis.

- Login : comptexemple@gmail.com
- Mot de passe : comptexemple



Le projet utilise StyleSheet.create() pour le stylage.

La navigation est gérée avec expo-router.
