import './article-create.css'
import { useFieldArray, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { createArticle } from '../../store/articlesSlice';

const ArticleCreate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        control,
    }
    = useForm({ 
        mode: "all",
        defaultValues: {
            tagList: [{ value: '' }]
        }})
    
    const { fields, append, remove} = useFieldArray({
        control,
        name: 'tagList',
    })

    const onSubmit = async(data) => {
        try {
            const tags = data.tagList.map(tag => tag.value.trim()).filter(Boolean);
            const articleData = {
                article: {
                    ...data,
                    tagList: tags,
                }
            };
            const resultAction = await dispatch(createArticle(articleData));
            if (createArticle.fulfilled.match(resultAction)) {
                navigate('/');
            } else {
                console.error('Error creating article', resultAction.payload);
            }
            
        } catch (error) {
            console.error('Unexpected error', error)
        }
    }


    return (
        <div className="create-article-wrapper">
            <div className="create-article-container">
                <h3>Create new article</h3>
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
                                        maxLength: {
                                            value: 10,
                                            message: 'Tag must be less than 10 characters'
                                        }
                                    })}
                                    className="tag-input"
                                    placeholder="Tag"
                                />
                                <button type="button"
                                        className="btn-delete-tag btn-delete"
                                        onClick={() => remove(index)}>Delete</button>
                                {errors.tagList?.[index]?.value && (
                                    <p className="error-msg">{errors.tagList[index].value.message}</p>
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

export default ArticleCreate