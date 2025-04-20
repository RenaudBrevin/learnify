import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from "../components/LogoutButton";

const Settings = () => {
    const [enableNotifications, setEnableNotifications] = useState(false);
    const [notificationTime, setNotificationTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        loadSettings();
        checkNotificationPermissions();
    }, []);

    useEffect(() => {
        saveSettings();
        if (enableNotifications) {
            scheduleNotification();
        } else {
            cancelNotification();
        }
    }, [enableNotifications, notificationTime]);

    const loadSettings = async () => {
        try {
            const savedEnableNotifications = await AsyncStorage.getItem('enableNotifications');
            const savedNotificationTime = await AsyncStorage.getItem('notificationTime');
            
            if (savedEnableNotifications !== null) {
                setEnableNotifications(JSON.parse(savedEnableNotifications));
            }
            
            if (savedNotificationTime !== null) {
                setNotificationTime(new Date(JSON.parse(savedNotificationTime)));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('enableNotifications', JSON.stringify(enableNotifications));
            await AsyncStorage.setItem('notificationTime', JSON.stringify(notificationTime.toISOString()));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const checkNotificationPermissions = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (newStatus !== 'granted') {
                alert('Vous devez autoriser les notifications pour utiliser cette fonctionnalité.');
                setEnableNotifications(false);
            }
        }
    };

    const scheduleNotification = async () => {
        await cancelNotification();
        
        const hours = notificationTime.getHours();
        const minutes = notificationTime.getMinutes();
        
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Rappel de révision",
                body: "C'est l'heure de réviser !",
                sound: true,
            },
            trigger: {
                hour: hours,
                minute: minutes,
                repeats: true,
            },
        });
    };

    const cancelNotification = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setNotificationTime(selectedTime);
        }
    };

    const showTimePickerHandler = () => {
        setShowTimePicker(true);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Paramètres</Text>
            
            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Notifications de révision</Text>
                <Switch
                    value={enableNotifications}
                    onValueChange={setEnableNotifications}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={enableNotifications ? '#4a86f7' : '#f4f3f4'}
                />
            </View>
            
            {enableNotifications && (
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Heure de rappel</Text>
                    <TouchableOpacity onPress={showTimePickerHandler} style={styles.timeButton}>
                        <Text style={styles.timeText}>{formatTime(notificationTime)}</Text>
                    </TouchableOpacity>
                </View>
            )}
            
            {showTimePicker && (
                <DateTimePicker
                    value={notificationTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
            
            <View style={styles.logoutContainer}>
                <LogoutButton />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 40,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingLabel: {
        fontSize: 16,
    },
    timeButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    timeText: {
        fontSize: 16,
        color: '#4a86f7',
    },
    logoutContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
});

export default Settings;