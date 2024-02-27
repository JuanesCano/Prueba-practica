import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Modal } from "react-bootstrap";

const initialState = {
  name: "",
};

export const ModalActions = ({
  show,
  handleClose,
  getCategories,
  isEdit,
  categoryEdit,
  resetState,
}) => {
  const [formState, setFormState] = useState(initialState);

  //verificamos si se quiere editar la categoria
  useEffect(() => {
    isEdit ? setFormState({ ...categoryEdit }) : setFormState(initialState);
  }, [isEdit, categoryEdit]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit ? `/category/${categoryEdit._id}` : "/category";

      const method = isEdit ? "put" : "post";

      const { data } = await axios[method](url, formState);

      Swal.fire({
        position: "center",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      });

      await getCategories();
      resetState();
      handleClose();
    } catch (error) {
      if (!error.response.data.ok) {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: true,
        });
      }
      console.log("error en handleSubmit", error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Actualizar categoria" : "Crear Categoria"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre categoria</Form.Label>
            <Form.Control
              required
              name="name"
              placeholder="nombre categoria"
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <button className="btn btn-primary" type="submit">
            {isEdit ? "Actualizar" : "Crear"}
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
