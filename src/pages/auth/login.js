import { faEye, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import React, { useRef, useState } from "react";
import { useToasts } from 'react-toast-notifications'
import { ToastProvider } from 'react-toast-notifications';

const _LoginPage = () => {
    const { addToast } = useToasts()

    const [showpass, setShowPass] = useState("password")
    const email = useRef()
    const password = useRef()

    const _setUserData = (data) => {
        for (let [key, value] of Object.entries(data)) {
            if (data[key].constructor == Object) {
                _setUserData(data[key])
            } else {
                if(key === 'notifies') {
                    Cookies.set(key, JSON.stringify(data[key]), {
                        expires: new Date(Date.now() + 1959258971882)
                    })

                } else {
                    Cookies.set(key, value, {
                        expires: new Date(Date.now() + 1959258971882)
                    })
                }
                
            }
        }
    }
    const setUserData = (data) => {
        _setUserData(data)
        window.location.reload()
    }

    const submitForm = (e) => {
        const username = email.current.value
        const pass = password.current.value
        e.preventDefault()
        if (!username || !pass) {
            return addToast(!username && !pass ? "Email and password are required" : !username ? "Email is required" : "Password is required", {
                appearance: 'error',
                autoDismiss: true,
            })
        }
        fetch('http://192.168.1.9:5000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: username, password: pass })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            data.detail ? addToast(`${data.detail}`, {
                appearance: 'info',
                autoDismiss: true,
            }) : setUserData(data)
        }).catch((e) => {
            console.error(e)
        })
    }

    return <div className="flex text-white min-w-full min-h-full items-center justify-center ">
        <div className="flex flex-col p-2">
            <form>

                <div>
                    <fieldset className="border-white rounded-md border-2">
                        <legend className="px-1">Email</legend>
                        <div className="flex-1 flex"><input ref={email} type="email" className="flex-1 bg-transparent outline-none p-2 pt-0" required /></div>
                    </fieldset>
                </div><br></br>
                <div>
                    <fieldset className="border-white rounded-md border-2">
                        <legend className="px-1">Password</legend>
                        <div className="flex px-1 items-center ">
                            <input required type={showpass} ref={password} className="flex-1 bg-transparent outline-none p-2 pt-0" />
                            <button type="button" className="text-white w-5" onClick={() => { setShowPass(showpass == 'text' ? 'password' : 'text') }}>
                                <FontAwesomeIcon icon={showpass === 'text' ? faX : faEye}></FontAwesomeIcon>
                            </button>
                        </div>
                    </fieldset>
                </div>
                <br></br>
                <div className="flex justify-center items-center">
                    <button type="submit" onClick={submitForm} className="hover:bg-gray-500 rounded-full p-2">Login</button>
                </div>
                <div className="flex flex-col">
                    <small><a href="#" className="text-blue-400">forgot your password?</a></small>
                    <small>don't have an account? <a className="text-blue-400" href={"signup"}>join us</a></small>
                </div>
            </form>
        </div>
    </div>




}

export default _LoginPage