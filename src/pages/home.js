
import PostComponent from '../components/post.js'
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import PostSnippet from "../components/home/bottom-action.js";
import _LoginPage from "./auth/login";
import GlobalBar from '../components/snippet/bar.js';


const _HomePage = ({ token }) => {
    const [posts, setPosts] = useState()
    const [notifies, setNotifies] = useState()
    const [noPosts, setNoPosts] = useState(false)
    const [postToShare, setPostToShare] = useState(false)
    let fetching = false

    useEffect(() => {
        console.log(postToShare)
    }, [postToShare])

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
                    if (data.posts) fetching = true
                    if (data == false) {
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

    useEffect(() => {
        document.getElementById('postsContainer').style.marginTop = `44px`
        fetch('http://192.168.1.9:5000/posts', {
            method: 'get',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            return response.status === 200 ? response.json() : null
        }).then((data) => {
            return data ? setPosts(data.posts) : null
        }).catch((e) => {
            console.log(e)
        })
        return () => { }
    }, [])

    return <div className="min-w-full min-h-screen flex flex-col">
        <GlobalBar token={token} />
        <div className="flex-1 flex px-2">
            <div className="hidden md:flex w-1/5">

            </div>
            <div className="flex-1 lg:pl-0 lg:pr-0" id="postsContainer">
                <br></br>
                {posts ? posts.map((post, key) => {
                    return <PostComponent postToShare={postToShare} setPostToShare={setPostToShare} post={post} key={5 + post.id + key} _key={post.id} />
                }) : null}
            </div>
            <div className="hidden md:flex w-1/5">

            </div>
        </div>
        {noPosts ? <div className='flex justify-center min-w-full'>
            <h1 className='flex min-w-full sm:text-2xl text-white justify-center'>No more posts, get more friends you lonely fuck.</h1>
            <br></br>
            <br></br>
        </div> : null}
        <br></br>
        <br></br>
        <PostSnippet postToShare={postToShare} setPostToShare={setPostToShare} setPosts={setPosts} token={token} />
    </div>
}






const HomePage = (props) => {
    const access = Cookies.get('access') || false

    const [isAuthenticated] = useState(access)
    return isAuthenticated ? <_HomePage token={access} /> : <_LoginPage />
}
export default HomePage