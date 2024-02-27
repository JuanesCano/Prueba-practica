import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { ModalActions } from "../components/categories/ModalActions";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryEdit, setCategoryEdit] = useState({});

  //obtenemos todas las categorias desde el back
  const getCategories = async () => {
    try {
      const { data } = await axios.get("/category");
      setCategories(data.data);
    } catch (error) {
      console.log("error en getCategories", error.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  //manejar el modal
  const [show, setShow] = useState(false);

  const handleClose = () => {
    resetState();
    setShow(false);
  };

  const handleShow = () => setShow(true);

  //manejar estado cuando se quiere editar
  const handleEdit = (category) => {
    setIsEdit(true);
    setCategoryEdit(category);
    handleShow();
  };

  //reset el state cuando se edite
  const resetState = () => {
    setIsEdit(false);
    setCategoryEdit({});
  };

  //eliminar categoria
  const deleteCategory = (id) => {
    try {
      Swal.fire({
        title: "Estas seguro que quieres eliminar la categoria",
        text: "No prodras revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { data } = await axios.delete(`/category/${id}`);
            Swal.fire({
              title: data.message,
              icon: "success",
              timer: 2000,
            });

            await getCategories();
          } catch (error) {
            if (!error.response.data.ok) {
              return Swal.fire({
                position: "center",
                icon: "error",
                title: error.response.data.message,
                showConfirmButton: true,
              });
            }
            console.log("error en deleteCategories", error.message);
          }
        }
      });
    } catch (error) {
      console.log("error en deleteCategories", error.message);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary" onClick={() => handleShow()}>
        Crear categoria
      </button>

      <Table responsive striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>
                <div>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteCategory(item._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalActions
        show={show}
        handleClose={handleClose}
        getCategories={getCategories}
        isEdit={isEdit}
        categoryEdit={categoryEdit}
        resetState={resetState}
      />
    </div>
  );
};
