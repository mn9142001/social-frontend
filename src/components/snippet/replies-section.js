import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { useState, useRef, useEffect } from "react"
import Comment from "./comment"
import Cookies from "js-cookie"
import axios from "axios"

const ReplySection = (props) => {
    const [content, setContent] = useState()
    const [media, setMedia] = useState()
    const textInput = useRef()
    const mediaInput = useRef()
    const token = Cookies.get('access')
    const [replies, setReplies] = useState()
    useEffect(() => {
        fetch(`http://192.168.1.9:5000/replies/${props.commentID}`, {
            method : 'GET',
            headers: {
                Authorization : `Bearer ${token}`
            }
        }).then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data)
            if(data.comments) setReplies(data.comments)
            
        }).catch((e) => {console.log(e)})
    }, [])


    const submitReply = (e) => {
        e.preventDefault()
        if (!content && !media ) {
            return alert("you can't comment an empty snippet")
        }

        const formData = new FormData()
        formData.append('content', content)
        formData.append('commentID', props.commentID)
        if (media) {formData.append('media', media[0])}
        console.log(media)
        axios.post('http://192.168.1.9:5000/comments/', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': `multipart/form-data`
            },
        }).then((res) => {
                if(res.status === 200){
                    const data = res.data
                    setReplies(pre => {
                        return pre.concat([data.comment])
                    })
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

    return <div className="pb-1 min-w-full justify-end flex-col mt-1 relative">
        {replies ?
            <div className="pb-2">
               { replies.map(reply => {
                return <div key={`comment_${props.commentID}_${reply.id}`} className="flex min-w-full justify-end items-end">
                        <div className="w-11/12">
                        <Comment  reply={true} comment={reply} />
                        </div>
                    </div>
            })}
                </div>
        : null}

        <form onSubmit={submitReply} className="absolute">
            <div className="flex min-w-full">
                <div className="flex  w-full items-center bg-gray-400 rounded-full p-2">
                    <input ref={textInput} onChange={(e) => { setContent(e.target.value) }} className="bg-inherit text-black font-semibold placeholder-black outline-none flex-1 rounded-full px-2" placeholder="what you thinking?" />
                    <label htmlFor="fileInput" className="cursor-pointer">
                        <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>
                    </label>
                    <input ref={mediaInput} onChange={(e) => setMedia(e.target.files)} type={'file'} className="hidden" id="fileInput" multiple />
                </div>
                <div className="flex items-center justify-center px-2">
                    <button className={`flex text-gray-200 items-center justify-center ${content || media ? "bg-green-600" : "bg-gray-600"} p-2 rounded-full`}>
                        <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        </form>
        <br></br>
    </div>
}

export default ReplySection