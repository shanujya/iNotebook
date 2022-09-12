import React from "react";
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const notesInitial = [
        {
            "_id": "631d9bb4b6ca90e4c0f7e2f5",
            "user": "631cafe5b2186d06de4cefdd",
            "title": "me and my",
            "description": "life is beautiful",
            "tag": "Public",
            "date": "2022-09-11T08:26:28.356Z",
            "__v": 0
        },
        {
            "_id": "631d9c4eb6ca90e4c0f7e2f8",
            "user": "631cafe5b2186d06de4cefdd",
            "title": "me and my",
            "description": "life is beautiful",
            "tag": "Public",
            "date": "2022-09-11T08:29:02.534Z",
            "__v": 0
        }
    ]
    
    const [notes, setNotes] = useState(notesInitial)
    return (
        <NoteContext.Provider value={{notes,setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}


export default NoteState;