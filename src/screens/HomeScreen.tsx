import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { postsApi } from '../constants/api'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation, NavigationProp } from '@react-navigation/native'

export default function HomeScreen() {

    type RootStackParamList = {
        Home: undefined;
        Detail: { id: string };
    };

    const queryClient = useQueryClient();

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const query = useQuery({
        queryKey: ['posts'],
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
                    <View key={item.id} style={{ height: 50, width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            {item.title}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                queryClient.prefetchQuery({
                                    queryKey: ['post', item.id],
                                    queryFn: () => postsApi.get(item.id)
                                })
                                navigation.navigate('Detail', { id: item.id })
                            }}
                            style={{ width: 160, height: 26, backgroundColor: 'skyblue', justifyContent: 'center', alignItems: 'center' }}
                        >

                            <Text style={{ color: 'black' }}>Go to Detail</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>


        </View>
    );
}
