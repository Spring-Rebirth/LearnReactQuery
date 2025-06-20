import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { postsApi, postUrl, PostPayload } from '../constants/api'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native'

export default function HomeScreen() {
    const navigation = useNavigation();
    const query = useQuery({
        queryKey: ['example'],
        queryFn: postsApi.list,
    })

    if (query.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    if (query.error) {
        throw new Error("query was failed");
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ScrollView>
                {query.data.map((item: any) => (
                    <Text key={item.id} style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {item.title}
                    </Text>
                ))}
            </ScrollView>
            <View style={{ height: 50, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Detail')}
                    style={{ width: 160, height: 26, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text style={{ color: 'white' }}>Go to Detail</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
