import './sign-in.css'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signInUser } from '../../store/authSlice';
import { useState } from 'react';

const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(null)

    const {
        register,
        formState: {
            errors,
            isValid,
        },
        handleSubmit,
    } = useForm({
        mode: 'all',
    });

    const onSubmit = async (data) => {
        try {
            const { email, password } = data;
            const resultAction = await dispatch(signInUser({ 
                user: {
                    email,
                    password,
                }
            }))
            
            if (signInUser.fulfilled.match(resultAction)) {
                setLoginError(null)
                navigate('/');
            } else {
                setLoginError('Invalid email or password')
            }
        } catch (error) {
            setLoginError('An error occured. Please try again.')
        }

    }

    return (
        <div className='sign-in-wrapper'>
            <div className="sign-in-container">
                <h3>Sign In</h3>
                {loginError && <p className="error-msg">{loginError}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className='sign-form'>
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
                    <button className='btn-create' type='submit' disabled={!isValid}>Login</button>
                    <p className='btn-under'>Don't have an account? <Link to="/sign-up" className='link-sign-in'>Sign Up.</Link></p>
                </form>
            </div>
        </div>
    )
}

export default SignIn;