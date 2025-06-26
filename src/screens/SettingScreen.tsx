import { View, Text, Button } from 'react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postsApi, type Post } from '../constants/api'
import { useCallback, useMemo } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useState } from 'react'

// 一个function， 产生一个1-50的随机整数
const getRandomId = () => {
    return Math.floor(Math.random() * 50) + 1
}

export default function SettingScreen() {

    const queryClient = useQueryClient()
    // 让页面每次聚焦时，随机产生一个1-50的随机整数，并赋值给一个变量
    useFocusEffect(
        useCallback(() => {
            const randomId = getRandomId()
            setRandomId(randomId)
        }, [])
    )
    const [randomId, setRandomId] = useState(getRandomId())
    console.log('randomId', randomId)

    const postQuery = useQuery({
        queryKey: ['post', randomId],
        queryFn: () => postsApi.get(randomId),
    })

    const mutation = useMutation({
        mutationFn: (id: number) => postsApi.remove(id),
        onSuccess: () => {
            queryClient.setQueryData(['posts'], (oldData: Post[]) => {
                return oldData.filter((post) => post.id !== randomId)
            })
        }
    })


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                {postQuery.data?.title}
            </Text>
            <Button title='delete post' onPress={() => mutation.mutate(randomId)} />
        </View>
    )
}
