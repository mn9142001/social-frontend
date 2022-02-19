import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faBell, faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie"
import { useEffect, useState } from "react";

const GlobalBar = (props) => {
    const [activeSearch, setSearch] = useState(false)
    const [showNotifies, setShowNotifies] = useState(false)
    const _notifies = Cookies.get('notifies')
    const [notifies, updateNotifies] = useState(_notifies ? JSON.parse(_notifies) : [])
    useEffect(() => {
        const socket = new WebSocket(`ws://192.168.1.9:5000/notifies/token=${props.token}`)
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data)
            if(data.notify) updateNotifies(pre => {
                return [data.notify, ...pre]
            })
        }

        return () => {socket.close()
        return null}
    }, [])

    return <div id="const-bar" className=" z-50 flex fixed min-w-full text-gray-500 bg-gray-800 text-xl py-2 items-center justify-around">
        <div className="flex items-center">
            <h3 className="flex items-center text-white"><a href="/">Egy-App</a></h3>
        </div>
        <div className="flex w-2/5 sm:flex-none sm:w-1/5 justify-around">
            <div className="items-center min-h-full flex justify-center relative"><img src={`http://192.168.1.9:5000${Cookies.get('avatar')}`} className="ml-2 rounded-full w-7 h-7" /></div>

            <div>
                <button className="items-center min-h-full flex justify-center relative">
                    <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                    {notifies && notifies.length > 0 ? <small className="text-red-500 absolute font-extrabold min-h-full top-0 right-0">{notifies.length}</small> : null}
                </button>
            </div>
            <div>
                <button>
                    <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
                </button>
            </div>
        </div>
        <div className={`flex ${activeSearch ? "absolute min-w-full justify-around" : null}`}>
            <div className={`${activeSearch ? " w-5/6 sm:relative sm:flex-none left-0 ml-2" : "hidden"} bg-white justify-around text-black px-3 sm:bg-white rounded-md flex`}>
                <input type={"search"} placeholder="type to search" className={`flex-1 bg-transparent rounded-md rounded-r-none border-none outline-none text-base font-bold`} />
                <button className="text-black rounded-r-md">
                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </button>

            </div>
            <button className="block text-white" onClick={() => { return setSearch(!activeSearch) }}>
                <FontAwesomeIcon icon={!activeSearch ? faSearch : faX}></FontAwesomeIcon>
            </button>
        </div>
        {/* <div className="absolute top-0 mt-11 text-white mx-auto w-full sm:w-3/12">
            {notifies && notifies.length > 0 ? notifies.map((notify, key) => {
                return <div key={`notifications_${notify.id}`}>
                    <h3>{notify.sender.name}</h3>
                    <img src={`http://192.168.1.9:5000${notify.sender.avatar}`} className="ml-2 rounded-full w-7 h-7" />
                </div>
            }) : null}
        </div> */}
    </div>
}
export default GlobalBar