import './App.css';
import React, { useEffect } from 'react';
import Header from './components/Header/header';
import ArticleList from './components/ArticleList/article-list';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArticlePage from './pages/article-page';
import SignUp from './components/SignUp/sign-up';
import SignIn from './components/SignIn/sign-in';
import EditProfile from './components/EditProfile/edit-profile';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserByToken } from './store/authSlice';
import ArticleCreate from './components/ArticleCreate/article-create';
import ArticleEdit from './components/ArticleEdit/article-edit';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserByToken());
    }
  }, [dispatch, token, user])


  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<ArticleList></ArticleList>}/>
        <Route path="/article/:slug/edit" element={<ArticleEdit/>} />
        <Route path="/articles/:page" element={<ArticleList/>}/>
        <Route path="/article/:slug" element={<ArticlePage/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/profile" element={<EditProfile/>}/>
        <Route path="/new-article" element={<ArticleCreate/>}/>
      </Routes>
    </Router>
  );
}

export default App;
