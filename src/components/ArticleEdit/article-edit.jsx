import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom";
import { loadArticleBySlug, updateArticle } from "../../store/articlesSlice";

const ArticleEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams();
    const { article } = useSelector((state) => state.articles);
    const [serverError, setServerError] = useState(null);

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        control,
        reset,
    }
    = useForm({ 
        mode: "all",
        defaultValues: {
            tagList: [{ value: '' }]
        }})
    
    const { fields, append, remove, replace} = useFieldArray({
        control,
        name: 'tagList',
    });
    useEffect(() => {
        if(slug) {
            dispatch(loadArticleBySlug(slug));
        }
    }, [dispatch, slug])
    useEffect(() => {
        if(article) {
            reset({
                ...article,
                tagList: article.tagList ? article.tagList.map(tag => ({ value: tag })) : []
            });
            replace(article.tagList ? article.tagList.map(tag => ({ value: tag })) : []);
        }
    }, [article, reset, replace]);


    const onSubmit = async (data) => {
        try {
            const tags = data.tagList.map(tag => tag.value.trim()).filter(Boolean);
            const updatedArticle = {
                article: {
                    ...data,
                    tagList: tags,
                }
            };
            const resultAction = await dispatch(updateArticle(updatedArticle));
            
            if (updateArticle.fulfilled.match(resultAction)) {
                navigate(`/article/${slug}`)
            } else {
                setServerError(resultAction.payload || 'Failed to update article.')
            }
        } catch (error) {
            setServerError('An error occured. Please try again');
        }

    }

    return (
        <div className="create-article-wrapper">
            <div className="create-article-container">
                <h3>Edit article</h3>
                {serverError && <p className="error-msg">{serverError}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className="create-article-form">
                    <label className="form-label">
                    Title
                        <input 
                            placeholder="Title"
                            className="form-input"
                            {...register('title', {
                                required: 'Title is required',
                                minLength: {
                                    value: 3,
                                    message: 'Title must be at least 3 characters',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Title must be less than 20 characters'
                                }
                            })}
                        />
                        {errors?.title && <p className="error-msg">{errors.title.message}</p>}
                    </label>
                    <label className="form-label">
                    Short Description
                        <input 
                            placeholder="Short Description"
                            className="form-input"
                            {...register('description', {
                                required: 'Description is required',
                                minLength: {
                                    value: 3,
                                    message: 'Description must be at least 3 characters',
                                },
                                maxLength: {
                                    value: 100,
                                    message: 'Description must be less than 100 characters'
                                }
                            })}
                        />
                        {errors?.description && <p className="error-msg">{errors.description.message}</p>}
                    </label>
                    <label className="form-label">
                    Text
                        <textarea
                            rows={6} 
                            placeholder="Text"
                            className="form-input"
                            {...register('body', {
                                required: 'Text is required',
                                minLength: {
                                    value: 10,
                                    message: 'Text must be at least 10 characters',
                                },
                                maxLength: {
                                    value: 2000,
                                    message: 'Text must be less than 2000 characters'
                                }
                            })}
                        />
                        {errors?.body && <p className="error-msg">{errors.body.message}</p>}
                    </label>
                    <div className="tags-section">
                    Tags
                        {fields.map((field, index) => (
                            <div key={field.id} className="tag-item">
                                <input
                                    id={index}
                                    {...register(`tagList.${index}.value`, {
                                        maxLength: 10,
                                        message: 'Tag must be less than 10 characters',
                                    })}
                                    className="tag-input"
                                    placeholder="Tag"
                                />
                                <button type="button"
                                        className="btn-delete-tag btn-delete"
                                        onClick={() => remove(index)}>Delete</button>
                                {errors.tagList?.[index]?.value && (
                                    <p className="error-msg">Tag must be less than 10 characters</p>
                                )}
                            </div>
                        ))}
                        <button type="button"
                                className="btn-add-tag btn-delete"
                                onClick={() => append({value: ''})}>
                        Add Tag
                        </button>
                    </div>
                    <button className="btn-create" type="submit" disabled={!isValid}>Send</button>
                </form>
            </div>
        </div>
    )

}

export default ArticleEdit;