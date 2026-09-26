import React, { createContext, useContext, useState, useEffect } from 'react';
import { PostDocument } from '../types/claim';
import { SAMPLE_POSTS } from '../data/samplePosts';

interface PostContextType {
  posts: PostDocument[];
  addPost: (post: PostDocument) => void;
  updatePost: (post: PostDocument) => void;
  deletePost: (id: string) => void;
  getPostById: (id: string) => PostDocument | undefined;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'claimtrace_custom_posts';

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<PostDocument[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sampleIds = new Set(SAMPLE_POSTS.map((p) => p.id));
          const customOnly = parsed.filter((p) => !sampleIds.has(p.id));
          return [...SAMPLE_POSTS, ...customOnly];
        }
      }
    } catch (e) {
      console.error('Failed to load custom posts', e);
    }
    return SAMPLE_POSTS;
  });

  useEffect(() => {
    try {
      const sampleIds = new Set(SAMPLE_POSTS.map((p) => p.id));
      const customOnly = posts.filter((p) => !sampleIds.has(p.id));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customOnly));
    } catch (e) {
      console.error('Failed to save custom posts to localStorage', e);
    }
  }, [posts]);

  const addPost = (post: PostDocument) => {
    setPosts((prev) => [post, ...prev]);
  };

  const updatePost = (updatedPost: PostDocument) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const getPostById = (id: string) => {
    return posts.find((p) => p.id === id);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, updatePost, deletePost, getPostById }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
