/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { DevToolsBubble } from 'react-native-react-query-devtools';
import SettingScreen from './src/screens/SettingScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DetailScreen from './src/screens/DetailScreen';
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'

function App(): React.JSX.Element {
    const queryClient = new QueryClient();
    const bottomTabNav = createBottomTabNavigator({
        screens: {
            Home: HomeScreen,
            Setting: SettingScreen,
        },
    })

    const asyncStoragePersister = createAsyncStoragePersister({
        storage: AsyncStorage
    })

    React.useEffect(() => {
        persistQueryClient({
            queryClient,
            persister: asyncStoragePersister,
        })
    }, [])

    const rootStack = createNativeStackNavigator({
        screens: {
            RootBottom: {
                screen: bottomTabNav,
                options: { headerShown: false }
            },
            Detail: {
                screen: DetailScreen,
                options: {
                    headerBackVisible: true,
                },
            },
        },
    })

    const Navigation = createStaticNavigation(rootStack);

    return (
        <QueryClientProvider client={queryClient}>
            <Navigation />
            {__DEV__ && (
                <DevToolsBubble
                    queryClient={queryClient}
                    onCopy={async () => false}
                />
            )}
        </QueryClientProvider>
    );
}

export default App;
