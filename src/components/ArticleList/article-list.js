import React, { useEffect, useState } from "react";
import './article-list.css';
import { useSelector, useDispatch } from 'react-redux';
import { loadArticles } from "../../store/articlesSlice";
import { useParams, useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination'
import Stack from "@mui/material/Stack";
import { Loader } from "../Spinner/loader";
import ArticleCard from "../ArticleCard/article-card";

const ArticleList = () => {

    const dispatch = useDispatch();
    const { articles, loading, error, articlesCount } = useSelector((state) => state.articles)
    const { loading: authLoading, error: authError } = useSelector((state) => state.auth)

    const {page = 1} = useParams();
    const [currentPage, setCurrentPage] = useState(parseInt(page));
    const articlesPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        const offset = (currentPage -1) * articlesPerPage;
        dispatch(loadArticles({ limit: articlesPerPage, offset }));
    }, [currentPage, dispatch]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        navigate(`/articles/${value}`);
    }

    if(loading || authLoading) {
        return <Loader></Loader>
    }

    if(error || authError) {
        return <p>Error...</p>
    }

    const totalPages = Math.ceil(articlesCount/articlesPerPage);
    

    return (
        <div>
            <ul className="article-list">
                {articles.map((article) => (
                    <li key= {article.slug}>
                        <ArticleCard article={article} showFullText={false}></ArticleCard>
                    </li>
                ))}
            </ul>
            <Stack spacing={2} alignItems='center' marginTop={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
        </div>

    )
}

export default ArticleList;