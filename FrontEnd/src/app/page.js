"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [todo, setTodo] = useState([]);
  const [left, setLeft] = useState([]);
  const [control, setControl] = useState(true);
  const [dark, setDark] = useState("");
  const [cargando, setCargando] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const changeMode = () => {
    if (control) {
      setDark("dark");
      setControl(false);
    } else {
      setDark("");
      setControl(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiURL}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const data = await response.json();
        setTodo(data.meta.tareas);

        setCargando(false);
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
      }
    };
    fetchData();
  }, [refresh, apiKey, apiURL]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    const leftFilter = todo?.filter((left) => !left.completed);
    setLeft(leftFilter);
  }, [todo]);

  var filteredTodos = todo?.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
  });

  const deleteOne = async (id) => {
    setTodo((prevTodo) => prevTodo.filter((task) => task.id !== id));

    try {
      const urlId = `${apiURL}/${id}`;

      const response = await fetch(urlId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        console.log("Eliminado Correctamente");
      } else {
        console.error("Error al eliminar el todo");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  const deleteCompleted = () => {
    const completedTasks = todo.filter((check) => check.completed === true);
    const activeTasks = todo.filter((check) => check.completed === false);

    completedTasks.forEach(async (task) => {
      if (task.id) {
        try {
          const urlId = `${apiURL}/${task.id}`;
          const response = await fetch(urlId, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          });

          if (!response.ok) {
            console.error("Error al eliminar el todo");
          }
        } catch (error) {
          console.error("Error al hacer la solicitud:", error);
        }
      }
    });

    setTodo(activeTasks);
  };

  const handleClickLink = (id) => {
    const taskFilter = todo.filter((task) => task.id === id);
    localStorage.setItem("taskData", JSON.stringify(taskFilter));
  };  

  const handleCheck = async (id) => {

    const apiUrlMod = `${apiURL}/${id}`;
    const taskIndex = todo.findIndex(tarea => tarea.id === id);

    const newTodo = {      
      title: todo[taskIndex].title,
      description: todo[taskIndex].description,
      completed: !todo[taskIndex].completed,
    };

    try {
      const response = await fetch(apiUrlMod, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {

        setTodo((prevTodo) =>
          prevTodo.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      } else {
        console.error("Error al modificar la tarea");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">Cargando...</p>
      </div>
    );
  }
  if (!todo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">No hay tareas</p>
      </div>
    );
  }

  return (
    <>
      <main
        className={`bg-veryLightGrayishBlue flex flex-col min-h-screen ${dark} dark:bg-veryDarkBlue`}
      >
        <div className='bg-[url("/bg-mobile-light.jpg")] dark:bg-[url("/bg-mobile-dark.jpg")] xl:bg-[url("/bg-desktop-light.jpg")] xl:dark:bg-[url("/bg-desktop-dark.jpg")] bg-no-repeat bg-cover h-[200px] px-5 flex flex-col justify-evenly py-3 md:px-[31%] md:h-[260px] md:pt-0'>
          <div className=" flex justify-between items-baseline ml-1 sm:mt-2">
            <h1 className="text-white text-[26px] font-bold uppercase tracking-[10px] md:text-[34px] md:-mb-10">
              Todo
            </h1>
            <Image
              onClick={changeMode}
              className="w-5 h-5"
              src={control ? "/icon-moon.svg" : "/icon-sun.svg"}
              alt="icono"
              width={25}
              height={25}
            />
          </div>
          <div className="w-full bg-white h-12 rounded-sm flex gap-4 items-center dark:bg-veryDarkDesaturatedBlue md:h-[58px] ">
            <div className="w-full flex items-center mx-6">
              <Link
                href={"/TaskForm"}
                className="text-[16px] text-darkGrayishBlue  "
              >
                Create a new ToDo...
              </Link>
            </div>
          </div>
        </div>

        <div className="min-h-96 flex flex-col justify-between">
          <div>
            <div className="px-5 -mt-6 md:px-[31%] md:-mt-12 ">
              {filteredTodos.map((task) => (
                <div
                  key={task.id}
                  className="w-full first-of-type:rounded-t-sm bg-white min-h-12 flex gap-4 items-center border dark:bg-veryDarkDesaturatedBlue dark:text-lightGrayishBlueDark border-t-0 border-x-0 dark:border-b-1 dark:border-darkGrayishBlueDark md:h-[58px] "
                >
                  <div
                    onClick={() => handleCheck(task.id)}
                    className={`h-6 w-full max-w-6 border-[1px] rounded-full ml-5 flex justify-center items-center border-lightGrayishBlueDarkHover dark:border-veryDarkGrayishBlue hover:border-darkGrayishBlue dark:hover:border-lightGrayishBlueDarkHover ${
                      task.completed
                        ? "bg-gradient-to-br from-cyan-300 to-purple-600"
                        : ""
                    }`}
                  >
                    {task.completed && (
                      <Image
                        className="fill-black"
                        src="/icon-check.svg"
                        alt={task.completed ? "icon check" : null}
                        width={15}
                        height={15}
                      />
                    )}
                  </div>
                  <Link
                    href={`/TaskItem/${task.id}`}
                    onClick={() => handleClickLink(task.id)}
                    className={`text-xs truncate w-[2000px] text-wrap  ${
                      task.completed
                        ? "text-darkGrayishBlue line-through dark:fill-veryLightGrayishBlue"
                        : "text-veryDarkGrayishBlue dark:text-lightGrayishBlueDark"
                    } sm:text-[16px]`}
                  >
                    {" "}
                    {task.title}{" "}
                  </Link>
                  <button
                    onClick={() => deleteOne(task.id)}
                    className="w-full flex justify-end mr-5"
                  >
                    <svg
                      className="scale-75 dark:fill-darkGrayishBlue"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="w-full rounded-b-sm bg-white h-12 flex items-center border justify-between px-6 dark:bg-veryDarkDesaturatedBlue dark:border-0">
                <p className="text-xs text-darkGrayishBlue hover:text-veryDarkBlue dark:hover:text-lightGrayishBlueDarkHover">
                  {" "}
                  {left.length} items left{" "}
                </p>
                <button onClick={deleteCompleted}>
                  <p className="text-xs text-darkGrayishBlue hover:text-veryDarkBlue dark:hover:text-lightGrayishBlueDarkHover">
                    Clear Completed
                  </p>
                </button>
              </div>
            </div>

            <div className="p-5 mt-5 md:px-[31%]">
              <div className="w-full rounded-md bg-white h-12 flex items-center border justify-between px-2 dark:bg-veryDarkDesaturatedBlue dark:border-0 xl:bg-transparent xl:justify-center xl:dark:bg-transparent">
                <ul className="w-full flex justify-between px-12 gap-2 text-darkGrayishBlue font-bold text-sm md:px-1 xl:relative xl:justify-center xl:mb-50 xl:gap-4 xl:inline-flex text-center bottom-[88px] xl:w-[50%] ">
                  <button onClick={() => handleFilterChange("all")}>
                    <li className=" hover:text-veryDarkBlue dark:hover:text-lightGrayishBlueDarkHover">
                      All
                    </li>
                  </button>
                  <button onClick={() => handleFilterChange("active")}>
                    <li className=" hover:text-veryDarkBlue dark:hover:text-lightGrayishBlueDarkHover">
                      Active
                    </li>
                  </button>
                  <button onClick={() => handleFilterChange("completed")}>
                    <li className=" hover:text-veryDarkBlue dark:hover:text-lightGrayishBlueDarkHover">
                      Completed
                    </li>
                  </button>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className={`bg-veryLightGrayishBlue p-5 dark:bg-veryDarkBlue ${dark} dark:text-veryDarkGrayishBlueDark md:text-center`}
      >
        <div className="attribution text-xs dark:border-0">
          Challenge by{" "}
          <p>
            Academia ForIT
          </p>
          . Coded by{" "}
          <a href="https://www.linkedin.com/in/alejandro-elias-full-stack/">
            Alejandro Elias
          </a>
          .
        </div>
      </footer>
    </>
  );
}
