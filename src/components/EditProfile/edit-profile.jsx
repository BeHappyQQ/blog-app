import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  updateUserProfile } from '../../store/authSlice';
import { useEffect, useState } from 'react';

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {  user } = useSelector((state) => state.auth);
    const [serverError, setServerError] = useState(null);

    const defaultImageURL = 'https://static.productionready.io/images/smiley-cyrus.jpg'


    const {
        register,
        formState: {
            errors,
            isValid,
        },
        handleSubmit,
        reset,
        setError,
    } = useForm({
        mode: "all",
    });

    useEffect(() => {
        if (user) {
            const userWithDefaultImage = {
                ...user,
                image: user.image || defaultImageURL
            };

            reset(userWithDefaultImage);
        }
    }, [user, reset]);

    const validateImageURL = async (url) => {
        const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i;
        if (!regex.test(url)) {
            return 'Please enter a valid image URL (jpg, jpeg, png).';
        }
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(true);
            img.onerror = () => resolve('URL does not lead to a valid image.');
        });
    };

    const onSubmit = async (data) => {

        try {
            const imageValidation = await validateImageURL(data.image || defaultImageURL);
            if (imageValidation !== true) {
                setError('image', { type: 'manual', message: imageValidation });
                return;
            }

            const profileData = {
                ...data,
                image: data.image || defaultImageURL,
            }
    
            if (!data.password) {
                delete profileData.password;
            }
            const resultAction = await dispatch(updateUserProfile({user: profileData}));

            if (updateUserProfile.fulfilled.match(resultAction)) {
                navigate('/')
            } else {
                setServerError(resultAction.payload || 'Failed to update profile.')
            }
        } catch (error) {
            setServerError('An error occured. Please try again')
        }

        
    };

    return (
        <div className='sign-in-wrapper'>
            <div className="sign-in-container">
                <h3>Edit Profile</h3>
                {serverError && <p className="error-msg">{serverError}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className='sign-form'>
                    <label className='sign-label'>
                        Username
                        <input
                            placeholder='Username'
                            className='sign-input'
                            {...register('username', {
                                required: 'Username is required',
                                minLength: {
                                    value: 3,
                                    message: 'Username must be at least 3 characters',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Username must be less than 20 characters',
                                },
                                pattern: {
                                    value: /^[a-z][a-z0-9]*$/,
                                    message: 'You can only use lowercase English letters and numbers',
                                },
                            })}
                        />
                    </label>
                    <p className='error-msg'>{errors?.username?.message}</p>
                    <label className='sign-label'>
                        Email address
                        <input
                            placeholder='Email address'
                            className='sign-input'
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                    message: 'Email must be in lowercase and valid format',
                                },
                            })}
                        />
                    </label>
                    <p className='error-msg'>{errors?.email?.message}</p>
                    <label className='sign-label'>
                        New password
                        <input
                            placeholder='Password'
                            className='sign-input'
                            type='password'
                            {...register('password', {
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters long',
                                },
                                maxLength: {
                                    value: 40,
                                    message: 'Password must be less than 40 characters long',
                                },
                            })}
                        />
                    </label>
                    <p className='error-msg'>{errors?.password?.message}</p>
                    <label className='sign-label'>
                        Avatar image (url)
                        <input
                            className='sign-input'
                            {...register('image', {
                                validate: async (value) => await validateImageURL(value),
                                pattern: {
                                    message: 'Please enter a valid image URL',
                                },
                            })}
                        />
                    </label>
                    <p className='error-msg'>{errors?.image?.message}</p>
                    <button className='btn-create' type='submit' disabled={!isValid}>Save</button>
                </form>
            </div>    
        </div>
    );
};

export default EditProfile;