import React from "react";
import './article-card.css';
import AuthorProfile from "../AuthorProfile/author-profile";
import { Link, useNavigate } from "react-router-dom";
import  ReactMarkdown from 'react-markdown';
import { Popconfirm, Button } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { deleteArticle, likeArticle, unlikeArticle } from "../../store/articlesSlice";


const ArticleCard = ({article, showFullText = false, className = '', isAuthor = false}) => {
    const { slug } = article;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleDelete = async() => {
        const resultAction = await dispatch(deleteArticle(slug));
        if (deleteArticle.fulfilled.match(resultAction)) {
            navigate('/');
        } else {
            console.error('Error deleting article', resultAction.payload)
        }
    };

    const handleLike = () => {
        if (!user) {
            navigate('/sign-in');
        }
        if (article.favorited) {
            dispatch(unlikeArticle(article.slug));
        } else {
            dispatch(likeArticle(article.slug));
        }
    };

    

    return (
            <div className={`article-card ${className}`}>
                <div className="article-content">
                    <div className="article-title--container">
                        <h5 className="article-title">
                        {showFullText ? (
                            article.title
                        ) : (
                            <Link to={`/article/${slug}`} className="article-title">{article.title}</Link>
                        )}
                        </h5>
                        <div className="article-likes--container" onClick={handleLike}>
                            <div className={`article-likes--heart ${article.favorited ? 'liked' : ''}`}></div>
                            <p className="article-likes--count">{article.favoritesCount}</p>
                        </div>
                    </div>
                    <div className="article-tags">
                        {article.tagList
                        .filter(tag => tag)
                        .map((tag, index) => (
                            <div className="article-tag" key = {index}> {tag} </div>
                        ))}
                    </div>
                    <p className="article-description">{article.description}</p>
                    {showFullText ?
                    <div className="article-body">
                        <ReactMarkdown>{article.body}</ReactMarkdown>
                    </div> 
                    : null}
                </div>
                <div className="author-buttons-wrapper">
                    <AuthorProfile name={article.author.username} avatar={article.author.image} date={article.createdAt}></AuthorProfile>
                    {isAuthor && showFullText ? (
                    <>
                        <Popconfirm
                                placement="topRight"
                                title={'Are you sure to delete this article?'}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => handleDelete()}>
                            <Button className="btn-delete-article" danger>Delete</Button>
                        </Popconfirm>
                        <Button className="btn-edit-article"
                                size="middle"
                                onClick={() => navigate(`/article/${slug}/edit`)}>Edit</Button>
                    </>
                    ) : null}
                </div>
        </div>
    )
}

export default ArticleCard;