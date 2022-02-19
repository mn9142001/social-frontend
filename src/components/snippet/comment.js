import Moment from "react-moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useState } from "react"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import Cookies from "js-cookie"
import ReplySection from "./replies-section"
const Comment = (props) => {
    const comment = props.comment
    const [reacted, setReacted] = useState(comment.reacted)
    const [reacts_count, setReactsCount] = useState(comment.reacts > 0 ? comment.reacts : null)
    const [CommentFile, setakg] = useState(comment.media && comment.media.length > 0 ? comment.media[0] : false)
    const [showReplies, setshowReplies] = useState(false)

    const commentReact = () => {
        console.log("clickered")
        const formData = new FormData()
        formData.append('snippetID', comment.id)
        formData.append('_snippet', 2)
        formData.append('_react', 2)
        axios.post('http://192.168.1.9:5000/snippet/react/', formData, {
            headers: {
                Authorization: `Bearer ${Cookies.get('access')}`
            }
        }).then((res) => {
            if (res.status == 200) {
                setReacted(res.data.react)
                setReactsCount(res.data.counts != 0 ? res.data.counts : null)
            }
        })
    }

    return <div className="flex-col w-full sm:w-1/2 mt-5 items-start">
        <div key={comment.id} className="flex w-full mt-5 items-start">
            <div>
                <img src={`http://192.168.1.9:5000${comment.author.avatar}`} className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex flex-col justify-center ml-2">
                <div className="flex flex-col justify-between p-2 rounded-lg bg-gray-700">
                    <a href={`/profile/${comment.author.id}`} className="font-bold text-gray-300 text-xs">{comment.author.name}</a>
                    <div>
                        <p>
                            {comment.content}
                        </p>
                    </div>
                    {comment.media && comment.media.length > 0 ? <div>
                        {CommentFile && ["jpg", "jpeg", "png", "webp", "gif"].some(ext => CommentFile.toLowerCase().endsWith(ext)) ? <img alt="" src={`http://192.168.1.9:5000${CommentFile}`} className="w-full h-32 rounded-md object-fill" /> : CommentFile && ["wembm", "mp4", "mov", "mkv"].some(ext => CommentFile.toLowerCase().endsWith(ext))  ? <video src={`http://192.168.1.9:5000${CommentFile}`} className="w-32 h-32 rounded-md object-fill" alt=""></video> : null}
                    </div> : null}
                </div>
                <div className="flex justify-around">
                    <small>
                        <Moment fromNow>
                            {comment.date}
                        </Moment>
                    </small>
                    <button onClick={commentReact} className="flex justify-center items-center hover:bg-gray-500 rounded-md">
                        <FontAwesomeIcon className={`${reacted ? "text-red-500" : null} ml-1`} icon={faHeart}></FontAwesomeIcon>
                        {reacts_count ? <small className=""> {reacts_count} </small> : null}
                    </button>
                    {!props.reply ? <button onClick={(e) => { setshowReplies(true) }} className="flex text-gray-300 ml-2 items-center">
                        <small>Replies</small>
                    </button> : null}
                </div>
            </div>
        </div>
        {showReplies ? <div>
            <ReplySection commentID = {comment.id} />
        </div> : null}
    </div>
}

export default Comment