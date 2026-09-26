/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';

import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { LoginPage } from './pages/LoginPage';

// Redirect handler for legacy query params (?post=id)
function QueryParamRedirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const postId = searchParams.get('post');
    if (postId) {
      navigate(`/posts/${postId}`, { replace: true });
    }
  }, [searchParams, navigate]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PostProvider>
          <BrowserRouter>
            <QueryParamRedirect />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts" element={<DirectoryPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
