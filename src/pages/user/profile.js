import { faMessage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PostComponent from "../../components/post"
import GlobalBar from "../../components/snippet/bar"

const _Profile = ({profile, token}) => {
    const [following, setFollowing] = useState(profile.following)
    const [posts, setPosts] = useState(profile.posts)
    const [noPosts, setNoPosts] = useState(false)
    let fetching = false
    
    useEffect(() => {
        
        let lengtth = posts ? posts.length : null
        window.addEventListener('scroll', (e) => {
            var h = document.documentElement,
                b = document.body,
                st = 'scrollTop',
                sh = 'scrollHeight';
    
            var percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    
            if (percent > 85 && fetching === false && lengtth) {
                fetching = true
                fetch(`http://192.168.1.9:5000/posts/${posts.length}`, {
                    method: 'get',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((response) => {
                    return response.status === 200 ? response.json() : null
                }).then((data) => {
                    if(data.posts) fetching = true 
                    if(data == false) {
                        setNoPosts(true)
                        return fetching = true
                    }
                    return data ? setPosts(pre => {
                        return pre.concat(data.posts)
                    }) : null
                }).catch((e) => {
                    console.log(e)
                })
            }
        })
    }, [posts])

    const ChangeFollowing = () => {
        const formData = new FormData()
        formData.append('userID', profile.id)
        axios.post(`http://192.168.1.9:5000/users/profiles/`, formData, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }).then((res) => {
            if(res.status ===200) return setFollowing(!following)
        })
    }

    return <div className="min-w-full items-center flex flex-1 flex-col px-2 sm:py-0" style={{paddingTop:"44px"}}>
        <br></br>
        <div className="flex flex-1 rounded-lg text-white items-center flex-col w-full sm:w-1/2">
        <br></br>
        <div className=" bg-gray-800 pb-2 flex-col flex w-4/5 rounded-lg items-center">
            <div className="relative w-full">
            <img alt="" src = {`http://192.168.1.9:5000${profile.cover}`} className="z-1 w-full h-full rounded-lg" />
                <img alt="" src = {`http://192.168.1.9:5000${profile.avatar}`} className="absolute left-0 bottom-0 border-4 border-white rounded-full w-24 h-24" />
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p>{profile.bio}</p>
            </div>
            <div className="px-2 flex min-w-full justify-around pt-2">
                <div className="flex-1 flex">
                    <div className="flex-1 flex">
                    <button onClick={ChangeFollowing} className={`min-w-full rounded-lg ${following ? 'bg-gray-900' : 'bg-blue-500'} flex-1 font-semibold`}>{following ? "Following" : "Follow"}</button>
                </div>
                <div>
                    <button className="bg-blue-500 p-2 rounded-full ml-2"><FontAwesomeIcon icon={faMessage}></FontAwesomeIcon></button>
                </div>
                </div>
                <div className="">
                    <button className="px-2 flex min-h-full items-center">...</button>
                </div>
            </div>
            <div></div>
        </div>
        <div className="flex flex-col min-w-full justify-around">
            <div className="w-full justify-around flex flex-col sm:flex-row">
                
                <div className="p-3 w-fit border-b-4 border-b-gray-500">
                    <h3>10K Following</h3>
                </div>
                <div className="p-3 w-fit border-b-4 border-b-gray-500">
                    <h3>50K Followers</h3>
                </div>
                <div className="p-3 w-fit border-b-4 border-b-gray-500">
                    <h3>2,314 Posts</h3>
                </div>
                <br></br>
            </div>
            <br className="hidden sm:block"></br>
        </div>
        <div className="flex-1 min-w-full px-2 flex-col flex">
            {posts ? posts.map((post, key) => {
                return <PostComponent post={post} key={key} /> 
            }) : null

            }
        </div>
    </div>
    {noPosts ? <div className='flex justify-center min-w-full'>
                <h1 className='flex min-w-full sm:text-2xl text-white justify-center'>No more posts, get more friends you lonely fuck.</h1>
                <br></br>
                <br></br>
            </div> : null}
    <br></br>
    </div>
}

const ProfilePage = (props) => {
    const params = useParams()
    const token = Cookies.get('access')
    const [profile, setProfile] = useState()
    useEffect(() => {
        if (!token) return () => {}
        fetch(`http://192.168.1.9:5000/users/profiles/${params.id}`, {
            method : 'GET',
            headers : {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            return res.status === 200 ? res.json() : null
        }).then((data) => {
            console.log(data)
            setProfile(data)
        })
    }, [])
    return <div className="flex flex-col items-center min-w-full min-h-screen">
        <GlobalBar />
        {profile ? <_Profile profile={profile} token={token} /> : null}
    </div>
}

export default ProfilePage