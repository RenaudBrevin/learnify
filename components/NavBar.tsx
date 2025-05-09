import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Layers, Home, CreditCard, Settings, HelpCircle } from 'react-native-feather';

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (routeName: string) => {
    return pathname === routeName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navItem, isActive('/') && styles.activeNavItem]}
        onPress={() => router.push('/')}
      >
        <Home
          stroke={isActive('/') ? '#6366F1' : '#6B7280'}
          width={24}
          height={24}
        />
        <Text style={[styles.navText, isActive('/') && styles.activeNavText]}>Accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/card') && styles.activeNavItem]}
        onPress={() => router.push('/card')}
      >
        <CreditCard
          stroke={isActive('/card') ? '#6366F1' : '#6B7280'}
          width={24}
          height={24}
        />
        <Text style={[styles.navText, isActive('/card') && styles.activeNavText]}>Carte</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/sessions') && styles.activeNavItem]}
        onPress={() => router.push('/sessions')}
      >
        <HelpCircle
          stroke={isActive('/sessions') ? '#6366F1' : '#6B7280'}
          width={24}
          height={24}
        />
        <Text style={[styles.navText, isActive('/sessions') && styles.activeNavText]}>Quizz</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/settings') && styles.activeNavItem]}
        onPress={() => router.push('/settings')}
      >
        <Settings
          stroke={isActive('/settings') ? '#6366F1' : '#6B7280'}
          width={24}
          height={24}
        />
        <Text style={[styles.navText, isActive('/settings') && styles.activeNavText]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeNavItem: {
    borderTopWidth: 3,
    borderTopColor: '#6366F1',
    paddingTop: 2,
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: '#6B7280',
  },
  activeNavText: {
    color: '#6366F1',
    fontWeight: '500',
  },
});