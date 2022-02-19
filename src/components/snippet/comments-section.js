import { useEffect, useState, useRef } from "react"
import { faCamera, faHeart, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import axios from "axios";
import Comment from "./comment.js";
const CommentsSection = (props) => {
    const token = Cookies.get('access')
    const [_comments, _setComments] = useState(props.comments || false)
    const [content, setContent] = useState()
    const [media, setMedia] = useState()
    const textInput = useRef()
    const mediaInput = useRef()

    useEffect(() => {
        fetch(`http://192.168.1.9:5000/comments/${props.postID}`, {
            method : 'GET',
            headers: {
                Authorization : `Bearer ${token}`
            }
        }).then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data)
            if(data.comments) _setComments(data.comments)
            
        }).catch((e) => {console.log(e)})
    }, [])

    useEffect(() => {
        console.log(media? media[0] : null)
    }, [media])

    const submitComment = (e) => {
        e.preventDefault()
        if (!content && !media ) {
            return alert("you can't comment an empty snippet")
        }

        const formData = new FormData()
        formData.append('content', content)
        formData.append('postID', props.postID)
        if (media) formData.append('media', media[0])
        console.log(media)
        axios.post('http://192.168.1.9:5000/comments/', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': `multipart/form-data`
            },
        }).then((res) => {
                if(res.status === 200){
                    const data = res.data
                    props.setCommentsCount(data.counts)
                    _setComments(pre => {
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

    return <section className="rounded-lg mt-2 flex-col flex">
        <form className="flex items-center justify-around" onSubmit={submitComment}>
            <div className="w-5/6 justify-around flex">
            <div className="flex-1 bg-white flex py-1 rounded-lg text-black justify-around">
                
                <div className="flex flex-1">
                    <input ref={textInput} onChange={(e) => {setContent(e.target.value)}} className="outline-none ml-1 bg-transparent flex-1" />
                </div>
                <div className="justify-center flex pr-2">
                    
                    <label htmlFor="comment-form"><FontAwesomeIcon icon={faCamera}></FontAwesomeIcon></label>
                    <input ref={mediaInput} onChange={(e) => {setMedia(e.target.files)}} type={"file"} id="comment-form" className="hidden" />
                </div>
            </div>
            </div>
        </form>
        <br></br>

        {_comments ? <div>
                {_comments.map(comment => {
               return  <Comment key={`${props.postID}_${comment.id}`} commentID = {comment.ID} comment={comment} />
           })}
           
            </div>
         : null}
    </section>
}

export default CommentsSection