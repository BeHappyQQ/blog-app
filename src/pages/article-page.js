import React, { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard/article-card";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadArticleBySlug } from "../store/articlesSlice";
import { Loader } from "../components/Spinner/loader";

const ArticlePage = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { article, loading, error } = useSelector((state) => state.articles);
    const { user, loading: userLoading } = useSelector((state)=> state.auth);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
      dispatch(loadArticleBySlug(slug));
    }, [slug, dispatch]);

    useEffect(() => {
      if(article && user) {
        setIsAuthor(user.username === article.author.username);
      }
    }, [article, user]);
    
    if (loading || userLoading) {
        return <Loader/>
    }

    if (error) {
        return <p>{error}</p>
    }

    if(!user && !userLoading) {
      navigate('/sign-in');
    }

    return (
        <div className="article-page">
        {article && (
          <ArticleCard 
          article={article}
          showFullText={true}
          className="article-page-card"
          isAuthor={isAuthor} />
        )}
      </div>
    );
}

export default ArticlePage;