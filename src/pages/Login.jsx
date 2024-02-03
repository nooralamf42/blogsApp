import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login } from "../store/appSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [error, setError] = useState(null)


  const { handleSubmit, register} = useForm();
  const submit = async(data) =>{
    try {
        const userData = await authService.loginUser(data)
        dispatch(login({userData}))
        navigate('/')
    } catch (error) {
        setError(error.message)
    }
    console.log(error)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit(submit)}>
        <Input
          type="email"
          placeholder="Enter your email"
          label="Email"
          {...register("email", { required: true })}
        />
        <Input
          minLength={8}
          type="password"
          placeholder="Enter your password"
          label="Password"
          {...register("password", { required: true })}
        />

        {error && <div className="text-red-500 mb-4">{error}</div>}


        <Button
          type="submit"
        >
          Login
        </Button>
      </form>
      <p className="mt-4 text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-500">
          Sign up here
        </Link>
        .
      </p>
    </div>
  );
}

export default Login;
