import Moment from "react-moment"
import { useEffect, useState } from "react"
const PostTop = (props) => {
    const post = props.post
    const [postFile, setPostFile] = useState(post.media && post.media.length > 0 ? post.media[0] : false)

    return <div className={`flex rounded-md rounded-b-none border-2 border-gray-400 flex-col bg-gray-800 text-white p-3 justify-center`}>
        <div className="flex flex-row">
            <div className="flex-row flex">
                <div>
                    <img src={`http://192.168.1.9:5000${post.author.avatar}`} alt="" className="rounded-full w-12 h-12" />
                </div>
                <div className="flex flex-col">
                    <div className="ml-2">
                        <h3 className="font-bold">
                            <a href={`/profile/${post.author.id}`}>{post.author.name}</a>
                        </h3>
                    </div>
                    <div className="ml-2">
                        <small>
                            <Moment fromNow>{post.date}</Moment>
                        </small>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex justify-end items-start">
                <button className="text-white hover:text-gray-500">...</button>
            </div>
        </div>
        <br />
        <div>
            <p>{post.content}</p>
        </div>
        {postFile && !props.Toshare ? <div className="flex-col flex min-w-full">
            <br></br>
            <div>
                {postFile && ["jpg", "jpeg", "png", "webp", "gif"].some(ext => postFile.toLowerCase().endsWith(ext)) ? <img alt="" src={`http://192.168.1.9:5000${postFile}`} className="w-full h-96 rounded-md object-cover" /> : postFile && ["wembm", "mp4", "mov", "mkv"].some(ext => postFile.toLowerCase().endsWith(ext)) ? <video src={`http://192.168.1.9:5000${postFile}`} alt=""></video> : null}
            </div><br></br>
            <div className="flex justify-center">
                {post.media.map((file, key) => {
                    return <div key={key} className="flex justify-center px-2">
                        <button disabled={file === postFile} onClick={(e) => { setPostFile(file) }} className={`w-2 h-2 rounded-full ${file === postFile ? "bg-white" : "bg-gray-600 hover:bg-gray-500"}`}></button>
                    </div>
                })}
            </div>
        </div>
            : null}
    </div>
}

export default PostTop