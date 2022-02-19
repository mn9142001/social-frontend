import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera, faPaperPlane, faX } from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from "react"
import axios from "axios"
import Moment from "react-moment"
const PostSnippet = (props) => {

    const [content, setContent] = useState()
    const [media, setMedia] = useState()
    const textInput = useRef()
    const mediaInput = useRef()
    const scrollToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    const submitPost = (e) => {
        e.preventDefault()
        if (!content && !media) {
            return alert("you can't post an empty snippet")
        }

        const formData = new FormData()
        if(props.postToShare) formData.append('postID', props.postToShare.id)
        formData.append('content', content)
        if (media) {
            formData.append('media', media.length)
            for (let index = 0; index < media.length; index++) {
                const element = media[index];
                formData.append(`img_${index}`, element)
            }
        }

        // fetch('http://192.168.1.9:5000/posts/', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': `multipart/form-data`
        //     },
        //     body: formData
        // }).then((res) => {
        //     return res.status === 200 ? res.json() : null
        // }).then((data) => {
        //     console.log(data)
        //     return data.detail ? null : () => {
        //         setPosts(pre => {
        //             return [data.post, ...pre]
        //         })
        //         scrollToTop()
        //     }
        // })

        axios.post('http://192.168.1.9:5000/posts/', formData, {
            headers: {
                Authorization: `Bearer ${props.token}`,
                'Content-Type': `multipart/form-data`
            },
        }).then((res) => {
            if (res.status === 200) {
                const data = res.data
                scrollToTop()
                props.setPosts(pre => {
                    const new_pre = [data.post].concat(pre)
                    return new_pre
                })

                if(props.postToShare) props.setPostToShare(false)
                textInput.current.value = null;
                mediaInput.current.value = null;

                setContent(null)
                setMedia(null)
                return null
            }
        }).catch((e) => {
            console.log(e)
        })

    }

    return <div className="flex w-full maxa-w-screen fixed bottom-1 sm:justify-center">
        <form onSubmit={submitPost} className="flex items-center w-full justify-around px-2  sm:w-1/2">
            <div className="flex-1 flex items-center flex-col">
                {props.postToShare ?
                    <div className="flex mb-1 max-h-32 min-w-full">
                        <div className={`flex rounded-md border-2 min-w-full border-gray-400 flex-col bg-gray-800 text-white p-3 justify-center`}>
                            <div className="flex flex-row">
                                <div className="flex-row flex">
                                    <div>
                                        <img src={`http://192.168.1.9:5000${props.postToShare.author.avatar}`} alt="" className="rounded-full w-12 h-12" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="ml-2">
                                            <h3 className="font-bold">
                                                <a href={`/profile/${props.postToShare.author.id}`}>{props.postToShare.author.name}</a>
                                            </h3>
                                        </div>
                                        <div className="ml-2">
                                            <small>
                                                <Moment fromNow>{props.postToShare.date}</Moment>
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 flex justify-end items-start">
                                    <button type="button" onClick={(e) => {props.setPostToShare(false)}} className="text-white hover:text-gray-500">
                                        <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
                                    </button>
                                </div>
                            </div>
                            <br />
                            <div>
                                <p>{props.postToShare.content}</p>
                            </div>
                        </div>
                    </div>
                    : null}
                <div className="flex min-w-full">
                    <div className="flex  w-full items-center bg-gray-400 rounded-full py-2">
                        <input ref={textInput} onChange={(e) => { setContent(e.target.value) }} className="placeholder-gray-600 bg-inherit outline-none flex-1 rounded-full px-2" placeholder="what you thinking?" />
                        <label htmlFor="fileInput" className="cursor-pointer pr-1">
                            <FontAwesomeIcon className="text-white" icon={faCamera}></FontAwesomeIcon>
                        </label>
                        <input ref={mediaInput} onChange={(e) => setMedia(e.target.files)} type={'file'} className="hidden" id="fileInput" multiple />
                    </div>
                    <div className="flex items-center justify-center pl-1">
                        <button className={`flex text-gray-200 items-center justify-center ${content || media ? "bg-green-600" : "bg-gray-600"} p-2 rounded-full`}>
                            <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                        </button>
                    </div>
                </div>
            </div>

        </form>
    </div>
}

export default PostSnippet