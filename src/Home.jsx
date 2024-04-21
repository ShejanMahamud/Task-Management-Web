import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { BsClipboard2Check } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import ReactPaginate from 'react-paginate';
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const Home = () => {

  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 3;
const offset = currentPage * itemsPerPage;
const paginatedItems = tasks.slice(offset, offset + itemsPerPage);

  useEffect(() => {
    fetch("http://localhost:2120/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, [tasks]);

  useEffect(() => {
    const completedTasks = tasks.filter((task) => task.status);
    setCompleted(completedTasks.length);
  }, [tasks]);

  const handleTaskAdd = (e) => {
    e.preventDefault();

    const task = e.target.task.value;
    const status = false;
    const tasks = { task, status };
    fetch("http://localhost:2120/tasks", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(tasks),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          toast.success("Task Added Successfully!");
          navigate("/");
          e.target.reset();
        }
      });
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:2120/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          const remaining = tasks.filter((task) => task._id !== id);
          setTasks(remaining);
          toast.success("Successfully Deleted!");
        }
      });
  };

  const handleMarkComplete = (id) => {
    const status = { status: true };

    fetch(`http://localhost:2120/tasks/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(status),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          toast.success("Marked as Completed!");
          navigate("/");
        }
      });
  };

  const handleUpdateTask = (e, id) => {
    e.preventDefault();
    const taskText = e.target.taskText.value;

    fetch(`http://localhost:2120/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ task: taskText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          toast.success("Updated Successfully!");
          navigate("/");
        }
      });
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="bg-[#0D0714] w-full mx-auto min-h-screen flex flex-col items-center justify-center font-raleway">
      <h1 className="text-3xl font-medium text-white my-5">Task Machine</h1>
      <form
        onSubmit={handleTaskAdd}
        className="flex items-center justify-center gap-5 w-[60%] mx-auto"
      >
        <input
          type="text"
          placeholder="Write Task..."
          required
          name="task"
          className="border border-[#3E1671] rounded-md placeholder:text-[#777] bg-transparent px-5 py-3 w-full focus:outline-none text-white"
        />
        <button className="bg-[#9E78CF] px-5 py-3 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M19.25 11C19.25 11.1823 19.1776 11.3572 19.0486 11.4861C18.9197 11.6151 18.7448 11.6875 18.5625 11.6875H11.6875V18.5625C11.6875 18.7448 11.6151 18.9197 11.4861 19.0486C11.3572 19.1776 11.1823 19.25 11 19.25C10.8177 19.25 10.6428 19.1776 10.5139 19.0486C10.3849 18.9197 10.3125 18.7448 10.3125 18.5625V11.6875H3.4375C3.25516 11.6875 3.0803 11.6151 2.95136 11.4861C2.82243 11.3572 2.75 11.1823 2.75 11C2.75 10.8177 2.82243 10.6428 2.95136 10.5139C3.0803 10.3849 3.25516 10.3125 3.4375 10.3125H10.3125V3.4375C10.3125 3.25516 10.3849 3.0803 10.5139 2.95136C10.6428 2.82243 10.8177 2.75 11 2.75C11.1823 2.75 11.3572 2.82243 11.4861 2.95136C11.6151 3.0803 11.6875 3.25516 11.6875 3.4375V10.3125H18.5625C18.7448 10.3125 18.9197 10.3849 19.0486 10.5139C19.1776 10.6428 19.25 10.8177 19.25 11Z"
              fill="white"
            />
          </svg>
        </button>
      </form>
      <div className="w-[60%] mx-auto mt-20 flex items-center justify-between">
        <div className="w-full flex items-center gap-3">
          <span className="text-white font-medium text-lg">Task Created</span>
          <span className="bg-[#9E78CF] h-7 w-7 text-white font-bold rounded-full flex items-center justify-center">
            {tasks.length}
          </span>
        </div>
        <div className="w-full flex items-center gap-3 justify-end">
          <span className="text-white font-medium text-lg">Task Completed</span>
          <span className="bg-[#9E78CF] px-4 py-2 text-white font-bold rounded-full flex items-center justify-center">
            {completed} of {tasks.length}
          </span>
        </div>
      </div>
      <div className="w-[60%] mx-auto flex flex-col items-center justify-center my-10">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center w-full flex-col gap-5">
            <BsClipboard2Check className="text-5xl text-[#9E78CF]" />
            <span className="text-lg text-white font-medium">
              No Tasks Added!
            </span>
          </div>
        ) : (
            paginatedItems.map((task) => (
            <form
              onSubmit={(e) => handleUpdateTask(e, task._id)}
              key={task._id}
              className="bg-[#15101C] w-full px-5 py-4 rounded-lg  font-medium flex items-center justify-between my-2"
            >
              <input
                type="text"
                defaultValue={task.task}
                name="taskText"
                className={`w-full bg-transparent focus:outline-none focus:bg-transparent text-[#9E78CF] text-lg ${
                  task.status && "line-through"
                }`}
                disabled={task.status ? true : false}
                data-tooltip-id="edit"
                data-tooltip-content="Edit Task"
              />
              <div className="w-full flex items-center gap-5 justify-end">
                <button
                  data-tooltip-id="update"
                  data-tooltip-content="Update Task"
                  type="submit"
                  className="text-[#9E78CF] text-lg"
                  disabled={task.status ? true : false}
                >
                  <RxUpdate />
                </button>
                <button
                  data-tooltip-id="complete"
                  data-tooltip-content="Mark as Complete"
                  type="button"
                  onClick={() => handleMarkComplete(task._id)}
                  disabled={task.status ? true : false}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                  >
                    <path
                      d="M19.7851 6.67391L8.78513 17.6739C8.72128 17.7378 8.64546 17.7885 8.56199 17.8231C8.47853 17.8577 8.38907 17.8755 8.29872 17.8755C8.20837 17.8755 8.11891 17.8577 8.03545 17.8231C7.95199 17.7885 7.87617 17.7378 7.81232 17.6739L2.99982 12.8614C2.87081 12.7324 2.79834 12.5574 2.79834 12.375C2.79834 12.1926 2.87081 12.0176 2.99982 11.8886C3.12882 11.7596 3.30378 11.6871 3.48622 11.6871C3.66866 11.6871 3.84363 11.7596 3.97263 11.8886L8.29872 16.2155L18.8123 5.70109C18.9413 5.57209 19.1163 5.49962 19.2987 5.49962C19.4812 5.49962 19.6561 5.57209 19.7851 5.70109C19.9141 5.8301 19.9866 6.00506 19.9866 6.1875C19.9866 6.36994 19.9141 6.5449 19.7851 6.67391Z"
                      fill="#9E78CF"
                    />
                  </svg>
                </button>
                <button
                  data-tooltip-id="delete"
                  data-tooltip-content="Delete Task"
                  onClick={() => handleDeleteTask(task._id)}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                  >
                    <path
                      d="M18.6112 4.125H3.48621C3.30387 4.125 3.129 4.19743 3.00007 4.32636C2.87114 4.4553 2.79871 4.63016 2.79871 4.8125C2.79871 4.99484 2.87114 5.1697 3.00007 5.29864C3.129 5.42757 3.30387 5.5 3.48621 5.5H4.17371V17.875C4.17371 18.2397 4.31857 18.5894 4.57643 18.8473C4.8343 19.1051 5.18403 19.25 5.54871 19.25H16.5487C16.9134 19.25 17.2631 19.1051 17.521 18.8473C17.7788 18.5894 17.9237 18.2397 17.9237 17.875V5.5H18.6112C18.7935 5.5 18.9684 5.42757 19.0973 5.29864C19.2263 5.1697 19.2987 4.99484 19.2987 4.8125C19.2987 4.63016 19.2263 4.4553 19.0973 4.32636C18.9684 4.19743 18.7935 4.125 18.6112 4.125ZM16.5487 17.875H5.54871V5.5H16.5487V17.875ZM6.92371 2.0625C6.92371 1.88016 6.99614 1.7053 7.12507 1.57636C7.254 1.44743 7.42887 1.375 7.61121 1.375H14.4862C14.6685 1.375 14.8434 1.44743 14.9723 1.57636C15.1013 1.7053 15.1737 1.88016 15.1737 2.0625C15.1737 2.24484 15.1013 2.4197 14.9723 2.54864C14.8434 2.67757 14.6685 2.75 14.4862 2.75H7.61121C7.42887 2.75 7.254 2.67757 7.12507 2.54864C6.99614 2.4197 6.92371 2.24484 6.92371 2.0625Z"
                      fill="#9E78CF"
                    />
                  </svg>
                </button>
              </div>
            </form>
          ))
        )}
      </div>

      {
        tasks.length > 0 && (
            <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={Math.ceil(tasks.length / itemsPerPage)}
        marginPagesDisplayed={5}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={
          "flex justify-center gap-3 items-center font-poppins text-xs"
        }
        activeClassName={
          "bg-transparent border border-[#9E78CF] text-white rounded-lg font-medium py-2"
        }
        pageLinkClassName={
          "bg-transparent text-white rounded-lg font-medium px-3 py-2"
        }
        previousLinkClassName={
          "bg-[#15101C] text-white lg:px-4 px-3 text-xs lg:text-base py-2 rounded-lg font-medium"
        }
        nextLinkClassName={
          "bg-[#15101C] text-white lg:px-4 px-3 text-xs lg:text-base py-2 rounded-lg font-medium"
        }
        disabledClassName={"pointer-events-none opacity-50"}
      />
        )
      }
      <Toaster position="top-right" reverseOrder={true} />
      <Tooltip id="update" />
      <Tooltip id="delete" />
      <Tooltip id="complete" />
      <Tooltip id="edit" />
    </div>
  );
};

export default Home;
