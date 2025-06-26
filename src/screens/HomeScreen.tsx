import { Text, View, ActivityIndicator, TouchableOpacity, FlatList, TextInput, Button, Alert } from 'react-native'
import { postsApi } from '../constants/api'
import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react';
import type { PostPayload, Post } from '../constants/api'

export default function HomeScreen() {

  const [form, setForm] = React.useState<PostPayload>({
    userId: undefined,
    title: '',
    body: '',
  });

  type RootStackParamList = {
    Home: undefined;
    Detail: { id: string };
  };

  const queryClient = useQueryClient();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: postsApi.list,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 10,
    gcTime: 1000 * 60,
  })

  // 非乐观更新
  const addPost = useMutation({
    mutationFn: (postContent: PostPayload) => postsApi.create(postContent),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      console.log('add post successful, res:', data);
      Alert.alert('add post successful');
    },
    onError(error, variables, context) {
      console.error('add post failed:', error);
    },
  })

  // 乐观更新
  const addPostOptimistic = useMutation({
    mutationFn: (postContent: PostPayload) => postsApi.create(postContent),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previous = queryClient.getQueryData(['posts'])
      queryClient.setQueryData<Post[]>(['posts'], (old = []) => [
        { ...newPost, id: Date.now(), ptimistic: true } as Post,
        ...old
      ])

      return { previous }
    },
    onError: (err, arg, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['posts'], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  })

  // 删除 乐观更新
  const deletePostOptimistic = useMutation({
    mutationFn: (id: number) => postsApi.remove(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      // 获取旧数据快照
      const previousPostsData = queryClient.getQueryData(['posts']);

      // 乐观地更新数据
      queryClient.setQueryData<InfiniteData<Post[]> | undefined>(
        ['posts'],
        (oldData) => {
          if (!oldData) {
            return { pages: [], pageParams: [] };
          }

          // 遍历所有页面，过滤掉要删除的帖子
          const newPages = oldData.pages.map(page =>
            page.filter(post => post.id !== deletedId)
          );

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      // 返回旧数据快照，用于出错时回滚
      return { previousPostsData };
    },
  });

  // useFocusEffect(
  //   useCallback(() => {
  //     queryClient.invalidateQueries({ queryKey: ['posts'] })
  //   }, [queryClient])
  // )

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        data={allPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={{ height: 50, width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                queryClient.prefetchQuery({
                  queryKey: ['post', item.id],
                  queryFn: () => postsApi.get(item.id)
                })
                navigation.navigate('Detail', { id: item.id.toString() })
              }}
              style={{ width: 160, height: 26, backgroundColor: 'skyblue', justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ color: 'black' }}>Go to Detail</Text>
            </TouchableOpacity>
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        ListFooterComponent={isFetchingNextPage
          ?
          <ActivityIndicator size={'small'} />
          :
          null
        }
      />

      <View style={{ height: 'auto', width: '100%', paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width: 50, marginRight: 8 }}>user ID: </Text>
          <TextInput
            style={{ flex: 1, borderWidth: 1, padding: 4 }}
            onChangeText={text => setForm({ ...form, userId: Number.parseInt(text) })}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width: 50, marginRight: 8 }}>title: </Text>
          <TextInput
            style={{ flex: 1, borderWidth: 1, padding: 4 }}
            onChangeText={text => setForm({ ...form, title: text })}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width: 50, marginRight: 8 }}>body: </Text>
          <TextInput
            style={{ flex: 1, borderWidth: 1, padding: 4 }}
            onChangeText={text => setForm({ ...form, body: text })}
          />
        </View>
        <Button title='submit post' onPress={() => addPost.mutate(form)} />
        <Button title='submit post optimistic' onPress={() => addPostOptimistic.mutate(form)} />
      </View>
    </View>
  );
}
