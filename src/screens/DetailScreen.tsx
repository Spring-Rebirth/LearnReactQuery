import { View, Text, ActivityIndicator } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../constants/api'

export default function DetailScreen() {
  const route = useRoute()
  const { id } = route.params as { id: string }

  console.log('DetailScreen - id:', id)

  const query = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.get(id),
  })

  console.log('DetailScreen - query.data:', query.data)

  if (query.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'small'} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{query?.data?.body ?? query?.data?.title}</Text>
    </View>
  )
}
