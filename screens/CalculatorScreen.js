import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "@react-navigation/native";
export const CalculatorScreen = () => {
    const {colors} = useTheme();
    const theme = useTheme();
    return (
        <View style={styles.container}>
            <Text style={[{color: colors.text, fontWeight: 'bold', fontSize: 60, textAlign: 'center'}]}>
                Здесь должен быть калькулятор</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
