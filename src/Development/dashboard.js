import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api_base_url } from "../helper"

// You'll need to replace these with actual image imports or URLs
const codeImgUrl = "/placeholder.svg?height=80&width=80"
const deleteImgUrl = "/placeholder.svg?height=30&width=30"

const ListCard = ({ item }) => {
  const navigate = useNavigate()
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false)

  const deleteProj = (id) => {
    fetch(api_base_url + "/deleteProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progId: id,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsDeleteModelShow(false)
          window.location.reload()
        } else {
          alert(data.message)
          setIsDeleteModelShow(false)
        }
      })
  }

  return (
    <>
      <div className="list-card" onClick={() => navigate(`/editior/${item._id}`)}>
        <img className="code-img" src={codeImgUrl || "/placeholder.svg"} alt="" />
        <div className="card-content">
          <h3>{item.title}</h3>
          <p>Created in {new Date(item.date).toDateString()}</p>
        </div>
        <img
          className="delete-img"
          src={deleteImgUrl || "/placeholder.svg"}
          alt="Delete"
          onClick={(e) => {
            e.stopPropagation()
            setIsDeleteModelShow(true)
          }}
        />
      </div>

      {isDeleteModelShow && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-content">
              <h3>
                Do you want to delete <br /> this project?
              </h3>
              <div className="modal-actions">
                <button onClick={() => deleteProj(item._id)}>Delete</button>
                <button onClick={() => setIsDeleteModelShow(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .list-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          background-color: #141414;
          cursor: pointer;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: background-color 0.3s;
        }

        .list-card:hover {
          background-color: #202020;
        }

        .code-img {
          width: 80px;
          height: 80px;
          margin-right: 16px;
        }

        .card-content h3 {
          font-size: 20px;
          margin: 0;
          color: white;
        }

        .card-content p {
          font-size: 14px;
          color: gray;
          margin: 0;
        }

        .delete-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
          margin-left: 16px;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal {
          background-color: #141414;
          border-radius: 8px;
          padding: 20px;
          width: 25vw;
        }

        .modal-content h3 {
          font-size: 24px;
          color: white;
          margin-bottom: 20px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .modal-actions button {
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          width: 49%;
          border: none;
          color: white;
        }

        .modal-actions button:first-child {
          background-color: #FF4343;
        }

        .modal-actions button:last-child {
          background-color: #1A1919;
        }
      `}</style>
    </>
  )
}

export default ListCard

