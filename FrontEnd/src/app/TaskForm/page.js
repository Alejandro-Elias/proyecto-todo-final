"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function Page() {
  const [error, setError] = useState({});
  const [control, setControl] = useState(true);
  const [dark, setDark] = useState("");

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

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Debe ingresar un titulo"),
    description: Yup.string().required("Debe ingresar una descripcion"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {

    const newTodo = {
      title: values.title,
      description: values.description,
      completed: false,
      createdAt: new Date(),
    };

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tarea guardada correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.errors);
        console.error("Error al guardar el todo");
        console.log(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main
        className={`bg-veryLightGrayishBlue flex flex-col min-h-screen ${dark} dark:bg-veryDarkBlue`}
      >
        <div className='bg-[url("/bg-mobile-light.jpg")] dark:bg-[url("/bg-mobile-dark.jpg")] xl:bg-[url("/bg-desktop-light.jpg")] xl:dark:bg-[url("/bg-desktop-dark.jpg")] bg-no-repeat bg-cover h-[200px] px-5 flex flex-col justify-evenly py-3 md:px-[31%] md:h-[260px] md:pt-16'>
          <Link href={"/"} className="text-white ml-[-30px] mb-6 ">
            <span className="text-3xl">←</span> Back
          </Link>
          <div className=" flex justify-between items-baseline ml-1">
            <h1 className="text-white text-[26px] font-bold uppercase tracking-[10px] md:text-[34px] md:-mb-10">
              New Todo
            </h1>
            <Image
              onClick={changeMode}
              className="w-5 h-5 cursor-pointer"
              src={control ? "/icon-moon.svg" : "/icon-sun.svg"}
              alt="icono"
              width={25}
              height={25}
            />
          </div>

          <Formik
            initialValues={{ title: "", description: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-80">
                <div className="w-full bg-white h-12 rounded-sm flex items-center dark:bg-veryDarkDesaturatedBlue md:h-[58px] px-3 mt-[72px]">
                  <Field
                    type="text"
                    name="title"
                    className="border-0 active:border-0 focus:border-0 outline-none placeholder:text-[16px] dark:bg-veryDarkDesaturatedBlue sm:text-[16px] dark:sm:text-lightGrayishBlueDark w-80 cursor-text "
                    placeholder="Title:"
                  />
                </div>
                <ErrorMessage name="title" />
                <div className="w-full bg-white h-12 rounded-sm flex items-center dark:bg-veryDarkDesaturatedBlue md:h-[58px] px-3 mt-6">
                  <Field
                    as="textarea"
                    name="description"
                    className="border-0 active:border-0 focus:border-0 outline-none placeholder:text-[16px] dark:bg-veryDarkDesaturatedBlue sm:text-[16px] dark:sm:text-lightGrayishBlueDark w-80 resize-none cursor-text "
                    placeholder="Description:"
                  />
                </div>
                <ErrorMessage name="description" />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex justify-center bg-blue-500 dark:bg-white dark:text-black px-2 h-8 rounded-md text-white items-center cursor-pointer mt-2"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </div>
                <div>
                  {Object.entries(error).map(([field, err]) => (
                    <p key={field} className="text-red-600 mt-4">
                      {err.message}
                    </p>
                  ))}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>

      <footer
        className={`bg-veryLightGrayishBlue p-5 dark:bg-veryDarkBlue ${dark} dark:text-veryDarkGrayishBlueDark md:text-center`}
      >
        <div className="attribution text-xs dark:border-0">
          <p>Challenge by</p>
          <p>Academia ForIT</p>
          <p>
            Coded by{" "}
            <a href="https://www.linkedin.com/in/alejandro-elias-full-stack/">
              Alejandro Elias
            </a>
          </p>
          .
        </div>
      </footer>
    </>
  );
}
