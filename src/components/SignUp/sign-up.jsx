import './sign-up.css';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signUpUser } from '../../store/authSlice';
import { useState } from 'react';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [regError, setRegError] = useState(null);

    const {
        register,
        formState: {
            errors,
            isValid,
        },
        handleSubmit,
        watch,
    } = useForm({
        mode: "all", 
    });

    const onSubmit = async (data) => {
        try {
            const { email, password, username } = data;
            const resultAction = await dispatch(signUpUser({ 
                user: {
                    email,
                    password,
                    username
                }
            }));

            if(signUpUser.fulfilled.match(resultAction)) {
                navigate("/")
            }
            
        } catch (error) {
            setRegError('An error occured. Please try again')
        }

    }

    const password = watch('password')

    return (
        <div className='sign-in-wrapper'>
            <div className="sign-in-container">
                <h3>Create new account</h3>
                {regError && <p className="error-msg">{regError}</p>}
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
                                    message: 'Username must be at least 3 characters'
                                },
                                maxLength: {
                                value: 20,
                                message: 'Username must be less than 20 characters',
                                },
                                pattern: {
                                    value: /^[a-z][a-z0-9]*$/,
                                    message: 'You can only use lowercase English letters and numbers',
                                }
                            })}/>
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
                                    message: 'Email must be in lowercase and valid format'
                                }
                            })}/>
                    </label>
                    <p className='error-msg'>{errors?.email?.message}</p>
                    <label className='sign-label'>
                        Password
                        <input
                            placeholder='Password'
                            className='sign-input'
                            type='password'
                            {...register('password', {
                                required: 'Required field',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters long'
                                },
                                maxLength: {
                                value: 40,
                                message: 'Password must be less than 40 characters long',
                                },
                            })}/>
                    </label>
                    <p className='error-msg'>{errors?.password?.message}</p>
                    <label className='sign-label'>
                        Repeat password
                        <input
                            placeholder='Password'
                            className='sign-input'
                            type='password'
                            {...register('passwordRepeat', {
                                required: 'Please repeat your password',
                                validate: value => value === password || 'Passwords do not match'
                            })}/>
                    </label>
                    <p className='error-msg'>{errors?.passwordRepeat?.message}</p>
                    <FormControlLabel
                        className='sign-in-checkbox'
                        control={
                            <Checkbox
                                {...register('terms', {
                                    required: 'You must accept the terms and conditions'
                                })}
                            />
                        }
                        label= "I agree to the processing of my personal information"

                        />
                    <button className='btn-create' type='submit' disabled={!isValid}>Create</button>
                    <p className='btn-under'>Already have an account? <Link to="/sign-in" className='link-sign-in'>Sign in.</Link></p>
                </form>
            </div>    
        </div>
    )
}

export default SignUp;