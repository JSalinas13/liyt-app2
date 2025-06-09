import React, { useEffect } from 'react'
import { Field, Fieldset, Input, Label, Legend } from '@headlessui/react'
import { EyeIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useForm } from "react-hook-form";
import { useUser } from '../context/UserContext'; // ajusta el path si es necesario


export default function Login() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { login, user } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/users');
                if (!response.ok) {
                    throw new Error('Error en la conexión con el servidor');
                }
                const data = await response.json();
                console.log("Users", data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }
        , []);

    const onSubmit = async data => {
        console.log(data);

        try {
            const response = await fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: data.user,
                    password: data.password
                })
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }

            const result = await response.json();

            if (result.success) {
                login(result.user);
            }

            console.log("result:", result);
        } catch (error) {
            console.error('Error:', error);
        }

    }

    console.log("ERRORS: ", errors); // watch input value by passing the name of it


    const handleShowPassword = () => {
        const passwordInput = document.querySelector('input[type="password"]');
        if (passwordInput) {
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-center min-h-screen bg-black px-4">
            <Fieldset className="w-full max-w-md space-y-6 rounded-xl bg-white/5 p-6 sm:p-10 shadow-lg">
                <Legend className="text-2xl font-bold text-white text-center">Iniciar sesión</Legend>

                <Field>
                    <Label className="text-sm font-medium text-white">Usuario</Label>
                    <Input
                        {...register("user", { required: true })}
                        type="text"
                        className={clsx(
                            'mt-2 block w-full rounded-lg border-none bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40',
                            'focus:outline-none focus:ring-2 focus:ring-white/30'
                        )}
                    />
                    {errors.user && <span className='text-red-700'>El usuario es obligatorio</span>}

                </Field>

                <Field>
                    <Label className="text-sm font-medium text-white">Contraseña</Label>
                    <div className="relative mt-2">
                        <Input
                            {...register("password", { required: true })}
                            type="password"
                            className={clsx(
                                'block w-full rounded-lg border-none bg-white/10 px-3 py-2 pr-10 text-sm text-white placeholder-white/40',
                                'focus:outline-none focus:ring-2 focus:ring-white/30'
                            )}
                        />
                        <EyeIcon onClick={handleShowPassword} className="absolute right-2.5 top-2.5 size-5 text-white/50" />
                    </div>
                    {errors.password && <span className='text-red-700' >La contraseña es obligatoria</span>}
                </Field>

                <button
                    type='submit'
                    className="mt-4 w-full rounded-lg bg-white/20 py-2 text-white font-semibold hover:bg-white/30 transition"
                >
                    Entrar
                </button>
            </Fieldset>
        </form>
    )
}
