import axios from "axios"
import { useState } from "react"
import { useToasts } from 'react-toast-notifications'
import swal from "sweetalert"
import Cookies from "js-cookie"
const _SignUp = (props) => {
    const [data, setData] = useState({ 'First_Name': false, 'Last_Name': false, 'Email': false, 'Password': false, 'Repeated_Password': false, 'BirthDay': false })
    const { addToast } = useToasts()


    const _setUserData = (data) => {
        for (let [key, value] of Object.entries(data)) {
            if (data[key].constructor == Object) {
                _setUserData(data[key])
            } else {
                Cookies.set(key, value, {
                    expires: new Date(Date.now() + 1959258971882)
                })
            }
        }
    }
    const setUserData = (data) => {
        _setUserData(data)
        window.location.reload()
    }

    const Submit = (e) => {
        e.preventDefault()
        let missed = ""
        for (let [key, value] of Object.entries(data)) {
            if (!value) missed == "" ? missed = missed + key.replace("_", " ") : missed = missed + `, ${key.replace('_', " ")}`
        }

        if(missed != "")
        return addToast(`${missed} are required`, {
            appearance: 'warning',
            autoDismiss: true,
        })

        if(data.Password !== data.Repeated_Password)
        return addToast(`Your passwords don't match`, {
            appearance: 'error',
            autoDismiss: true,
        })
        
        let _data = {}
        for (let [key, value] of Object.entries(data)) {
            _data[key.toLowerCase()] = data[key]
        }
        axios.post('http://192.168.1.9:5000/users/', _data, {
            method : 'POST'
        }).then((res) => {
            if(res.data.error)
            {
                swal({
                    title: "Failed to join!",
                    text: `${res.data.error[Object.keys(res.data.error)[0]]}`,
                    icon: "error",
                  });
            }
            else{
                swal({
                    title: "Created successfully!",
                    icon: "success",
                  });
                  setUserData(res.data)
            }
            
        }).catch((error) => {
            swal({
                title: "Failure!",
                text: error,
                icon: "error",
              });
        })
        
    }

    const [ShowPass, setShowPass] = useState("password")

    return <form onSubmit={Submit} className="text-gray-200 font-semibold min-w-full flex-col items-center justify-center flex">

        <div className="flex flex-col">
            <div className="flex flex-col w-full sm:w-fit sm:flex-row">
                <fieldset className="border-2 rounded-md w-full sm:w-fit border-gray-500 ">
                    <legend>First Name</legend>
                    <input required onChange={(e) => {
                        setData(pre => {
                            return { ...pre, First_Name: e.target.value }
                        })
                    }} className="bg-transparent w-full sm:w-fit outline-none p-1" />
                </fieldset>
                <fieldset className="border-2 rounded-md border-gray-500 sm:ml-2">
                    <legend>Last Name</legend>
                    <input required onChange={(e) => {
                        setData(pre => {
                            return { ...pre, Last_Name: e.target.value }
                        })
                    }} className="bg-transparent outline-none p-1" />
                </fieldset>
            </div>
            <div className="flex flex-col sm:flex-row" >
                <fieldset className="border-2 rounded-md border-gray-500 min-w-full">
                    <legend>Email</legend>
                    <input required onChange={(e) => {
                        setData(pre => {
                            return { ...pre, Email: e.target.value }
                        })
                    }} className="bg-transparent min-w-full text-white p-1  outline-none" />
                </fieldset>
            </div>
            <div className="flex flex-col sm:flex-row ">
                <fieldset className="border-2 rounded-md border-gray-500">
                    <legend>Password</legend>
                    <input type={ShowPass} required onChange={(e) => {
                        setData(pre => {
                            return { ...pre, Password: e.target.value }
                        })
                    }} className="p-1 bg-transparent outline-none" />
                </fieldset>
                <fieldset className="border-2 rounded-md border-gray-500 sm:ml-2">
                    <legend>Repeated Password</legend>
                    <input type={ShowPass} required onChange={(e) => {
                        setData(pre => {
                            return { ...pre, Repeated_Password: e.target.value }
                        })
                    }} className="p-1 bg-transparent outline-none" />
                </fieldset>
            </div>
            <div className="flex flex-col sm:flex-row justify-center">
                <fieldset className="border-2 rounded-md border-gray-500">
                    <legend>BirthDay</legend>
                    <input required onChange={(e) => {
                        setData(pre => {
                            return { ...pre, BirthDay: e.target.value }
                        })
                    }} type={"date"} className="bg-transparent text-white" />
                </fieldset>
            </div>
            <div className="flex min-w-full justify-center mt-2">
                <button className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700">Submit</button>
            </div>
            <br></br>
        </div>
    </form>
}

const SignUp = () => {
    const getHome = () => {
        window.location.href = "/"
    }

    return !Cookies.get('access') ? <_SignUp /> : getHome()
}

export default SignUp